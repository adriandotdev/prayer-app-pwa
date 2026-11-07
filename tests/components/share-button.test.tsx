// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ShareButton } from "@/components/share/share-button";

const createShare = vi.fn();
const revokeShare = vi.fn();
vi.mock("@/lib/shares/actions", () => ({
  createShare: (fd: FormData) => createShare(fd),
  revokeShare: (fd: FormData) => revokeShare(fd),
}));

const TOKEN = "0123456789abcdef0123456789abcdef";

beforeEach(() => {
  createShare.mockReset();
  createShare.mockResolvedValue({ ok: true, token: TOKEN });
  revokeShare.mockReset();
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("ShareButton", () => {
  it("creates a link on first open and shows it", async () => {
    createShare.mockResolvedValue({ ok: true, token: TOKEN });
    render(<ShareButton kind="prayer" id="00000000-0000-4000-8000-000000000001" title="Hail Holy Queen" token={null} />);

    await userEvent.click(screen.getByRole("button", { name: /share/i }));

    const input = await screen.findByLabelText(/link to this prayer/i);
    expect(input).toHaveValue(`${window.location.origin}/s/${TOKEN}`);
    expect(createShare).toHaveBeenCalledTimes(1);
    const sent = createShare.mock.calls[0][0] as FormData;
    expect(sent.get("kind")).toBe("prayer");
  });

  it("reuses an existing link and refreshes its colours", async () => {
    render(<ShareButton kind="collection" id="00000000-0000-4000-8000-000000000002" title="Morning" token={TOKEN} />);
    await userEvent.click(screen.getByRole("button", { name: /share/i }));
    expect(await screen.findByLabelText(/link to this collection/i)).toHaveValue(`${window.location.origin}/s/${TOKEN}`);
    // The same server action returns the existing token and updates its season.
    await waitFor(() => expect(createShare).toHaveBeenCalledTimes(1));
  });

  it("sends the sharer's saved liturgical season with the link", async () => {
    localStorage.setItem("ora-season", "violet");
    render(<ShareButton kind="prayer" id="00000000-0000-4000-8000-000000000001" title="Prayer" token={null} />);
    await userEvent.click(screen.getByRole("button", { name: /share/i }));
    await screen.findByLabelText(/link to this prayer/i);
    expect((createShare.mock.calls[0][0] as FormData).get("season")).toBe("violet");
  });

  it("offers only Copy link when the device has no share sheet", async () => {
    vi.stubGlobal("navigator", { ...navigator, share: undefined });
    render(<ShareButton kind="prayer" id="00000000-0000-4000-8000-000000000001" title="Prayer" token={TOKEN} />);
    await userEvent.click(screen.getByRole("button", { name: /^share$/i }));
    expect(await screen.findByRole("button", { name: /copy link/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /share…/i })).not.toBeInTheDocument();
  });

  it("stops sharing and closes the sheet", async () => {
    revokeShare.mockResolvedValue({ ok: true });
    render(<ShareButton kind="prayer" id="00000000-0000-4000-8000-000000000001" title="Prayer" token={TOKEN} />);
    await userEvent.click(screen.getByRole("button", { name: /^share$/i }));
    await userEvent.click(await screen.findByRole("button", { name: /stop sharing/i }));

    await waitFor(() => expect(revokeShare).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByLabelText(/link to this prayer/i)).not.toBeInTheDocument());
  });
});

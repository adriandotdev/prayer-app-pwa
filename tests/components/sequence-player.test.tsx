// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SequencePlayer } from "@/components/sequence/sequence-player";
import { fixtureSequence } from "./fixture";

beforeEach(() => {
  localStorage.clear();
  // jsdom has no matchMedia; the player's desktop and reduced-motion hooks need it.
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

function setup(props: { initialIndex?: number; initialMode?: "learn" | "pray" } = {}) {
  const onFinish = vi.fn();
  const onExit = vi.fn();
  render(
    <SequencePlayer
      sequence={fixtureSequence}
      initialIndex={props.initialIndex ?? 0}
      initialMode={props.initialMode ?? "pray"}
      onFinish={onFinish}
      onExit={onExit}
    />,
  );
  return { onFinish, onExit, user: userEvent.setup() };
}

describe("SequencePlayer", () => {
  it("starts at the first step with Back disabled", () => {
    setup();
    expect(screen.getByRole("heading", { name: "Sign of the Cross" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back/ })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Opening: Sign of the Cross, step 1 of 4");
  });

  it("advances and goes back with the buttons", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: /Next/ }));
    expect(await screen.findByRole("heading", { name: "Our Father" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("step 2 of 4");

    await user.click(screen.getByRole("button", { name: /Back/ }));
    expect(await screen.findByRole("heading", { name: "Sign of the Cross" })).toBeInTheDocument();
  });

  it("moves with the arrow keys", async () => {
    const { user } = setup();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("step 2 of 4");
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("status")).toHaveTextContent("step 1 of 4");
  });

  it("shows Finish on the last step and calls onFinish instead of advancing", async () => {
    const { onFinish, user } = setup({ initialIndex: 3 });
    expect(screen.queryByRole("button", { name: /Next/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Finish/ }));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("step 4 of 4");
  });

  it("clamps an out-of-range initial index", () => {
    setup({ initialIndex: 99 });
    expect(screen.getByRole("status")).toHaveTextContent("step 4 of 4");
  });

  it("toggles Learn and Pray with aria-pressed and only teaches in Learn", async () => {
    const { user } = setup({ initialIndex: 1, initialMode: "pray" });
    expect(screen.getByRole("button", { name: "Pray" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("Learn about the Our Father.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Learn" }));
    expect(screen.getByRole("button", { name: "Learn" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Pray" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Learn about the Our Father.")).toBeInTheDocument();
  });

  it("ignores arrow keys typed into an input", async () => {
    const { user } = setup();
    const input = document.createElement("input");
    document.body.append(input);
    input.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("step 1 of 4");
    input.remove();
  });

  it("saves progress as it moves", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: /Next/ }));
    const saved = JSON.parse(localStorage.getItem("ora:progress:v1") ?? "null");
    expect(saved).toMatchObject({ sequenceId: "test:tiny", index: 1, mode: "pray", completed: false });
  });

  it("calls onExit from Leave", async () => {
    const { onExit, user } = setup();
    await user.click(screen.getByRole("button", { name: "Leave" }));
    expect(onExit).toHaveBeenCalledTimes(1);
  });
});

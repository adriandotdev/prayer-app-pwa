// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BeadTracker } from "@/components/sequence/bead-tracker";
import { fixtureSequence } from "./fixture";

function setup(index: number) {
  const onSelectBead = vi.fn();
  render(<BeadTracker sequence={fixtureSequence} index={index} onSelectBead={onSelectBead} />);
  return { onSelectBead, user: userEvent.setup() };
}

describe("BeadTracker", () => {
  it("describes the current step on the group", () => {
    setup(1);
    expect(screen.getByRole("group", { name: /Currently on Our Father, step 2 of 4/ })).toBeInTheDocument();
  });

  it("labels each bead completed, current or upcoming", () => {
    setup(1);
    expect(screen.getByRole("button", { name: "Crucifix, completed" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Large bead, current" })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: "Small bead, upcoming" })).not.toHaveAttribute("aria-current");
  });

  it("keeps a bead current until its last step passes", () => {
    setup(2);
    // Steps 3 and 4 share the small bead, so it is still current on step 3.
    expect(screen.getByRole("button", { name: "Small bead, current" })).toBeInTheDocument();
  });

  it("makes only the current bead a tab stop", () => {
    setup(1);
    expect(screen.getByRole("button", { name: "Large bead, current" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: "Crucifix, completed" })).toHaveAttribute("tabindex", "-1");
  });

  it("selects a bead on click, Enter and Space", async () => {
    const { onSelectBead, user } = setup(0);
    await user.click(screen.getByRole("button", { name: "Small bead, upcoming" }));
    expect(onSelectBead).toHaveBeenLastCalledWith("b2");

    screen.getByRole("button", { name: "Large bead, upcoming" }).focus();
    await user.keyboard("{Enter}");
    expect(onSelectBead).toHaveBeenLastCalledWith("b1");
    await user.keyboard(" ");
    expect(onSelectBead).toHaveBeenCalledTimes(3);
  });

  it("moves focus with arrow, Home and End keys", async () => {
    const { user } = setup(1);
    const [first, second, third] = screen.getAllByRole("button");
    second.focus();

    await user.keyboard("{ArrowRight}");
    expect(third).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(third).toHaveFocus(); // clamped at the end
    await user.keyboard("{Home}");
    expect(first).toHaveFocus();
    await user.keyboard("{End}");
    expect(third).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(second).toHaveFocus();
  });
});

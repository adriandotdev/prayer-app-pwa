// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LiturgicalDayCard } from "@/components/home/liturgical-day-card";

function setOnline(value: boolean) {
  Object.defineProperty(navigator, "onLine", { configurable: true, value });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 3, 5, 10)); // Easter Sunday 2026
  setOnline(true);
});

afterEach(() => {
  vi.useRealTimers();
  setOnline(true);
});

describe("LiturgicalDayCard", () => {
  it("renders only a skeleton on the server", () => {
    const html = renderToString(<LiturgicalDayCard />);
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("Easter");
    expect(html).not.toContain("usccb");
  });

  it("shows today's day and colour after hydration", () => {
    render(<LiturgicalDayCard />);
    expect(screen.getByRole("heading", { level: 2, name: "Easter Sunday of the Resurrection of the Lord" })).toBeInTheDocument();
    expect(screen.getByText("White")).toBeInTheDocument();
    expect(screen.getByText(/Easter Time, week 1/)).toBeInTheDocument();
    expect(screen.getByText("Sunday, April 5")).toHaveAttribute("datetime", "2026-04-05");
  });

  it("says it follows the universal calendar", () => {
    render(<LiturgicalDayCard />);
    expect(screen.getByText(/Universal Roman calendar/)).toBeInTheDocument();
  });

  it("links out to the day's readings in a new tab", () => {
    render(<LiturgicalDayCard />);
    const link = screen.getByRole("link", { name: /readings on usccb\.org/ });
    expect(link).toHaveAttribute("href", "https://bible.usccb.org/bible/readings/040526.cfm");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("hides the link when offline", () => {
    setOnline(false);
    render(<LiturgicalDayCard />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/needs a connection/)).toBeInTheDocument();
  });

  it("rolls over when the app returns to the foreground after midnight", () => {
    render(<LiturgicalDayCard />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Easter Sunday");
    vi.setSystemTime(new Date(2026, 3, 6, 0, 5));
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Monday within the Octave of Easter");
  });
});

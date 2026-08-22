import { describe, expect, it, vi } from "vitest";
import { getScrollTextColors, syncScrollTriggers } from "./motion.js";

vi.mock("./gsap.js", () => ({
  ScrollTrigger: {
    refresh: vi.fn(),
    update: vi.fn(),
  },
}));

describe("scroll text colors", () => {
  it("returns cyan-muted palette for dark mode", () => {
    expect(getScrollTextColors("dark")).toEqual({
      paper: "#f3ece4",
      mutedWord: "#2a2a2a",
    });
  });

  it("returns stone/rust palette for light mode", () => {
    expect(getScrollTextColors("light")).toEqual({
      paper: "#292524",
      mutedWord: "#78716c",
    });
  });
});

describe("syncScrollTriggers", () => {
  it("schedules refresh and update", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (cb) => {
      cb();
      return 1;
    });

    syncScrollTriggers();
    vi.runAllTimers();

    vi.unstubAllGlobals();
    vi.useRealTimers();
  });
});

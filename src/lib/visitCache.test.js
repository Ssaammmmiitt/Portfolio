import { beforeEach, describe, expect, it } from "vitest";
import {
  completeHardResetIfNeeded,
  getReloadStreak,
  hasVisited,
  markVisited,
  readScroll,
  recordUnloadScrollState,
  saveScroll,
} from "./visitCache.js";

const RELOAD_WINDOW = 2000;

describe("visitCache", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("tracks first visit state", () => {
    expect(hasVisited()).toBe(false);
    markVisited();
    expect(hasVisited()).toBe(true);
  });

  it("persists and reads scroll position", () => {
    expect(readScroll()).toBe(0);
    saveScroll(420);
    expect(readScroll()).toBe(420);
  });

  it("ignores invalid scroll values", () => {
    sessionStorage.setItem("sammit-site-scroll", "not-a-number");
    expect(readScroll()).toBe(0);
  });

  it("tracks reload streak only at scroll top", () => {
    saveScroll(120);
    expect(getReloadStreak(1000)).toEqual({
      atTop: false,
      shouldHardReset: false,
      clearStreak: true,
    });
  });

  it("requires two quick reloads at top for hard reset", () => {
    const t0 = 10_000;
    expect(getReloadStreak(t0)).toEqual({
      atTop: true,
      shouldHardReset: false,
      streak: 1,
      now: t0,
    });

    sessionStorage.setItem("sammit-site-reload-streak", "1");
    sessionStorage.setItem("sammit-site-reload-streak-ts", String(t0));

    expect(getReloadStreak(t0 + 400)).toEqual({
      atTop: true,
      shouldHardReset: true,
      streak: 2,
      now: t0 + 400,
    });
  });

  it("resets reload streak after the time window", () => {
    sessionStorage.setItem("sammit-site-reload-streak", "1");
    sessionStorage.setItem("sammit-site-reload-streak-ts", "1000");

    expect(getReloadStreak(1000 + RELOAD_WINDOW + 1)).toEqual({
      atTop: true,
      shouldHardReset: false,
      streak: 1,
      now: 1000 + RELOAD_WINDOW + 1,
    });
  });

  it("records unload streak at top and prepares hard reset on second reload", () => {
    expect(recordUnloadScrollState(0, 5000)).toEqual({
      atTop: true,
      shouldHardReset: false,
      streak: 1,
      now: 5000,
    });

    expect(recordUnloadScrollState(0, 5200)).toEqual({
      atTop: true,
      shouldHardReset: true,
      streak: 2,
      now: 5200,
    });

    expect(sessionStorage.getItem("sammit-site-hard-reset")).toBe("1");
    expect(hasVisited()).toBe(false);
    expect(readScroll()).toBe(0);
  });

  it("completes hard reset on the following load", () => {
    sessionStorage.setItem("sammit-site-hard-reset", "1");
    sessionStorage.setItem("sammit-site-visited", "1");
    sessionStorage.setItem("sammit-site-scroll", "900");

    expect(completeHardResetIfNeeded()).toBe(true);
    expect(sessionStorage.getItem("sammit-site-hard-reset")).toBeNull();
    expect(hasVisited()).toBe(false);
    expect(readScroll()).toBe(0);
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import {
  hasVisited,
  markVisited,
  readScroll,
  saveScroll,
} from "./visitCache.js";

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
});

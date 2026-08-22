import { describe, expect, it } from "vitest";
import {
  BUDGETS,
  CODE_DATA,
  EMAIL,
  MANIFESTO_LINES,
  NAV_LINKS,
  PROJECTS,
  SOCIALS,
  STATS,
  STRATEGY,
} from "./data.js";

describe("site data", () => {
  it("exports core identity fields", () => {
    expect(EMAIL).toMatch(/@/);
    expect(NAV_LINKS.length).toBeGreaterThan(0);
    expect(SOCIALS.every((s) => s.href.startsWith("http"))).toBe(true);
  });

  it("has manifesto lines with meaningful highlights", () => {
    expect(MANIFESTO_LINES).toHaveLength(3);
    MANIFESTO_LINES.forEach(({ line, highlight }) => {
      expect(line.split(" ")).toContain(highlight);
    });
  });

  it("defines content sections used by the app", () => {
    expect(STRATEGY.length).toBe(5);
    expect(PROJECTS.length).toBeGreaterThan(0);
    expect(STATS.length).toBeGreaterThan(0);
    expect(CODE_DATA.length).toBeGreaterThan(0);
    expect(BUDGETS.length).toBeGreaterThan(0);
  });

  it("uses in-page nav anchors", () => {
    NAV_LINKS.forEach(({ href }) => {
      expect(href.startsWith("#")).toBe(true);
    });
  });
});

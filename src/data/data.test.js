import { describe, expect, it } from "vitest";
import {
  BUDGETS,
  CODE_DATA,
  CONTACT_TOPICS,
  EMAIL,
  LEADERSHIP,
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
    expect(PROJECTS.length).toBe(9);
    expect(PROJECTS.every((project) => project.github?.startsWith("https://github.com/"))).toBe(
      true
    );
    expect(PROJECTS.every((project) => project.summary?.length > 0)).toBe(true);
    expect(LEADERSHIP.length).toBe(5);
    expect(STATS.length).toBeGreaterThan(0);
    expect(CODE_DATA.length).toBeGreaterThan(0);
    expect(BUDGETS.length).toBeGreaterThan(0);
    expect(CONTACT_TOPICS.length).toBe(6);
  });

  it("uses in-page nav anchors", () => {
    NAV_LINKS.forEach(({ href }) => {
      expect(href.startsWith("#")).toBe(true);
    });
  });
});

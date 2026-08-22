import { describe, expect, it } from "vitest";
import { cn } from "./utils.js";

describe("cn", () => {
  it("joins truthy class names", () => {
    const hidden = false;
    expect(cn("a", "b", hidden ? "c" : null, "d")).toBe("a b d");
  });

  it("returns empty string when no classes", () => {
    expect(cn()).toBe("");
  });
});

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import SmoothCursor from "./SmoothCursor.jsx";

describe("SmoothCursor", () => {
  it("does not render when inactive (e.g. CV modal open)", () => {
    const { container } = render(<SmoothCursor active={false} />);
    expect(container.firstChild).toBeNull();
    expect(document.documentElement.classList.contains("has-smooth-cursor")).toBe(false);
  });
});

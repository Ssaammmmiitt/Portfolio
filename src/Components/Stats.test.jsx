import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Stats from "./Stats.jsx";
import { STATS } from "../data.js";

describe("Stats", () => {
  it("renders stat values and labels", () => {
    render(<Stats ready={false} />);
    STATS.forEach(({ value, label }) => {
      expect(screen.getByText(value)).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});

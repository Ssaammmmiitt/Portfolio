import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Marquee from "./Marquee.jsx";
import { MARQUEE } from "../data.js";

describe("Marquee", () => {
  it("renders marquee items from data", () => {
    render(<Marquee />);
    MARQUEE.forEach((item) => {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0);
    });
  });
});

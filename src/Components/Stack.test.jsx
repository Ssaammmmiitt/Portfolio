import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Stack from "./Stack.jsx";
import { CODE_DATA } from "../data.js";

describe("Stack", () => {
  it("renders code stack rows", () => {
    render(<Stack ready={false} />);
    expect(screen.getByText("The code")).toBeInTheDocument();
    expect(screen.getByText("I build")).toBeInTheDocument();
    CODE_DATA.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});

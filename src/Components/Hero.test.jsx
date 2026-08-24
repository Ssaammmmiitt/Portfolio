import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import Hero from "./Hero.jsx";
import { renderWithProviders } from "../test/renderWithProviders.jsx";
import { NAME } from "../data.js";

describe("Hero", () => {
  it("renders a fullscreen structure-flow layer behind the title", () => {
    renderWithProviders(<Hero animate={false} instant />);

    expect(screen.getByTestId("structure-flow")).toBeInTheDocument();
    expect(document.getElementById("hero")).toContainElement(screen.getByTestId("structure-flow"));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(NAME.replace(" ", ""));
  });
});

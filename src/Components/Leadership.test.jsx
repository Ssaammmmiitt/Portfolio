import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import Leadership from "./Leadership.jsx";
import { LEADERSHIP } from "../data.js";
import { renderWithProviders } from "../test/renderWithProviders.jsx";

describe("Leadership", () => {
  it("renders leadership entries from data", () => {
    renderWithProviders(<Leadership ready={true} />);

    expect(document.getElementById("leadership")).toBeInTheDocument();
    expect(screen.getByText(/beyond the/i)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(LEADERSHIP.length);
    expect(screen.getByText("Infinity Hackathon")).toBeInTheDocument();
    expect(screen.getByText("Smart and Secure Future")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("Valorant IT Meet Competition")).toBeInTheDocument();
  });
});

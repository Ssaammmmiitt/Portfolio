import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Leadership from "./Leadership.jsx";
import { LEADERSHIP } from "../data.js";
import { renderWithProviders } from "../test/renderWithProviders.jsx";

describe("Leadership", () => {
  it("is collapsed by default and expands on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Leadership ready={true} />);

    const toggle = screen.getByRole("button", { name: /beyond the/i });
    expect(document.getElementById("leadership")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Infinity Hackathon")).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("listitem")).toHaveLength(LEADERSHIP.length);
    expect(screen.getByText("Infinity Hackathon")).toBeInTheDocument();
    expect(screen.getByText("Smart and Secure Future")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("Valorant IT Meet Competition")).toBeInTheDocument();
  });
});

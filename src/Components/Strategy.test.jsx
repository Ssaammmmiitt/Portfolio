import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Strategy from "./Strategy.jsx";
import { STRATEGY } from "../data.js";
import { renderWithProviders } from "../test/renderWithProviders.jsx";

describe("Strategy", () => {
  it("is collapsed by default and expands on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Strategy ready={true} />);

    const toggle = screen.getByRole("button", { name: /how i approach/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    STRATEGY.forEach(({ title }) => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    });

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    STRATEGY.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});

import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle.jsx";
import { renderWithProviders } from "../test/renderWithProviders.jsx";

describe("ThemeToggle", () => {
  it("toggles light and dark theme on document root", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(document.documentElement.classList.contains("light")).toBe(false);

    await user.click(button);
    expect(document.documentElement.classList.contains("light")).toBe(true);

    await user.click(button);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("does not toggle theme when Space is pressed after click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole("button");
    await user.click(button);
    expect(document.documentElement.classList.contains("light")).toBe(true);

    await user.keyboard(" ");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});

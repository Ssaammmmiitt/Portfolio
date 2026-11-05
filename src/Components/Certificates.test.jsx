import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Certificates from "./Certificates.jsx";
import { CERTIFICATES } from "../data.js";
import { renderWithProviders } from "../test/renderWithProviders.jsx";

describe("Certificates", () => {
  it("is collapsed by default and expands to show certificate cards", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Certificates ready={true} />);

    const toggle = screen.getByRole("button", { name: /proof of/i });
    expect(document.getElementById("certificates")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Introduction to SQL")).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Introduction to SQL")).toBeInTheDocument();
    expect(screen.getByText("Intermediate SQL")).toBeInTheDocument();
    expect(screen.getByText("Joining Data in SQL")).toBeInTheDocument();
    expect(screen.getByText("Introduction to Snowflake")).toBeInTheDocument();
    expect(screen.getByText("Data Warehousing")).toBeInTheDocument();

    const panel = document.getElementById("certificates-panel");
    expect(
      within(panel).getAllByRole("button", { name: /view .+ certificate/i })
    ).toHaveLength(CERTIFICATES.length);
    expect(within(panel).queryByRole("link", { name: /download/i })).toBeNull();
  });

  it("opens a larger certificate viewer when a card is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Certificates ready={true} />);

    await user.click(screen.getByRole("button", { name: /proof of/i }));
    await user.click(screen.getByRole("button", { name: /view introduction to sql certificate/i }));

    expect(screen.getByRole("dialog", { name: /introduction to sql/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^close$/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /download/i })).toBeNull();
  });
});

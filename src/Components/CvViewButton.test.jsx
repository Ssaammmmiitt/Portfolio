import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CvViewButton from "./CvViewButton.jsx";
import { renderWithProviders } from "../test/renderWithProviders.jsx";
import { CV } from "../data.js";

describe("CvViewButton", () => {
  it("invokes onOpen when clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderWithProviders(<CvViewButton onOpen={onOpen} />);

    await user.click(screen.getByRole("button", { name: `View ${CV.label}` }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

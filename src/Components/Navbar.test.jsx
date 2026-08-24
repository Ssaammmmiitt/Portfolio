import { describe, expect, it, vi } from "vitest";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar.jsx";
import { renderWithProviders } from "../test/renderWithProviders.jsx";
import { CV } from "../data.js";

describe("Navbar CV buttons", () => {
  it("places View CV before Download CV in the desktop nav", () => {
    renderWithProviders(<Navbar visible instant show onViewCv={vi.fn()} />);

    const desktopNav = document.querySelector(".hidden.min-w-0.lg\\:flex");
    expect(desktopNav).toBeTruthy();

    const view = within(desktopNav).getByRole("button", { name: `View ${CV.label}` });
    const download = within(desktopNav).getByRole("link", { name: `Download ${CV.label}` });

    expect(view.compareDocumentPosition(download) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("places View CV before Download CV in the mobile nav", () => {
    renderWithProviders(<Navbar visible instant show onViewCv={vi.fn()} />);

    const mobileNav = document.querySelector(".flex.items-center.gap-3.lg\\:hidden");
    expect(mobileNav).toBeTruthy();

    const view = within(mobileNav).getByRole("button", { name: `View ${CV.label}` });
    const download = within(mobileNav).getByRole("link", { name: `Download ${CV.label}` });

    expect(view.compareDocumentPosition(download) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("calls onViewCv when View CV is clicked", async () => {
    const user = userEvent.setup();
    const onViewCv = vi.fn();
    renderWithProviders(<Navbar visible instant show onViewCv={onViewCv} />);

    const desktopNav = document.querySelector(".hidden.min-w-0.lg\\:flex");
    await user.click(within(desktopNav).getByRole("button", { name: `View ${CV.label}` }));
    expect(onViewCv).toHaveBeenCalledTimes(1);
  });
});

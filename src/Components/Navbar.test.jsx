import { describe, expect, it, vi } from "vitest";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar.jsx";
import { renderWithProviders } from "../test/renderWithProviders.jsx";
import { CV } from "../data.js";

describe("Navbar CV buttons", () => {
  it("places View CV before Download CV in the desktop nav", () => {
    renderWithProviders(<Navbar visible instant show onViewCv={vi.fn()} />);

    const desktopNav = document.querySelector(".nav-desktop-cta");
    expect(desktopNav).toBeTruthy();

    const view = within(desktopNav).getByRole("button", { name: `View ${CV.label}` });
    const download = within(desktopNav).getByRole("button", { name: `Download ${CV.label}` });

    expect(view.compareDocumentPosition(download) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("places View CV before Download CV in the mobile nav", () => {
    renderWithProviders(<Navbar visible instant show onViewCv={vi.fn()} />);

    const mobileNav = document.querySelector(".nav-mobile-actions");
    expect(mobileNav).toBeTruthy();

    const view = within(mobileNav).getByRole("button", { name: `View ${CV.label}` });
    const download = within(mobileNav).getByRole("button", { name: `Download ${CV.label}` });

    expect(view.compareDocumentPosition(download) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("keeps Contact with primary links and View CV in the CTA cluster", () => {
    renderWithProviders(<Navbar visible instant show onViewCv={vi.fn()} />);

    const primary = document.querySelector(".nav-primary-links");
    const cta = document.querySelector(".nav-desktop-cta");
    expect(within(primary).getByRole("link", { name: /contact/i })).toBeInTheDocument();
    expect(within(cta).getByRole("button", { name: `View ${CV.label}` })).toBeInTheDocument();
    expect(within(primary).queryByRole("button", { name: `View ${CV.label}` })).toBeNull();
  });

  it("calls onViewCv when View CV is clicked", async () => {
    const user = userEvent.setup();
    const onViewCv = vi.fn();
    renderWithProviders(<Navbar visible instant show onViewCv={onViewCv} />);

    const desktopNav = document.querySelector(".nav-desktop-cta");
    await user.click(within(desktopNav).getByRole("button", { name: `View ${CV.label}` }));
    expect(onViewCv).toHaveBeenCalledTimes(1);
  });
});

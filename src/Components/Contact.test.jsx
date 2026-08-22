import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "./Contact.jsx";
import { BUDGETS } from "../data.js";
import { renderWithProviders } from "../test/renderWithProviders.jsx";

describe("Contact", () => {
  it("renders form fields and budget options", () => {
    renderWithProviders(<Contact ready={true} />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tell us about your project/i)).toBeInTheDocument();
    BUDGETS.forEach((budget) => {
      expect(screen.getByText(budget)).toBeInTheDocument();
    });
  });

  it("shows validation errors for empty submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact ready={true} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/please fix the highlighted fields/i)).toBeInTheDocument();
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/one last step/i)).not.toBeInTheDocument();
  });

  it("shows verification step after valid submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact ready={true} />);

    await user.type(screen.getByLabelText(/your name/i), "Test User");
    await user.type(screen.getByLabelText(/your email/i), "test@example.com");
    await user.type(screen.getByLabelText(/tell us about your project/i), "Portfolio rebuild");
    await user.click(screen.getByText(BUDGETS[0]));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/one last step/i)).toBeInTheDocument();
    expect(screen.getByTestId("hcaptcha-mock")).toBeInTheDocument();
  });

  it("shows success after verification and API success", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    );

    renderWithProviders(<Contact ready={true} />);

    await user.type(screen.getByLabelText(/your name/i), "Test User");
    await user.type(screen.getByLabelText(/your email/i), "test@example.com");
    await user.type(screen.getByLabelText(/tell us about your project/i), "Hello there, I need help with a project.");
    await user.click(screen.getByText(BUDGETS[0]));
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await user.click(screen.getByTestId("hcaptcha-mock"));

    expect(await screen.findByText(/thanks.*message was sent/i)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});

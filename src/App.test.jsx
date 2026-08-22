import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import App from "./App.jsx";
import { renderWithProviders } from "./test/renderWithProviders.jsx";

vi.mock("./hooks/useLenis.js", () => ({
  useLenis: vi.fn(),
}));

describe("App", () => {
  it("renders main sections when preloader is skipped via returning visit", () => {
    sessionStorage.setItem("sammit-site-visited", "1");
    renderWithProviders(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(document.getElementById("manifesto")).toBeInTheDocument();
    expect(document.getElementById("strategy")).toBeInTheDocument();
    expect(document.getElementById("contact")).toBeInTheDocument();
  });
});

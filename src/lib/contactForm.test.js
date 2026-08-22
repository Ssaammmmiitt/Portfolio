import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  canSubmitContactForm,
  formatCooldown,
  getContactCooldownRemainingMs,
  markContactFormSubmitted,
  submitContactForm,
} from "./contactForm.js";

describe("contactForm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("allows first submission", () => {
    expect(canSubmitContactForm()).toBe(true);
  });

  it("blocks repeat submission within cooldown", () => {
    markContactFormSubmitted();
    expect(canSubmitContactForm()).toBe(false);
    expect(getContactCooldownRemainingMs()).toBeGreaterThan(0);
  });

  it("formats cooldown for display", () => {
    expect(formatCooldown(30 * 60 * 1000)).toBe("about an hour");
    expect(formatCooldown(5 * 60 * 60 * 1000)).toMatch(/hours/);
  });

  it("submits payload to Web3Forms", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const payload = {
      name: "Jane",
      email: "jane@example.com",
      project: "New app",
      budget: "$5k–$10k",
      source: "Referral",
    };

    await submitContactForm(payload, "token-123");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.web3forms.com/submit",
      expect.objectContaining({ method: "POST" })
    );

    const body = fetch.mock.calls[0][1].body;
    expect(body.get("name")).toBe("Jane");
    expect(body.get("email")).toBe("jane@example.com");
    expect(body.get("h-captcha-response")).toBe("token-123");
  });

  it("throws when captcha token is missing", async () => {
    await expect(
      submitContactForm({ name: "A", email: "a@b.com", project: "x", budget: "y" }, "")
    ).rejects.toThrow(/verification/i);
  });

  it("throws when API returns failure", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: "Spam detected" }),
    });

    await expect(
      submitContactForm(
        { name: "A", email: "a@b.com", project: "x", budget: "y", source: "" },
        "token"
      )
    ).rejects.toThrow("Spam detected");
  });
});

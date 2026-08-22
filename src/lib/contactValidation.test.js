import { describe, expect, it } from "vitest";
import { validateContactForm } from "./contactValidation.js";

describe("validateContactForm", () => {
  const valid = {
    name: "Sammit Poudyal",
    email: "test@example.com",
    project: "I need help building a portfolio site.",
    budget: "$5k – $10k",
    source: "",
  };

  it("accepts valid input", () => {
    const result = validateContactForm(valid);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("requires name, email, project, and budget", () => {
    const result = validateContactForm({
      name: "",
      email: "",
      project: "",
      budget: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.project).toBeTruthy();
    expect(result.errors.budget).toBeTruthy();
  });

  it("rejects invalid email and short project", () => {
    const result = validateContactForm({
      ...valid,
      email: "not-an-email",
      project: "Too short",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.email).toMatch(/valid email/i);
    expect(result.errors.project).toMatch(/at least 10 characters/i);
  });
});

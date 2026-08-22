import { describe, expect, it } from "vitest";
import { CONTACT_TOPICS } from "../data.js";
import { validateContactForm } from "./contactValidation.js";

describe("validateContactForm", () => {
  const valid = {
    name: "Sammit Poudyal",
    email: "test@example.com",
    topic: CONTACT_TOPICS[0],
    project: "I need help building a portfolio site.",
    budget: "$5k – $10k",
    source: "",
  };

  it("accepts valid input", () => {
    const result = validateContactForm(valid, { topics: CONTACT_TOPICS });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("requires name, email, topic, project, and budget", () => {
    const result = validateContactForm(
      {
        name: "",
        email: "",
        topic: "",
        project: "",
        budget: "",
      },
      { topics: CONTACT_TOPICS }
    );

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.topic).toBeTruthy();
    expect(result.errors.project).toBeTruthy();
    expect(result.errors.budget).toBeTruthy();
  });

  it("rejects invalid email, topic, and short project", () => {
    const result = validateContactForm(
      {
        ...valid,
        email: "not-an-email",
        topic: "Not a real topic",
        project: "Too short",
      },
      { topics: CONTACT_TOPICS }
    );

    expect(result.valid).toBe(false);
    expect(result.errors.email).toMatch(/valid email/i);
    expect(result.errors.topic).toMatch(/valid topic/i);
    expect(result.errors.project).toMatch(/at least 10 characters/i);
  });
});

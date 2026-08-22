import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

function createStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() {
      return store.size;
    },
    key: (index) => [...store.keys()][index] ?? null,
  };
}

if (typeof globalThis.localStorage === "undefined") {
  globalThis.localStorage = createStorage();
}

if (typeof globalThis.sessionStorage === "undefined") {
  globalThis.sessionStorage = createStorage();
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  sessionStorage.clear();
  localStorage.clear();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock("../lib/gsap.js", () => ({
  gsap: {
    context: (fn) => {
      fn();
      return { revert: vi.fn() };
    },
    set: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    utils: { toArray: (sel) => Array.from(document.querySelectorAll(sel)) },
  },
  ScrollTrigger: { refresh: vi.fn(), update: vi.fn() },
  EASE_IN_OUT: "power2.inOut",
}));

vi.mock("@hcaptcha/react-hcaptcha", () => ({
  default: ({ onVerify }) =>
    React.createElement(
      "button",
      {
        type: "button",
        "data-testid": "hcaptcha-mock",
        onClick: () => onVerify("mock-captcha-token"),
      },
      "Verify"
    ),
}));

vi.mock("@splinetool/react-spline", () => ({
  default: () => React.createElement("div", { "data-testid": "spline-mock" }, "Spline scene"),
}));

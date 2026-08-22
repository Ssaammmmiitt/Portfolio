import { beforeEach, describe, expect, it, vi } from "vitest";
import { scrollToHash, scrollToTop } from "./scrollTo.js";

describe("scrollToHash", () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="works" style="height:2000px;margin-top:800px"></section>';
    window.scrollTo = vi.fn();
    delete window.__lenis;
  });

  it("scrolls native with nav offset when Lenis is unavailable", () => {
    const target = document.getElementById("works");
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      top: 400,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    });
    Object.defineProperty(window, "scrollY", { value: 800, configurable: true });

    scrollToHash("#works");

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 1128,
      behavior: "smooth",
    });
  });

  it("uses Lenis when available", () => {
    const scrollTo = vi.fn();
    window.__lenis = { scrollTo };

    scrollToHash("#works");

    expect(scrollTo).toHaveBeenCalledWith(document.getElementById("works"), {
      offset: -72,
      duration: 1.05,
    });
  });
});

describe("scrollToTop", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    delete window.__lenis;
  });

  it("scrolls to top natively when Lenis is unavailable", () => {
    scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("uses Lenis when available", () => {
    const scrollTo = vi.fn();
    window.__lenis = { scrollTo };

    scrollToTop();

    expect(scrollTo).toHaveBeenCalledWith(0, { duration: 1.05 });
  });
});

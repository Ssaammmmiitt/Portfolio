import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { isCompactViewport, syncScrollTriggers } from "../lib/motion.js";
import { saveScroll } from "../lib/visitCache.js";

const KEYBOARD_SCROLL_RATIO = 0.52;

function isEditableTarget(target) {
  if (!target || !(target instanceof Element)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

function isInteractiveTarget(target) {
  if (!target || !(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "a, button, [role='button'], summary, select, input, textarea, [contenteditable='true']"
    )
  );
}

export function useLenis(enabled, initialScroll = 0, spaceScrollEnabled = true) {
  const spaceScrollRef = useRef(spaceScrollEnabled);
  spaceScrollRef.current = spaceScrollEnabled;

  useEffect(() => {
    if (!enabled) return;

    const persistNative = () => saveScroll(window.scrollY);
    const refresh = () => syncScrollTriggers();

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      if (initialScroll > 0) window.scrollTo(0, initialScroll);
      const onScroll = () => {
        ScrollTrigger.update();
        saveScroll(window.scrollY);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pagehide", persistNative);
      window.addEventListener("orientationchange", refresh);
      requestAnimationFrame(refresh);
      return () => {
        persistNative();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pagehide", persistNative);
        window.removeEventListener("orientationchange", refresh);
      };
    }

    const compact = isCompactViewport();
    const lenis = new Lenis({
      duration: compact ? 0.95 : 1.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: compact ? 0.78 : 0.68,
      touchMultiplier: 1,
    });

    if (initialScroll > 0) {
      lenis.scrollTo(initialScroll, { immediate: true });
    }

    lenis.on("scroll", (event) => {
      ScrollTrigger.update();
      saveScroll(event.scroll);
    });

    const onKeyDown = (event) => {
      if (isEditableTarget(event.target) || isInteractiveTarget(event.target)) return;

      const step = window.innerHeight * KEYBOARD_SCROLL_RATIO;
      let delta = 0;

      if (event.code === "Space") {
        if (!spaceScrollRef.current) {
          event.preventDefault();
          return;
        }
        delta = event.shiftKey ? -step : step;
      } else if (event.code === "PageDown") {
        delta = step;
      } else if (event.code === "PageUp") {
        delta = -step;
      } else if (event.code === "ArrowDown") {
        delta = step * 0.35;
      } else if (event.code === "ArrowUp") {
        delta = -step * 0.35;
      } else {
        return;
      }

      event.preventDefault();
      lenis.scrollTo(lenis.scroll + delta, {
        duration: compact ? 0.75 : 0.85,
        easing: (t) => Math.min(1, 1.001 - (1 - t) ** 3),
      });
    };

    const persist = () => saveScroll(lenis.scroll);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pagehide", persist);
    window.addEventListener("orientationchange", refresh);

    const ticker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => {
      if (initialScroll > 0) lenis.scrollTo(initialScroll, { immediate: true });
      syncScrollTriggers();
    });

    document.documentElement.classList.add("lenis");
    window.__lenis = lenis;

    return () => {
      persist();
      delete window.__lenis;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pagehide", persist);
      window.removeEventListener("orientationchange", refresh);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, [enabled, initialScroll]);
}

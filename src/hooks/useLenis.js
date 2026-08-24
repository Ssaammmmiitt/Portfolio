import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { isCompactViewport, syncScrollTriggers } from "../lib/motion.js";
import { saveScroll } from "../lib/visitCache.js";

const KEYBOARD_SCROLL_RATIO = 0.52;
const SCROLL_PERSIST_MS = 200;

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

function createScrollPersister() {
  let lastY = 0;
  let timer = 0;

  return {
    queue(y) {
      lastY = y;
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        saveScroll(lastY);
      }, SCROLL_PERSIST_MS);
    },
    flush(y = lastY) {
      if (timer) {
        window.clearTimeout(timer);
        timer = 0;
      }
      saveScroll(y);
    },
  };
}

export function useLenis(enabled, initialScroll = 0, spaceScrollEnabled = true) {
  const spaceScrollRef = useRef(spaceScrollEnabled);
  spaceScrollRef.current = spaceScrollEnabled;

  useEffect(() => {
    if (!enabled) return;

    const persistScroll = createScrollPersister();
    const refresh = () => syncScrollTriggers();

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      if (initialScroll > 0) window.scrollTo(0, initialScroll);
      const onScroll = () => {
        ScrollTrigger.update();
        persistScroll.queue(window.scrollY);
      };
      const onPageHide = () => persistScroll.flush(window.scrollY);
      const onOrientation = () => window.setTimeout(refresh, 180);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pagehide", onPageHide);
      window.addEventListener("orientationchange", onOrientation);
      requestAnimationFrame(refresh);
      return () => {
        persistScroll.flush(window.scrollY);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pagehide", onPageHide);
        window.removeEventListener("orientationchange", onOrientation);
      };
    }

    const compact = isCompactViewport();
    const lenis = new Lenis({
      // Slightly snappier easing keeps scroll feeling locked to the wheel on mid GPUs.
      duration: compact ? 0.85 : 0.95,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: compact ? 0.82 : 0.74,
      touchMultiplier: 1,
      autoResize: true,
    });

    if (initialScroll > 0) {
      lenis.scrollTo(initialScroll, { immediate: true });
    }

    lenis.on("scroll", (event) => {
      ScrollTrigger.update();
      persistScroll.queue(event.scroll);
    });

    const onKeyDown = (event) => {
      if (isEditableTarget(event.target)) return;

      const step = window.innerHeight * KEYBOARD_SCROLL_RATIO;
      let delta = 0;

      if (event.code === "Space") {
        if (!spaceScrollRef.current) {
          event.preventDefault();
          return;
        }
        // Focused nav/theme/dock controls must not steal Space from page scroll.
        const chrome = event.target instanceof Element
          ? event.target.closest("button, [role='button'], a")
          : null;
        const inForm = event.target instanceof Element && Boolean(event.target.closest("form"));
        if (chrome && !inForm) {
          event.preventDefault();
          chrome.blur?.();
        } else if (isInteractiveTarget(event.target)) {
          return;
        }
        delta = event.shiftKey ? -step : step;
      } else if (event.code === "PageDown") {
        if (isInteractiveTarget(event.target)) return;
        delta = step;
      } else if (event.code === "PageUp") {
        if (isInteractiveTarget(event.target)) return;
        delta = -step;
      } else if (event.code === "ArrowDown") {
        if (isInteractiveTarget(event.target)) return;
        delta = step * 0.35;
      } else if (event.code === "ArrowUp") {
        if (isInteractiveTarget(event.target)) return;
        delta = -step * 0.35;
      } else {
        return;
      }

      event.preventDefault();
      lenis.scrollTo(lenis.scroll + delta, {
        duration: compact ? 0.65 : 0.75,
        easing: (t) => Math.min(1, 1.001 - (1 - t) ** 3),
      });
    };

    const onPageHide = () => persistScroll.flush(lenis.scroll);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pagehide", onPageHide);
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
      persistScroll.flush(lenis.scroll);
      delete window.__lenis;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("orientationchange", refresh);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, [enabled, initialScroll]);
}

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { isCompactViewport, syncScrollTriggers } from "../lib/motion.js";
import { saveScroll } from "../lib/visitCache.js";

const KEYBOARD_SCROLL_RATIO = 0.52;
const SCROLL_PERSIST_MS = 200;
const SCROLL_LOCK_KEYS = new Set([
  "Space",
  "PageDown",
  "PageUp",
  "ArrowDown",
  "ArrowUp",
  "Home",
  "End",
]);

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

/**
 * @param {boolean} enabled - Lenis / scroll system active (after preloader)
 * @param {number} initialScroll
 * @param {boolean} scrollUnlocked - false until hero intro finishes (blocks wheel, keys, scrollbar)
 */
export function useLenis(enabled, initialScroll = 0, scrollUnlocked = true) {
  const scrollUnlockedRef = useRef(scrollUnlocked);
  scrollUnlockedRef.current = scrollUnlocked;

  useEffect(() => {
    if (!enabled) return;

    const persistScroll = createScrollPersister();
    const refresh = () => syncScrollTriggers();

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      if (scrollUnlockedRef.current && initialScroll > 0) {
        window.scrollTo(0, initialScroll);
      } else {
        window.scrollTo(0, 0);
      }

      const blockNativeScroll = (event) => {
        if (scrollUnlockedRef.current) return;
        event.preventDefault();
        window.scrollTo(0, 0);
      };

      const onKeyDown = (event) => {
        if (scrollUnlockedRef.current || isEditableTarget(event.target)) return;
        if (SCROLL_LOCK_KEYS.has(event.code)) {
          event.preventDefault();
        }
      };

      const onScroll = () => {
        if (!scrollUnlockedRef.current) {
          window.scrollTo(0, 0);
          return;
        }
        ScrollTrigger.update();
        persistScroll.queue(window.scrollY);
      };

      const onPageHide = () => persistScroll.flush(window.scrollY);
      const onOrientation = () => window.setTimeout(refresh, 180);

      window.addEventListener("wheel", blockNativeScroll, { passive: false });
      window.addEventListener("touchmove", blockNativeScroll, { passive: false });
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pagehide", onPageHide);
      window.addEventListener("orientationchange", onOrientation);
      requestAnimationFrame(refresh);

      return () => {
        persistScroll.flush(window.scrollY);
        window.removeEventListener("wheel", blockNativeScroll);
        window.removeEventListener("touchmove", blockNativeScroll);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pagehide", onPageHide);
        window.removeEventListener("orientationchange", onOrientation);
      };
    }

    const compact = isCompactViewport();
    const lenis = new Lenis({
      duration: compact ? 0.85 : 0.95,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: compact ? 0.82 : 0.74,
      touchMultiplier: 1,
      autoResize: true,
    });

    if (scrollUnlockedRef.current && initialScroll > 0) {
      lenis.scrollTo(initialScroll, { immediate: true });
    } else {
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    }

    lenis.on("scroll", (event) => {
      ScrollTrigger.update();
      persistScroll.queue(event.scroll);
    });

    const onKeyDown = (event) => {
      if (isEditableTarget(event.target)) return;

      if (!scrollUnlockedRef.current) {
        if (SCROLL_LOCK_KEYS.has(event.code)) {
          event.preventDefault();
        }
        return;
      }

      const step = window.innerHeight * KEYBOARD_SCROLL_RATIO;
      let delta = 0;

      if (event.code === "Space") {
        const chrome =
          event.target instanceof Element
            ? event.target.closest("button, [role='button'], a")
            : null;
        const inForm =
          event.target instanceof Element && Boolean(event.target.closest("form"));
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
      } else if (event.code === "Home") {
        if (isInteractiveTarget(event.target)) return;
        event.preventDefault();
        lenis.scrollTo(0, { duration: 0.75 });
        return;
      } else if (event.code === "End") {
        if (isInteractiveTarget(event.target)) return;
        event.preventDefault();
        lenis.scrollTo(lenis.limit, { duration: 0.75 });
        return;
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
      if (scrollUnlockedRef.current && initialScroll > 0) {
        lenis.scrollTo(initialScroll, { immediate: true });
      } else if (!scrollUnlockedRef.current) {
        lenis.scrollTo(0, { immediate: true });
        lenis.stop();
      }
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

  // React to unlock after hero intro without recreating Lenis.
  useEffect(() => {
    if (!enabled) return;

    const lenis = window.__lenis;
    if (lenis) {
      if (scrollUnlocked) {
        lenis.start();
      } else {
        lenis.scrollTo(0, { immediate: true });
        lenis.stop();
      }
    }

    document.documentElement.classList.toggle("scroll-locked", !scrollUnlocked);
  }, [enabled, scrollUnlocked]);
}

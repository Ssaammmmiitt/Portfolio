import { ScrollTrigger } from "./gsap.js";

export function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  
  export function isCompactViewport() {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  }
  
  export function canHoverFine() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }
  
export function getThemeColors() {
  if (typeof window === "undefined") {
    return { paper: "#f3ece4", mutedWord: "#2a2a2a", accent: "#22d3ee", accentSoft: "#67e8f9" };
  }
  const style = getComputedStyle(document.documentElement);
  return {
    paper: style.getPropertyValue("--theme-paper").trim() || "#f3ece4",
    mutedWord: style.getPropertyValue("--theme-muted-word").trim() || "#2a2a2a",
    accent: style.getPropertyValue("--theme-accent").trim() || "#22d3ee",
    accentSoft: style.getPropertyValue("--theme-accent-soft").trim() || "#67e8f9",
  };
}

export const MANIFESTO_COLORS = {
  dark: {
    paper: "#f3ece4",
    mutedWord: "#2a2a2a",
    accent: "#22d3ee",
    accentSoft: "#67e8f9",
  },
  light: {
    paper: "#0f172a",
    mutedWord: "#94a3b8",
    accent: "#0e7490",
    accentSoft: "#0891b2",
  },
};

/** GSAP-friendly CSS vars  -  re-resolve on invalidate when theme toggles. */
export const MANIFESTO_VARS = {
  paper: "var(--theme-paper)",
  muted: "var(--theme-manifesto-muted)",
  accent: "var(--theme-manifesto-accent)",
  accentSoft: "var(--theme-manifesto-accent-soft)",
};

export const SCROLL_TEXT_VARS = {
  paper: "var(--theme-paper)",
  mutedWord: "var(--theme-muted-word)",
};

export function getManifestoColors(theme = "dark") {
  return MANIFESTO_COLORS[theme] ?? MANIFESTO_COLORS.dark;
}

export const SCROLL_TEXT_COLORS = {
  dark: {
    paper: "#f3ece4",
    mutedWord: "#2a2a2a",
  },
  light: {
    paper: "#0f172a",
    mutedWord: "#94a3b8",
  },
};

export function getScrollTextColors(theme = "dark") {
  return SCROLL_TEXT_COLORS[theme] ?? SCROLL_TEXT_COLORS.dark;
}

let syncScheduled = false;
let syncTimer = 0;

/** Re-sync scrub ScrollTriggers after layout or theme changes (Lenis-safe). */
export function syncScrollTriggers() {
  if (typeof window === "undefined" || syncScheduled) return;

  syncScheduled = true;
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    requestAnimationFrame(() => {
      syncScheduled = false;
      const lenis = window.__lenis;
      const scrollY = lenis?.scroll ?? window.scrollY;

      ScrollTrigger.refresh(true);
      if (typeof ScrollTrigger.update === "function") {
        ScrollTrigger.update();
      }

      if (lenis) {
        lenis.scrollTo(scrollY, { immediate: true });
        lenis.emit?.("scroll");
      } else if (Math.abs(window.scrollY - scrollY) > 1) {
        window.scrollTo(0, scrollY);
      }
    });
  }, 50);
}

/** Preserve scrub progress while re-reading CSS variable targets. */
export function refreshScrubTween(tween) {
  if (!tween || typeof tween.invalidate !== "function") return;

  const progress = typeof tween.progress === "function" ? tween.progress() : null;
  tween.invalidate();

  if (progress != null && typeof tween.progress === "function") {
    tween.progress(progress);
  }

  tween.scrollTrigger?.update?.();
}

/** Preserve timeline scrub progress while re-reading nested tween colors. */
export function refreshScrubTimeline(timeline) {
  if (!timeline || typeof timeline.progress !== "function") return;

  const progress = timeline.progress();

  timeline.getChildren(false, true, true).forEach((child) => {
    if (typeof child.invalidate === "function") child.invalidate();
  });
  timeline.invalidate();
  timeline.progress(progress);
  timeline.scrollTrigger?.update?.();
}

/** Preserve scrub progress while swapping a tween's animated color. */
export function updateScrubTweenColor(tween, color) {
  if (!tween || typeof tween.invalidate !== "function") return;

  const progress = typeof tween.progress === "function" ? tween.progress() : null;
  tween.vars.to = { ...tween.vars.to, color };
  tween.invalidate();

  if (progress != null && typeof tween.progress === "function") {
    tween.progress(progress);
  }

  tween.scrollTrigger?.update?.();
}

/** Preserve timeline scrub progress while updating nested color tweens. */
export function updateTimelineColorTweens(timeline, tweens) {
  if (!timeline || typeof timeline.progress !== "function") return;

  const progress = timeline.progress();

  tweens.forEach(({ tween, color }) => {
    if (!tween) return;
    tween.vars.to = { ...tween.vars.to, color };
    tween.invalidate();
  });

  timeline.progress(progress);
  timeline.scrollTrigger?.update?.();
}
  
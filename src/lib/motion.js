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
    paper: "#292524",
    mutedWord: "#78716c",
    accent: "#7c2d12",
    accentSoft: "#9a3412",
  },
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
    paper: "#292524",
    mutedWord: "#78716c",
  },
};

export function getScrollTextColors(theme = "dark") {
  return SCROLL_TEXT_COLORS[theme] ?? SCROLL_TEXT_COLORS.dark;
}

let syncScheduled = false;

/** Re-sync scrub ScrollTriggers after layout or theme changes (Lenis-safe). */
export function syncScrollTriggers() {
  if (typeof window === "undefined" || syncScheduled) return;

  syncScheduled = true;
  requestAnimationFrame(() => {
    syncScheduled = false;
    ScrollTrigger.refresh(true);
    if (typeof ScrollTrigger.update === "function") {
      ScrollTrigger.update();
    }
    window.__lenis?.emit?.("scroll");
  });
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
  
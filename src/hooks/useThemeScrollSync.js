import { useEffect, useLayoutEffect } from "react";
import { useTheme } from "../context/ThemeProvider.jsx";
import { syncScrollTriggers } from "../lib/motion.js";

/** Keeps GSAP scrub animations aligned after theme, resize, and layout changes. */
export function useThemeScrollSync() {
  const { theme } = useTheme();

  useLayoutEffect(() => {
    syncScrollTriggers();
  }, [theme]);

  useEffect(() => {
    const onLayoutChange = () => syncScrollTriggers();

    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("orientationchange", onLayoutChange);

    return () => {
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("orientationchange", onLayoutChange);
    };
  }, []);
}

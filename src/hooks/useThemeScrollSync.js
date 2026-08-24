import { useEffect, useLayoutEffect, useRef } from "react";
import { useTheme } from "../context/ThemeProvider.jsx";
import { syncScrollTriggers } from "../lib/motion.js";

/** Keeps GSAP scrub animations aligned after theme and real layout changes. */
export function useThemeScrollSync() {
  const { theme } = useTheme();
  const lastWidth = useRef(0);

  useLayoutEffect(() => {
    syncScrollTriggers();
  }, [theme]);

  useEffect(() => {
    lastWidth.current = window.innerWidth;

    const onResize = () => {
      const width = window.innerWidth;
      // iOS chrome show/hide only changes height; refreshing there makes scroll jump.
      if (Math.abs(width - lastWidth.current) < 2) return;
      lastWidth.current = width;
      syncScrollTriggers();
    };

    const onOrientation = () => {
      lastWidth.current = window.innerWidth;
      window.setTimeout(() => syncScrollTriggers(), 180);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, []);
}

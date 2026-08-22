import { useEffect } from "react";
import { scrollToHash } from "../lib/scrollTo.js";

/** Route same-page hash links through Lenis-aware scroll with nav offset. */
export function useInPageNav(enabled) {
  useEffect(() => {
    if (!enabled) return;

    const onClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const id = hash.slice(1);
      if (!document.getElementById(id)) return;

      event.preventDefault();
      scrollToHash(hash);
      window.history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);
}

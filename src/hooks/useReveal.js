import { useLayoutEffect } from "react";
import { gsap } from "../lib/gsap.js";
import { isCompactViewport } from "../lib/motion.js";
import { isAlreadyInView } from "../lib/visitCache.js";

function reveal(targets, from, { start, ...to }, trigger, alreadySeen) {
  if (!targets.length) return;
  if (alreadySeen) {
    gsap.set(targets, { y: 0, opacity: 1 });
    return;
  }
  gsap.fromTo(targets, from, {
    ...to,
    scrollTrigger: { trigger, start, once: true },
  });
}

export function useReveal(ref, ready = true) {
  useLayoutEffect(() => {
    if (!ready || !ref.current) return;

    const compact = isCompactViewport();

    const ctx = gsap.context(() => {
      const root = ref.current;
      const alreadySeen = isAlreadyInView(root);
      const kicker = root.querySelectorAll(".reveal-kicker");
      const titles = root.querySelectorAll(".reveal-title");
      const items = root.querySelectorAll(".reveal-item");

      reveal(kicker, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", start: "top 86%" }, root, alreadySeen);
      reveal(
        titles,
        { y: compact ? 36 : 90, opacity: 0 },
        { y: 0, opacity: 1, duration: compact ? 0.8 : 1.15, ease: "power4.out", stagger: 0.08, start: "top 82%" },
        root,
        alreadySeen
      );
      reveal(
        items,
        { y: compact ? 24 : 48, opacity: 0 },
        { y: 0, opacity: 1, duration: compact ? 0.7 : 0.95, ease: "power3.out", stagger: compact ? 0.05 : 0.08, delay: 0.08, start: "top 80%" },
        root,
        alreadySeen
      );
    }, ref);

    return () => ctx.revert();
  }, [ref, ready]);
}

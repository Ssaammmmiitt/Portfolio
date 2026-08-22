import { useEffect, useState } from "react";

export function useScrollNav(enabled) {
  const [heroInView, setHeroInView] = useState(true);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const hero = document.getElementById("hero");
    const footer = document.getElementById("footer");
    if (!hero) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "-18% 0px -50% 0px" }
    );

    heroObserver.observe(hero);

    let footerObserver;
    if (footer) {
      footerObserver = new IntersectionObserver(
        ([entry]) => setFooterInView(entry.isIntersecting),
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
      footerObserver.observe(footer);
    }

    return () => {
      heroObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, [enabled]);

  return {
    showTopNav: heroInView,
    showDock: !heroInView && !footerInView,
  };
}

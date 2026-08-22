import { useEffect, useState } from "react";

export function useScrollNav(enabled) {
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const hero = document.getElementById("hero");
    if (!hero) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "-18% 0px -50% 0px" }
    );

    heroObserver.observe(hero);

    return () => {
      heroObserver.disconnect();
    };
  }, [enabled]);

  return {
    showTopNav: heroInView,
    showDock: !heroInView,
  };
}

import { useLayoutEffect, useRef } from "react";
import { MARQUEE } from "../data.js";
import { gsap } from "../lib/gsap.js";
import { prefersReducedMotion } from "../lib/motion.js";

export default function Marquee() {
  const root = useRef(null);
  const items = [...MARQUEE, ...MARQUEE];

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        root.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 92%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-y border-border bg-background py-4 sm:py-6"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <div className="flex min-w-full items-center gap-6 pr-6 sm:gap-10 sm:pr-10">
          {items.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-6 sm:gap-10">
              <span className="display-title whitespace-nowrap text-[clamp(1.85rem,7vw,4.2rem)] text-paper">
                {item}
              </span>
              <span className="size-2 rotate-45 bg-acid sm:size-2.5" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

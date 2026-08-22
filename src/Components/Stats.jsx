import { useLayoutEffect, useRef } from "react";
import { STATS } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";

export default function Stats({ ready }) {
  const root = useRef(null);
  useReveal(root, ready);

  useLayoutEffect(() => {
    if (!ready || !root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-value",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={root} className="section-y overflow-x-clip border-t border-border bg-background">
      <div className="wrap grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
        {STATS.map((stat) => (
          <div key={stat.label} className="reveal-item text-center md:text-left">
            <p className="stat-value display-title text-[clamp(2.5rem,8vw,5rem)] leading-none text-acid">
              {stat.value}
            </p>
            <p className="mt-2 font-condensed text-xs uppercase tracking-[0.22em] text-faint sm:tracking-[0.28em]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

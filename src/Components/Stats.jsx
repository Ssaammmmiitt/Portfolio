import { useLayoutEffect, useRef } from "react";
import { STATS } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { cn } from "../lib/utils.js";

function isSplitStat(value) {
  return value.includes("/");
}

function StatValue({ value }) {
  if (!isSplitStat(value)) {
    return value;
  }

  const [leading, trailing] = value.split("/");

  return (
    <span className="inline-flex flex-col items-center leading-[0.88] sm:inline sm:leading-none">
      <span>{leading}/</span>
      <span className="mt-0.5 sm:mt-0">{trailing}</span>
    </span>
  );
}

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
      <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-12 lg:grid-cols-4 lg:gap-x-14 lg:gap-y-0">
        {STATS.map((stat) => {
          const split = isSplitStat(stat.value);

          return (
            <div
              key={stat.label}
              className={cn(
                "reveal-item min-w-0 text-center md:text-left",
                split && "max-sm:col-span-2 max-sm:mx-auto max-sm:max-w-[16rem]"
              )}
            >
              <p
                className={cn(
                  "stat-value display-title text-acid",
                  split
                    ? "text-[clamp(1.85rem,7.5vw,5rem)] leading-[0.9] max-sm:normal-case sm:leading-none"
                    : "text-[clamp(2.25rem,8vw,5rem)] leading-none"
                )}
              >
                <StatValue value={stat.value} />
              </p>
              <p className="meta-label mt-2 tracking-[0.22em] sm:mt-3 sm:tracking-[0.28em]">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

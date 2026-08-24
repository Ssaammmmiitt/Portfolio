import { useLayoutEffect, useRef } from "react";
import { LEADERSHIP } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { prefersReducedMotion } from "../lib/motion.js";
import { cn } from "../lib/utils.js";

function LeadershipEntry({ item }) {
  return (
    <li className="leadership-item relative pl-10 sm:pl-12 md:pl-14">
      <span
        className={cn(
          "leadership-node absolute top-5 left-0 z-10 size-3 rounded-full border-2 bg-background transition-transform duration-300 sm:top-6 sm:size-3.5",
          item.highlight ? "border-acid bg-acid/20 shadow-[0_0_14px_var(--theme-accent)]" : "border-border-strong"
        )}
        aria-hidden="true"
      />

      <article
        className={cn(
          "rounded-xl border px-4 py-4 transition-[transform,border-color,box-shadow] duration-300 sm:px-5 sm:py-5 md:px-6",
          item.highlight
            ? "leadership-highlight"
            : "border-border/80 bg-muted/10 hover:border-border-strong hover:bg-muted/20"
        )}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="meta-label tracking-[0.22em] text-acid sm:tracking-[0.28em]">
            {item.year}
          </span>
          {item.highlight ? (
            <span className="rounded-full border border-acid/40 bg-acid/10 px-2.5 py-1 font-condensed text-[0.75rem] uppercase tracking-[0.14em] text-acid sm:text-xs">
              Featured
            </span>
          ) : null}
        </div>

        <h3 className="display-title mt-3 text-[clamp(2rem,6.5vw,3rem)] leading-[1.02] text-paper">
          {item.role}
        </h3>
        <p className="leadership-event meta-label mt-2.5 text-base font-medium tracking-[0.14em] sm:mt-3 sm:text-lg sm:tracking-[0.16em]">
          {item.event}
        </p>
        {item.detail ? (
          <p className="body-copy mt-2 max-w-prose sm:mt-2.5">
            {item.detail}
          </p>
        ) : null}
      </article>
    </li>
  );
}

export default function Leadership({ ready }) {
  const root = useRef(null);
  const trackFillRef = useRef(null);

  useReveal(root, ready);

  useLayoutEffect(() => {
    if (!ready || !root.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".leadership-item");
      const trackFill = trackFillRef.current;

      if (prefersReducedMotion()) {
        if (trackFill) gsap.set(trackFill, { scaleY: 1 });
        gsap.set(items, { opacity: 1, x: 0 });
        return;
      }

      if (trackFill) {
        gsap.set(trackFill, { scaleY: 0, transformOrigin: "top center" });
        gsap.to(trackFill, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            end: "bottom 68%",
            scrub: 0.45,
          },
        });
      }

      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".leadership-node",
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          stagger: 0.12,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="leadership"
      ref={root}
      className="section-y relative overflow-x-clip border-t border-border bg-background"
    >
      <div className="wrap">
        <div className="section-head max-w-3xl">
          <p className="reveal-kicker kicker">Leadership / extracurricular</p>
          <h2 className="reveal-title display-title text-[clamp(2.2rem,8vw,4.75rem)] text-paper">
            Beyond the
            <span className="text-subtle"> build</span>
          </h2>
          <p className="body-copy reveal-item mt-4 max-w-xl sm:mt-5">
            Hackathons, competitions, and campus events where I help teams ship and communities show up.
          </p>
        </div>

        <div className="relative mt-2 sm:mt-4">
          <div
            className="absolute top-2 bottom-2 left-[0.34rem] w-px bg-border sm:left-[0.42rem] md:left-[0.5rem]"
            aria-hidden="true"
          />
          <div
            ref={trackFillRef}
            className="leadership-track-fill absolute top-2 bottom-2 left-[0.34rem] w-px sm:left-[0.42rem] md:left-[0.5rem]"
            aria-hidden="true"
          />

          <ol className="flex flex-col gap-5 sm:gap-6 md:gap-7">
            {LEADERSHIP.map((item) => (
              <LeadershipEntry key={`${item.year}-${item.role}-${item.event}`} item={item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

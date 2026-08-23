import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { STRATEGY } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { isCompactViewport, prefersReducedMotion, syncScrollTriggers } from "../lib/motion.js";
import { isAlreadyInView } from "../lib/visitCache.js";

function StrategyHeader() {
  return (
    <div className="section-head">
      <p className="reveal-kicker kicker">strategy</p>
      <h2 className="reveal-title display-title text-[clamp(2.4rem,8vw,5rem)] text-paper">
        How i approach
        <br />
        <span className="text-faint">Every project</span>
      </h2>
      <p className="reveal-item mt-4 max-w-md text-sm leading-relaxed text-faint sm:mt-5">
        Five lenses that guide how I design, build, and ship software.
      </p>
    </div>
  );
}

function StrategyCard({ index, item, compact = false }) {
  const n = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`approach-card gpu-layer relative flex w-full origin-center flex-col justify-between overflow-hidden rounded-xl border border-border/40 p-4 sm:p-5 md:p-6 ${
        compact
          ? "mx-auto h-[min(28svh,300px)] max-w-[720px]"
          : "h-full min-h-[220px] lg:min-h-[240px]"
      }`}
      style={{ background: item.bg, color: item.fg }}
    >
      <div
        className="pointer-events-none absolute -right-2 -bottom-4 font-display text-[min(22vw,7rem)] leading-none opacity-[0.1] select-none md:-right-3 md:-bottom-5"
        style={{ color: item.accent }}
      >
        {n}
      </div>

      <p
        className={`relative font-condensed font-medium uppercase ${
          compact
            ? "text-[clamp(1.15rem,5.5vw,1.55rem)] tracking-[0.12em]"
            : "text-[0.6rem] tracking-[0.2em] sm:text-[0.65rem] sm:tracking-[0.28em]"
        }`}
        style={{ color: item.accent }}
      >
        {n}  -  {item.kicker}
      </p>

      <div className={`relative mt-auto max-w-xl ${compact ? "pt-4" : "pt-6"}`}>
        <h3
          className={`display-title ${
            compact
              ? "text-[clamp(1.85rem,7.5vw,2.65rem)] leading-[1.05]"
              : "text-[clamp(1.35rem,3.8vw,2.25rem)]"
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed opacity-75 sm:text-[0.88rem] md:text-[0.92rem]">
          {item.text}
        </p>
      </div>
    </div>
  );
}

function StackedStrategy({ ready }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!ready || !root.current) return;

    const compact = isCompactViewport();

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(".approach-slide");
      if (prefersReducedMotion()) return;

      slides.forEach((slide, index) => {
        const card = slide.querySelector(".approach-card");
        const isLast = index === slides.length - 1;

        gsap.fromTo(
          card,
          { scale: 1, opacity: 1 },
          {
            scale: isLast ? 1 : compact ? 0.9 : 0.86,
            opacity: isLast ? 1 : 0.65,
            ease: "none",
            transformOrigin: "center center",
            scrollTrigger: {
              trigger: slide,
              start: "top center",
              end: "bottom top",
              scrub: compact ? 0.3 : 0.55,
            },
          }
        );
      });
    }, root);

    syncScrollTriggers();

    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={root} className="relative pb-[8svh]">
      {STRATEGY.map((item, i) => (
        <article
          key={item.title}
          className="approach-slide relative h-[34svh] sm:h-[36svh]"
          style={{ zIndex: i + 1 }}
        >
          <div className="sticky top-[calc(50svh-min(14svh,160px))] flex justify-center px-3 sm:px-[4vw]">
            <StrategyCard index={i} item={item} compact />
          </div>
        </article>
      ))}
    </div>
  );
}

function GridStrategy({ ready, gridRef }) {
  useLayoutEffect(() => {
    if (!ready || !gridRef.current) return;

    const compact = isCompactViewport();
    const alreadySeen = isAlreadyInView(gridRef.current);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".approach-grid-card");

      if (prefersReducedMotion() || alreadySeen) {
        gsap.set(cards, { y: 0, opacity: 1, scale: 1 });
        return;
      }

      gsap.fromTo(
        cards,
        { y: compact ? 32 : 56, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: compact ? 0.75 : 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, gridRef);

    syncScrollTriggers();

    return () => ctx.revert();
  }, [ready, gridRef]);

  return (
    <div ref={gridRef} className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
      {STRATEGY.map((item, i) => (
        <article key={item.title} className="approach-grid-card reveal-item">
          <StrategyCard index={i} item={item} />
        </article>
      ))}
    </div>
  );
}

export default function Strategy({ ready }) {
  const root = useRef(null);
  const gridRef = useRef(null);
  const [wideLayout, setWideLayout] = useState(false);

  useReveal(root, ready);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setWideLayout(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    syncScrollTriggers();
  }, [wideLayout]);

  return (
    <section id="strategy" ref={root} className="relative overflow-x-clip bg-background">
      <div className="wrap section-y">
        {wideLayout ? (
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-20">
            <div className="min-w-0 lg:col-span-4 xl:col-span-3 lg:sticky lg:top-8 lg:self-start xl:top-28">
              <StrategyHeader />
            </div>
            <div className="min-w-0 lg:col-span-8 xl:col-span-9">
              <GridStrategy ready={ready} gridRef={gridRef} />
            </div>
          </div>
        ) : (
          <>
            <StrategyHeader />
            <StackedStrategy ready={ready} />
          </>
        )}
      </div>
    </section>
  );
}

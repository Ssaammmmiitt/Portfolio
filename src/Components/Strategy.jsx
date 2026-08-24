import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { STRATEGY } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { isCompactViewport, prefersReducedMotion, syncScrollTriggers } from "../lib/motion.js";
import { isAlreadyInView } from "../lib/visitCache.js";
import { cn } from "../lib/utils.js";

function StrategyHeader({ compact = false, open = false }) {
  return (
    <div className={compact ? "min-w-0" : "section-head"}>
      <p className="reveal-kicker kicker">strategy</p>
      <h2 className="reveal-title display-title text-[clamp(2rem,7.5vw,5rem)] text-paper">
        How i approach
        <br />
        <span className="text-subtle">Every project</span>
      </h2>
      {!open ? (
        <p
          className={cn(
            "body-copy reveal-item max-w-prose",
            compact ? "mt-3 sm:mt-4" : "mt-4 sm:mt-5"
          )}
        >
          Five lenses that guide how I design, build, and ship software.
        </p>
      ) : null}
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
            : "text-[0.7rem] tracking-[0.18em] sm:text-xs sm:tracking-[0.28em]"
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
        <p className="mt-2 text-[0.9rem] leading-relaxed opacity-85 sm:text-[0.95rem] md:text-base">
          {item.text}
        </p>
      </div>
    </div>
  );
}

function MobileStrategyList({ ready, open, listRef }) {
  useLayoutEffect(() => {
    if (!ready || !open || !listRef.current) return;

    const alreadySeen = isAlreadyInView(listRef.current);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".approach-mobile-card");

      if (prefersReducedMotion() || alreadySeen) {
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        cards,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, listRef);

    syncScrollTriggers();

    return () => ctx.revert();
  }, [ready, open, listRef]);

  return (
    <div ref={listRef} className="flex flex-col gap-4 sm:gap-5">
      {STRATEGY.map((item, i) => (
        <article key={item.title} className="approach-mobile-card">
          <StrategyCard index={i} item={item} />
        </article>
      ))}
    </div>
  );
}

function GridStrategy({ ready, open, gridRef }) {
  useLayoutEffect(() => {
    if (!ready || !open || !gridRef.current) return;

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
  }, [ready, open, gridRef]);

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
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [wideLayout, setWideLayout] = useState(false);
  const reduceMotion = prefersReducedMotion();

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
  }, [wideLayout, open]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => syncScrollTriggers(), reduceMotion ? 0 : 520);
    return () => window.clearTimeout(timer);
  }, [open, reduceMotion]);

  const toggle = () => setOpen((value) => !value);

  return (
    <section
      id="strategy"
      ref={root}
      className={cn(
        "relative bg-background",
        open ? "section-y" : "py-10 sm:py-12 md:py-14"
      )}
    >
      <div className="wrap">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="strategy-panel"
          onClick={toggle}
          className="group strategy-toggle reveal-item flex w-full min-w-0 cursor-pointer flex-col gap-4 rounded-2xl px-4 py-4 text-left transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acid sm:gap-5 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8"
        >
          <StrategyHeader compact open={open} />

          <div className="flex shrink-0 items-center justify-between gap-3 lg:flex-col lg:items-end lg:justify-center lg:gap-2.5">
            <span
              className={cn(
                "font-condensed text-[0.68rem] uppercase tracking-[0.18em] transition-colors duration-200 sm:text-xs sm:tracking-[0.22em]",
                open
                  ? "text-subtle group-hover:text-paper"
                  : "text-faint group-hover:text-acid [@media(hover:hover)]:text-subtle"
              )}
            >
              {open ? "Click to collapse" : "Click to explore"}
            </span>

            <span
              className={cn(
                "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-border-strong bg-background/80 text-paper transition-[transform,border-color,color,background-color] duration-300 group-hover:border-acid group-hover:text-acid",
                open && "border-acid/60 bg-acid/10 text-acid"
              )}
              aria-hidden="true"
            >
              <FiChevronDown
                size={18}
                className={cn(
                  "transition-transform duration-300",
                  open && "rotate-180",
                  !open && "group-hover:translate-y-0.5"
                )}
              />
            </span>
          </div>
        </button>

        <div
          id="strategy-panel"
          ref={panelRef}
          aria-hidden={!open}
          className={cn(
            "grid",
            !reduceMotion && "transition-[grid-template-rows,margin-top] duration-500 ease-out",
            open ? "mt-8 grid-rows-[1fr] sm:mt-10 md:mt-12" : "mt-0 grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden min-h-0">
            {open ? (
              <div className="strategy-panel-open rounded-2xl px-3 py-5 sm:px-4 sm:py-6 md:px-5 md:py-7">
                {wideLayout ? (
                  <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-20">
                    <div className="min-w-0 lg:col-span-4 xl:col-span-3">
                      <p className="body-copy max-w-md">
                        Five lenses that guide how I design, build, and ship software.
                      </p>
                    </div>
                    <div className="min-w-0 lg:col-span-8 xl:col-span-9">
                      <GridStrategy ready={ready} open={open} gridRef={gridRef} />
                    </div>
                  </div>
                ) : (
                  <MobileStrategyList ready={ready} open={open} listRef={listRef} />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

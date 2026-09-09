import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { LEADERSHIP } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { prefersReducedMotion, syncScrollTriggers } from "../lib/motion.js";
import { isAlreadyInView } from "../lib/visitCache.js";
import { cn } from "../lib/utils.js";

function LeadershipHeader({ compact = false, open = false }) {
  return (
    <div className={compact ? "min-w-0" : "section-head"}>
      <p className="reveal-kicker kicker text-[1rem] tracking-[0.2em] sm:text-[1.125rem] sm:tracking-[0.26em]">
        Leadership / extracurricular
      </p>
      <h2 className="reveal-title display-title text-[clamp(2.2rem,8vw,4.75rem)] text-paper">
        Beyond the
        <span className="text-subtle"> build</span>
      </h2>
      {!open ? (
        <p
          className={cn(
            "body-copy reveal-item max-w-xl",
            compact ? "mt-3 sm:mt-4" : "mt-4 sm:mt-5"
          )}
        >
          Hackathons, competitions, and campus events where I help teams ship and communities show up.
        </p>
      ) : null}
    </div>
  );
}

function LeadershipEntry({ item }) {
  return (
    <li className="leadership-item relative pl-10 sm:pl-12 md:pl-14">
      <span
        className={cn(
          "leadership-node absolute top-5 left-0 z-10 size-3 rounded-full border-2 bg-background transition-transform duration-300 sm:top-6 sm:size-3.5",
          item.highlight
            ? "border-acid bg-acid/20 shadow-[0_0_14px_var(--theme-accent)]"
            : "border-border-strong"
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
            <span className="rounded-full border border-acid/40 bg-acid/10 px-2.5 py-1 font-heading text-[0.75rem] uppercase tracking-[0.14em] text-acid sm:text-xs">
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
          <p className="body-copy mt-2 max-w-prose sm:mt-2.5">{item.detail}</p>
        ) : null}
      </article>
    </li>
  );
}

function LeadershipTimeline({ ready, open, listRef, trackFillRef }) {
  useLayoutEffect(() => {
    if (!ready || !open || !listRef.current) return;

    const alreadySeen = isAlreadyInView(listRef.current);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".leadership-item");
      const trackFill = trackFillRef.current;

      if (prefersReducedMotion() || alreadySeen) {
        if (trackFill) gsap.set(trackFill, { scaleY: 1 });
        gsap.set(items, { opacity: 1, y: 0 });
        gsap.set(".leadership-node", { scale: 1, opacity: 1 });
        return;
      }

      if (trackFill) {
        gsap.set(trackFill, { scaleY: 0, transformOrigin: "top center" });
        gsap.to(trackFill, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 78%",
            end: "bottom 70%",
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
            trigger: listRef.current,
            start: "top 82%",
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
            trigger: listRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, listRef);

    syncScrollTriggers();

    return () => ctx.revert();
  }, [ready, open, listRef, trackFillRef]);

  return (
    <div ref={listRef} className="relative">
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
  );
}

export default function Leadership({ ready }) {
  const root = useRef(null);
  const listRef = useRef(null);
  const trackFillRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const reduceMotion = prefersReducedMotion();

  useReveal(root, ready);

  useEffect(() => {
    syncScrollTriggers();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => syncScrollTriggers(), reduceMotion ? 0 : 520);
    return () => window.clearTimeout(timer);
  }, [open, reduceMotion]);

  const toggle = () => setOpen((value) => !value);

  return (
    <section
      id="leadership"
      ref={root}
      className={cn(
        "relative overflow-x-clip border-t border-border bg-background",
        open ? "section-y" : "py-10 sm:py-12 md:py-14"
      )}
    >
      <div className="wrap">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="leadership-panel"
          onClick={toggle}
          className="group leadership-toggle reveal-item flex w-full min-w-0 cursor-pointer flex-col gap-4 rounded-2xl px-4 py-4 text-left transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acid sm:gap-5 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8"
        >
          <LeadershipHeader compact open={open} />

          <div className="flex shrink-0 items-center justify-between gap-3 lg:flex-col lg:items-end lg:justify-center lg:gap-2.5">
            <span
              className={cn(
                "font-heading text-[0.68rem] uppercase tracking-[0.18em] transition-colors duration-200 sm:text-xs sm:tracking-[0.22em]",
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
          id="leadership-panel"
          ref={panelRef}
          aria-hidden={!open}
          className={cn(
            "grid",
            !reduceMotion && "transition-[grid-template-rows,margin-top] duration-500 ease-out",
            open ? "mt-8 grid-rows-[1fr] sm:mt-10 md:mt-12" : "mt-0 grid-rows-[0fr]"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            {open ? (
              <div className="leadership-panel-open rounded-2xl px-3 py-5 sm:px-4 sm:py-6 md:px-5 md:py-7">
                <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-20">
                  <div className="hidden min-w-0 lg:col-span-4 lg:block xl:col-span-3">
                    <p className="body-copy max-w-md">
                      Hackathons, competitions, and campus events where I help teams ship and
                      communities show up.
                    </p>
                  </div>
                  <div className="min-w-0 lg:col-span-8 xl:col-span-9">
                    <LeadershipTimeline
                      ready={ready}
                      open={open}
                      listRef={listRef}
                      trackFillRef={trackFillRef}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

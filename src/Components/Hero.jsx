import { useLayoutEffect, useRef } from "react";
import { GibberishSplitChars } from "./GibberishText.jsx";
import { AVAILABILITY, LOCATION, NAME, ROLE } from "../data.js";
import { gsap } from "../lib/gsap.js";
import { isCompactViewport, prefersReducedMotion, syncScrollTriggers } from "../lib/motion.js";

function SplitChars({ text, className, instant }) {
  return (
    <span>
      {text.split("").map((ch, i) => (
        <span key={`${ch}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span className={`${className} inline-block ${instant ? "translate-y-0" : "translate-y-[110%]"}`}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

const META = [LOCATION, "Specialized in AI, Frontend & Backend", AVAILABILITY];

export default function Hero({ animate, instant }) {
  const root = useRef(null);
  const names = NAME.split(" ");
  const nameSettled = instant || prefersReducedMotion();

  useLayoutEffect(() => {
    if (!animate || !root.current) return;

    if (instant) {
      gsap.set(root.current.querySelectorAll(".hero-sub-letter, .hero-name-letter"), { y: "0%" });
      gsap.set(root.current.querySelectorAll(".hero-meta, .hero-scroll"), { y: 0, opacity: 1 });
    }

    const compact = isCompactViewport();

    const ctx = gsap.context(() => {
      if (!instant) {
        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
        tl.to(".hero-sub-letter", {
          y: "0%",
          duration: compact ? 0.8 : 1.15,
          stagger: { each: compact ? 0.018 : 0.028, from: "center" },
        })
          .to(
            ".hero-name-letter",
            {
              y: "0%",
              duration: compact ? 1.05 : 1.55,
              stagger: { each: compact ? 0.02 : 0.032, from: "center" },
            },
            0.08
          )
          .to(
            ".hero-meta, .hero-scroll",
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
            compact ? 0.85 : 1.35
          );
      }

      if (!prefersReducedMotion()) {
        gsap.to(".hero-stage", {
          scale: compact ? 0.92 : 0.78,
          y: compact ? -24 : -64,
          opacity: compact ? 0.35 : 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: compact ? 0.4 : 0.8,
          },
        });
      }
    }, root);

    syncScrollTriggers();

    return () => ctx.revert();
  }, [animate, instant]);

  return (
    <section id="hero" ref={root} className="relative min-h-dvh w-full overflow-x-clip bg-background">
      <div className="absolute inset-0">
        <div className="hero-radial absolute inset-0" />
        <div className="animate-drift orb absolute top-[10%] left-[12%] size-[min(70vw,28rem)] rounded-full bg-primary/25 blur-[70px] md:size-[42vw] md:blur-[140px]" />
        <div className="animate-drift orb absolute right-[6%] bottom-[10%] hidden size-[32vw] rounded-full bg-acid/20 blur-[120px] [animation-delay:-6s] md:block" />
        <div className="hero-fade absolute inset-0" />
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      </div>

      <div className="hero-stage gpu-layer wrap relative z-10 flex min-h-dvh origin-bottom flex-col justify-end pt-24 pb-[max(7rem,env(safe-area-inset-bottom))] sm:pt-28 sm:pb-32 md:pb-40 lg:pb-48">
        <p className="mb-3 text-center font-condensed text-[clamp(0.72rem,2.4vw,1.05rem)] uppercase tracking-[0.28em] text-subtle sm:mb-4 sm:tracking-[0.45em]">
          <SplitChars text={ROLE} className="hero-sub-letter" instant={instant} />
        </p>
        <h1 className="display-title flex flex-wrap justify-center gap-x-[0.18em] text-center text-[clamp(3.2rem,16vw,13rem)] leading-[0.8] tracking-wide text-paper">
          {names.map((part) => (
            <span key={part}>
              <GibberishSplitChars
                text={part}
                className="hero-name-letter"
                instant={instant}
                settled={nameSettled}
              />
            </span>
          ))}
        </h1>

        <div className="mt-10 mb-2 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:mt-14 sm:grid-cols-2 sm:gap-y-4 lg:mt-20 lg:grid-cols-3 lg:pt-8">
          {META.map((item, i) => (
            <p
              key={item}
              className={`hero-meta text-sm text-subtle max-md:text-xs ${
                i === 1 ? "sm:text-right lg:text-center" : ""
              } ${i === 2 ? "lg:col-span-1 lg:text-right sm:max-lg:col-span-2" : ""} ${
                instant ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        <p
          className={`hero-scroll mt-6 text-center font-condensed text-[0.65rem] tracking-[0.32em] text-acid uppercase sm:mt-8 sm:text-[0.7rem] sm:tracking-[0.4em] ${
            instant ? "opacity-100" : "opacity-0"
          }`}
        >
          Scroll to enter{" "}
          <span className="text-faint normal-case tracking-[0.24em]">(spacebar)</span>
        </p>
      </div>
    </section>
  );
}

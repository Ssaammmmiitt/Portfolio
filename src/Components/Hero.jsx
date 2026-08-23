import { useLayoutEffect, useRef } from "react";
import { GibberishSplitChars } from "./GibberishText.jsx";
import { AVAILABILITY, LOCATION, NAME, ROLE } from "../data.js";
import { gsap } from "../lib/gsap.js";
import { isCompactViewport, prefersReducedMotion, syncScrollTriggers } from "../lib/motion.js";
import { cn } from "../lib/utils.js";

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

export default function Hero({ animate, instant, onIntroReady }) {
  const root = useRef(null);
  const names = NAME.split(" ");
  const nameSettled = instant || prefersReducedMotion();

  useLayoutEffect(() => {
    if (!animate || !root.current) return;

    const introReady = () => onIntroReady?.();

    if (instant || prefersReducedMotion()) {
      gsap.set(root.current.querySelectorAll(".hero-sub-letter, .hero-name-letter"), { y: "0%" });
      gsap.set(root.current.querySelectorAll(".hero-meta, .hero-scroll"), { y: 0, opacity: 1 });
      introReady();
    }

    const compact = isCompactViewport();

    const ctx = gsap.context(() => {
      if (!instant && !prefersReducedMotion()) {
        const tl = gsap.timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: introReady,
        });
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
  }, [animate, instant, onIntroReady]);

  return (
    <section id="hero" ref={root} className="relative min-h-dvh w-full overflow-x-clip bg-background">
      <div className="absolute inset-0">
        <div className="hero-radial absolute inset-0" />
        <div className="animate-drift orb absolute top-[18%] left-[8%] size-[min(62vw,22rem)] rounded-full bg-primary/25 blur-[60px] md:top-[10%] md:left-[12%] md:size-[min(70vw,28rem)] md:blur-[140px]" />
        <div className="animate-drift orb absolute right-[6%] bottom-[10%] hidden size-[32vw] rounded-full bg-acid/20 blur-[120px] [animation-delay:-6s] md:block" />
        <div className="hero-fade absolute inset-0" />
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      </div>

      <div
        className={cn(
          "hero-stage gpu-layer wrap relative z-10 flex min-h-dvh flex-col",
          "pt-[max(6rem,calc(env(safe-area-inset-top)+4.75rem))]",
          "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
          "sm:pt-[max(6.25rem,calc(env(safe-area-inset-top)+5rem))]",
          "md:origin-bottom md:pt-[34vh] md:pb-36",
          "lg:pt-[40vh] lg:pb-40",
          "xl:pt-[38vh] xl:pb-44"
        )}
      >
        <div className="flex flex-1 flex-col justify-center gap-8 max-md:max-w-lg max-md:mx-auto md:justify-between md:gap-0">
          <div className="flex shrink-0 flex-col items-center text-center">
            <h1 className="order-1 display-title flex max-w-full flex-wrap justify-center gap-x-[0.14em] text-[clamp(2.5rem,11.5vw,13rem)] leading-[0.82] tracking-wide text-paper sm:gap-x-[0.18em] sm:text-[clamp(2.85rem,12vw,13rem)] sm:leading-[0.8] md:order-2 md:text-[clamp(3.2rem,16vw,13rem)]">
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
            <p className="order-2 mt-3 max-w-[22rem] text-pretty font-condensed text-[clamp(0.62rem,2.6vw,1.05rem)] uppercase leading-relaxed tracking-[0.18em] text-subtle sm:mt-3.5 sm:max-w-none sm:tracking-[0.32em] md:order-1 md:mt-0 md:mb-3 md:tracking-[0.45em] lg:mb-3.5">
              <SplitChars text={ROLE} className="hero-sub-letter" instant={instant} />
            </p>
          </div>

          <div className="w-full shrink-0 md:max-w-none">
            <div className="grid min-w-0 grid-cols-1 gap-2.5 border-t border-border pt-5 sm:grid-cols-2 sm:gap-3 sm:gap-y-4 sm:pt-6 md:gap-3 md:pt-6 lg:grid-cols-3 lg:gap-4 lg:pt-8">
              {META.map((item, i) => (
                <p
                  key={item}
                  className={cn(
                    "hero-meta min-w-0 text-xs leading-relaxed text-subtle sm:text-sm",
                    "max-md:mx-auto max-md:max-w-xs max-md:text-center max-md:text-pretty",
                    i === 1 && "sm:text-right lg:text-center",
                    i === 2 && "sm:col-span-2 lg:col-span-1 lg:text-right",
                    instant ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  )}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <p
          className={cn(
            "hero-scroll shrink-0 pt-5 text-center font-condensed text-[0.65rem] tracking-[0.28em] text-acid uppercase",
            "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
            "sm:pt-6 sm:text-[0.7rem] sm:tracking-[0.36em]",
            "md:pt-8 md:tracking-[0.4em]",
            instant ? "opacity-100" : "opacity-0"
          )}
        >
          Scroll to enter{" "}
          <span className="text-faint normal-case tracking-[0.22em] sm:tracking-[0.24em]">(spacebar)</span>
        </p>
      </div>
    </section>
  );
}

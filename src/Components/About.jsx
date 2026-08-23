import { useLayoutEffect, useRef } from "react";
import { BIO_TEXTS } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { prefersReducedMotion, SCROLL_TEXT_VARS } from "../lib/motion.js";

function splitWords(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function HighlightText({ texts, ready }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ready || !ref.current) return;

    const root = ref.current;
    const words = root.querySelectorAll("[data-word]");
    if (!words.length) return;

    // Prevent duplicate triggers from StrictMode remounts / HMR.
    ScrollTrigger.getById?.("about-bio")?.kill();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(words, { color: SCROLL_TEXT_VARS.paper });
        return;
      }

      // Set once; animate with `to` (not `fromTo`) so refresh won't re-flash the from state.
      gsap.set(words, { color: SCROLL_TEXT_VARS.mutedWord });

      gsap.to(words, {
        color: SCROLL_TEXT_VARS.paper,
        ease: "none",
        stagger: 0.035,
        immediateRender: false,
        scrollTrigger: {
          id: "about-bio",
          trigger: root,
          start: "top 78%",
          end: "bottom 58%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => {
      ScrollTrigger.getById?.("about-bio")?.kill();
      ctx.revert();
    };
  }, [ready]);

  return (
    <div ref={ref} className="flex flex-col gap-6 sm:gap-7 md:gap-8">
      {texts.map((text) => (
        <p
          key={text.slice(0, 32)}
          className="text-[1.0625rem] leading-[1.75] text-pretty sm:text-[1.125rem] sm:leading-[1.8]"
        >
          {splitWords(text).map((word, i, list) => (
            <span key={`${word}-${i}`} data-word="" className="text-[var(--theme-muted-word)]">
              {word}
              {i < list.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export default function About({ ready }) {
  const root = useRef(null);
  useReveal(root, ready);

  return (
    <section id="about" ref={root} className="section-y relative overflow-x-clip bg-background">
      <div className="wrap">
        <div className="flex flex-col gap-10 sm:gap-12 lg:flex-row lg:items-start lg:gap-16 xl:gap-20">
          <div className="w-full shrink-0 lg:w-[min(100%,18rem)] xl:w-[min(100%,22rem)]">
            <p className="reveal-kicker kicker">about</p>
            <h2 className="reveal-title display-title text-[clamp(2.75rem,10vw,5.5rem)] text-paper">
              Software
              <span className="mt-1 block text-acid">Engineer</span>
            </h2>
          </div>

          <div className="min-w-0 flex-1 lg:max-w-2xl xl:max-w-xl">
            <HighlightText texts={BIO_TEXTS} ready={ready} />
          </div>
        </div>
      </div>
    </section>
  );
}

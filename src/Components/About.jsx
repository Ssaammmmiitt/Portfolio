import { useLayoutEffect, useRef } from "react";
import { BIO_TEXTS } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { getScrollTextColors, syncScrollTriggers, updateScrubTweenColor } from "../lib/motion.js";

function HighlightText({ texts, ready }) {
  const ref = useRef(null);
  const tweensRef = useRef([]);
  const { theme } = useTheme();

  useLayoutEffect(() => {
    if (!ready || !ref.current) return;

    const ctx = gsap.context(() => {
      tweensRef.current = [];
      const { paper, mutedWord } = getScrollTextColors("dark");

      ref.current.querySelectorAll("[data-copy]").forEach((paragraph) => {
        const words = paragraph.querySelectorAll("[data-word]");
        const tween = gsap.fromTo(
          words,
          { color: mutedWord },
          {
            color: paper,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: paragraph,
              start: "top 88%",
              end: "top 42%",
              scrub: 0.5,
            },
          }
        );
        tweensRef.current.push(tween);
      });
    }, ref);

    syncScrollTriggers();

    return () => {
      tweensRef.current = [];
      ctx.revert();
    };
  }, [ready]);

  useLayoutEffect(() => {
    if (!ready || !tweensRef.current.length) return;

    const { paper, mutedWord } = getScrollTextColors(theme);

    tweensRef.current.forEach((tween) => {
      if (typeof tween?.progress !== "function") return;
      tween.vars.from = { color: mutedWord };
      updateScrubTweenColor(tween, paper);
    });

    syncScrollTriggers();
  }, [theme, ready]);

  return (
    <div ref={ref} className="flex flex-col gap-y-6 text-base leading-[1.75] sm:gap-y-8 sm:text-lg sm:leading-[1.8]">
      {texts.map((text) => (
        <p key={text.slice(0, 24)} data-copy="">
          {text.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} data-word="" className="mr-[0.28em] inline-block">
              {word}
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
      <div className="wrap grid items-start gap-12 md:grid-cols-12 md:gap-10 lg:gap-14 xl:gap-20">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="md:sticky md:top-28">
            <h2 className="reveal-title font-display text-[clamp(3.4rem,12vw,8.5rem)] leading-[0.8] uppercase text-paper">
              Software
              <span className="block text-acid">Engineer</span>
            </h2>
          </div>
        </div>
        <div className="md:col-span-7 lg:col-span-8">
          <HighlightText texts={BIO_TEXTS} ready={ready} />
        </div>
      </div>
    </section>
  );
}

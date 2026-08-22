import { useLayoutEffect, useRef } from "react";
import { BIO_TEXTS } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { refreshScrubTween, SCROLL_TEXT_VARS, syncScrollTriggers } from "../lib/motion.js";

function HighlightText({ texts, ready }) {
  const ref = useRef(null);
  const tweensRef = useRef([]);
  const { theme } = useTheme();

  useLayoutEffect(() => {
    if (!ready || !ref.current) return;

    const ctx = gsap.context(() => {
      tweensRef.current = [];

      ref.current.querySelectorAll("[data-copy]").forEach((paragraph) => {
        const words = paragraph.querySelectorAll("[data-word]");
        const tween = gsap.fromTo(
          words,
          { color: SCROLL_TEXT_VARS.mutedWord },
          {
            color: SCROLL_TEXT_VARS.paper,
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

    tweensRef.current.forEach((tween) => refreshScrubTween(tween));
    syncScrollTriggers();
  }, [theme, ready]);

  return (
    <div ref={ref} className="flex max-w-2xl flex-col gap-y-6 text-base leading-[1.75] sm:gap-y-8 sm:text-lg sm:leading-[1.8] lg:max-w-none">
      {texts.map((text) => (
        <p key={text.slice(0, 24)} data-copy="" className="text-pretty">
          {text.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} data-word="" className="mr-[0.28em] inline">
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
      <div className="wrap grid items-start gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-14 xl:gap-x-20">
        <div className="min-w-0 lg:col-span-4 xl:col-span-4">
          <div className="lg:sticky lg:top-8 lg:max-w-[18rem] lg:self-start xl:top-28 xl:max-w-none">
            <h2 className="reveal-title font-display text-[clamp(2.75rem,11vw,5.5rem)] leading-[0.82] uppercase text-paper lg:text-[clamp(3rem,6.5vw,7rem)] xl:text-[clamp(3.4rem,7vw,8.5rem)]">
              Software
              <span className="block text-acid">Engineer</span>
            </h2>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8 xl:col-span-8">
          <HighlightText texts={BIO_TEXTS} ready={ready} />
        </div>
      </div>
    </section>
  );
}

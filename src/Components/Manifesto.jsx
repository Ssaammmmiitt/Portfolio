import { useLayoutEffect, useRef } from "react";
import { MANIFESTO_BODY, MANIFESTO_BODY_HIGHLIGHT, MANIFESTO_LINES } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import MouseFollowingEyes from "./MouseFollowingEyes.jsx";
import { gsap } from "../lib/gsap.js";
import {
  isCompactViewport,
  prefersReducedMotion,
  MANIFESTO_VARS,
  refreshScrubTimeline,
  syncScrollTriggers,
} from "../lib/motion.js";

function accentMode({ accent, softAccent }) {
  if (accent) return "true";
  if (softAccent) return "soft";
  return "false";
}

function Word({ children, accent, softAccent }) {
  return (
    <>
      <span
        data-word=""
        data-accent={accentMode({ accent, softAccent })}
        className="inline-block"
      >
        {accent ? (
          <span className="relative">
            {children}
            <span className="absolute top-[88%] left-0 h-px w-full origin-left bg-current opacity-70" />
          </span>
        ) : (
          children
        )}
      </span>{" "}
    </>
  );
}

function Line({ line, highlight }) {
  const words = line.split(" ");

  return (
    <h2 className="display-title text-[clamp(2.15rem,11vw,7.8rem)]">
      {words.map((word) => (
        <Word key={`${line}-${word}`} accent={word === highlight}>
          {word}
        </Word>
      ))}
    </h2>
  );
}

function getBodyWords(body, highlightPhrase) {
  const start = body.indexOf(highlightPhrase);
  const end = start === -1 ? -1 : start + highlightPhrase.length;
  let searchFrom = 0;

  return body.split(" ").map((word, index) => {
    const wordStart = body.indexOf(word, searchFrom);
    searchFrom = wordStart + word.length + 1;
    const softAccent = start !== -1 && wordStart >= start && wordStart < end;

    return { word, index, softAccent };
  });
}

function applyManifestoStaticColors(root) {
  const accents = root.querySelectorAll('[data-accent="true"]');
  const softAccents = root.querySelectorAll('[data-accent="soft"]');
  const rest = root.querySelectorAll('[data-accent="false"]');

  gsap.set(rest, { color: MANIFESTO_VARS.paper, y: 0, opacity: 1 });
  gsap.set(accents, { color: MANIFESTO_VARS.accent, y: 0, opacity: 1 });
  gsap.set(softAccents, { color: MANIFESTO_VARS.accentSoft, y: 0, opacity: 1 });
}

export default function Manifesto({ ready }) {
  const root = useRef(null);
  const pin = useRef(null);
  const timelineRef = useRef(null);
  const colorTweensRef = useRef({ rest: null, soft: null, accent: null });
  const { theme } = useTheme();
  const bodyWords = getBodyWords(MANIFESTO_BODY, MANIFESTO_BODY_HIGHLIGHT);

  useLayoutEffect(() => {
    if (!ready || !root.current) return;

    const words = root.current.querySelectorAll("[data-word]");
    const accents = root.current.querySelectorAll('[data-accent="true"]');
    const softAccents = root.current.querySelectorAll('[data-accent="soft"]');
    const rest = root.current.querySelectorAll('[data-accent="false"]');
    const compact = isCompactViewport();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        applyManifestoStaticColors(root.current);
        return;
      }

      gsap.set(words, {
        color: MANIFESTO_VARS.muted,
        y: compact ? 10 : 28,
        opacity: 0.55,
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: "bottom bottom",
          scrub: compact ? 0.45 : 0.85,
        },
      });

      tl.to(words, { y: 0, opacity: 1, stagger: compact ? 0.05 : 0.08, duration: 0.6 }, 0);
      colorTweensRef.current.rest = tl.to(
        rest,
        { color: MANIFESTO_VARS.paper, stagger: compact ? 0.06 : 0.1, duration: 0.7 },
        0.05
      );
      colorTweensRef.current.soft = tl.to(
        softAccents,
        { color: MANIFESTO_VARS.accentSoft, stagger: 0.04, duration: 0.65 },
        0.08
      );
      colorTweensRef.current.accent = tl.to(
        accents,
        { color: MANIFESTO_VARS.accent, stagger: 0.1, duration: 0.7 },
        0.12
      );

      timelineRef.current = tl;
    }, root);

    syncScrollTriggers();

    return () => {
      timelineRef.current = null;
      colorTweensRef.current = { rest: null, soft: null, accent: null };
      ctx.revert();
    };
  }, [ready]);

  useLayoutEffect(() => {
    if (!ready || !root.current) return;

    if (prefersReducedMotion()) {
      applyManifestoStaticColors(root.current);
      return;
    }

    const tl = timelineRef.current;
    if (!tl) return;

    refreshScrubTimeline(tl);
    syncScrollTriggers();
  }, [theme, ready]);

  return (
    <section id="manifesto" ref={root} className="relative overflow-x-clip bg-background">
      <div
        ref={pin}
        className="relative h-[165vh] motion-reduce:h-auto sm:h-[190vh] md:h-[220vh] lg:h-[240vh]"
      >
        <div className="sticky top-0 flex min-h-dvh items-start overflow-x-clip pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.25rem))] pb-10 sm:items-center sm:py-20 lg:py-28 motion-reduce:relative motion-reduce:py-20">
          <div className="noise pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />
          <div
            className="pointer-events-none absolute top-1/2 right-[clamp(1rem,3vw,4rem)] z-10 hidden -translate-y-1/2 xl:block"
            aria-hidden="true"
          >
            <MouseFollowingEyes />
          </div>
          <div className="wrap relative w-full min-w-0">
            <div className="mb-8 flex items-end justify-between gap-8 sm:mb-10 md:mb-14">
              <p className="kicker mb-0!">manifesto</p>
              <p className="hidden max-w-xs text-right text-xs leading-relaxed tracking-[0.18em] text-faint uppercase md:block">
                Scroll  -  the words come alive
              </p>
            </div>

            <div className="relative flex flex-col gap-1 lg:max-w-[92%] xl:max-w-none xl:pr-[11rem]">
              {MANIFESTO_LINES.map((entry) => (
                <Line key={entry.line} {...entry} />
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-[clamp(1rem,2.4vw,1.65rem)] leading-[1.55] font-light text-soft sm:mt-12 md:mt-16">
              {bodyWords.map(({ word, index, softAccent }) => (
                <Word key={`${word}-${index}`} softAccent={softAccent}>
                  {word}
                </Word>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

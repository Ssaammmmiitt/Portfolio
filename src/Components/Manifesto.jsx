import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MANIFESTO_BODY, MANIFESTO_BODY_HIGHLIGHT, MANIFESTO_LINES } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import MouseFollowingEyes from "./MouseFollowingEyes.jsx";
import { gsap } from "../lib/gsap.js";
import {
  isCompactViewport,
  isPhoneViewport,
  prefersReducedMotion,
  MANIFESTO_VARS,
  refreshScrubTimeline,
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
    <h2 className="display-title text-[clamp(1.85rem,9.5vw,7.8rem)] sm:text-[clamp(2.15rem,11vw,7.8rem)]">
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

function extraPinRoom(phone, compact) {
  if (phone) return 0;
  const vh = window.innerHeight;
  return Math.round(vh * (compact ? 0.22 : 0.26));
}

function syncPinHeight(pinEl, stickyEl, extra) {
  if (!pinEl) return;
  if (!stickyEl || extra <= 0) {
    pinEl.style.height = "";
    return;
  }
  pinEl.style.height = `${stickyEl.offsetHeight + extra}px`;
}

export default function Manifesto({ ready }) {
  const root = useRef(null);
  const pin = useRef(null);
  const sticky = useRef(null);
  const timelineRef = useRef(null);
  const colorTweensRef = useRef({ rest: null, soft: null, accent: null });
  const skipThemeRefresh = useRef(true);
  const { theme } = useTheme();
  const bodyWords = getBodyWords(MANIFESTO_BODY, MANIFESTO_BODY_HIGHLIGHT);
  const [phone, setPhone] = useState(() => isPhoneViewport());
  const [compact, setCompact] = useState(() => isCompactViewport());

  useEffect(() => {
    const phoneQuery = window.matchMedia("(max-width: 639px)");
    const compactQuery = window.matchMedia("(max-width: 1023px)");
    const update = () => {
      setPhone(phoneQuery.matches);
      setCompact(compactQuery.matches);
    };
    update();
    phoneQuery.addEventListener("change", update);
    compactQuery.addEventListener("change", update);
    return () => {
      phoneQuery.removeEventListener("change", update);
      compactQuery.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready || !root.current) return;

    const headlineWords = root.current.querySelectorAll("[data-headline] [data-word]");
    const headlineAccents = root.current.querySelectorAll("[data-headline] [data-accent='true']");
    const headlineRest = root.current.querySelectorAll("[data-headline] [data-accent='false']");
    const bodyWords = root.current.querySelectorAll("[data-body] [data-word]");
    const pinEl = pin.current;
    const stickyEl = sticky.current;
    const extra = extraPinRoom(phone, compact);

    syncPinHeight(pinEl, stickyEl, extra);

    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < 2) return;
      lastWidth = window.innerWidth;
      syncPinHeight(pinEl, stickyEl, extraPinRoom(phone, compact));
    };
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        applyManifestoStaticColors(root.current);
        return;
      }

      gsap.set(headlineWords, {
        color: MANIFESTO_VARS.muted,
        y: phone ? 6 : compact ? 8 : 16,
        opacity: 0.72,
      });
      gsap.set(bodyWords, { color: MANIFESTO_VARS.muted, y: 0, opacity: 1 });

      // Start once ~35% of the viewport shows the section (top hits 65%),
      // not only when it reaches the very top of the page.
      const tl = gsap.timeline({
        defaults: { ease: "none", immediateRender: false },
        scrollTrigger: {
          trigger: phone ? root.current : pinEl,
          start: "top 65%",
          end: phone ? "bottom 42%" : "bottom bottom",
          scrub: phone ? 0.28 : compact ? 0.28 : 0.4,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        headlineWords,
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.5,
        },
        0
      );
      colorTweensRef.current.rest = tl.to(
        headlineRest,
        { color: MANIFESTO_VARS.paper, stagger: 0.06, duration: 0.55 },
        0
      );
      colorTweensRef.current.accent = tl.to(
        headlineAccents,
        { color: MANIFESTO_VARS.accent, stagger: 0.1, duration: 0.55 },
        0.04
      );

      colorTweensRef.current.soft = tl.to(
        bodyWords,
        {
          color: (_i, el) =>
            el.getAttribute("data-accent") === "soft"
              ? MANIFESTO_VARS.accentSoft
              : MANIFESTO_VARS.paper,
          duration: 0.5,
          stagger: 0.035,
        },
        typeof tl.duration === "function" ? tl.duration() + 0.08 : ">"
      );

      timelineRef.current = tl;
      tl.scrollTrigger?.update?.();
    }, root);

    return () => {
      window.removeEventListener("resize", onResize);
      syncPinHeight(pinEl, stickyEl, 0);
      timelineRef.current = null;
      colorTweensRef.current = { rest: null, soft: null, accent: null };
      ctx.revert();
    };
  }, [ready, phone, compact]);

  useLayoutEffect(() => {
    if (skipThemeRefresh.current) {
      skipThemeRefresh.current = false;
      return;
    }

    if (!ready || !root.current) return;

    if (prefersReducedMotion()) {
      applyManifestoStaticColors(root.current);
      return;
    }

    const tl = timelineRef.current;
    if (tl) refreshScrubTimeline(tl);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh on theme change only
  }, [theme]);

  return (
    <section id="manifesto" ref={root} className="relative bg-background">
      <div ref={pin} className="relative h-auto">
        <div
          ref={sticky}
          className="relative max-sm:static sm:sticky sm:top-0 flex flex-col items-start pt-[max(4.25rem,calc(env(safe-area-inset-top)+3.25rem))] pb-6 sm:items-center sm:pt-[max(4.75rem,calc(env(safe-area-inset-top)+3.5rem))] sm:pb-5 md:pb-6 lg:pt-20 lg:pb-7 motion-reduce:relative motion-reduce:py-16"
        >
          <div className="noise pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />
          <div
            className="pointer-events-none absolute top-1/2 right-[clamp(1rem,3vw,4rem)] z-10 hidden -translate-y-1/2 xl:block"
            aria-hidden="true"
          >
            <MouseFollowingEyes />
          </div>
          <div className="wrap relative w-full min-w-0">
            <div className="mb-5 flex items-end justify-between gap-6 sm:mb-8 md:mb-10 lg:mb-12">
              <p className="kicker mb-0!">manifesto</p>
              <p className="hidden max-w-xs text-right text-xs leading-relaxed tracking-[0.18em] text-faint uppercase md:block">
                Scroll  -  the words come alive
              </p>
            </div>

            <div
              data-headline=""
              className="relative flex flex-col gap-0.5 sm:gap-1 lg:max-w-[92%] xl:max-w-none xl:pr-[11rem]"
            >
              {MANIFESTO_LINES.map((entry) => (
                <Line key={entry.line} {...entry} />
              ))}
            </div>

            <p
              data-body=""
              className="mt-5 max-w-3xl text-[clamp(1.0625rem,2.5vw,1.75rem)] leading-[1.75] font-light text-pretty text-soft sm:mt-8 md:mt-10 lg:mt-12 sm:leading-[1.8]"
            >
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

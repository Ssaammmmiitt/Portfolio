import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { CLOCKS, CV, NAME, NAV_LINKS, SOCIALS } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { isAlreadyInView } from "../lib/visitCache.js";
import Logo from "./Logo";

function Clock({ city, tz }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <div className="reveal-item min-w-0">
      <p className="font-condensed text-[0.65rem] uppercase tracking-[0.22em] text-faint sm:text-xs sm:tracking-[0.28em]">
        {city}
      </p>
      <p className="mt-1.5 text-sm tabular-nums text-soft sm:mt-2 sm:text-base">{time}</p>
    </div>
  );
}

export default function Footer({ ready = true }) {
  const root = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  useReveal(root, ready);

  useLayoutEffect(() => {
    if (!ready || !root.current) return;

    const ctx = gsap.context(() => {
      const name = root.current.querySelector(".footer-name");
      if (!name) return;

      if (isAlreadyInView(name, 0.92)) {
        gsap.set(name, { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        name,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: name, start: "top 90%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <footer
      id="footer"
      ref={root}
      className="relative overflow-x-clip border-t border-border bg-background pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 dock-safe-pb"
    >
      <div className="wrap">
        <div className="grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12 md:grid-cols-12 md:gap-x-8 md:gap-y-0 lg:gap-x-12 xl:gap-x-16">
          <nav
            aria-label="Footer"
            className="col-span-1 flex min-w-0 flex-col gap-0.5 sm:gap-1 md:col-span-4"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="reveal-item underline-link inline-flex min-h-11 w-fit max-w-full items-center py-0.5 text-[0.95rem] capitalize text-soft sm:text-base"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav
            aria-label="Social"
            className="col-span-1 flex min-w-0 flex-col gap-0.5 sm:gap-1 md:col-span-4"
          >
            {SOCIALS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="reveal-item underline-link inline-flex min-h-11 w-fit max-w-full items-center py-0.5 text-[0.95rem] capitalize text-soft sm:text-base"
              >
                {link.label}
              </a>
            ))}
            {CV.url ? (
              <a
                href={CV.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal-item underline-link inline-flex min-h-11 w-fit max-w-full items-center gap-2 py-0.5 text-[0.95rem] capitalize text-soft sm:text-base"
              >
                <FiDownload size={16} aria-hidden="true" className="shrink-0" />
                {CV.label.toLowerCase()}
              </a>
            ) : null}
          </nav>

          <div className="col-span-2 flex min-w-0 items-start justify-start border-t border-border pt-8 sm:pt-10 md:col-span-4 md:justify-end md:border-t-0 md:pt-0 md:pl-4 lg:pl-6">
            <div className="flex w-full flex-col gap-6 sm:w-auto sm:gap-8 md:items-end md:text-right">
              {CLOCKS.map((c) => (
                <Clock key={c.city} city={c.city} tz={c.tz} />
              ))}
            </div>
          </div>
        </div>

        <h2 className="footer-name display-title mt-14 flex flex-wrap justify-center gap-x-[0.18em] px-1 text-balance text-center text-[clamp(2.5rem,14vw,12rem)] leading-[0.82] text-paper sm:mt-16 sm:px-0 sm:text-[clamp(2.75rem,15vw,13rem)] md:mt-20 lg:mt-24 xl:mt-28">
          {NAME.split(" ").map((part, i) => (
            <span key={`${part}-${i}`} className={i === 1 ? "text-acid" : ""}>
              {part}
            </span>
          ))}
        </h2>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:mt-10 sm:flex-row sm:items-center sm:gap-6 sm:pt-8 md:mt-12 md:pt-10">
          <a
            href="#hero"
            className="nav-brand inline-flex min-h-11 shrink-0 items-center py-1.5"
            aria-label="Sammit Poudyal  -  Home"
          >
            <Logo size={40} invertIcon={!isLight} showWordmark />
          </a>
          <p className="text-xs tracking-wide text-faint sm:text-right">
            ©2026 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

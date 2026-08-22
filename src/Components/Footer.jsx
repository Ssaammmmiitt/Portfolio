import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CLOCKS, NAME, NAV_LINKS, SOCIALS } from "../data.js";
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
    <div className="reveal-item">
      <p className="font-condensed text-xs uppercase tracking-[0.22em] text-faint sm:tracking-[0.28em]">
        {city}
      </p>
      <p className="mt-2 text-sm tabular-nums text-soft sm:text-base">{time}</p>
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
      className="relative overflow-x-clip border-t border-border bg-background pt-16 sm:pt-20 md:pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="wrap">
        <div className="grid grid-cols-2 gap-10 sm:gap-12 md:grid-cols-12 md:gap-8">
          <nav className="flex flex-col gap-1 md:col-span-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="reveal-item underline-link inline-flex min-h-11 w-fit items-center text-base capitalize text-soft"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <nav className="flex flex-col gap-1 md:col-span-4">
            {SOCIALS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="reveal-item underline-link inline-flex min-h-11 w-fit items-center text-base capitalize text-soft"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="col-span-2 flex md:col-span-4 md:justify-end">
            {CLOCKS.map((c) => (
              <Clock key={c.city} city={c.city} tz={c.tz} />
            ))}
          </div>
        </div>

        <h2 className="footer-name display-title mt-16 flex flex-wrap justify-center gap-x-[0.18em] text-center text-[clamp(3.1rem,18vw,13rem)] leading-[0.8] text-paper sm:mt-20 md:mt-24">
          {NAME.split(" ").map((part, i) => (
            <span key={`${part}-${i}`} className={i === 1 ? "text-acid" : ""}>
              {part}
            </span>
          ))}
        </h2>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-border py-5 sm:mt-8 sm:flex-row sm:items-center sm:py-6">
          <a
            href="#hero"
            className="nav-brand inline-flex min-h-11 items-center py-2"
            aria-label="Sammit Poudyal  -  Home"
          >
            <Logo size={40} invertIcon={!isLight} showWordmark />
          </a>
          <p className="text-xs tracking-wide text-faint">©2026 All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

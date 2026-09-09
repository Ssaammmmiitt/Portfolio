import { useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { CLOCKS, CV, NAV_LINKS, SOCIALS } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { getCvDownloadLinkProps } from "../lib/cv.js";
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
      <p className="meta-label text-[0.7rem] tracking-[0.2em] sm:text-[0.75rem] sm:tracking-[0.24em]">
        {city}
      </p>
      <p className="mt-1 font-sans text-sm tabular-nums text-soft sm:text-base">{time}</p>
    </div>
  );
}

export default function Footer({ ready = true }) {
  const root = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  useReveal(root, ready);

  const cvDownloadLinkProps = getCvDownloadLinkProps();
  const linkClass =
    "reveal-item underline-link inline-flex min-h-9 w-fit max-w-full items-center py-0.5 font-sans text-sm capitalize text-soft sm:text-[0.95rem]";

  return (
    <footer
      id="footer"
      ref={root}
      className="relative overflow-x-clip border-t border-border bg-background pt-10 sm:pt-12 md:pt-14 dock-safe-pb"
    >
      <div className="wrap">
        <div className="grid grid-cols-2 items-start gap-x-5 gap-y-7 sm:gap-x-8 sm:gap-y-8 md:grid-cols-12 md:gap-x-6 md:gap-y-0 lg:gap-x-10">
          <nav
            aria-label="Footer"
            className="col-span-1 flex min-w-0 flex-col gap-0 md:col-span-4"
          >
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </a>
            ))}
          </nav>

          <nav
            aria-label="Social"
            className="col-span-1 flex min-w-0 flex-col gap-0 md:col-span-4"
          >
            {SOCIALS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                {link.label}
              </a>
            ))}
            {cvDownloadLinkProps ? (
              <a {...cvDownloadLinkProps} className={`${linkClass} gap-2`}>
                <FiDownload size={14} aria-hidden="true" className="shrink-0" />
                {CV.label.toLowerCase()}
              </a>
            ) : null}
          </nav>

          <div className="col-span-2 flex min-w-0 items-start justify-start border-t border-border pt-5 sm:pt-6 md:col-span-4 md:justify-end md:border-t-0 md:pt-0 md:pl-3 lg:pl-4">
            <div className="flex w-full flex-row flex-wrap gap-x-8 gap-y-4 sm:w-auto sm:gap-x-10 md:flex-col md:items-end md:gap-4 md:text-right">
              {CLOCKS.map((c) => (
                <Clock key={c.city} city={c.city} tz={c.tz} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-border pt-5 sm:mt-7 sm:flex-row sm:items-center sm:gap-4 sm:pt-5 md:mt-8">
          <a
            href="#hero"
            className="nav-brand inline-flex min-h-9 shrink-0 items-center py-1"
            aria-label="Sammit Poudyal  -  Home"
          >
            <Logo size={32} invertIcon={!isLight} showWordmark />
          </a>
          <p className="font-sans text-xs tracking-wide text-subtle sm:text-sm sm:text-right">
            ©2026 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiChevronDown, FiMaximize2 } from "react-icons/fi";
import { CERTIFICATES } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { prefersReducedMotion, syncScrollTriggers } from "../lib/motion.js";
import { isAlreadyInView } from "../lib/visitCache.js";
import { cn } from "../lib/utils.js";
import { certificatePreviewSrc } from "../lib/certificates.js";
import CertificateViewerModal from "./CertificateViewerModal.jsx";

function CertificatesHeader({ compact = false, open = false }) {
  return (
    <div className={compact ? "min-w-0" : "section-head"}>
      <p className="reveal-kicker kicker text-[1rem] tracking-[0.2em] sm:text-[1.125rem] sm:tracking-[0.26em]">
        Certificates
      </p>
      <h2 className="reveal-title display-title text-[clamp(2.2rem,8vw,4.75rem)] text-paper">
        Proof of
        <span className="text-subtle"> practice</span>
      </h2>
      {!open ? (
        <p
          className={cn(
            "body-copy reveal-item max-w-xl",
            compact ? "mt-3 sm:mt-4" : "mt-4 sm:mt-5"
          )}
        >
          DataCamp coursework in SQL, Snowflake, and data warehousing.
        </p>
      ) : null}
    </div>
  );
}

function CertificateCard({ item, onOpen, previewReady }) {
  const previewSrc = certificatePreviewSrc(item.file);

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`View ${item.title} certificate`}
      className="certificate-card group relative flex h-full min-h-[17.5rem] min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-border/80 text-left transition-[transform,border-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acid sm:min-h-[19rem] md:min-h-[21rem]"
    >
      {/* PDF preview sits behind the copy */}
      <div className="certificate-card-preview pointer-events-none absolute inset-0" aria-hidden="true">
        {previewReady ? (
          <iframe
            title={`${item.title} preview`}
            tabIndex={-1}
            src={previewSrc}
            loading="lazy"
            className="certificate-card-preview-frame absolute left-1/2 top-0 h-[140%] w-[160%] max-w-none -translate-x-1/2 border-0 opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-muted/40" />
        )}
        <div className="certificate-card-scrim absolute inset-0" />
      </div>

      <div className="relative z-10 flex h-full min-w-0 flex-col p-4 sm:p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="meta-label tracking-[0.2em] text-acid sm:tracking-[0.26em]">
            {item.issuer}
          </span>
          {item.category ? (
            <span className="rounded-full border border-border-strong bg-background/55 px-2.5 py-1 font-heading text-[0.7rem] uppercase tracking-[0.14em] text-subtle backdrop-blur-sm sm:text-[0.75rem]">
              {item.category}
            </span>
          ) : null}
        </div>

        <h3 className="display-title mt-3 max-w-[16ch] text-[clamp(1.55rem,5.5vw,2.15rem)] leading-[1.08] text-paper drop-shadow-sm sm:mt-3.5">
          {item.title}
        </h3>

        <div className="mt-auto flex items-center gap-2 pt-5 sm:pt-6">
          <span className="certificate-action inline-flex min-h-10 items-center gap-2 rounded-full border border-border-strong bg-background/80 px-3.5 text-sm font-medium text-paper backdrop-blur-sm transition-colors group-hover:border-acid group-hover:bg-acid/10 group-hover:text-acid sm:min-h-11 sm:px-4">
            <FiMaximize2 size={15} aria-hidden="true" />
            View
          </span>
        </div>
      </div>
    </button>
  );
}

function CertificatesGrid({ ready, open, gridRef, onOpen, previewReady }) {
  useLayoutEffect(() => {
    if (!ready || !open || !gridRef.current) return;

    const reduceMotion = prefersReducedMotion();
    const cards = gsap.utils.toArray(".certificate-card");

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 22 });

      cards.forEach((card, i) => {
        const alreadyVisible = isAlreadyInView(card, 0.92);

        if (alreadyVisible) {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: i * 0.08,
            ease: "power3.out",
            overwrite: true,
          });
          return;
        }

        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, gridRef);

    syncScrollTriggers();

    return () => ctx.revert();
  }, [ready, open, gridRef]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[480px]:gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6"
    >
      {CERTIFICATES.map((item) => (
        <CertificateCard
          key={item.id}
          item={item}
          onOpen={onOpen}
          previewReady={previewReady}
        />
      ))}
    </div>
  );
}

export default function Certificates({ ready }) {
  const root = useRef(null);
  const gridRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [panelSettled, setPanelSettled] = useState(false);
  const [activeCert, setActiveCert] = useState(null);
  const reduceMotion = prefersReducedMotion();

  useReveal(root, ready);

  const openViewer = useCallback((item) => {
    setActiveCert(item);
  }, []);

  const closeViewer = useCallback(() => {
    setActiveCert(null);
  }, []);

  useEffect(() => {
    syncScrollTriggers();
  }, [open, panelSettled]);

  useEffect(() => {
    if (!open) {
      setPanelSettled(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setPanelSettled(true);
      syncScrollTriggers();
    }, reduceMotion ? 0 : 520);

    return () => window.clearTimeout(timer);
  }, [open, reduceMotion]);

  const toggle = () => setOpen((value) => !value);

  return (
    <section
      id="certificates"
      ref={root}
      className={cn(
        "relative overflow-x-clip border-t border-border bg-background",
        open ? "section-y" : "py-10 sm:py-12 md:py-14"
      )}
    >
      <div className="wrap">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="certificates-panel"
          onClick={toggle}
          className="group certificates-toggle reveal-item flex w-full min-w-0 cursor-pointer flex-col gap-4 rounded-2xl px-4 py-4 text-left transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acid sm:gap-5 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8"
        >
          <CertificatesHeader compact open={open} />

          <div className="flex shrink-0 items-center justify-between gap-3 lg:flex-col lg:items-end lg:justify-center lg:gap-2.5">
            <span
              className={cn(
                "font-heading text-[0.68rem] uppercase tracking-[0.18em] transition-colors duration-200 sm:text-xs sm:tracking-[0.22em]",
                open
                  ? "text-subtle group-hover:text-paper"
                  : "text-faint group-hover:text-acid [@media(hover:hover)]:text-subtle"
              )}
            >
              {open ? "Click to collapse" : `${CERTIFICATES.length} certificates · explore`}
            </span>

            <span
              className={cn(
                "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-border-strong bg-background/80 text-paper transition-[transform,border-color,color,background-color] duration-300 group-hover:border-acid group-hover:text-acid",
                open && "border-acid/60 bg-acid/10 text-acid"
              )}
              aria-hidden="true"
            >
              <FiChevronDown
                size={18}
                className={cn(
                  "transition-transform duration-300",
                  open && "rotate-180",
                  !open && "group-hover:translate-y-0.5"
                )}
              />
            </span>
          </div>
        </button>

        <div
          id="certificates-panel"
          ref={panelRef}
          aria-hidden={!open}
          className={cn(
            "grid",
            !reduceMotion && "transition-[grid-template-rows,margin-top] duration-500 ease-out",
            open ? "mt-8 grid-rows-[1fr] sm:mt-10 md:mt-12" : "mt-0 grid-rows-[0fr]"
          )}
        >
          <div
            className={cn(
              "min-h-0",
              panelSettled ? "overflow-visible" : "overflow-hidden"
            )}
          >
            {open ? (
              <div className="certificates-panel-open rounded-2xl px-3 py-5 sm:px-4 sm:py-6 md:px-5 md:py-7">
                <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-20">
                  <div className="hidden min-w-0 lg:col-span-4 lg:block xl:col-span-3">
                    <p className="body-copy max-w-md">
                      Each card shows a live preview of the certificate. Click any card to open
                      the full viewer.
                    </p>
                  </div>
                  <div className="min-w-0 lg:col-span-8 xl:col-span-9">
                    <CertificatesGrid
                      ready={ready && panelSettled}
                      open={open}
                      gridRef={gridRef}
                      onOpen={openViewer}
                      previewReady={panelSettled}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <CertificateViewerModal certificate={activeCert} onClose={closeViewer} />
    </section>
  );
}

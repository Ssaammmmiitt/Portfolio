import { useLayoutEffect, useRef, useState } from "react";
import { PROJECTS } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { gsap } from "../lib/gsap.js";
import { cn } from "../lib/utils.js";
import { canHoverFine, prefersReducedMotion } from "../lib/motion.js";

function ProjectPreview({ project }) {
  const accent = project.color || "var(--theme-accent)";

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-lg border border-border/50 bg-background">
      <div
        className="flex min-h-0 flex-1 items-center justify-center p-3"
        style={{ background: project.thumbnail ? "var(--theme-muted)" : accent }}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={`${project.name} preview`}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <div className="shrink-0 border-t border-border/50 bg-background p-4">
        <p className="font-condensed text-[0.65rem] uppercase tracking-[0.22em] text-faint">
          {project.tag}
        </p>
        <p className="mt-2 text-sm leading-snug text-paper">{project.title}</p>
      </div>
    </div>
  );
}

export default function Works({ ready }) {
  const root = useRef(null);
  const modal = useRef(null);
  const listRef = useRef(null);
  const nameRefs = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const activeProject = hoveredIndex != null ? PROJECTS[hoveredIndex] : PROJECTS[0];

  useReveal(root, ready);

  useLayoutEffect(() => {
    if (!ready || !root.current || !modal.current) return;

    const ctx = gsap.context(() => {
      if (canHoverFine()) {
        gsap.set(modal.current, { scale: 0, opacity: 0 });
      }

      if (prefersReducedMotion()) return;

      gsap.fromTo(
        ".work-row",
        { x: -32, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  useLayoutEffect(() => {
    if (!modal.current || !listRef.current || !canHoverFine()) return;

    if (hoveredIndex == null) {
      gsap.to(modal.current, {
        scale: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power3.out",
      });
      return;
    }

    const nameEl = nameRefs.current[hoveredIndex];
    if (!nameEl) return;

    const nameRect = nameEl.getBoundingClientRect();
    const containerRect = listRef.current.getBoundingClientRect();
    const gap = 20;
    const x = nameRect.right - containerRect.left + gap;
    const modalHeight = modal.current.offsetHeight;
    const y = nameRect.top - containerRect.top + nameRect.height / 2 - modalHeight / 2;

    gsap.to(modal.current, {
      x,
      y,
      scale: 1,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [hoveredIndex]);

  return (
    <section id="works" ref={root} className="section-y relative overflow-x-clip bg-background">
      <div className="wrap">
        <p className="reveal-kicker kicker">selected works</p>
        <h2 className="reveal-title display-title mb-10 text-[clamp(2.6rem,9vw,6.5rem)] text-paper md:mb-16">
          Check out my projects
          <span className="mt-2 block text-faint">See my expertise</span>
        </h2>

        <div
          ref={listRef}
          className="relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {PROJECTS.map((project, index) => (
            <a
              key={project.name}
              href="#contact"
              className="work-row group flex min-h-14 items-center justify-between gap-4 border-t border-border py-5 last:border-b sm:py-7 md:py-8"
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
            >
              <div className="min-w-0">
                <h3
                  ref={(el) => {
                    nameRefs.current[index] = el;
                  }}
                  className="display-title inline-block text-[clamp(1.7rem,6vw,4rem)] leading-none text-paper lg:transition-transform lg:duration-300 lg:group-hover:translate-x-3 lg:group-hover:text-faint"
                >
                  {project.name}
                </h3>
                <span className="mt-2 block font-condensed text-[0.65rem] tracking-[0.18em] text-faint uppercase sm:text-xs sm:tracking-[0.22em] lg:mt-0 lg:inline lg:ml-4">
                  {project.tag} · {project.year}
                </span>
              </div>
              <span className="flex shrink-0 items-center gap-2 text-[0.65rem] tracking-[0.2em] text-faint uppercase sm:text-xs">
                View
                <img
                  src="/images/arrow-right.svg"
                  alt=""
                  className={cn("w-3", !isLight && "invert")}
                />
              </span>
            </a>
          ))}

          <div
            ref={modal}
            className="pointer-events-none absolute top-0 left-0 z-20 hidden h-[min(18rem,36vh)] w-[min(22rem,44vw)] overflow-hidden lg:block"
            aria-hidden={hoveredIndex == null}
          >
            <ProjectPreview project={activeProject} />
          </div>
        </div>
      </div>
    </section>
  );
}

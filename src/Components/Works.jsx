import { useLayoutEffect, useRef, useState } from "react";
import { FiFileText, FiGithub } from "react-icons/fi";
import { CV, PROJECTS } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { hasCv } from "../lib/cv.js";
import { gsap } from "../lib/gsap.js";
import { cn } from "../lib/utils.js";
import { canHoverFine, prefersReducedMotion } from "../lib/motion.js";
import CvViewerModal from "./CvViewerModal.jsx";

function parseStack(tag) {
  return tag.split("·").map((item) => item.trim()).filter(Boolean);
}

function ProjectStackChips({ tag, className }) {
  const items = parseStack(tag);

  return (
    <ul className={cn("work-stack-chips", className)}>
      {items.map((item) => (
        <li key={item} className="work-stack-chip">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProjectImagePreview({ project }) {
  const accent = project.color || "var(--theme-accent)";

  return (
    <div className="work-preview-card overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg shadow-black/10">
      <div
        className="flex aspect-[4/3] items-center justify-center p-4"
        style={{ background: project.thumbnail ? "var(--theme-muted)" : accent }}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt=""
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
    </div>
  );
}

function ProjectStackPreview({ project }) {
  const accent = project.color || "var(--theme-accent)";

  return (
    <div
      className="work-preview-card work-preview-stack rounded-xl border p-4 shadow-lg shadow-black/10"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 55%, var(--theme-border))`,
        background: `linear-gradient(145deg, color-mix(in srgb, ${accent} 16%, var(--theme-background)) 0%, var(--theme-background) 72%)`,
      }}
    >
      <p
        className="meta-label tracking-[0.2em]"
        style={{ color: accent }}
      >
        Stack
      </p>
      <ProjectStackChips tag={project.tag} className="mt-3" />
      <p
        className="meta-label mt-3.5 tracking-[0.18em]"
        style={{ color: `color-mix(in srgb, ${accent} 72%, var(--theme-subtle))` }}
      >
        {project.year}
      </p>
    </div>
  );
}

function ProjectGithubLink({ href, name, className }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${name} on GitHub`}
      className={cn("work-github-link", className)}
      onClick={(event) => event.stopPropagation()}
    >
      <FiGithub size={17} aria-hidden="true" />
      <span className="sr-only">GitHub</span>
    </a>
  );
}

export default function Works({ ready }) {
  const root = useRef(null);
  const previewWrap = useRef(null);
  const listRef = useRef(null);
  const nameRefs = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cvOpen, setCvOpen] = useState(false);
  const [cvCollapsed, setCvCollapsed] = useState(false);

  const activeProject = hoveredIndex != null ? PROJECTS[hoveredIndex] : PROJECTS[0];

  useReveal(root, ready);

  useLayoutEffect(() => {
    if (!ready || !root.current || !previewWrap.current) return;

    const ctx = gsap.context(() => {
      if (canHoverFine()) {
        gsap.set(previewWrap.current, { scale: 0, opacity: 0 });
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
    if (!previewWrap.current || !listRef.current || !canHoverFine()) return;

    if (hoveredIndex == null) {
      gsap.to(previewWrap.current, {
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
    const gap = 28;
    const wrapWidth = previewWrap.current.offsetWidth;
    const maxX = Math.max(0, containerRect.width - wrapWidth - 8);
    const x = Math.min(nameRect.right - containerRect.left + gap, maxX);
    const wrapHeight = previewWrap.current.offsetHeight;
    const y = nameRect.top - containerRect.top + nameRect.height / 2 - wrapHeight / 2;

    gsap.to(previewWrap.current, {
      x,
      y,
      scale: 1,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [hoveredIndex]);

  const handleViewCv = () => {
    if (cvOpen && cvCollapsed) {
      setCvCollapsed(false);
      return;
    }
    setCvOpen(true);
    setCvCollapsed(false);
  };

  const handleCloseCv = () => {
    setCvOpen(false);
    setCvCollapsed(false);
  };

  return (
    <section id="works" ref={root} className="section-y relative overflow-x-clip bg-background">
      <div className="wrap">
        <div className="section-head flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <p className="reveal-kicker kicker">selected works</p>
            <h2 className="reveal-title display-title text-[clamp(2.6rem,9vw,6.5rem)] text-paper">
              Check out my projects
              <span className="mt-2 block text-subtle">See my expertise</span>
            </h2>
          </div>
          {hasCv() && (
            <button
              type="button"
              onClick={handleViewCv}
              className="reveal-item inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium tracking-wide text-paper uppercase transition-colors hover:border-acid hover:bg-acid/10 hover:text-acid sm:mt-10 sm:w-auto md:mt-12"
            >
              <FiFileText size={18} aria-hidden="true" />
              View {CV.label}
            </button>
          )}
        </div>

        <div
          ref={listRef}
          className="work-list relative mt-10 md:mt-14"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {PROJECTS.map((project, index) => (
            <article
              key={project.name}
              className="work-row group flex min-w-0 items-start justify-between gap-4 border-t border-border py-6 last:border-b sm:items-center sm:gap-5 md:py-8 lg:py-9"
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
            >
              <div className="min-w-0 flex-1 flex flex-col gap-3 md:gap-3.5">
                <h3
                  ref={(el) => {
                    nameRefs.current[index] = el;
                  }}
                  className="display-title text-[clamp(1.7rem,6vw,4rem)] leading-none text-paper transition-[transform,color] duration-300 lg:group-hover:translate-x-2 lg:group-hover:text-subtle"
                >
                  {project.name}
                </h3>

                <p className="work-summary max-w-3xl text-sm leading-relaxed text-subtle md:text-[0.95rem] lg:group-hover:text-paper">
                  {project.summary}
                </p>

                <ProjectStackChips tag={project.tag} className="lg:hidden" />
                <span className="meta-label lg:hidden">{project.year}</span>
                <span className="meta-label hidden lg:inline">{project.year}</span>
              </div>

              <ProjectGithubLink
                href={project.github}
                name={project.name}
                className="mt-1 shrink-0 sm:mt-0"
              />
            </article>
          ))}

          <div
            ref={previewWrap}
            className="work-preview-wrap pointer-events-none absolute top-0 left-0 z-20 hidden w-[min(20rem,40vw)] flex-col gap-3 lg:flex"
            aria-hidden={hoveredIndex == null}
          >
            <ProjectImagePreview project={activeProject} />
            <ProjectStackPreview project={activeProject} />
          </div>
        </div>
      </div>
      <CvViewerModal
        open={cvOpen}
        collapsed={cvCollapsed}
        onCollapsedChange={setCvCollapsed}
        onClose={handleCloseCv}
      />
    </section>
  );
}

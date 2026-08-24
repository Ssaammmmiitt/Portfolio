import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeProvider.jsx";
import { canHoverFine, prefersReducedMotion } from "../lib/motion.js";

function updatePupil(selfEl, otherEl, pupilEl, mouseX, mouseY) {
  if (!selfEl || !pupilEl) return;

  const inside = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom;
  };

  if (inside(selfEl) || inside(otherEl)) return;

  const rect = selfEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
  const maxMove = 20;
  pupilEl.style.transform = `translate(${Math.cos(angle) * maxMove}px, ${Math.sin(angle) * maxMove}px)`;
}

function EyeShell({ selfRef, pupilRef, isDark }) {
  return (
    <div
      ref={selfRef}
      className={`relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral-900/80 bg-white xl:h-24 xl:w-24 ${
        isDark ? "shadow-[0_0_28px_rgb(255_255_255/0.18)]" : "shadow-[0_0_20px_rgb(41_37_36/0.1)]"
      }`}
    >
      <div
        ref={pupilRef}
        className="absolute h-7 w-7 rounded-full bg-neutral-950 xl:h-8 xl:w-8"
      >
        <div className="absolute right-1 bottom-1 h-2.5 w-2.5 rounded-full bg-white/90 xl:h-3 xl:w-3" />
      </div>
    </div>
  );
}

export default function MouseFollowingEyes() {
  const eye1Ref = useRef(null);
  const eye2Ref = useRef(null);
  const pupil1Ref = useRef(null);
  const pupil2Ref = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!canHoverFine()) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let raf = 0;
    let latest = { x: 0, y: 0 };

    const flush = () => {
      raf = 0;
      updatePupil(eye1Ref.current, eye2Ref.current, pupil1Ref.current, latest.x, latest.y);
      updatePupil(eye2Ref.current, eye1Ref.current, pupil2Ref.current, latest.x, latest.y);
    };

    const onMove = (event) => {
      latest = { x: event.clientX, y: event.clientY };
      if (raf) return;
      raf = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="flex gap-2 lg:mr-6 lg:pr-2 xl:gap-3 xl:mr-10 xl:pr-4 2xl:mr-14 2xl:pr-6"
      aria-hidden="true"
    >
      <EyeShell selfRef={eye1Ref} pupilRef={pupil1Ref} isDark={isDark} />
      <EyeShell selfRef={eye2Ref} pupilRef={pupil2Ref} isDark={isDark} />
    </div>
  );
}

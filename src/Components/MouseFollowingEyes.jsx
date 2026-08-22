import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeProvider.jsx";
import { canHoverFine, prefersReducedMotion } from "../lib/motion.js";

function Eye({ mouseX, mouseY, selfRef, otherRef, isDark }) {
  const pupilRef = useRef(null);

  useEffect(() => {
    const self = selfRef.current;
    const pupil = pupilRef.current;
    if (!self || !pupil) return;

    const isInside = (ref) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return false;
      return (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      );
    };

    if (isInside(selfRef) || isInside(otherRef)) return;

    const rect = self.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);

    const maxMove = 20;
    const pupilX = Math.cos(angle) * maxMove;
    const pupilY = Math.sin(angle) * maxMove;

    pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  }, [mouseX, mouseY, selfRef, otherRef]);

  return (
    <div
      ref={selfRef}
      className={`relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral-900/80 bg-white xl:h-24 xl:w-24 ${
        isDark ? "shadow-[0_0_28px_rgb(255_255_255/0.18)]" : "shadow-[0_0_20px_rgb(41_37_36/0.1)]"
      }`}
    >
      <div
        ref={pupilRef}
        className="absolute h-7 w-7 rounded-full bg-neutral-950 transition-transform duration-0 xl:h-8 xl:w-8"
      >
        <div className="absolute right-1 bottom-1 h-2.5 w-2.5 rounded-full bg-white/90 xl:h-3 xl:w-3" />
      </div>
    </div>
  );
}

export default function MouseFollowingEyes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const eye1Ref = useRef(null);
  const eye2Ref = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!canHoverFine()) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const onMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="flex gap-2 xl:gap-3" aria-hidden="true">
      <Eye
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        selfRef={eye1Ref}
        otherRef={eye2Ref}
        isDark={isDark}
      />
      <Eye
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        selfRef={eye2Ref}
        otherRef={eye1Ref}
        isDark={isDark}
      />
    </div>
  );
}

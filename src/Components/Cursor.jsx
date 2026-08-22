import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap.js";
import { prefersReducedMotion } from "../lib/motion.js";

export default function Cursor() {
  const dot = useRef(null);

  useEffect(() => {
    const el = dot.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 1 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const move = (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const grow = (event) => {
      const node = event.target;
      if (!(node instanceof Element)) return;
      const hoverable = node.closest("a, button, label, input, textarea");
      gsap.to(el, { scale: hoverable ? 2.6 : 1, duration: 0.35, ease: "power3.out" });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", grow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", grow);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[10003] hidden size-3 rounded-full bg-acid mix-blend-difference opacity-0 lg:block"
    />
  );
}

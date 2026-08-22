import { useLayoutEffect, useRef } from "react";
import { NAME } from "../data.js";
import { gsap, EASE_IN_OUT } from "../lib/gsap.js";

export default function Preloader({ onDone }) {
  const root = useRef(null);
  const count = useRef(null);
  const label = useRef(null);
  const done = useRef(onDone);

  useLayoutEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { n: 0 };
      const tl = gsap.timeline({
        defaults: { ease: EASE_IN_OUT },
        onComplete: () => done.current(),
      });

      tl.from(label.current, { opacity: 0, y: 16, duration: 0.45, ease: "power3.out" })
        .to(
          obj,
          {
            n: 100,
            duration: 1.35,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(obj.n)).padStart(2, "0");
            },
          },
          0.15
        )
        .to(label.current, { opacity: 0, y: -12, duration: 0.3 }, "+=0.08")
        .to(root.current, { yPercent: -110, duration: 0.95 }, "-=0.05");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[10000] flex h-dvh w-full items-center justify-center overflow-hidden bg-background"
    >
      <div ref={label} className="flex flex-col items-center gap-6 text-text">
        <p className="flex items-center gap-3 px-6 text-center font-display text-3xl tracking-wide sm:text-4xl md:text-5xl">
          <span className="block size-2.5 bg-acid" />
          {NAME}
        </p>
        <p ref={count} className="font-condensed text-sm tracking-[0.4em] text-subtle">
          00
        </p>
      </div>
    </div>
  );
}

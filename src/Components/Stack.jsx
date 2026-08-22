import { lazy, Suspense, useRef } from "react";
import { CODE_DATA } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";

const SPLINE_SCENE = "https://prod.spline.design/rrwZ-JfRgHA8TcXd/scene.splinecode";

const Spline = lazy(() => import("@splinetool/react-spline"));

function CodeColumn({ rows }) {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="reveal-kicker kicker">The code</p>
      <h2 className="reveal-title display-title mb-8 text-[clamp(2.6rem,9vw,5.5rem)] text-paper md:mb-12">
        What <span className="text-acid">I build</span>
      </h2>
      <ul className="flex flex-col">
        {rows.map((row) => (
          <li
            key={row.name}
            className="reveal-item grid grid-cols-1 items-baseline gap-2 border-b border-border py-4 sm:grid-cols-12 sm:gap-0 sm:py-5"
          >
            <span className="font-condensed text-[0.65rem] uppercase tracking-[0.22em] text-faint sm:col-span-4 sm:text-xs sm:tracking-[0.28em]">
              {row.name}
            </span>
            <span className="flex flex-wrap gap-x-4 gap-y-2 text-[0.98rem] text-soft sm:col-span-8 sm:gap-x-5 sm:text-[1.05rem]">
              {row.items.map((item, i) => (
                <span key={item} className="inline-flex items-center gap-2">
                  {item}
                  {i < row.items.length - 1 && (
                    <span className="inline-block size-1.5 rotate-45 bg-acid" />
                  )}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SplinePanel() {
  return (
    <div className="relative flex h-[min(68vw,360px)] w-full items-center sm:h-[min(60vw,400px)] md:h-[min(72svh,520px)]">
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center">
            <div className="size-8 animate-pulse rounded-full bg-border" />
          </div>
        }
      >
        <Spline scene={SPLINE_SCENE} className="spline-blend size-full" />
      </Suspense>
    </div>
  );
}

export default function Stack({ ready }) {
  const root = useRef(null);
  useReveal(root, ready);

  return (
    <section ref={root} className="section-y overflow-x-clip bg-background">
      <div className="wrap grid items-start gap-10 md:grid-cols-2 md:gap-x-10 lg:gap-x-16 xl:gap-x-24">
        <CodeColumn rows={CODE_DATA} />

        <div
          className="reveal-item md:sticky md:top-[max(5.5rem,calc(env(safe-area-inset-top)+4.25rem))] md:self-start"
        >
          <SplinePanel />
        </div>
      </div>
    </section>
  );
}

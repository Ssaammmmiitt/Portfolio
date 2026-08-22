import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import { CODE_DATA } from "../data.js";
import { useReveal } from "../hooks/useReveal.js";
import { scrollByDelta } from "../lib/scrollTo.js";

const SPLINE_SCENE = "/spline/stack.splinecode";

const Spline = lazy(() => import("@splinetool/react-spline"));

function SplineFallback() {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="size-8 animate-pulse rounded-full bg-border" />
    </div>
  );
}

class SplineErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

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

function SplinePanel({ ready }) {
  const panelRef = useRef(null);
  const [loadScene, setLoadScene] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      scrollByDelta(event.deltaY);
    };

    panel.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => panel.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  useEffect(() => {
    if (!ready) {
      setLoadScene(false);
      return;
    }

    const panel = panelRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadScene(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px", threshold: 0.01 }
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div
      ref={panelRef}
      className="spline-panel relative flex h-[min(68vw,360px)] w-full min-w-0 items-center sm:h-[min(60vw,400px)] md:h-[min(55svh,420px)] lg:h-[min(72svh,520px)]"
    >
      {loadScene ? (
        <SplineErrorBoundary fallback={<SplineFallback />}>
          <Suspense fallback={<SplineFallback />}>
            <Spline
              scene={SPLINE_SCENE}
              renderOnDemand
              className="spline-blend pointer-events-none size-full"
            />
          </Suspense>
        </SplineErrorBoundary>
      ) : (
        <SplineFallback />
      )}
    </div>
  );
}

export default function Stack({ ready }) {
  const root = useRef(null);
  useReveal(root, ready);

  return (
    <section id="stack" ref={root} className="section-y overflow-x-clip bg-background">
      <div className="wrap grid min-w-0 items-start gap-14 md:grid-cols-2 md:gap-x-14 lg:gap-x-24 xl:gap-x-32">
        <CodeColumn rows={CODE_DATA} />

        <div className="reveal-item min-w-0 md:sticky md:top-8 md:self-start lg:top-28 md:pl-2 lg:pl-6">
          <SplinePanel ready={ready} />
        </div>
      </div>
    </section>
  );
}

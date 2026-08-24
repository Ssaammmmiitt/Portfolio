import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/motion.js";
import { createStructureFlowRenderer, STRUCTURE_FLOW_DEFAULTS } from "./structureFlowRenderer.js";

export function StructureFlowBackground({ className = "", ...props }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const optionsRef = useRef({ ...STRUCTURE_FLOW_DEFAULTS, ...props });
  optionsRef.current = { ...STRUCTURE_FLOW_DEFAULTS, ...props };

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    let renderer;
    try {
      renderer = createStructureFlowRenderer(canvas, () => optionsRef.current);
    } catch {
      return undefined;
    }

    let frame = 0;
    let visible = true;
    const reduced = prefersReducedMotion();

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      renderer.resize(bounds.width, bounds.height);
      renderer.render();
    };

    const tick = () => {
      renderer.render();
      frame = visible && !document.hidden && !reduced ? requestAnimationFrame(tick) : 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !frame && !reduced) frame = requestAnimationFrame(tick);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    resizeObserver.observe(host);
    intersection.observe(host);
    resize();
    if (reduced) {
      renderer.render();
    } else {
      frame = requestAnimationFrame(tick);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      renderer.dispose();
    };
  }, []);

  const options = optionsRef.current;
  const mask = `linear-gradient(to bottom, transparent ${options.maskStart * 100}%, black ${options.maskSolid * 100}%, black 100%)`;
  const layerOpacity = options.blending === "normal" ? 1 : 0.8;

  return (
    <div
      ref={hostRef}
      className={`threeui-background structure-flow${className ? ` ${className}` : ""}`}
      style={{ opacity: layerOpacity, WebkitMaskImage: mask, maskImage: mask }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

/** @typedef {{ speed: number; pointSize: number; opacity: number; maskStart: number; maskSolid: number; color: number; count: number; blending: "additive" | "normal" }} StructureFlowOptions */

/** @type {StructureFlowOptions} */
export const STRUCTURE_FLOW_DEFAULTS = {
  speed: 1,
  pointSize: 0.08,
  opacity: 0.4,
  maskStart: 0.2,
  maskSolid: 0.5,
  color: 0xffffff,
  count: 5500,
  blending: "additive",
};

function hexToRgb(hex) {
  const value = hex >>> 0;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

/**
 * Lightweight Canvas 2D particle field (no Three.js).
 * Avoids the duplicate-Three conflict with Spline's bundled runtime.
 * @param {HTMLCanvasElement} canvas
 * @param {() => StructureFlowOptions} getOptions
 */
export function createStructureFlowRenderer(canvas, getOptions) {
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) {
    throw new Error("2d context unavailable");
  }

  const initial = getOptions();
  const count = Math.max(400, Math.floor(initial.count || STRUCTURE_FLOW_DEFAULTS.count));
  const radius = 25;
  const points = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const u = Math.random();
    Math.random();
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 0.8 + 0.2);
    points[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    points[index * 3 + 1] = radius * Math.cos(phi) - 20;
    points[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  let width = 1;
  let height = 1;
  let dpr = 1;
  let rotY = 0;
  let rotZ = 0;

  const project = (x, y, z) => {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosZ = Math.cos(rotZ);
    const sinZ = Math.sin(rotZ);

    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;
    let y1 = y * cosZ - z1 * sinZ;
    z1 = y * sinZ + z1 * cosZ;

    // Match the old PerspectiveCamera(60) + camera.z=30 feel.
    const fov = 60 * (Math.PI / 180);
    const fl = height / (2 * Math.tan(fov / 2));
    const camZ = 30;
    const depth = z1 + camZ;
    if (depth <= 0.15) return null;

    const scale = fl / depth;
    return {
      x: width / 2 + x1 * scale,
      y: height / 2 - (y1 - 5) * scale,
      size: Math.max(0.35, scale * 0.085),
    };
  };

  return {
    resize(nextWidth, nextHeight) {
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      const compact =
        typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
      dpr = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    render() {
      const options = getOptions();
      rotY += 0.0008 * options.speed;
      rotZ += 0.0002 * options.speed;

      ctx.clearRect(0, 0, width, height);
      const { r, g, b } = hexToRgb(options.color);
      const alpha = Math.max(0.05, Math.min(1, options.opacity));
      const sizeMul = Math.max(0.5, options.pointSize / 0.08);

      if (options.blending === "additive") {
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

      for (let index = 0; index < count; index += 1) {
        const projected = project(
          points[index * 3],
          points[index * 3 + 1],
          points[index * 3 + 2]
        );
        if (!projected) continue;
        const size = projected.size * sizeMul;
        ctx.fillRect(projected.x - size / 2, projected.y - size / 2, size, size);
      }

      ctx.globalCompositeOperation = "source-over";
    },
    dispose() {
      ctx.clearRect(0, 0, width, height);
    },
  };
}

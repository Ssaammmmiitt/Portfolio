import * as THREE from "three128";

/** @typedef {{ speed: number; pointSize: number; opacity: number; maskStart: number; maskSolid: number; color: number; count: number; blending: "additive" | "normal" }} StructureFlowOptions */

const BLEND_MODES = {
  additive: THREE.AdditiveBlending,
  normal: THREE.NormalBlending,
};

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

/**
 * @param {HTMLCanvasElement} canvas
 * @param {() => StructureFlowOptions} getOptions
 */
export function createStructureFlowRenderer(canvas, getOptions) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 30;
  camera.position.y = 5;

  const compact =
    typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  const maxDpr = compact ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
    stencil: false,
    depth: false,
  });
  renderer.setPixelRatio(maxDpr);
  renderer.setClearColor(0x000000, 0);

  const initial = getOptions();
  const count = Math.max(400, Math.floor(initial.count || STRUCTURE_FLOW_DEFAULTS.count));
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const radius = 25;

  for (let index = 0; index < count; index += 1) {
    const u = Math.random();
    Math.random(); // The canonical renderer sampled v even though it did not use it.
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 0.8 + 0.2);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi) - 20;
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size: initial.pointSize,
    color: initial.color,
    transparent: true,
    opacity: initial.opacity,
    blending: BLEND_MODES[initial.blending] ?? THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let lastColor = initial.color;
  let lastSize = initial.pointSize;
  let lastOpacity = initial.opacity;
  let lastBlending = initial.blending;

  return {
    resize(width, height) {
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    render() {
      const options = getOptions();
      particles.rotation.y += 0.0008 * options.speed;
      particles.rotation.z += 0.0002 * options.speed;
      if (options.pointSize !== lastSize) {
        material.size = options.pointSize;
        lastSize = options.pointSize;
      }
      if (options.opacity !== lastOpacity) {
        material.opacity = options.opacity;
        lastOpacity = options.opacity;
      }
      if (options.color !== lastColor) {
        material.color.setHex(options.color);
        lastColor = options.color;
      }
      if (options.blending !== lastBlending) {
        material.blending = BLEND_MODES[options.blending] ?? THREE.AdditiveBlending;
        lastBlending = options.blending;
      }
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}

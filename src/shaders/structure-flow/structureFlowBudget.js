/**
 * Particle budget tuned for typical laptop GPUs (not gaming desktops).
 * Kept separate from the Three renderer so the hero can size the field
 * without eagerly loading `three`.
 * @param {{ phone?: boolean; compact?: boolean }} [viewport]
 */
export function getStructureFlowCount({ phone = false, compact = false } = {}) {
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
  const memory = typeof navigator !== "undefined" ? navigator.deviceMemory || 4 : 4;
  const lowEnd = cores <= 4 || memory <= 4;

  if (phone) return lowEnd ? 1200 : 1800;
  if (compact) return lowEnd ? 2200 : 3200;
  return lowEnd ? 3800 : 5500;
}

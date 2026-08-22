export function scrollByDelta(deltaY) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(lenis.scroll + deltaY);
    return;
  }

  window.scrollBy({ top: deltaY, left: 0, behavior: "auto" });
}

export function scrollToTop() {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.05 });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function scrollToHash(hash) {
  const id = hash.replace(/^#/, "");
  const target = document.getElementById(id);
  if (!target) return;

  const offset = -72;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.05 });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

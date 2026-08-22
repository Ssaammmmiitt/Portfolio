export function scrollToHash(hash) {
  const id = hash.replace(/^#/, "");
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.05 });
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

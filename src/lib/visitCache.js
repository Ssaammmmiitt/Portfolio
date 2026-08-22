const VISITED_KEY = "sammit-site-visited";
const SCROLL_KEY = "sammit-site-scroll";

function canStore() {
  try {
    return typeof window !== "undefined" && Boolean(window.sessionStorage);
  } catch {
    return false;
  }
}

export function disableBrowserScrollRestore() {
  if (typeof history !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}

export function hasVisited() {
  if (!canStore()) return false;
  return sessionStorage.getItem(VISITED_KEY) === "1";
}

export function markVisited() {
  if (!canStore()) return;
  sessionStorage.setItem(VISITED_KEY, "1");
}

export function saveScroll(y) {
  if (!canStore()) return;
  sessionStorage.setItem(SCROLL_KEY, String(Math.max(0, Math.round(y))));
}

export function readScroll() {
  if (!canStore()) return 0;
  const n = Number(sessionStorage.getItem(SCROLL_KEY));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function isAlreadyInView(el, offset = 0.82) {
  if (!el) return false;
  return el.getBoundingClientRect().top < window.innerHeight * offset;
}

export function restoreScrollNow() {
  disableBrowserScrollRestore();
  const y = readScroll();
  if (hasVisited() && y > 0) {
    window.scrollTo(0, y);
  }
}

if (typeof window !== "undefined" && import.meta.env.MODE !== "test") {
  restoreScrollNow();
}

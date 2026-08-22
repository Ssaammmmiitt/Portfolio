const VISITED_KEY = "sammit-site-visited";
const SCROLL_KEY = "sammit-site-scroll";
const RELOAD_STREAK_KEY = "sammit-site-reload-streak";
const RELOAD_STREAK_TS_KEY = "sammit-site-reload-streak-ts";
const RELOAD_WINDOW_MS = 1200;

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

function clearReloadStreak() {
  if (!canStore()) return;
  sessionStorage.removeItem(RELOAD_STREAK_KEY);
  sessionStorage.removeItem(RELOAD_STREAK_TS_KEY);
}

/** At scroll top, two reloads within RELOAD_WINDOW_MS trigger a full fresh load. */
export function getReloadStreak(now = Date.now()) {
  if (!canStore()) {
    return { atTop: false, shouldHardReset: false };
  }

  const atTop = readScroll() === 0;
  if (!atTop) {
    return { atTop: false, shouldHardReset: false, clearStreak: true };
  }

  const lastTs = Number(sessionStorage.getItem(RELOAD_STREAK_TS_KEY));
  let streak = Number(sessionStorage.getItem(RELOAD_STREAK_KEY)) || 0;

  if (!Number.isFinite(lastTs) || now - lastTs > RELOAD_WINDOW_MS) {
    streak = 0;
  }

  streak += 1;

  return {
    atTop: true,
    shouldHardReset: streak >= 2,
    streak,
    now,
  };
}

export function applyReloadStreak(result) {
  if (!canStore()) return false;

  if (result.clearStreak) {
    clearReloadStreak();
    return false;
  }

  if (result.shouldHardReset) {
    sessionStorage.removeItem(VISITED_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    clearReloadStreak();
    window.scrollTo(0, 0);
    window.location.reload();
    return true;
  }

  sessionStorage.setItem(RELOAD_STREAK_KEY, String(result.streak));
  sessionStorage.setItem(RELOAD_STREAK_TS_KEY, String(result.now));
  return false;
}

export function handleDoubleReloadAtTop() {
  return applyReloadStreak(getReloadStreak());
}

if (typeof window !== "undefined" && import.meta.env.MODE !== "test") {
  disableBrowserScrollRestore();
  if (!handleDoubleReloadAtTop()) {
    restoreScrollNow();
  }
}

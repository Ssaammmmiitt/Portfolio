const VISITED_KEY = "sammit-site-visited";
const SCROLL_KEY = "sammit-site-scroll";
const RELOAD_STREAK_KEY = "sammit-site-reload-streak";
const RELOAD_STREAK_TS_KEY = "sammit-site-reload-streak-ts";
const HARD_RESET_KEY = "sammit-site-hard-reset";
const RELOAD_WINDOW_MS = 2000;
const TOP_SCROLL_THRESHOLD = 2;

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

function clearReloadStreak() {
  if (!canStore()) return;
  sessionStorage.removeItem(RELOAD_STREAK_KEY);
  sessionStorage.removeItem(RELOAD_STREAK_TS_KEY);
}

function persistReloadStreak(streak, now) {
  if (!canStore()) return;
  sessionStorage.setItem(RELOAD_STREAK_KEY, String(streak));
  sessionStorage.setItem(RELOAD_STREAK_TS_KEY, String(now));
}

function prepareHardReset() {
  if (!canStore()) return;
  sessionStorage.setItem(HARD_RESET_KEY, "1");
  sessionStorage.removeItem(VISITED_KEY);
  sessionStorage.removeItem(SCROLL_KEY);
  clearReloadStreak();
}

function clearUrlHash() {
  if (typeof window === "undefined" || !window.location.hash) return;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

/** At scroll top, two reloads within RELOAD_WINDOW_MS trigger a full fresh load. */
export function getReloadStreak(now = Date.now(), windowY = 0) {
  if (!canStore()) {
    return { atTop: false, shouldHardReset: false };
  }

  const atTop = readScroll() === 0 && windowY <= TOP_SCROLL_THRESHOLD;
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
    prepareHardReset();
    window.scrollTo(0, 0);
    clearUrlHash();
    window.location.replace(window.location.pathname + window.location.search);
    return true;
  }

  persistReloadStreak(result.streak, result.now);
  return false;
}

export function handleDoubleReloadAtTop() {
  const windowY = typeof window !== "undefined" ? window.scrollY : 0;
  return applyReloadStreak(getReloadStreak(Date.now(), windowY));
}

/** Record scroll + reload streak as the page unloads (covers fast double-refresh). */
export function recordUnloadScrollState(windowY = 0, now = Date.now()) {
  if (!canStore()) {
    return { atTop: false, shouldHardReset: false };
  }

  saveScroll(windowY);

  if (windowY > TOP_SCROLL_THRESHOLD) {
    clearReloadStreak();
    return { atTop: false, shouldHardReset: false };
  }

  const result = getReloadStreak(now, windowY);
  if (result.shouldHardReset) {
    prepareHardReset();
    return result;
  }

  if (!result.clearStreak) {
    persistReloadStreak(result.streak, result.now);
  }

  return result;
}

/** Finish a hard reset on the next load: top of page, no restored scroll, preloader runs. */
export function completeHardResetIfNeeded() {
  if (!canStore() || sessionStorage.getItem(HARD_RESET_KEY) !== "1") {
    return false;
  }

  sessionStorage.removeItem(HARD_RESET_KEY);
  sessionStorage.removeItem(VISITED_KEY);
  sessionStorage.removeItem(SCROLL_KEY);
  clearReloadStreak();
  disableBrowserScrollRestore();

  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
    clearUrlHash();
  }

  return true;
}

export function restoreScrollNow() {
  disableBrowserScrollRestore();
  const y = readScroll();
  if (hasVisited() && y > 0) {
    window.scrollTo(0, y);
  }
}

if (typeof window !== "undefined" && import.meta.env.MODE !== "test") {
  disableBrowserScrollRestore();

  window.addEventListener(
    "pagehide",
    () => {
      recordUnloadScrollState(window.scrollY);
    },
    { capture: true }
  );

  const didHardReset = completeHardResetIfNeeded();

  if (!didHardReset && !handleDoubleReloadAtTop()) {
    restoreScrollNow();
  }
}

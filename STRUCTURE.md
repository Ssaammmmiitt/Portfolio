# Project structure

How this portfolio is organized, what each part does, and how the page is rendered.

## Runtime flow

```
index.html
  └── src/main.jsx          visitCache (early), ThemeProvider, global CSS
        └── App.jsx         Shell: preloader, nav, sections, footer
              ├── Preloader → onDone unlocks scroll + section animations
              ├── Navbar    → fixed top nav (GSAP + Framer Motion)
              ├── NavDock   → bottom dock nav (visible after hero scroll)
              ├── ScrollToTop → back-to-top button (bottom left)
              ├── main
              │     ├── Hero          GSAP intro; phone skips parallax scrub
              │     ├── Manifesto     Sticky pin on sm+; natural flow on phones
              │     ├── Marquee
              │     ├── Works         Project list, GitHub links, hover previews (lg+)
              │     ├── Stack         Skills list + lazy Spline 3D scene
              │     ├── Strategy      Collapsible; grid on lg+, card list below
              │     ├── Stats
              │     ├── Leadership    Timeline of roles / events
              │     ├── About         Bio scroll highlight
              │     └── Contact       Web3Forms + hCaptcha
              └── Footer
```

`App.jsx` owns global UX: Lenis (fine pointer only), scroll progress bar, theme/scroll sync, and the preloader gate (`preloaderDone`) passed to sections as `ready` / `animate`.

## Directories

| Path | Role |
|------|------|
| `src/Components/` | All live UI sections and shared widgets |
| `src/data/data.js` | Single source of truth: copy, links, projects, leadership, stats, form options, CV |
| `src/data.js` | Re-exports `./data/data.js` for short imports |
| `src/context/` | `ThemeProvider` — light/dark via `html.light` + CSS variables |
| `src/hooks/` | Scroll, nav, reveal, and theme-sync hooks |
| `src/lib/` | GSAP setup, motion helpers, CV URLs, contact API, visit cache, utilities |
| `src/test/` | Vitest setup, render helpers, mocks |
| `public/images/` | Project thumbnails, logo, icons |
| `public/spline/` | Self-hosted Spline scene for the Stack section |

## Hooks

| Hook | Purpose |
|------|---------|
| `useLenis` | Lenis + GSAP on fine pointers; native scroll on coarse (phones/tablets). Keyboard scroll; persists position |
| `useInPageNav` | Same-page hash links with nav offset |
| `useScrollNav` | Toggles top navbar vs bottom dock based on hero visibility |
| `useThemeScrollSync` | Refreshes GSAP after theme change or real width/orientation changes (ignores iOS URL-bar height) |
| `useReveal` | Section reveal animations with “already in view” skip |

## Lib modules

| Module | Purpose |
|--------|---------|
| `visitCache.js` | First-visit preloader, scroll restore, double-reload-at-top hard reset |
| `scrollTo.js` | Lenis-aware scroll helpers and hash navigation |
| `motion.js` | Viewport checks, ScrollTrigger refresh, manifesto/scroll color vars |
| `cv.js` | Drive download URL → iframe preview URL; `hasCv()` |
| `contactForm.js` | Web3Forms POST wrapper |
| `contactValidation.js` | Client-side contact form validation |
| `gsap.js` | Central GSAP + ScrollTrigger registration |
| `utils.js` | `cn()` and small helpers |

## Visit and scroll behavior

Loaded early from `main.jsx` via `visitCache.js`:

- **First visit** — preloader runs; visit flag stored in `sessionStorage` when intro finishes.
- **Return visit** — preloader skipped; scroll position restored from `sessionStorage`.
- **Double reload at top** — two quick refreshes while at scroll top (within ~2s) clear visit/scroll state and reload as a fresh first visit.
- **Browser scroll restoration** — disabled; scroll is managed manually.
- **Mobile** — native touch scroll (no Lenis). Manifesto/Strategy avoid tall sticky traps. `overflow-x: hidden` on `html`/`body` (not `clip`).

## Keyboard scroll

- **Space** — page scroll via Lenis (with `(spacebar)` hint in Hero). Fine pointer only.
- **First visit** — space is blocked until the hero intro completes (~1.5–2s), or immediately on return visits / reduced motion.
- **Arrow / Page Up / Down** — after preloader, when Lenis is enabled.

## Components (active)

| Component | Rendered by | Notes |
|-----------|-------------|--------|
| `Hero.jsx` | `App` | Name, role, availability; GSAP intro; gibberish name decode; parallax off on phones |
| `Manifesto.jsx` | `App` | Headlines + body color-scrub; sticky pin sized to content + modest extra on `sm+`; `MouseFollowingEyes` on xl |
| `Marquee.jsx` | `App` | Infinite capability keyword strip |
| `Works.jsx` | `App` | Seven projects with summaries, stack chips, GitHub icon, hover image + stack (`lg+`); CV viewer entry |
| `Stack.jsx` | `App` | Code list + deferred Spline scene (`public/spline/stack.splinecode`) |
| `Strategy.jsx` | `App` | Collapsed by default; desktop 2-col grid; mobile/tablet vertical cards |
| `Stats.jsx` | `App` | Animated stat counters |
| `Leadership.jsx` | `App` | Timeline; role is the headline, event is accented |
| `About.jsx` | `App` | Bio scroll highlight |
| `Contact.jsx` | `App` | Form → hCaptcha → Web3Forms |
| `Footer.jsx` | `App` | Clocks, nav, social, CV, large name |
| `Navbar.jsx` | `App` | Links from `NAV_LINKS`, theme toggle, CV download |
| `NavDock.jsx` | `App` | Bottom dock; uses `Dock.jsx`; wrapper is `pointer-events-none` |
| `ScrollToTop.jsx` | `App` | Floating back-to-top control |
| `Preloader.jsx` | `App` | First-visit intro only |
| `SmoothCursor.jsx` | `App` | Spring pointer (`any-hover` + fine pointer) |
| `CvDownloadButton.jsx` | Navbar / Footer / Dock | Opens `CV.url` |
| `CvViewerModal.jsx` | Works | Drive preview iframe + download |
| `GibberishText.jsx` | Hero | Animated name decode |
| `MouseFollowingEyes.jsx` | Manifesto | Desktop eyes that track cursor |
| `Logo.jsx`, `SocialLinks.jsx`, `ThemeToggle.jsx` | Navbar / Footer / Dock | Shared chrome |

## Data and theming

- **`src/data/data.js`** — hero text, `PROJECTS` (name, summary, year, stack `tag`, GitHub, thumbnail), `LEADERSHIP`, strategy cards, budgets, socials, email, `CONTACT_TOPICS`, `CV`.
- **`CULTURE_DATA`** — exported in data but not wired to a section.
- **`src/index.css`** — theme tokens (`--theme-*`), Tailwind `@theme`, utilities (`wrap`, `section-y`, `kicker`, project/stack chips).
- Dark accent: cyan (`#22d3ee`). Light: teal (`#0891b2`) on slate (`#f1f5f9`).

## Contact form

1. User submits → client validation (`contactValidation.js`), honeypot, topic selection, and 24h local cooldown
2. hCaptcha widget (`@hcaptcha/react-hcaptcha`)
3. `src/lib/contactForm.js` POSTs `FormData` to Web3Forms
4. Keys in `.env`: `VITE_WEB3FORMS_ACCESS_KEY`, `VITE_HCAPTCHA_SITE_KEY`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Preview production build |
| `npm run test` | Vitest unit and component tests |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` | ESLint |
| `npm run check` | lint + test + build |
| `npm run deploy` | Build and publish `dist/` via gh-pages |

## Tests

Tests live next to source (`*.test.js` / `*.test.jsx`). `src/test/setup.jsx` mocks GSAP, Spline, and hCaptcha so components can render in jsdom without WebGL or network calls.

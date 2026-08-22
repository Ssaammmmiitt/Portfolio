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
              │     ├── Hero          (GSAP intro; spacebar hint after intro)
              │     ├── Manifesto     (pinned scroll text + mouse-following eyes)
              │     ├── Marquee
              │     ├── Strategy      (stacked approach cards)
              │     ├── Works         (featured project cards)
              │     ├── Stack         (skills list + lazy Spline 3D scene)
              │     ├── Stats
              │     ├── About
              │     └── Contact       (Web3Forms + hCaptcha)
              └── Footer
```

`App.jsx` owns global UX: Lenis smooth scroll, scroll progress bar, theme/scroll sync, and the preloader gate (`preloaderDone`) passed to sections as `ready` / `animate`.

## Directories

| Path | Role |
|------|------|
| `src/Components/` | All live UI sections and shared widgets |
| `src/data/data.js` | Single source of truth: copy, links, projects, stats, form options |
| `src/data.js` | Re-exports `./data/data.js` for short imports |
| `src/context/` | `ThemeProvider`  -  light/dark via `html.light` + CSS variables |
| `src/hooks/` | Scroll, nav, reveal, and theme-sync hooks (see below) |
| `src/lib/` | GSAP setup, motion helpers, contact API, visit cache, utilities |
| `src/test/` | Vitest setup, render helpers, mocks |
| `public/images/` | Project thumbnails, logo, icons |
| `public/spline/` | Self-hosted Spline scene for the Stack section |

## Hooks

| Hook | Purpose |
|------|---------|
| `useLenis` | Smooth scroll (Lenis + GSAP ScrollTrigger); keyboard scroll; persists scroll position |
| `useInPageNav` | Same-page hash links with nav offset |
| `useScrollNav` | Toggles top navbar vs bottom dock based on hero visibility |
| `useThemeScrollSync` | Refreshes GSAP scroll colors when theme changes |
| `useReveal` | Section reveal animations with “already in view” skip |

## Lib modules

| Module | Purpose |
|--------|---------|
| `visitCache.js` | First-visit preloader, scroll restore, double-reload-at-top hard reset |
| `scrollTo.js` | Lenis-aware scroll helpers and hash navigation |
| `motion.js` | Shared GSAP/ScrollTrigger helpers, viewport checks |
| `contactForm.js` | Web3Forms POST wrapper |
| `contactValidation.js` | Client-side contact form validation |
| `gsap.js` | Central GSAP + ScrollTrigger registration |

## Visit and scroll behavior

Loaded early from `main.jsx` via `visitCache.js`:

- **First visit**  -  preloader runs; visit flag stored in `sessionStorage` when intro finishes.
- **Return visit**  -  preloader skipped; scroll position restored from `sessionStorage`.
- **Double reload at top**  -  two quick refreshes while at scroll top (within ~2s) clear visit/scroll state and reload as a fresh first visit (preloader + top of page).
- **Browser scroll restoration**  -  disabled; scroll is managed manually.

## Keyboard scroll

- **Space**  -  page scroll via Lenis (with `(spacebar)` hint in Hero).
- **First visit**  -  space is blocked until the hero intro animation completes (~1.5–2s), or immediately on return visits / reduced motion.
- **Arrow / Page Up / Down**  -  available once Lenis is enabled (after preloader).

## Components (active)

| Component | Rendered by | Notes |
|-----------|-------------|--------|
| `Hero.jsx` | `App` | Name, role, availability; GSAP intro; gibberish name decode |
| `Manifesto.jsx` | `App` | Pinned scroll manifesto lines; `MouseFollowingEyes` on desktop |
| `Marquee.jsx` | `App` | Infinite tech keyword strip |
| `Strategy.jsx` | `App` | Principle cards with scroll scale |
| `Stack.jsx` | `App` | Code list + deferred Spline scene (`public/spline/stack.splinecode`) |
| `Stats.jsx` | `App` | Animated stat counters |
| `Works.jsx` | `App` | Featured project cards |
| `About.jsx` | `App` | Bio scroll highlight |
| `Contact.jsx` | `App` | Form → hCaptcha → Web3Forms |
| `Footer.jsx` | `App` | Clocks, nav, social, large name |
| `Navbar.jsx` | `App` | Links from `NAV_LINKS`, theme toggle |
| `NavDock.jsx` | `App` | Bottom dock nav; uses `Dock.jsx` |
| `ScrollToTop.jsx` | `App` | Floating back-to-top control (bottom left) |
| `Preloader.jsx` | `App` | First-visit intro only |
| `SmoothCursor.jsx` | `App` | Spring-animated pointer (`lg+`, fine pointer) |
| `GibberishText.jsx` | Hero | Animated name decode effect |
| `MouseFollowingEyes.jsx` | Manifesto | Desktop eyes that track cursor |
| `Logo.jsx`, `SocialLinks.jsx`, `ThemeToggle.jsx` | Navbar / Footer | Shared chrome |

## Data and theming

- **`src/data/data.js`**  -  edit content here (hero text, projects, strategy cards, budgets, social URLs, email, `CONTACT_TOPICS`, etc.).
- **`CULTURE_DATA`**  -  exported in data but not yet wired to a section.
- **`src/index.css`**  -  theme tokens (`--theme-*`), Tailwind `@theme`, utilities (`wrap`, `section-y`, `kicker`).
- Dark accent: cyan (`#22d3ee`). Light accent: amber (`#b45309`) with stone-grey text.

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

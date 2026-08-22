# Project structure

How this portfolio is organized, what each part does, and how the page is rendered.

## Runtime flow

```
index.html
  └── src/main.jsx          ThemeProvider + global CSS
        └── App.jsx         Shell: preloader, navbar, sections, footer
              ├── Preloader → onDone unlocks scroll + animations
              ├── Navbar    → fixed nav (GSAP + Framer Motion)
              ├── main
              │     ├── Hero
              │     ├── Manifesto   (scroll-pinned GSAP text)
              │     ├── Marquee
              │     ├── Strategy    (stacked approach cards)
              │     ├── Stack       (skills + Spline 3D)
              │     ├── Stats
              │     ├── Works
              │     ├── About
              │     └── Contact     (Web3Forms + hCaptcha)
              └── Footer
```

`App.jsx` owns global UX: Lenis smooth scroll, scroll progress bar, custom cursor, and the preloader gate (`preloaderDone`) passed to sections as `ready` / `animate`.

## Directories

| Path | Role |
|------|------|
| `src/Components/` | All live UI sections and shared widgets |
| `src/data/data.js` | Single source of truth: copy, links, projects, stats, form options |
| `src/data.js` | Re-exports `./data/data.js` for short imports |
| `src/context/` | `ThemeProvider`  -  light/dark via `html.light` + CSS variables |
| `src/hooks/` | `useLenis`, `useReveal`  -  scroll and section reveal helpers |
| `src/lib/` | GSAP setup, motion helpers, contact API, visit cache, utilities |
| `src/test/` | Vitest setup, render helpers, mocks |
| `public/images/` | Static assets (logo, icons) |

## Components (active)

| Component | Rendered by | Notes |
|-----------|-------------|--------|
| `Hero.jsx` | `App` | Name, role, availability; GSAP intro |
| `Manifesto.jsx` | `App` | Pinned scroll manifesto lines |
| `Marquee.jsx` | `App` | Infinite tech keyword strip |
| `Strategy.jsx` | `App` | Five principle cards with scroll scale |
| `Stack.jsx` | `App` | Code list + lazy-loaded Spline scene |
| `Stats.jsx` | `App` | Animated stat counters |
| `Works.jsx` | `App` | Featured project cards |
| `About.jsx` | `App` | Bio scroll highlight |
| `Contact.jsx` | `App` | Form → hCaptcha → Web3Forms |
| `Footer.jsx` | `App` | Clocks, nav, social, large name |
| `Navbar.jsx` | `App` | Links from `NAV_LINKS`, theme toggle |
| `Preloader.jsx` | `App` | First-visit intro only |
| `Cursor.jsx` | `App` | Desktop custom cursor |
| `Logo.jsx`, `SocialLinks.jsx`, `ThemeToggle.jsx` | Navbar / Footer | Shared chrome |

## Data and theming

- **`src/data/data.js`**  -  edit content here (hero text, projects, strategy cards, budgets, social URLs, email).
- **`src/index.css`**  -  theme tokens (`--theme-*`), Tailwind `@theme`, utilities (`wrap`, `section-y`, `kicker`).
- Dark accent: cyan (`#22d3ee`). Light accent: amber (`#b45309`) with stone-grey text.

## Contact form

1. User submits → client validation, honeypot, and 24h local cooldown
2. hCaptcha widget (`@hcaptcha/react-hcaptcha`)
3. `src/lib/contactForm.js` POSTs `FormData` to Web3Forms
4. Keys in `.env`: `VITE_WEB3FORMS_ACCESS_KEY`, `VITE_HCAPTCHA_SITE_KEY`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production bundle → `dist/` |
| `npm run test` | Vitest unit and component tests |
| `npm run lint` | ESLint |
| `npm run check` | lint + test + build |
| `npm run deploy` | Build and publish `dist/` via gh-pages |

## Tests

Tests live next to source (`*.test.js` / `*.test.jsx`). `src/test/setup.jsx` mocks GSAP, Spline, and hCaptcha so components can render in jsdom without WebGL or network calls.

# Sammit Poudyal — Portfolio

Personal portfolio for **Sammit Poudyal** (full-stack developer · applied AI).  
Built with **React 19**, **Vite 7**, **GSAP**, **Lenis**, **Framer Motion**, and **Tailwind CSS v4**.

Live copy, projects, leadership, CV paths, and form options all live in [`src/data/data.js`](src/data/data.js). Deeper architecture notes are also in [`STRUCTURE.md`](STRUCTURE.md).

---

## Quick start

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

Create a `.env` from [`.env.example`](.env.example) for the contact form:

```bash
cp .env.example .env
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` | ESLint |
| `npm run check` | Lint + test + build (CI-style gate) |
| `npm run deploy` | Build and publish `dist/` with `gh-pages` |

Latest local check: **62 tests passed**, lint clean (1 unrelated react-refresh warning), production build OK.

---

## How the app boots

```
index.html
  └── Google Fonts (Geist Pixel, Dosis, Economica, Bungee, …)
  └── src/main.jsx
        ├── visitCache (early session / scroll restore)
        ├── ThemeProvider (light / dark on <html>)
        └── App.jsx
              ├── Preloader (first visit only)
              ├── Navbar + NavDock + ScrollToTop
              ├── Sections (Hero → … → Contact)
              ├── Footer
              └── CvViewerModal (local PDF)
```

`App.jsx` owns global UX:

- **Preloader gate** — `preloaderDone` unlocks Lenis, section animations (`ready` / `animate`), and spacebar scroll
- **Lenis** — smooth scroll on fine pointers; native scroll on phones/tablets
- **Scroll progress bar** — GSAP scrub at the top of the page
- **Nav swap** — top navbar while in hero; bottom dock after scrolling past
- **CV modal state** — view / collapse / close shared across Navbar, Works, and modal

---

## Page order (current)

| Order | Section | Component | Notes |
|------:|---------|-----------|--------|
| 1 | Hero | `Hero.jsx` | Name decode, Economica role line, meta row, Structure Flow canvas background |
| 2 | Manifesto | `Manifesto.jsx` | Sticky pin on `sm+`; scroll color scrub; eyes on xl |
| 3 | Marquee | `Marquee.jsx` | Infinite capability keywords |
| 4 | Works | `Works.jsx` | Projects + GitHub links; hover image/stack on `lg+` (not over the GitHub icon) |
| 5 | Stack | `Stack.jsx` | Skills (`CODE_DATA`) + lazy Spline scene |
| — | Strategy | `Strategy.jsx` | Collapsible approach cards — **present in codebase, currently commented out in `App.jsx`** |
| 6 | Stats | `Stats.jsx` | Animated counters |
| 7 | Leadership | `Leadership.jsx` | “Beyond the build” — collapsible timeline (same pattern as Strategy) |
| 8 | About | `About.jsx` | “Software Engineer” + bio word highlight on scroll |
| 9 | Contact | `Contact.jsx` | Web3Forms + hCaptcha |
| 10 | Footer | `Footer.jsx` | Compact links, socials, clocks, logo |

---

## Content & configuration

### Single source of truth — `src/data/data.js`

Edit here to update the site without touching components:

| Export | Used for |
|--------|----------|
| `NAME`, `ROLE`, `LOCATION`, `AVAILABILITY`, `EMAIL` | Hero / identity |
| `CV` | Local resume (`url`, `fileName`, `label`) |
| `CODE_DATA` | Stack skills columns |
| `PROJECTS` | Works list (summary, tag, year, github, thumbnail, featured) |
| `LEADERSHIP` | Extracurricular timeline |
| `STRATEGY` | Approach cards (when Strategy is enabled) |
| `STATS`, `MARQUEE`, `BIO_TEXTS` | Stats / marquee / About |
| `NAV_LINKS`, `SOCIALS`, `CLOCKS` | Nav + Footer |
| `CONTACT_TOPICS`, `BUDGETS` | Contact form options |

`src/data.js` re-exports `./data/data.js` for short imports.

### CV (local PDF)

1. Put the file in `public/CV/` (current: `public/CV/Sammit-CV.pdf`)
2. Set in `data.js`:

```js
export const CV = {
  url: "/CV/Sammit-CV.pdf",
  fileName: "Sammit-CV.pdf",
  label: "CV",
};
```

Helpers in `src/lib/cv.js`:

- `getCvPreviewUrl()` — iframe src
- `verifyCvAvailability()` — HEAD check for local files
- `triggerCvDownload()` / `getCvDownloadLinkProps()` — download with error handling
- `hasCv()` — hide UI when `url` is empty

Wired into: **View CV** / **Download CV** (Navbar), Works CTA, Footer, NavDock, `CvViewerModal`.

### Contact form

Flow:

1. Client validation (`contactValidation.js`) + honeypot + topic chips  
2. 24h local cooldown (`canSubmitContactForm`)  
3. hCaptcha (`@hcaptcha/react-hcaptcha`)  
4. POST via `contactForm.js` → [Web3Forms](https://web3forms.com)

Env (see `.env.example`):

```env
VITE_WEB3FORMS_ACCESS_KEY=your-key
VITE_HCAPTCHA_SITE_KEY=your-site-key
```

---

## Fonts

Loaded from Google Fonts in `index.html`:

| Font | Role |
|------|------|
| **Geist Pixel** | Normal / UI body (`--font-sans`) — footer, Connect with me, hero meta, about, form copy, etc. |
| **Dosis 800** | Large display titles (`.display-title`) |
| **Economica** | Hero role line (“Full-Stack Developer · Applied AI”) |
| **Bungee** | Capitals / brand uppercase (kickers, nav labels, stack chips, logo) |
| **Fredoka / Oswald / Boogaloo / Figtree** | Available tokens / utilities for accents |

Theme tokens live in `src/index.css` (`@theme` + `--theme-*` for dark/light).

---

## Theme

- `ThemeProvider` toggles `html.light`
- **Dark** — near-black background, cyan accent (`#22d3ee`)
- **Light** — soft stone off-white (`#ebe9e4`), teal accent (`#0f766e`)
- Accent / surfaces / dock / CV pill / strategy-style panels all use CSS variables so one toggle updates the whole UI

---

## Key integrations

| Integration | Where | Purpose |
|-------------|-------|---------|
| **GSAP + ScrollTrigger** | `src/lib/gsap.js`, sections | Intro, reveal, scrub, pin |
| **Lenis** | `useLenis` | Smooth scroll (desktop) |
| **Framer Motion** | Navbar menu, CV modal | Enter/exit UI motion |
| **Spline** | `Stack.jsx` → `@splinetool/react-spline` | 3D stack visual (`public/spline/`) |
| **Structure Flow** | Hero background (Canvas 2D) | Particle field; unmounts off-hero for performance |
| **Web3Forms** | `contactForm.js` | Contact delivery |
| **hCaptcha** | `Contact.jsx` | Spam / human check |
| **gh-pages** | `npm run deploy` | Static hosting to GitHub Pages |

---

## Important directories

| Path | Role |
|------|------|
| `src/Components/` | Sections + shared UI (Navbar, Dock, CV modal, …) |
| `src/hooks/` | Lenis, in-page nav, scroll nav, reveal, theme scroll sync |
| `src/lib/` | GSAP, motion, CV, contact, visit cache, utils |
| `src/context/` | Theme provider |
| `src/shaders/structure-flow/` | Hero Canvas 2D particle field |
| `src/test/` | Vitest setup + providers |
| `public/images/` | Project thumbnails |
| `public/CV/` | Resume PDF |
| `public/spline/` | Self-hosted Spline scene |

---

## Visit / scroll behavior

Handled early by `src/lib/visitCache.js` (imported from `main.jsx`):

- **First visit** — preloader runs; flag stored in `sessionStorage` when intro finishes  
- **Return visit** — skip preloader; restore scroll  
- **Double reload at top** — clears visit/scroll and treats as first visit  
- **Browser scroll restoration** — disabled; Lenis / manual scroll owns position  
- **Spacebar** — scrolls the page (not theme toggle); available once the preloader finishes  

---

## Tests

Tests sit next to source (`*.test.js` / `*.test.jsx`). Setup in `src/test/setup.jsx` mocks GSAP, Spline, and hCaptcha so jsdom doesn’t need WebGL or network.

Covered areas include: App shell, Navbar CV order, Leadership collapse, CV helpers/download errors, contact form flow, data shape, motion helpers, visit cache, and more.

```bash
npm run test
# or
npm run check
```

---

## Deploy

```bash
npm run build    # output in dist/
npm run deploy   # gh-pages publish
```

Ensure project thumbnails and `public/CV/Sammit-CV.pdf` are committed (or available at build time) so production serves them from `/images/…` and `/CV/…`.

---

## Common edits

| Goal | Edit |
|------|------|
| Add / reorder projects | `PROJECTS` in `src/data/data.js` + image in `public/images/` |
| Update skills | `CODE_DATA` |
| Swap resume | Replace `public/CV/…` and update `CV` in data |
| Change accent colors | `--theme-*` in `src/index.css` (`:root` / `html.light`) |
| Re-enable Strategy section | Uncomment `<Strategy … />` in `src/App.jsx` |
| Contact keys | `.env` (`VITE_WEB3FORMS_ACCESS_KEY`, `VITE_HCAPTCHA_SITE_KEY`) |

---

## License / ownership

Private portfolio project for Sammit Poudyal. Update this file when architecture or integrations change.

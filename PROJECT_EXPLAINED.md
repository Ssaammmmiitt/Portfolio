# Portfolio (sammit.com.np) — Project Explained

Interview-ready guide for **this repo only**: how the frontend works, how it talks to external services (there is no custom Node/Express API in this project), schemas, diagrams, and a Sept 10 discussion question bank.

**No application code was changed to produce this file** — documentation only.

---

## Table of contents

1. [One-sentence pitch](#1-one-sentence-pitch)
2. [Architecture diagrams](#2-architecture-diagrams)
3. [How each piece connects (simple terms)](#3-how-each-piece-connects-simple-terms)
4. [File map (what lives where)](#4-file-map-what-lives-where)
5. [Data schemas](#5-data-schemas)
6. [External “backend” / endpoints](#6-external-backend--endpoints)
7. [End-to-end user journeys](#7-end-to-end-user-journeys)
8. [Interview explanations (simple terms)](#8-interview-explanations-simple-terms)
9. [Master question bank — Sept 10](#9-master-question-bank--sept-10)

---

## 1. One-sentence pitch

**This portfolio** is a single-page React + Vite site that presents Sammit’s work, stack, leadership, and contact flow — with polished scroll/motion UX, a local CV viewer, and form delivery through Web3Forms + hCaptcha (not a self-hosted API).

| Layer | What it is here |
|-------|-----------------|
| App | React 19 SPA (no Next.js, no React Router) |
| Build | Vite 7 → static `dist/` |
| Styling | Tailwind CSS v4 + CSS variables (dark/light) |
| Motion | GSAP + ScrollTrigger, Lenis (desktop), Framer Motion (nav/modal) |
| Content | Hardcoded JS module: `src/data/data.js` |
| “Backend” | Third-party: Web3Forms submit API + hCaptcha; static assets on host |
| Deploy | `vite build` + `gh-pages` → GitHub Pages (static hosting) |

**Important interview framing:** This project is **frontend-first**. Full-stack depth shows up in *integrations* (form POST, captcha, env keys, static asset pipeline), not in your own REST controllers.

---

## 2. Architecture diagrams

### 2.1 System overview (production)

```text
┌──────────────────────────────────────────────────────────────┐
│  Browser (visitor)                                           │
│  https://sammit.com.np  (or GitHub Pages URL)                │
│                                                              │
│  index.html → JS bundle (React App)                          │
│    ├── Sections (Hero … Contact)  ← data from data.js        │
│    ├── ThemeProvider ←→ localStorage                         │
│    ├── visitCache ←→ sessionStorage                          │
│    ├── CV iframe ← GET /CV/Sammit-CV.pdf (static)            │
│    ├── Spline scene ← /spline/*.splinecode (static)          │
│    └── Contact form                                          │
│          │ 1) hCaptcha widget (site key)                     │
│          │ 2) POST multipart/form-data                       │
│          ▼                                                   │
└──────────┼───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────┐     ┌─────────────────────────────┐
│  api.web3forms.com       │────►│  Email inbox (configured    │
│  POST /submit            │     │  in Web3Forms dashboard)    │
│  + h-captcha-response    │     └─────────────────────────────┘
└──────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│  hCaptcha verification   │
│  (Web3Forms free plan)   │
└──────────────────────────┘
```

**Rule to say out loud:** The browser never hits *your* Express/FastAPI server. Secrets that matter for email delivery live in Web3Forms; the public access key is a Vite `VITE_*` env value (acceptable for this pattern; still treat it as semi-public).

### 2.2 Component connection diagram

```text
main.jsx
  ├── visitCache.js          (session: first visit / scroll restore)
  └── ThemeProvider
        └── App.jsx          ★ orchestration hub
              │
              ├── Preloader ──────────► sets preloaderDone
              ├── Navbar / NavDock / ScrollToTop
              ├── CvViewerModal ◄──── openCv / closeCv state
              │
              └── <main> sections (order matters for story + scroll)
                    Hero → Manifesto → Marquee → Works → Stack
                    → Stats → Leadership → About → Contact → Footer
                    (Strategy.jsx exists; currently commented out in App)

Hooks owned by App:
  useLenis(preloaderDone, savedScroll, scrollUnlocked)
  useInPageNav(preloaderDone)
  useScrollNav(preloaderDone)     → showTopNav / showDock
  useThemeScrollSync()            → refresh GSAP after theme/resize

Data flows one way:
  src/data/data.js  ──import──►  Components (no CMS, no fetch for content)
```

### 2.3 Service diagram (what each “service” does)

```text
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Vite (dev/build)│   │  Static host    │   │  Web3Forms      │
│  HMR, bundle,   │   │  (gh-pages)     │   │  receives form  │
│  env inject     │──►│  HTML/JS/CSS/   │   │  emails you     │
│                 │   │  images/CV/     │   └────────┬────────┘
└─────────────────┘   │  spline assets  │            │
                      └─────────────────┘            │
┌─────────────────┐   ┌─────────────────┐            ▼
│  hCaptcha       │   │  Google Fonts   │   Your email (SMTP via
│  bot challenge  │   │  (CDN fonts)    │   Web3Forms, not yours)
└─────────────────┘   └─────────────────┘

Optional / decorative services (client-only):
  • GSAP ScrollTrigger — scroll-driven animation timelines
  • Lenis — smooth wheel scroll on fine pointers
  • Spline runtime — 3D scene in Stack (lazy)
  • Canvas Structure Flow — particle hero background
```

### 2.4 Endpoint / network diagram (every real HTTP call)

This app’s network surface is small. Memorize this table for interviews.

```text
Caller              Method   URL / path                         Why
──────────────────  ───────  ─────────────────────────────────  ────────────────────
Browser (page load) GET      /  /assets/*                       SPA + hashed bundles
Browser             GET      /images/*                          Project thumbnails
Browser             GET      /CV/Sammit-CV.pdf                  CV preview/download
Browser             HEAD     /CV/Sammit-CV.pdf                  verifyCvAvailability()
Browser             GET      /spline/*                          Spline scene assets
Browser             GET      fonts.googleapis.com / gstatic     Typography
Contact.jsx         (widget) hCaptcha CDN / challenge           Human check
contactForm.js      POST     https://api.web3forms.com/submit   Deliver inquiry email
```

There is **no** `/api/projects`, **no** auth endpoint, **no** database query from this frontend.

---

## 3. How each piece connects (simple terms)

Think of the site as **one long page** with a smart shell around it.

1. **`index.html`** loads fonts and mounts React into `#root`.
2. **`main.jsx`** turns on theme + visit cache, then renders `App`.
3. **`App.jsx`** is the conductor: preloader → unlock scroll → Lenis → which nav is visible → which section animations may run → CV modal open/close.
4. **Each section component** is mostly presentational; it reads constants from `data.js` and animates itself when `ready` / `animate` is true.
5. **Contact** is the only place that “calls a backend”: validate → cooldown → captcha → `fetch` Web3Forms.
6. **CV** is not an API: it is a static PDF in `public/CV/` served like any other public file.

**SPA vs multi-page:** Hash / in-page anchors (`#works`, `#contact`, …) via `useInPageNav` + `scrollTo` helpers — not separate React Router routes.

---

## 4. File map (what lives where)

Based on this repository’s `src/` tree (not other projects).

### Boot & shell

| File | Role in plain English |
|------|------------------------|
| `index.html` | Document shell, meta description, Google Fonts link |
| `src/main.jsx` | React root + ThemeProvider + global CSS |
| `src/App.jsx` | Layout order, preloader gate, scroll lock, CV modal state |
| `src/index.css` | Tailwind + theme CSS variables |
| `vite.config.js` | React plugin, Tailwind plugin, Vitest config |

### Content

| File | Role |
|------|------|
| `src/data/data.js` | **Single source of truth** — name, projects, skills, leadership, form options, CV path, socials |
| `src/data.js` | Short re-export path for imports |

### Components (UI)

| File | Role |
|------|------|
| `Hero.jsx` | First viewport: name decode, role, meta, Structure Flow canvas |
| `Manifesto.jsx` | Sticky manifesto + scroll color scrub; eyes on large screens |
| `Marquee.jsx` | Infinite capability keywords |
| `Works.jsx` | Project list, GitHub links, hover previews (desktop), CV CTA |
| `Stack.jsx` | Skills from `CODE_DATA` + lazy Spline |
| `Strategy.jsx` | Approach cards (in codebase; may be commented out in App) |
| `Stats.jsx` | Animated counters |
| `Leadership.jsx` | Collapsible “beyond the build” timeline |
| `About.jsx` | Bio with scroll word highlight |
| `Contact.jsx` | Form UI + hCaptcha + submit |
| `Footer.jsx` | Links, socials, clocks, compact brand |
| `Navbar.jsx` / `NavDock.jsx` / `Dock.jsx` | Top nav vs bottom dock |
| `Preloader.jsx` | First-visit loading screen |
| `ThemeToggle.jsx` | Light/dark switch |
| `CvViewerModal.jsx` + CV buttons | Local PDF view/download |
| `ScrollToTop.jsx`, `SocialLinks.jsx`, `Logo.jsx`, `GibberishText.jsx`, `MouseFollowingEyes.jsx` | Shared chrome / flourish |

### Hooks

| File | Role |
|------|------|
| `useLenis.js` | Smooth scroll (desktop); respects unlock + preloader |
| `useInPageNav.js` | Anchor navigation with offset |
| `useScrollNav.js` | Swap top navbar ↔ bottom dock |
| `useThemeScrollSync.js` | Keep ScrollTrigger correct after theme/resize |
| `useReveal.js` | Section reveal helpers |

### Lib (logic without UI)

| File | Role |
|------|------|
| `contactForm.js` | Web3Forms POST, cooldown localStorage |
| `contactValidation.js` | Client-side field rules |
| `cv.js` | Preview URL, HEAD check, download helpers |
| `visitCache.js` | First visit / scroll restore / double-reload reset |
| `scrollTo.js` | Lenis-aware scrolling |
| `gsap.js` / `motion.js` / `utils.js` | Animation registration + helpers |

### Context & visuals

| File | Role |
|------|------|
| `context/ThemeProvider.jsx` | Theme state + `localStorage` key `portfolio-theme` |
| `shaders/structure-flow/*` | Hero Canvas particle system + performance budget |

### Public assets

| Path | Role |
|------|------|
| `public/CV/` | Resume PDF |
| `public/images/` | Thumbnails / icons |
| `public/spline/` | Self-hosted Spline scene |
| `public/favicon.svg` | Favicon |

### Quality gate

| Command | Meaning |
|---------|---------|
| `npm run test` | Vitest (jsdom; GSAP/Spline/hCaptcha mocked) |
| `npm run check` | lint + test + build |

---

## 5. Data schemas

### 5.1 Identity / CV (from `data.js`)

```js
// Conceptual shape — see src/data/data.js for live values
{
  NAME, FIRST_NAME, ROLE, TITLE, LOCATION, AVAILABILITY, EMAIL,
  CV: { url: "/CV/Sammit-CV.pdf", fileName: "Sammit-CV.pdf", label: "CV" }
}
```

### 5.2 Project item (`PROJECTS[]`)

```js
{
  title: string,
  summary: string,          // visitor-friendly blurb
  tag: string,              // short category label
  year: string | number,
  github: string,           // external URL
  thumbnail: string,        // path under /images/...
  featured: boolean,        // emphasis in Works
  stack?: string[]          // chips (if present in data)
}
```

Updating projects = edit this array + drop an image in `public/images/`. No CMS.

### 5.3 Skills (`CODE_DATA[]`)

```js
{ name: "frontend" | "backend" | "ai / ml" | ..., items: string[] }
```

### 5.4 Contact payload (client → Web3Forms)

Built in `submitContactForm(payload, hcaptchaToken)`:

| FormData field | Source |
|----------------|--------|
| `access_key` | `VITE_WEB3FORMS_ACCESS_KEY` |
| `subject` | Derived: `Portfolio inquiry: {topic} from {name}` |
| `name`, `email`, `topic`, `budget`, `source` | Form fields |
| `message` | Mapped from `payload.project` |
| `botcheck` | Empty honeypot |
| `h-captcha-response` | Token from hCaptcha widget |

### 5.5 Client-only persistence (not a DB)

| Key | Storage | Purpose |
|-----|---------|---------|
| `portfolio-theme` | `localStorage` | dark / light |
| `portfolio_contact_submitted_at` | `localStorage` | 24h submit cooldown |
| visit / scroll keys | `sessionStorage` (via `visitCache`) | Skip preloader; restore position |

---

## 6. External “backend” / endpoints

### 6.1 Web3Forms — the contact “API”

| Item | Detail |
|------|--------|
| URL | `https://api.web3forms.com/submit` |
| Method | `POST` |
| Body | `FormData` (multipart) |
| Success | JSON with `success: true` |
| Failure | Throw with `data.message` or generic error |
| Side effect | Email delivered to inbox configured in Web3Forms |

**Interview analogy:** This is like using Formspree or a serverless function — you outsource “accept form + send email” so you don’t run SMTP or store messages yourself.

### 6.2 hCaptcha

| Item | Detail |
|------|--------|
| Site key | `VITE_HCAPTCHA_SITE_KEY` (Web3Forms free-plan default may be used) |
| Role | Prove a human before submit |
| Where verified | Server-side by Web3Forms using the token you append |

### 6.3 Static asset “endpoints”

Anything under `public/` is copied to site root at build time:

- `GET /CV/Sammit-CV.pdf`
- `GET /images/...`
- `GET /spline/...`

`verifyCvAvailability()` uses **HEAD** on the local PDF path so the UI can fail gracefully if the file is missing.

### 6.4 What is *not* here (say this clearly if asked)

- No MongoDB / PostgreSQL for this site  
- No JWT auth  
- No custom REST resource for projects  
- No SSR/SSG framework (pure CSR SPA from Vite)

---

## 7. End-to-end user journeys

### 7.1 First visit

1. `visitCache` sees no visit flag → Preloader shows.  
2. Scroll locked (`overflow: hidden` + Lenis unlock flag).  
3. Preloader finishes → `preloaderDone`.  
4. Hero intro runs → `scrollUnlocked`.  
5. Lenis + section animations + spacebar scroll enable.  
6. Visit marked in session storage.

### 7.2 Return visit (same tab session)

1. Skip preloader; restore scroll Y.  
2. Scroll unlocked immediately.

### 7.3 Browse projects

1. Scroll or click nav → `#works` (in-page).  
2. `Works` reads `PROJECTS` from data.  
3. GitHub icon opens external repo; hover preview on large screens (not over the GitHub icon).

### 7.4 View / download CV

1. Navbar / Works / Footer / Dock call `openCv` or download helpers.  
2. Modal iframes `getCvPreviewUrl()` → `/CV/Sammit-CV.pdf`.  
3. Download uses `<a download>` for local files.

### 7.5 Contact submit

1. Validate fields (`contactValidation.js`).  
2. Check 24h cooldown (`canSubmitContactForm`).  
3. Complete hCaptcha → token.  
4. `submitContactForm` → Web3Forms.  
5. On success → `markContactFormSubmitted()`.

### 7.6 Theme toggle

1. `ThemeToggle` → `toggleTheme()`.  
2. `html.light` class + `data-theme` + `theme-color` meta.  
3. Persist `portfolio-theme` in `localStorage`.

---

## 8. Interview explanations (simple terms)

### “Walk me through the architecture.”

> It’s a Vite + React SPA. One `App` shell, section components, and a single data module. Motion is GSAP/Lenis on the client. The only write-path to the outside world is the contact form posting to Web3Forms with an hCaptcha token. Everything else is static files.

### “How does frontend connect to backend?”

> There isn’t a custom backend in this repo. Content is compiled into the JS bundle from `data.js`. Contact is a third-party form API. CV and images are static assets on the same origin as the site.

### “Why not Next.js?”

> A portfolio is mostly marketing content + interactions. Vite SPA keeps the build simple, deploy is static files, and I didn’t need SSR for authenticated app routes. SEO is handled with solid `index.html` meta (and can be extended with prerender/OG tags if needed).

### “How do you update projects without editing markup?”

> I don’t put project copy inside JSX lists by hand each time — I append/edit objects in `PROJECTS` inside `src/data/data.js` and add a thumbnail under `public/images/`. Components map over that array.

### “Dark mode?”

> React context (`ThemeProvider`) toggles a class on `<html>`, CSS variables swap the palette, preference is saved in `localStorage`.

### “Animations — performance?”

> GSAP drives scroll-linked work; Lenis only on fine pointers (phones use native scroll). Spline is lazy in Stack. Hero Structure Flow unmounts/budgets work when you’re not on the hero. Reduced-motion / return-visit paths skip heavy intro where appropriate.

### “Did you write tests?”

> Yes — Vitest + Testing Library. Contact validation/submit helpers, CV helpers, visit cache, several components. Mocks keep GSAP/Spline/captcha out of jsdom. `npm run check` is the CI-style gate.

### “What’s the deploy flow?”

> `npm run build` outputs `dist/`. `npm run deploy` runs `gh-pages -d dist` (after `predeploy` build). Hosting is static GitHub Pages (custom domain can point at it — e.g. sammit.com.np).

---

## 9. Master question bank — Sept 10

**Product context for the company discussion:** AI Counselor (frontend, admin panel, website).  
**Your walkthrough artifact:** this portfolio — **sammit.com.np** (this repo).

### How to use this

Questions are grouped by the company’s stated discussion areas, then by project depth, then by difficulty.

| Tag | Meaning |
|-----|---------|
| **[High]** | Very likely given the brief (“walk through one project in detail,” frontend craft, deploy, forms). |
| **[Med]** | Plausible follow-up once they like an answer. |
| **[Gap]** | Probes something you may not have shipped in *this* repo — answer honestly and bridge to how you’d add it. |

A couple of these (deploy flow, contact form backend, SEO) double as backdoor full-stack questions even though the site is mostly static — have a **real** answer ready, not “it’s just static.”

---

### 9A. Tech & build choices (portfolio)

**[High] What’s the stack — plain React, Next.js, Vite? Why that one for a portfolio specifically?**

**Answer (this project):** React 19 + **Vite 7**, not Next.js. Portfolio needs fast local DX, a static deploy, and client-side motion (GSAP/Lenis/Framer). I didn’t need App Router, SSR, or server actions for marketing content. Vite’s `import.meta.env` covers public form keys; `public/` covers CV and images.

**[High] How is it deployed and hosted? What’s your CI/deploy flow?**

**Answer:** Production build is static files in `dist/`. Deploy script: `predeploy` → `build`, then `gh-pages -d dist` to GitHub Pages. Local quality gate: `npm run check` (eslint + vitest + build). No custom server process to babysit.

**[High] Is content hardcoded, CMS, or JSON/MDX? Why?**

**Answer:** Hardcoded ES module `src/data/data.js` (re-exported via `src/data.js`). For a personal site I control, a typed-ish JS object is faster than a CMS, works offline in git, and reviews cleanly in PRs. Trade-off: non-devs can’t edit without code — acceptable for a portfolio.

**[High] Routing — SPA anchors or real routes?**

**Answer:** Single page. Sections are IDs; `useInPageNav` + Lenis-aware `scrollTo` handle `#works`, `#contact`, etc. No `react-router` routes per project. Project detail lives in the Works list + GitHub, not nested pages.

**[Med] Why React 19 / what did you notice?**

**Answer:** Stay current with the ecosystem the interviewers use; Concurrent-friendly patterns exist in the wider React world. This app mainly uses solid hooks (`useCallback` for CV/scroll unlock, layout effects for scroll restore) rather than experimental APIs.

**[Gap] Would you migrate to Next.js?**

**Answer:** Only if I needed SSR/OG image generation, MDX blog routes, or middleware. For the current scope, Vite SPA is the right complexity budget.

---

### 9B. Design & UX

**[High] Walk through design decisions — layout, color, typography.**

**Answer:** Dark-first brand (near-black `#050505`, cyan accent) with a light theme (stone `#ebe9e4`, teal accent) via CSS variables. Typography is expressive on purpose: Geist Pixel for UI body, Dosis 800 for display titles, Economica for the hero role line, Bungee for uppercase brand/kickers — loaded in `index.html`, not a default Inter stack. Layout is one long narrative composition (Hero → proof → contact), not a dashboard.

**[High] Design yourself or template/Figma?**

**Answer:** Custom implementation in code with deliberate type and motion choices; components are hand-built section by section rather than a ThemeForest template.

**[High] Animations — Framer, GSAP, CSS? Performance cost?**

**Answer:** **GSAP + ScrollTrigger** for scroll storytelling (hero intro, manifesto scrub, reveals). **Lenis** for smooth wheel scrolling on fine pointers only (native on touch). **Framer Motion** for discrete UI (nav menu, CV modal). Cost is managed by: gating animation until preloader/intro done, skipping Lenis on mobile, lazy Spline, and hero canvas budget/unmount behavior.

**[High] Mobile — breakpoints / layout shifts?**

**Answer:** Tailwind responsive classes; manifesto sticky pin on `sm+` but natural flow on phones; Works hover previews on `lg+`; Lenis off on coarse pointers; overflow-x controlled to avoid horizontal bounce. Dock vs top nav swaps with scroll so thumbs can still navigate.

**[High] Dark mode — how implemented and persisted?**

**Answer:** `ThemeProvider` stores `portfolio-theme` in `localStorage`, toggles `html.light` / `data-theme`, updates `theme-color` meta. All accents/surfaces read CSS variables so one toggle rethemes nav, dock, CV pill, etc.

**[Med] Scroll lock on first visit — why?**

**Answer:** Prevents users from scrolling mid-intro. Until preloader + hero intro finish, overflow is hidden and Lenis stays locked; return visits unlock immediately.

---

### 9C. Performance & SEO

**[High] Lighthouse / what did you optimize?**

**Answer (honest + concrete):** Focus areas in *this* codebase: static asset pipeline, lazy Spline, hero canvas not always running, fonts via `preconnect`, production Vite code-splitting of the bundle graph, and avoiding Lenis on mobile. Quote a fresh Lighthouse run if asked live — don’t invent a number; re-measure before the meeting if needed.

**[High] SEO — meta, Open Graph, sitemap?**

**Answer:** `index.html` has title, description, viewport, theme-color, lang=en. **[Gap]** Full Open Graph / Twitter cards / sitemap.xml are thinner than a Next.js marketing site — worth calling out as a next improvement (prerender or static meta tags + `og:image`).

**[Med] Code-splitting / lazy routes?**

**Answer:** One route (SPA). Heavy bits are deferred in practice (Spline in Stack). Further gains: `React.lazy` for below-fold sections if bundle weight becomes an issue.

**[Gap] Analytics?**

**Answer:** Not a first-class integration in this repo today. If asked: I’d add a privacy-light option (Plausible/Umami) or GA4 with consent — know *that* you don’t currently measure funnels, and that contact submissions are the main conversion signal via email.

---

### 9D. Code quality & structure

**[High] Component tree — one big page or reusable pieces?**

**Answer:** `App.jsx` composes section components; shared chrome (Navbar, Dock, ThemeToggle, CV modal, SocialLinks). Logic extracted to hooks (`useLenis`, `useScrollNav`, …) and `lib/` (contact, CV, visit cache). Data is centralized so UI stays thin.

**[High] Tests — or overkill for a portfolio?**

**Answer:** I wrote them anyway — regression insurance for contact cooldown/validation, CV helpers, theme, visit cache, and key UI. Interviewers who care about engineering discipline notice this. For a throwaway template, tests would be overkill; for a site you keep shipping, they’re cheap.

**[High] Keep projects up to date without editing markup?**

**Answer:** Edit `PROJECTS` / `CODE_DATA` / `LEADERSHIP` in `data.js`; drop assets in `public/`. Components map data → UI.

**[Med] How do you prevent contact spam?**

**Answer:** hCaptcha + empty honeypot field (`botcheck`) + 24h client cooldown in `localStorage`. Note the honesty point: client cooldown is UX friction, not security; captcha + Web3Forms is the real gate.

---

### 9E. Content & functionality

**[High] Working contact form — how does submission work?**

**Answer:** Client validates → user solves hCaptcha → `FormData` POST to `https://api.web3forms.com/submit` with access key and `h-captcha-response`. Web3Forms emails me. No custom serverless function in-repo; this is the intentional “backend.”

**[High] How did you choose projects / write for non-tech vs recruiter?**

**Answer:** Featured AI / full-stack work first (e.g. Skim, Prometheus, NepAI, Note-Merge). Summaries in `data.js` stay outcome-oriented (what it does for a user), while stack chips and GitHub satisfy technical recruiters. Leadership section shows signal beyond repos.

**[Med] CV — Drive or local?**

**Answer:** Local static PDF under `public/CV/`, previewed in an iframe modal, downloadable with the `download` attribute. Helpers in `cv.js` also understand Drive URLs if you ever point `CV.url` there again.

**[Gap] Analytics — do you know how people use the site?**

**Answer:** See 9C. Conversion proxy today = emails from Web3Forms. Product analytics would be a deliberate add-on.

---

### 9F. Reflection / trade-offs

**[High] What would you rebuild differently today?**

**Possible strong answers (pick what you believe):**
- Stronger OG/SEO story (even static `og:image`).
- Optional MDX case-study routes if deep project writeups matter.
- Stricter env hygiene (no fallback keys in source).
- Measure LCP with real RUM once analytics exist.

**[High] One feature you wanted but didn’t have time for?**

**Examples that fit this repo:** project case-study pages, blog, CMS for non-dev edits, command palette, i18n, or a tiny serverless contact proxy so the access key never ships to the client.

**[Med] Biggest trade-off you accepted?**

**Answer:** Third-party form API vs owning a backend — faster ship, less ops, less control over spam/storage/rate limits. Motion-heavy storytelling vs maximal Lighthouse purity — I optimized the expensive bits rather than removing personality.

---

### 9G. Company product context — AI Counselor (discussion surface)

Use this block to pressure-test **product thinking** for the company’s AI Counselor (frontend, admin panel, website). These are not claims about files in *this* Portfolio repo — they’re questions you should be ready to discuss in product/architecture terms.

**[High] Who are the three surfaces for?**

- **Marketing website** — trust, explain the counselor, convert to signup/demo.  
- **End-user frontend** — the counseling experience (chat/session UX, safety, progress).  
- **Admin panel** — content, users, moderation, prompts, analytics, feature flags.

**[High] How would you separate concerns across those three apps?**

Shared design system + auth boundaries; admin never ships in the public marketing bundle; user app talks to APIs with scoped tokens; website stays mostly static/SSR for SEO.

**[High] What frontend risks matter more in an AI counselor than in a portfolio?**

Streaming responses, abort/retry, empty/error states, accessibility, crisis/safety UX, rate limits, PII, audit trails, and not exposing system prompts or admin tools.

**[Med] Admin panel must-haves you’d expect**

Role-based access, conversation review tools, prompt/version management, kill switches, export/audit logs, basic metrics (sessions, retention, escalations).

**[Med] Website vs app — what belongs where?**

Website: positioning, pricing, trust/safety copy, SEO. App: authenticated sessions. Don’t overload the marketing site with logged-in chrome.

**[Gap] If they ask you to map AI Counselor to *your* portfolio architecture**

Bridge honestly: “My portfolio proves UI systems, motion, form integrations, and deploy discipline. For Counselor I’d add real auth, API clients, streaming, and an admin app — patterns I’ve practiced in fuller stack projects, while this site stays a polished client artifact.”

---

### 9H. Full-stack “backdoor” prompts (have a crisp answer)

| Prompt | Portfolio-grounded answer |
|--------|---------------------------|
| “Where’s the API?” | Web3Forms `POST /submit`; static files for CV/images. |
| “Where’s the database?” | None for content. Browser storage for theme/cooldown/visit only. |
| “How would you add a real backend?” | Small serverless function (verify captcha, send email, hide keys) or Express/FastAPI + DB for a guestbook/case studies; keep Vite or move to Next for SSR. |
| “CI?” | `npm run check` locally; extend with GitHub Actions on PR (lint/test/build) before `gh-pages` or Pages deploy action. |
| “Secrets?” | `VITE_*` are public in the client bundle — never put private SMTP passwords there; Web3Forms owns the mail secret server-side. |

---

### 9I. Rapid-fire checklist before Sept 10

- [ ] Re-run `npm run check` and note test count.  
- [ ] Re-measure Lighthouse (Home) on production; write the real scores here: Perf ___ / A11y ___ / Best ___ / SEO ___.  
- [ ] Open contact form on production; confirm captcha + email still arrive.  
- [ ] Open CV modal + download on mobile.  
- [ ] Practice a 90-second architecture walkthrough using diagram 2.1.  
- [ ] Practice contact-form sequence using diagram 2.4.  
- [ ] Prepare one AI Counselor answer: website vs app vs admin responsibilities.  
- [ ] Prepare one “what I’d add next” that shows product taste, not just tech novelty.

---

## Quick reference — say this in under 30 seconds

> “sammit.com.np is a React + Vite portfolio. Content lives in one data module. The shell handles theme, smooth scroll, and a first-visit preloader. Sections are components. Contact posts to Web3Forms with hCaptcha. CV is a static PDF. I deploy a static `dist/` with gh-pages. Tests cover the risky helpers. It’s a frontend system with a thin, intentional backend boundary — not a fake full-stack claim.”

---

*Generated for interview prep from the Portfolio repository as it exists in this workspace. Update this file when architecture or integrations change.*

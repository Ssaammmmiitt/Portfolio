# Sammit Poudyal — Portfolio

Personal portfolio for Sammit Poudyal (full-stack / applied AI). Built with React 19, Vite, GSAP, Lenis, and Tailwind CSS v4.

Live content (projects, copy, CV, contact topics) lives in [`src/data/data.js`](src/data/data.js). Architecture notes are in [`STRUCTURE.md`](STRUCTURE.md).

## Quick start

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run check` | Lint, test, and build |
| `npm run deploy` | Build and publish to GitHub Pages |

## Configuration

- **Content** — edit copy, projects, leadership, nav links, and form options in `src/data/data.js`.
- **CV** — set `CV.url` (Drive download) and `CV.previewUrl` (Drive iframe preview). Leave `url` empty to hide download/view controls.
- **Contact form** — create a `.env` file with `VITE_WEB3FORMS_ACCESS_KEY` and `VITE_HCAPTCHA_SITE_KEY`.
- **Theme** — light/dark via `ThemeProvider`. Dark accent is cyan; light accent is teal on a cool slate background.

## Page order

Hero → Manifesto → Marquee → Works → Stack → Strategy → Stats → Leadership → About → Contact → Footer

## Deploy

Static output goes to `dist/`. Publish with `npm run deploy` (GitHub Pages).

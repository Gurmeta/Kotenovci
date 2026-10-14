# Kotenovtsi — a website for my village

[![CI](https://github.com/Gurmeta/Kotenovci/actions/workflows/ci.yml/badge.svg)](https://github.com/Gurmeta/Kotenovci/actions/workflows/ci.yml)
[![Deploy](https://github.com/Gurmeta/Kotenovci/actions/workflows/deploy.yml/badge.svg)](https://github.com/Gurmeta/Kotenovci/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Live site: <https://gurmeta.github.io/Kotenovci/>**

Hi! I'm Georgi Stefanov, and this is a website about **Kotenovtsi** (Котеновци),
a small village in Berkovitsa municipality, Montana Province, Bulgaria. It sits
at the foot of the Balkan Mountains (Stara Planina), next to the Zlatitsa
river, and I think it deserves a proper place on the internet. I built this
site to gather the village's history, landmarks and spirit in one place and
present them in a modern, pleasant way.

## Features

- **Scroll-driven zoom intro.** As you scroll, the site "flies" from a map of
  all of Bulgaria down to Kotenovtsi. The effect is a pre-rendered video whose
  playback position follows the scroll, so it stays smooth even on phones
  (see [Design decisions](#design-decisions)).
- **About the village.** History, the origin of the name (from the Old
  Bulgarian *kutam*, "to hide"), local areas and traditions.
- **Landmarks.** The Thracian sanctuary and fortress, the Church of the
  Ascension of Christ (1863), the Zlatitsa river and more.
- **Gallery.** Photos of the village and its surroundings. Real photos are
  data-driven; placeholders are shown until they are added.
- **Contacts.** An interactive map (Leaflet + OpenStreetMap) showing the
  village and the sanctuary, plus useful links.
- **Four languages.** Bulgarian, English, Hebrew and Italian, with a flag
  switcher in the header and footer. Hebrew flips the whole layout to
  right-to-left. The language is detected from the browser on the first visit
  and remembered afterwards.
- **Accessibility.** Keyboard-reachable navigation that stays visible while it
  has focus, Esc closes the mobile menu, and `prefers-reduced-motion` is
  respected (animations are disabled and the background video is paused).
- **SEO basics.** Per-language `<title>` and description, Open Graph tags,
  canonical URL, `robots.txt` and `sitemap.xml`.
- **Quick facts.** 98 residents, 473 m elevation, 26 km from Berkovitsa and
  107 km from Sofia.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework & build | [React](https://react.dev/) 19, [Vite](https://vite.dev/) 8 |
| Routing | [React Router](https://reactrouter.com/) 7 |
| Animation | [Framer Motion](https://motion.dev/) |
| Maps | [Leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/), OpenStreetMap tiles |
| Internationalisation | [i18next](https://www.i18next.com/) / react-i18next, [flag-icons](https://flagicons.lipis.dev/) |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter) |
| Video generation (optional) | [MapLibre GL](https://maplibre.org/), [Playwright](https://playwright.dev/), [ffmpeg](https://ffmpeg.org/) |
| Hosting & CI/CD | GitHub Pages, GitHub Actions, Dependabot |

## Getting started

You need [Node.js](https://nodejs.org/) 22 or newer.

```bash
git clone https://github.com/Gurmeta/Kotenovci.git
cd Kotenovci
npm ci
npm run dev
```

Open the address Vite prints (usually <http://localhost:5173>).

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

## Project structure

```text
.
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # lint + build on pull requests and branches
│   │   └── deploy.yml          # build + publish to GitHub Pages on push to main
│   └── dependabot.yml          # weekly dependency updates
├── public/
│   ├── video/                  # pre-rendered videos and poster
│   ├── 404.html                # SPA deep-link redirect for GitHub Pages
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── render-zoom.mjs         # regenerates the zoom video frames
└── src/
    ├── components/             # Navbar, Footer, LanguageSwitcher, Reveal,
    │                           # ScrollZoomVideo, BackgroundVideo, MapResizeFix
    ├── pages/                  # Home, AboutVillage, Attractions, Gallery, Contacts
    ├── data/
    │   ├── village.js          # coordinates and facts, in one place
    │   └── gallery.js          # gallery photo files (null = placeholder)
    └── i18n/
        ├── index.js            # language detection and setup
        └── locales/            # bg.json, en.json, he.json, it.json
```

## Content and translations

All visible text lives in `src/i18n/locales/*.json`. When you change or add a
key, update **all four** files so the languages stay in sync.

**Adding a language:** create `locales/<code>.json`, register it in
`src/i18n/index.js` (code, label, flag, text direction) and import its flag
from `flag-icons`.

**Adding a gallery photo:**

1. Put an optimised file (WebP, about 1600 px wide) in `public/gallery/`.
2. In `src/data/gallery.js`, replace `file: null` with the file name for the
   matching entry (the order follows `gallery.photos` in the locale files).
3. The alt text comes from the translated caption. The "placeholder photos"
   notice disappears once no `null` entries are left.

## Deployment

The site is published to **GitHub Pages** by GitHub Actions
(`.github/workflows/deploy.yml`) on every push to `main`.

One-time setup after the first push:

1. In the repository go to **Settings → Pages → Source** and choose
   **GitHub Actions**.
2. Wait for the workflow in the **Actions** tab to finish. The site URL is
   shown in the `deploy` step and in Settings → Pages.

Vite's `base` path (`/<repository-name>/`) is injected by the workflow from the
repository name through the `BASE_PATH` environment variable, so renaming the
repository does not break the site. Locally it defaults to `/`.

Because GitHub Pages has no server-side routing, `public/404.html` redirects
deep links (for example `/kontakti`) to `index.html`, where the router takes
over.

Pull requests and non-`main` branches run `.github/workflows/ci.yml`, which
executes `npm ci`, `npm run lint` and `npm run build`.

### Hosting somewhere else

Any static host works. Build with `npm run build`, publish the `dist/` folder
and, if the site is served from a sub-path, set `BASE_PATH` (for example
`BASE_PATH=/my-path/ npm run build`). Remember to update the canonical URL,
Open Graph URLs and `sitemap.xml`/`robots.txt` if the address changes.

## Design decisions

- **The zoom effect is a video, not a live map.** A live map re-fetches tiles
  and flickers while scrolling, especially on mobile. A pre-rendered video that
  is scrubbed by the scroll position is smooth everywhere.
- **One zoom video for every device.** It is encoded with H.264 (CRF 23, short
  GOP of 5 frames, `faststart`), about 7 MB. A short GOP keeps seeking fast
  while cutting the size by roughly two thirds compared to an all-intra
  encode. The browser loads only the metadata up front and shows the poster
  until the video is ready.
- **Content in data files.** Village facts and coordinates live in
  `src/data/village.js`, and all text lives in the locale files, so nothing is
  hard-coded in components.

### Regenerating the zoom video

Only needed if you want to change the route or zoom level. It needs
`npx playwright install chromium` and ffmpeg:

```bash
node scripts/render-zoom.mjs
ffmpeg -framerate 30 -i scripts/frames/frame_%04d.png \
  -vf scale=1280:720 -c:v libx264 -preset slow -crf 23 -g 5 \
  -pix_fmt yuv420p -movflags +faststart -an public/video/kotenovci-zoom.mp4
```

## Ideas for the future

- Real photos from the village in the gallery
- More historical material and stories from local people
- A page about village events and holidays

If you have ideas, photos or memories of Kotenovtsi, I'd love to include them.
Feel free to open an issue. The village is small, but its history is big.

## Credits

- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Flags from [flag-icons](https://github.com/lipis/flag-icons)
- Village facts from the Bulgarian National Statistical Institute (NSI) and
  Wikipedia

## License

Released under the [MIT License](LICENSE) — © 2026 Georgi Stefanov.

— Georgi

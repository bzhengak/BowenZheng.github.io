# Bowen Zheng · AI Advisory · Personal Portfolio

> A modern, glassmorphic personal portfolio built with **React 18 + TypeScript + Vite**, featuring 3D particle star-cloud (R3F), GSAP-driven scroll animations, 3D tilt cards, Lenis smooth scroll, and full dark/light theme + i18n support.

## ✨ Features (v1)

- **3D Particle Star Cloud** in the sidebar (React Three Fiber)
- **GSAP ScrollTrigger cascade reveal** for skill tags
- **3D Tilt Glass Cards** with mouse-tracked specular highlight
- **Lenis smooth scroll** + reading progress bar
- **Custom cursor + ambient glow** (desktop)
- **i18n** — English / 中文 双向切换
- **Theme switch** — Dark / Light 双向切换 (localStorage 持久化)
- **Mobile responsive** — sidebar collapse, header bar
- **Collapsible details** for projects / experience / early projects
- **Tech glassmorphism** preserves the original visual identity

## 🛠️ Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | GSAP 3 + Framer Motion |
| Smooth Scroll | Lenis 1 |
| 3D | React Three Fiber + drei + three.js |
| Icons | Remix Icon |
| Font | Plus Jakarta Sans (Google Fonts) |

## 🚀 Getting Started

```bash
# Install
npm install

# Dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
# → outputs to /dist

# Preview production build locally
npm run preview

# Deploy to GitHub Pages (one-shot)
npm run deploy
```

## 🌐 GitHub Pages Deployment

This project is configured for **user/organization root** deployment (`username.github.io`).

1. `vite.config.ts` already has `base: '/'` — no changes needed.
2. Update `package.json` `homepage` field (optional) for `gh-pages` to read:
   ```json
   "homepage": "https://<your-username>.github.io/"
   ```
3. Either:
   - Push to `main` and let GitHub Pages serve from the branch (recommended — set Pages source to GitHub Actions with a build workflow), or
   - Run `npm run deploy` to push `dist/` to the `gh-pages` branch.

A minimal GitHub Actions workflow is provided at `.github/workflows/deploy.yml`.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/      # Sidebar, MobileHeader, Cursor, ProgressBar
│   ├── three/       # SidebarParticles (R3F)
│   ├── ui/          # GlassCard, Collapsible, SkillTag, ThemeToggle
│   └── sections/    # Hero, Summary, Skills, Education, Experience, Projects, EarlyProjects, Extras
├── hooks/           # useTilt, useReveal, useScrollSpy, useCursor, useTheme, useLenis
├── i18n/            # en.json, zh.json, I18nProvider
├── data/            # content.ts (single source of truth)
├── styles/          # global.css (CSS variables + base styles)
├── App.tsx
└── main.tsx
```

## 🎨 Theming

Themes are driven entirely by CSS variables on `:root` (light) and `.dark` (dark).
Toggle via the icon button in the sidebar; choice persists in `localStorage`.

## 🌐 i18n

Translation JSON files live in `src/i18n/`. Add a new language:

1. Create `fr.json` with the same keys as `en.json`.
2. Add the language to `I18nProvider`'s `LANGS` map.
3. (Optional) Add a button in the sidebar to switch to it.

## 📜 License

MIT

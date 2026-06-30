# Domteknika — Website

Official website for **Domteknika**, a Swiss precision product-engineering company.
Smooth, aesthetic and professional, built with a modern React stack.

> 🎨 The complete art direction lives in **[DESIGN.md](./DESIGN.md)** — colors,
> typography, spacing, effects and component conventions. Refer to it before any
> visual change.

## ✨ Highlights

- **Next.js 16** (App Router) + **TypeScript** — SSR/SSG, SEO, performance.
- **Tailwind CSS v4** + **shadcn/ui** (base-nova) — design system tokens.
- **Asta Sans** font (formerly 42dot Sans) self-hosted via `next/font` — 0 layout shift.
- **next-intl** — bilingual **FR / EN** with `[locale]` routing.
- **Lenis** — smooth, momentum-based scrolling.
- **Framer Motion** — reveal-on-scroll, hover and stagger animations.
- **Embla** carousel — for the projects showcase.
- Full **accessibility** support, including `prefers-reduced-motion`.

## 🚀 Getting started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
# → http://localhost:3000  (redirects to /fr by default)

# Build for production
npm run build

# Start the production server
npm start

# Lint
npm run lint
```

## 📁 Project structure

```
├── DESIGN.md              # Art direction — source of truth
├── README.md
├── messages/              # i18n strings (fr.json, en.json)
├── public/assets/         # Images, icons, logos (normalized names)
├── next.config.ts
└── src/
    ├── app/
    │   ├── [locale]/       # Localized routes (root layout + home)
    │   │   ├── layout.tsx  # <html>/<body>, font, providers, Navbar, Footer
    │   │   └── page.tsx    # Home page (assembles all sections)
    │   └── globals.css     # Design tokens + base styles
    ├── components/
    │   ├── layout/         # Navbar, Footer, Container, Logo, LanguageSwitcher
    │   ├── sections/       # Hero, TrustedBy, Projects, Values, Process, CTA
    │   ├── providers/      # SmoothScrollProvider (Lenis), Reveal
    │   └── ui/             # shadcn primitives (button, carousel, separator)
    ├── i18n/               # routing, request, navigation (next-intl)
    ├── lib/utils.ts        # cn() helper
    └── proxy.ts            # Locale negotiation (formerly middleware)
```

## 🧩 Sections of the home page

1. **Hero** — technical drawing backdrop, headline, dual CTAs.
2. **Trusted By** — infinite horizontal marquee of client logos.
3. **Projects** — Embla carousel of product showcases.
4. **Values** — four feature cards (Agile, End-to-end, Swiss quality, Confidential).
5. **Process** — centered process schema.
6. **CTA (Chasseral)** — Swiss Alps photo with gaussian-blur + gradient overlay.

## 🌐 Internationalization

Two locales are supported:

| Locale | Default | URL |
|--------|---------|-----|
| 🇫🇷 French | ✅ | `/fr` |
| 🇬🇧 English | | `/en` |

All copy lives in `messages/{locale}.json`. Switch languages via the navbar toggle.

## 📝 Notes

- CTA buttons currently point to upcoming routes (`/contact`, `/projects`, …) which
  are **not yet created**. The reusable `Navbar`, `Footer`, and `TrustedBy` components
  are designed to be shared across those future pages.
- The Figma mockup is full-bleed; a `<Container>` component adds lateral margins to
  keep content centered and readable on wide screens (documented in DESIGN.md).

## 📄 License

Proprietary — © Domteknika. All rights reserved.

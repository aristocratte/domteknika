# Domteknika — Design System

> Ce document est la **source de vérité** de la direction artistique (DA) du site Domteknika.
> Toute décision visuelle, couleur, espacement, effet ou composant doit s'y référer.
> Objectif : un rendu **smooth, aesthetic et ultra professionnel**.

---

## 1. Essence & ton

Domteknika est un partenaire d'**ingénierie produit suisse**. La DA traduit :

- **La précision helvétique** — grilles rigoureuses, alignements nets, typographie soignée.
- **L'innovation technique** — présence de dessins techniques, schémas, géométrie.
- **Le sérieux premium** — peu de couleurs, beaucoup d'espace blanc, animations retenues.
- **L'ancrage local** — la montagne (Chasseral), le drapeau suisse, le bleu alpin.

**Ton éditorial** : confident, clair, jamais criard. On parle d'expertise, pas de slogans.

---

## 2. Couleurs

### Palette principale

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| **Primaire** | Brand red | `#E30613` | CTAs, accents, point d'eyebrow, focus, hover |
| **Texte principal** | Ink | `~#0E1116` | Titres, corps de texte |
| **Fond** | White | `#FFFFFF` | Fond de page |
| **Gris label** | Muted | `~#6B7280` | Sous-textes, libellés |

> Le rouge `#E30613` est **l'unique couleur d'accent**. Il ne s'utilise jamais en
> grand aplat de fond (sauf CTA boutons) — toujours en touche (point, trait, icône, mot).

### Palette montagne (sections immersive / CTA)

| Nom | Hex | Rôle |
|---|---|---|
| **Alps blue** | `#004691` | Dégradé CTA (gauche, 49% opacité) |
| **Navy deep** | `#00273D` | Dégradé CTA (droite, 0% opacité — invisible) |

Ces deux teintes ne servent **que** pour l'overlay de la section Chasseral.
Elles ne doivent pas apparaître ailleurs dans l'interface.

### Sémantique (tokens shadcn)

Toutes les couleurs sont exposées en tokens OKLCH dans `src/app/globals.css`
(`:root` et `.dark`) et mappées via `@theme inline`. **Toujours** utiliser les
classes sémantiques (`bg-background`, `text-foreground`, `text-muted-foreground`,
`text-brand`, `bg-brand`) — **jamais** de hex bruts dans les composants.

---

## 3. Typographie

### Police

- **Famille** : **Asta Sans** (anciennement *42dot Sans*, renommée sur Google Fonts).
- **Intégration** : `next/font/google`, self-hosted → aucune requête externe,
  zero layout shift, privacy préservée.
- **Axes** : police variable (poids 300 → 800). Utiliser les utilitaires
  `font-light` à `font-extrabold` de Tailwind.

### Échelle typographique (référence)

| Élément | Taille | Poids |
|---|---|---|
| H1 (hero) | `text-4xl` → `text-[4.25rem]` | `font-bold` (700) |
| H2 (section) | `text-3xl` → `text-[2.75rem]` | `font-bold` |
| H3 (carte) | `text-lg` | `font-bold` |
| Corps | `text-base` / `text-lg` | `font-normal` / `medium` |
| Eyebrow | `text-xs` | `font-semibold`, `uppercase`, `tracking-[0.18em]` |
| Label muted | `text-xs` / `text-sm` | `font-medium` |

**Interlignage** : titres serrés (`leading-[1.05]` à `leading-[1.1]`), corps
aisés (`leading-relaxed`). `text-balance` sur les titres pour des rendus propres.

---

## 4. Espacement & congés

- **Base de conge** : `7` (Figma) → token `--radius: 0.4375rem` (7px).
- **Navbar** : pill `--radius-pill: 50px` (unique cas de rayon 50).
- **Cartes** : `rounded-2xl` (16px) pour un rendu moderne et doux.
- **Sections** : padding vertical `py-20` à `py-28` (resp.).
- **Container latéral** : `max-w-[1200px]` (default) / `1400px` (wide) / `960px` (narrow),
  avec `px-6 sm:px-8 lg:px-10`.

> La maquette Figma est **full-bleed** (pas de marge latérale). Le composant
> `<Container>` ajoute ces marges et **recentre** le contenu au milieu plutôt
> que d'étirer les éléments sur toute la largeur. C'est un écart assumé vs le
> Figma pour un rendu web lisible sur grands écrans.

---

## 5. Effets & surfaces

### Navbar (glass)

- `position: fixed`, `top-4`, `z-50` — reste identique au scroll.
- **Glass** : `backdrop-filter: blur(16px) saturate(180%)` + `bg-white/72%`.
- **Dropshadow très léger** : `0 8px 30px rgba(0,0,0,0.06)` (renforcé à
  `0 10px 40px rgba(0,0,0,0.10)` après scroll).
- **Forme pill** : `rounded-[50px]`.
- Un élément qui défile derrière subit la **réfraction** du verre (effet glass).

### Section Chasseral / CTA (l'effet signature)

Deux calques superposés sur l'image `alps-background.png` :

1. **Flou gaussien** — rectangle couvrant **de 0 à 2/3** de la largeur (gauche),
   `backdrop-filter: blur(14px)`. Le bord droit du flou est adouci par un
   `mask-image` (linear-gradient) pour une transition nette → floue.
2. **Dégradé d'opacité** — `linear-gradient(to right, rgba(0,70,145,0.49) 0%, rgba(0,39,61,0) 100%)`.
   Soit `#004691` à **49%** à gauche → `#00273D` à **0%** (invisible) à droite.

Le texte CTA se positionne à **gauche**, dans la zone où les deux effets se
combinent (flou + teinte) pour garantir la lisibilité. La partie droite de la
photo reste **nette et pleine**.

### Cartes (values, projects)

- Hover : `translate-y` léger (`-1` à `-1.5`), ombre qui s'intensifie,
  accent rouge (trait ou bordure).
- Transitions douces `duration-500`, `ease-smooth`.

---

## 6. Mouvement & smooth scrolling

- **Smooth scroll global** : **Lenis** (`duration: 1.1`, easing exponentiel).
- **Easing signature** : `cubic-bezier(0.22, 1, 0.36, 1)` (token `--ease-smooth`).
- **Reveal on scroll** : Framer Motion, fade + slide-up `y: 24 → 0`,
  `duration: 0.6`, déclenché à l'entrée du viewport (`once: true`).
- **Stagger** : les groupes d'éléments (CTAs hero, cartes values) apparaissent
  en cascade (`staggerChildren: 0.1`).
- **Marquee Trusted By** : `translateX(0 → -50%)`, `linear infinite`, `42s`,
  pause on hover.
- **Hover micro-interactions** : boutons qui se soulèvent, traits qui s'étendent,
  images qui zooment légèrement.

### Accessibilité — `prefers-reduced-motion`

**Toujours respecté.** Quand l'utilisateur active "réduire les animations" :
- Lenis est **désactivé** (scroll natif).
- Toutes les animations sont réduites à `0.001ms` (cf. media query dans `globals.css`).
- La marquee s'arrête.

---

## 7. Composants & layout

### Réutilisables (sur toutes les pages futures)

| Composant | Chemin | Rôle |
|---|---|---|
| `Navbar` | `components/layout/navbar.tsx` | Glass pill fixed, nav + langue + CTA |
| `Footer` | `components/layout/footer.tsx` | Colonnes liens + contact + Swiss-made |
| `Container` | `components/layout/container.tsx` | Marges latérales + centrage |
| `Logo` | `components/layout/logo.tsx` | Marque + wordmark |
| `LanguageSwitcher` | `components/layout/language-switcher.tsx` | FR / EN |
| `TrustedBy` | `components/sections/trusted-by.tsx` | Marquee logos (réutilisable) |
| `SectionHeading` | `components/sections/section-heading.tsx` | Eyebrow + titre + sous-titre |
| `Reveal` | `components/providers/reveal.tsx` | Animation d'apparition |

### Sections de la page d'accueil

1. **Hero** — dessin technique en fond (6% opacité) + titre + 2 CTAs + scroll cue.
2. **Trusted By** — marquee infini des logos clients.
3. **Projects** — carrousel Embla (shadcn) des `product-1…4` + flèches + dots.
4. **Values** — 4 cartes (Agile, End-to-end, Swiss quality, Confidential).
5. **Process** — schéma `schema-process` centré.
6. **CTA Chasseral** — image montagne + blur + dégradé + CTA rouge.

---

## 8. Assets

Tous les assets sont dans `public/assets/`, noms **normalisés** (kebab-case,
sans espaces ni accents) :

- `product-1…4.png` — visuels projets.
- `logo-*.png` — logos clients (logitech, nespresso, nestle, total, softcar, gin, stagvelo, aventor).
- `agile.png`, `end-to-end.png`, `swiss-quality.png`, `confidential.png` — icônes valeurs.
- `arrow-left.png`, `arrow-right.png` — flèches carrousel.
- `technical-drawing-top.png`, `technical-drawing-bottom.png` — dessins techniques.
- `schema-process.png` — schéma du process.
- `alps-background.png` — photo Chasseral.
- `swiss-flag.png` — drapeau suisse (footer).

Optimisation : tous passent par `next/image` (AVIF/WebP, lazy, responsive `sizes`).

---

## 9. Internationalisation

- **Locales** : `fr` (défaut) + `en`, via `next-intl` et le segment `[locale]`.
- Tous les textes sont externalisés dans `messages/fr.json` et `messages/en.json`.
- Le sélecteur de langue FR/EN est dans la navbar.

---

## 10. Principes techniques

- **Performance** : SSG, polices self-hosted, images optimisées, composants
  client ciblés (`"use client"` uniquement quand nécessaire).
- **Sécurité** : `rel="noopener noreferrer"` sur les liens externes, aucune
  donnée sensible côté client, TypeScript strict.
- **Accessibilité** : contrastes AA, `aria-label`, focus visible, sémantique
  HTML (`<section>`, `<nav>`, `<footer>`, `aria-labelledby`), reduced motion.
- **Cohérence** : une seule source de vérité pour les tokens (`globals.css`),
  composants shadcn en base, `cn()` pour les classes conditionnelles.

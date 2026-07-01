# DOMTEKNIKA Design System

Ce document est la source de vérité de la direction artistique du site DOMTEKNIKA.
La référence active est la frame Figma `Main` du mockup DOMTEKNIKA Website Mockup, complétée par les screenshots dans `screen-page/Main Page`.

## Intention

DOMTEKNIKA doit paraître précis, suisse, industriel et premium. Le site ne cherche pas un effet startup ou décoratif. Il doit donner une impression de maîtrise technique, de confidentialité et de fabrication concrète.

Principes:

- Fond blanc, beaucoup d'air, alignements nets.
- Rouge DOMTEKNIKA utilisé comme ponctuation: traits, points, boutons, icônes.
- Dessins techniques rouges très pâles pour exprimer la conception.
- Imagerie réelle du Chasseral pour l'ancrage suisse.
- Aucune carte ou section inventée si elle n'existe pas dans le Figma.

## Couleurs

| Rôle | Valeur | Usage |
| --- | --- | --- |
| Rouge marque | `#E30613` | CTA, accents, points, traits, icônes |
| Texte principal | `#111111` | Titres et texte fort |
| Texte secondaire | `#565656` | Sous-textes et adresses |
| Fond | `#FFFFFF` | Page entière |
| Gris surface | `#F7F7F7` | Bande logos, fonds cartes projets |
| Bordures | `#E5E5E5` | Cartes, stats, séparateurs |
| Bleu Chasseral | `#004691` | Overlay gauche bannière Suisse à 49% |
| Bleu profond | `#00273D` | Fin de gradient à 0% |

Les composants doivent utiliser les tokens CSS de `src/app/globals.css` (`bg-brand`, `text-brand`, `text-foreground`, `text-muted-foreground`) plutôt que des hex directs dans le JSX.

## Typographie

Police: 42dot Sans, exposée via `Asta_Sans` dans `next/font/google`.

Règles:

- Héros: très grand, ombre courte noire, ponctuation rouge.
- La ligne finale du héros est plus lourde que les lignes `Engineering / Prototyping / Producing`.
- Corps: tailles généreuses, interlignage compact mais lisible.
- Labels et navigation: gras, simples, sans tracking décoratif excessif.

Ombre typographique de référence: `.domtek-text-shadow`.

## Rayons

- Rayon de base Figma: `7px`.
- Cartes, boutons et stats: `rounded-[7px]`.
- Navbar: `50px` sur les coins bas, via `rounded-b-[50px]` en desktop.
- Aucun grand radius décoratif hors navbar.

## Structure de page

Ordre de la homepage:

1. Navbar fixed glass.
2. Hero avec dessin technique haut, flèches rouges, titre et deux CTA.
3. Projets avec carousel shadcn/Embla, cartes compactes autour de 274 x 286, image sur fond gris.
4. Expertise triptyque: `The idea`, panneau rouge `The process`, `The product` avec stats.
5. `Trusted by`, ruban de logos en scroll horizontal infini.
6. Bannière Suisse/Chasseral.
7. CTA final sur dessin technique bas.
8. Footer minimal: logo, adresse, copyright.

## Rythme Et Marges

- Les contenus principaux sont centrés dans un conteneur `wide` de 1160px maximum avec des gutters latéraux généreux.
- La page doit se lire plus petite et plus premium sans être compactée: réduire les grandes typographies, cartes et assets, puis préserver ou augmenter l'espacement vertical entre sections.
- Ne pas utiliser de `transform: scale()` global pour réduire l'interface; ajuster les tokens de layout, les tailles de composants et les paddings section par section.
- Les sections peuvent rendre la page plus longue verticalement si cela améliore la respiration et la hiérarchie.

## Navbar

La navbar est fixed en haut, hauteur 92px desktop, glass liquide transparent, rayon 50 en bas et sans ombre portée. L'effet doit rester visible: blur élevé, saturation forte, reflets internes blancs et vraie réfraction des éléments qui passent dessous.

Règles:

- Le logo est l'image réelle `public/assets/domteknika-logo.png`.
- Les items sont centrés: Home, Projects, Expertise, Patent, Our Story.
- `Patent` et `Our Story` restent désactivés tant que les pages ne sont pas créées.
- Le CTA pointe vers l'ancre `#contact`.
- Le rendu ne change pas au scroll.
- Le liquid glass de la navbar est rendu avec `liquid-glass-react`, chargé en client-only dans `Navbar` pour éviter les accès navigateur pendant le rendu serveur.
- Sur la navbar desktop, le `cornerRadius` interne de `liquid-glass-react` reste à `0`; le rayon vient uniquement du conteneur `rounded-b-[50px]`, pour éviter tout congé sur les coins supérieurs.
- Le glass de la navbar reste neutre, clair et translucide: aucun halo rouge ou bleu sur les bords (`aberrationIntensity={0}`), pas de voile gris opaque, seulement une réfraction SVG visible, des reflets blancs fins et une rim claire, sans ombre portée.
- L'indicateur rouge des liens de navigation est un élément animé réel. Il reste sous `Home` au repos et circule vers le lien survolé ou focusé.

## Hero

- `technical-drawing-top.png` doit rester plus petit que le hero et aligné vers la droite; ne pas utiliser `object-cover` plein écran sur desktop.
- Les flèches rouges restent visibles et légèrement plus grandes que la première passe, autour de 126px sur desktop.
- Le dessin technique sert de contexte discret: il ne doit pas dominer le titre.
- Dans le paragraphe d'introduction, `DOMTEKNIKA` est souligné en rouge. Les autres strong restent en gras sans soulignement.

## Expertise Et Logos

- Dans `The product`, les stats ne doivent passer en 3 colonnes qu'à largeur suffisante (`min-[1500px]` aujourd'hui). En dessous, elles s'empilent pour éviter tout chevauchement texte/drapeau.
- Les logos `Trusted by` doivent être lisibles dans le marquee, pas réduits à des pictogrammes. Le bandeau gris reste compact, avec des logos visuellement plus grands et rapprochés sans chevauchement. Le défilement ne s'arrête pas au hover et les bords gauche/droite utilisent un fondu flouté large avec `mask-image`, afin que le blur disparaisse progressivement sans bord visible.
- Le bloc `The idea` reste discret mais doit avoir un contour gris clair pour équilibrer les trois colonnes de la section expertise.
- Le bouton CTA final utilise une shadow noire, pas une shadow rouge.
- Les projets utilisent le carousel shadcn/Embla avec `loop`, slides dupliquées et Autoplay Embla. Le rendu doit se lire comme un carousel infini, pas comme une rangée statique.
- Les boutons rouges principaux (`Contact Us`, `Start your project`) utilisent une ombre noire douce, aucun contour blanc visible, et gardent seulement un focus ring rouge accessible.

## Bannière Suisse

Image: `public/assets/alps-background.png`.

Effets obligatoires:

- Rectangle de blur de gauche à 2/3 de l'image.
- `backdrop-filter: blur(14px)`.
- Masque linéaire pour que le blur disparaisse vers la droite.
- Gradient par-dessus: `rgba(0,70,145,0.49) 0%` vers `rgba(0,39,61,0) 100%`.

Le texte et les icônes restent dans la zone gauche lisible. La partie droite de la photo doit rester nette.

## Assets

Assets principaux dans `public/assets`:

- `domteknika-logo.png`
- `technical-drawing-top.png`
- `technical-drawing-bottom.png`
- `product-1.png` à `product-4.png`
- `schema-process.png`
- `logo-aventor.png`, `logo-logitech.png`, `logo-nestle.png`, `logo-nespresso.png`, `logo-softcar.png`, `logo-total.png`, `logo-stagvelo.png`, `logo-gin.png`
- `alps-background.png`
- `swiss-flag.png`
- `swiss-quality.png`, `end-to-end.png`, `agile.png`, `confidential.png`

Utiliser `next/image` pour tous les visuels bitmap.
Pour `technical-drawing-bottom.png`, conserver l'asset original via `unoptimized` et `quality={100}` afin d'éviter une sensation de compression ou de flou sur le line-art.

## Motion

Motion acceptée:

- Entrées douces sur hero et CTA final: opacity + translateY uniquement.
- Hover léger sur boutons et cartes projets.
- Un seul marquee sur la page: la section `Trusted by`.
- Smooth scrolling via Lenis.

Accessibilité:

- `prefers-reduced-motion` désactive les animations longues.
- `prefers-reduced-transparency` désactive le glass.

## Réutilisation

Composants de base:

- `Navbar`
- `Footer`
- `Container`
- `Logo`
- `LanguageSwitcher`
- `TrustedBy`
- `SwissBannerSection`
- `CtaSection`

Ne pas créer de nouvelles sections marketing génériques sans une page Figma ou une demande explicite.

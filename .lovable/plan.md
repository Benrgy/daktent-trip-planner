
# Cinematic effecten voor een levendige ervaring

## Wat
De repo `robonuggets/cinematic-site-components` bevat 30 single-file modules in 4 categorieën: Scroll-Driven (9), Cursor & Hover (8), Click & Tap (6), Ambient & Auto (7). Niet alles past bij een functionele planner-tool — te veel effecten maakt het traag en chaotisch. Ik selecteer **6 effecten** die de roadtrip-sfeer versterken zonder de UX te verstoren, en port ze van vanilla HTML/CSS/JS naar React + Tailwind binnen de bestaande designtokens (geen losse `<style>` blocks).

## De 6 gekozen effecten en waar ze landen

| # | Effect | Categorie | Waar | Waarom |
|---|--------|-----------|------|--------|
| 1 | **Parallax hero** | Scroll-Driven | `Hero.tsx` (homepage) | Geeft de bergachtergrond diepte tijdens scrollen — past perfect bij roadtrip-sfeer |
| 2 | **Scroll reveal (fade-in-up)** | Scroll-Driven | `Index.tsx` secties + `Countries.tsx` cards | Secties en landenkaarten faden netjes in bij scrollen |
| 3 | **Magnetic / tilt cards** | Cursor & Hover | Land-cards, quick-link cards, kampeerplek-cards | Cards reageren subtiel op de muis — voelt levendig en premium |
| 4 | **Gradient stroke / glow op CTA** | Ambient & Auto | "Start met plannen" en wizard-knoppen | Animerende gradient-rand trekt aandacht naar de primaire actie |
| 5 | **Animated count-up cijfers** | Ambient & Auto | Hero-stats ("40+ kampeerplekken", "14 landen", "3 min") + TripSummary kosten | Cijfers tellen op bij in-view — voelt dynamisch |
| 6 | **Marquee strip** (oneindige slider) | Ambient & Auto | Nieuwe strip onder Hero met landvlaggen + "wildcamping toegestaan", "noodnummer 112", etc. | Subtiele beweging die de schaal van de tool laat zien |

Bewust **niet** opgenomen (te veel afleiding voor functionele planner): glitch-effect, image-trail, cursor-reveal, dynamic-island, coverflow, drag-pan, curtain-reveal.

## Nieuwe bestanden

- `src/hooks/useScrollReveal.ts` — IntersectionObserver hook die `.opacity-0 translate-y-4` → `.opacity-100 translate-y-0` togglet
- `src/hooks/useCountUp.ts` — telt van 0 → target wanneer element in view komt (respecteert `prefers-reduced-motion`)
- `src/hooks/useParallax.ts` — koppelt `scrollY` aan een translate-Y op een ref
- `src/components/cinematic/TiltCard.tsx` — wrapper die kindcomponent licht roteert op basis van muispositie (max 6°), met `transform-style: preserve-3d`
- `src/components/cinematic/RevealOnScroll.tsx` — wrapper rond `useScrollReveal`, met `delay` prop
- `src/components/cinematic/CountUp.tsx` — `<CountUp end={40} suffix="+" />`
- `src/components/cinematic/GlowButton.tsx` — Button-variant met animerende conic-gradient border
- `src/components/cinematic/Marquee.tsx` — oneindig scrollende strip via CSS `@keyframes` (pause-on-hover)

## Aanpassingen aan bestaande bestanden

- `tailwind.config.ts` — voeg keyframes toe: `marquee`, `glow-rotate`, `fade-in-up`. Voeg `motion-reduce:` overal mee waar nodig.
- `src/index.css` — `prefers-reduced-motion` query die alle nieuwe animaties uitschakelt
- `src/components/Hero.tsx` — bg-image krijgt parallax via `useParallax`; stats-strip krijgt `<CountUp>`; primary CTA wordt `<GlowButton>`
- `src/pages/Index.tsx` — secties wrappen in `<RevealOnScroll>`; quick-link en country cards in `<TiltCard>`; nieuwe `<Marquee>` direct onder Hero met landvlaggen + facts
- `src/pages/Countries.tsx` — country cards in `<TiltCard>` + staggered `<RevealOnScroll delay>`
- `src/pages/CountryDetail.tsx` — info-secties in `<RevealOnScroll>`
- `src/components/TripSummary.tsx` — kosten-getal als `<CountUp>`

## Technische details

- **React-only, geen libraries**: alle effecten in pure React + Tailwind + CSS keyframes. Geen framer-motion of GSAP — houdt bundle klein (Core Web Vitals blijven goed).
- **Reduced motion**: elke hook checkt `window.matchMedia('(prefers-reduced-motion: reduce)')` en skipt animaties. Tailwind `motion-reduce:` utilities op gradient/marquee.
- **Performance**: alleen `transform` en `opacity` (GPU-versneld). IntersectionObserver met `unobserve` na eerste reveal. Parallax via `requestAnimationFrame` + passive scroll listener.
- **Designtokens**: alle kleuren via bestaande HSL-vars (`--primary`, `--accent`). Geen hardcoded hex.
- **Mobile**: TiltCard schakelt uit op `pointer: coarse` (touch). Marquee snelheid verlaagd op kleine schermen.

## Wat verandert niet

- Routing, data, SEO-tags, manifest, sitemap blijven exact zoals ze zijn
- Bestaande componentstructuur (TripWizard, Navbar, etc.) blijft, alleen wrappers eromheen
- Geen nieuwe dependencies in `package.json`

## Resultaat

Een planner die bij eerste indruk merkbaar levendiger aanvoelt — parallax bij scrollen, cards die "ademen" onder de muis, opgloeiende CTA, oplopende cijfers en een subtiele vlaggenstrip — zonder de tool zelf trager of rommeliger te maken.

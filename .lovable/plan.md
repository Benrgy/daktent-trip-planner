

# Multi-page routing voor SEO

## Wat
De huidige single-page app omzetten naar een multi-page structuur met echte URL's, zodat Google elke pagina apart kan indexeren. Dit verhoogt de vindbaarheid drastisch.

## Nieuwe pagina's

| URL | Inhoud |
|-----|--------|
| `/` | Homepage (Hero + Wizard) |
| `/landen` | Overzicht alle 14 landen |
| `/landen/:code` | Landenpagina (NL, BE, DE, etc.) met country info, kampeerplekken, wildcamping regels |
| `/planner` | Trip wizard + resultaten (huidige functionaliteit na "Genereer") |
| `/kosten` | Standalone kostenberekening uitleg |
| `/faq` | FAQ als eigen pagina |

## Technische aanpak

1. **React Router uitbreiden** in `App.tsx` met routes voor `/landen`, `/landen/:code`, `/planner`, `/faq`
2. **Nieuwe pagina-componenten maken**:
   - `src/pages/Countries.tsx` — grid van alle 14 landen met links
   - `src/pages/CountryDetail.tsx` — landenpagina met info, kampeerplekken, wildcamping regels (hergebruikt `CountryInfo`, `CampingMap` en data uit `countryData.ts` + `campingSpots.ts`)
   - `src/pages/FAQ.tsx` — FAQ verplaatst uit Index naar eigen pagina
   - `src/pages/Planner.tsx` — wizard + resultaten (verplaatst uit Index)
3. **Index.tsx vereenvoudigen** tot Hero + CTA's + korte intro + links naar landenpagina's
4. **Navbar updaten** met `<Link>` componenten in plaats van `#hash` anchors
5. **SEO per pagina**: elke pagina krijgt eigen `<title>` en `<meta description>` via `document.title` in useEffect
6. **Sitemap updaten** met alle nieuwe URL's
7. **`public/404.html`** en basename-logica behouden voor GitHub Pages compatibiliteit

## Landenpagina content
Elke `/landen/:code` pagina toont:
- Landnaam + vlag
- Snelheidslimieten, noodnummer, rijtips (uit `countryData`)
- Wildcamping status + regels
- Kampeerplekken in dat land (gefilterd uit `campingSpots`)
- CTA: "Plan een trip naar [land]" → linkt naar planner met land voorgeselecteerd

## Wat verandert niet
- Alle bestaande componenten worden hergebruikt
- Data-bestanden blijven ongewijzigd
- PWA manifest en OG tags blijven werken


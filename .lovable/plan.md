

# Totaalplan: Alle ontbrekende features in één keer

## Overzicht

Na grondige analyse van de volledige codebase zijn dit alle ontbrekende features die een gebruiker verwacht van een complete trip planner. Dit plan voegt ze allemaal in één keer toe.

---

## Wat wordt toegevoegd

### A. Trip opslaan & delen
- **LocalStorage opslag**: Trip configuratie automatisch bewaren, zodat gebruikers hun laatste trip terugzien bij herbezoek
- **URL-delen**: "Deel trip" knop die configuratie encodeert in een URL-parameter, zodat je een link kunt sturen
- **Printbare samenvatting**: Dedicated `TripSummary.tsx` component met alle trip details (route, kosten, weer, paklijst) in print-vriendelijk formaat

### B. Mobiele navigatie
- Hamburger menu voor mobiel (nav links zijn nu `hidden sm:flex` — onbereikbaar op telefoon)
- Sluit automatisch bij klik op link

### C. Landeninformatie
- **Snelheidslimieten** per land (snelweg, binnen/buiten bebouwde kom)
- **Alarmnummers** per land (112 + lokaal)
- **Rijden in het buitenland tips**: rechtsverkeer UK, winterbanden verplichting, reflecterend hesje, etc.
- Getoond als uitklapbaar info-paneel per bestemming

### D. Tolkosten verbeteren
- Huidige berekening is een vlak forfait (€8/dag) — vervangen door realistische geschatte tolkosten per land op basis van afstand
- Bron: gemiddelde tolkosten per km per land

### E. Favoriete campingplekken
- Hart-icoontje op elke camping marker/popup
- Opslag in localStorage
- Filter "Favorieten" in SpotFilters

### F. Griekenland toevoegen
- Populaire bestemming die ontbreekt: GR (Griekenland) toevoegen
- Campingspots, brandstofprijzen, vignet (geen), elektriciteit

### G. Dark mode
- Toggle in navbar
- Gebruikt Tailwind `dark:` classes (theme al ondersteund via CSS variabelen)

### H. Reistijd-planner
- Bij lange ritten (>6 uur): suggestie voor rustpauzes elke 2 uur
- Geschatte aankomsttijd op basis van vertrektijd (instelbaar)

### I. Kampeerregelgeving-overzicht
- Per land: wildcamping status (legaal/gedoogd/verboden)
- Maximale verblijfsduur, boetebedragen
- Getoond als infopaneel bij de kaart

---

## Technische aanpak

### Nieuwe bestanden
1. **`src/components/TripSummary.tsx`** — Printbare samenvatting met alle secties, deel-knop, QR-code
2. **`src/components/CountryInfo.tsx`** — Landeninfo (snelheid, noodgevallen, rijden-tips, regelgeving)
3. **`src/data/countryData.ts`** — Gecentraliseerde data: snelheidslimieten, alarmnummers, wildcamping regels, tolkosten/km, rijtips
4. **`src/hooks/useFavorites.ts`** — localStorage hook voor favoriete spots
5. **`src/hooks/useSavedTrip.ts`** — localStorage hook voor trip opslaan/laden + URL encoding

### Gewijzigde bestanden
6. **`src/components/Navbar.tsx`** — Hamburger menu mobiel + dark mode toggle
7. **`src/components/CostCalculator.tsx`** — Tolkosten op basis van afstand i.p.v. forfait, TripSummary integratie
8. **`src/components/CampingMap.tsx`** — Favoriet-knop in popup
9. **`src/components/SpotFilters.tsx`** — "Favorieten" filter toevoegen
10. **`src/components/TripWizard.tsx`** — Griekenland toevoegen, vertrektijd veld, opgeslagen trip laden
11. **`src/components/RouteInfo.tsx`** — Rustpauze-suggesties, geschatte aankomsttijd
12. **`src/services/fuelPrices.ts`** — GR brandstofprijzen
13. **`src/services/energyCost.ts`** — GR elektriciteitsprijzen
14. **`src/data/campingSpots.ts`** — 3 Griekse campingspots
15. **`src/data/packingItems.ts`** — GR-specifieke items (adapter Type C/F, zonbescherming)
16. **`src/pages/Index.tsx`** — TripSummary, CountryInfo integratie, favorieten state, dark mode provider
17. **`index.html`** — Dark mode class support op `<html>`

### Data structuur `countryData.ts`
```ts
interface CountryData {
  speedLimits: { city: number; rural: number; highway: number };
  emergency: string;
  drivingTips: string[];
  wildcamping: { status: "legal" | "tolerated" | "illegal"; details: string; fine?: string };
  tollPerKm: number; // EUR per km gemiddeld
}
```

### URL-delen formaat
Trip configuratie wordt base64-encoded in `?trip=` parameter. Bij laden wordt de config hersteld en automatisch gegenereerd.

### Dark mode
Toggle in navbar slaat voorkeur op in localStorage. Voegt `dark` class toe aan `<html>`. Alle bestaande Tailwind kleuren werken al via CSS variabelen.

---

## Wat NIET wordt gedaan (buiten scope)
- Multi-stop routes (grote architectuurwijziging)
- Gebruikersaccounts / backend
- Real-time brandstofprijzen API (geen betrouwbare gratis API)
- Campingreserveringen


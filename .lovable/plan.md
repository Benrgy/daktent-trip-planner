

# Aanpasbare brandstofprijzen + ontbrekende features toevoegen

## Wat er nu mist

Na analyse van de volledige codebase vallen de volgende zaken op:

### 1. Brandstofprijzen zijn niet aanpasbaar
De prijzen in `fuelPrices.ts` zijn hard-coded. Gebruikers kunnen hun verbruik al aanpassen, maar **niet** de brandstofprijs per liter/kWh. Dit is essentieel omdat prijzen per tankstation en per week fluctueren.

### 2. Ontbrekende features die gebruikers verwachten

| Feature | Status | Impact |
|---------|--------|--------|
| Aanpasbare brandstofprijzen | Ontbreekt | Hoog — prijzen veranderen wekelijks |
| Vignetkosten per land | Alleen "tol" forfait | Hoog — Zwitserland €40, Oostenrijk €10-daags, etc. |
| Veerpont/tunnel kosten | Ontbreekt | Midden — UK, Scandinavië, eilanden |
| Campingprijs aanpasbaar | Ontbreekt | Hoog — verschilt enorm per camping |
| Eten budget aanpasbaar | Hard-coded €25/pp/dag | Midden |
| Seizoensgebonden paklijst | Altijd dezelfde lijst | Midden — winter vs zomer items |
| Trip samenvatting delen/printen | Ontbreekt | Hoog — gebruikers willen resultaat bewaren |
| Terugrit in kostenberekening | Ontbreekt | Hoog — kosten zijn nu enkele reis |

## Plan van aanpak

### Bestand 1: `src/services/fuelPrices.ts`
- Exporteer de standaard prijzen zodat ze als defaults dienen
- Geen logica-wijziging nodig, de aanpassing zit in de UI

### Bestand 2: `src/components/TripWizard.tsx`
- **TripConfig uitbreiden** met:
  - `customFuelPrice: number | null` — eigen brandstofprijs
  - `customElectricityPrice: number | null` — eigen stroomprijs
  - `customCampingPrice: number | null` — eigen campingprijs per nacht
  - `customFoodBudget: number | null` — eigen eetbudget per persoon/dag
  - `includeReturnTrip: boolean` — heen+terug berekening
- **UI**: Onder de kostenberekening (of als uitklapbaar "Prijzen aanpassen" paneel) invoervelden toevoegen voor:
  - Brandstofprijs (€/L) met placeholder = landgemiddelde
  - Stroompijs (€/kWh) voor EV/PHEV
  - Campingprijs per nacht
  - Eetbudget per persoon per dag
  - Toggle "Inclusief terugrit"

### Bestand 3: `src/components/CostCalculator.tsx`
- Gebruik `customFuelPrice` / `customElectricityPrice` als override in `calculateEnergyCost`
- Gebruik `customCampingPrice` als override voor campingkosten
- Gebruik `customFoodBudget` als override voor eetkosten
- Vignetkosten toevoegen als aparte post (vaste bedragen per land)
- Als `includeReturnTrip` aan staat: verdubbel brandstof/tol/vignet
- Vignetprijzen toevoegen per land:
  - CH: €42 (jaar), AT: €10 (10-dagen), SI: €15 (7-dagen), CZ: €15 (10-dagen), HR: variabel

### Bestand 4: `src/services/energyCost.ts`
- `calculateEnergyCost` uitbreiden met optionele `customFuelPrice` en `customElectricityPrice` parameters
- Als custom prijs is opgegeven, gebruik die i.p.v. de landgemiddelde

### Bestand 5: `src/components/RouteInfo.tsx`
- Terugrit-optie verwerken: toon enkele of retour afstand/tijd

### Bestand 6: `src/components/PackingChecklist.tsx` + `src/data/packingItems.ts`
- Seizoensgebonden items toevoegen: extra items voor winter (thermisch ondergoed, sneeuwkettingen, etc.)
- Bestemmingsafhankelijke items (muggenspray voor Zuid-Europa, etc.)

### Bestand 7: Nieuw — `src/components/TripSummary.tsx`
- "Deel je trip" / "Print overzicht" knop
- Genereert een printbare samenvatting via `window.print()` met alle trip details

## Technische details

De `TripConfig` interface wordt uitgebreid:
```ts
interface TripConfig {
  // ... bestaande velden
  customFuelPrice: number | null;
  customElectricityPrice: number | null;
  customCampingPrice: number | null;
  customFoodBudget: number | null;
  includeReturnTrip: boolean;
}
```

De vignetprijzen worden een statische map:
```ts
const vignetPrices: Record<string, { price: number; label: string }> = {
  CH: { price: 42, label: "Vignet (jaar)" },
  AT: { price: 10, label: "Vignet (10-dagen)" },
  SI: { price: 15, label: "Vignet (7-dagen)" },
};
```

Het "Prijzen aanpassen" paneel wordt een uitklapbare sectie in de CostCalculator, zodat de flow niet verandert maar gevorderde gebruikers alles kunnen finetunen.


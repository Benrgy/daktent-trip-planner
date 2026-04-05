

# Verbruikswaarden herziening + motorfietsen toevoegen

## Probleem
De huidige verbruikswaarden (bijv. hybride = 4L/100km) zijn onrealistisch zonder merk/model-informatie. Zonder fabrieksdata moeten we realistische **gemiddelden** gebruiken op basis van voertuigcategorie, geen optimistische claims.

## Herziene verbruikswaarden

Nieuwe realistische gemiddelden gebaseerd op Europese praktijkcijfers:

```text
Voertuigtype          Benzine    Diesel     LPG        Elektrisch
─────────────────────────────────────────────────────────────────
Klein (stadsauto)     6.5 L      5.0 L      8.0 L      -
Middel (sedan)        7.5 L      6.0 L      9.5 L      -
SUV                   9.0 L      7.5 L      11.0 L     -
4x4 / Camper          11.0 L     9.0 L      13.5 L     -
Hybride (HEV)        5.5 L      -          -          -
Plug-in hybride       3.0 L*     -          -          15 kWh
Elektrisch            -          -          -          18 kWh
Motorfiets            4.5 L      -          -          -

* PHEV: combinatie stroom + benzine, afhankelijk van rijprofiel
```

### Belangrijke wijzigingen
- **Hybride**: van 4L naar 5.5L (realistischer voor gewone HEV zonder stekker)
- **Plug-in hybride (PHEV)**: nieuw type, laag brandstofverbruik + stroom
- **Motorfiets**: nieuw voertuigtype (~4.5L/100km gemiddeld)
- **Verbruik verschilt per brandstoftype**: LPG verbruikt ~20-25% meer liters (lagere energie-inhoud)
- **Klein/Middel/SUV/4x4**: licht bijgesteld naar realistische Europese praktijkcijfers

## Bestanden die wijzigen

### 1. `src/services/energyCost.ts`
- Verbruikswaarden per voertuigtype EN brandstoftype (niet 1 getal per type)
- Nieuwe structuur: `fuelRates[carType][fuelType]` i.p.v. flat record
- Motorfiets en PHEV toevoegen
- PHEV-logica: berekent combinatie van stroom + brandstof

### 2. `src/components/TripWizard.tsx`
- Voertuigselectie uitbreiden met "Motorfiets" en "Plug-in hybride"
- Labels aanpassen (geen vaste L/100km meer tonen, want het verschilt per brandstof)
- Motorfiets: brandstofkeuze beperken tot benzine
- PHEV: accuslider tonen + brandstofkeuze

### 3. `src/components/RouteInfo.tsx`
- PHEV-laadstoplogica toevoegen (vergelijkbaar met EV maar met kleinere accu)

### 4. `src/components/CostCalculator.tsx`
- PHEV: dubbele kostenlijn tonen (stroom + brandstof)

### 5. Tests updaten
- `CostCalculator.test.tsx`, `TripWizard.test.tsx` aanpassen voor nieuwe types

## Technische aanpak

Het verbruik wordt een functie van **zowel voertuigtype als brandstoftype**:

```ts
const fuelRates: Record<string, Record<string, number>> = {
  small:    { benzine: 6.5, diesel: 5.0, lpg: 8.0 },
  medium:   { benzine: 7.5, diesel: 6.0, lpg: 9.5 },
  suv:      { benzine: 9.0, diesel: 7.5, lpg: 11.0 },
  "4x4":    { benzine: 11.0, diesel: 9.0, lpg: 13.5 },
  hybrid:   { benzine: 5.5 },
  phev:     { benzine: 3.0 },
  motorcycle: { benzine: 4.5 },
};
```

De UI toont dan het verbruik dynamisch op basis van de geselecteerde combinatie, en sluit ongeldige brandstofkeuzes uit (bijv. geen diesel/LPG voor hybride of motorfiets).


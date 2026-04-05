export interface PackingItem {
  id: string;
  name: string;
  category: string;
  /** Optional: only show for these seasons */
  season?: "winter" | "summer";
  /** Optional: only show for these destination codes */
  destinations?: string[];
}

export const packingCategories: Record<string, PackingItem[]> = {
  "Daktent Essentials": [
    { id: "d1", name: "Daktent (gecontroleerd op slijtage)", category: "Daktent Essentials" },
    { id: "d2", name: "Slaapzakken", category: "Daktent Essentials" },
    { id: "d3", name: "Slaapmatten / matras", category: "Daktent Essentials" },
    { id: "d4", name: "Kussens", category: "Daktent Essentials" },
    { id: "d5", name: "Ladder (check bevestiging)", category: "Daktent Essentials" },
    { id: "d6", name: "Extra haringen en scheerlijnen", category: "Daktent Essentials" },
    { id: "d7", name: "Voortent / luifel", category: "Daktent Essentials" },
    { id: "d8", name: "LED verlichting / lantaarn", category: "Daktent Essentials" },
    { id: "d9", name: "Powerbank en kabels", category: "Daktent Essentials" },
    { id: "d10", name: "Anti-condens doek", category: "Daktent Essentials" },
  ],
  "Koken & Eten": [
    { id: "k1", name: "Gasbrander + gaspatronen", category: "Koken & Eten" },
    { id: "k2", name: "Pannenset", category: "Koken & Eten" },
    { id: "k3", name: "Bestek, borden, bekers", category: "Koken & Eten" },
    { id: "k4", name: "Koelbox met koelelementen", category: "Koken & Eten" },
    { id: "k5", name: "Drinkwater (5L jerrycan)", category: "Koken & Eten" },
    { id: "k6", name: "Afwasmiddel en spons", category: "Koken & Eten" },
    { id: "k7", name: "Snijplank en mes", category: "Koken & Eten" },
    { id: "k8", name: "Koffie/thee benodigdheden", category: "Koken & Eten" },
  ],
  "Kleding": [
    { id: "c1", name: "Regenjas", category: "Kleding" },
    { id: "c2", name: "Wandelschoenen", category: "Kleding" },
    { id: "c3", name: "Warme fleece / trui", category: "Kleding" },
    { id: "c4", name: "T-shirts (per dag)", category: "Kleding" },
    { id: "c5", name: "Korte & lange broeken", category: "Kleding" },
    { id: "c6", name: "Ondergoed en sokken", category: "Kleding" },
    { id: "c7", name: "Badkleding", category: "Kleding" },
    { id: "c8", name: "Muts en handschoenen", category: "Kleding", season: "winter" },
    { id: "c9", name: "Zonnebril en pet", category: "Kleding" },
    { id: "c10", name: "Slippers / sandalen", category: "Kleding" },
    { id: "c11", name: "Thermisch ondergoed", category: "Kleding", season: "winter" },
    { id: "c12", name: "Winterjas (dons/waterdicht)", category: "Kleding", season: "winter" },
  ],
  "Noodgevallen": [
    { id: "e1", name: "EHBO-kit", category: "Noodgevallen" },
    { id: "e2", name: "Zaklamp + extra batterijen", category: "Noodgevallen" },
    { id: "e3", name: "Multitool / zakmes", category: "Noodgevallen" },
    { id: "e4", name: "Ducttape", category: "Noodgevallen" },
    { id: "e5", name: "Insectenspray", category: "Noodgevallen" },
    { id: "e6", name: "Zonnebrandcrème", category: "Noodgevallen" },
    { id: "e7", name: "Muggenspray (extra sterk)", category: "Noodgevallen", destinations: ["ES", "IT", "PT", "HR", "SI", "FR"] },
    { id: "e8", name: "Tekenpen / tekentang", category: "Noodgevallen", destinations: ["DE", "AT", "CH", "SI", "HR", "SC"] },
  ],
  "Documenten": [
    { id: "doc1", name: "Paspoort / ID", category: "Documenten" },
    { id: "doc2", name: "Rijbewijs", category: "Documenten" },
    { id: "doc3", name: "Autoverzekering papieren", category: "Documenten" },
    { id: "doc4", name: "Zorgverzekeringspas (EHIC)", category: "Documenten" },
    { id: "doc5", name: "Routebeschrijving / GPS", category: "Documenten" },
    { id: "doc6", name: "Vignet (vooraf kopen!)", category: "Documenten", destinations: ["CH", "AT", "SI"] },
  ],
  "Winteruitrusting": [
    { id: "w1", name: "Sneeuwkettingen", category: "Winteruitrusting", season: "winter" },
    { id: "w2", name: "IJskrabber", category: "Winteruitrusting", season: "winter" },
    { id: "w3", name: "Winterbanden (gecontroleerd)", category: "Winteruitrusting", season: "winter" },
    { id: "w4", name: "Thermoskan", category: "Winteruitrusting", season: "winter" },
    { id: "w5", name: "Warmtekruik / handwarmers", category: "Winteruitrusting", season: "winter" },
  ],
};

/** Filter packing items by season and destination */
export function getFilteredPackingCategories(
  destination?: string,
  month?: number
): Record<string, PackingItem[]> {
  const isWinter = month !== undefined && (month <= 3 || month >= 10);
  const result: Record<string, PackingItem[]> = {};

  for (const [cat, items] of Object.entries(packingCategories)) {
    const filtered = items.filter(item => {
      if (item.season === "winter" && !isWinter) return false;
      if (item.season === "summer" && isWinter) return false;
      if (item.destinations && destination && !item.destinations.includes(destination)) return false;
      return true;
    });
    if (filtered.length > 0) {
      result[cat] = filtered;
    }
  }

  return result;
}

import jsPDF from "jspdf";
import { TripConfig } from "@/components/TripWizard";
import { RouteResult, formatDuration } from "@/services/routing";
import { CampingSpot } from "@/data/campingSpots";
import { getFuelPrices } from "@/services/fuelPrices";
import { calculateEnergyCost, isElectric, isPhev, getElectricityPrice } from "@/services/energyCost";
import { getCountryData } from "@/data/countryData";

const destLabels: Record<string, string> = {
  NL: "Nederland", BE: "België", DE: "Duitsland", FR: "Frankrijk",
  SC: "Scandinavië", GB: "Engeland", ES: "Spanje", IT: "Italië",
  PT: "Portugal", AT: "Oostenrijk", CH: "Zwitserland", HR: "Kroatië",
  SI: "Slovenië", GR: "Griekenland",
};

const vehicleLabels: Record<string, string> = {
  small: "Kleine auto", medium: "Middenklasse", suv: "SUV / MPV",
  "4x4": "4x4 / Terreinwagen", hybrid: "Hybride", phev: "Plug-in Hybride",
  electric: "Elektrisch", motorcycle: "Motorfiets",
};

const vignetPrices: Record<string, { price: number; label: string }> = {
  CH: { price: 42, label: "Vignet CH (jaar)" },
  AT: { price: 10, label: "Vignet AT (10-dagen)" },
  SI: { price: 15, label: "Vignet SI (7-dagen)" },
};

const ferryCosts: Record<string, { price: number; label: string }> = {
  GB: { price: 180, label: "Kanaaltunnel / Veerboot" },
  SC: { price: 250, label: "Veerboot Scandinavië" },
};

const avgDistPerDay: Record<string, number> = {
  NL: 120, BE: 150, DE: 200, FR: 250, SC: 300, ES: 280, IT: 220,
  PT: 200, AT: 180, CH: 150, HR: 200, SI: 150, GB: 200, GR: 250,
};

export function exportTripPdf(config: TripConfig, routeResult: RouteResult | null, spots: CampingSpot[] = []) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = 190; // printable width
  let y = 20;

  const destinations = config.destinations?.length ? config.destinations : (config.destination ? [config.destination] : []);
  const primaryDest = destinations[0] || "NL";
  const multiplier = config.includeReturnTrip ? 2 : 1;
  const distPerDay = avgDistPerDay[primaryDest] || 150;
  const singleKm = routeResult?.distanceKm ?? (distPerDay * config.days);
  const totalKm = singleKm * multiplier;

  // --- Header ---
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("DaktentTripPlanner", 14, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text("Jouw trip samenvatting", 14, y);
  doc.setTextColor(0);
  y += 4;
  doc.setDrawColor(200);
  doc.line(14, y, 14 + pw, y);
  y += 10;

  // --- Trip details ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Tripgegevens", 14, y);
  y += 8;

  const addRow = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 70, y);
    y += 6;
  };

  addRow("Vertrekplaats:", config.startLocation || "Nederland");
  addRow("Bestemmingen:", destinations.map(d => destLabels[d] || d).join(" → "));
  addRow("Reisduur:", `${config.days} dagen`);
  addRow("Personen:", `${config.people}`);
  addRow("Voertuig:", vehicleLabels[config.carType] || config.carType);
  if (!isElectric(config.carType)) {
    addRow("Brandstof:", config.fuelType.charAt(0).toUpperCase() + config.fuelType.slice(1));
  }
  if (config.includeReturnTrip) addRow("Retour:", "Ja (heen + terug)");

  y += 4;

  // --- Route ---
  if (routeResult) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Route", 14, y);
    y += 8;

    addRow("Afstand (enkel):", `${singleKm} km`);
    addRow("Totale afstand:", `${totalKm} km`);
    addRow("Reistijd (enkel):", formatDuration(routeResult.durationMinutes));
    if (routeResult.legs && routeResult.legs.length > 1) {
      y += 2;
      doc.setFont("helvetica", "bold");
      doc.text("Etappes:", 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      routeResult.legs.forEach((leg, i) => {
        doc.text(`  ${i + 1}. ${leg.distanceKm} km — ${formatDuration(leg.durationMinutes)}`, 18, y);
        y += 5;
      });
    }
    y += 4;
  }

  // --- Kosten ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Kostenberekening", 14, y);
  y += 8;

  const prices = getFuelPrices(primaryDest);
  const energy = calculateEnergyCost(
    totalKm, config.carType, config.fuelType, primaryDest,
    config.customConsumption, config.customFuelPrice, config.customElectricityPrice
  );
  const fuelCost = energy.cost;

  const avgCampCost = config.customCampingPrice ?? 12;
  const campingCost = Math.round(avgCampCost * config.days);
  const foodCost = Math.round(config.people * config.days * (config.customFoodBudget ?? 25));

  let tollCost = 0;
  for (const dest of destinations) {
    const info = getCountryData(dest);
    if (info && info.tollPerKm > 0) {
      tollCost += Math.round((totalKm / destinations.length) * info.tollPerKm);
    }
  }

  let vignetCost = 0;
  const vignetItems: string[] = [];
  for (const dest of destinations) {
    const v = vignetPrices[dest];
    if (v) { vignetCost += v.price; vignetItems.push(`${v.label}: €${v.price}`); }
  }

  let ferryCost = 0;
  const ferryItems: string[] = [];
  for (const dest of destinations) {
    const f = ferryCosts[dest];
    if (f) { ferryCost += f.price; ferryItems.push(`${f.label}: €${f.price}`); }
  }

  const totalCost = fuelCost + campingCost + foodCost + tollCost + vignetCost + ferryCost;

  const electric = isElectric(config.carType);
  const phev = isPhev(config.carType);
  const energyLabel = electric ? "Opladen" : phev ? "Brandstof + Stroom" : "Brandstof";

  const costAddRow = (label: string, amount: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, 18, y);
    doc.text(`€${amount}`, 140, y, { align: "right" });
    y += 6;
  };

  costAddRow(energyLabel, fuelCost);
  costAddRow("Camping", campingCost);
  costAddRow(`Eten (${config.people}p × ${config.days}d)`, foodCost);
  if (tollCost > 0) costAddRow("Tolwegen", tollCost);
  vignetItems.forEach(v => { doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text(`  ${v}`, 18, y); y += 5; });
  if (vignetCost > 0 && vignetItems.length === 0) costAddRow("Vignetten", vignetCost);
  ferryItems.forEach(f => { doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text(`  ${f}`, 18, y); y += 5; });

  y += 2;
  doc.setDrawColor(180);
  doc.line(18, y, 140, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Totaal:", 18, y);
  doc.text(`€${totalCost}`, 140, y, { align: "right" });
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`€${Math.round(totalCost / config.days)} per dag`, 18, y);
  y += 12;

  // --- Footer ---
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Gegenereerd door DaktentTripPlanner.nl — Alle bedragen zijn schattingen.", 14, 282);

  doc.save(`daktent-trip-${destinations.join("-")}.pdf`);
}

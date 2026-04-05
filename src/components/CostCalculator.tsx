import { useState } from "react";
import { TripConfig } from "./TripWizard";
import { CampingSpot } from "@/data/campingSpots";
import { getFuelPrices } from "@/services/fuelPrices";
import { calculateEnergyCost, isElectric, isPhev, getElectricityPrice } from "@/services/energyCost";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowDown, Fuel, Zap, Settings2, RotateCcw, Printer, Ship } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const avgDistPerDay: Record<string, number> = { NL: 120, BE: 150, DE: 200, FR: 250, SC: 300, ES: 280, IT: 220, PT: 200, AT: 180, CH: 150, HR: 200, SI: 150, GB: 200 };

/** Vignette prices per country (EUR) */
const vignetPrices: Record<string, { price: number; label: string }> = {
  CH: { price: 42, label: "Vignet (jaar)" },
  AT: { price: 10, label: "Vignet (10-dagen)" },
  SI: { price: 15, label: "Vignet (7-dagen)" },
};

/** Ferry/tunnel costs per country (EUR, return price) */
const ferryCosts: Record<string, { price: number; label: string; description: string }> = {
  GB: { price: 180, label: "Kanaaltunnel / Veerboot", description: "Calais–Dover retour (auto + passagiers)" },
  SC: { price: 250, label: "Veerboot Scandinavië", description: "Puttgarden–Rødby of Rostock–Gedser retour" },
};

interface Props {
  config: TripConfig;
  spots: CampingSpot[];
  realDistanceKm?: number;
}

const CostCalculator = ({ config, spots, realDistanceKm }: Props) => {
  const [priceOpen, setPriceOpen] = useState(false);
  const [localFuelPrice, setLocalFuelPrice] = useState<number | null>(config.customFuelPrice);
  const [localElPrice, setLocalElPrice] = useState<number | null>(config.customElectricityPrice);
  const [localCampingPrice, setLocalCampingPrice] = useState<number | null>(config.customCampingPrice);
  const [localFoodBudget, setLocalFoodBudget] = useState<number | null>(config.customFoodBudget);

  const multiplier = config.includeReturnTrip ? 2 : 1;
  const distPerDay = avgDistPerDay[config.destination] || 150;
  const singleKm = realDistanceKm ?? (distPerDay * config.days);
  const totalKm = singleKm * multiplier;

  const prices = getFuelPrices(config.destination);
  const elPriceDefault = getElectricityPrice(config.destination);
  const electric = isElectric(config.carType);
  const phev = isPhev(config.carType);

  const defaultFuelPrice = config.fuelType === "diesel" ? prices.diesel : config.fuelType === "lpg" ? prices.lpg : prices.benzine;

  const energy = calculateEnergyCost(
    totalKm, config.carType, config.fuelType, config.destination,
    config.customConsumption, localFuelPrice, localElPrice
  );
  const fuelCost = energy.cost;

  const avgCampCost = spots.length > 0
    ? spots.reduce((sum, s) => sum + s.pricePerNight, 0) / spots.length
    : 12;
  const campingCost = Math.round((localCampingPrice ?? avgCampCost) * config.days);
  const foodCost = Math.round(config.people * config.days * (localFoodBudget ?? 25));
  const tollCost = ["FR", "SC", "IT", "ES", "AT", "CH", "HR", "SI", "GB"].includes(config.destination) ? Math.round(config.days * 8 * multiplier) : 0;
  const vignet = vignetPrices[config.destination];
  const vignetCost = vignet ? vignet.price : 0;
  const ferry = ferryCosts[config.destination];
  const ferryCost = ferry ? ferry.price : 0;
  const totalCost = fuelCost + campingCost + foodCost + tollCost + vignetCost + ferryCost;
  const hotelEquiv = config.days * config.people * 85;
  const savings = hotelEquiv - totalCost;

  const energyLabel = electric ? "Opladen" : phev ? "Brandstof + Stroom" : "Brandstof";

  const data = [
    { name: energyLabel, value: fuelCost, color: electric || phev ? "hsl(142, 60%, 45%)" : "hsl(222, 47%, 31%)" },
    { name: "Camping", value: campingCost, color: "hsl(152, 44%, 42%)" },
    { name: "Eten", value: foodCost, color: "hsl(32, 95%, 44%)" },
    { name: "Tol", value: tollCost, color: "hsl(220, 9%, 46%)" },
    ...(vignetCost > 0 ? [{ name: vignet!.label, value: vignetCost, color: "hsl(280, 40%, 50%)" }] : []),
    ...(ferryCost > 0 ? [{ name: ferry!.label, value: ferryCost, color: "hsl(200, 60%, 45%)" }] : []),
  ];

  const resetPrices = () => {
    setLocalFuelPrice(null);
    setLocalElPrice(null);
    setLocalCampingPrice(null);
    setLocalFoodBudget(null);
  };

  const handlePrint = () => window.print();

  return (
    <section id="kosten" className="border-b border-border py-16 px-4 print:border-none print:py-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 3</div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-2xl font-bold text-foreground">Kostenberekening</h2>
          <Button variant="ghost" size="sm" onClick={handlePrint} className="gap-1.5 text-xs print:hidden">
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
        </div>
        <p className="mb-8 text-sm text-muted-foreground">
          Geschatte kosten voor een {config.days}-daagse trip met {config.people} {config.people === 1 ? "persoon" : "personen"}
          {config.includeReturnTrip ? " (heen + terug)" : " (enkele reis)"}.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Total */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Totale kosten</p>
            <p className="text-4xl font-bold tracking-tight text-foreground font-display">€{totalCost}</p>
            <p className="mt-1 text-sm text-muted-foreground">€{Math.round(totalCost / config.days)} per dag</p>
            {config.includeReturnTrip && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">Incl. terugrit ({totalKm} km totaal)</p>
            )}
            {savings > 0 && (
              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-secondary">
                <ArrowDown className="h-3.5 w-3.5" />
                €{savings} goedkoper dan hotels
              </div>
            )}
          </div>

          {/* Pie chart */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                  {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `€${v}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {data.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-medium text-foreground">€{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Energy price info */}
        <div className="mt-4 rounded-lg border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            {electric || phev ? <Zap className="h-4 w-4 text-primary" /> : <Fuel className="h-4 w-4 text-primary" />}
            <h3 className="text-sm font-semibold text-foreground">
              {electric ? "Oplaadkosten" : phev ? "Brandstof + Oplaadkosten" : "Brandstofprijzen"} {prices.country}
            </h3>
          </div>

          {electric ? (
            <div className="text-sm">
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">Stroom (publieke lader)</span>
                <span className="text-foreground">€{(localElPrice ?? elPriceDefault).toFixed(2)}/kWh</span>
              </div>
            </div>
          ) : phev ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">Benzine</span>
                <span className="text-foreground">€{(localFuelPrice ?? prices.benzine).toFixed(2)}/L</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">Stroom (publieke lader)</span>
                <span className="text-foreground">€{(localElPrice ?? elPriceDefault).toFixed(2)}/kWh</span>
              </div>
              {energy.electricCost !== undefined && (
                <div className="mt-1 text-[10px] text-muted-foreground">
                  Brandstof: €{energy.cost - energy.electricCost} + Stroom: €{energy.electricCost} = €{energy.cost} totaal
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className={`flex justify-between ${config.fuelType === "benzine" ? "font-semibold" : ""}`}>
                <span className="text-muted-foreground">Benzine</span>
                <span className="text-foreground">€{(config.fuelType === "benzine" && localFuelPrice ? localFuelPrice : prices.benzine).toFixed(2)}/L</span>
              </div>
              <div className={`flex justify-between ${config.fuelType === "diesel" ? "font-semibold" : ""}`}>
                <span className="text-muted-foreground">Diesel</span>
                <span className="text-foreground">€{(config.fuelType === "diesel" && localFuelPrice ? localFuelPrice : prices.diesel).toFixed(2)}/L</span>
              </div>
              <div className={`flex justify-between ${config.fuelType === "lpg" ? "font-semibold" : ""}`}>
                <span className="text-muted-foreground">LPG</span>
                <span className="text-foreground">€{(config.fuelType === "lpg" && localFuelPrice ? localFuelPrice : prices.lpg).toFixed(2)}/L</span>
              </div>
            </div>
          )}

          <p className="mt-2 text-[10px] text-muted-foreground">
            Bron: {prices.source} · {energy.label} = €{energy.cost - (energy.electricCost ?? 0)}
            {energy.electricLabel && ` + ${energy.electricLabel} = €${energy.electricCost}`}
          </p>
        </div>

        {/* Ferry/tunnel info */}
        {ferry && (
          <div className="mt-4 rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <Ship className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{ferry.label}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{ferry.description}</p>
            <p className="mt-1 text-xs font-medium text-foreground">€{ferry.price} (geschat gemiddelde)</p>
          </div>
        )}

        {/* Adjustable prices panel */}
        <Collapsible open={priceOpen} onOpenChange={setPriceOpen} className="mt-4 print:hidden">
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            <Settings2 className="h-4 w-4 text-primary" />
            Prijzen aanpassen
            <span className="ml-auto text-[11px] text-muted-foreground">
              {(localFuelPrice || localElPrice || localCampingPrice || localFoodBudget) ? "aangepast" : "standaard"}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Fuel / electricity price */}
              {(electric || phev) ? (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Stroomprijs (€/kWh)</label>
                  <Input
                    type="number" min={0.05} max={2} step={0.01}
                    placeholder={elPriceDefault.toFixed(2)}
                    value={localElPrice ?? ""}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      setLocalElPrice(!isNaN(v) && v > 0 ? v : null);
                    }}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
              ) : null}
              {!electric ? (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    {electric ? "" : `${config.fuelType === "diesel" ? "Diesel" : config.fuelType === "lpg" ? "LPG" : "Benzine"}prijs (€/L)`}
                  </label>
                  <Input
                    type="number" min={0.30} max={5} step={0.01}
                    placeholder={defaultFuelPrice.toFixed(2)}
                    value={localFuelPrice ?? ""}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      setLocalFuelPrice(!isNaN(v) && v > 0 ? v : null);
                    }}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
              ) : null}

              {/* Camping price */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Campingprijs (€/nacht)</label>
                <Input
                  type="number" min={0} max={100} step={1}
                  placeholder={Math.round(avgCampCost).toString()}
                  value={localCampingPrice ?? ""}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setLocalCampingPrice(!isNaN(v) && v >= 0 ? v : null);
                  }}
                  className="mt-1 h-8 text-sm"
                />
              </div>

              {/* Food budget */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Eetbudget (€/persoon/dag)</label>
                <Input
                  type="number" min={5} max={100} step={1}
                  placeholder="25"
                  value={localFoodBudget ?? ""}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setLocalFoodBudget(!isNaN(v) && v > 0 ? v : null);
                  }}
                  className="mt-1 h-8 text-sm"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={resetPrices}
              className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> Reset naar standaard
            </button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};

export default CostCalculator;

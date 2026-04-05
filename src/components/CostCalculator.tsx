import { TripConfig } from "./TripWizard";
import { CampingSpot } from "@/data/campingSpots";
import { getFuelPrices } from "@/services/fuelPrices";
import { calculateEnergyCost, isElectric, isPhev, getElectricityPrice } from "@/services/energyCost";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowDown, Fuel, Zap, BatteryCharging } from "lucide-react";

const avgDistPerDay: Record<string, number> = { NL: 120, BE: 150, DE: 200, FR: 250, SC: 300, ES: 280, IT: 220, PT: 200, AT: 180, CH: 150, HR: 200, SI: 150 };

interface Props {
  config: TripConfig;
  spots: CampingSpot[];
  realDistanceKm?: number;
}

const CostCalculator = ({ config, spots, realDistanceKm }: Props) => {
  const distPerDay = avgDistPerDay[config.destination] || 150;
  const totalKm = realDistanceKm ?? (distPerDay * config.days);

  const energy = calculateEnergyCost(totalKm, config.carType, config.fuelType, config.destination);
  const fuelCost = energy.cost;

  const avgCampCost = spots.length > 0
    ? spots.reduce((sum, s) => sum + s.pricePerNight, 0) / spots.length
    : 12;
  const campingCost = Math.round(avgCampCost * config.days);
  const foodCost = Math.round(config.people * config.days * 25);
  const tollCost = ["FR", "SC", "IT", "ES", "AT", "CH", "HR", "SI"].includes(config.destination) ? Math.round(config.days * 8) : 0;
  const totalCost = fuelCost + campingCost + foodCost + tollCost;
  const hotelEquiv = config.days * config.people * 85;
  const savings = hotelEquiv - totalCost;

  const electric = isElectric(config.carType);
  const phev = isPhev(config.carType);
  const energyLabel = electric ? "Opladen" : phev ? "Brandstof + Stroom" : "Brandstof";

  const data = [
    { name: energyLabel, value: fuelCost, color: electric || phev ? "hsl(142, 60%, 45%)" : "hsl(222, 47%, 31%)" },
    { name: "Camping", value: campingCost, color: "hsl(152, 44%, 42%)" },
    { name: "Eten", value: foodCost, color: "hsl(32, 95%, 44%)" },
    { name: "Tol", value: tollCost, color: "hsl(220, 9%, 46%)" },
  ];

  const prices = getFuelPrices(config.destination);
  const elPrice = getElectricityPrice(config.destination);

  return (
    <section id="kosten" className="border-b border-border py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 3</div>
        <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Kostenberekening</h2>
        <p className="mb-8 text-sm text-muted-foreground">Geschatte kosten voor een {config.days}-daagse trip met {config.people} {config.people === 1 ? "persoon" : "personen"}.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Total */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Totale kosten</p>
            <p className="text-4xl font-bold tracking-tight text-foreground font-display">€{totalCost}</p>
            <p className="mt-1 text-sm text-muted-foreground">€{Math.round(totalCost / config.days)} per dag</p>
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
                <span className="text-foreground">€{elPrice.toFixed(2)}/kWh</span>
              </div>
            </div>
          ) : phev ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">Benzine</span>
                <span className="text-foreground">€{prices.benzine.toFixed(2)}/L</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">Stroom (publieke lader)</span>
                <span className="text-foreground">€{elPrice.toFixed(2)}/kWh</span>
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
                <span className="text-foreground">€{prices.benzine.toFixed(2)}/L</span>
              </div>
              <div className={`flex justify-between ${config.fuelType === "diesel" ? "font-semibold" : ""}`}>
                <span className="text-muted-foreground">Diesel</span>
                <span className="text-foreground">€{prices.diesel.toFixed(2)}/L</span>
              </div>
              <div className={`flex justify-between ${config.fuelType === "lpg" ? "font-semibold" : ""}`}>
                <span className="text-muted-foreground">LPG</span>
                <span className="text-foreground">€{prices.lpg.toFixed(2)}/L</span>
              </div>
            </div>
          )}

          <p className="mt-2 text-[10px] text-muted-foreground">
            Bron: {prices.source} · {energy.label} = €{energy.cost - (energy.electricCost ?? 0)}
            {energy.electricLabel && ` + ${energy.electricLabel} = €${energy.electricCost}`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;

import { TripConfig } from "./TripWizard";
import { CampingSpot } from "@/data/campingSpots";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Euro, Fuel, Utensils, Tent, TrendingDown } from "lucide-react";

const fuelRates: Record<string, number> = { small: 6, medium: 8, suv: 10, "4x4": 12 };
const avgDistPerDay: Record<string, number> = { NL: 120, BE: 150, DE: 200, FR: 250, SC: 300 };
const FUEL_PRICE = 2.05; // €/L

interface Props {
  config: TripConfig;
  spots: CampingSpot[];
}

const CostCalculator = ({ config, spots }: Props) => {
  const distPerDay = avgDistPerDay[config.destination] || 150;
  const totalKm = distPerDay * config.days;
  const fuelLiters = (totalKm / 100) * (fuelRates[config.carType] || 8);
  const fuelCost = Math.round(fuelLiters * FUEL_PRICE);

  const avgCampCost = spots.length > 0
    ? spots.reduce((sum, s) => sum + s.pricePerNight, 0) / spots.length
    : 12;
  const campingCost = Math.round(avgCampCost * config.days);

  const foodCost = Math.round(config.people * config.days * 25);

  const tollCost = ["FR", "SC"].includes(config.destination) ? Math.round(config.days * 8) : 0;

  const totalCost = fuelCost + campingCost + foodCost + tollCost;
  const hotelEquiv = config.days * config.people * 85;

  const data = [
    { name: "Brandstof", value: fuelCost, color: "hsl(217, 91%, 60%)" },
    { name: "Camping", value: campingCost, color: "hsl(160, 84%, 39%)" },
    { name: "Eten", value: foodCost, color: "hsl(38, 92%, 50%)" },
    { name: "Tol", value: tollCost, color: "hsl(215, 16%, 47%)" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-3xl font-bold">Kosten Overzicht</h2>
        <p className="mb-10 text-center text-muted-foreground">Geschatte kosten voor jouw {config.days}-daagse trip</p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Total */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 shadow-card">
            <p className="mb-1 text-sm font-semibold text-muted-foreground">Totale geschatte kosten</p>
            <p className="text-5xl font-extrabold text-primary">€{totalCost}</p>
            <p className="mt-1 text-sm text-muted-foreground">€{Math.round(totalCost / config.days)} per dag</p>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
              <TrendingDown className="h-4 w-4" />
              €{hotelEquiv - totalCost} goedkoper dan hotels!
            </div>
          </div>

          {/* Pie chart */}
          <div className="flex flex-col items-center rounded-2xl bg-card p-6 shadow-card">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `€${v}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {data.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}:</span>
                  <span className="font-semibold">€{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;

import { TripConfig } from "./TripWizard";
import { Cloud, Sun, CloudRain, CloudSun, Wind, Thermometer } from "lucide-react";

const weatherIcons = [Sun, CloudSun, Cloud, Sun, CloudRain, CloudSun, Sun];
const weatherLabels = ["Zonnig", "Half bewolkt", "Bewolkt", "Zonnig", "Regen", "Half bewolkt", "Zonnig"];

const generateMockWeather = (days: number) => {
  return Array.from({ length: Math.min(days, 7) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const idx = i % weatherIcons.length;
    return {
      date: date.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" }),
      Icon: weatherIcons[idx],
      label: weatherLabels[idx],
      tempMin: 8 + Math.floor(Math.random() * 6),
      tempMax: 16 + Math.floor(Math.random() * 8),
      rain: idx === 4 ? 65 : Math.floor(Math.random() * 25),
      wind: 10 + Math.floor(Math.random() * 15),
    };
  });
};

interface Props {
  config: TripConfig;
}

const WeatherDashboard = ({ config }: Props) => {
  const weather = generateMockWeather(config.days);

  return (
    <section className="border-b border-border bg-muted/30 py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 4</div>
        <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Weersverwachting</h2>
        <p className="mb-8 text-sm text-muted-foreground">7-daagse voorspelling — koppel een weer-API voor live data.</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {weather.map((day, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-3 shadow-card text-center">
              <p className="mb-2 text-[11px] font-medium text-muted-foreground">{day.date}</p>
              <day.Icon className={`mx-auto mb-1.5 h-6 w-6 ${day.label === "Regen" ? "text-primary" : "text-accent"}`} />
              <p className="text-[11px] font-medium text-foreground">{day.label}</p>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                <span className="font-semibold text-foreground">{day.tempMax}°</span>
                <span className="text-muted-foreground">/ {day.tempMin}°</span>
              </div>
              <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <Wind className="h-2.5 w-2.5" /> {day.wind} km/h
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeatherDashboard;

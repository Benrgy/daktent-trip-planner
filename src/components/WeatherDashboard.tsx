import { TripConfig } from "./TripWizard";
import { Cloud, Sun, CloudRain, CloudSun, Wind, Thermometer } from "lucide-react";

const weatherIcons = [Sun, CloudSun, Cloud, Sun, CloudRain, CloudSun, Sun];
const weatherLabels = ["Zonnig", "Half bewolkt", "Bewolkt", "Zonnig", "Regenachtig", "Half bewolkt", "Zonnig"];

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
    <section className="bg-muted/50 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-3xl font-bold">Weer Voorspelling</h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">Voorbeelddata — koppel een weer API voor live gegevens</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {weather.map((day, i) => (
            <div key={i} className="flex flex-col items-center rounded-xl bg-card p-4 shadow-card transition-transform hover:scale-105">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">{day.date}</p>
              <day.Icon className={`mb-2 h-8 w-8 ${day.label === "Regenachtig" ? "text-primary" : "text-accent"}`} />
              <p className="text-xs font-medium">{day.label}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <Thermometer className="h-3 w-3 text-destructive" />
                <span className="font-bold">{day.tempMax}°</span>
                <span className="text-muted-foreground">/ {day.tempMin}°</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <CloudRain className="h-3 w-3" /> {day.rain}%
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Wind className="h-3 w-3" /> {day.wind} km/h
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeatherDashboard;

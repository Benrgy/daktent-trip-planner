import { useEffect, useState } from "react";
import { TripConfig } from "./TripWizard";
import { campingSpots } from "@/data/campingSpots";
import { Cloud, Sun, CloudRain, CloudSun, Wind, Snowflake, CloudLightning, CloudDrizzle, Loader2 } from "lucide-react";

/** Map WMO weather codes to icons & Dutch labels */
function weatherFromCode(code: number) {
  if (code === 0) return { Icon: Sun, label: "Zonnig" };
  if (code <= 3) return { Icon: CloudSun, label: "Half bewolkt" };
  if (code <= 48) return { Icon: Cloud, label: "Bewolkt" };
  if (code <= 57) return { Icon: CloudDrizzle, label: "Motregen" };
  if (code <= 67) return { Icon: CloudRain, label: "Regen" };
  if (code <= 77) return { Icon: Snowflake, label: "Sneeuw" };
  if (code <= 82) return { Icon: CloudRain, label: "Buien" };
  if (code <= 86) return { Icon: Snowflake, label: "Sneeuwbuien" };
  if (code <= 99) return { Icon: CloudLightning, label: "Onweer" };
  return { Icon: Cloud, label: "Bewolkt" };
}

/** Central coordinates per country as fallback */
const countryCenter: Record<string, [number, number]> = {
  NL: [52.2, 5.3],
  BE: [50.5, 4.5],
  DE: [51.2, 10.4],
  FR: [46.6, 2.2],
  NO: [61.0, 8.5],
  SE: [62.0, 15.0],
  ES: [40.0, -3.7],
  IT: [42.5, 12.5],
  PT: [39.4, -8.2],
  AT: [47.5, 13.4],
  CH: [46.8, 8.2],
  HR: [45.1, 15.2],
  SI: [46.1, 14.8],
};

interface DayWeather {
  date: string;
  Icon: React.ElementType;
  label: string;
  tempMin: number;
  tempMax: number;
  rain: number;
  wind: number;
}

interface Props {
  config: TripConfig;
}

const WeatherDashboard = ({ config }: Props) => {
  const [weather, setWeather] = useState<DayWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      // Determine coordinates: first matching camping spot or country center
      const spot = campingSpots.find(s => s.countryCode === config.destination);
      const center = countryCenter[config.destination];
      const lat = spot?.lat ?? center?.[0] ?? 52.2;
      const lng = spot?.lng ?? center?.[1] ?? 5.3;

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code&timezone=auto&forecast_days=${Math.min(config.days, 7)}`
        );

        if (!res.ok) throw new Error(`API fout: ${res.status}`);

        const data = await res.json();
        const days: DayWeather[] = data.daily.time.map((dateStr: string, i: number) => {
          const d = new Date(dateStr);
          const { Icon, label } = weatherFromCode(data.daily.weather_code[i]);
          return {
            date: d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" }),
            Icon,
            label,
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            rain: data.daily.precipitation_probability_max[i] ?? 0,
            wind: Math.round(data.daily.wind_speed_10m_max[i]),
          };
        });

        setWeather(days);
      } catch (e) {
        console.error("Weer ophalen mislukt:", e);
        setError("Kan weer niet ophalen. Probeer later opnieuw.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [config.destination, config.days]);

  return (
    <section className="border-b border-border bg-muted/30 py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 4</div>
        <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Weersverwachting</h2>
        <p className="mb-8 text-sm text-muted-foreground">
          Live 7-daagse voorspelling via Open-Meteo — data voor {campingSpots.find(s => s.countryCode === config.destination)?.country ?? config.destination}.
        </p>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Weer ophalen…
          </div>
        )}

        {error && (
          <p className="py-8 text-center text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weather.map((day, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-3 shadow-card text-center">
                <p className="mb-2 text-[11px] font-medium text-muted-foreground">{day.date}</p>
                <day.Icon className={`mx-auto mb-1.5 h-6 w-6 ${day.label === "Regen" || day.label === "Buien" ? "text-primary" : "text-accent"}`} />
                <p className="text-[11px] font-medium text-foreground">{day.label}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                  <span className="font-semibold text-foreground">{day.tempMax}°</span>
                  <span className="text-muted-foreground">/ {day.tempMin}°</span>
                </div>
                <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                  <Wind className="h-2.5 w-2.5" /> {day.wind} km/h
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  💧 {day.rain}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WeatherDashboard;

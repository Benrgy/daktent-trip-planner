import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { countryData } from "@/data/countryData";
import { campingSpots } from "@/data/campingSpots";
import CampingMap from "@/components/CampingMap";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useFavorites } from "@/hooks/useFavorites";
import { ArrowLeft, Gauge, Phone, Car, Tent, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import RevealOnScroll from "@/components/cinematic/RevealOnScroll";

const countryFlags: Record<string, string> = {
  NL: "🇳🇱", BE: "🇧🇪", DE: "🇩🇪", FR: "🇫🇷", SC: "🇸🇪",
  ES: "🇪🇸", IT: "🇮🇹", PT: "🇵🇹", AT: "🇦🇹", CH: "🇨🇭",
  HR: "🇭🇷", SI: "🇸🇮", GB: "🇬🇧", GR: "🇬🇷",
};

const statusColors: Record<string, string> = {
  legal: "text-green-600 bg-green-50 dark:bg-green-950/30",
  tolerated: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
  illegal: "text-red-600 bg-red-50 dark:bg-red-950/30",
};
const statusLabels: Record<string, string> = {
  legal: "Legaal", tolerated: "Gedoogd", illegal: "Verboden",
};

const CountryDetail = () => {
  const { code } = useParams<{ code: string }>();
  const upperCode = code?.toUpperCase() || "";
  const data = countryData[upperCode];
  const { favorites, toggleFavorite } = useFavorites();

  usePageSEO({
    title: data
      ? `Daktent kamperen in ${data.name} — wildcamping, regels & plekken | DaktentTripPlanner`
      : "Land niet gevonden | DaktentTripPlanner",
    description: data
      ? `Alles over daktent kamperen in ${data.name}: wildcamping regels, snelheidslimieten, rijtips en kampeerplekken. Plan je roadtrip naar ${data.name}.`
      : "Dit land is niet gevonden.",
  });

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Land niet gevonden</h1>
          <Link to="/landen" className="mt-4 inline-block text-primary hover:underline">← Terug naar landen</Link>
        </div>
      </div>
    );
  }

  const spots = campingSpots.filter(s => s.countryCode === upperCode);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <Link to="/landen" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Alle landen
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <span className="text-5xl">{countryFlags[upperCode] || "🏳️"}</span>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Daktent kamperen in {data.name}</h1>
            <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[data.wildcamping.status]}`}>
              Wildcamping: {statusLabels[data.wildcamping.status]}
            </span>
          </div>
        </div>

        {/* Speed limits */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Snelheidslimieten</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: data.speedLimits.city, label: "Bebouwde kom" },
              { value: data.speedLimits.rural, label: "Buitenweg" },
              { value: data.speedLimits.highway, label: "Snelweg" },
            ].map(item => (
              <div key={item.label} className="rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency */}
        <section className="mb-8 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <Phone className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Alarmnummer:</span>
          <span className="text-sm font-bold text-foreground">{data.emergency}</span>
        </section>

        {/* Driving tips */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Car className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Rijtips</h2>
          </div>
          <ul className="space-y-2 rounded-lg border border-border bg-card p-4">
            {data.drivingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* Wildcamping */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Tent className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Wildcamping regels</h2>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{data.wildcamping.details}</p>
            {data.wildcamping.fine && (
              <p className="mt-2 text-xs text-destructive font-medium">Mogelijke boete: {data.wildcamping.fine}</p>
            )}
          </div>
        </section>

        {/* Camping spots */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Kampeerplekken in {data.name} ({spots.length})
            </h2>
          </div>
          {spots.length > 0 ? (
            <CampingMap spots={spots} favorites={favorites} onToggleFavorite={toggleFavorite} />
          ) : (
            <p className="text-sm text-muted-foreground">Nog geen kampeerplekken beschikbaar voor {data.name}.</p>
          )}
        </section>

        {/* CTA */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
            Plan een daktent trip naar {data.name}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Bereken direct je route, kosten en weer voor {data.name}.
          </p>
          <Button asChild>
            <Link to={`/planner?dest=${upperCode}`}>
              Plan trip naar {data.name} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CountryDetail;

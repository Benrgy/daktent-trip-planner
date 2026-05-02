import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { countryData } from "@/data/countryData";
import { campingSpots } from "@/data/campingSpots";
import { usePageSEO } from "@/hooks/usePageSEO";
import { MapPin, Tent, Shield } from "lucide-react";
import RevealOnScroll from "@/components/cinematic/RevealOnScroll";
import TiltCard from "@/components/cinematic/TiltCard";

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
  legal: "Legaal",
  tolerated: "Gedoogd",
  illegal: "Verboden",
};

const Countries = () => {
  usePageSEO({
    title: "Landen — Daktent kamperen in Europa | DaktentTripPlanner",
    description: "Bekijk wildcamping regels, snelheidslimieten en kampeerplekken voor 14 Europese landen. Plan je daktent roadtrip met landspecifieke informatie.",
  });

  const countries = Object.entries(countryData);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Landen voor daktent kamperen</h1>
        <p className="mb-8 text-muted-foreground">
          Ontdek wildcamping regels, snelheidslimieten en kampeerplekken per land. Klik op een land voor alle details.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map(([code, data], i) => {
            const spotCount = campingSpots.filter(s => s.countryCode === code).length;
            return (
              <RevealOnScroll key={code} delay={i * 60}>
                <TiltCard max={5} className="rounded-lg h-full">
                  <Link
                    to={`/landen/${code.toLowerCase()}`}
                    className="group block h-full rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-3xl">{countryFlags[code] || "🏳️"}</span>
                      <div>
                        <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {data.name}
                        </h2>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[data.wildcamping.status]}`}>
                          Wildcamping: {statusLabels[data.wildcamping.status]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {spotCount} plekken
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Max {data.speedLimits.highway} km/u
                      </span>
                      <span className="flex items-center gap-1">
                        <Tent className="h-3 w-3" /> Nood: {data.emergency}
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </RevealOnScroll>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Countries;

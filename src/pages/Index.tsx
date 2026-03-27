import { useState, useRef } from "react";
import Hero from "@/components/Hero";
import TripWizard, { TripConfig } from "@/components/TripWizard";
import CampingMap from "@/components/CampingMap";
import SpotFilters from "@/components/SpotFilters";
import CostCalculator from "@/components/CostCalculator";
import WeatherDashboard from "@/components/WeatherDashboard";
import PackingChecklist from "@/components/PackingChecklist";
import { AffiliateTopBanner, AffiliateCTA } from "@/components/AffiliateBanner";
import { campingSpots } from "@/data/campingSpots";
import { MapPin } from "lucide-react";

const Index = () => {
  const [tripConfig, setTripConfig] = useState<TripConfig | null>(null);
  const [filter, setFilter] = useState("all");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (config: TripConfig) => {
    setTripConfig(config);
    // Filter by destination
    setFilter(config.destination || "all");
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleStart = () => {
    document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredSpots = campingSpots.filter(s => {
    if (filter === "all") return true;
    if (filter === "free") return s.type === "free";
    if (filter === "paid") return s.type === "paid";
    return s.countryCode === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      <AffiliateTopBanner />
      <Hero onStart={handleStart} />
      <TripWizard onGenerate={handleGenerate} />

      {/* Results */}
      <div ref={resultsRef}>
        {tripConfig && (
          <>
            {/* Map section */}
            <section className="bg-muted/50 py-16 px-4">
              <div className="container mx-auto max-w-5xl">
                <h2 className="mb-2 flex items-center justify-center gap-2 text-3xl font-bold">
                  <MapPin className="h-7 w-7 text-primary" /> Kampeerplekken
                </h2>
                <p className="mb-6 text-center text-muted-foreground">
                  {filteredSpots.length} spots gevonden — klik op een marker voor details
                </p>
                <div className="mb-6 flex justify-center">
                  <SpotFilters filter={filter} onFilterChange={setFilter} />
                </div>
                <CampingMap spots={filteredSpots} />
              </div>
            </section>

            <CostCalculator config={tripConfig} spots={filteredSpots} />
            <WeatherDashboard config={tripConfig} />
            <PackingChecklist />
            <AffiliateCTA />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4 text-center text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">DaktentTrip.nl</p>
        <p className="mt-1">© 2026 — Plan je perfecte daktent avontuur</p>
        <p className="mt-2 text-xs">Wildcamping data is indicatief. Controleer altijd lokale regelgeving.</p>
      </footer>
    </div>
  );
};

export default Index;

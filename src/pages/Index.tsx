import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TripWizard, { TripConfig } from "@/components/TripWizard";
import CampingMap from "@/components/CampingMap";
import SpotFilters from "@/components/SpotFilters";
import CostCalculator from "@/components/CostCalculator";
import WeatherDashboard from "@/components/WeatherDashboard";
import PackingChecklist from "@/components/PackingChecklist";
import { AffiliateTopBanner, AffiliateCTA } from "@/components/AffiliateBanner";
import { campingSpots } from "@/data/campingSpots";

const Index = () => {
  const [tripConfig, setTripConfig] = useState<TripConfig | null>(null);
  const [filter, setFilter] = useState("all");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (config: TripConfig) => {
    setTripConfig(config);
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
      <Navbar />
      <Hero onStart={handleStart} />
      <TripWizard onGenerate={handleGenerate} />

      {/* Results */}
      <div ref={resultsRef}>
        {tripConfig && (
          <>
            {/* Map section */}
            <section id="spots" className="border-b border-border bg-muted/30 py-16 px-4">
              <div className="container mx-auto max-w-3xl">
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 2</div>
                <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Kampeerplekken</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  {filteredSpots.length} locaties gevonden — klik op een marker voor details.
                </p>
                <div className="mb-4">
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
      <footer className="border-t border-border bg-card py-8 px-4 text-center">
        <p className="font-display text-sm font-semibold text-foreground">DaktentTripplanner.nl</p>
        <p className="mt-1 text-xs text-muted-foreground">© 2026 — Plan je perfecte daktent avontuur</p>
        <p className="mt-2 text-[11px] text-muted-foreground">Wildcamping data is indicatief. Controleer altijd lokale regelgeving.</p>
      </footer>
    </div>
  );
};

export default Index;

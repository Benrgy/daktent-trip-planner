import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TripWizard, { TripConfig } from "@/components/TripWizard";
import CampingMap from "@/components/CampingMap";
import SpotFilters from "@/components/SpotFilters";
import CostCalculator from "@/components/CostCalculator";
import WeatherDashboard from "@/components/WeatherDashboard";
import PackingChecklist from "@/components/PackingChecklist";
import RouteInfo from "@/components/RouteInfo";
import CountryInfo from "@/components/CountryInfo";
import TripSummary from "@/components/TripSummary";
import { AffiliateTopBanner, AffiliateCTA } from "@/components/AffiliateBanner";
import { campingSpots, CampingSpot } from "@/data/campingSpots";
import { fetchOsmCampingSites } from "@/services/overpass";
import { RouteResult } from "@/services/routing";
import { useFavorites } from "@/hooks/useFavorites";
import { saveTripToStorage, loadTripFromStorage, decodeTripFromUrl } from "@/hooks/useSavedTrip";

const Index = () => {
  const [tripConfig, setTripConfig] = useState<TripConfig | null>(null);
  const [filter, setFilter] = useState("all");
  const resultsRef = useRef<HTMLDivElement>(null);
  const [osmSpots, setOsmSpots] = useState<CampingSpot[]>([]);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Load trip from URL or localStorage on mount
  useEffect(() => {
    const urlTrip = decodeTripFromUrl();
    if (urlTrip) {
      setTripConfig(urlTrip);
      setFilter(urlTrip.destination || "all");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
      return;
    }
    // Don't auto-load from localStorage — just keep it for next visit
  }, []);

  const handleGenerate = (config: TripConfig) => {
    setTripConfig(config);
    setFilter(config.destination || "all");
    saveTripToStorage(config);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleStart = () => {
    document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!tripConfig?.destination) return;
    const existingIds = new Set(campingSpots.map(s => s.id));
    fetchOsmCampingSites(tripConfig.destination, existingIds).then(setOsmSpots);
  }, [tripConfig?.destination]);

  const allSpots = [...campingSpots, ...osmSpots];

  const filteredSpots = allSpots.filter(s => {
    if (filter === "all") return true;
    if (filter === "free") return s.type === "free";
    if (filter === "paid") return s.type === "paid";
    if (filter === "favorites") return favorites.has(s.id);
    return s.countryCode === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      <AffiliateTopBanner />
      <Navbar />
      <Hero onStart={handleStart} />
      <TripWizard onGenerate={handleGenerate} />

      <div ref={resultsRef}>
        {tripConfig && (
          <>
            {/* Trip summary bar */}
            <section className="border-b border-border py-4 px-4 print:hidden">
              <div className="container mx-auto max-w-3xl">
                <TripSummary config={tripConfig} routeResult={routeResult} />
              </div>
            </section>

            {/* Route info */}
            <section className="border-b border-border py-8 px-4">
              <div className="container mx-auto max-w-3xl">
                <RouteInfo config={tripConfig} onRouteCalculated={setRouteResult} />
              </div>
            </section>

            {/* Country info */}
            <section className="border-b border-border py-8 px-4">
              <div className="container mx-auto max-w-3xl">
                <CountryInfo countryCode={tripConfig.destination} />
              </div>
            </section>

            {/* Map section */}
            <section id="spots" className="border-b border-border bg-muted/30 py-16 px-4">
              <div className="container mx-auto max-w-3xl">
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 2</div>
                <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Kampeerplekken</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  {filteredSpots.length} locaties gevonden{osmSpots.length > 0 ? ` (waarvan ${osmSpots.filter(s => filter === "all" || s.countryCode === filter || (filter === "free" && s.type === "free") || (filter === "paid" && s.type === "paid")).length} via OpenStreetMap)` : ""} — klik op een marker voor details.
                </p>
                <div className="mb-4">
                  <SpotFilters filter={filter} onFilterChange={setFilter} />
                </div>
                <CampingMap
                  spots={filteredSpots}
                  routeGeometry={routeResult?.geometry}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            </section>

            <CostCalculator config={tripConfig} spots={filteredSpots} realDistanceKm={routeResult?.distanceKm} />
            <WeatherDashboard config={tripConfig} />
            <PackingChecklist destination={tripConfig.destination} />
            <AffiliateCTA />
          </>
        )}
      </div>

      {/* FAQ Section */}
      <section id="faq" className="border-t border-border bg-muted/20 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-8 font-display text-2xl font-bold text-foreground">Veelgestelde vragen</h2>
          <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            <details className="group rounded-lg border border-border bg-card p-4" itemScope itemProp="mainEntity" itemType="https://schema.org/Question" open>
              <summary className="cursor-pointer font-display text-sm font-semibold text-foreground group-open:mb-2" itemProp="name">Wat is DaktentTripPlanner?</summary>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-sm leading-relaxed text-muted-foreground" itemProp="text">DaktentTripPlanner is een gratis online tool waarmee je in 3 minuten een complete daktent roadtrip plant. Je krijgt kampeerplekken op een interactieve kaart, een kostenberekening, weersverwachting en een slimme inpakchecklist — alles in één overzicht.</p>
              </div>
            </details>
            <details className="group rounded-lg border border-border bg-card p-4" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="cursor-pointer font-display text-sm font-semibold text-foreground group-open:mb-2" itemProp="name">Is DaktentTripPlanner gratis te gebruiken?</summary>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-sm leading-relaxed text-muted-foreground" itemProp="text">Ja, DaktentTripPlanner is 100% gratis. Je hebt geen account nodig — vul gewoon je trip details in en ontvang direct een compleet reisplan.</p>
              </div>
            </details>
            <details className="group rounded-lg border border-border bg-card p-4" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="cursor-pointer font-display text-sm font-semibold text-foreground group-open:mb-2" itemProp="name">Welke landen en kampeerplekken worden ondersteund?</summary>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-sm leading-relaxed text-muted-foreground" itemProp="text">We hebben 45+ kampeerplekken in Nederland, België, Duitsland, Frankrijk, Spanje, Italië, Portugal, Oostenrijk, Zwitserland, Kroatië, Slovenië, Noorwegen, Zweden, Engeland en Griekenland. Elke locatie bevat info over wildcamping regelgeving, voorzieningen en kosten.</p>
              </div>
            </details>
            <details className="group rounded-lg border border-border bg-card p-4" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="cursor-pointer font-display text-sm font-semibold text-foreground group-open:mb-2" itemProp="name">Hoe plan ik een daktent roadtrip?</summary>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-sm leading-relaxed text-muted-foreground" itemProp="text">Vul je vertrekplaats, bestemming, reisduur en aantal personen in. Klik op 'Genereer route' en je krijgt direct een overzicht met kampeerplekken op de kaart, een kostenoverzicht, weersverwachting en inpakchecklist.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8 px-4 text-center">
        <p className="font-display text-sm font-semibold text-foreground">DaktentTripplanner.nl</p>
        <p className="mt-1 text-xs text-muted-foreground">© 2026 — Plan je perfecte daktent avontuur</p>
        <p className="mt-2 text-[11px] text-muted-foreground">Wildcamping data is indicatief. Controleer altijd lokale regelgeving.</p>
        <nav className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground" aria-label="Footer navigatie">
          <a href="#wizard" className="hover:text-foreground">Route planner</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
      </footer>
    </div>
  );
};

export default Index;

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
import { saveTripToStorage, decodeTripFromUrl } from "@/hooks/useSavedTrip";
import { usePageSEO } from "@/hooks/usePageSEO";

const Planner = () => {
  usePageSEO({
    title: "Route planner — Plan je daktent roadtrip | DaktentTripPlanner",
    description: "Plan je daktent roadtrip: kies bestemming, bereken kosten, bekijk kampeerplekken op de kaart en check het weer. Alles in één overzicht.",
  });

  const [searchParams] = useSearchParams();
  const preselectedDest = searchParams.get("dest")?.toUpperCase();

  const [tripConfig, setTripConfig] = useState<TripConfig | null>(null);
  const [filter, setFilter] = useState("all");
  const resultsRef = useRef<HTMLDivElement>(null);
  const [osmSpots, setOsmSpots] = useState<CampingSpot[]>([]);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const urlTrip = decodeTripFromUrl();
    if (urlTrip) {
      if (!urlTrip.destinations) urlTrip.destinations = urlTrip.destination ? [urlTrip.destination] : [];
      setTripConfig(urlTrip);
      setFilter(urlTrip.destinations[0] || "all");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, []);

  const handleGenerate = (config: TripConfig) => {
    setTripConfig(config);
    setFilter(config.destinations?.[0] || config.destination || "all");
    saveTripToStorage(config);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const destinations = tripConfig?.destinations?.length ? tripConfig.destinations : (tripConfig?.destination ? [tripConfig.destination] : []);

  useEffect(() => {
    if (destinations.length === 0) return;
    const existingIds = new Set(campingSpots.map(s => s.id));
    Promise.all(destinations.map(d => fetchOsmCampingSites(d, existingIds)))
      .then(results => setOsmSpots(results.flat()));
  }, [destinations.join(",")]);

  const allSpots = [...campingSpots, ...osmSpots];
  const filteredSpots = allSpots.filter(s => {
    if (filter === "all") return destinations.length === 0 || destinations.includes(s.countryCode);
    if (filter === "free") return s.type === "free";
    if (filter === "paid") return s.type === "paid";
    if (filter === "favorites") return favorites.has(s.id);
    return s.countryCode === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      <AffiliateTopBanner />
      <Navbar />
      <TripWizard onGenerate={handleGenerate} preselectedDestination={preselectedDest} />

      <div ref={resultsRef}>
        {tripConfig && (
          <>
            <section className="border-b border-border py-4 px-4 print:hidden">
              <div className="container mx-auto max-w-3xl">
                <TripSummary config={tripConfig} routeResult={routeResult} spots={filteredSpots} />
              </div>
            </section>

            <section className="border-b border-border py-8 px-4">
              <div className="container mx-auto max-w-3xl">
                <RouteInfo config={tripConfig} onRouteCalculated={setRouteResult} />
              </div>
            </section>

            <section className="border-b border-border py-8 px-4">
              <div className="container mx-auto max-w-3xl space-y-3">
                {destinations.map(dest => (
                  <CountryInfo key={dest} countryCode={dest} />
                ))}
              </div>
            </section>

            <section id="spots" className="border-b border-border bg-muted/30 py-16 px-4">
              <div className="container mx-auto max-w-3xl">
                <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Kampeerplekken</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  {filteredSpots.length} locaties gevonden — klik op een marker voor details.
                </p>
                <div className="mb-4">
                  <SpotFilters filter={filter} onFilterChange={setFilter} />
                </div>
                <CampingMap spots={filteredSpots} routeGeometry={routeResult?.geometry} favorites={favorites} onToggleFavorite={toggleFavorite} />
              </div>
            </section>

            <CostCalculator config={tripConfig} spots={filteredSpots} realDistanceKm={routeResult?.distanceKm} />
            <WeatherDashboard config={tripConfig} />
            <PackingChecklist destination={tripConfig.destination} destinations={tripConfig.destinations} />
            <AffiliateCTA />
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;

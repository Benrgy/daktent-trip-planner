import { useEffect, useState } from "react";
import { TripConfig } from "./TripWizard";
import { geocode } from "@/services/geocoding";
import { getRoute, formatDuration, RouteResult } from "@/services/routing";
import { calculateEnergyCost, isElectric } from "@/services/energyCost";
import { campingSpots } from "@/data/campingSpots";
import { Car, Clock, MapPin, Loader2, Zap } from "lucide-react";

interface Props {
  config: TripConfig;
  onRouteCalculated?: (route: RouteResult | null) => void;
}

const RouteInfo = ({ config, onRouteCalculated }: Props) => {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.startLocation || !config.destination) return;

    const calc = async () => {
      setLoading(true);
      setError(null);

      const startCoords = await geocode(config.startLocation);
      if (!startCoords) {
        setError("Startlocatie niet gevonden.");
        setLoading(false);
        onRouteCalculated?.(null);
        return;
      }

      // Find first camping spot in destination as endpoint
      const spot = campingSpots.find(s => s.countryCode === config.destination);
      if (!spot) {
        setError("Geen kampeerplekken voor deze bestemming.");
        setLoading(false);
        onRouteCalculated?.(null);
        return;
      }

      const result = await getRoute(startCoords, [spot.lat, spot.lng]);
      if (!result) {
        setError("Route kon niet berekend worden.");
        setLoading(false);
        onRouteCalculated?.(null);
        return;
      }

      setRoute(result);
      onRouteCalculated?.(result);
      setLoading(false);
    };

    calc();
  }, [config.startLocation, config.destination]);

  if (!config.startLocation || !config.destination) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
        <Car className="h-4 w-4 text-primary" /> Route-informatie
        <span className="text-[10px] font-normal text-muted-foreground ml-auto">via OSRM</span>
      </h3>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Route berekenen…
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && route && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <MapPin className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-lg font-bold text-foreground">{route.distanceKm} km</p>
            <p className="text-[11px] text-muted-foreground">Afstand</p>
          </div>
          <div>
            <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-lg font-bold text-foreground">{formatDuration(route.durationMinutes)}</p>
            <p className="text-[11px] text-muted-foreground">Rijtijd</p>
          </div>
          <div>
            {isElectric(config.carType) ? (
              <Zap className="mx-auto mb-1 h-4 w-4 text-primary" />
            ) : (
              <Car className="mx-auto mb-1 h-4 w-4 text-primary" />
            )}
            <p className="text-lg font-bold text-foreground">€{calculateEnergyCost(route.distanceKm, config.carType, config.fuelType, config.destination).cost}</p>
            <p className="text-[11px] text-muted-foreground">{isElectric(config.carType) ? "Opladen" : "Brandstof"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteInfo;

import { useEffect, useState } from "react";
import { TripConfig } from "./TripWizard";
import { geocode } from "@/services/geocoding";
import { getRoute, formatDuration, RouteResult } from "@/services/routing";
import { calculateEnergyCost, isElectric, isPhev, hasElectricMotor, getElectricConsumptionRate } from "@/services/energyCost";
import { campingSpots } from "@/data/campingSpots";
import { Car, Clock, MapPin, Loader2, Zap, BatteryCharging, Bike, ArrowLeftRight, Coffee, Navigation } from "lucide-react";

const CHARGE_TIME_MIN = 30;

function getEvRange(batteryKwh: number, carType: string): number {
  const consumption = getElectricConsumptionRate(carType);
  return Math.round((batteryKwh / consumption) * 100 * 0.85);
}

function getArrivalTime(departureTime: string, durationMinutes: number): string {
  const [h, m] = departureTime.split(":").map(Number);
  const totalMin = h * 60 + m + durationMinutes;
  const arrH = Math.floor(totalMin / 60) % 24;
  const arrM = totalMin % 60;
  const nextDay = totalMin >= 24 * 60;
  return `${String(arrH).padStart(2, "0")}:${String(arrM).padStart(2, "0")}${nextDay ? " (+1 dag)" : ""}`;
}

const destLabels: Record<string, string> = {
  NL: "Nederland", BE: "België", DE: "Duitsland", FR: "Frankrijk",
  SC: "Scandinavië", GB: "Engeland", ES: "Spanje", IT: "Italië",
  PT: "Portugal", AT: "Oostenrijk", CH: "Zwitserland", HR: "Kroatië",
  SI: "Slovenië", GR: "Griekenland",
};

interface Props {
  config: TripConfig;
  onRouteCalculated?: (route: RouteResult | null) => void;
}

const RouteInfo = ({ config, onRouteCalculated }: Props) => {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destinations = config.destinations?.length > 0 ? config.destinations : (config.destination ? [config.destination] : []);
  const multiplier = config.includeReturnTrip ? 2 : 1;
  const isMultiStop = destinations.length > 1;

  useEffect(() => {
    if (!config.startLocation || destinations.length === 0) return;

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

      // Get coordinates for each destination
      const destCoords: [number, number][] = [];
      for (const dest of destinations) {
        const spot = campingSpots.find(s => s.countryCode === dest);
        if (spot) {
          destCoords.push([spot.lat, spot.lng]);
        }
      }

      if (destCoords.length === 0) {
        setError("Geen kampeerplekken gevonden voor de gekozen bestemmingen.");
        setLoading(false);
        onRouteCalculated?.(null);
        return;
      }

      // Final destination is the last one, intermediates are waypoints
      const finalDest = destCoords[destCoords.length - 1];
      const waypoints = destCoords.slice(0, -1);

      const result = await getRoute(startCoords, finalDest, waypoints.length > 0 ? waypoints : undefined);
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
  }, [config.startLocation, destinations.join(",")]);

  if (!config.startLocation || destinations.length === 0) return null;

  const electric = isElectric(config.carType);
  const phev = isPhev(config.carType);
  const hasEv = hasElectricMotor(config.carType);
  const isMoto = config.carType === "motorcycle";
  const VehicleIcon = isMoto ? Bike : Car;
  const primaryDest = destinations[0];

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
        <VehicleIcon className="h-4 w-4 text-primary" /> Route-informatie
        {isMultiStop && (
          <span className="flex items-center gap-1 text-[10px] font-normal text-primary">
            <Navigation className="h-3 w-3" /> {destinations.length} stops
          </span>
        )}
        {config.includeReturnTrip && (
          <span className="flex items-center gap-1 text-[10px] font-normal text-primary">
            <ArrowLeftRight className="h-3 w-3" /> Retour
          </span>
        )}
        <span className="text-[10px] font-normal text-muted-foreground ml-auto">via OSRM</span>
      </h3>

      {/* Multi-stop route overview */}
      {isMultiStop && (
        <div className="mb-3 rounded-md bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground flex-wrap">
            <span className="font-medium text-foreground">{config.startLocation}</span>
            {destinations.map((dest, i) => (
              <span key={dest} className="flex items-center gap-1">
                <span className="text-primary">→</span>
                <span className={i === destinations.length - 1 ? "font-medium text-foreground" : ""}>
                  {destLabels[dest] || dest}
                </span>
              </span>
            ))}
            {config.includeReturnTrip && (
              <>
                <span className="text-primary">→</span>
                <span className="font-medium text-foreground">{config.startLocation}</span>
              </>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Route berekenen…
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && route && (() => {
        const displayKm = route.distanceKm * multiplier;
        const displayMin = route.durationMinutes * multiplier;
        const restStops = Math.max(0, Math.floor(displayMin / 120) - 1);
        const totalMinWithRest = displayMin + restStops * 15;

        return (
          <>
            <div className={`grid gap-3 text-center ${hasEv ? "grid-cols-4" : "grid-cols-3"}`}>
              <div>
                <MapPin className="mx-auto mb-1 h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-foreground">{displayKm} km</p>
                <p className="text-[11px] text-muted-foreground">{config.includeReturnTrip ? "Retour" : "Totaal"}</p>
              </div>
              <div>
                <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-foreground">{formatDuration(displayMin)}</p>
                <p className="text-[11px] text-muted-foreground">Rijtijd</p>
              </div>
              <div>
                {hasEv ? (
                  <Zap className="mx-auto mb-1 h-4 w-4 text-primary" />
                ) : (
                  <VehicleIcon className="mx-auto mb-1 h-4 w-4 text-primary" />
                )}
                <p className="text-lg font-bold text-foreground">€{calculateEnergyCost(displayKm, config.carType, config.fuelType, primaryDest, config.customConsumption).cost}</p>
                <p className="text-[11px] text-muted-foreground">{electric ? "Opladen" : phev ? "Brandstof+Stroom" : "Brandstof"}</p>
              </div>
              {hasEv && (() => {
                const evRange = getEvRange(config.batteryKwh, config.carType);
                const stops = Math.max(0, Math.ceil(displayKm / evRange) - 1);
                return (
                  <div>
                    <BatteryCharging className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <p className="text-lg font-bold text-foreground">{stops}×</p>
                    <p className="text-[11px] text-muted-foreground">Laadstops</p>
                  </div>
                );
              })()}
            </div>

            {/* Per-leg breakdown for multi-stop */}
            {isMultiStop && route.legs && route.legs.length > 0 && (
              <div className="mt-3 space-y-1">
                {route.legs.map((leg, i) => {
                  const fromLabel = i === 0 ? config.startLocation : (destLabels[destinations[i - 1]] || destinations[i - 1]);
                  const toLabel = destLabels[destinations[i]] || destinations[i] || "Bestemming";
                  return (
                    <div key={i} className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-1.5 text-[11px]">
                      <span className="text-muted-foreground">
                        <span className="font-medium text-foreground">{fromLabel}</span>
                        {" → "}
                        <span className="font-medium text-foreground">{toLabel}</span>
                      </span>
                      <span className="text-muted-foreground">
                        {leg.distanceKm} km · {formatDuration(leg.durationMinutes)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Arrival time */}
            {config.departureTime && (
              <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">🕐 Vertrek {config.departureTime}</span>
                {" → "}Geschatte aankomst: <span className="font-semibold text-foreground">
                  {getArrivalTime(config.departureTime, totalMinWithRest + (hasEv ? (() => {
                    const evRange = getEvRange(config.batteryKwh, config.carType);
                    return Math.max(0, Math.ceil(displayKm / evRange) - 1) * CHARGE_TIME_MIN;
                  })() : 0))}
                </span>
                {restStops > 0 && ` (incl. ${restStops} rustpauze${restStops > 1 ? "s" : ""} van 15 min)`}
              </div>
            )}

            {/* Rest stops suggestion */}
            {displayMin > 360 && (
              <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground flex items-start gap-1.5">
                <Coffee className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>
                  <span className="font-medium text-foreground">Lange rit ({formatDuration(displayMin)}):</span>
                  {" "}Neem elke 2 uur een pauze van 15 minuten. Plan {restStops} rustpauze{restStops > 1 ? "s" : ""} in.
                </span>
              </div>
            )}

            {hasEv && (() => {
              const evRange = getEvRange(config.batteryKwh, config.carType);
              const stops = Math.max(0, Math.ceil(displayKm / evRange) - 1);
              if (displayKm <= evRange) return null;
              return (
                <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">⚡ {phev ? "PHEV" : "EV"} Info:</span>{" "}
                  Geschat bereik ~{evRange} km (accu {config.batteryKwh} kWh, 85% bruikbaar).
                  {" "}{stops} laadstop(s) van ~{CHARGE_TIME_MIN} min (DC snellader),
                  totaal ~{formatDuration(displayMin + stops * CHARGE_TIME_MIN)} incl. laden.
                </div>
              );
            })()}
          </>
        );
      })()}
    </div>
  );
};

export default RouteInfo;

import { useEffect, useState } from "react";
import { TripConfig } from "./TripWizard";
import { geocode } from "@/services/geocoding";
import { getRoute, formatDuration, RouteResult } from "@/services/routing";
import { calculateEnergyCost, isElectric, isPhev, hasElectricMotor, getElectricConsumptionRate } from "@/services/energyCost";
import { campingSpots } from "@/data/campingSpots";
import { Car, Clock, MapPin, Loader2, Zap, BatteryCharging, Bike, ArrowLeftRight, Coffee } from "lucide-react";

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

interface Props {
  config: TripConfig;
  onRouteCalculated?: (route: RouteResult | null) => void;
}

const RouteInfo = ({ config, onRouteCalculated }: Props) => {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const multiplier = config.includeReturnTrip ? 2 : 1;

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

  const electric = isElectric(config.carType);
  const phev = isPhev(config.carType);
  const hasEv = hasElectricMotor(config.carType);
  const isMoto = config.carType === "motorcycle";
  const VehicleIcon = isMoto ? Bike : Car;

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
        <VehicleIcon className="h-4 w-4 text-primary" /> Route-informatie
        {config.includeReturnTrip && (
          <span className="flex items-center gap-1 text-[10px] font-normal text-primary">
            <ArrowLeftRight className="h-3 w-3" /> Retour
          </span>
        )}
        <span className="text-[10px] font-normal text-muted-foreground ml-auto">via OSRM</span>
      </h3>

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
                <p className="text-[11px] text-muted-foreground">{config.includeReturnTrip ? "Retour" : "Afstand"}</p>
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
                <p className="text-lg font-bold text-foreground">€{calculateEnergyCost(displayKm, config.carType, config.fuelType, config.destination, config.customConsumption).cost}</p>
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

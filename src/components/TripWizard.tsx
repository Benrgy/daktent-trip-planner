import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, X, Plus } from "lucide-react";
import { getValidFuelTypes, getConsumptionRate, getElectricConsumptionRate, hasElectricMotor, isElectric } from "@/services/energyCost";

export interface TripConfig {
  startLocation: string;
  /** @deprecated Use destinations instead */
  destination: string;
  destinations: string[];
  days: number;
  budget: number;
  carType: string;
  fuelType: "benzine" | "diesel" | "lpg";
  batteryKwh: number;
  people: number;
  preferences: string[];
  customConsumption: number | null;
  customFuelPrice: number | null;
  customElectricityPrice: number | null;
  customCampingPrice: number | null;
  customFoodBudget: number | null;
  includeReturnTrip: boolean;
  departureTime: string;
}

interface TripWizardProps {
  onGenerate: (config: TripConfig) => void;
}

const preferenceOptions = [
  { id: "natuur", label: "Natuur" },
  { id: "bergen", label: "Bergen" },
  { id: "kust", label: "Kust" },
  { id: "steden", label: "Steden" },
  { id: "offgrid", label: "Off-grid" },
];

const carTypes = [
  { value: "small", label: "Klein (stadsauto)" },
  { value: "medium", label: "Middel (sedan)" },
  { value: "suv", label: "SUV" },
  { value: "4x4", label: "4x4 / Camper" },
  { value: "hybrid", label: "Hybride (HEV)" },
  { value: "phev", label: "Plug-in hybride" },
  { value: "electric", label: "Elektrisch" },
  { value: "motorcycle", label: "Motorfiets" },
];

const fuelLabels: Record<string, string> = {
  benzine: "Benzine",
  diesel: "Diesel",
  lpg: "LPG",
};

const allDestinations = [
  { value: "NL", label: "Nederland" },
  { value: "BE", label: "België" },
  { value: "DE", label: "Duitsland" },
  { value: "FR", label: "Frankrijk" },
  { value: "SC", label: "Scandinavië" },
  { value: "GB", label: "Engeland (UK)" },
  { value: "ES", label: "Spanje" },
  { value: "IT", label: "Italië" },
  { value: "PT", label: "Portugal" },
  { value: "AT", label: "Oostenrijk" },
  { value: "CH", label: "Zwitserland" },
  { value: "HR", label: "Kroatië" },
  { value: "SI", label: "Slovenië" },
  { value: "GR", label: "Griekenland" },
];

const destLabels: Record<string, string> = Object.fromEntries(allDestinations.map(d => [d.value, d.label]));

const TripWizard = ({ onGenerate }: TripWizardProps) => {
  const [config, setConfig] = useState<TripConfig>({
    startLocation: "",
    destination: "",
    destinations: [],
    days: 5,
    budget: 100,
    carType: "suv",
    fuelType: "benzine",
    batteryKwh: 60,
    people: 2,
    preferences: ["natuur"],
    customConsumption: null,
    customFuelPrice: null,
    customElectricityPrice: null,
    customCampingPrice: null,
    customFoodBudget: null,
    includeReturnTrip: false,
    departureTime: "08:00",
  });

  const addDestination = (code: string) => {
    if (!code || config.destinations.includes(code)) return;
    setConfig(prev => ({
      ...prev,
      destinations: [...prev.destinations, code],
      destination: prev.destinations.length === 0 ? code : prev.destination,
    }));
  };

  const removeDestination = (code: string) => {
    setConfig(prev => {
      const next = prev.destinations.filter(d => d !== code);
      return {
        ...prev,
        destinations: next,
        destination: next[0] ?? "",
      };
    });
  };

  const togglePref = (id: string) => {
    setConfig(prev => ({
      ...prev,
      preferences: prev.preferences.includes(id)
        ? prev.preferences.filter(p => p !== id)
        : [...prev.preferences, id],
    }));
  };

  const handleCarTypeChange = (v: string) => {
    const validFuels = getValidFuelTypes(v);
    setConfig(prev => ({
      ...prev,
      carType: v,
      fuelType: validFuels.includes(prev.fuelType) ? prev.fuelType : (validFuels[0] as "benzine" | "diesel" | "lpg") ?? "benzine",
      batteryKwh: v === "phev" ? 13 : v === "electric" ? prev.batteryKwh : 60,
    }));
  };

  const validFuels = getValidFuelTypes(config.carType);
  const showFuelSelect = validFuels.length > 0;
  const showBatterySlider = hasElectricMotor(config.carType);
  const availableDestinations = allDestinations.filter(d => !config.destinations.includes(d.value));

  const getConsumptionLabel = () => {
    if (isElectric(config.carType)) {
      return `${getElectricConsumptionRate(config.carType)} kWh/100km`;
    }
    if (config.carType === "phev") {
      return `${getConsumptionRate(config.carType, config.fuelType)}L + ${getElectricConsumptionRate(config.carType)}kWh /100km`;
    }
    return `${getConsumptionRate(config.carType, config.fuelType)} L/100km`;
  };

  const handleGenerate = () => {
    const finalConfig = {
      ...config,
      destination: config.destinations[0] || config.destination,
    };
    onGenerate(finalConfig);
  };

  return (
    <section id="wizard" className="border-b border-border py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 1</div>
        <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Configureer je trip</h2>
        <p className="mb-8 text-sm text-muted-foreground">Vul onderstaande gegevens in om een route samen te stellen.</p>

        <div className="space-y-6">
          {/* Start location */}
          <div>
            <Label className="mb-1.5 text-sm font-medium">Startlocatie</Label>
            <Input
              placeholder="bijv. Amsterdam"
              value={config.startLocation}
              onChange={e => setConfig(prev => ({ ...prev, startLocation: e.target.value }))}
            />
          </div>

          {/* Multi-destination */}
          <div>
            <Label className="mb-1.5 text-sm font-medium">
              Bestemmingen
              {config.destinations.length > 1 && (
                <span className="ml-2 text-[11px] font-normal text-primary">
                  Multi-stop route ({config.destinations.length} stops)
                </span>
              )}
            </Label>

            {/* Selected destinations as chips */}
            {config.destinations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {config.destinations.map((code, i) => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-xs font-medium text-primary"
                  >
                    <span className="text-[10px] text-muted-foreground mr-0.5">{i + 1}.</span>
                    {destLabels[code] || code}
                    <button
                      type="button"
                      onClick={() => removeDestination(code)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-primary/10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add destination dropdown */}
            {availableDestinations.length > 0 && (
              <Select value="" onValueChange={addDestination}>
                <SelectTrigger>
                  <SelectValue placeholder={config.destinations.length === 0 ? "Kies bestemming" : "Voeg stop toe..."} />
                </SelectTrigger>
                <SelectContent>
                  {availableDestinations.map(d => (
                    <SelectItem key={d.value} value={d.value}>
                      <span className="flex items-center gap-1.5">
                        <Plus className="h-3 w-3 text-muted-foreground" />
                        {d.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {config.destinations.length > 1 && (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Route: {config.startLocation || "Start"} → {config.destinations.map(c => destLabels[c]).join(" → ")}
                {config.includeReturnTrip ? ` → ${config.startLocation || "Start"}` : ""}
              </p>
            )}
          </div>

          {/* Days & Budget */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 text-sm font-medium">
                Aantal dagen: <span className="font-semibold text-foreground">{config.days}</span>
              </Label>
              <Slider min={1} max={21} step={1} value={[config.days]} onValueChange={([v]) => setConfig(prev => ({ ...prev, days: v }))} />
            </div>
            <div>
              <Label className="mb-2 text-sm font-medium">
                Budget per dag: <span className="font-semibold text-foreground">€{config.budget}</span>
              </Label>
              <Slider min={30} max={200} step={10} value={[config.budget]} onValueChange={([v]) => setConfig(prev => ({ ...prev, budget: v }))} />
            </div>
          </div>

          {/* Car type & consumption info */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="mb-1.5 text-sm font-medium">Type voertuig</Label>
              <Select value={config.carType} onValueChange={handleCarTypeChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {carTypes.map(ct => (
                    <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-1.5 flex items-center gap-2">
                {config.customConsumption === null ? (
                  <>
                    <p className="text-[11px] text-muted-foreground">~{getConsumptionLabel()}</p>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultRate = isElectric(config.carType)
                          ? getElectricConsumptionRate(config.carType)
                          : getConsumptionRate(config.carType, config.fuelType);
                        setConfig(prev => ({ ...prev, customConsumption: defaultRate }));
                      }}
                      className="text-[11px] text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      Aanpassen
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      step={0.1}
                      value={config.customConsumption}
                      onChange={e => {
                        const v = parseFloat(e.target.value);
                        if (!isNaN(v) && v > 0 && v <= 50) {
                          setConfig(prev => ({ ...prev, customConsumption: v }));
                        }
                      }}
                      className="h-7 w-16 px-1.5 text-xs"
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {isElectric(config.carType) || config.carType === "phev" ? "kWh" : "L"}/100km
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, customConsumption: null }))}
                      className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>

            {showBatterySlider ? (
              <div>
                <Label className="mb-2 text-sm font-medium">
                  Accucapaciteit: <span className="font-semibold text-foreground">{config.batteryKwh} kWh</span>
                  <span className="ml-1 text-[11px] text-muted-foreground">
                    (~{Math.round((config.batteryKwh / getElectricConsumptionRate(config.carType)) * 100 * 0.85)} km bereik)
                  </span>
                </Label>
                <Slider
                  min={config.carType === "phev" ? 5 : 30}
                  max={config.carType === "phev" ? 30 : 120}
                  step={config.carType === "phev" ? 1 : 5}
                  value={[config.batteryKwh]}
                  onValueChange={([v]) => setConfig(prev => ({ ...prev, batteryKwh: v }))}
                />
              </div>
            ) : showFuelSelect ? (
              <div>
                <Label className="mb-1.5 text-sm font-medium">Brandstof</Label>
                <Select value={config.fuelType} onValueChange={(v: "benzine" | "diesel" | "lpg") => setConfig(prev => ({ ...prev, fuelType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {validFuels.map(f => (
                      <SelectItem key={f} value={f}>{fuelLabels[f]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div>
              <Label className="mb-1.5 text-sm font-medium">Aantal personen</Label>
              <Select value={String(config.people)} onValueChange={v => setConfig(prev => ({ ...prev, people: Number(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "persoon" : "personen"}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Return trip + departure time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <Checkbox
                  checked={config.includeReturnTrip}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeReturnTrip: checked === true }))}
                />
                Inclusief terugrit (heen + terug)
              </label>
            </div>
            <div>
              <Label className="mb-1.5 text-sm font-medium">Vertrektijd</Label>
              <Input
                type="time"
                value={config.departureTime}
                onChange={e => setConfig(prev => ({ ...prev, departureTime: e.target.value }))}
                className="h-9"
              />
            </div>
          </div>

          {/* Preferences */}
          <div>
            <Label className="mb-2 text-sm font-medium">Voorkeuren</Label>
            <div className="flex flex-wrap gap-2">
              {preferenceOptions.map(p => (
                <label
                  key={p.id}
                  className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    config.preferences.includes(p.id)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Checkbox
                    checked={config.preferences.includes(p.id)}
                    onCheckedChange={() => togglePref(p.id)}
                    className="sr-only"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!config.startLocation || config.destinations.length === 0}
            className="w-full gap-2 py-5 text-sm font-semibold"
          >
            Genereer route <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TripWizard;

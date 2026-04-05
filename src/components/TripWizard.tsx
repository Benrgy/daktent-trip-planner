import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import { getValidFuelTypes, getConsumptionRate, getElectricConsumptionRate, hasElectricMotor, isElectric } from "@/services/energyCost";

export interface TripConfig {
  startLocation: string;
  destination: string;
  days: number;
  budget: number;
  carType: string;
  fuelType: "benzine" | "diesel" | "lpg";
  batteryKwh: number;
  people: number;
  preferences: string[];
  /** User-specified fuel consumption (L/100km or kWh/100km). null = use default */
  customConsumption: number | null;
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

const TripWizard = ({ onGenerate }: TripWizardProps) => {
  const [config, setConfig] = useState<TripConfig>({
    startLocation: "",
    destination: "",
    days: 5,
    budget: 100,
    carType: "suv",
    fuelType: "benzine",
    batteryKwh: 60,
    people: 2,
    preferences: ["natuur"],
    customConsumption: null,
  });

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
      // Reset fuel type if current one is not valid for new car type
      fuelType: validFuels.includes(prev.fuelType) ? prev.fuelType : (validFuels[0] as "benzine" | "diesel" | "lpg") ?? "benzine",
      // Default battery for PHEV
      batteryKwh: v === "phev" ? 13 : v === "electric" ? prev.batteryKwh : 60,
    }));
  };

  const validFuels = getValidFuelTypes(config.carType);
  const showFuelSelect = validFuels.length > 0;
  const showBatterySlider = hasElectricMotor(config.carType);

  // Dynamic consumption display
  const getConsumptionLabel = () => {
    if (isElectric(config.carType)) {
      return `${getElectricConsumptionRate(config.carType)} kWh/100km`;
    }
    if (config.carType === "phev") {
      return `${getConsumptionRate(config.carType, config.fuelType)}L + ${getElectricConsumptionRate(config.carType)}kWh /100km`;
    }
    return `${getConsumptionRate(config.carType, config.fuelType)} L/100km`;
  };

  return (
    <section id="wizard" className="border-b border-border py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stap 1</div>
        <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Configureer je trip</h2>
        <p className="mb-8 text-sm text-muted-foreground">Vul onderstaande gegevens in om een route samen te stellen.</p>

        <div className="space-y-6">
          {/* Start & Destination */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 text-sm font-medium">Startlocatie</Label>
              <Input
                placeholder="bijv. Amsterdam"
                value={config.startLocation}
                onChange={e => setConfig(prev => ({ ...prev, startLocation: e.target.value }))}
              />
            </div>
            <div>
              <Label className="mb-1.5 text-sm font-medium">Bestemming</Label>
              <Select value={config.destination} onValueChange={v => setConfig(prev => ({ ...prev, destination: v }))}>
                <SelectTrigger><SelectValue placeholder="Kies land" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NL">Nederland</SelectItem>
                  <SelectItem value="BE">België</SelectItem>
                  <SelectItem value="DE">Duitsland</SelectItem>
                  <SelectItem value="FR">Frankrijk</SelectItem>
                  <SelectItem value="SC">Scandinavië</SelectItem>
                  <SelectItem value="ES">Spanje</SelectItem>
                  <SelectItem value="IT">Italië</SelectItem>
                  <SelectItem value="PT">Portugal</SelectItem>
                  <SelectItem value="AT">Oostenrijk</SelectItem>
                  <SelectItem value="CH">Zwitserland</SelectItem>
                  <SelectItem value="HR">Kroatië</SelectItem>
                  <SelectItem value="SI">Slovenië</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Days & Budget */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 text-sm font-medium">
                Aantal dagen: <span className="font-semibold text-foreground">{config.days}</span>
              </Label>
              <Slider min={1} max={14} step={1} value={[config.days]} onValueChange={([v]) => setConfig(prev => ({ ...prev, days: v }))} />
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

            {/* Fuel select or battery slider */}
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
            onClick={() => onGenerate(config)}
            disabled={!config.startLocation || !config.destination}
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

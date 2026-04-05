import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";

export interface TripConfig {
  startLocation: string;
  destination: string;
  days: number;
  budget: number;
  carType: string;
  fuelType: "benzine" | "diesel";
  people: number;
  preferences: string[];
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

const TripWizard = ({ onGenerate }: TripWizardProps) => {
  const [config, setConfig] = useState<TripConfig>({
    startLocation: "",
    destination: "",
    days: 5,
    budget: 100,
    carType: "suv",
    fuelType: "benzine",
    people: 2,
    preferences: ["natuur"],
  });

  const togglePref = (id: string) => {
    setConfig(prev => ({
      ...prev,
      preferences: prev.preferences.includes(id)
        ? prev.preferences.filter(p => p !== id)
        : [...prev.preferences, id],
    }));
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

          {/* Car, Fuel & People */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="mb-1.5 text-sm font-medium">Type auto</Label>
              <Select value={config.carType} onValueChange={v => setConfig(prev => ({ ...prev, carType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Klein (6L/100km)</SelectItem>
                  <SelectItem value="medium">Middel (8L/100km)</SelectItem>
                  <SelectItem value="suv">SUV (10L/100km)</SelectItem>
                  <SelectItem value="4x4">4x4 (12L/100km)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 text-sm font-medium">Brandstof</Label>
              <Select value={config.fuelType} onValueChange={(v: "benzine" | "diesel") => setConfig(prev => ({ ...prev, fuelType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="benzine">Benzine</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

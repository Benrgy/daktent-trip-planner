import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Calendar, Euro, Car, ChevronRight } from "lucide-react";

export interface TripConfig {
  startLocation: string;
  destination: string;
  days: number;
  budget: number;
  carType: string;
  people: number;
  preferences: string[];
}

interface TripWizardProps {
  onGenerate: (config: TripConfig) => void;
}

const preferenceOptions = [
  { id: "natuur", label: "🌲 Natuur" },
  { id: "bergen", label: "⛰️ Bergen" },
  { id: "kust", label: "🌊 Kust" },
  { id: "steden", label: "🏙️ Steden" },
  { id: "offgrid", label: "🔌 Off-grid" },
];

const TripWizard = ({ onGenerate }: TripWizardProps) => {
  const [config, setConfig] = useState<TripConfig>({
    startLocation: "",
    destination: "",
    days: 5,
    budget: 100,
    carType: "suv",
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
    <section id="wizard" className="py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-2 text-center text-3xl font-bold text-foreground">Plan Je Route</h2>
        <p className="mb-10 text-center text-muted-foreground">Vul de gegevens in en wij doen de rest</p>

        <div className="space-y-8 rounded-2xl bg-card p-6 shadow-card md:p-10">
          {/* Start & Destination */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-primary" /> Startlocatie
              </Label>
              <Input
                placeholder="bijv. Amsterdam"
                value={config.startLocation}
                onChange={e => setConfig(prev => ({ ...prev, startLocation: e.target.value }))}
              />
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-secondary" /> Bestemming
              </Label>
              <Select value={config.destination} onValueChange={v => setConfig(prev => ({ ...prev, destination: v }))}>
                <SelectTrigger><SelectValue placeholder="Kies land" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NL">🇳🇱 Nederland</SelectItem>
                  <SelectItem value="BE">🇧🇪 België</SelectItem>
                  <SelectItem value="DE">🇩🇪 Duitsland</SelectItem>
                  <SelectItem value="FR">🇫🇷 Frankrijk</SelectItem>
                  <SelectItem value="SC">🇳🇴 Scandinavië</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Days & Budget */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-primary" /> Aantal dagen: {config.days}
              </Label>
              <Slider min={1} max={14} step={1} value={[config.days]} onValueChange={([v]) => setConfig(prev => ({ ...prev, days: v }))} />
            </div>
            <div>
              <Label className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Euro className="h-4 w-4 text-accent" /> Budget per dag: €{config.budget}
              </Label>
              <Slider min={30} max={200} step={10} value={[config.budget]} onValueChange={([v]) => setConfig(prev => ({ ...prev, budget: v }))} />
            </div>
          </div>

          {/* Car & People */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Car className="h-4 w-4 text-primary" /> Type auto
              </Label>
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
              <Label className="mb-2 text-sm font-semibold">Aantal personen</Label>
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
            <Label className="mb-3 text-sm font-semibold">Voorkeuren</Label>
            <div className="flex flex-wrap gap-3">
              {preferenceOptions.map(p => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    config.preferences.includes(p.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:border-primary/50"
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
            className="w-full bg-primary text-primary-foreground py-6 text-lg font-bold transition-transform hover:scale-[1.02]"
          >
            🗺️ Genereer Mijn Route <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TripWizard;

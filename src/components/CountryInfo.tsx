import { getCountryData } from "@/data/countryData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Shield, Gauge, Phone, Car, Tent } from "lucide-react";
import { useState } from "react";

interface Props {
  countryCode: string;
}

const statusColors: Record<string, string> = {
  legal: "text-green-600 bg-green-50",
  tolerated: "text-amber-600 bg-amber-50",
  illegal: "text-red-600 bg-red-50",
};

const statusLabels: Record<string, string> = {
  legal: "Legaal",
  tolerated: "Gedoogd",
  illegal: "Verboden",
};

const CountryInfo = ({ countryCode }: Props) => {
  const [open, setOpen] = useState(false);
  const data = getCountryData(countryCode);
  if (!data) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border bg-card shadow-card">
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
        <Shield className="h-4 w-4 text-primary" />
        Landeninformatie {data.name}
        <span className="ml-auto text-[11px] text-muted-foreground">{open ? "Sluiten" : "Bekijken"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4">
          {/* Speed limits */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Gauge className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold text-foreground">Snelheidslimieten</h4>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-muted/50 p-2">
                <p className="text-lg font-bold text-foreground">{data.speedLimits.city}</p>
                <p className="text-[10px] text-muted-foreground">Bebouwde kom</p>
              </div>
              <div className="rounded-md bg-muted/50 p-2">
                <p className="text-lg font-bold text-foreground">{data.speedLimits.rural}</p>
                <p className="text-[10px] text-muted-foreground">Buitenweg</p>
              </div>
              <div className="rounded-md bg-muted/50 p-2">
                <p className="text-lg font-bold text-foreground">{data.speedLimits.highway}</p>
                <p className="text-[10px] text-muted-foreground">Snelweg</p>
              </div>
            </div>
          </div>

          {/* Emergency */}
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Alarmnummer:</span>
            <span className="text-xs font-bold text-foreground">{data.emergency}</span>
          </div>

          {/* Driving tips */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Car className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold text-foreground">Rijtips</h4>
            </div>
            <ul className="space-y-1">
              {data.drivingTips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Wildcamping */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Tent className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold text-foreground">Wildcamping</h4>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[data.wildcamping.status]}`}>
                {statusLabels[data.wildcamping.status]}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{data.wildcamping.details}</p>
            {data.wildcamping.fine && (
              <p className="mt-1 text-[10px] text-destructive">Mogelijke boete: {data.wildcamping.fine}</p>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CountryInfo;

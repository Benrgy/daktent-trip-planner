import { TripConfig } from "./TripWizard";
import { RouteResult, formatDuration } from "@/services/routing";
import { Share2, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShareTrip } from "@/hooks/useSavedTrip";
import { useState } from "react";

interface Props {
  config: TripConfig;
  routeResult: RouteResult | null;
}

const TripSummary = ({ config, routeResult }: Props) => {
  const { shareTrip } = useShareTrip();
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleShare = async () => {
    const result = await shareTrip(config);
    if (result === "copied") {
      setShareStatus("Link gekopieerd!");
      setTimeout(() => setShareStatus(null), 2500);
    }
  };

  const multiplier = config.includeReturnTrip ? 2 : 1;

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 text-xs">
        {shareStatus ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
        {shareStatus ?? "Deel trip"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
        <Printer className="h-3.5 w-3.5" /> Print
      </Button>
      {routeResult && (
        <span className="text-[11px] text-muted-foreground ml-auto">
          {routeResult.distanceKm * multiplier} km · {formatDuration(routeResult.durationMinutes * multiplier)}
          {config.includeReturnTrip ? " (retour)" : ""}
        </span>
      )}
    </div>
  );
};

export default TripSummary;

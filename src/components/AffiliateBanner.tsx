import { X, ExternalLink } from "lucide-react";
import { useState } from "react";

const AFFILIATE_URL = "https://www.peter-penthouse.com/?ref=daktenttrip";

export const AffiliateTopBanner = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative border-b border-border bg-muted py-2 px-4 text-center text-xs text-muted-foreground">
      <span>
        Nog geen daktent? Bekijk de{" "}
        <a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-2 hover:text-primary">
          Peter Penthouse daktent
        </a>
        <span className="ml-2 rounded bg-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Partner</span>
      </span>
      <button onClick={() => setVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export const AffiliateCTA = () => (
  <section className="py-16 px-4">
    <div className="container mx-auto max-w-2xl">
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-card">
        <h3 className="mb-2 font-display text-xl font-bold text-foreground">Klaar voor je eerste daktent trip?</h3>
        <p className="mb-1 text-sm text-muted-foreground">Met een Peter Penthouse zonnepaneel bespaar je op stroomkosten tijdens je trip.</p>
        <p className="mb-6 text-xs text-muted-foreground">Compact ontwerp — tot 8% minder brandstofverbruik.</p>
        <a
          href={AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Bekijk Peter Penthouse <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">Partnerlink</p>
      </div>
    </div>
  </section>
);

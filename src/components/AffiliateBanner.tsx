import { X, ExternalLink } from "lucide-react";
import { useState } from "react";

const AFFILIATE_URL = "https://www.peter-penthouse.com/?ref=daktenttrip";

export const AffiliateTopBanner = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative bg-foreground py-2.5 px-4 text-center text-sm text-background">
      <span>
        🏕️ Nog geen daktent? Bekijk de <a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2 hover:text-accent">Peter Penthouse daktent →</a>
        <span className="ml-2 text-xs opacity-60">Partner link</span>
      </span>
      <button onClick={() => setVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const AffiliateCTA = () => (
  <section className="py-12 px-4">
    <div className="container mx-auto max-w-2xl rounded-2xl bg-hero-gradient p-8 text-center text-primary-foreground shadow-lg">
      <h3 className="mb-2 text-2xl font-bold">Klaar voor je eerste daktent trip?</h3>
      <p className="mb-1 text-primary-foreground/80">Met een Peter Penthouse zonnepaneel = €0 stroomkosten tijdens je trip</p>
      <p className="mb-6 text-sm text-primary-foreground/60">Compact design = tot 8% minder brandstofverbruik</p>
      <a
        href={AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground transition-transform hover:scale-105"
      >
        Bekijk Peter Penthouse <ExternalLink className="h-4 w-4" />
      </a>
      <p className="mt-3 text-xs text-primary-foreground/50">Aanbeveling — partner link</p>
    </div>
  </section>
);

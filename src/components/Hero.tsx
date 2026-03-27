import { ArrowRight, MapPin, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onStart: () => void;
}

const Hero = ({ onStart }: HeroProps) => (
  <section className="relative border-b border-border bg-card">
    <div className="container mx-auto max-w-5xl px-4 py-20 md:py-28">
      <div className="max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> Voor daktent kampeerders in NL & BE
        </div>
        <h1 className="mb-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Plan je daktent roadtrip in minuten
        </h1>
        <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
          Route, kampeerplekken, kosten en weersverwachting — alles in één overzichtelijke tool. Stop met eindeloos zoeken, start met rijden.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            onClick={onStart}
            className="gap-2 px-6 py-5 text-sm font-semibold"
          >
            Start met plannen <ArrowRight className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">Gratis te gebruiken — geen account nodig</span>
        </div>
      </div>
    </div>

    <div className="border-t border-border bg-muted/50">
      <div className="container mx-auto flex max-w-5xl flex-wrap items-center gap-8 px-4 py-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Klaar in 3 minuten</div>
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 20+ kampeerplekken</div>
        <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Wildcamping regelgeving per land</div>
      </div>
    </div>
  </section>
);

export default Hero;

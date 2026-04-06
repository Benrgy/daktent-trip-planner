import { ArrowRight, MapPin, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.webp";

interface HeroProps {
  onStart: () => void;
}

const Hero = ({ onStart }: HeroProps) => (
<section className="relative overflow-hidden border-b border-border" aria-label="Hero">
    {/* Background image */}
    <img
      src={heroBg}
      alt="Daktent op SUV bij zonsondergang in Europees heuvellandschap"
      width="1920"
      height="960"
      loading="eager"
      fetchPriority="high"
      className="absolute inset-0 h-full w-full object-cover"
    />
    {/* Dark overlay for text readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />

    <div className="container relative mx-auto max-w-5xl px-4 py-24 md:py-32">
      <div className="max-w-xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/80 backdrop-blur-sm">
          <MapPin className="h-3.5 w-3.5" /> Voor daktent kampeerders in NL & BE
        </div>
        <h1 className="mb-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Plan je daktent roadtrip in minuten
        </h1>
        <p className="mb-8 max-w-lg text-base leading-relaxed text-primary-foreground/75 md:text-lg">
          Route, kampeerplekken, kosten en weersverwachting — alles in één overzichtelijke tool. Stop met eindeloos zoeken, start met rijden.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            onClick={onStart}
            className="gap-2 bg-primary-foreground px-6 py-5 text-sm font-semibold text-foreground hover:bg-primary-foreground/90"
          >
            Start met plannen <ArrowRight className="h-4 w-4" />
          </Button>
          <span className="text-xs text-primary-foreground/60">Gratis te gebruiken — geen account nodig</span>
        </div>
      </div>
    </div>

    <div className="relative border-t border-primary-foreground/10 bg-foreground/40 backdrop-blur-sm">
      <div className="container mx-auto flex max-w-5xl flex-wrap items-center gap-8 px-4 py-3.5 text-xs text-primary-foreground/70">
        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Klaar in 3 minuten</div>
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 40+ kampeerplekken</div>
        <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Wildcamping regelgeving per land</div>
      </div>
    </div>
  </section>
);

export default Hero;

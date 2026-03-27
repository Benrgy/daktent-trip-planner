import { MapPin, Clock, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onStart: () => void;
}

const Hero = ({ onStart }: HeroProps) => (
  <section className="relative overflow-hidden bg-hero-gradient py-20 px-4 md:py-32">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTJ2NEgyNFYwSDEydjRIMFY2aDEyVjRoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
    <div className="container relative mx-auto max-w-4xl text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
        <MapPin className="h-4 w-4" /> 🇳🇱 Voor Nederlandse & Belgische daktent avonturiers
      </div>
      <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-6xl">
        Plan Je Perfecte Daktent Roadtrip in{" "}
        <span className="underline decoration-accent decoration-4 underline-offset-4">3 Minuten</span>
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
        Route, kampeerplekken, kosten en weer — alles in één tool.
        Bespaar uren plannen en ga sneller op pad!
      </p>
      <Button
        size="lg"
        onClick={onStart}
        className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg font-bold shadow-lg transition-transform hover:scale-105"
      >
        🏕️ Start Gratis Plannen
      </Button>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/70">
        <div className="flex items-center gap-2"><Clock className="h-5 w-5" /> Klaar in 3 min</div>
        <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /> 20+ spots</div>
        <div className="flex items-center gap-2"><Euro className="h-5 w-5" /> Gratis te gebruiken</div>
      </div>
    </div>
  </section>
);

export default Hero;

import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { AffiliateTopBanner } from "@/components/AffiliateBanner";
import { countryData } from "@/data/countryData";
import { ArrowRight, MapPin, Globe, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const countryFlags: Record<string, string> = {
  NL: "🇳🇱", BE: "🇧🇪", DE: "🇩🇪", FR: "🇫🇷", SC: "🇸🇪",
  ES: "🇪🇸", IT: "🇮🇹", PT: "🇵🇹", AT: "🇦🇹", CH: "🇨🇭",
  HR: "🇭🇷", SI: "🇸🇮", GB: "🇬🇧", GR: "🇬🇷",
};

const Index = () => {
  const handleStart = () => {
    // Navigate to planner page
    window.location.href = (window.location.pathname.startsWith("/daktent-trip-planner") ? "/daktent-trip-planner" : "") + "/planner";
  };

  const topCountries = Object.entries(countryData).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <AffiliateTopBanner />
      <Navbar />
      <Hero onStart={handleStart} />

      {/* Quick links section */}
      <section className="border-b border-border py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-2 text-center font-display text-2xl font-bold text-foreground">
            Wat wil je doen?
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Plan je reis, ontdek landen of bekijk veelgestelde vragen.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              to="/planner"
              className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-md"
            >
              <MapPin className="h-8 w-8 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Route planner</h3>
              <p className="text-xs text-muted-foreground">Plan je complete daktent roadtrip met kosten, weer en paklijst.</p>
            </Link>
            <Link
              to="/landen"
              className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-md"
            >
              <Globe className="h-8 w-8 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Landen info</h3>
              <p className="text-xs text-muted-foreground">Wildcamping regels, snelheidslimieten en tips per land.</p>
            </Link>
            <Link
              to="/faq"
              className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-md"
            >
              <HelpCircle className="h-8 w-8 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Veelgestelde vragen</h3>
              <p className="text-xs text-muted-foreground">Antwoorden op de meest voorkomende vragen.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular countries */}
      <section className="border-b border-border bg-muted/20 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-2 text-center font-display text-2xl font-bold text-foreground">
            Populaire bestemmingen
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Ontdek de meest gekozen landen voor daktent kamperen.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCountries.map(([code, data]) => (
              <Link
                key={code}
                to={`/landen/${code.toLowerCase()}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <span className="text-2xl">{countryFlags[code]}</span>
                <span className="font-display font-medium text-foreground">{data.name}</span>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link to="/landen">Bekijk alle {Object.keys(countryData).length} landen <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Compact FAQ teaser */}
      <section className="border-b border-border py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Heb je een vraag?</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Bekijk onze veelgestelde vragen of start direct met plannen.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/faq">Bekijk FAQ</Link>
            </Button>
            <Button asChild>
              <Link to="/planner">Start planner <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8 px-4 text-center">
        <p className="font-display text-sm font-semibold text-foreground">DaktentTripplanner.nl</p>
        <p className="mt-1 text-xs text-muted-foreground">© 2026 — Plan je perfecte daktent avontuur</p>
        <p className="mt-2 text-[11px] text-muted-foreground">Wildcamping data is indicatief. Controleer altijd lokale regelgeving.</p>
        <nav className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground" aria-label="Footer navigatie">
          <Link to="/planner" className="hover:text-foreground">Route planner</Link>
          <Link to="/landen" className="hover:text-foreground">Landen</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Index;

import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { AffiliateTopBanner } from "@/components/AffiliateBanner";
import { countryData } from "@/data/countryData";
import { ArrowRight, MapPin, Globe, HelpCircle, Phone, Tent, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import RevealOnScroll from "@/components/cinematic/RevealOnScroll";
import TiltCard from "@/components/cinematic/TiltCard";
import Marquee from "@/components/cinematic/Marquee";
import CountUp from "@/components/cinematic/CountUp";

const countryFlags: Record<string, string> = {
  NL: "🇳🇱", BE: "🇧🇪", DE: "🇩🇪", FR: "🇫🇷", SC: "🇸🇪",
  ES: "🇪🇸", IT: "🇮🇹", PT: "🇵🇹", AT: "🇦🇹", CH: "🇨🇭",
  HR: "🇭🇷", SI: "🇸🇮", GB: "🇬🇧", GR: "🇬🇷",
};

const Index = () => {
  const handleStart = () => {
    window.location.href = (window.location.pathname.startsWith("/daktent-trip-planner") ? "/daktent-trip-planner" : "") + "/planner";
  };

  const topCountries = Object.entries(countryData).slice(0, 6);

  const marqueeItems = [
    ...Object.entries(countryFlags).map(([code, flag]) => (
      <>
        <span className="text-base">{flag}</span>
        <span>{countryData[code]?.name ?? code}</span>
      </>
    )),
    <><Phone className="h-3.5 w-3.5 text-primary" /> Noodnummer 112 EU-breed</>,
    <><Tent className="h-3.5 w-3.5 text-primary" /> Wildcamping per land</>,
    <><Shield className="h-3.5 w-3.5 text-primary" /> Snelheidslimieten ingebouwd</>,
  ];

  return (
    <div className="min-h-screen bg-background">
      <AffiliateTopBanner />
      <Navbar />
      <Hero onStart={handleStart} />

      {/* Cinematic marquee strip */}
      <Marquee items={marqueeItems} speed={50} />

      {/* Quick links section */}
      <section className="border-b border-border py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <RevealOnScroll>
            <h2 className="mb-2 text-center font-display text-2xl font-bold text-foreground">
              Wat wil je doen?
            </h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Plan je reis, ontdek landen of bekijk veelgestelde vragen.
            </p>
          </RevealOnScroll>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { to: "/planner", icon: MapPin, title: "Route planner", desc: "Plan je complete daktent roadtrip met kosten, weer en paklijst." },
              { to: "/landen", icon: Globe, title: "Landen info", desc: "Wildcamping regels, snelheidslimieten en tips per land." },
              { to: "/faq", icon: HelpCircle, title: "Veelgestelde vragen", desc: "Antwoorden op de meest voorkomende vragen." },
            ].map((card, i) => (
              <RevealOnScroll key={card.to} delay={i * 120}>
                <TiltCard className="h-full rounded-lg">
                  <Link
                    to={card.to}
                    className="group flex h-full flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <card.icon className="h-8 w-8 text-primary" />
                    <h3 className="font-display font-semibold text-foreground">{card.title}</h3>
                    <p className="text-xs text-muted-foreground">{card.desc}</p>
                  </Link>
                </TiltCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Popular countries */}
      <section className="border-b border-border bg-muted/20 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <RevealOnScroll>
            <h2 className="mb-2 text-center font-display text-2xl font-bold text-foreground">
              Populaire bestemmingen
            </h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Ontdek de meest gekozen landen voor daktent kamperen — uit{" "}
              <CountUp end={Object.keys(countryData).length} className="font-semibold text-foreground" /> landen.
            </p>
          </RevealOnScroll>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCountries.map(([code, data], i) => (
              <RevealOnScroll key={code} delay={i * 80}>
                <TiltCard max={4} className="rounded-lg">
                  <Link
                    to={`/landen/${code.toLowerCase()}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <span className="text-2xl">{countryFlags[code]}</span>
                    <span className="font-display font-medium text-foreground">{data.name}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Link>
                </TiltCard>
              </RevealOnScroll>
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
        <RevealOnScroll className="container mx-auto max-w-3xl text-center">
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
        </RevealOnScroll>
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

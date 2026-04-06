import Navbar from "@/components/Navbar";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Wat is DaktentTripPlanner?",
    a: "DaktentTripPlanner is een gratis online tool waarmee je in 3 minuten een complete daktent roadtrip plant. Je krijgt kampeerplekken op een interactieve kaart, een kostenberekening, weersverwachting en een slimme inpakchecklist — alles in één overzicht.",
  },
  {
    q: "Kan ik meerdere bestemmingen plannen?",
    a: "Ja! Je kunt meerdere landen toevoegen als stops op je route. De tool berekent automatisch de totale afstand, kosten en reistijd voor je complete multi-stop roadtrip.",
  },
  {
    q: "Welke landen worden ondersteund?",
    a: "We ondersteunen 14 bestemmingen: Nederland, België, Duitsland, Frankrijk, Scandinavië, Engeland, Spanje, Italië, Portugal, Oostenrijk, Zwitserland, Kroatië, Slovenië en Griekenland.",
  },
  {
    q: "Hoe plan ik een daktent roadtrip?",
    a: "Vul je vertrekplaats in, voeg één of meerdere bestemmingen toe, stel reisduur en aantal personen in. Klik op 'Genereer route' voor een compleet overzicht met kaart, kosten, weer en paklijst.",
  },
  {
    q: "Is DaktentTripPlanner gratis?",
    a: "Ja, de tool is volledig gratis te gebruiken. Er zijn geen verborgen kosten of registratie nodig.",
  },
  {
    q: "Hoe betrouwbaar is de wildcamping informatie?",
    a: "De wildcamping data is indicatief en gebaseerd op actuele wetgeving. Controleer altijd lokale regelgeving voordat je op een plek gaat staan.",
  },
];

const FAQ = () => {
  usePageSEO({
    title: "Veelgestelde vragen — DaktentTripPlanner",
    description: "Antwoorden op veelgestelde vragen over DaktentTripPlanner: hoe het werkt, welke landen ondersteund worden en hoe je een daktent roadtrip plant.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Veelgestelde vragen</h1>
        <p className="mb-8 text-muted-foreground">Alles wat je wilt weten over DaktentTripPlanner en daktent kamperen.</p>

        <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border bg-card p-5"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              open={i === 0}
            >
              <summary className="cursor-pointer font-display text-sm font-semibold text-foreground group-open:mb-3" itemProp="name">
                {faq.q}
              </summary>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-sm leading-relaxed text-muted-foreground" itemProp="text">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-muted-foreground">Klaar om je trip te plannen?</p>
          <Button asChild>
            <Link to="/planner">Start de trip planner <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default FAQ;

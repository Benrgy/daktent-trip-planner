import { Tent } from "lucide-react";

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
    <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
      <a href="/" className="flex items-center gap-2 font-display text-base font-bold text-foreground">
        <Tent className="h-5 w-5 text-primary" />
        DaktentTripPlanner
      </a>
      <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
        <a href="#wizard" className="transition-colors hover:text-foreground">Route planner</a>
        <a
          href="#spots"
          className="transition-colors hover:text-foreground"
          onClick={(e) => {
            const el = document.getElementById("spots");
            if (!el) {
              e.preventDefault();
              document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >Kampeerplekken</a>
        <a
          href="#kosten"
          className="transition-colors hover:text-foreground"
          onClick={(e) => {
            const el = document.getElementById("kosten");
            if (!el) {
              e.preventDefault();
              document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >Kosten</a>
      </nav>
    </div>
  </header>
);

export default Navbar;

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tent, Menu, X, Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("daktent-theme") === "dark" || document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("daktent-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("daktent-theme", "light");
    }
  }, [dark]);

  const navLinks = [
    { to: "/planner", label: "Route planner" },
    { to: "/landen", label: "Landen" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-bold text-foreground">
          <Tent className="h-5 w-5 text-primary" />
          DaktentTripPlanner
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors hover:text-foreground ${location.pathname === link.to ? "text-foreground font-medium" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setDark(d => !d)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Wissel thema"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>

        {/* Mobile buttons */}
        <div className="flex items-center gap-1 sm:hidden">
          <button
            onClick={() => setDark(d => !d)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Wissel thema"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border bg-card px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors hover:text-foreground ${location.pathname === link.to ? "text-foreground font-medium" : "text-muted-foreground"}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

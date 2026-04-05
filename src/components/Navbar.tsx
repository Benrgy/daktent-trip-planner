import { useState, useEffect } from "react";
import { Tent, Menu, X, Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    { href: "#wizard", label: "Route planner" },
    { href: "#spots", label: "Kampeerplekken", fallback: "#wizard" },
    { href: "#kosten", label: "Kosten", fallback: "#wizard" },
    { href: "#faq", label: "FAQ" },
  ];

  const handleNavClick = (href: string, fallback?: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (!el && fallback) {
      document.querySelector(fallback)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <a href={import.meta.env.BASE_URL} className="flex items-center gap-2 font-display text-base font-bold text-foreground">
          <Tent className="h-5 w-5 text-primary" />
          DaktentTripPlanner
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
              onClick={(e) => {
                if (link.fallback) {
                  const el = document.querySelector(link.href);
                  if (!el) {
                    e.preventDefault();
                    handleNavClick(link.href, link.fallback);
                  }
                }
              }}
            >
              {link.label}
            </a>
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
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={(e) => {
                  if (link.fallback) {
                    const el = document.querySelector(link.href);
                    if (!el) {
                      e.preventDefault();
                      handleNavClick(link.href, link.fallback);
                      return;
                    }
                  }
                  setMobileOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

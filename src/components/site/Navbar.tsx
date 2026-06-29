import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-card" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 rounded-xl brand-gradient grid place-items-center font-display font-bold text-brand-foreground text-lg shadow-glow">
              L
            </div>
            <span className="font-display font-bold tracking-tight text-lg">
              LEGION<span className="text-brand">FX</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                activeProps={{ className: "text-foreground bg-white/5" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-medium rounded-xl brand-gradient text-brand-foreground hover:opacity-90 transition shadow-glow"
            >
              Start Trading
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-4 animate-fade-up">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-center rounded-xl border border-white/10">
                Login
              </Link>
              <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-center rounded-xl brand-gradient text-brand-foreground font-medium">
                Start
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

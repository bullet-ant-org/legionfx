import { Link } from "@tanstack/react-router";
import { ArrowUp, Instagram, Facebook, Twitter, Linkedin, Youtube, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl brand-gradient grid place-items-center font-display font-bold text-brand-foreground">L</div>
              <span className="font-display font-bold text-lg">LEGION<span className="text-brand">FX</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Helping traders build consistent profitability through education, technology, discipline, and professional funding opportunities.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand/50"
              />
              <button className="px-4 rounded-xl brand-gradient text-brand-foreground" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-lg glass grid place-items-center hover:text-brand transition" aria-label="social">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Company" links={[["About","/about"],["Services","/services"],["Pricing","/pricing"],["Contact","/contact"]]} />
          <FooterCol title="Resources" links={[["Trading Academy","/services"],["Trading Signals","/services"],["Trading Bots","/services"],["Prop Firm","/services"]]} />
          <FooterCol title="Legal" links={[["Privacy Policy","/"],["Terms & Conditions","/"],["Cookies","/"]]} />
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} LEGIONFX. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition group"
          >
            Back to top
            <span className="h-8 w-8 rounded-full glass grid place-items-center group-hover:text-brand transition">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-muted-foreground hover:text-brand transition">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

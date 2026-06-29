import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <Navbar />
      <main className="relative pt-28">{children}</main>
      <Footer />
    </div>
  );
}

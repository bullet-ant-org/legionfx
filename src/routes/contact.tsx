import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Clock, MapPin, Send, Instagram, Facebook, Twitter, Linkedin, MessageCircle, Youtube, Sparkles, Check, ChevronDown, Zap, HeartHandshake, BookOpen, Bot, Signal, Wallet, LifeBuoy, Briefcase } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { Counter } from "@/components/site/Counter";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact LEGIONFX — Let's Build Your Trading Future" },
      { name: "description", content: "Reach the LEGIONFX team for education, signals, bots, funding and partnership inquiries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand"><Sparkles size={12}/> Contact LEGIONFX</div>
            <h1 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Let's build your <span className="text-gradient">trading success</span> together.
            </h1>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl">
              Whether you're joining our Academy, exploring signals, trying our trading bots, or starting your funded account journey — our team is ready to help.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#form" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Contact Our Team</a>
              <Link to="/services" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">View Our Services</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {["7+ Years","5,000+ Traders","500+ Mentored","24/7 Support"].map(t => (
                <div key={t} className="glass rounded-xl px-3 py-2 flex items-center gap-1.5"><Check size={12} className="text-brand"/>{t}</div>
              ))}
            </div>
          </div>
          <div className="relative animate-float">
            <div className="absolute -inset-10 -z-10 bg-brand/30 blur-3xl rounded-full" />
            <div className="glass-strong rounded-3xl p-6 aspect-square grid-bg relative overflow-hidden">
              <div className="absolute top-6 left-6 glass rounded-2xl px-4 py-2.5 text-xs"><MessageCircle size={14} className="inline text-brand mr-2"/>How can we help?</div>
              <div className="absolute top-24 right-6 glass rounded-2xl px-4 py-2.5 text-xs">Funded account info →</div>
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4">
                <div className="text-xs text-muted-foreground">Avg. response</div>
                <div className="text-2xl font-bold text-gradient">&lt; 2 hours</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <Section>
        <SectionHeader eyebrow="Welcome" title="We'd Love To Hear From You" subtitle="Every trader matters. From your first chart to your first funded payout — we're here every step of the way." />
        <div className="grid md:grid-cols-3 gap-5">
          {[
            [Zap,"Fast Response","We aim to respond to inquiries within hours, not days."],
            [HeartHandshake,"Expert Guidance","Speak directly with knowledgeable trading professionals."],
            [LifeBuoy,"Personalized Support","Recommendations tailored to your trading goals."],
          ].map(([I,t,d]) => (
            <div key={t as string} className="glass rounded-3xl p-7 hover-lift">
              <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-brand-foreground mb-4">{((C:any)=><C size={20}/>)(I)}</div>
              <h4 className="font-semibold">{t as string}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact info */}
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            [Mail,"Email Us","support@legionfx.com","Available for general inquiries"],
            [Phone,"Call Us","+1 (000) 000-0000","Business hours support"],
            [Clock,"Business Hours","Mon – Fri","9:00 AM – 6:00 PM"],
            [MapPin,"Office","Global HQ","Get directions →"],
          ].map(([I,t,v,s]) => (
            <div key={t as string} className="glass rounded-3xl p-6 hover-lift">
              <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-brand-foreground mb-4">{((C:any)=><C size={20}/>)(I)}</div>
              <div className="text-xs text-muted-foreground">{t as string}</div>
              <div className="mt-1 font-semibold">{v as string}</div>
              <div className="text-xs text-muted-foreground mt-1">{s as string}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Form */}
      <Section id="form">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative hidden lg:block">
            <div className="absolute -inset-8 -z-10 bg-brand/20 blur-3xl rounded-full" />
            <div className="glass-strong rounded-3xl p-8 h-full grid-bg relative overflow-hidden">
              <div className="text-sm text-muted-foreground mb-3">Talking to traders worldwide</div>
              <div className="grid grid-cols-2 gap-3">
                {["🌍 Global","💬 Multilingual","⚡ Fast Support","🤝 Personalized"].map(t => (
                  <div key={t} className="glass rounded-2xl p-4 text-sm">{t}</div>
                ))}
              </div>
              <div className="mt-6 glass rounded-2xl p-5">
                <div className="text-xs text-muted-foreground">Currently online</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-glow-pulse"/>
                  <span className="text-sm font-medium">Support Team Available</span>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h3 className="text-2xl font-semibold">Send Us A Message</h3>
            <p className="mt-2 text-sm text-muted-foreground">Complete the form and one of our team members will get back to you shortly.</p>
            {sent ? (
              <div className="mt-8 glass rounded-2xl p-8 text-center">
                <div className="h-14 w-14 rounded-full brand-gradient mx-auto grid place-items-center text-brand-foreground"><Check size={26}/></div>
                <h4 className="mt-4 text-lg font-semibold">Message Sent</h4>
                <p className="mt-2 text-sm text-muted-foreground">We've received your message and will be in touch shortly.</p>
                <button onClick={() => setSent(false)} className="mt-5 px-4 py-2 rounded-xl glass hover:bg-white/10 text-sm">Send another</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" type="text" required />
                <Field label="Email Address" type="email" required />
                <Field label="Phone Number" type="tel" />
                <Field label="Country" type="text" />
                <div className="sm:col-span-2"><Field label="Subject" type="text" required /></div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Service</label>
                  <select className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand/50">
                    {["Forex Academy","Trading Signals","Trading Bots","Prop Firm Funding","General Inquiry","Technical Support","Partnership"].map(o => <option key={o} className="bg-background">{o}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Message</label>
                  <textarea rows={5} required className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand/50 resize-none" />
                </div>
                <label className="sm:col-span-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" required className="accent-[oklch(0.72_0.19_50)]" /> I agree to the Privacy Policy.
                </label>
                <button type="submit" className="sm:col-span-2 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">
                  Send Message <Send size={16}/>
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* How we can help */}
      <Section>
        <SectionHeader eyebrow="How We Help" title="Why Contact LEGIONFX" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            [BookOpen,"Forex Education","Guidance on choosing the right learning path."],
            [Wallet,"Prop Firm Assistance","Mentorship to help you prepare for evaluations."],
            [Signal,"Trading Signals","Information about our premium signal packages."],
            [Bot,"Trading Bots","Find the right automation for your style."],
            [LifeBuoy,"Technical Support","Help with your account or purchased services."],
            [Briefcase,"Partnerships","Affiliate, corporate and collaboration opportunities."],
          ].map(([I,t,d]) => (
            <div key={t as string} className="glass rounded-3xl p-6 hover-lift">
              <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground mb-4">{((C:any)=><C size={18}/>)(I)}</div>
              <h4 className="font-semibold">{t as string}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="max-w-3xl mx-auto space-y-3">
          {[
            ["How quickly will I receive a reply?","Most inquiries are answered within 2 hours during business days."],
            ["Which service is best for beginners?","Start with the Forex Academy plus Monthly VIP signals."],
            ["How do I enroll in the Forex Academy?","Pick a plan on the pricing page or contact us for guidance."],
            ["Can I schedule a consultation?","Yes — request a free 15-minute discovery call via this form."],
            ["Do you offer international support?","We support traders in 60+ countries across multiple time zones."],
            ["How do I purchase a trading bot?","Visit the pricing page and choose Monthly, Quarterly or Yearly."],
            ["Can I upgrade my membership later?","Yes — upgrade any time with prorated billing."],
          ].map(([q,a]) => <Accordion key={q} q={q} a={a}/>)}
        </div>
      </Section>

      {/* Community stats */}
      <Section>
        <SectionHeader eyebrow="Community" title="Join Thousands Of Successful Traders" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            [7,"+","Years"],[500,"+","Mentored"],[5000,"+","Active"],[900,"M+","Volume","$"],
            [90,"%","Bot Accuracy"],[95,"%","Signal Accuracy"],[70,"%","Funded Rate"],
          ].map(([v,s,l,p]) => (
            <div key={l as string} className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-gradient"><Counter to={v as number} prefix={(p as string) ?? ""} suffix={s as string}/></div>
              <div className="mt-2 text-xs text-muted-foreground">{l as string}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Social */}
      <Section>
        <SectionHeader eyebrow="Social" title="Connect With LEGIONFX" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            [Instagram,"Instagram"],[Facebook,"Facebook"],[Twitter,"X / Twitter"],[Linkedin,"LinkedIn"],
            [MessageCircle,"Telegram"],[MessageCircle,"Discord"],[Youtube,"YouTube"],
          ].map(([I,l]) => (
            <a key={l as string} href="#" className="glass rounded-2xl p-5 text-center hover-lift">
              <div className="h-10 w-10 mx-auto rounded-xl brand-gradient grid place-items-center text-brand-foreground mb-2">{((C:any)=><C size={18}/>)(I)}</div>
              <div className="text-xs">{l as string}</div>
            </a>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[32px] glass-strong p-12 md:p-20 text-center">
          <div className="absolute inset-0 -z-10 opacity-80" style={{ background: "var(--gradient-hero)" }} />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to take the next step?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Become funded, master the markets, automate your strategies, or get professional guidance — we're here to help.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Start Trading</Link>
            <Link to="/services" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">Explore Services</Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function Field({ label, type, required }: { label: string; type: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}{required && <span className="text-brand"> *</span>}</span>
      <input type={type} required={required} className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand/50 transition" />
    </label>
  );
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o=>!o)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium">{q}</span>
        <ChevronDown size={18} className={`transition-transform ${open?"rotate-180 text-brand":"text-muted-foreground"}`}/>
      </button>
      <div className={`grid transition-all duration-300 ${open?"grid-rows-[1fr]":"grid-rows-[0fr]"}`}>
        <div className="overflow-hidden"><p className="px-5 pb-5 text-sm text-muted-foreground">{a}</p></div>
      </div>
    </div>
  );
}

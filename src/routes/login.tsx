import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Shield, Zap, Globe, ArrowRight, Check, X } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — LEGIONFX" },
      { name: "description", content: "Access your LEGIONFX trading dashboard, funded accounts, premium signals and bots." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(() => navigate({ to: "/" }), 1400); }, 1100);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div aria-hidden className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div aria-hidden className="fixed inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />

      <header className="relative px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl brand-gradient grid place-items-center font-display font-bold text-brand-foreground shadow-glow">L</div>
          <span className="font-display font-bold tracking-tight text-lg">LEGION<span className="text-brand">FX</span></span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
      </header>

      <div className="flex-1 grid lg:grid-cols-[1fr_1.1fr] gap-0">
        {/* LEFT — brand showcase */}
        <div className="hidden lg:flex relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-brand/30 blur-3xl animate-glow-pulse"/>
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-triad-violet/20 blur-3xl"/>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand">Welcome Back, Trader.</div>
            <h2 className="mt-6 text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] max-w-md">
              Access your <span className="text-gradient">LEGIONFX</span> trading command center.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
              Manage your funded challenges, premium signals, academy progress and trading bots — all in one elite ecosystem.
            </p>
          </div>

          <div className="relative">
            <div className="glass-strong rounded-3xl p-5 max-w-md">
              <div className="text-xs text-muted-foreground mb-3">Portfolio · Live</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-gradient">$184,920</div>
                <div className="text-xs text-brand">+12.4%</div>
              </div>
              <svg viewBox="0 0 300 70" className="w-full h-16 mt-3">
                <defs>
                  <linearGradient id="auth-g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 50)" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="oklch(0.72 0.19 50)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,50 C40,35 80,55 120,30 C160,5 200,40 240,20 C270,8 290,15 300,12 L300,70 L0,70 Z" fill="url(#auth-g)"/>
                <path d="M0,50 C40,35 80,55 120,30 C160,5 200,40 240,20 C270,8 290,15 300,12" stroke="oklch(0.78 0.21 55)" strokeWidth="2" fill="none"/>
              </svg>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[["7+","Years"],["5K+","Traders"],["95%","Signal Acc."]].map(([v,l]) => (
                <div key={l} className="glass rounded-2xl p-3 text-center">
                  <div className="text-lg font-bold text-gradient">{v}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Auth card */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="glass-strong rounded-3xl p-8 shadow-card relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand/25 blur-3xl"/>

              {success ? (
                <div className="py-10 text-center">
                  <div className="h-16 w-16 mx-auto rounded-full brand-gradient grid place-items-center text-brand-foreground shadow-glow"><Check size={28}/></div>
                  <h3 className="mt-5 text-xl font-semibold">Welcome to LEGIONFX</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Redirecting you to your dashboard…</p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto rounded-2xl brand-gradient grid place-items-center font-display font-bold text-brand-foreground shadow-glow">L</div>
                    <h3 className="mt-4 text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{mode === "login" ? "Sign in to continue your trading journey." : "Join 5,000+ traders worldwide."}</p>
                  </div>

                  {/* Toggle */}
                  <div className="mt-6 grid grid-cols-2 gap-1 p-1 glass rounded-xl">
                    {(["login","signup"] as const).map(m => (
                      <button key={m} onClick={() => setMode(m)} className={`py-2 text-sm rounded-lg transition ${mode===m ? "brand-gradient text-brand-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`}>
                        {m === "login" ? "Sign in" : "Sign up"}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={submit} className="mt-6 space-y-4">
                    {mode === "signup" && (
                      <InputField icon={User} label="Full Name" type="text" required />
                    )}
                    <InputField icon={Mail} label="Email Address" type="email" required />
                    <InputField
                      icon={Lock}
                      label="Password"
                      type={showPass ? "text" : "password"}
                      required
                      trailing={
                        <button type="button" onClick={() => setShowPass(s=>!s)} className="text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                          {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      }
                    />
                    {mode === "signup" && (
                      <InputField icon={Lock} label="Confirm Password" type={showPass ? "text" : "password"} required />
                    )}

                    {mode === "login" && (
                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 text-muted-foreground">
                          <input type="checkbox" className="accent-[oklch(0.72_0.19_50)]"/> Remember me
                        </label>
                        <button type="button" onClick={() => setForgot(true)} className="text-brand hover:underline">Forgot password?</button>
                      </div>
                    )}

                    <button disabled={loading} type="submit" className="w-full py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-70">
                      {loading ? (
                        <span className="h-4 w-4 rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground animate-spin"/>
                      ) : (
                        <>{mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={16}/></>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-white/10"/>
                    <span className="text-[10px] tracking-widest text-muted-foreground">OR CONTINUE WITH</span>
                    <div className="flex-1 h-px bg-white/10"/>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 rounded-xl glass hover:bg-white/10 text-sm flex items-center justify-center gap-2">
                      <GoogleIcon/> Google
                    </button>
                    <button className="py-3 rounded-xl glass hover:bg-white/10 text-sm flex items-center justify-center gap-2">
                      <AppleIcon/> Apple
                    </button>
                  </div>

                  <p className="mt-6 text-center text-xs text-muted-foreground">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-brand hover:underline">
                      {mode === "login" ? "Create account" : "Sign in"}
                    </button>
                  </p>
                </>
              )}
            </div>

            {/* Security badges */}
            <div className="mt-5 grid grid-cols-2 gap-2 text-[11px]">
              {[[Shield,"End-to-End Secure"],[Zap,"Fast & Secure Login"],[Lock,"Protected User Data"],[Globe,"Global Platform"]].map(([I,t]) => (
                <div key={t as string} className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                  <I size={13} className="text-brand"/> <span className="text-muted-foreground">{t as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="relative px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-t border-white/5">
        <div>© {new Date().getFullYear()} LEGIONFX</div>
        <div className="flex gap-5">
          <Link to="/" className="hover:text-foreground">Privacy</Link>
          <Link to="/" className="hover:text-foreground">Terms</Link>
          <Link to="/contact" className="hover:text-foreground">Need help?</Link>
        </div>
      </footer>

      {forgot && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-background/70 backdrop-blur-sm animate-fade-up">
          <div className="glass-strong rounded-3xl p-7 max-w-md w-full relative">
            <button onClick={() => setForgot(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Close"><X size={18}/></button>
            <h3 className="text-xl font-semibold">Reset Password</h3>
            <p className="mt-2 text-sm text-muted-foreground">Enter your email and we'll send a secure password reset link.</p>
            <form onSubmit={(e) => { e.preventDefault(); setForgot(false); }} className="mt-5 space-y-4">
              <InputField icon={Mail} label="Email" type="email" required />
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setForgot(false)} className="py-3 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
                <button type="submit" className="py-3 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Send Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ icon: Icon, label, type, required, trailing }: { icon: any; label: string; type: string; required?: boolean; trailing?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}{required && <span className="text-brand"> *</span>}</span>
      <div className="mt-1.5 relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        <input
          type={type}
          required={required}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition"
        />
        {trailing && <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.2-5.5 4.2-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.6-2.6C16.9 3.5 14.7 2.5 12 2.5 6.7 2.5 2.4 6.8 2.4 12.1S6.7 21.7 12 21.7c6.9 0 9.5-4.8 9.5-7.3 0-.5-.1-.9-.1-1.3H12z"/>
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.8 1.3 10.4.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9 1.6 0 2 .9 3.4.8 1.4 0 2.3-1.3 3.2-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.9-4.2zm-2.6-7.7c.7-.8 1.2-2 1-3.2-1.1 0-2.3.7-3 1.5-.6.7-1.2 1.9-1.1 3 1.2.1 2.4-.6 3.1-1.3z"/>
    </svg>
  );
}

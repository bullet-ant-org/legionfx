import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Calendar, Award, TrendingUp, CheckCircle2,
  FileText, Camera, Edit, Shield, Star, Briefcase, Globe,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle } from "@/components/dashboard/primitives";
import { user, wallet, achievements } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard/profile")({
  ssr: false,
  component: ProfilePage,
});

const documents = [
  { name: "Government ID", type: "Passport · ZA", status: "Verified", date: "Mar 12, 2023" },
  { name: "Proof of Address", type: "Utility bill", status: "Verified", date: "Mar 15, 2023" },
  { name: "Tax Certificate", type: "SARS · 2024", status: "Verified", date: "Aug 8, 2024" },
  { name: "Bank Statement", type: "Standard Bank", status: "Verified", date: "Mar 15, 2023" },
];

function ProfilePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Your personal information, verification status and trading history.</p>
      </motion.div>

      {/* Profile header */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 h-40 brand-gradient opacity-20" />
        <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-5 items-end">
          <div className="relative">
            <div className="h-28 w-28 rounded-3xl brand-gradient grid place-items-center text-4xl font-bold text-brand-foreground shadow-glow border-4 border-background">
              {user.initials}
            </div>
            <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl glass-strong grid place-items-center text-brand hover:bg-white/10"><Camera size={13} /></button>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <span className="text-[10px] px-2 py-1 rounded-full bg-brand/10 text-brand border border-brand/20 font-semibold">{user.plan}</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 inline-flex items-center gap-1"><CheckCircle2 size={10} /> {user.status}</span>
            </div>
            <div className="text-sm text-muted-foreground">Elite trader · Member since {user.joined}</div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={12} /> +27 82 555 0123</span>
              <span className="flex items-center gap-1.5"><MapPin size={12} /> Cape Town, South Africa</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} /> Joined {user.joined}</span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center gap-2"><Edit size={13} /> Edit Profile</button>
        </div>
      </GlassCard>

      {/* Trader stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Portfolio" value={wallet.totalPortfolio} prefix="$" decimals={0} icon={<TrendingUp size={14} />} />
        <StatCard label="Total Trades" value={1284} delta="Since 2023" icon={<Briefcase size={14} />} />
        <StatCard label="Win Rate" value={72} suffix="%" delta="All time" icon={<Award size={14} />} />
        <StatCard label="Streak" value={user.streakDays} suffix=" days" delta="Consecutive" icon={<Star size={14} />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Personal info */}
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Personal Information" action={<button className="text-xs text-brand hover:underline">Edit</button>} />
          <div className="grid md:grid-cols-2 gap-3">
            {[
              ["Full Name", user.name],
              ["Email", user.email],
              ["Phone", "+27 82 555 0123"],
              ["Date of Birth", "Apr 14, 1992"],
              ["Nationality", "South African"],
              ["Country of Residence", "South Africa"],
              ["City", "Cape Town"],
              ["Postal Code", "8001"],
              ["Occupation", "Full-time Trader"],
              ["Annual Income", "$50k – $100k"],
              ["Trading Experience", "5+ years"],
              ["Risk Tolerance", "Moderate–High"],
            ].map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                <div className="text-sm font-medium mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Verification */}
        <GlassCard className="p-5">
          <SectionTitle title="Verification Level" />
          <div className="text-center">
            <div className="h-20 w-20 mx-auto rounded-2xl brand-gradient grid place-items-center text-brand-foreground shadow-glow">
              <Shield size={28} />
            </div>
            <div className="mt-3 text-lg font-bold">Level 3 · Elite</div>
            <div className="text-[10px] text-muted-foreground">Full access to all features</div>
            <div className="mt-4 space-y-2 text-left">
              {[
                ["Email verified", true],
                ["Phone verified", true],
                ["Identity verified", true],
                ["Address verified", true],
                ["Enhanced due diligence", true],
              ].map(([l, ok]) => (
                <div key={l as string} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span className="text-muted-foreground">{l as string}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Documents */}
      <GlassCard className="p-5">
        <SectionTitle title="Uploaded Documents" action={<button className="text-xs px-3 py-1.5 rounded-lg brand-gradient text-brand-foreground">Upload New</button>} />
        <div className="grid md:grid-cols-2 gap-3">
          {documents.map((d) => (
            <div key={d.name} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><FileText size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2">{d.name} <CheckCircle2 size={11} className="text-emerald-400" /></div>
                <div className="text-[10px] text-muted-foreground">{d.type} · Uploaded {d.date}</div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400">{d.status}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Trading profile + Achievements */}
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <SectionTitle title="Trading Profile" />
          <div className="space-y-3">
            {[
              ["Preferred Markets", ["Forex", "Metals", "Indices"]],
              ["Preferred Strategies", ["Smart Money", "Trend Following", "Breakout"]],
              ["Trading Sessions", ["London", "New York"]],
              ["Broker", ["IC Markets", "FTMO", "LEGIONFX Prop"]],
            ].map(([k, arr]) => (
              <div key={k as string}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{k as string}</div>
                <div className="flex flex-wrap gap-1.5">
                  {(arr as string[]).map((t) => <span key={t} className="text-[11px] px-2.5 py-1 rounded-full glass text-brand border border-brand/20">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Achievements" subtitle="Milestones you've unlocked" />
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((a) => (
              <div key={a.label} className={`rounded-xl p-4 text-center border ${a.earned ? "brand-gradient border-brand/30 text-brand-foreground shadow-glow" : "glass border-white/5 opacity-40"}`}>
                <Award size={20} className="mx-auto" />
                <div className="text-[10px] font-semibold mt-2">{a.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Danger zone */}
      <GlassCard className="p-5 border border-rose-500/20">
        <SectionTitle title="Danger Zone" subtitle="Irreversible account actions" />
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-4">
            <div className="text-sm font-semibold">Deactivate Account</div>
            <div className="text-[10px] text-muted-foreground mt-1">Temporarily disable your account. You can reactivate at any time.</div>
            <button className="mt-3 px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs text-rose-400">Deactivate</button>
          </div>
          <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-4">
            <div className="text-sm font-semibold">Delete Account</div>
            <div className="text-[10px] text-muted-foreground mt-1">Permanently remove your account and all associated data.</div>
            <button className="mt-3 px-3 py-1.5 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white text-xs font-medium">Delete Account</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

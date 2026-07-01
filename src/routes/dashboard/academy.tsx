import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  GraduationCap, PlayCircle, Award, Calendar, Clock, BookOpen, CheckCircle2,
  Lock, Star, TrendingUp, Users, Video, FileText, Download,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle } from "@/components/dashboard/primitives";
import { academy } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard/academy")({
  ssr: false,
  component: AcademyPage,
});

const courses = [
  { title: "Forex Mastery", level: "Intermediate", lessons: 40, done: 26, hours: "18h", instructor: "Marcus Vale", progress: 65, featured: true },
  { title: "Smart Money Concepts", level: "Advanced", lessons: 32, done: 18, hours: "14h", instructor: "Elena Cross", progress: 56 },
  { title: "Prop Firm Blueprint", level: "Advanced", lessons: 24, done: 24, hours: "12h", instructor: "James Okafor", progress: 100 },
  { title: "Risk & Psychology", level: "All Levels", lessons: 18, done: 8, hours: "8h", instructor: "Dr. Sarah Kim", progress: 44 },
  { title: "Algo Trading with Python", level: "Advanced", lessons: 28, done: 0, hours: "22h", instructor: "David Liu", progress: 0 },
  { title: "Crypto Futures", level: "Intermediate", lessons: 22, done: 0, hours: "10h", instructor: "Alex Rivera", progress: 0 },
];

const lessons = [
  { n: 1, title: "Market Structure Fundamentals", duration: "24 min", done: true },
  { n: 2, title: "Support & Resistance Zones", duration: "18 min", done: true },
  { n: 3, title: "Trend Analysis Frameworks", duration: "32 min", done: true },
  { n: 4, title: "Fibonacci Retracements", duration: "28 min", done: true },
  { n: 5, title: "Institutional Order Blocks", duration: "45 min", done: false, current: true },
  { n: 6, title: "Liquidity Pools & Sweeps", duration: "38 min", done: false },
  { n: 7, title: "Advanced Confluence Setups", duration: "52 min", done: false, locked: true },
];

const mentors = [
  { name: "Marcus Vale", role: "Head Mentor · 12yr FX", rating: 4.9, students: 1284, next: "Tue Jul 1 · 4PM" },
  { name: "Elena Cross", role: "SMC Specialist", rating: 4.8, students: 892, next: "Wed Jul 2 · 6PM" },
  { name: "James Okafor", role: "Prop Firm Coach", rating: 4.9, students: 640, next: "Thu Jul 3 · 3PM" },
];

const certificates = [
  { title: "Trading Fundamentals", date: "Jan 2026" },
  { title: "Prop Firm Blueprint", date: "Apr 2026" },
  { title: "Risk Management Pro", date: "May 2026" },
];

function AcademyPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Academy & Mentorship</h1>
        <p className="text-sm text-muted-foreground mt-1">Master the markets with structured courses and 1-on-1 mentorship.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Course Completion" value={academy.completion} suffix="%" delta={academy.currentCourse} icon={<GraduationCap size={14} />} />
        <StatCard label="Lessons Completed" value={academy.lessons.done} delta={`of ${academy.lessons.total}`} icon={<BookOpen size={14} />} />
        <StatCard label="Certificates" value={academy.certificates} delta="Verified" icon={<Award size={14} />} />
        <StatCard label="Mentor Credits" value={4} delta="Redeemable" icon={<Users size={14} />} />
      </div>

      {/* Featured course */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand">Continue Learning</div>
            <h2 className="text-2xl font-bold mt-2">{academy.currentCourse}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg">Master institutional trading concepts, smart money flow, and high-probability setups used by professional traders.</p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5"><Clock size={12} className="text-brand" /> 18 hours</div>
              <div className="flex items-center gap-1.5"><Video size={12} className="text-brand" /> {academy.lessons.total} lessons</div>
              <div className="flex items-center gap-1.5"><Users size={12} className="text-brand" /> 1,284 students</div>
              <div className="flex items-center gap-1.5"><Star size={12} className="text-amber-400 fill-current" /> 4.9 rating</div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-2"><span>Progress</span><span className="text-brand font-semibold">{academy.completion}%</span></div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${academy.completion}%` }} transition={{ duration: 1 }} className="h-full brand-gradient" />
              </div>
            </div>
            <button className="mt-5 px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2 shadow-glow"><PlayCircle size={15} /> Continue Lesson 5</button>
          </div>
          <div className="hidden lg:block">
            <div className="w-64 h-40 rounded-2xl glass-strong grid place-items-center relative overflow-hidden">
              <div className="absolute inset-0 brand-gradient opacity-30" />
              <PlayCircle size={48} className="text-brand-foreground relative" />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Lessons + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <SectionTitle title="Course Lessons" subtitle={`${academy.currentCourse} · Module 1`} />
          <div className="space-y-2">
            {lessons.map((l) => (
              <div key={l.n} className={`flex items-center gap-3 p-3 rounded-xl transition ${l.current ? "bg-brand/10 border border-brand/20" : "bg-white/[0.03] hover:bg-white/5 border border-white/5"}`}>
                <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${l.done ? "bg-emerald-400/10 text-emerald-400" : l.locked ? "bg-white/5 text-muted-foreground" : "brand-gradient text-brand-foreground"}`}>
                  {l.done ? <CheckCircle2 size={16} /> : l.locked ? <Lock size={14} /> : <PlayCircle size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">Lesson {l.n} · {l.title}</div>
                  <div className="text-[10px] text-muted-foreground">{l.duration}</div>
                </div>
                {l.current && <span className="text-[10px] px-2 py-0.5 rounded-full brand-gradient text-brand-foreground font-semibold">NOW</span>}
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <SectionTitle title="Next Mentor Session" />
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-2xl brand-gradient grid place-items-center text-2xl font-bold text-brand-foreground">MV</div>
              <div className="mt-3 font-semibold text-sm">Marcus Vale</div>
              <div className="text-[10px] text-muted-foreground">Head Trading Mentor</div>
              <div className="mt-3 p-3 rounded-xl bg-white/[0.03]">
                <div className="text-[10px] text-muted-foreground uppercase">Scheduled</div>
                <div className="text-sm font-semibold mt-1">{academy.nextSession}</div>
              </div>
              <button className="mt-3 w-full py-2 rounded-xl brand-gradient text-brand-foreground text-xs font-medium">Join Session</button>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionTitle title="Your Certificates" />
            <div className="space-y-2">
              {certificates.map((c) => (
                <div key={c.title} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="h-9 w-9 rounded-lg brand-gradient grid place-items-center text-brand-foreground"><Award size={14} /></div>
                  <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{c.title}</div><div className="text-[10px] text-muted-foreground">{c.date}</div></div>
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground"><Download size={12} /></button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* All courses */}
      <div>
        <SectionTitle title="All Courses" subtitle="Browse the full LEGIONFX curriculum" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <GlassCard key={c.title} className="p-5 hover-lift">
              <div className="h-32 rounded-xl brand-gradient relative overflow-hidden mb-4">
                <div className="absolute inset-0 grid place-items-center text-brand-foreground opacity-90"><BookOpen size={32} /></div>
                {c.featured && <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white font-semibold">FEATURED</span>}
              </div>
              <div className="text-[10px] text-brand uppercase tracking-wider">{c.level}</div>
              <div className="text-sm font-semibold mt-1">{c.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">by {c.instructor} · {c.lessons} lessons · {c.hours}</div>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">{c.done}/{c.lessons}</span><span className="text-brand font-semibold">{c.progress}%</span></div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full brand-gradient" style={{ width: `${c.progress}%` }} /></div>
              </div>
              <button className="mt-4 w-full py-2 rounded-xl glass hover:bg-white/10 text-xs font-medium">{c.progress === 100 ? "Review" : c.progress === 0 ? "Start" : "Continue"}</button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Mentors */}
      <div>
        <SectionTitle title="Meet Your Mentors" subtitle="Book 1-on-1 sessions with professional traders" />
        <div className="grid md:grid-cols-3 gap-4">
          {mentors.map((m) => (
            <GlassCard key={m.name} className="p-5 text-center hover-lift">
              <div className="h-20 w-20 mx-auto rounded-2xl brand-gradient grid place-items-center text-2xl font-bold text-brand-foreground shadow-glow">{m.name.split(" ").map(n => n[0]).join("")}</div>
              <div className="mt-3 font-semibold text-sm">{m.name}</div>
              <div className="text-[10px] text-muted-foreground">{m.role}</div>
              <div className="flex justify-center gap-3 mt-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Star size={9} className="text-amber-400 fill-current" /> {m.rating}</span>
                <span className="flex items-center gap-1"><Users size={9} /> {m.students}</span>
              </div>
              <div className="mt-3 p-2 rounded-lg bg-white/[0.03] text-[10px]"><Calendar size={10} className="inline mr-1 text-brand" /> Next: {m.next}</div>
              <button className="mt-3 w-full py-2 rounded-xl brand-gradient text-brand-foreground text-xs font-medium">Book Session</button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Resources */}
      <GlassCard className="p-5">
        <SectionTitle title="Downloadable Resources" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {["Trading Journal Template", "SMC Cheat Sheet", "Risk Calculator", "Session Timings PDF"].map((r) => (
            <div key={r} className="rounded-xl bg-white/[0.03] border border-white/5 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg brand-gradient grid place-items-center text-brand-foreground"><FileText size={16} /></div>
              <div className="flex-1 text-xs font-medium">{r}</div>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground"><Download size={13} /></button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

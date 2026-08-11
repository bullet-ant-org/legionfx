import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  GraduationCap, PlayCircle, Award, Calendar, Clock, BookOpen, CheckCircle2,
  Lock, Star, Users, Video, FileText, Download,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle } from "@/components/dashboard/primitives";
import { useDashboardData } from "@/lib/dashboard-data";
import { api, ApiError } from "@/lib/api";

export const Route = createFileRoute("/dashboard/academy")({
  ssr: false,
  component: AcademyPage,
});

type Course = { _id: string; title: string; description: string; lessonCount: number; price: number };

// No mentor-booking or downloadable-resource backend exists yet, so these
// stay illustrative rather than pretending real scheduling/files are wired up.
const mentors = [
  { name: "Marcus Vale", role: "Head Mentor · 12yr FX", rating: 4.9, students: 1284, next: "Tue Jul 1 · 4PM" },
  { name: "Elena Cross", role: "SMC Specialist", rating: 4.8, students: 892, next: "Wed Jul 2 · 6PM" },
  { name: "James Okafor", role: "Prop Firm Coach", rating: 4.9, students: 640, next: "Thu Jul 3 · 3PM" },
];

function AcademyPage() {
  const { enrollments, loading, refresh } = useDashboardData();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [advancingId, setAdvancingId] = useState<string | null>(null);

  useEffect(() => {
    api.getCourses()
      .then((r) => setCourses(r.courses))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load courses"))
      .finally(() => setCoursesLoading(false));
  }, []);

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course?._id).filter(Boolean));
  const primary = enrollments[0] ?? null;
  const totalLessonsDone = enrollments.reduce((a, e) => a + ((e.lessonsDone as number) ?? 0), 0);
  const totalLessons = enrollments.reduce((a, e) => a + (e.course?.lessonCount ?? 0), 0);
  const avgCompletion = enrollments.length ? Math.round(enrollments.reduce((a, e) => a + e.completion, 0) / enrollments.length) : 0;
  const certificateCount = enrollments.filter((e) => e.certificateEarned).length;

  const primaryLessons = useMemo(() => {
    if (!primary) return [];
    const total = primary.course?.lessonCount ?? 0;
    const done = (primary.lessonsDone as number) ?? 0;
    return Array.from({ length: total }, (_, i) => ({
      n: i + 1,
      done: i < done,
      current: i === done,
      locked: i > done,
    }));
  }, [primary]);

  const enroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await api.enrollCourse(courseId);
      toast.success("Enrolled — good luck!");
      refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not enroll in this course");
    } finally {
      setEnrollingId(null);
    }
  };

  const advance = async (enrollmentId: string, currentDone: number) => {
    setAdvancingId(enrollmentId);
    try {
      await api.updateEnrollmentProgress(enrollmentId, currentDone + 1);
      toast.success("Lesson marked complete");
      refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update progress");
    } finally {
      setAdvancingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Academy & Mentorship</h1>
        <p className="text-sm text-muted-foreground mt-1">Master the markets with structured courses and 1-on-1 mentorship.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl glass animate-pulse" />)
        ) : (
          <>
            <StatCard label="Avg Completion" value={avgCompletion} suffix="%" delta={`${enrollments.length} course${enrollments.length === 1 ? "" : "s"}`} icon={<GraduationCap size={14} />} />
            <StatCard label="Lessons Completed" value={totalLessonsDone} delta={`of ${totalLessons}`} icon={<BookOpen size={14} />} />
            <StatCard label="Certificates" value={certificateCount} delta="Earned" icon={<Award size={14} />} />
            <StatCard label="Mentor Credits" value={4} delta="Redeemable" icon={<Users size={14} />} />
          </>
        )}
      </div>

      {/* Featured / continue learning */}
      {primary ? (
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand">Continue Learning</div>
              <h2 className="text-2xl font-bold mt-2">{primary.course?.title ?? "Course"}</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">{primary.course?.description || "Keep going — every lesson completed brings you closer to your certificate."}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1.5"><Video size={12} className="text-brand" /> {primary.course?.lessonCount ?? 0} lessons</div>
                <div className="flex items-center gap-1.5"><BookOpen size={12} className="text-brand" /> {(primary.lessonsDone as number) ?? 0} completed</div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2"><span>Progress</span><span className="text-brand font-semibold">{primary.completion}%</span></div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${primary.completion}%` }} transition={{ duration: 1 }} className="h-full brand-gradient" />
                </div>
              </div>
              <button
                onClick={() => advance(primary._id, (primary.lessonsDone as number) ?? 0)}
                disabled={advancingId === primary._id || primary.completion >= 100}
                className="mt-5 px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2 shadow-glow disabled:opacity-50"
              >
                <PlayCircle size={15} /> {primary.completion >= 100 ? "Course complete" : advancingId === primary._id ? "Saving…" : `Continue Lesson ${((primary.lessonsDone as number) ?? 0) + 1}`}
              </button>
            </div>
            <div className="hidden lg:block">
              <div className="w-64 h-40 rounded-2xl glass-strong grid place-items-center relative overflow-hidden">
                <div className="absolute inset-0 brand-gradient opacity-30" />
                <PlayCircle size={48} className="text-brand-foreground relative" />
              </div>
            </div>
          </div>
        </GlassCard>
      ) : !loading ? (
        <GlassCard className="p-10 text-center">
          <GraduationCap size={22} className="mx-auto text-brand" />
          <div className="mt-3 text-sm font-medium">Not enrolled in any course yet</div>
          <div className="text-xs text-muted-foreground mt-1">Browse the curriculum below to get started.</div>
        </GlassCard>
      ) : null}

      {/* Lessons + Sidebar */}
      {primary && (
        <div className="grid lg:grid-cols-3 gap-4">
          <GlassCard className="lg:col-span-2 p-5">
            <SectionTitle title="Course Lessons" subtitle={primary.course?.title ?? "Course"} />
            <div className="space-y-2">
              {primaryLessons.map((l) => (
                <div key={l.n} className={`flex items-center gap-3 p-3 rounded-xl transition ${l.current ? "bg-brand/10 border border-brand/20" : "bg-white/[0.03] hover:bg-white/5 border border-white/5"}`}>
                  <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${l.done ? "bg-emerald-400/10 text-emerald-400" : l.locked ? "bg-white/5 text-muted-foreground" : "brand-gradient text-brand-foreground"}`}>
                    {l.done ? <CheckCircle2 size={16} /> : l.locked ? <Lock size={14} /> : <PlayCircle size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">Lesson {l.n}</div>
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
                  <div className="text-sm font-semibold mt-1">Tue Jul 1 · 4PM</div>
                </div>
                <button onClick={() => toast.info("Mentor session booking is coming soon.")} className="mt-3 w-full py-2 rounded-xl brand-gradient text-brand-foreground text-xs font-medium">Join Session</button>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <SectionTitle title="Your Certificates" />
              {certificateCount === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-4">Complete a course to earn your first certificate.</div>
              ) : (
                <div className="space-y-2">
                  {enrollments.filter((e) => e.certificateEarned).map((e) => (
                    <div key={e._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="h-9 w-9 rounded-lg brand-gradient grid place-items-center text-brand-foreground"><Award size={14} /></div>
                      <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{e.course?.title ?? "Course"}</div></div>
                      <button onClick={() => toast.info("Certificate downloads are coming soon.")} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground"><Download size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {/* All courses */}
      <div>
        <SectionTitle title="All Courses" subtitle="Browse the full LEGIONFX curriculum" />
        {coursesLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 rounded-2xl glass animate-pulse" />)}
          </div>
        ) : courses.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-muted-foreground">No courses are published yet.</GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => {
              const enrollment = enrollments.find((e) => e.course?._id === c._id);
              const enrolled = enrolledCourseIds.has(c._id);
              return (
                <GlassCard key={c._id} className="p-5 hover-lift">
                  <div className="h-32 rounded-xl brand-gradient relative overflow-hidden mb-4">
                    <div className="absolute inset-0 grid place-items-center text-brand-foreground opacity-90"><BookOpen size={32} /></div>
                  </div>
                  <div className="text-[10px] text-brand uppercase tracking-wider">{c.price > 0 ? `$${c.price}` : "Free"}</div>
                  <div className="text-sm font-semibold mt-1">{c.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{c.description || `${c.lessonCount} lessons`}</div>
                  {enrollment && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">{(enrollment.lessonsDone as number) ?? 0}/{c.lessonCount}</span><span className="text-brand font-semibold">{enrollment.completion}%</span></div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full brand-gradient" style={{ width: `${enrollment.completion}%` }} /></div>
                    </div>
                  )}
                  <button
                    onClick={() => enroll(c._id)}
                    disabled={enrolled || enrollingId === c._id}
                    className="mt-4 w-full py-2 rounded-xl glass hover:bg-white/10 text-xs font-medium disabled:opacity-60"
                  >
                    {enrolled ? (enrollment && enrollment.completion >= 100 ? "Completed" : "Enrolled") : enrollingId === c._id ? "Enrolling…" : c.price > 0 ? `Enroll · $${c.price}` : "Enroll Free"}
                  </button>
                </GlassCard>
              );
            })}
          </div>
        )}
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
              <button onClick={() => toast.info("Mentor session booking is coming soon.")} className="mt-3 w-full py-2 rounded-xl brand-gradient text-brand-foreground text-xs font-medium">Book Session</button>
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
              <button onClick={() => toast.info("Downloads are coming soon.")} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground"><Download size={13} /></button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

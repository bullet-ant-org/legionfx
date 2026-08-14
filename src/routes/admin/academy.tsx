import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GraduationCap, Users } from "lucide-react";
import { GlassCard, Modal, Field, inputCls, StatCard, StatusPill } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminCourse } from "@/lib/api";

export const Route = createFileRoute("/admin/academy")({ ssr: false, component: AcademyAdminPage });

function AcademyAdminPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.listCourses()
      .then((r) => setCourses(r.courses))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load courses"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const togglePublished = async (c: AdminCourse) => {
    try {
      const { course } = await adminApi.updateCourse(c._id, { published: !c.published });
      setCourses((list) => list.map((x) => (x._id === c._id ? { ...x, ...course } : x)));
      toast.success(course.published ? "Course published" : "Course unpublished");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update course");
    }
  };

  const remove = async (id: string) => {
    try {
      await adminApi.deleteCourse(id);
      setCourses((list) => list.filter((x) => x._id !== id));
      toast.success("Course removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete course");
    }
  };

  const save = async (data: { title: string; description: string; lessonCount: number; price: number }) => {
    try {
      if (editing) {
        const { course } = await adminApi.updateCourse(editing._id, data);
        setCourses((list) => list.map((x) => (x._id === editing._id ? { ...x, ...course } : x)));
        toast.success("Course updated");
      } else {
        const { course } = await adminApi.createCourse(data);
        setCourses((list) => [{ ...course, students: 0 }, ...list]);
        toast.success("Course created");
      }
      setEditing(null); setAddOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save course");
    }
  };

  const totalStudents = courses.reduce((a, c) => a + c.students, 0);
  const totalRevenue = courses.reduce((a, c) => a + c.students * c.price, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Courses" value={courses.length}/>
        <StatCard label="Published" value={courses.filter(c=>c.published).length}/>
        <StatCard label="Students" value={totalStudents} icon={<Users size={14}/>}/>
        <StatCard label="Est. Revenue" value={totalRevenue} prefix="$"/>
      </div>

      <GlassCard className="p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Courses</div>
          <div className="text-xs text-muted-foreground">Manage the Academy curriculum.</div>
        </div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Course</button>
      </GlassCard>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-52 rounded-2xl glass animate-pulse"/>)}</div>
      ) : courses.length === 0 ? (
        <GlassCard className="p-10 text-center"><GraduationCap size={22} className="mx-auto text-brand"/><div className="mt-3 text-sm font-medium">No courses yet</div></GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <GlassCard key={c._id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><GraduationCap size={16}/></div>
                <StatusPill status={c.published ? "Completed" : "Failed"}/>
              </div>
              <div className="mt-3 text-sm font-semibold">{c.title}</div>
              <div className="text-[11px] text-muted-foreground line-clamp-2 mt-1">{c.description || `${c.lessonCount} lessons`}</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px]">Lessons</div><div className="font-semibold">{c.lessonCount}</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px]">Price</div><div className="font-semibold">{c.price > 0 ? `$${c.price}` : "Free"}</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px]">Students</div><div className="font-semibold">{c.students}</div></div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="flex-1 flex items-center justify-between text-[10px] text-muted-foreground rounded-lg bg-white/[0.03] px-2 py-1.5">
                  Published <input type="checkbox" checked={c.published} onChange={() => togglePublished(c)} className="accent-[oklch(0.70_0.19_47)]"/>
                </label>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setEditing(c)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs inline-flex items-center justify-center gap-1.5"><Pencil size={12}/> Edit</button>
                <button onClick={() => remove(c._id)} data-no-toast className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs inline-flex items-center justify-center gap-1.5"><Trash2 size={12}/> Delete</button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <CourseModal open={!!editing || addOpen} onClose={() => { setEditing(null); setAddOpen(false); }} initial={editing} onSave={save}/>
    </div>
  );
}

function CourseModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: AdminCourse | null; onSave: (d: { title: string; description: string; lessonCount: number; price: number }) => void }) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit course" : "Add course"}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSave({
          title: String(fd.get("title") || ""),
          description: String(fd.get("description") || ""),
          lessonCount: Number(fd.get("lessonCount") || 0),
          price: Number(fd.get("price") || 0),
        });
      }} className="space-y-3">
        <Field label="Title"><input name="title" required defaultValue={initial?.title} className={inputCls} placeholder="Smart Money Concepts"/></Field>
        <Field label="Description"><textarea name="description" rows={3} defaultValue={initial?.description} className={inputCls}/></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Lesson count"><input name="lessonCount" type="number" defaultValue={initial?.lessonCount ?? 10} className={inputCls}/></Field>
          <Field label="Price ($, 0 = free)"><input name="price" type="number" defaultValue={initial?.price ?? 0} className={inputCls}/></Field>
        </div>
        <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{initial ? "Save changes" : "Create course"}</button>
      </form>
    </Modal>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { GlassCard, Modal, Field, inputCls, StatusPill, StatCard } from "@/components/dashboard/primitives";
import { adminCourses, type AdminCourse } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/academy")({ component: AcademyPage });

function AcademyPage() {
  const [courses, setCourses] = useState<AdminCourse[]>(adminCourses);
  const [edit, setEdit] = useState<AdminCourse | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const remove = (id: string) => { setCourses(c => c.filter(x => x.id !== id)); toast.success("Course removed"); };
  const publishToggle = (id: string) => { setCourses(c => c.map(x => x.id === id ? { ...x, status: x.status === "Published" ? "Draft" : "Published" } : x)); toast.success("Publish status updated"); };
  const save = (c: AdminCourse) => { setCourses(list => list.some(x=>x.id===c.id) ? list.map(x=>x.id===c.id?c:x) : [c, ...list]); setEdit(null); setAddOpen(false); toast.success("Course saved"); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Courses" value={courses.length}/>
        <StatCard label="Published" value={courses.filter(c=>c.status==="Published").length}/>
        <StatCard label="Students" value={courses.reduce((a,b)=>a+b.students,0)} delta="+124 wk"/>
        <StatCard label="Revenue" value={courses.reduce((a,b)=>a+b.students*b.price,0)} prefix="$"/>
      </div>

      <GlassCard className="p-4 flex items-center justify-between">
        <div className="text-sm font-semibold">Academy Catalog</div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Course</button>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-4">
        {courses.map(c => (
          <GlassCard key={c.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground">Mentor: {c.mentor} · {c.lessons} lessons</div>
              </div>
              <StatusPill status={c.status === "Published" ? "Completed" : c.status === "Archived" ? "Failed" : "Pending"}/>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="glass rounded-lg p-2 text-center"><div className="text-[10px] text-muted-foreground">Price</div><div className="font-semibold">${c.price}</div></div>
              <div className="glass rounded-lg p-2 text-center"><div className="text-[10px] text-muted-foreground">Students</div><div className="font-semibold">{c.students}</div></div>
              <div className="glass rounded-lg p-2 text-center"><div className="text-[10px] text-muted-foreground">Revenue</div><div className="font-semibold text-brand">${(c.students*c.price).toLocaleString()}</div></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button onClick={() => publishToggle(c.id)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs">{c.status === "Published" ? "Unpublish" : "Publish"}</button>
              <button onClick={() => setEdit(c)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs inline-flex items-center justify-center gap-1"><Pencil size={12}/> Edit</button>
              <button onClick={() => remove(c.id)} data-no-toast className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs inline-flex items-center justify-center gap-1"><Trash2 size={12}/></button>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal open={!!edit || addOpen} onClose={() => { setEdit(null); setAddOpen(false); }} title={edit ? "Edit course" : "Add course"}>
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          save({ id: edit?.id || `crs-${Date.now()}`, title: String(fd.get("title")||""), mentor: String(fd.get("mentor")||""), price: Number(fd.get("price")||0), students: edit?.students ?? 0, status: (fd.get("status") as AdminCourse["status"]) || "Draft", lessons: Number(fd.get("lessons")||0) });
        }} className="space-y-3">
          <Field label="Title"><input name="title" required defaultValue={edit?.title} className={inputCls}/></Field>
          <Field label="Mentor"><input name="mentor" defaultValue={edit?.mentor} className={inputCls}/></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price"><input name="price" type="number" defaultValue={edit?.price ?? 199} className={inputCls}/></Field>
            <Field label="Lessons"><input name="lessons" type="number" defaultValue={edit?.lessons ?? 20} className={inputCls}/></Field>
            <Field label="Status"><select name="status" defaultValue={edit?.status || "Draft"} className={inputCls}>{["Published","Draft","Archived"].map(s=><option key={s}>{s}</option>)}</select></Field>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{edit ? "Save course" : "Add course"}</button>
        </form>
      </Modal>
    </div>
  );
}

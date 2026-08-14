import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, MoreVertical, UserPlus, ShieldCheck, ShieldOff, Trash2, Mail } from "lucide-react";
import { GlassCard, SectionTitle, StatusPill, Modal, Field, inputCls } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminUser } from "@/lib/api";

export const Route = createFileRoute("/admin/users")({ ssr: false, component: UsersPage });

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [planFilter, setPlanFilter] = useState<string>("All");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState<AdminUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<AdminUser | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.listUsers({ q, status: statusFilter, plan: planFilter })
      .then((r) => setUsers(r.users))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load users"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter, planFilter]);
  // Debounce search
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const filtered = useMemo(() => users, [users]);

  const toggleStatus = async (u: AdminUser) => {
    const next = u.status === "Active" ? "Suspended" : "Active";
    try {
      const { user } = await adminApi.updateUserStatus(u._id, next);
      setUsers((list) => list.map((x) => (x._id === u._id ? user : x)));
      setSelected((s) => (s && s._id === u._id ? user : s));
      toast.success("User status updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update status");
    }
  };

  const verifyKyc = async (u: AdminUser) => {
    try {
      const { user } = await adminApi.verifyUserKyc(u._id);
      setUsers((list) => list.map((x) => (x._id === u._id ? user : x)));
      setSelected((s) => (s && s._id === u._id ? user : s));
      toast.success("KYC verified");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not verify KYC");
    }
  };

  const removeUser = async (u: AdminUser) => {
    try {
      await adminApi.deleteUser(u._id);
      setUsers((cur) => cur.filter((x) => x._id !== u._id));
      setDeleteOpen(null); setSelected(null);
      toast.success(`Deleted ${u.name}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete user");
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or email…" className={`${inputCls} pl-10`}/>
        </div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className={`${inputCls} w-auto`}>
          {["All","Active","Suspended","Pending"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={planFilter} onChange={e=>setPlanFilter(e.target.value)} className={`${inputCls} w-auto`}>
          {["All","Starter","Pro","Elite","Enterprise"].map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><UserPlus size={14}/> Add User</button>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
              <tr>
                {["User","Plan","Status","KYC","Country","Joined",""].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">Loading users…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">No users match your filters.</td></tr>
              ) : filtered.map(u => (
                <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg brand-gradient grid place-items-center text-brand-foreground text-xs font-semibold">{u.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
                      <div className="min-w-0"><div className="font-medium truncate">{u.name}</div><div className="text-[10px] text-muted-foreground truncate">{u.email}</div></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] border border-white/10">{u.plan}</span></td>
                  <td className="px-4 py-3"><StatusPill status={u.status === "Suspended" ? "Failed" : u.status === "Pending" ? "Pending" : "Completed"}/></td>
                  <td className="px-4 py-3"><StatusPill status={u.kyc === "Verified" ? "Completed" : u.kyc === "Rejected" ? "Failed" : "Pending"}/></td>
                  <td className="px-4 py-3 text-xs">{(u.country as string) || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.createdAt as string).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(u)} data-no-toast className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Actions"><MoreVertical size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Manage ${selected.name}` : ""} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Info label="Email" value={selected.email}/>
              <Info label="User ID" value={selected._id}/>
              <Info label="Country" value={(selected.country as string) || "—"}/>
              <Info label="Plan" value={selected.plan as string}/>
              <Info label="Status" value={selected.status as string}/>
              <Info label="KYC" value={selected.kyc as string}/>
              <Info label="Joined" value={new Date(selected.createdAt as string).toLocaleDateString()}/>
              <Info label="Role" value={selected.role}/>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <button data-no-toast onClick={() => verifyKyc(selected)} disabled={selected.kyc === "Verified"} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"><ShieldCheck size={14}/> Verify KYC</button>
              <button data-no-toast onClick={() => toggleStatus(selected)} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center justify-center gap-2"><ShieldOff size={14}/> {selected.status === "Active" ? "Suspend" : "Activate"}</button>
              <button onClick={() => setEmailOpen(selected)} data-no-toast className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center justify-center gap-2"><Mail size={14}/> Email User</button>
              <button onClick={() => setDeleteOpen(selected)} data-no-toast className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm inline-flex items-center justify-center gap-2"><Trash2 size={14}/> Delete</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Email modal */}
      <Modal open={!!emailOpen} onClose={() => setEmailOpen(null)} title={emailOpen ? `Email ${emailOpen.name}` : ""}>
        {emailOpen && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try {
              await adminApi.emailUser(emailOpen._id, String(fd.get("subject") || ""), String(fd.get("message") || ""));
              toast.success("Notification sent to user");
              setEmailOpen(null);
            } catch (err) {
              toast.error(err instanceof ApiError ? err.message : "Could not send");
            }
          }} className="space-y-3">
            <p className="text-[11px] text-muted-foreground -mt-1">Delivered as an in-app notification for now — real email delivery isn't wired up yet.</p>
            <Field label="Subject"><input name="subject" required className={inputCls} defaultValue="Update from LEGIONFX"/></Field>
            <Field label="Message"><textarea name="message" required rows={5} className={inputCls}/></Field>
            <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Send</button>
          </form>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteOpen} onClose={() => setDeleteOpen(null)} title="Delete user?">
        <p className="text-sm text-muted-foreground">This will permanently delete <span className="text-foreground font-medium">{deleteOpen?.name}</span> and all their data.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => setDeleteOpen(null)} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
          <button data-no-toast onClick={() => deleteOpen && removeUser(deleteOpen)} className="py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-medium">Delete</button>
        </div>
      </Modal>

      {/* Add user */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add new user">
        <form onSubmit={async (e)=>{
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          try {
            await adminApi.createUser({
              name: String(fd.get("name") || ""),
              email: String(fd.get("email") || ""),
              password: String(fd.get("password") || ""),
              plan: String(fd.get("plan") || "Starter"),
            });
            toast.success("User created");
            setAddOpen(false);
            load();
          } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Could not create user");
          }
        }} className="space-y-3">
          <Field label="Full Name"><input name="name" required className={inputCls}/></Field>
          <Field label="Email"><input name="email" type="email" required className={inputCls}/></Field>
          <Field label="Temporary Password"><input name="password" type="password" required minLength={8} className={inputCls}/></Field>
          <Field label="Plan"><select name="plan" className={inputCls}>{["Starter","Pro","Elite","Enterprise"].map(p=><option key={p}>{p}</option>)}</select></Field>
          <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Create user</button>
        </form>
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div><div className="text-sm mt-1 font-medium">{value}</div></div>
  );
}

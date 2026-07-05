import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, MoreVertical, UserPlus, Download, ShieldCheck, ShieldOff, Trash2, Mail } from "lucide-react";
import { GlassCard, SectionTitle, StatusPill, Modal, Field, inputCls } from "@/components/dashboard/primitives";
import { adminUsers, type AdminUser } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [planFilter, setPlanFilter] = useState<string>("All");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState<AdminUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<AdminUser | null>(null);

  const filtered = useMemo(() => users.filter(u =>
    (statusFilter === "All" || u.status === statusFilter) &&
    (planFilter === "All" || u.plan === planFilter) &&
    (q === "" || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()) || u.id.toLowerCase().includes(q.toLowerCase()))
  ), [users, q, statusFilter, planFilter]);

  const toggleStatus = (id: string) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === "Active" ? "Suspended" : "Active" } : x));
    toast.success("User status updated");
  };
  const verifyKyc = (id: string) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, kyc: "Verified" } : x));
    toast.success("KYC verified");
  };
  const removeUser = (u: AdminUser) => {
    setUsers(cur => cur.filter(x => x.id !== u.id));
    setDeleteOpen(null); setSelected(null);
    toast.success(`Deleted ${u.name}`);
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email, ID…" className={`${inputCls} pl-10`}/>
        </div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className={`${inputCls} w-auto`}>
          {["All","Active","Suspended","Pending"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={planFilter} onChange={e=>setPlanFilter(e.target.value)} className={`${inputCls} w-auto`}>
          {["All","Starter","Pro","Elite","Enterprise"].map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => toast.success("Users exported (CSV)")} className="px-3.5 py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center gap-2"><Download size={14}/> Export</button>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><UserPlus size={14}/> Add User</button>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
              <tr>
                {["User","Country","Plan","Status","KYC","Balance","Joined","Last Login",""].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg brand-gradient grid place-items-center text-brand-foreground text-xs font-semibold">{u.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
                      <div className="min-w-0"><div className="font-medium truncate">{u.name}</div><div className="text-[10px] text-muted-foreground truncate">{u.email} · {u.id}</div></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">{u.country}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] border border-white/10">{u.plan}</span></td>
                  <td className="px-4 py-3"><StatusPill status={u.status === "Suspended" ? "Failed" : u.status === "Pending" ? "Pending" : "Completed"}/></td>
                  <td className="px-4 py-3"><StatusPill status={u.kyc === "Verified" ? "Completed" : u.kyc === "Rejected" ? "Failed" : "Pending"}/></td>
                  <td className="px-4 py-3 font-medium">${u.balance.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(u)} data-no-toast className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Actions"><MoreVertical size={14}/></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground text-sm">No users match your filters.</td></tr>}
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
              <Info label="User ID" value={selected.id}/>
              <Info label="Country" value={selected.country}/>
              <Info label="Plan" value={selected.plan}/>
              <Info label="Status" value={selected.status}/>
              <Info label="KYC" value={selected.kyc}/>
              <Info label="Balance" value={`$${selected.balance.toLocaleString()}`}/>
              <Info label="Joined" value={selected.joined}/>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <button onClick={() => { verifyKyc(selected.id); setSelected({ ...selected, kyc: "Verified" }); }} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center justify-center gap-2"><ShieldCheck size={14}/> Verify KYC</button>
              <button onClick={() => { toggleStatus(selected.id); setSelected({ ...selected, status: selected.status === "Active" ? "Suspended" : "Active" }); }} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center justify-center gap-2"><ShieldOff size={14}/> {selected.status === "Active" ? "Suspend" : "Activate"}</button>
              <button onClick={() => setEmailOpen(selected)} data-no-toast className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center justify-center gap-2"><Mail size={14}/> Email User</button>
              <button onClick={() => setDeleteOpen(selected)} data-no-toast className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm inline-flex items-center justify-center gap-2"><Trash2 size={14}/> Delete</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Email modal */}
      <Modal open={!!emailOpen} onClose={() => setEmailOpen(null)} title={emailOpen ? `Email ${emailOpen.name}` : ""}>
        <form onSubmit={(e)=>{e.preventDefault(); setEmailOpen(null); toast.success("Email sent");}} className="space-y-3">
          <Field label="Subject"><input required className={inputCls} defaultValue="Update from LEGIONFX"/></Field>
          <Field label="Message"><textarea required rows={5} className={inputCls}/></Field>
          <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Send</button>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteOpen} onClose={() => setDeleteOpen(null)} title="Delete user?">
        <p className="text-sm text-muted-foreground">This will permanently delete <span className="text-foreground font-medium">{deleteOpen?.name}</span> and all their data.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => setDeleteOpen(null)} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
          <button onClick={() => deleteOpen && removeUser(deleteOpen)} className="py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-medium">Delete</button>
        </div>
      </Modal>

      {/* Add user */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add new user">
        <form onSubmit={(e)=>{
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get("name") || "");
          const email = String(fd.get("email") || "");
          const plan = String(fd.get("plan") || "Starter") as AdminUser["plan"];
          const newU: AdminUser = { id: `USR-${1000 + users.length}`, name, email, country: "🇺🇸 US", plan, status: "Active", kyc: "Pending", balance: 0, joined: new Date().toISOString().slice(0,10), lastLogin: "just now" };
          setUsers([newU, ...users]);
          setAddOpen(false);
          toast.success(`Added ${name}`);
        }} className="space-y-3">
          <Field label="Full Name"><input name="name" required className={inputCls}/></Field>
          <Field label="Email"><input name="email" type="email" required className={inputCls}/></Field>
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

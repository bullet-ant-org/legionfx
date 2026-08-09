import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Copy, Wallet } from "lucide-react";
import { GlassCard, Modal, Field, inputCls } from "@/components/dashboard/primitives";
import { api, ApiError, type ApiDepositMethod } from "@/lib/api";

export const Route = createFileRoute("/admin/deposit-methods")({ ssr: false, component: DepositMethodsPage });

function DepositMethodsPage() {
  const [items, setItems] = useState<ApiDepositMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiDepositMethod | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = () => {
    setLoading(true);
    api.adminListDepositMethods()
      .then((r) => setItems(r.methods))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Failed to load deposit methods"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string) => {
    try {
      const { method } = await api.adminToggleDepositMethod(id);
      setItems((prev) => prev.map((m) => (m._id === id ? method : m)));
      toast.success("Deposit method updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update deposit method");
    }
  };

  const remove = async (id: string) => {
    try {
      await api.adminDeleteDepositMethod(id);
      setItems((prev) => prev.filter((m) => m._id !== id));
      toast.success("Deposit method removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove deposit method");
    }
  };

  const save = async (m: Omit<ApiDepositMethod, "_id"> & { _id?: string }) => {
    try {
      if (editing) {
        const { method } = await api.adminUpdateDepositMethod(editing._id, m);
        setItems((prev) => prev.map((x) => (x._id === editing._id ? method : x)));
        toast.success("Changes saved");
      } else {
        const { method } = await api.adminCreateDepositMethod(m);
        setItems((prev) => [method, ...prev]);
        toast.success("Deposit method added");
      }
      setEditing(null); setAddOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save deposit method");
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Deposit Methods</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Currencies and wallet addresses shown to clients inside the RexaPay crypto checkout.
          </div>
        </div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl bg-brand text-brand-foreground text-sm font-medium inline-flex items-center gap-2">
          <Plus size={14} /> Add Method
        </button>
      </GlassCard>

      {!loading && items.length === 0 && (
        <GlassCard className="p-10 text-center">
          <Wallet size={22} className="mx-auto text-brand" />
          <div className="mt-3 text-sm font-medium">No deposit methods configured</div>
          <div className="text-xs text-muted-foreground mt-1">Add a currency and wallet address to start accepting deposits.</div>
        </GlassCard>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-56 rounded-2xl glass animate-pulse" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((m) => (
            <GlassCard key={m._id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{m.currency} <span className="text-muted-foreground">· {m.symbol}</span></div>
                  <div className="text-[10px] uppercase tracking-widest text-brand mt-0.5">{m.network}</div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                  <span className="text-[10px] text-muted-foreground">{m.enabled ? "Live" : "Off"}</span>
                  <input type="checkbox" checked={m.enabled} onChange={() => toggle(m._id)} className="accent-[oklch(0.70_0.19_47)]" />
                </label>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 text-[11px] mono truncate bg-foreground/[0.03] border border-border rounded-lg px-2.5 py-2">{m.address}</div>
                <button
                  data-no-toast
                  onClick={() => { navigator.clipboard.writeText(m.address); toast.success("Address copied"); }}
                  className="p-2 rounded-lg border border-border hover:bg-foreground/5"
                  aria-label="Copy address"
                ><Copy size={13} /></button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <Mini k="Min" v={`$${m.min.toLocaleString()}`} />
                <Mini k="Max" v={`$${(m.max / 1000).toFixed(0)}K`} />
                <Mini k="Confs" v={`${m.confirmations}`} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setEditing(m)} data-no-toast className="py-2 rounded-lg border border-border hover:bg-foreground/5 text-xs inline-flex items-center justify-center gap-1.5"><Pencil size={12} /> Edit</button>
                <button onClick={() => remove(m._id)} data-no-toast className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs inline-flex items-center justify-center gap-1.5"><Trash2 size={12} /> Delete</button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <MethodModal open={!!editing || addOpen} onClose={() => { setEditing(null); setAddOpen(false); }} initial={editing} onSave={save} />
    </div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-border px-2 py-1.5 text-center">
      <div className="text-[9px] uppercase text-muted-foreground">{k}</div>
      <div className="font-medium mono">{v}</div>
    </div>
  );
}

function MethodModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: ApiDepositMethod | null; onSave: (m: Omit<ApiDepositMethod, "_id"> & { _id?: string }) => void }) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit deposit method" : "Add deposit method"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSave({
            currency: String(fd.get("currency") || ""),
            symbol: String(fd.get("symbol") || "").toUpperCase(),
            network: String(fd.get("network") || ""),
            address: String(fd.get("address") || "").trim(),
            min: Number(fd.get("min") || 0),
            max: Number(fd.get("max") || 0),
            confirmations: Number(fd.get("confirmations") || 1),
            enabled: fd.get("enabled") === "on",
          });
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Currency"><input name="currency" required placeholder="Bitcoin" defaultValue={initial?.currency} className={inputCls} /></Field>
          <Field label="Symbol"><input name="symbol" required placeholder="BTC" defaultValue={initial?.symbol} className={inputCls} /></Field>
        </div>
        <Field label="Network"><input name="network" required placeholder="TRC-20" defaultValue={initial?.network} className={inputCls} /></Field>
        <Field label="Wallet address"><input name="address" required placeholder="bc1q..." defaultValue={initial?.address} className={`${inputCls} mono text-xs`} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Min $"><input name="min" type="number" defaultValue={initial?.min ?? 50} className={inputCls} /></Field>
          <Field label="Max $"><input name="max" type="number" defaultValue={initial?.max ?? 250000} className={inputCls} /></Field>
          <Field label="Confirmations"><input name="confirmations" type="number" defaultValue={initial?.confirmations ?? 2} className={inputCls} /></Field>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" name="enabled" defaultChecked={initial?.enabled ?? true} className="accent-[oklch(0.70_0.19_47)]" /> Visible to clients in RexaPay
        </label>
        <button type="submit" className="w-full py-2.5 rounded-xl bg-brand text-brand-foreground text-sm font-medium">{initial ? "Save changes" : "Add method"}</button>
      </form>
    </Modal>
  );
}

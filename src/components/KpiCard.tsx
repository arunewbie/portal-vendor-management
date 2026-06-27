export function KpiCard({ title, value, note }: { title: string; value: string | number; note?: string }) {
  return <div className="card"><p className="text-sm font-medium text-slate-500">{title}</p><h3 className="mt-2 text-3xl font-bold text-slate-950">{value}</h3>{note && <p className="mt-2 text-xs text-slate-500">{note}</p>}</div>;
}

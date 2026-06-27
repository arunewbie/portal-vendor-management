import AppShell from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";

export default async function DashboardPage() {
  const [total, open, partial, closed, delay, latest] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "OPEN" }}),
    prisma.order.count({ where: { status: "PARTIAL" }}),
    prisma.order.count({ where: { status: { in: ["CLOSED", "FORCE_CLOSED"] }}}),
    prisma.order.count({ where: { status: "DELAY" }}),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { supplier: true }})
  ]);
  return <AppShell>
    <div className="mb-6"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-sm text-slate-500">Ringkasan realtime status order supplier.</p></div>
    <div className="grid gap-4 md:grid-cols-5"><KpiCard title="Total Order" value={total}/><KpiCard title="Open" value={open}/><KpiCard title="Partial" value={partial}/><KpiCard title="Closed" value={closed}/><KpiCard title="Delay" value={delay}/></div>
    <div className="card mt-6"><h2 className="mb-4 text-lg font-bold">Latest Orders</h2><div className="overflow-x-auto"><table className="w-full"><thead><tr><th className="table-th">Order</th><th className="table-th">Supplier</th><th className="table-th">Part</th><th className="table-th">Qty</th><th className="table-th">Status</th></tr></thead><tbody>{latest.map(o=><tr key={o.id} className="border-t"><td className="table-td">{o.orderNo}</td><td className="table-td">{o.supplier.name}</td><td className="table-td">{o.partNo}</td><td className="table-td">{o.qtyOrder}</td><td className="table-td"><StatusBadge status={o.status}/></td></tr>)}</tbody></table></div></div>
  </AppShell>
}

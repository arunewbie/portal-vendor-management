import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { deliveryDate: "asc" }, include: { supplier: true, plans: true, receivings: true } });
  return <AppShell>
    <div className="mb-6 flex items-center justify-between"><div><h1 className="text-2xl font-bold">Orders</h1><p className="text-sm text-slate-500">Semua order Kanban dan special order.</p></div><a href="/orders/import" className="btn-primary">Import CSV</a></div>
    <div className="card overflow-x-auto"><table className="w-full"><thead><tr><th className="table-th">Order No</th><th className="table-th">Type</th><th className="table-th">Supplier</th><th className="table-th">Kanban</th><th className="table-th">Part</th><th className="table-th">Qty</th><th className="table-th">Delivery</th><th className="table-th">Plan</th><th className="table-th">Actual</th><th className="table-th">Status</th></tr></thead><tbody>{orders.map(o=>{const plan=o.plans.reduce((a,b)=>a+b.plannedQty,0); const actual=o.receivings.reduce((a,b)=>a+b.receivedQty,0); return <tr key={o.id} className="border-t hover:bg-slate-50"><td className="table-td font-semibold">{o.orderNo}</td><td className="table-td">{o.orderType}</td><td className="table-td">{o.supplier.name}</td><td className="table-td">{o.kanbanNo ?? "-"}</td><td className="table-td">{o.partNo}</td><td className="table-td">{o.qtyOrder}</td><td className="table-td">{o.deliveryDate.toISOString().slice(0,10)} {o.deliveryTime ?? ""}</td><td className="table-td">{plan}</td><td className="table-td">{actual}</td><td className="table-td"><StatusBadge status={o.status}/></td></tr>})}</tbody></table></div>
  </AppShell>
}

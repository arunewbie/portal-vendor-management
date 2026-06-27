import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";

export default async function SupplierOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { status: { notIn: ["CLOSED", "FORCE_CLOSED"] } },
    include: { supplier: true, plans: true, receivings: true },
    orderBy: { deliveryDate: "asc" }
  });

  return <AppShell>
    <h1 className="text-2xl font-bold">Supplier Portal - Order Planning</h1>
    <p className="mb-6 text-sm text-slate-500">Supplier review order, accept/reject, dan input planning delivery.</p>
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead><tr><th className="table-th">Supplier</th><th className="table-th">Order</th><th className="table-th">Part</th><th className="table-th">Qty Order</th><th className="table-th">Delivery</th><th className="table-th">Planned</th><th className="table-th">Status</th><th className="table-th">Action</th></tr></thead>
        <tbody>{orders.map(o => {
          const planned = o.plans.reduce((a,b)=>a+b.plannedQty,0);
          return <tr key={o.id} className="border-t">
            <td className="table-td">{o.supplier.name}</td>
            <td className="table-td font-semibold">{o.orderNo}</td>
            <td className="table-td">{o.partNo}</td>
            <td className="table-td">{o.qtyOrder}</td>
            <td className="table-td">{o.deliveryDate.toISOString().slice(0,10)} {o.deliveryTime ?? ""}</td>
            <td className="table-td">{planned}</td>
            <td className="table-td"><StatusBadge status={o.status}/></td>
            <td className="table-td">
              <form action="/api/plan" method="post" className="flex flex-wrap gap-2">
                <input type="hidden" name="orderId" value={o.id}/>
                <input className="input w-28" name="plannedQty" placeholder="Qty" type="number" />
                <input className="input w-40" name="plannedDate" type="date" />
                <button className="btn-primary" name="action" value="ACCEPT">Accept/Plan</button>
                <button className="btn-secondary" name="action" value="REJECT">Reject</button>
              </form>
            </td>
          </tr>
        })}</tbody>
      </table>
    </div>
  </AppShell>
}

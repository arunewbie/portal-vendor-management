cat > src/app/supplier/orders/page.tsx <<'EOF'
import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SupplierOrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "SUPPLIER") {
    redirect("/dashboard");
  }

  if (!user.supplierId) {
    return (
      <AppShell>
        <div className="card">
          <h1 className="text-xl font-bold text-red-600">
            Supplier user belum terhubung ke supplier master.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Hubungi admin untuk mapping user ke supplier.
          </p>
        </div>
      </AppShell>
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      supplierId: user.supplierId,
      status: {
        notIn: ["CLOSED", "FORCE_CLOSED"],
      },
    },
    include: {
      supplier: true,
      plans: true,
      receivings: true,
    },
    orderBy: {
      deliveryDate: "asc",
    },
  });

  return (
    <AppShell>
      <h1 className="text-2xl font-bold">Supplier Portal - Order Planning</h1>
      <p className="mb-6 text-sm text-slate-500">
        Review order, accept/reject, dan input planning delivery.
      </p>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">Order</th>
              <th className="table-th">Kanban</th>
              <th className="table-th">Part</th>
              <th className="table-th">Qty Order</th>
              <th className="table-th">Delivery</th>
              <th className="table-th">Planned</th>
              <th className="table-th">Actual</th>
              <th className="table-th">Status</th>
              <th className="table-th">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => {
              const planned = o.plans.reduce((a, b) => a + b.plannedQty, 0);
              const actual = o.receivings.reduce((a, b) => a + b.receivedQty, 0);

              return (
                <tr key={o.id} className="border-t">
                  <td className="table-td font-semibold">{o.orderNo}</td>
                  <td className="table-td">{o.kanbanNo ?? "-"}</td>
                  <td className="table-td">
                    <div className="font-semibold">{o.partNo}</div>
                    <div className="text-xs text-slate-500">{o.partName}</div>
                  </td>
                  <td className="table-td">{o.qtyOrder}</td>
                  <td className="table-td">
                    {o.deliveryDate.toISOString().slice(0, 10)}{" "}
                    {o.deliveryTime ?? ""}
                  </td>
                  <td className="table-td">{planned}</td>
                  <td className="table-td">{actual}</td>
                  <td className="table-td">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="table-td">
                    /api/plan
                      <input type="hidden" name="orderId" value={o.id} />

                      <input
                        className="input w-28"
                        name="plannedQty"
                        placeholder="Qty"
                        type="number"
                      />

                      <input
                        className="input w-40"
                        name="plannedDate"
                        type="date"
                      />

                      <button
                        className="btn-primary"
                        name="action"
                        value="ACCEPT"
                      >
                        Accept/Plan
                      </button>

                      <button
                        className="btn-secondary"
                        name="action"
                        value="REJECT"
                      >
                        Reject
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  Tidak ada order open untuk supplier ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
EOF

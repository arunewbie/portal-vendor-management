import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const f = await req.formData();
  const orderId = String(f.get("orderId"));
  const action = String(f.get("action"));
  if (action === "REJECT") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "REJECTED", histories: { create: { action: "SUPPLIER_REJECT" }}}});
    redirect("/supplier/orders");
  }
  const plannedQty = Number(f.get("plannedQty") || 0);
  const plannedDate = String(f.get("plannedDate") || "");
  if (plannedQty > 0 && plannedDate) {
    await prisma.plan.create({ data: { orderId, plannedQty, plannedDate: new Date(plannedDate) }});
    await prisma.order.update({ where: { id: orderId }, data: { status: "ACCEPTED", histories: { create: { action: "SUPPLIER_PLAN", note: `Plan qty ${plannedQty}` }}}});
  }
  redirect("/supplier/orders");
}

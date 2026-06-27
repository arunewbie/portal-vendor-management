cat > src/app/api/plan/route.ts <<'EOF'
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "SUPPLIER") {
    redirect("/dashboard");
  }

  const f = await req.formData();

  const orderId = String(f.get("orderId"));
  const action = String(f.get("action"));

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    redirect("/supplier/orders");
  }

  if (order.supplierId !== user.supplierId) {
    redirect("/supplier/orders");
  }

  if (action === "REJECT") {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "REJECTED",
        histories: {
          create: {
            action: "SUPPLIER_REJECT",
            note: "Rejected by supplier",
            createdBy: user.email,
          },
        },
      },
    });

    redirect("/supplier/orders");
  }

  const plannedQty = Number(f.get("plannedQty") || 0);
  const plannedDate = String(f.get("plannedDate") || "");

  if (plannedQty > 0 && plannedDate) {
    await prisma.plan.create({
      data: {
        orderId,
        plannedQty,
        plannedDate: new Date(plannedDate),
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "ACCEPTED",
        histories: {
          create: {
            action: "SUPPLIER_PLAN",
            note: `Plan qty ${plannedQty}`,
            createdBy: user.email,
          },
        },
      },
    });
  }

  redirect("/supplier/orders");
}
EOF

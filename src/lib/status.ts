import { OrderStatus } from "@prisma/client";

export function statusBadge(status: OrderStatus | string) {
  const cls: Record<string, string> = {
    OPEN: "bg-slate-100 text-slate-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    PARTIAL: "bg-amber-100 text-amber-700",
    DELAY: "bg-red-100 text-red-700",
    CLOSED: "bg-green-100 text-green-700",
    FORCE_CLOSED: "bg-zinc-200 text-zinc-800"
  };
  return cls[status] ?? "bg-slate-100 text-slate-700";
}

export function calcOrderStatus(qtyOrder: number, received: number, forceClosed?: boolean) {
  if (forceClosed) return "FORCE_CLOSED";
  if (received >= qtyOrder) return "CLOSED";
  if (received > 0) return "PARTIAL";
  return "OPEN";
}

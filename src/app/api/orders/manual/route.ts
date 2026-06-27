import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
export async function POST(req: Request){ const f=await req.formData(); const id=Date.now(); await prisma.order.create({ data:{ orderNo:`MAN-${id}`, orderType:"MANUAL", supplierId:String(f.get("supplierId")), partNo:String(f.get("partNo")), partName:String(f.get("partName")||""), qtyOrder:Number(f.get("qtyOrder")), deliveryDate:new Date(String(f.get("deliveryDate"))), deliveryTime:String(f.get("deliveryTime")||""), status:"OPEN" }}); redirect("/orders"); }

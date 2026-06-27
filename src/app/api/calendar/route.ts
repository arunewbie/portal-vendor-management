import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
export async function POST(req: Request){ const f=await req.formData(); await prisma.calendarDay.upsert({ where:{date:new Date(String(f.get("date")))}, update:{dayType:f.get("dayType") as any, remarks:String(f.get("remarks")||"")}, create:{date:new Date(String(f.get("date"))), dayType:f.get("dayType") as any, remarks:String(f.get("remarks")||"")}}); redirect("/calendar"); }

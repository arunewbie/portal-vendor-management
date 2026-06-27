import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import { redirect } from "next/navigation";
export async function POST(req: Request){ const form=await req.formData(); const file=form.get("file") as File; const parsed=Papa.parse<Record<string,string>>(await file.text(),{header:true,skipEmptyLines:true}); for(const row of parsed.data){ const supplier=await prisma.supplier.findUnique({where:{code:row.supplierCode}}); if(!supplier) continue; await prisma.forecast.upsert({where:{month_supplierId_partNo:{month:row.month, supplierId:supplier.id, partNo:row.partNo}}, update:{forecastQty:Number(row.forecastQty)}, create:{month:row.month, supplierId:supplier.id, partNo:row.partNo, forecastQty:Number(row.forecastQty)}});} redirect("/reports/monthly"); }

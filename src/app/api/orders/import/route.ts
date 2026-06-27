import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import { redirect } from "next/navigation";
import { sendOrderEmail } from "@/lib/mail";

export async function POST(req: Request){
  const form=await req.formData();
  const file=form.get("file") as File;
  const text=await file.text();
  const parsed=Papa.parse<Record<string,string>>(text,{header:true,skipEmptyLines:true});
  for(const row of parsed.data){
    const supplier=await prisma.supplier.findUnique({where:{code:row.supplierCode}});
    if(!supplier) continue;
    const order=await prisma.order.upsert({
      where:{orderNo:row.orderNo},
      update:{qtyOrder:Number(row.qtyOrder), deliveryDate:new Date(row.deliveryDate), deliveryTime:row.deliveryTime || null, cycle:row.cycle || null},
      create:{orderNo:row.orderNo, pdsNo:row.pdsNo || null, orderType:"KANBAN", supplierId:supplier.id, kanbanNo:row.kanbanNo || null, partNo:row.partNo, partName:row.partName || null, qtyOrder:Number(row.qtyOrder), qtyPerBox: row.qtyPerBox?Number(row.qtyPerBox):null, deliveryDate:new Date(row.deliveryDate), deliveryTime:row.deliveryTime || null, cycle:row.cycle || null, status:"OPEN"}
    });
    await sendOrderEmail(supplier.emailList, `[New Order] ${order.orderNo}`, `<p>New order available.</p><p>Order: <b>${order.orderNo}</b></p><p>Please login to portal.</p>`);
  }
  redirect("/orders");
}

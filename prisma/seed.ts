import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main(){
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({ where:{email:"admin@fii.local"}, update:{}, create:{email:"admin@fii.local", name:"Administrator", role:"ADMIN", passwordHash} });
  const supplier = await prisma.supplier.upsert({ where:{code:"GMSI"}, update:{}, create:{code:"GMSI", name:"GMSI", emailList:["supplier@example.com"], cycle:"1-1-1", deliveryTime:["08:00"]} });
  await prisma.kanban.upsert({ where:{kanbanNo:"1347"}, update:{}, create:{kanbanNo:"1347", partNo:"53725-VT020", partName:"R/FFR SPRING SUPPORTNO.2", qtyPerBox:300, supplierId:supplier.id} });
}
main().finally(()=>prisma.$disconnect());

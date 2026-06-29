import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const supplierPasswordHash = await bcrypt.hash("supplier123", 10);

  const supplier = await prisma.supplier.upsert({
    where: { code: "GMSI" },
    update: {
      name: "GMSI",
      emailList: ["supplier@example.com"],
      cycle: "1-1-1",
      deliveryTime: ["08:00"],
    },
    create: {
      code: "GMSI",
      name: "GMSI",
      emailList: ["supplier@example.com"],
      cycle: "1-1-1",
      deliveryTime: ["08:00"],
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@fii.local" },
    update: {
      name: "Administrator",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@fii.local",
      name: "Administrator",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "supplier@gmsi.local" },
    update: {
      name: "Supplier GMSI",
      role: "SUPPLIER",
      supplierId: supplier.id,
      passwordHash: supplierPasswordHash,
    },
    create: {
      email: "supplier@gmsi.local",
      name: "Supplier GMSI",
      role: "SUPPLIER",
      supplierId: supplier.id,
      passwordHash: supplierPasswordHash,
    },
  });

  await prisma.kanban.upsert({
    where: { partNo: "53725-VT020" },
    update: {
      kanbanNo: "1347",
      partName: "R/FFR SPRING SUPPORTNO.2",
      qtyPerBox: 300,
      supplierId: supplier.id,
      deliveryPlace: "FII",
      dockCode: "D02",
      customerArea: "C-02-07",
      boxType: "TP331",
      storeAddress: "650 AS-1",
      supplierFreeArea: "B22",
    },
    create: {
      kanbanNo: "1347",
      partNo: "53725-VT020",
      partName: "R/FFR SPRING SUPPORTNO.2",
      qtyPerBox: 300,
      supplierId: supplier.id,
      deliveryPlace: "FII",
      dockCode: "D02",
      customerArea: "C-02-07",
      boxType: "TP331",
      storeAddress: "650 AS-1",
      supplierFreeArea: "B22",
    },
  });

  console.log("Seed completed successfully");
  console.log("Admin login    : admin@fii.local / admin123");
  console.log("Supplier login : supplier@gmsi.local / supplier123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
cat > prisma/seed.ts <<'EOF'
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
    where: { kanbanNo: "1347" },
    update: {
      partNo: "53725-VT020",
      partName: "R/FFR SPRING SUPPORTNO.2",
      qtyPerBox: 300,
      supplierId: supplier.id,
    },
    create: {
      kanbanNo: "1347",
      partNo: "53725-VT020",
      partName: "R/FFR SPRING SUPPORTNO.2",
      qtyPerBox: 300,
      supplierId: supplier.id,
    },
  });
}

main()
  .then(async () => {
    console.log("Seed completed");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
EOF

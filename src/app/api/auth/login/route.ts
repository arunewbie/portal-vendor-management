import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const form = await req.formData();

  const email = String(form.get("email") || "").toLowerCase().trim();
  const password = String(form.get("password") || "");

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      supplier: true,
    },
  });

  if (!user) {
    redirect("/login?error=1");
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash);

  if (!passwordOk) {
    redirect("/login?error=1");
  }

  const cookieStore = await cookies();

  cookieStore.set("sp_user", user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 10,
  });

  cookieStore.set("sp_role", user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 10,
  });

  if (user.supplierId) {
    cookieStore.set("sp_supplier", user.supplierId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 10,
    });
  } else {
    cookieStore.delete("sp_supplier");
  }

  if (user.role === "SUPPLIER") {
    redirect("/supplier/orders");
  }

  redirect("/dashboard");
}
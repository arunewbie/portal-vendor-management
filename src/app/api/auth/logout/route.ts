cat > src/app/api/auth/logout/route.ts <<'EOF'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("sp_user");
  cookieStore.delete("sp_role");
  cookieStore.delete("sp_supplier");

  redirect("/login");
}
EOF

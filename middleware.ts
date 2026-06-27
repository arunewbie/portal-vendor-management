cat > middleware.ts <<'EOF'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/api/auth/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico");

  if (isPublic) {
    return NextResponse.next();
  }

  const userId = req.cookies.get("sp_user")?.value;
  const role = req.cookies.get("sp_role")?.value;

  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Supplier hanya boleh akses halaman supplier dan logout.
  if (role === "SUPPLIER") {
    const allowed =
      pathname.startsWith("/supplier") ||
      pathname.startsWith("/api/plan") ||
      pathname.startsWith("/api/auth/logout");

    if (!allowed) {
      return NextResponse.redirect(new URL("/supplier/orders", req.url));
    }
  }

  // Admin/Internal tidak boleh masuk halaman supplier sebagai supplier view.
  if ((role === "ADMIN" || role === "INTERNAL") && pathname.startsWith("/supplier")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
EOF

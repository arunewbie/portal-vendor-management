cat > src/components/AppShell.tsx <<'EOF'
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  Factory,
  CalendarDays,
  FileBarChart,
  Upload,
  Users,
  ClipboardPlus,
  LogOut,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const adminMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: Package },
  { label: "Manual Order", href: "/manual-order", icon: ClipboardPlus },
  { label: "Receiving", href: "/receiving", icon: Truck },
  { label: "Suppliers", href: "/suppliers", icon: Users },
  { label: "Kanban", href: "/kanban", icon: Factory },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Forecast", href: "/forecast", icon: Upload },
  { label: "Reports", href: "/reports/daily", icon: FileBarChart },
];

const supplierMenu = [
  { label: "Supplier Orders", href: "/supplier/orders", icon: Truck },
];

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const menu = user.role === "SUPPLIER" ? supplierMenu : adminMenu;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800 bg-slate-950 p-5 text-white lg:flex lg:flex-col">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300">
            FII
          </p>
          <h1 className="text-2xl font-bold">Supplier Portal</h1>
          <p className="mt-1 text-sm text-slate-400">
            Kanban Execution System
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {menu.map((m) => {
            const Icon = m.icon;

            return (
              <Link
                key={m.href}
                href={m.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Icon size={18} />
                {m.label}
              </Link>
            );
          })}
        </nav>

        <form action="/api/auth/logout" method="post" className="mt-auto">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-red-900/40 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </form>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Realtime order, planning, receiving, and reports
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {user.role === "SUPPLIER"
                ? user.supplier?.name ?? "Supplier"
                : user.name}
            </div>
          </div>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
}
EOF

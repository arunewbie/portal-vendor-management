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
  UserCog,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const adminMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "User Management", href: "/users", icon: UserCog },
  { label: "Orders", href: "/orders", icon: Package },
  { label: "Manual Order", href: "/manual-order", icon: ClipboardPlus },
  { label: "Receiving", href: "/receiving", icon: Truck },
  { label: "Suppliers", href: "/suppliers", icon: Users },
  { label: "Kanban", href: "/kanban", icon: Factory },
  { label: "Replace Kanban", href: "/kanban/replacement", icon: Package },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Forecast", href: "/forecast", icon: Upload },
  { label: "Reports", href: "/reports/daily", icon: FileBarChart },
];

const internalMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: Package },
  { label: "Manual Order", href: "/manual-order", icon: ClipboardPlus },
  { label: "Receiving", href: "/receiving", icon: Truck },
  { label: "Suppliers", href: "/suppliers", icon: Users },
  { label: "Kanban", href: "/kanban", icon: Factory },
  { label: "Replace Kanban", href: "/kanban/replacement", icon: Package },
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

  const menu =
    user.role === "ADMIN"
      ? adminMenu
      : user.role === "INTERNAL"
      ? internalMenu
      : supplierMenu;

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

        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="mb-3 rounded-2xl bg-slate-900 p-3">
            <p className="text-xs text-slate-400">Login as</p>
            <p className="text-sm font-semibold text-white">
              {user.role === "SUPPLIER"
                ? user.supplier?.name ?? "Supplier"
                : user.name}
            </p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>

          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Realtime order, planning, receiving, and reports
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {user.role === "SUPPLIER"
                  ? user.supplier?.name ?? "Supplier"
                  : user.name}
              </div>

              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
}
import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Supplier Portal", description: "Kanban Supplier Portal" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

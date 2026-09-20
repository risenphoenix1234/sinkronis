import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import TokenExpirationWatcher from "@/components/auth/TokenExpirationWatcher";

export const metadata: Metadata = {
  title: "Multi-tenant HR & Accounting Platform",
  description: "Static prototype dashboards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <ToastContainer position="top-right" autoClose={4000} />
        <TokenExpirationWatcher />
        {children}
      </body>
    </html>
  );
}

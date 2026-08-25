import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getLocale } from "next-intl/server";
import { AssistantProvider } from "@/context/AssistantContext";
import DashboardShell from "@/components/DashboardShell";
import { Suspense } from "react";
import TokenHandler from "@/app/[locale]/dashboard/components/TokenHandler";

export default async function DashboardLayout({ children }) {
  const locale = await getLocale();
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen">
      {/* يلتقط توكن Google OAuth من الـ URL ويحفظه تلقائياً */}
      <Suspense fallback={null}>
        <TokenHandler />
      </Suspense>
      <AssistantProvider>
        <Navbar />
        <Sidebar />
        <DashboardShell locale={locale}>{children}</DashboardShell>
      </AssistantProvider>
    </div>
  );
}
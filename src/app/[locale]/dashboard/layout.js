import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getLocale } from "next-intl/server";
import { AssistantProvider } from "@/context/AssistantContext";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({ children }) {
  const locale = await getLocale();
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen">
      <AssistantProvider>
        <Navbar />
        <Sidebar />
        <DashboardShell locale={locale}>{children}</DashboardShell>
      </AssistantProvider>
    </div>
  );
}
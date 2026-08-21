import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({ children }) {
  const locale = await getLocale();
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen">
      <Navbar />

      <Sidebar />

      <main className={locale === "ar" ? "lg:mr-[260px]" : "lg:ml-[260px]"}>
        {children}
      </main>
    </div>
  );
}

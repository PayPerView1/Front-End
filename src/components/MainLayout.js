"use client";

import { usePathname } from "@/i18n/navigation";
import { AssistantProvider } from "@/context/AssistantContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { useTheme } from "@/context/ThemeContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DashboardShell from "./DashboardShell";

export default function MainLayout({ children, locale }) {
  const pathname = usePathname();
  const { isDark } = useTheme();

  // Pages where Navbar/Sidebar should NOT be displayed (Auth flows)
  const excludedPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/done",
    "/logout"
  ];
  
  // Check if current path matches or starts with any of the excluded paths
  const isExcluded = excludedPaths.some(
    (path) => pathname === path || pathname?.startsWith(path + "/")
  );

  if (isExcluded) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-[#0D0D0D]" : "bg-white"}`}>
        {children}
      </div>
    );
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className={`min-h-screen ${isDark ? "bg-[#0D0D0D]" : "bg-white"}`}>
      <NotificationsProvider>
        <AssistantProvider>
          <Navbar />
          <Sidebar />
          <DashboardShell locale={locale}>
            {children}
          </DashboardShell>
        </AssistantProvider>
      </NotificationsProvider>
    </div>
  );
}

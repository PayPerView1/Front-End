"use client";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AssistantProvider } from "@/context/AssistantContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { useLocale } from "next-intl";

function Inner({ children }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-[#0D0D0D]" : "bg-white"}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}

export default function DashboardWrapper({ children }) {
  return (
    <ThemeProvider>
      <AssistantProvider>
        <NotificationsProvider>
          <Inner>{children}</Inner>
        </NotificationsProvider>
      </AssistantProvider>
    </ThemeProvider>
  );
}

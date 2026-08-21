"use client";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
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
      <Inner>{children}</Inner>
    </ThemeProvider>
  );
}

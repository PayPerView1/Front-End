"use client";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function Inner({ children }) {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-screen flex ${isDark ? "bg-[#0D0D0D]" : "bg-white"}`} dir="rtl">
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
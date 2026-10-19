"use client";

import { useTranslations } from "next-intl";
import { Unlink } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ErrorBanner({ reason, values = {} }) {
  const t = useTranslations("startProject.errorBanner");
  const { isDark } = useTheme();

  if (!reason) return null;

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-4 rounded-2xl border p-5 mb-5 ${
        isDark ? "bg-[#5a1c1c]/70 border-red-500/30" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="min-w-0">
        <h3 className={`text-base font-black mb-1 ${isDark ? "text-white" : "text-red-800"}`}>
          {t(`${reason}.title`, values)}
        </h3>
        <p className={`text-xs leading-relaxed ${isDark ? "text-red-100/80" : "text-red-700"}`}>
          {t(`${reason}.desc`, values)}
        </p>
      </div>
      <span
        className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
          isDark
            ? "bg-red-500/15 border-red-500/30 text-red-300"
            : "bg-red-100 border-red-200 text-red-600"
        }`}
      >
        <Unlink size={20} />
      </span>
    </div>
  );
}
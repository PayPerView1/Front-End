
"use client";

import { useTranslations } from "next-intl";
import { Hourglass } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function DeadlineTimer({ hours = 23, minutes = 14 }) {
  const t = useTranslations("startProject.deadline");
  const { isDark } = useTheme();

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${
        isDark
          ? "bg-[#121617] border-[#1e2425]"
          : "bg-white border-[#e1e7e4]"
      }`}
    >
      <div>
        <p
          className={`text-[10px] ${
            isDark ? "text-gray-400" : "text-[#5f6a66]"
          }`}
        >
          {t("label")}
        </p>

        <p
          className={`text-sm font-bold ${
            isDark ? "text-[#94D3C1]" : "text-emerald-700"
          }`}
        >
          {t("value", { hours, minutes })}
        </p>
      </div>

      <span
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          isDark ? "bg-[#212f2c] text-[#94D3C1]" : "bg-emerald-50 text-emerald-700"
                }`}
        >
        <Hourglass size={18} />
      </span>
    </div>
  );
}

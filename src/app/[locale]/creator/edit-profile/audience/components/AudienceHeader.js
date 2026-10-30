"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { FiDownload } from "react-icons/fi";

const PERIODS = [
  { key: "full", label: "periodFull" },
  { key: "7d", label: "period7" },
  { key: "30d", label: "period30" },
];

export default function AudienceHeader({
  period,
  onPeriodChange,
  onExport,
  disabled = false,
}) {
  const { isDark } = useTheme();
  const translate = useTranslations("Audience");

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    divider: isDark ? "border-[#2D2D2D]" : "border-[#D6D6D6]",
    segWrap: isDark ? "bg-[#181818] border-[#2D2D2D]" : "bg-white border-[#D6D6D6]",
    segText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    segHover: isDark ? "hover:bg-white/5" : "hover:bg-black/5",
    gradient: "bg-gradient-to-r from-[#FDA301] to-[#F96604]",
  };

  return (
    <div
      className={`flex flex-col gap-4 border-b pb-5 @4xl:flex-row @4xl:items-center @4xl:justify-between ${t.divider}`}
    >
      <h1 className={`m-0 text-2xl font-bold sm:text-3xl ${t.text}`}>
        {translate("title")}
      </h1>

      {/* جهة اليمين: فلاتر الفترة الزمنية وزر التصدير */}
      <div
        className={`flex flex-wrap items-center gap-3 @4xl:justify-end ${
        disabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <div className={`flex items-center gap-1 rounded-xl border p-1 ${t.segWrap}`}>
          {PERIODS.map((p) => {
            const active = period === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onPeriodChange(p.key)}
                className={`cursor-pointer whitespace-nowrap rounded-lg border-none px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? `${t.gradient} text-white`
                    : `bg-transparent ${t.segText} ${t.segHover}`
                }`}
              >
                {translate(p.label)}
              </button>
            );
          })}
        </div>

        {/* زر التصدير */}
        <div
          className={`flex items-center gap-3 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <button
            type="button"
            onClick={onExport}
            className={`flex h-9 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border-none px-4 text-xs font-bold text-white sm:text-sm ${t.gradient}`}
          >
            <FiDownload size={16} />
            {translate("exportReport")}
          </button>
        </div>
      </div>
    </div>
  );
}

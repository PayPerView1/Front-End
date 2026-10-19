"use client";

import { useTranslations } from "next-intl";
import { CircleHelp, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const keys = ["id", "wait", "noShort"];

export default function DuplicateTips() {
  const t = useTranslations("startProject.duplicateTips");
  const { isDark } = useTheme();

  const surface = isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]";
  const primary = isDark ? "text-white" : "text-[#191c1d]";
  const secondary = isDark ? "text-gray-400" : "text-[#5f6a66]";

  return (
    <div className={`${surface} border rounded-2xl p-4 space-y-3`}>
      <h3 className={`flex items-center gap-2 text-xs font-bold ${primary}`}>
        <CircleHelp size={16} className="text-[#E9C349]" />
        {t("title")}
      </h3>
      <ul className="space-y-2.5">
        {keys.map((key) => (
          <li key={key} className={`flex items-start gap-2 text-[11px] leading-relaxed ${secondary}`}>
            <CheckCircle2 size={14} className="text-[#94D3C1] shrink-0 mt-0.5" />
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  );
}
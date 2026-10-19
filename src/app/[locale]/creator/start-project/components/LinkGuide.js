"use client";

import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const stepKeys = ["open", "share", "copy"];

export default function LinkGuide({ ns = "linkGuide" }) {
  const t = useTranslations(`startProject.${ns}`);
  const { isDark } = useTheme();

  const surface = isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]";
  const inset = isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]";
  const badge = isDark ? "bg-[#22282a] text-gray-300" : "bg-[#e6ecea] text-[#404945]";
  const primary = isDark ? "text-white" : "text-[#191c1d]";
  const secondary = isDark ? "text-gray-400" : "text-[#5f6a66]";

  return (
    <div className={`${surface} border rounded-2xl p-4 space-y-3`}>
      <h3 className={`flex items-center gap-2 text-xs font-bold ${primary}`}>
        <Lightbulb size={16} className="text-[#E9C349]" />
        {t("title")}
      </h3>

      <div className="space-y-2.5">
        {stepKeys.map((key, i) => (
          <div key={key} className={`p-3 rounded-xl border space-y-1 ${inset}`}>
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${badge}`}
              >
                {i + 1}
              </span>
              <h4 className={`text-xs font-bold ${primary}`}>{t(`steps.${key}.title`)}</h4>
            </div>
            <p className={`text-[10px] leading-relaxed ${secondary}`}>
              {t(`steps.${key}.desc`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
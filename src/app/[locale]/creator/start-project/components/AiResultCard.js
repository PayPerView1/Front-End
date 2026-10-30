"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Eye, MonitorPlay, Mic2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const aiItems = [
  { key: "sharia", icon: ShieldCheck },
  { key: "logo", icon: Eye },
  { key: "quality", icon: MonitorPlay },
  { key: "audio", icon: Mic2 },
];

export default function AiResultCard({ score }) {
  const t = useTranslations("startProject.result");
  const { isDark } = useTheme();

  const surface = isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]";
  const inset = isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]";
  const primary = isDark ? "text-white" : "text-[#191c1d]";
  const secondary = isDark ? "text-gray-400" : "text-[#5f6a66]";

  return (
    <div className={`${surface} border rounded-2xl p-5 space-y-4`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm font-bold ${primary}`}>{t("ai.label")}</p>
          <p className={`text-[10px] ${secondary}`}>{t("ai.subtitle")}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#94D3C1]/30 bg-[#94D3C1]/10">
          <span className="text-lg font-black text-[#94D3C1]">{score}%</span>
          <span className="text-[10px] font-bold text-[#94D3C1]">{t("ai.excellent")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {aiItems.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${inset}`}
          >
            <div className="min-w-0">
              <p className={`text-xs font-bold ${primary}`}>{t(`ai.items.${key}.title`)}</p>
              <p className={`text-[10px] ${secondary}`}>{t(`ai.items.${key}.desc`)}</p>
            </div>
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isDark ? "bg-[#212f2c] text-[#94D3C1]" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <Icon size={15} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
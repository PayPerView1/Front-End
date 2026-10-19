"use client";

import { useLocale, useTranslations } from "next-intl";
import { FileText, Lightbulb } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function PreviousSubmission({ previous, campaignName }) {
  const t = useTranslations("startProject.previousSubmission");
  const locale = useLocale();
  const { isDark } = useTheme();

  if (!previous) return null;

  const surface = isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]";
  const inset = isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]";
  const primary = isDark ? "text-white" : "text-[#191c1d]";
  const secondary = isDark ? "text-gray-400" : "text-[#5f6a66]";

  const date = new Date(previous.submittedAt);
  const nf = locale === "ar" ? "ar-u-nu-latn" : locale;
  const dateText = `${date.toLocaleDateString(nf, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })} - ${date.toLocaleTimeString(nf, { hour: "2-digit", minute: "2-digit" })}`;

  const cells = [
    {
      label: t("reference"),
      value: <span dir="ltr">#{previous.reference}</span>,
    },
    {
      label: t("reward"),
      value: (
        <span className="text-[#E9C349]">
          ${Number(previous.rewardAmount).toFixed(2)}{" "}
          <span className="text-[10px]">({t("paid")})</span>
        </span>
      ),
    },
    { label: t("campaign"), value: campaignName },
    { label: t("firstDate"), value: dateText },
  ];

  return (
    <div className={`${surface} border rounded-2xl p-4 space-y-3`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isDark ? "bg-[#22282a] text-gray-300" : "bg-[#e6ecea] text-[#404945]"
            }`}
          >
            <FileText size={18} />
          </span>
          <div>
            <p className={`text-sm font-bold ${primary}`}>{t("title")}</p>
            <p className={`text-[10px] ${secondary}`}>{t("subtitle")}</p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold rounded-md border px-2.5 py-1 ${
            isDark
              ? "border-emerald-500/30 bg-emerald-500/10 text-#94D3C1"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {t("badge")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cells.map(({ label, value }) => (
          <div key={label} className={`rounded-xl border p-3 ${inset}`}>
            <p className={`text-[10px] mb-1 ${secondary}`}>{label}</p>
            <p className={`text-xs font-bold ${primary}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className={`rounded-xl border p-3 ${inset}`}>
        <p className={`flex items-center gap-2 text-xs font-bold mb-1 ${primary}`}>
          <Lightbulb size={14} className="text-[#E9C349]" />
          {t("whyTitle")}
        </p>
        <p className={`text-[10px] leading-relaxed ${secondary}`}>{t("whyDesc")}</p>
      </div>
    </div>
  );
}
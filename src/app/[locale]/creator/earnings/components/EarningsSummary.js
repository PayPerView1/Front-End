"use client";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import { FiEye, FiStar, FiCheckCircle } from "react-icons/fi";

const usd = (n) =>
  n === 0
    ? "$0"
    : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function EarningsSummary({ data }) {
  const d = data;
  const { isDark } = useTheme();
  const isAr = useLocale() === "ar";
  const t = useTranslations("Earnings.summary");
  const tc = useTranslations("Earnings.common");

  const card = isDark
    ? "bg-[#191C1D] border-[#191C1D]"
    : "bg-white border-[#E5E5E5]";
  const sub = isDark ? "text-[#9A9A9A]" : "text-[#666666]";
  const inner = isDark
    ? "bg-[#BFC9C40D] border-[#BFC9C40D]"
    : "bg-[#FAFAFA] border-[#E5E5E5]";

  // لايت: أخضر أغمق عشان يظهر على الأبيض
  const mint = isDark ? "text-[#94D3C1]" : "text-[#0B7A5A]";
  const mintIcon = isDark ? "#94D3C1" : "#0B7A5A";
  const badge = isDark
    ? "bg-[#BFC9C41A] text-[#94D3C1]"
    : "bg-[#10B981]/10 text-[#0B7A5A]";

  const isEmpty = d.total === 0;

  return (
    <div className={`rounded-2xl border p-4 sm:p-6 ${card}`}>
      <div className="flex flex-col md:flex-row gap-6 md:justify-between earnings-summary-row">
        <div className="w-full md:w-1/2 flex flex-col gap-3 earnings-summary-col">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${badge}`}
            >
              <FiCheckCircle size={12} />
              {t("badge")}
            </span>
            <span className={`text-[11px] ${sub}`}>{t("noFees")}</span>
          </div>

          <p className={`text-sm ${sub}`}>{t("totalLabel")}</p>

          <div className="flex flex-wrap items-baseline gap-3">
            <span dir="ltr" className="text-4xl sm:text-5xl font-extrabold">
              {isEmpty ? "0" : usd(d.total)}
            </span>
            <span dir={isAr ? "rtl" : "ltr"} className={`text-base ${sub}`}>
              {tc("sar", { amount: d.totalSar.toLocaleString("en-US") })}
            </span>
          </div>

          <p className={`text-[11px] ${sub}`}>
            {t("clipsNote", { clips: d.clips })}
          </p>
        </div>

        <div className="w-full md:w-[45%] flex flex-col gap-4 earnings-summary-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`rounded-xl border p-3 ${inner}`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs ${mint}`}>{t("countedViews")}</p>
                <FiEye size={14} color={mintIcon} />
              </div>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {d.views.toLocaleString("en-US")}
              </p>
              <p className={`text-[11px] mt-0.5 ${mint}`}>
                {t("viewsFrom", { clips: d.clips })}
              </p>
            </div>

            <div className={`rounded-xl border p-3 ${inner}`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs ${mint}`}>{t("avgCpm")}</p>
                <FiStar size={14} color={mintIcon} />
              </div>
              <p className={`text-xl sm:text-2xl font-bold mt-1 ${mint}`}>
                {d.ecpm === 0 ? "$0" : `$${d.ecpm.toFixed(2)}`}
              </p>
              <p className={`text-[11px] mt-0.5 ${mint}`}>
                {t("topClip", { cpm: d.topCpm.toFixed(2) })}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className={sub}>{t("cycleProgress")}</span>
              <span className={`${mint} font-bold`}>
                {t("done", { progress: d.progress })}
              </span>
            </div>
            <div
              className={`h-2 rounded-full ${
                isDark ? "bg-[#2a2a2a]" : "bg-[#EAEAEA]"
              }`}
            >
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#FFA600] to-[#F96303]"
                style={{ width: `${d.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslations } from "next-intl";
import { REVIEW_DAYS } from "@/lib/Payout";
import { FiCheck, FiRefreshCw, FiClock } from "react-icons/fi";
import { RiShieldCheckLine } from "react-icons/ri";

const DEFAULT_REVIEW = { day: 4, daysLeft: 4, completed: false };

const STEPS = [
  { id: 1, activeIcon: FiCheck },
  { id: 2, activeIcon: FiRefreshCw },
  { id: 3, activeIcon: FiClock },
  { id: 4, activeIcon: FiCheck },
];

export default function HowItWorks({ review = DEFAULT_REVIEW }) {
  const { isDark } = useTheme();
  const t = useTranslations("Earnings.how");

  // ألوان: [دارك] / [لايت أغمق]
  const YELLOW = isDark ? "#E9C349" : "#9A6700";
  const TEAL = isDark ? "#94D3C1" : "#0F9D75";

  // أثناء التدقيق الخطوة النشطة 2، وبعد انتهائه تصير 3
  const activeStep = review.completed ? 3 : 2;

  const card = isDark
    ? "bg-[#191C1D] border-[#191C1D]"
    : "bg-white border-[#E5E5E5]";
  const sub = isDark ? "text-[#9A9A9A]" : "text-[#666666]";

  return (
    <div className={`rounded-2xl border p-4 sm:p-6 ${card}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{t("title")}</h2>
          <p className={`text-xs mt-1 ${sub}`}>{t("subtitle")}</p>
        </div>

        <span
          className={`inline-flex items-center gap-2 self-start text-[11px] font-bold px-3 py-1.5 rounded-full border ${
            isDark
              ? "bg-[#94D3C1]/10 border-[#94D3C1]/30 text-[#94D3C1]"
              : "bg-[#10B981]/10 border-[#10B981]/30 text-[#0B7A5A]"
          }`}
        >
          <RiShieldCheckLine size={14} color={TEAL} />
          {t("badge")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map((s) => {
          const state =
            s.id === activeStep
              ? "active"
              : s.id < activeStep
                ? "done"
                : "pending";

          const bgCls = isDark ? "bg-[#0F1112]" : "bg-[#FAFAFA]";
          const borderCls =
            state === "active"
              ? isDark
                ? "border-[#E9C349]/40"
                : "border-[#D4A300]/60"
              : isDark
                ? "border-white/[0.06]"
                : "border-[#E5E5E5]";
          const cardCls = `${bgCls} ${borderCls}`;

          const boxCls =
            state === "active"
              ? isDark
                ? "bg-[#E9C349]/10"
                : "bg-[#E9C349]/25"
              : state === "done"
                ? isDark
                  ? "bg-[#10B98126]"
                  : "bg-[#10B981]/15"
                : isDark
                  ? "bg-white/[0.06]"
                  : "bg-black/5";

          const badgeCls =
            state === "active"
              ? isDark
                ? "bg-[#E9C349]/15 text-[#E9C349]"
                : "bg-[#E9C349]/25 text-[#8A5A00]"
              : state === "done"
                ? isDark
                  ? "bg-[#10B9811A] text-[#94D3C1]"
                  : "bg-[#10B981]/10 text-[#0B7A5A]"
                : isDark
                  ? "bg-white/[0.08] text-[#D1D5DB]"
                  : "bg-[#EAEAEA] text-[#555555]";

          return (
            <div
              key={s.id}
              className={`rounded-xl border p-2 flex flex-col gap-2 transition-colors ${cardCls}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${boxCls}`}
                >
                  {state === "active" ? (
                    <s.activeIcon size={15} color={YELLOW} />
                  ) : state === "done" ? (
                    <FiCheck size={15} color={TEAL} />
                  ) : (
                    <span
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-[#1A1A1A]"
                      }`}
                    >
                      {s.id}
                    </span>
                  )}
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold ${badgeCls}`}
                >
                  {t(`steps.${s.id}.badge.${state}`, { day: review.day })}
                  {state === "done" && <FiCheck size={9} />}
                  {state === "active" && <FiClock size={9} />}
                </span>
              </div>

              <p
                className="text-sm font-bold"
                style={state === "active" ? { color: YELLOW } : undefined}
              >
                {t(`steps.${s.id}.title`, { days: REVIEW_DAYS })}
              </p>
              <p className={`text-[11px] leading-relaxed ${sub}`}>
                {t(`steps.${s.id}.desc`)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
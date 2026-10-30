"use client";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import { REVIEW_DAYS } from "@/lib/Payout";
import { FiCheckCircle, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import {
  RiHourglassLine,
  RiMoneyDollarBoxLine,
  RiShieldCheckLine,
} from "react-icons/ri";

const usd = (n) =>
  n === 0
    ? "$0"
    : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function EarningsCards({ data, review, onWithdraw }) {
  const { isDark } = useTheme();
  const isAr = useLocale() === "ar";
  const t = useTranslations("Earnings.cards");
  const tc = useTranslations("Earnings.common");
  const Arrow = isAr ? FiArrowLeft : FiArrowRight;

  const sarText = (n) =>
    tc("sar", {
      amount: n.toLocaleString("en-US", { minimumFractionDigits: n ? 2 : 0 }),
    });

  const card = isDark
    ? "bg-[#191C1D] border-[#191C1D]"
    : "bg-white border-[#E5E5E5]";
  const sub = isDark ? "text-[#9A9A9A]" : "text-[#666666]";
  const sarCls = isDark ? "text-[#C7CBD1]" : "text-[#444444]";

  // ألوان مشتركة (أخضر / محايد) — لايت أغمق لوضوح أكبر
  const greenBadge = isDark
    ? "bg-[#10B9811A] text-[#94D3C1]"
    : "bg-[#10B981]/10 text-[#0B7A5A]";
  const greenBox = isDark ? "bg-[#10B98126]" : "bg-[#10B981]/15";
  const neutralBadge = isDark
    ? "bg-white/[0.06] text-[#D1D5DB]"
    : "bg-black/5 text-[#555555]";
  const mint = isDark ? "text-[#94D3C1]" : "text-[#0B7A5A]";
  const greenIcon = isDark ? "#94D3C1" : "#0F9D75";

  // الزر يشتغل فقط بعد انتهاء تدقيق الأمان ووجود رصيد
  const canWithdraw = review.completed && data.ready > 0;

  // أيام متبقية بعد اليوم الحالي (اليوم 4 → باقي 3)
  const remaining = Math.max(REVIEW_DAYS - review.day, 0);

  const cards = [
    {
      key: "ready",
      title: t("ready.title"),
      amount: data.ready,
      sar: data.readySar,
      icon: FiCheckCircle,
      iconColor: greenIcon,
      badgeCls: greenBadge,
      boxCls: greenBox,
      amountCls: "",
      desc: t("ready.desc", { days: REVIEW_DAYS }),
    },
    {
      key: "review",
      title: t("review.title"),
      amount: data.review,
      sar: data.reviewSar,
      icon: RiHourglassLine,
      iconColor: greenIcon,
      badgeCls: greenBadge,
      boxCls: greenBox,
      amountCls: mint,
      desc: t("review.desc", { days: REVIEW_DAYS }),
      footer: (
        <div className="flex items-center justify-between">
          <span
            className={`flex items-center gap-1.5 text-[11px] font-bold ${
              isDark ? "text-[#94D3C1]" : "text-[#444444]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDark ? "bg-[#94D3C1]" : "bg-[#0F9D75]"
              }`}
            />
            {review.completed
              ? t("review.complete")
              : remaining > 0
                ? t("review.daysLeft", { days: remaining })
                : t("review.availableSoon")}
          </span>
          <span className={`text-[11px] ${sub}`}>
            {t("review.dayOf", { day: review.day, total: REVIEW_DAYS })}
          </span>
        </div>
      ),
    },
    {
      key: "received",
      title: t("received.title"),
      amount: data.received,
      sar: data.receivedSar,
      icon: RiMoneyDollarBoxLine,
      iconColor: isDark ? "#FFFFFF" : "#1A1A1A",
      badgeCls: neutralBadge,
      boxCls: "bg-transparent",
      amountCls: "",
      desc: t("received.desc"),
      footer: (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${greenBadge}`}
        >
          <RiShieldCheckLine size={14} />
          {t("received.payouts", { count: data.payouts })}
        </span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={`rounded-2xl border p-4 flex flex-col ${card}`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${c.badgeCls}`}
              >
                {c.title}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.boxCls}`}
              >
                <Icon size={18} color={c.iconColor} />
              </div>
            </div>

            <p
              dir="ltr"
              className={`text-3xl font-extrabold mt-4 ${c.amountCls} ${
                isAr ? "text-right" : ""
              }`}
            >
              {usd(c.amount)}
            </p>
            <p
              dir={isAr ? "rtl" : "ltr"}
              className={`text-xs font-bold mt-1 ${sarCls}`}
            >
              {sarText(c.sar)}
            </p>

            <p className={`text-xs mt-3 leading-relaxed ${sub}`}>{c.desc}</p>

            <div className="mt-auto pt-4">
              {c.key === "ready" ? (
                <button
                  type="button"
                  disabled={!canWithdraw}
                  onClick={canWithdraw ? onWithdraw : undefined}
                  title={
                    canWithdraw
                      ? undefined
                      : t("withdrawLocked", { days: REVIEW_DAYS })
                  }
                  className="
                    w-full flex items-center justify-center gap-2
                    px-4 py-2.5 rounded-xl
                    bg-gradient-to-r from-[#FFA600] to-[#F96303]
                    text-white text-sm font-bold border-none cursor-pointer
                    hover:opacity-90 transition-opacity
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40
                  "
                >
                  {t("withdrawBtn")}
                  <Arrow size={16} />
                </button>
              ) : (
                c.footer
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
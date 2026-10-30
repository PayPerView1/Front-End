"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import { useUser } from "@/context/UserContext";
import { getSavedUser } from "@/lib/axiosInstance";
import { REVIEW_DAYS } from "@/lib/Payout";
import { FiCheckCircle, FiCreditCard } from "react-icons/fi";

export default function WithdrawBanner({
  amountSar = 2753.8,
  clipTitle = "استثمار الذكاء الاصطناعي في ريادة الأعمال",
  clipTitleEn = "AI Investing in Entrepreneurship",
  minutesAgo = 14,
  onWithdraw,
}) {
  const { isDark } = useTheme();
  const isAr = useLocale() === "ar";
  const t = useTranslations("Earnings.banner");

  // اسم المستخدم (نفس مصدر الـ Navbar)
  const { user: contextUser } = useUser() || {};
  const [savedUser, setSavedUser] = useState(null);

  useEffect(() => {
    setSavedUser(getSavedUser());
  }, []);

  const user = contextUser || savedUser;
  const fullName =
    user?.fullName || user?.name || user?.username || t("fallbackName");
  const firstName = fullName.trim().split(" ")[0];

  const card = isDark
    ? "bg-[#191C1D] border-[#2A2E2F]"
    : "bg-white border-[#E5E5E5]";
  const sub = isDark ? "text-[#9A9A9A]" : "text-[#666666]";
  const body = isDark ? "text-[#E1E3E3]" : "text-[#333333]";

  // لايت: ألوان أغمق ليكون النص مقروء على الخلفية البيضاء
  const clipCls = isDark ? "text-[#94D3C1]" : "text-[#0B7A5A]";
  const moneyCls = isDark ? "text-[#FE6B02]" : "text-[#C94F00]";

  const amount = amountSar.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between ${card}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
            isDark
              ? "bg-[#0F1112] border-[#2A2E2F]"
              : "bg-[#10B981]/10 border-[#10B981]/30"
          }`}
        >
          <FiCheckCircle size={20} color="#0FBC5F" />
        </div>

        <div>
          <p className={`text-[11px] ${sub}`}>
            {t("minutesAgo", { minutes: minutesAgo })}
          </p>

          <p className={`text-sm mt-1 leading-loose ${body}`}>
            {t.rich("message", {
              name: firstName,
              days: REVIEW_DAYS,
              clipTitle: isAr ? clipTitle : clipTitleEn,
              amount,
              clip: (chunks) => (
                <span className={`font-bold ${clipCls}`}>{chunks}</span>
              ),
              money: (chunks) => (
                <bdi className={`font-extrabold ${moneyCls}`}>{chunks}</bdi>
              ),
            })}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onWithdraw}
        className="
          flex items-center justify-center gap-2
          earnings-banner-btn px-6 py-3 rounded-xl w-full sm:w-auto sm:min-w-[200px]
          bg-gradient-to-r from-[#FB8B03] to-[#F96202]
          text-white text-sm font-bold
          border-none cursor-pointer
          shadow-[0_6px_20px_rgba(254,107,2,0.35)]
          hover:opacity-90 transition-opacity
          flex-shrink-0
        "
      >
        <FiCreditCard size={18} />
        {t("button")}
      </button>
    </div>
  );
}
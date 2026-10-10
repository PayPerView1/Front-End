"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { FiCompass, FiHeart } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function FavoritesEmptyState() {
  const { isDark } = useTheme();
  const translate = useTranslations("profile.favorites");

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    cardBg: isDark ? "bg-[#191C1DB2]" : "bg-white",
    cardBorder: isDark ? "border-[#2D2D2D]" : "border-[#D6D6D6]",
    iconOuter: isDark
      ? "bg-[#2A2A2A] border-[#2A2A2A]"
      : "bg-[#F0F0F0] border-[#D6D6D6]",
    secondaryBtn: isDark
      ? "bg-[#1C1C1C] border-[#2A2A2A] text-[#94D3C1]"
      : "bg-[#F5F5F5] border-[#D6D6D6] text-[#0B625A]",
    primaryButton: isDark
      ? "bg-gradient-to-l from-[#FD5802] to-[#FE9701]"
      : "bg-gradient-to-l from-[#FD5802] to-[#FE9701]",
  };

  return (
    // تم إضافة flex و items-center و justify-center لتوسيط الكارد، وتغيير padding الحاوية
    <div className="flex min-h-screen w-full min-w-0 items-center justify-center px-3 py-8 sm:px-4">
      <div
        // تم إضافة max-w-2xl لتصغير العرض، وتقليل min-h و padding
        className={`flex min-h-[380px] w-full max-w-2xl min-w-0 flex-col items-center justify-center rounded-3xl border px-4 py-8 text-center shadow-xl sm:px-6 sm:py-10 ${t.cardBg} ${t.cardBorder}`}
      >
        {/* الأيقونة */}
        <div
          className={`mb-6 flex h-[80px] w-[80px] items-center justify-center rounded-3xl border ${t.iconOuter}`}
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3D32] to-[#0A1F1A]">
            {/* ورقة صفراء */}
            <div className="h-7 w-6 rounded-[5px] bg-gradient-to-b from-[#FFD166] to-[#F5B301] shadow-[0_0_14px_rgba(255,200,60,0.35)]" />
            {/* قلب تركواز */}
            <FiHeart
              size={13}
              className="absolute bottom-3.5 left-3.5 fill-[#5ED4B5] text-[#5ED4B5]"
            />
            {/* لمعة */}
            <HiSparkles
              size={11}
              className="absolute right-2 top-2 text-[#FFD166]"
            />
          </div>
        </div>

        <h2 className={`text-xl sm:text-2xl font-bold ${t.text}`}>
          {translate("empty.title")}
        </h2>

        <p
          className={`mt-3 max-w-[440px] text-xs leading-6 sm:text-sm ${t.subText}`}
        >
          {translate("empty.description")}
        </p>

        <div className="mt-8 flex w-full flex-row flex-wrap items-center justify-center gap-3">
          <Link
            href="/campaigns"
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-[0_8px_24px_-6px_#E9C34940] transition sm:px-5 sm:text-sm ${t.primaryButton}`}
          >
            <FiCompass size={15} />
            {translate("empty.explore")}
          </Link>

          <Link
            href="/recommendations"
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition sm:px-5 sm:text-sm ${t.secondaryBtn}`}
          >
            <HiSparkles size={15} />
            {translate("empty.recommendations")}
          </Link>
        </div>
      </div>
    </div>
  );
}

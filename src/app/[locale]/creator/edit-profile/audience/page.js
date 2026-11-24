"use client";

import { useLocale } from "next-intl";
import { useTheme } from "@/context/ThemeContext";

export default function AudiencePage() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const isArabic = locale === "ar";

  return (
    <div className="@container w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className={`m-0 text-2xl font-bold sm:text-3xl ${isDark ? "text-white" : "text-[#171717]"}`}>
          {isArabic ? "تحليلات الجمهور" : "Audience analytics"}
        </h1>
        <section
          role="status"
          className={`rounded-2xl border p-6 ${isDark ? "border-[#2D2D2D] bg-[#181818] text-gray-300" : "border-[#D6D6D6] bg-white text-gray-700"}`}
        >
          <h2 className={`mb-2 text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {isArabic ? "تحليلات الجمهور غير متاحة حالياً" : "Audience analytics are unavailable"}
          </h2>
          <p className="m-0 text-sm leading-6">
            {isArabic
              ? "لا توفر الواجهة الخلفية حالياً نقطة API لهذه التحليلات، لذلك لا يمكن عرض توزيع جغرافي أو أرقام نمو موثقة."
              : "The backend does not currently expose an API for these insights, so verified geographic and growth metrics cannot be displayed."}
          </p>
        </section>
      </div>
    </div>
  );
}

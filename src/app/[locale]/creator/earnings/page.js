"use client";
import { useEffect } from "react";
import { getReviewStatus } from "@/lib/Payout";
import { useTheme } from "@/context/ThemeContext";
import { useLocale } from "next-intl";
import {
  useEarnings,
  WITH_EARNINGS,
  WITH_EARNINGS_COMPLETED,
  EMPTY,
} from "@/context/Earningscontext";
import WithdrawBanner from "./components/WithdrawBanner";
import EarningsSummary from "./components/EarningsSummary";
import EarningsCards from "./components/EarningsCards";
import HowItWorks from "./components/HowItWorks";
import VideosTable from "./components/VideosTable";
import ViewsByCountry from "./components/ViewsByCountry";
import EmptyState from "./components/EmptyState";
import WelcomeCard from "./components/WelcomeCard";

// خيارات التجربة:
// 1. WITH_EARNINGS           ← رصيد قيد التدقيق (لم تمر 7 أيام بعد)
// 2. WITH_EARNINGS_COMPLETED ← بعد مرور 7 أيام (يتفعل زر السحب ويظهر البانر)
// 3. EMPTY                   ← الحالة الفارغة (رصيد 0)
const mock = WITH_EARNINGS;

export default function EarningsPage() {
  const { isDark } = useTheme();
  const locale = useLocale();
  const { setEarningsData } = useEarnings();

  // مزامنة حالة الأرباح المختارة مع الـ Context ليتغير الرقم في النافبار تلقائياً
  useEffect(() => {
    setEarningsData(mock);
  }, [mock, setEarningsData]);

  const hasEarnings = mock.total > 0;
  const review = getReviewStatus(mock.reviewStartedAt);

  // البانر + الزر: فقط بعد مرور 7 أيام ووجود رصيد جاهز
  const canWithdraw = hasEarnings && review.completed && mock.ready > 0;
  const handleWithdraw = () => {
    // استدعاء الـ API (والسيرفر يتحقق من الـ 7 أيام أيضاً)
  };

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`creator-responsive-page min-h-screen w-full p-3 sm:p-4 md:p-6 flex flex-col gap-4 ${
        isDark ? "bg-[#000000F2] text-white" : "bg-white text-[#1A1A1A]"
      }`}
    >
      <WelcomeCard />

      {canWithdraw && <WithdrawBanner onWithdraw={handleWithdraw} />}

      <EarningsSummary data={mock} />
      <EarningsCards data={mock} review={review} onWithdraw={handleWithdraw} />

      {hasEarnings ? (
        <>
          <HowItWorks review={review} />
          <VideosTable />
          <ViewsByCountry />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

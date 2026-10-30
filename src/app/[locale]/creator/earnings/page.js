"use client";
import { useEffect, useState } from "react";
import { getReviewStatus } from "@/lib/Payout";
import { useTheme } from "@/context/ThemeContext";
import { useLocale } from "next-intl";
import {
  useEarnings,
  WITH_EARNINGS,
  WITH_EARNINGS_COMPLETED,
  EMPTY,
} from "@/context/Earningscontext";
import { useNotifications } from "@/context/NotificationsContext";
import { useUser } from "@/context/UserContext";
import { getSavedUser } from "@/lib/axiosInstance";
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
// 2. WITH_EARNINGS_COMPLETED ← بعد مرور 7 أيام (يتفعل زر السحب ويظهر البانر والإشعار)
// 3. EMPTY                   ← الحالة الفارغة (رصيد 0)
const mock = WITH_EARNINGS_COMPLETED;

export default function EarningsPage() {
  const { isDark } = useTheme();
  const locale = useLocale();
  const isAr = locale === "ar";
  const { setEarningsData } = useEarnings();
  const { addEarningsNotification } = useNotifications();

  // اسم المستخدم (نفس مصدر الـ Navbar وWelcomeCard وWithdrawBanner)
  const { user: contextUser } = useUser() || {};
  const [savedUser, setSavedUser] = useState(null);

  useEffect(() => {
    setSavedUser(getSavedUser());
  }, []);

  const user = contextUser || savedUser;
  const fullName = user?.fullName || user?.name || user?.username || "صهيب";
  const firstName = fullName.trim().split(" ")[0];

  // مزامنة حالة الأرباح المختارة مع الـ Context ليتغير الرقم في النافبار تلقائياً
  useEffect(() => {
    setEarningsData(mock);
  }, [setEarningsData]);

  const hasEarnings = mock.total > 0;
  const review = getReviewStatus(mock.reviewStartedAt);

  // البانر + الزر + إرسال الإشعار: عند مرور 7 أيام كاملة ووجود رصيد جاهز
  const canWithdraw = hasEarnings && review.completed && mock.ready > 0;

  // إرسال الإشعار الموجود في التصميم عند مرور 7 أيام
  useEffect(() => {
    if (canWithdraw) {
      addEarningsNotification({
        name: firstName,
        amount: "2,753.80",
        days: 7,
        clipTitle: "استثمار الذكاء الاصطناعي في ريادة الأعمال",
        clipTitleEn: "AI Investing in Entrepreneurship",
        isAr,
      });
    }
  }, [canWithdraw, firstName, isAr, addEarningsNotification]);

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

"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import PageLoader from "@/components/PageLoader";
import { getSubmission } from "./submissionsApi";
import ReceivedView from "./ReceivedView";
import ReviewView from "./ReviewView";
import RejectedView from "./RejectedView";
import ApprovedView from "./ApprovedView";

export default function ResultContent() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");

  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState(false);
  const pollTimerRef = useRef(null);

  useEffect(() => {
    if (!submissionId) return;

    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 40; // ~2 دقيقة كحد أقصى (40 × 3 ثوانٍ)

    const fetchCurrentSubmission = async () => {
      try {
        const data = await getSubmission(submissionId);
        if (!isMounted) return;
        setSubmission(data);

        // §5.1: Polling كل 3 ثوانٍ طالما الفحص الذكي قيد المعالجة (PROCESSING)
        if (data?.displayStatus === "PROCESSING" && pollCount < maxPolls) {
          pollCount += 1;
          pollTimerRef.current = setTimeout(fetchCurrentSubmission, 3000);
        }
      } catch (err) {
        if (isMounted) setError(true);
      }
    };

    fetchCurrentSubmission();

    return () => {
      isMounted = false;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [submissionId]);

  const page = isDark ? "bg-[#050505] text-gray-100" : "bg-[#f4f6f5] text-[#191c1d]";

  if (error || !submissionId) {
    return (
      <div className={`min-h-screen p-6 text-sm text-red-400 font-tajawal ${page}`}>
        تعذر تحميل حالة التسليم
      </div>
    );
  }

  if (!submission) return <PageLoader />;

  // The backend record is authoritative; AI scores are advisory and never change this lifecycle state.
  const statusKey = String(submission.displayStatus || submission.status || "").toUpperCase();

  const views = {
    APPROVED: ApprovedView,
    MANUAL_REVIEW: ReviewView,
    AWAITING_ADVERTISER: ReceivedView,
    AI_REJECTED: RejectedView,
    REJECTED: RejectedView,
    PROCESSING: ReceivedView,
    SUBMITTED: ReceivedView,
  };
  const View = views[statusKey] || ReceivedView;

  const campaignData = submission.campaign?.id || submission.campaign?.name ? {
    id: submission.campaign.id,
    title: submission.campaign.name || "",
    company: submission.campaign.brand?.name || "",
    image: submission.campaign.brand?.logo || "",
    hashtags: Array.isArray(submission.hashtags) ? submission.hashtags : [],
  } : null;

  // توحيد الحقول للتوافق التام مع الشاشات المشتركة
  const normalizedSubmission = {
    ...submission,
    link: submission.link || submission.postUrl || submission.canonicalUrl || "",
    platform: (submission.platform || "tiktok").toLowerCase(),
    aiScore: Number.isFinite(submission.aiScore) ? submission.aiScore : null,
    reference: submission.code || submission.id?.slice(-8)?.toUpperCase(),
  };

  return (
    <div
      className={`creator-responsive-page min-h-screen w-full font-tajawal p-3 sm:p-4 md:p-6 ${page}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <View submission={normalizedSubmission} campaign={campaignData} />
    </div>
  );
}

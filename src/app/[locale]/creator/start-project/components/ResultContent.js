"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import PageLoader from "@/components/PageLoader";
import { mockCampaigns } from "./campaignsData";
import { getSubmission } from "./submissionsApi";
import ReceivedView from "./ReceivedView";
import ReviewView from "./ReviewView";
import RejectedView from "./RejectedView";
import ApprovedView from "./ApprovedView";

export default function ResultContent() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const { campaignId } = useParams();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");
  const mockStatus = searchParams.get("status"); // للتجربة فقط

  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState(false);
  const pollTimerRef = useRef(null);

  const campaign = mockCampaigns.find((c) => c.id === campaignId);

  useEffect(() => {
    if (!submissionId) {
      // إذا لم يكن هناك submissionId وكان mockStatus موجوداً للتجربة
      if (mockStatus) {
        setSubmission({
          id: "mock",
          displayStatus: mockStatus.toUpperCase(),
          status: mockStatus.toUpperCase(),
          platform: "TIKTOK",
          link: "https://www.tiktok.com/@example/video/1234567890",
          aiScore: 96,
        });
      }
      return;
    }

    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 40; // ~2 دقيقة كحد أقصى (40 × 3 ثوانٍ)

    const fetchCurrentSubmission = async () => {
      try {
        const data = await getSubmission(submissionId, mockStatus);
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
  }, [submissionId, mockStatus]);

  const page = isDark ? "bg-[#050505] text-gray-100" : "bg-[#f4f6f5] text-[#191c1d]";

  if (error) {
    return (
      <div className={`min-h-screen p-6 text-sm text-red-400 font-tajawal ${page}`}>
        تعذر تحميل حالة التسليم
      </div>
    );
  }

  if (!submission) return <PageLoader />;

  // §2: استخدام displayStatus لتحديد الشاشة المناسبة (مع دعم mockStatus وstatus كـ fallback)
  const statusKey = (mockStatus || submission.displayStatus || submission.status || "").toUpperCase();

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

  // توفير بيانات الحملة (من mockCampaigns أو من كائن submission.campaign القادم من الـ API)
  const campaignData = campaign || {
    id: submission.campaign?.id || campaignId,
    title: submission.campaign?.name || "حملة إعلانية",
    company: submission.campaign?.brand?.name || "المعلن",
    image: submission.campaign?.brand?.logo || "/images/parthiom.webp",
    hashtags: submission.hashtags || [],
    account: submission.preview?.authorHandle || "@BrandAccount",
  };

  // توحيد الحقول للتوافق التام مع الشاشات المشتركة
  const normalizedSubmission = {
    ...submission,
    link: submission.link || submission.postUrl || submission.canonicalUrl || "",
    platform: (submission.platform || "tiktok").toLowerCase(),
    aiScore: submission.aiScore ?? 96,
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
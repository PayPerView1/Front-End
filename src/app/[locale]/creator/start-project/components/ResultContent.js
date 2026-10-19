"use client";
import ApprovedView from "./ApprovedView";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import PageLoader from "@/components/PageLoader";
import { mockCampaigns } from "./campaignsData";
import { getSubmission } from "./submissionsApi";
import ReceivedView from "./ReceivedView";
import ReviewView from "./ReviewView";
import RejectedView from "./RejectedView";
export default function ResultContent() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const { campaignId } = useParams();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");
  const mockStatus = searchParams.get("status"); // للتجربة فقط
  
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState(false);

  const campaign = mockCampaigns.find((c) => c.id === campaignId);

  useEffect(() => {
    getSubmission(submissionId, mockStatus)
      .then(setSubmission)
      .catch(() => setError(true));
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
  const views = {
  APPROVED: ApprovedView,
  MANUAL_REVIEW: ReviewView,
  REJECTED: RejectedView,
};
  const View = views[submission.status] || ReceivedView;
  
  return (
    <div
      className={`min-h-screen w-full font-tajawal p-4 md:p-6 ${page}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <View submission={submission} campaign={campaign} />
    </div>
  );
}
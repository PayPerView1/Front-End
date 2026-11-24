import ClipSubmissionReview from "@/app/[locale]/advertiser/clips/components/ClipSubmissionReview";

export default async function ClipDetailsPage({ params, searchParams }) {
  const { clipId } = await params;
  const query = await searchParams;
  return (
    <ClipSubmissionReview
      campaignId={query?.campaignId || ""}
      focusedSubmissionId={clipId}
    />
  );
}

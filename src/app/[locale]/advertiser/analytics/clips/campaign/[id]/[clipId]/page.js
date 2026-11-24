import ClipSubmissionReview from "@/app/[locale]/advertiser/clips/components/ClipSubmissionReview";

export default async function CampaignClipDetailsPage({ params }) {
  const { id, clipId } = await params;
  return <ClipSubmissionReview campaignId={id} focusedSubmissionId={clipId} />;
}

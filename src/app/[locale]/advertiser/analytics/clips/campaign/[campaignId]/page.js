import CampaignClipsReview from "./components/CampaignClipsReview";
export default async function CampaignClipsReviewPage({ params }) {
  const { id } = await params;
  return <CampaignClipsReview campaignId={id} />;
}
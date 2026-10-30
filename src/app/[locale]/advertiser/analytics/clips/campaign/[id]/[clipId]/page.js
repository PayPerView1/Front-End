import ClipDetails from "../../../[clipId]/components/ClipDetails";

export default async function CampaignClipDetailsPage({ params }) {
  const { id, campaignId, clipId } = await params;
  return <ClipDetails campaignId={id || campaignId} clipId={clipId} />;
}

import ClipDetails from "../../../[clipId]/components/ClipDetails";

export default async function CampaignClipDetailsPage({ params }) {
  const { campaignId, clipId } = await params;
  return <ClipDetails campaignId={campaignId} clipId={clipId} />;
}

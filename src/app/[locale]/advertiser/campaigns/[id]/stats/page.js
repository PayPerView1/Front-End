import CampaignStats from "./components/CampaignStats";

export default async function CampaignStatsPage({ params }) {
  const { id } = await params;
  return <CampaignStats campaignId={id} />;
}
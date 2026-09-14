// app/[locale]/advertiser/campaigns/[id]/page.jsx
import CampaignDetailsClient from "./components/CampaignDetailsClient";

export default async function CampaignDetailsPage({ params }) {
  const { id } = await params;
  return <CampaignDetailsClient campaignId={id} />;
}
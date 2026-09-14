// app/[locale]/advertiser/campaigns1/[id]/page.jsx
import CampaignDetailsClient from "./components/CampaignDetailsClient";

export default function CampaignDetailsPage({ params }) {
  return <CampaignDetailsClient campaignId={params.id} />;
}
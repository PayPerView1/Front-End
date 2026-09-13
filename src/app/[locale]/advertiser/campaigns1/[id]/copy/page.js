import CopyOverlay from "./components/CopyOverlay";

async function getCampaign(id) {
  return {
    id,
    name: "إطلاق الربع الثالث - ألفا",
  };
}

export default async function CopyPage({ params }) {
  const campaign = await getCampaign(params.id);
  return <CopyOverlay campaignId={params.id}/>;
}
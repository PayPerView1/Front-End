import CopyOverlay from "./components/CopyOverlay";

async function getCampaign(id) {
  return {
    id,
    name: "إطلاق الربع الثالث - ألفا",
  };
}

export default async function CopyPage({ params }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  return <CopyOverlay campaignId={id}/>;
}
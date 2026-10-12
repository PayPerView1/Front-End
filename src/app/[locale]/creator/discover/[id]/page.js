import CampaignDetails from "./components/CampaignDetails";

export default async function Page({ params }) {
  const { id } = await params;
  return <CampaignDetails id={id} />;
}
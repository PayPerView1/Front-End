import ClipDetails from "./components/ClipDetails";
export default async function ClipDetailsPage({ params }) {
  const { id, clipId } = await params;
  return <ClipDetails campaignId={id} clipId={clipId} />;
}
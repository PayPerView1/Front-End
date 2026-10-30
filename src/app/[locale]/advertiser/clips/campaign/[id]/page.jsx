import ClipSubmissionReview from "../../components/ClipSubmissionReview";

export const metadata = {
  title: "مراجعة مقاطع الحملة | PayPerView",
  description: "مراجعة واعتماد الفيديوهات المسلمة للحملة",
};

export default async function CampaignClipsReviewPage({ params }) {
  const { id } = await params;
  return <ClipSubmissionReview campaignId={id} />;
}

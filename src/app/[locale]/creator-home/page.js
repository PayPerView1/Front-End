import CreatorDashboard from "@/features/dashboard/CreatorDashboard";

export const metadata = {
  title: "الرئيسية - صانع المحتوى | Pay Per View",
  description: "لوحة تحكم صانع المحتوى الرئيسية - Pay Per View",
};

export default async function CreatorHomePage({ params, searchParams }) {
  const { locale = "ar" } = (await params) || {};
  const resolvedSearchParams = (await searchParams) || {};
  const showCampaigns = resolvedSearchParams.view === "190" || resolvedSearchParams.campaigns === "true";

  return (
    <CreatorDashboard
      locale={locale}
      standalone={true}
      defaultHasRecommendations={showCampaigns}
    />
  );
}

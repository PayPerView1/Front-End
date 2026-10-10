import AccountSettings from "@/features/profile/AccountSettings";

export const metadata = {
  title: "التوصيات والاهتمامات | Pay Per View",
  description: "نظام إدارة وتخصيص الاهتمامات والتوصيات - Pay Per View",
};

export default async function InterestsRecommendationsPage({ params }) {
  const { locale = "ar" } = (await params) || {};

  return <AccountSettings locale={locale} initialTab="interests" standalone={true} />;
}


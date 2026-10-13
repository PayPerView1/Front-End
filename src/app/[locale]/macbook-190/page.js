import CreatorDashboard from "@/features/dashboard/CreatorDashboard";

export const metadata = {
  title: "الرئيسية | Pay Per View",
  description: "لوحة تحكم صانع المحتوى - Pay Per View",
};

export default async function MacBookPro190Page({ params }) {
  const { locale = "ar" } = (await params) || {};

  return <CreatorDashboard locale={locale} standalone={true} />;
}


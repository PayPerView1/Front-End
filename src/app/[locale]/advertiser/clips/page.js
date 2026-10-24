import ClipApprovalView from "@/features/clips/ClipApprovalView";

export const metadata = {
  title: "إدارة المقاطع ومراجعة الاعتماد | Pay Per View",
  description: "مراجعة وتدقيق تفاصيل المقطع المبتكر واعتماد المشاهدات - Pay Per View",
};

export default async function ClipsPage({ params }) {
  const { locale = "ar" } = (await params) || {};

  return <ClipApprovalView locale={locale} />;
}

import ClipApprovalView from "@/features/clips/ClipApprovalView";

export const metadata = {
  title: "تأكيد اعتماد وقبول المقطع الإعلاني | Pay Per View",
  description: "مراجعة وتدقيق تفاصيل المقطع المبتكر واعتماد المشاهدات - Pay Per View",
};

export default async function PreviewModalPage({ params }) {
  const { locale = "ar" } = (await params) || {};

  return <ClipApprovalView locale={locale} />;
}

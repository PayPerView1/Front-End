import ClipApprovalView from "@/features/clips/ClipApprovalView";

export const metadata = {
  title: "تأكيد اعتماد وقبول المقطع الإعلاني (MacBook Pro 214) | Pay Per View",
  description: "مراجعة وتدقيق تفاصيل المقطع المبتكر واعتماد المشاهدات - Pay Per View",
};

export default async function MacBookPro214Page({ params }) {
  const { locale = "ar" } = (await params) || {};

  return <ClipApprovalView locale={locale} />;
}

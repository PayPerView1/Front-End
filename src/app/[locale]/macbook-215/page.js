import ClipRejectionView from "@/features/clips/ClipRejectionView";

export const metadata = {
  title: "رفض المقطع وتحديد السبب (MacBook Pro 215) | Pay Per View",
  description: "مراجعة وتدقيق تفاصيل المقطع المبتكر وتحديد سبب الرفض - Pay Per View",
};

export default async function MacBookPro215Page({ params }) {
  const { locale = "ar" } = (await params) || {};

  return <ClipRejectionView locale={locale} />;
}

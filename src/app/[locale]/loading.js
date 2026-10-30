import PageLoader from "@/components/PageLoader";

/**
 * loading.js — شاشة تحميل موحّدة لكل صفحات الموقع
 * يُعرض تلقائياً بواسطة Next.js أثناء تحميل أي صفحة (Suspense boundary)
 */
export default function Loading() {
  return <PageLoader />;
}

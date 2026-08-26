import { Suspense } from "react";
import TokenHandler from "@/app/[locale]/dashboard/components/TokenHandler";

export default async function DashboardLayout({ children }) {
  return (
    <>
      {/* يلتقط توكن Google OAuth من الـ URL ويحفظه تلقائياً */}
      <Suspense fallback={null}>
        <TokenHandler />
      </Suspense>
      {children}
    </>
  );
}
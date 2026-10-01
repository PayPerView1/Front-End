import { Suspense } from "react";
import PaymentSuccessPage from "@/app/[locale]/advertiser/wallet/payment/success/components/PaymentSuccessPage";

export const metadata = {
  title: "التحقق من الدفعة | Pay Per View",
  description: "جاري التحقق من حالة دفعتك وشحن محفظتك الإعلانية",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessPage />
    </Suspense>
  );
}

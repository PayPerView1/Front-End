import { Suspense } from "react";
import PaymentSuccessPage from "@/features/wallet/components/payment/success/PaymentSuccessPage";

export const metadata = {
  title: "التحقق من الدفعة | Pay Per View",
  description: "جاري التحقق من حالة دفعتك وشحن محفظتك الإعلانية",
};

export default function WalletSuccessRoute() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessPage />
    </Suspense>
  );
}

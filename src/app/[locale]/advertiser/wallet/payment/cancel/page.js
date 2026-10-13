import { Suspense } from "react";
import PaymentCancelPage from "@/features/wallet/components/payment/cancel/PaymentCancelPage";

export const metadata = {
  title: "تم إلغاء عملية الدفع | Pay Per View",
  description: "تم إلغاء عملية الدفع. لم يتم خصم أي مبلغ من حسابك.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelPage />
    </Suspense>
  );
}

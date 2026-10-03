import { Suspense } from "react";
import BankTransferPage from "@/features/wallet/pages/BankTransferPage";

export const metadata = {
  title: "حالة التحويل البنكي | Pay Per View",
  description: "التحقق من حالة إيداع التحويل البنكي",
};

export default function BankTransferRoute() {
  return (
    <Suspense fallback={null}>
      <BankTransferPage />
    </Suspense>
  );
}

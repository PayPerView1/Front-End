import PaymentCancelPage from "@/app/[locale]/advertiser/wallet/payment/cancel/components/PaymentCancelPage";

export const metadata = {
  title: "تم إلغاء عملية الدفع | Pay Per View",
  description: "تم إلغاء عملية الدفع. لم يتم خصم أي مبلغ من حسابك",
};

export default function Page() {
  return <PaymentCancelPage />;
}

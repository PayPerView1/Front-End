import PaymentCancelled125Page from "@/features/wallet/components/topup/components/PaymentCancelled125Page";

export const metadata = {
  title: "تم إلغاء عملية الدفع | Pay Per View",
  description: "تم إلغاء عملية الدفع. لم يتم خصم أي مبلغ من حسابك.",
};

export default function Page() {
  return <PaymentCancelled125Page />;
}

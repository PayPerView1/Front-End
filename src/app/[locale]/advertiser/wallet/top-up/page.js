import WalletTabsWrapper from "@/features/wallet/components/topup/components/WalletTabsWrapper";

export const metadata = {
  title: "شحن المحفظة الرقمية | Pay Per View",
  description: "صفحة شحن المحفظة واختيار طريقة الدفع المتاحة",
};

export default function WalletTopUpRoute() {
  return <WalletTabsWrapper />;
}

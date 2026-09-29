import MultiDepositPage from "./components/MultiDepositPage";

export const metadata = {
  title: "عمليات الشحن المتعددة والتحديث التراكمي للرصيد | Pay Per View",
  description: "لوحة متابعة عمليات الشحن المتعددة في نفس اليوم وتحديث رصيد المحفظة تراكمياً وفورياً",
};

export default function Page() {
  return <MultiDepositPage />;
}

import DepositSuccessPage from "./components/DepositSuccessPage";

export const metadata = {
  title: "تأكيد عملية الشحن وتخصيص الميزانيات | Pay Per View",
  description: "تم استلام الدفعة واعتمادها بنجاح والرصيد متاح لتخصيص ميزانيات الحملات الإعلانية",
};

export default function Page() {
  return <DepositSuccessPage />;
}

import ExpiredDraftsContent from "./components/ExpiredDraftsContent";

export const metadata = {
  title: "المسودات منتهية الصلاحية | Pay Per View",
  description: "مسودات لم يتم تحديثها منذ أكثر من 30 يوماً",
};

export default function ExpiredDraftsPage() {
  return <ExpiredDraftsContent />;
}

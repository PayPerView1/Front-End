import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import EditProfileContent from "@/app/[locale]/edit-profile/components/EditProfileContent";
import DashboardWrapper from "@/components/DashboardWrapper";

export const metadata = {
  title: "تعديل الملف الشخصي | Pay Per View",
};

export default function EditProfilePage() {
  return (
    <DashboardWrapper>
      <Sidebar />
      <div className="flex flex-col flex-1 lg:mr-[260px]">
        <Navbar />
        <main className="flex flex-1">
          <EditProfileContent />
        </main>
      </div>
    </DashboardWrapper>
  );
}
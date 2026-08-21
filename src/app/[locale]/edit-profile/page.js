import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import EditProfileContent from "@/app/[locale]/edit-profile/components/EditProfileContent";
import DashboardWrapper from "@/components/DashboardWrapper";
import { getLocale } from "next-intl/server";

export const metadata = {
  title: "تعديل الملف الشخصي | Pay Per View",
};

export default async function EditProfilePage() {
  const locale = await getLocale();
  return (
    <DashboardWrapper>
      <Sidebar />
      <div className={`flex flex-col flex-1 ${locale === "ar" ? "lg:mr-[260px]" : "lg:ml-[260px]"}`}>
        <Navbar />
        <main className="flex flex-1">
          <EditProfileContent />
        </main>
      </div>
    </DashboardWrapper>
  );
}

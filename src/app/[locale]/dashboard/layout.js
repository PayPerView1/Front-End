import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div dir="rtl" className="min-h-screen">
      <Navbar />

      <Sidebar />

      <main className="lg:mr-[260px]">{children}</main>
    </div>
  );
}

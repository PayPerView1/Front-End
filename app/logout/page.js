import Image from "next/image";
import LogoutButton from "./components/LogoutButton";

export const metadata = {
  title: "تسجيل الخروج | Pay Per View",
  description: "صفحة تسجيل الخروج",
};

export default function LogoutButtonPage() {
  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-10 bg-black overflow-hidden"
    >
      <Image
        src="/image.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* تم تقليل العتامة هنا من 65 إلى 30 لزيادة وضوح الصورة */}
      <div className="absolute inset-0 bg-black/5 z-10" />

      <div className="relative z-20 text-center">

        <LogoutButton />
      </div>
    </div>
  );
}
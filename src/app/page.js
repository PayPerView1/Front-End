import Image from "next/image";
import ForgotPasswordCard from "./components/ForgotPasswordCard";

export const metadata = {
  title: "نسيت كلمة المرور",
  description: "طلب إعادة تعيين كلمة المرور",
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden" dir="rtl">
      {/* Background Image */}
      <Image
        src="/new-bg.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover object-center absolute inset-0 z-0"
      />

      {/* Overlay for background darkening */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 w-full flex justify-center">
        <ForgotPasswordCard />
      </div>
    </main>
  );
}

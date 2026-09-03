import Image from "next/image";
import ForgotPasswordCard from "./components/ForgotPasswordCard";

export const metadata = {
  title: "نسيت كلمة المرور | Pay Per View",
  description: "إعادة تعيين كلمة المرور",
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/new-bg.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover object-center absolute inset-0 z-0"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        <ForgotPasswordCard />
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import PasswordResetSuccessCard from "./components/PasswordResetSuccessCard";

export const metadata = {
  title: "تم تحديث كلمة المرور",
  description: "تم إعادة تعيين كلمة المرور بنجاح",
};

export default function DonePage() {
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
        <PasswordResetSuccessCard />

        <Link
          href="/"
          className="flex items-center gap-2 text-[14px] text-[#E1E3E4] hover:text-white transition-colors"
        >
          العودة إلى تسجيل الدخول
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rotate-180"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </main>
  );
}

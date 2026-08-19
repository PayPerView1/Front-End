import Image from "next/image";
import Link from "next/link";
import ResetPasswordCard from "@/components/ResetPasswordCard";

export const metadata = {
  title: "تعيين كلمة مرور جديدة",
  description: "إعادة تعيين كلمة المرور الجديدة",
};

export default function ResetPasswordPage() {
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        <ResetPasswordCard />

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
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      </div>
    </main>
  );
}

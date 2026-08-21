import LoginForm from "./components/loginform";
import Image from "next/image";

export const metadata = {
  title: "تسجيل الدخول | Pay Per View",
  description: "صفحة تسجيل الدخول",
};

export default function LoginPage() {
  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-10 bg-black overflow-hidden"
    >
      {/* صورة الخلفية */}
      <Image
        src="/image.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* طبقة التظليل */}
      <div className="absolute inset-0 bg-black/65 z-10" />

      {/* بطاقة تسجيل الدخول فوق جميع الطبقات */}
      <div className="relative z-20 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "react-iconly";

export default function VerifyEmail({ email = "user@example.com" }) {
    const [resent, setResent] = useState(false);
    const router = useRouter(); 
function handleResend() {
    // هون بتبعت طلب إعادة الإرسال للـ API
    setResent(true);
    setTimeout(() => setResent(false), 3000);
}
    return (
        <div 
  dir="rtl" 
  className="flex flex-col items-center justify-center gap-10 text-center px-16 py-14 rounded-2xl border border-white/[0.07] bg-transparent backdrop-blur-lg"
  style={{ width: "643px", height: "511px" }}
>
        {/* أيقونة الإيميل */}
        <div className="w-20 h-20 rounded-full bg-[#F97316] flex items-center justify-center">
            <Message set="bold" size={36} primaryColor="white" />
        </div>
        
        {/* العنوان */}
        <h1 className="text-3xl font-medium text-white whitespace-nowrap">
            تحقق من بريدك الإلكتروني
        </h1>
        
        {/* الوصف */}
        <div className="flex flex-col gap-2">
            <p className="text-sm text-[#BFC9C4]">
                لقد أرسلنا رابط تفعيل إلى:
                <span className="text-white font-bold mx-1">{email}</span>
            </p>
        <p className="text-sm text-[#BFC9C4]">
            يرجى التحقق من صندوق الوارد، والنقر على رابط التفعيل
        </p>
        </div>
        
        {/* زر إعادة الإرسال */}
        <button
        onClick={handleResend}
        className="h-12 px-8 rounded-lg text-white text-base font-bold cursor-pointer border-none flex items-center gap-2"
        style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
        >
            {resent ? "تم الإرسال " : (
                <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4C7.58 4 4 7.58 4 12s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                إعادة إرسال الرابط
                </>
                )}
        </button>
        <button
        onClick={() => router.push("/dashboard")}
        className="text-sm text-[#94D3C1] underline cursor-pointer bg-transparent border-none mt-2"
        >
        تم التحقق - متابعة
        </button>
    </div>
    );
}
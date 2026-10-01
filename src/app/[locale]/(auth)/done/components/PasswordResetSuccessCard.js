'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PasswordResetSuccessCard() {
  return (
    <div
      dir="rtl"
      className="
        flex flex-col items-center
        w-full max-w-[480px]
        rounded-[16px]
        p-8
        gap-[38px]
        bg-white/[0.02]
        border border-white/10
        shadow-[0_32px_64px_0px_rgba(0,0,0,0.5)]
        backdrop-blur-[4px]
      "
    >
      {/* ── A. Top Header Icon / Illustration (logo.png) ── */}
      <div className="flex justify-center w-full">
        <div className="relative w-[81.75px] h-[88.59px]">
          <Image
            src="/logo.png"
            alt="شعار التطبيق"
            fill
            priority
            className="object-contain rounded-[104px]"
          />
        </div>
      </div>

      {/* ── B. Success Icon Badge ── */}
      <div className="flex flex-col items-center gap-[38px] w-full">
        {/* Outer ring — 80×80, border #94D3C1/30 */}
        <div
          className="
            relative flex items-center justify-center
            w-20 h-20
            rounded-full
            border border-[#94D3C1]/30
          "
          style={{
            boxShadow: '0px 0px 40px 0px rgba(233, 195, 73, 0.20)',
          }}
        >
          {/* Inner container — 40×40, bg #94D3C1/10, checkmark image */}
          <div
            className="
              flex items-center justify-center
              w-10 h-10
              rounded-full
              bg-[#94D3C1]/10
            "
          >
            <div className="relative w-10 h-10">
              <Image
                src="/Container.png"
                alt="تم بنجاح"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* ── C. Success Text Content ── */}
        <div className="flex flex-col items-center gap-[12px] text-center px-2">
          {/* Main heading */}
          <h1
            className="
              font-bold
              text-[32px]
              leading-[38.4px]
              tracking-[-0.32px]
              text-[#E1E3E4]
              text-center
            "
          >
            تم تحديث كلمة المرور بنجاح!
          </h1>

          {/* Subtitle */}
          <p
            className="
              font-normal
              text-[16px]
              leading-[25.6px]
              text-[#BFC9C4]
              text-center
              max-w-[480px]
            "
          >
            الرجاء الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
          </p>
        </div>

        {/* ── D. Action Button ── */}
        <Link
          href="/"
          className="
            flex items-center justify-center
            w-full
            h-[35px]
            rounded-lg
            font-bold text-base text-white
            bg-gradient-to-l from-[#FFA600] to-[#FF4B04]
            hover:opacity-90 active:opacity-100
            transition-opacity duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA600]/60
          "
        >
          الذهاب إلى تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}

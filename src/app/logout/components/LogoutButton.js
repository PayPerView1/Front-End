"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logout } from "@/services/authService";
import LoadingOverlay from "./LoadingOverlay";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConfirmLogout = async () => {
    setShowModal(false);
    setIsLoading(true);

    try {
      await logout();
    } catch (error) {
      console.error("فشل تسجيل الخروج من السيرفر:", error);
    } finally {
      localStorage.removeItem("token");
    }

    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-white text-sm px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
      >
        تسجيل الخروج
      </button>

      {isLoading && <LoadingOverlay />}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-[440px] rounded-[24px] bg-white/[0.005] border border-white/10 backdrop-blur-[6px] shadow-[0_0_50px_rgba(0,0,0,0.6)] px-8 py-9 text-center">
            {/* اللوجو */}
            <div className="flex justify-center mb-5">
              <Image
                src="/logo1.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-16 h-16 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] object-contain"
              />
            </div>

            {/* العنوان */}
            <h2 className="text-white text-2xl font-bold mb-3 tracking-wide">
              تسجيل خروج
            </h2>

            {/* السؤال */}
            <p className="text-gray-200 text-base font-medium mb-1">
              هل أنت متأكد من تسجيل الخروج؟
            </p>
            <p className="text-gray-400 text-xs mb-8">
              سيتم إنهاء جلستك الحالية.
            </p>

            {/* الأزرار */}
            <div className="flex gap-3.5">
              <button
                onClick={handleConfirmLogout}
                style={{ background: "linear-gradient(97.47deg, #FFA600 0%, #FF4B04 100%)" }}
                className="flex-1 rounded-xl text-white font-semibold text-sm py-3.5 shadow-[0_4px_20px_rgba(234,88,12,0.4)] transition-all"
              >
                تسجيل الخروج
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl bg-transparent border border-white/70 text-white font-semibold text-sm py-3.5 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

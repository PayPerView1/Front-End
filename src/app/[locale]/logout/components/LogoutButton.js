"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logout } from "@/services/authService";
import LoadingOverlay from "./LoadingOverlay";
import { useLocale, useTranslations } from "next-intl";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  const handleConfirmLogout = async () => {
    setShowModal(false);
    setIsLoading(true);

    try {
      await logout();
    } catch (error) {
      console.error("فشل تسجيل الخروج من السيرفر:", error);
    } finally {
      router.push(`/${locale}/login`);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-[440px] rounded-[24px] bg-white/[0.005] border border-white/10 backdrop-blur-[6px] shadow-[0_0_50px_rgba(0,0,0,0.6)] px-8 py-9 text-center">
            <div className="flex justify-center mb-5">
              <Image
                src="/logo1.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-16 h-16 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] object-contain"
              />
            </div>

            <h2 className="text-white text-2xl font-bold mb-3 tracking-wide">
              {t("signOutTitle")}
            </h2>
            <p className="text-gray-200 text-base font-medium mb-1">
              {t("confirmSignOut")}
            </p>
            <p className="text-gray-400 text-xs mb-8">
              {t("signOutDescription")}
            </p>

            <div className="flex gap-3.5">
              <button
                onClick={handleConfirmLogout}
                style={{ background: "linear-gradient(97.47deg, #FFA600 0%, #FF4B04 100%)" }}
                className="flex-1 rounded-xl text-white font-semibold text-sm py-3.5 shadow-[0_4px_20px_rgba(234,88,12,0.4)] transition-all"
              >
                {t("signOut")}
              </button>
              <button
                onClick={() => router.push(`/${locale}/dashboard`)}
                className="flex-1 rounded-xl bg-transparent border border-white/70 text-white font-semibold text-sm py-3.5 transition-all"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

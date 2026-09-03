"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getSavedUser } from "@/lib/axiosInstance";

/**
 * Advertiser layout - only allows users with role BRAND.
 * If a CLIPPER user tries to access, they get redirected to /creator/dashboard.
 */
export default function AdvertiserLayout({ children }) {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const user = getSavedUser();
    if (user && user.role && user.role !== "BRAND") {
      // صانع المحتوى (CLIPPER) لا يحق له الوصول لصفحات صاحب الحملة
      router.replace(`/${locale}/creator/dashboard`);
    }
  }, [router, locale]);

  return children;
}

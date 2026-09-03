"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getSavedUser } from "@/lib/axiosInstance";

/**
 * Creator layout - only allows users with role CLIPPER.
 * If a BRAND user tries to access, they get redirected to /advertiser/dashboard.
 */
export default function CreatorLayout({ children }) {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const user = getSavedUser();
    if (user && user.role && user.role !== "CLIPPER") {
      // صاحب الحملة (BRAND) لا يحق له الوصول لصفحات صانع المحتوى
      router.replace(`/${locale}/advertiser/dashboard`);
    }
  }, [router, locale]);

  return children;
}

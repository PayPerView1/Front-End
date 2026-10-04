"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import axiosInstance, { getSavedUser, getToken, saveAuthData } from "@/lib/axiosInstance";
import { WalletProvider } from "@/features/wallet/WalletProvider";

/**
 * Advertiser layout - only allows users with role BRAND.
 * - No token → redirect to /login
 * - CLIPPER user → redirect to /creator/dashboard
 * - Any other role → redirect to the localized home page
 */
export default function AdvertiserLayout({ children }) {
  const router = useRouter();
  const locale = useLocale();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        router.replace(`/${locale}/login`);
        return;
      }

      let user = getSavedUser();
      if (!user || !user.role) {
        try {
          const profileRes = await axiosInstance.get("/api/v1/profile", {
            _skipAuthRedirect: true,
          });
          const profileData = profileRes.data;
          const fetchedUser = profileData?.user || profileData?.data || profileData;
          if (fetchedUser && typeof fetchedUser === "object" && fetchedUser.role) {
            user = fetchedUser;
            saveAuthData(token, user);
          }
        } catch (e) {
          console.error("Failed to fetch profile in AdvertiserLayout:", e);
        }
      }

      if (!isMounted) return;

      const role = (user?.role || "").toUpperCase();
      if (role === "CLIPPER") {
        router.replace(`/${locale}/creator/dashboard`);
      } else if (role === "BRAND") {
        setAllowed(true);
      } else {
        router.replace(`/${locale}`);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router, locale]);

  if (!allowed) return null;
  return <WalletProvider>{children}</WalletProvider>;
}


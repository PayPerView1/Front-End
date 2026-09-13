"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import axiosInstance, { getSavedUser, getToken, saveAuthData } from "@/lib/axiosInstance";

/**
 * Creator layout - only allows users with role CLIPPER.
 * - No token → redirect to /login
 * - BRAND user → redirect to /advertiser/dashboard
 * - Unknown role → stay here (prevent redirect loop)
 */
export default function CreatorLayout({ children }) {
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
          console.error("Failed to fetch profile in CreatorLayout:", e);
        }
      }

      if (!isMounted) return;

      const role = (user?.role || "").toUpperCase();
      if (role === "BRAND") {
        router.replace(`/${locale}/advertiser/dashboard`);
      } else {
        setAllowed(true);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router, locale]);

  if (!allowed) return null;
  return children;
}


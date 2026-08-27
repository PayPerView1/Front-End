"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import api from "@/services";

export default function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    const saveAndRedirect = async () => {
      try {
        api.saveAuthData(token, {});

        try {
          const profileData = await api.getProfile();
          if (profileData?.user) {
            api.saveAuthData(token, profileData.user);
          }
        } catch (err) {
          console.error("Failed to fetch profile after Google login:", err);
        }

        router.replace("/" + locale + "/dashboard");
      } catch (err) {
        console.error("TokenHandler error:", err);
      }
    };

    saveAndRedirect();
  }, [searchParams, router, locale]);

  return null;
}
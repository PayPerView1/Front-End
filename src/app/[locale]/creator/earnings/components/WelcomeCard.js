"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/UserContext";
import { getSavedUser } from "@/lib/axiosInstance";

export default function WelcomeCard() {
  const { isDark } = useTheme();
  const t = useTranslations("Earnings.welcome");
  const { user: contextUser } = useUser() || {};
  const [savedUser, setSavedUser] = useState(null);

  useEffect(() => {
    setSavedUser(getSavedUser());
  }, []);

  const user = contextUser || savedUser;
  const rawName = user?.fullName || user?.name || user?.username;
  const firstName =
    typeof rawName === "string" && rawName.trim()
      ? rawName.trim().split(" ")[0]
      : t("fallbackName");

  const card = isDark
    ? "bg-[#191C1D] border-[#191C1D]"
    : "bg-white border-[#E5E5E5]";
  const sub = isDark ? "text-[#9A9A9A]" : "text-[#666666]";

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${card}`}>
      <h1 className="text-lg sm:text-xl font-bold">
        {t("title", { name: firstName })} 👋
      </h1>
      <p className={`text-xs sm:text-sm mt-1 ${sub}`}>{t("subtitle")}</p>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { MdOutlineSecurity } from "react-icons/md";
import {
  FiTarget,
  FiHeart,
  FiLink,
  FiBell,
  FiCreditCard,
  FiAlertTriangle,
} from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";

// path = اسم المجلد داخل edit-profile ("" = الصفحة الرئيسية)
const menuItems = [
  { key: "profile", path: "", icon: RiUserLine },
  { key: "interests", path: "interests", icon: FiTarget },
  { key: "favorites", path: "favorites", icon: FiHeart },
  { key: "linkedAccounts", path: "linked-accounts", icon: FiLink },
  { key: "security", path: "security", icon: MdOutlineSecurity },
  { key: "notifications", path: "notifications", icon: FiBell },
  { key: "paymentMethods", path: "payment-methods", icon: FiCreditCard },
  { key: "disputes", path: "disputes", icon: FiAlertTriangle },
];

export default function Sidebar({ children }) {
  const { isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname() || "";
  const locale = useLocale();
  const translate = useTranslations();

  // يشتغل لـ creator و advertiser: /ar/creator/edit-profile أو /ar/advertiser/edit-profile
  const marker = "/edit-profile";
  const markerIndex = pathname.indexOf(marker);
  const base =
    markerIndex === -1
      ? `/${locale}/creator${marker}`
      : pathname.slice(0, markerIndex) + marker;

  const currentPath = pathname.replace(/\/$/, "");

  const t = {
    sidebarBg: isDark ? "bg-[#111]" : "bg-white",
    sidebarBorder: isDark ? "border-[#2D2D2D]" : "border-[#D6D6D6]",
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    activeMenu: isDark
      ? "bg-[#94D3C1]/15 text-[#94D3C1]"
      : "bg-[#0F766E]/10 text-[#0B625A]",
    activeIcon: isDark ? "#94D3C1" : "#0B625A",
    hoverMenu: isDark ? "hover:bg-white/5" : "hover:bg-black/5",
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col md:flex-row items-stretch">
      <div
        className={`w-full md:w-[240px] flex-shrink-0 self-stretch border-b md:border-b-0 md:border-l flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-start gap-0.5 py-1.5 md:py-3 px-4 sm:px-6 md:px-3 ${t.sidebarBg} ${t.sidebarBorder}`}
      >
        {/* العنوان */}
        <div
          className={`hidden md:block pb-2 mb-1 border-b px-2 ${t.sidebarBorder}`}
        >
          <p className={`text-lg font-bold ${t.text}`}>
            {translate("editProfile.accountSettings")}
          </p>
        </div>

        <nav className="flex min-w-0 flex-1 flex-row gap-0.5 overflow-x-auto lang-scroll md:flex-initial md:flex-col md:overflow-x-visible">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const href = item.path ? `${base}/${item.path}` : base;
            const isActive = currentPath === href;

            return (
              <Link
                key={item.key}
                href={href}
                className={`flex shrink-0 items-center gap-3 px-3 py-3 rounded-lg text-xs sm:text-sm no-underline ${
                  locale === "ar" ? "text-right" : "text-left"
                } cursor-pointer transition-all whitespace-nowrap
                ${
                  isActive
                    ? t.activeMenu
                    : `bg-transparent ${t.subText}${t.hoverMenu}`
                }`}
              >
                {/* الأيقونة مباشرة بدون إطار */}
                <Icon
                  size={18}
                  color={isActive ? t.activeIcon : isDark ? "#9A9A9A" : "#707070"}
                />

                <span>{translate(`editProfile.${item.key}`)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          className={`md:border-t md:pt-4 flex-shrink-0 ${t.sidebarBorder}`}
        >
          <button
            type="button"
            onClick={() => router.push(`/${locale}/logout`)}
            className="w-full h-9 px-4 md:px-0 rounded-lg text-white text-xs sm:text-sm font-bold cursor-pointer border-none whitespace-nowrap"
            style={{ background: "#DC2626" }}
          >
            {translate("editProfile.signOut")}
          </button>
        </div>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
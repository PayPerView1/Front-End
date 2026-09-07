"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Home,
  Search,
  Discovery,
  Plus,
  Bag,
  People,
  Message,
  Document,
} from "react-iconly";
import { FiFileText } from "react-icons/fi";

import { useTheme } from "@/context/ThemeContext";
import { BsList, BsX } from "react-icons/bs";
import { useLocale, useMessages } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useUser } from "@/context/UserContext";

// قائمة صانع المحتوى (CLIPPER)
const creatorNavItems = [
  { label: "home", href: "/creator/dashboard", icon: Home },
  { label: "search", href: "/search", icon: Search },
  { label: "discover", href: "/discover", icon: Discovery },
  { label: "startProject", href: "/new", icon: Plus },
  { label: "drafts", href: "/advertiser/drafts", icon: FiFileText, isReactIcon: true },
];

const creatorResourceItems = [
  { label: "members", href: "/members", icon: Bag },
  { label: "partners", href: "/partners", icon: People, badge: "new" },
  { label: "help", href: "/help", icon: Message },
  { label: "blog", href: "/blog", icon: Document },
];

// قائمة صاحب الحملة (BRAND)
const advertiserNavItems = [
  { label: "home", href: "/advertiser/dashboard", icon: Home },
  { label: "campaigns", href: "/advertiser/campaigns", icon: Discovery },
  { label: "analytics", href: "/advertiser/analytics", icon: Document },
  { label: "newCampaign", href: "/advertiser/new", icon: Plus },
  { label: "drafts", href: "/advertiser/drafts", icon: FiFileText, isReactIcon: true },
];

const advertiserResourceItems = [
  { label: "creators", href: "/advertiser/creators", icon: People },
  { label: "help", href: "/help", icon: Message },
  { label: "blog", href: "/blog", icon: Document },
];

const sidebarFallbacks = {
  home: "Home",
  search: "Search",
  discover: "Discover",
  startProject: "Start a project",
  drafts: "مسوداتي",
  resources: "Resources",
  members: "Members",
  partners: "Partners",
  new: "New",
  help: "Help",
  blog: "Blog",
  // advertiser labels
  campaigns: "Campaigns",
  analytics: "Analytics",
  newCampaign: "New Campaign",
  creators: "Creators",
};

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const messages = useMessages();

  const { user: contextUser } = useUser() || {};
  const role = (contextUser?.role || "").toUpperCase();
  const isAdvertiser = role === "BRAND" || role === "ADVERTISER" || pathname?.includes("/advertiser");
  const navItems = isAdvertiser ? advertiserNavItems : creatorNavItems;
  const resourceItems = isAdvertiser ? advertiserResourceItems : creatorResourceItems;

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1280) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebar = (key) =>
    messages.sidebar?.[key] || sidebarFallbacks[key];

  const { isDark } = useTheme();

  const t = {
    bg: isDark
      ? "bg-[#0D0D0D] border-[#2D2D2D]"
      : "bg-white border-[#E5E5E5]",

    text: isDark ? "text-white" : "text-[#1A1A1A]",

    subText: isDark
      ? "text-[#9A9A9A]"
      : "text-[#666666]",

    activeLink: isDark
      ? "bg-white/10 text-white"
      : "bg-[#F0F0F0] text-black",

    hoverLink: isDark
      ? "hover:text-white hover:bg-white/5"
      : "hover:text-black hover:bg-[#F5F5F5]",

    logoText: isDark
      ? "text-white"
      : "text-black",
  };

  const sidebarContent = (
    <>
      {/* الهيدر: اللوجو وزر الإغلاق محاذيان على نفس المستوى */}
      <div className="relative flex items-center px-6 py-5">
        <Image
          src={
            isDark
              ? "/logo.png"
              : "/images/image-PPV-light.png"
          }
          alt="logo"
          width={isDark ? 40 : 60}
          height={isDark ? 50 : 65}
          className="rounded-lg"
        />

        <span
          className={`font-bold text-lg mr-2 ${t.logoText}`}
          style={{
            fontWeight: 700,
            fontFamily: "var(--font-tajawal)",
          }}
        >
          Pay Per View
        </span>

        {/* زر الإغلاق - محاذاة مركزية عمودية مع اللوجو */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className={`
            min-[1280px]:hidden
            absolute
            top-1/2
            -translate-y-1/2
            ${locale === "ar" ? "left-4" : "right-4"}
            w-7
            h-7
            rounded-lg
            flex
            items-center
            justify-center
            border
            cursor-pointer
            transition-colors
            ${isDark
              ? "bg-[#1A1A1A] border-[#2D2D2D] text-white hover:bg-white/10"
              : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5]"
            }
          `}
        >
          <BsX size={18} />
        </button>
      </div>

      {/* الروابط الرئيسية */}
      <nav className="flex flex-col gap-1 px-4 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const iconColor = isActive
            ? isDark ? "white" : "#1A1A1A"
            : isDark ? "#9A9A9A" : "#666666";

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                transition-all
                text-sm
                ${isActive
                  ? "bg-[#94D3C142]"
                  : "bg-transparent hover:bg-[#94D3C142]"
                }
              `}
            >
              {item.isReactIcon ? (
                <Icon size={20} color={iconColor} />
              ) : (
                <Icon
                  set="light"
                  size={20}
                  primaryColor={iconColor}
                />
              )}

              <span
                className={
                  isDark
                    ? "text-white"
                    : "text-black"
                }
              >
                {sidebar(item.label)}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* الموارد */}
      <div className="px-4 mt-6">
        <p
          className={`text-xs px-3 mb-2 ${t.subText}`}
        >
          {sidebar("resources")}
        </p>

        <nav className="flex flex-col gap-1">
          {resourceItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex
                  items-center
                  justify-between
                  w-full
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  transition-all
                  text-sm
                  ${isActive
                    ? "bg-[#94D3C142]"
                    : "bg-transparent hover:bg-[#94D3C142]"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    set="light"
                    size={20}
                    primaryColor={
                      isActive
                        ? isDark
                          ? "white"
                          : "#1A1A1A"
                        : isDark
                          ? "#9A9A9A"
                          : "#666666"
                    }
                  />

                  <span
                    className={
                      isDark
                        ? "text-white"
                        : "text-black"
                    }
                  >
                    {sidebar(item.label)}
                  </span>
                </div>

                {item.badge ? (
                  <span className="bg-[#94D3C1] text-white text-xs rounded px-1.5 py-0.5">
                    {sidebar(item.badge)}
                  </span>
                ) : (
                  <span />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* زر الثلاث شرطات - يظهر تحت 1280px */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className={`
          min-[1280px]:hidden
          fixed
          top-4
          ${locale === "ar" ? "right-4" : "left-4"}
          z-[999999999999]
          w-7
          h-7
          rounded-lg
          flex
          items-center
          justify-center
          border
          cursor-pointer
          transition-colors
          ${isDark
            ? "bg-[#1A1A1A] border-[#2D2D2D] text-white hover:bg-white/10"
            : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5]"
          }
        `}
      >
        <BsList size={18} />
      </button>

      {/* الخلفية عند فتح القائمة */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            min-[1280px]:hidden
            fixed
            inset-0
            z-[70]
            bg-black/50
          "
        />
      )}

      {/* Sidebar */}
      <aside
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`
          fixed
          ${locale === "ar" ? "right-0 border-l" : "left-0 border-r"}
          top-0
          h-screen
          w-[260px]
          flex
          flex-col
          z-[9999999999]

          ${t.bg}

          transition-transform
          duration-300
          ease-in-out

          min-[1280px]:translate-x-0

          ${sidebarOpen
            ? "translate-x-0"
            : locale === "ar"
              ? "translate-x-full"
              : "-translate-x-full"
          }
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

import { useTheme } from "@/context/ThemeContext";
import { BsList, BsX } from "react-icons/bs";

const navItems = [
  { label: "الرئيسية", href: "/dashboard", icon: Home },
  { label: "ابحث", href: "/search", icon: Search },
  { label: "اكتشف", href: "/discover", icon: Discovery },
  { label: "ابدأ مشروعاً", href: "/new", icon: Plus },
];

const resourceItems = [
  { label: "المنتسبون", href: "/members", icon: Bag },
  { label: "الشركاء", href: "/partners", icon: People, badge: "جديد" },
  { label: "يساعد", href: "/help", icon: Message },
  { label: "مدونة", href: "/blog", icon: Document },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isDark } = useTheme();

  const t = {
    bg: isDark ? "bg-[#0D0D0D] border-[#2D2D2D]" : "bg-white border-[#E5E5E5]",

    text: isDark ? "text-white" : "text-[#1A1A1A]",

    subText: isDark ? "text-[#9A9A9A]" : "text-[#666666]",

    activeLink: isDark ? "bg-white/10 text-white" : "bg-[#F0F0F0] text-black",

    hoverLink: isDark
      ? "hover:text-white hover:bg-white/5"
      : "hover:text-black hover:bg-[#F5F5F5]",

    logoText: isDark ? "text-white" : "text-black",
  };

  // محتوى الـ Sidebar
  const sidebarContent = (
    <>
      {/* اللوجو */}
      <div className="flex items-center px-6 py-5">
        <Image
          src={isDark ? "/images/image-PPV.png" : "/images/image-PPV-light.png"}
          alt="logo"
          width={55}
          height={60}
          className="rounded-lg"
        />

        <span
          className={`font-bold text-lg mr-2 ${t.logoText}`}
          style={{ fontWeight: 700, fontFamily: "var(--font-tajawal)" }}
        >
          Pay Per View
        </span>
      </div>

      {/* زر الإغلاق - يظهر فقط بالموبايل */}
      <button
        type="button"
        onClick={() => setSidebarOpen(false)}
        className={`
          lg:hidden
          absolute
          top-4
          left-4
          w-9
          h-9
          rounded-lg
          flex
          items-center
          justify-center
          border
          cursor-pointer
          transition-colors
          ${
            isDark
              ? "bg-[#1A1A1A] border-[#2D2D2D] text-white hover:bg-white/10"
              : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5]"
          }
        `}
      >
        <BsX size={24} />
      </button>

      {/* الروابط الرئيسية */}
      <nav className="flex flex-col gap-1 px-4 mt-2">
        {navItems.map((item) => {
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
                gap-3
                px-3
                py-2.5
                rounded-lg
                transition-all
                text-sm
                ${
                  isActive
                    ? "bg-[#94D3C142]"
                    : "bg-transparent hover:bg-[#94D3C142]"
                }
              `}
            >
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

              <span className={isDark ? "text-white" : "text-black"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* موارد */}
      <div className="px-4 mt-6">
        <p className={`text-xs px-3 mb-2 ${t.subText}`}>موارد</p>

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
                  ${
                    isActive
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

                  <span className={isDark ? "text-white" : "text-black"}>
                    {item.label}
                  </span>
                </div>

                {item.badge ? (
                  <span className="bg-[#94D3C1] text-white text-xs rounded px-1.5 py-0.5">
                    {item.badge}
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
      {/* زر الثلاث شرطات */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className={`
          lg:hidden
          fixed
          top-4
          right-4
          z-[999999999999]
          w-10
          h-10
          rounded-lg
          flex
          items-center
          justify-center
          border
          cursor-pointer
          transition-colors
          ${
            isDark
              ? "bg-[#1A1A1A] border-[#2D2D2D] text-white hover:bg-white/10"
              : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5]"
          }
        `}
      >
        <BsList size={24} />
      </button>

      {/* ========================= */}
      {/* الخلفية عند فتح القائمة */}
      {/* ========================= */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            lg:hidden
            fixed
            inset-0
            z-[70]
            bg-black/50
          "
        />
      )}

      {/* Sidebar */}

      <aside
        dir="rtl"
        className={`
          fixed
          right-0
          top-0
          h-screen
          w-[260px]
          border-l
          flex
          flex-col
          z-[9999999999]

          ${t.bg}

          transition-transform
          duration-300
          ease-in-out

          lg:translate-x-0

          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

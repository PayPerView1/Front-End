"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import {
  Chat,
  Notification,
  Document,
  People,
  Wallet,
  InfoSquare,
  Logout,
} from "react-iconly";

import { BsStars } from "react-icons/bs";
import { IoChevronDownOutline } from "react-icons/io5";
import { RiSettings3Line, RiSunLine, RiMoonLine } from "react-icons/ri";
import { MdOutlineMonitor } from "react-icons/md";

import { useTheme } from "@/context/ThemeContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function Navbar() {
  const router = useRouter();

  const { isDark, toggleTheme, setSystemTheme, isSystem } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const menuDropdownRef = useRef(null);

  // ألوان النافبار حسب الثيم
  const t = {
    navBg: isDark ? "bg-black" : "bg-white",
    navBorder: isDark ? "border-[#2D2D2D]" : "border-[#E5E5E5]",

    text: isDark ? "text-white" : "text-[#1A1A1A]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#666666]",

    menuBg: isDark ? "bg-[#181818]" : "bg-white",
    menuBorder: isDark ? "border-[#2D2D2D]" : "border-[#E5E5E5]",

    menuText: isDark ? "text-[#E1E3E3]" : "text-[#333333]",

    menuFooter: isDark ? "bg-[#111111]" : "bg-[#F7F7F7]",
  };

  // إغلاق قائمة الحساب عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
     <div
  className={`
    w-full
    flex
    items-center
    justify-end
    px-2
    sm:px-6
    py-3
    sticky
    top-0
    z-[9999999]
    border-b
    ${t.navBg}
    ${t.navBorder}
  `}
>
      <div className="flex items-center gap-5 px-3 py-1.5">
        {/* الرصيد */}
        <div
          className={`
            rounded-full
            px-4
            py-1
            text-sm
            font-boldس
            border
            ${
              isDark
                ? "bg-[#2a2a2a] border-[#3a3a3a] text-white"
                : "bg-[#EAEAEA] border-[#EAEAEA] text-[#787878]"
            }
          `}
        >
          $0.00
        </div>

        {/* AI */}
        <BsStars size={19} color="#9A9A9A" className="cursor-pointer mx-1" />

        {/* الرسائل */}
        <Chat
          set="light"
          size={19}
          primaryColor="#9A9A9A"
          className="cursor-pointer"
        />

        {/* الجرس */}
        <div className="relative cursor-pointer mx-1">
          <Notification set="light" size={19} primaryColor="#9A9A9A" />

          <span
            className="
              absolute
              -top-1
              -right-1
              w-3.5
              h-3.5
              bg-red-500
              rounded-full
              text-[8px]
              text-white
              flex
              items-center
              justify-center
            "
          >
            3
          </span>
        </div>

        {/* قائمة المستخدم */}
        <div
          ref={menuRef}
          className={`
            relative
            flex
            flex-row
            items-center
            gap-2.5
            rounded-full
            px-2
            py-1
            border
            ${
              isDark
                ? "bg-[#2a2a2a] border-[#3a3a3a]"
                : "bg-[#F5F5F5] border-[#E5E5E5]"
            }
          `}
        >
          {/* صورة المستخدم */}
          <div
            onClick={() => setMenuOpen((p) => !p)}
            className={`
              w-7
              h-7
              rounded-full
              flex
              items-center
              justify-center
              text-xs
              font-bold
              cursor-pointer
              ${isDark ? "bg-[#3a3a3a] text-white" : "bg-[#FE6B02] text-white"}
            `}
          >
            ش
          </div>

          {/* السهم */}
          <IoChevronDownOutline
            size={15}
            color={isDark ? "#BFC8C9" : "#666"}
            className="cursor-pointer"
            onClick={() => setMenuOpen((p) => !p)}
          />

          {/* القائمة */}
          {menuOpen &&
            createPortal(
              <div
                ref={menuDropdownRef}
                data-menu="true"
                className={`
                  fixed
                  top-[55px]
                  left-4
                  z-[9999999]
                  w-64
                  rounded-xl
                  shadow-2xl
                  border
                  ${t.menuBg}
                  ${t.menuBorder}
                `}
              >
                {/* معلومات المستخدم */}
                <div
                  className={`
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    border-b
                    ${t.navBorder}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-9
                        h-9
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-sm
                        font-bold
                        ${
                          isDark
                            ? "bg-white/20 text-white"
                            : "bg-[#E0E0E0] text-black"
                        }
                      `}
                    >
                      ش
                    </div>

                    <div className="text-right">
                      <p
                        className={`
                          text-sm
                          font-bold
                          ${t.text}
                        `}
                      >
                        شذا البنا
                      </p>

                      <p
                        className={`
                          text-xs
                          ${t.subText}
                        `}
                      >
                        عرض الملف الشخصي
                      </p>
                    </div>
                  </div>

                  <RiSettings3Line
                    size={18}
                    color="#9A9A9A"
                    className="cursor-pointer"
  //                   onClick={() => {
  //   router.push("/ar/edit-profile?settings=true");
  //   setMenuOpen(false);
  // }}
                  />
                </div>

                {/* الطلبات - الشركاء - المالية */}
                <div className="py-2 px-1">
                  {[
                    {
                      label: "الطلبات",
                      icon: Document,
                      href: "/orders",
                    },
                    {
                      label: "الشركاء",
                      icon: People,
                      href: "/partners",
                    },
                    {
                      label: "المالية",
                      icon: Wallet,
                      href: "/finance",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          router.push(item.href);
                          setMenuOpen(false);
                        }}
                        className="
                          group
                          w-full
                          flex
                          items-center
                          px-3
                          py-2.5
                          rounded-[16px]
                          bg-transparent
                          border-none
                          hover:bg-[#94D3C142]
                          transition-all
                          duration-150
                          cursor-pointer
                        "
                      >
                        <Icon
                          set="light"
                          size={18}
                          primaryColor={isDark ? "#BFC8C9" : "#555"}
                        />

                        <span
                          className={`
                            text-sm
                            mr-4
                            ${t.menuText}
                          `}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* الفاصل */}
                <div
                  className={`
                    border-t
                    py-2
                    px-1
                    ${t.navBorder}
                  `}
                >
                  {/* المساعدة والدعم */}
                  <button
                    type="button"
                    className="
                      group
                      w-full
                      flex
                      items-center
                      px-3
                      py-2.5
                      rounded-[16px]
                      bg-transparent
                      border-none
                      hover:bg-[#94D3C142]
                      transition-all
                      duration-150
                      cursor-pointer
                    "
                  >
                    <InfoSquare
                      set="light"
                      size={18}
                      primaryColor={isDark ? "#9A9A9A" : "#555"}
                    />

                    <span
                      className={`
                        text-sm
                        mr-4
                        ${t.menuText}
                      `}
                    >
                      المساعدة والدعم
                    </span>
                  </button>

                  {/* اللغة */}
                  <LanguageSelector />

                  {/* تسجيل الخروج */}
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="
                      group
                      w-full
                      flex
                      items-center
                      px-3
                      py-2.5
                      rounded-[16px]
                      bg-transparent
                      border-none
                      hover:bg-[#94D3C142]
                      transition-all
                      duration-150
                      cursor-pointer
                    "
                  >
                    <Logout set="light" size={18} primaryColor="#EF4444" />

                    <span className="text-red-400 text-sm mr-4">
                      تسجيل الخروج
                    </span>
                  </button>
                </div>

                {/* الأيقونات السفلية */}
                <div
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    relative
                    z-10
                    flex
                    items-center
                    justify-around
                    px-4
                    py-3
                    border-t
                    rounded-b-xl
                    ${t.menuFooter}
                    ${t.navBorder}
                  `}
                >
                  {/* System */}
                  <button
                    type="button"
                    style={{
                      position: "relative",
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSystemTheme();
                    }}
                    className={`
                      p-2
                      rounded-lg
                      cursor-pointer
                      bg-transparent
                      border-none
                      transition-all
                      ${
                        isSystem
                          ? "bg-white/10 ring-1 ring-[#9A9A9A]"
                          : "hover:bg-white/10"
                      }
                    `}
                  >
                    <MdOutlineMonitor
                      size={18}
                      color={isSystem ? "#94D3C1" : "#9A9A9A"}
                    />
                  </button>

                  {/* Light */}
                  <button
                    type="button"
                    style={{
                      position: "relative",
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (isDark) {
                        toggleTheme();
                      }
                    }}
                    className={`
                      p-2
                      rounded-lg
                      cursor-pointer
                      bg-transparent
                      border-none
                      transition-all
                      ${
                        !isDark
                          ? "bg-[#FFF3E0] ring-1 ring-[#F97316]"
                          : "hover:bg-white/10"
                      }
                    `}
                  >
                    <RiSunLine
                      size={18}
                      color={!isDark ? "#F97316" : "#9A9A9A"}
                    />
                  </button>

                  {/* Dark */}
                  <button
                    type="button"
                    style={{
                      position: "relative",
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (!isDark) {
                        toggleTheme();
                      }
                    }}
                    className={`
                      p-2
                      rounded-lg
                      cursor-pointer
                      bg-transparent
                      border-none
                      transition-all
                      ${
                        isDark
                          ? "bg-[#94D3C1]/10 ring-1 ring-[#94D3C1]"
                          : "hover:bg-white/10"
                      }
                    `}
                  >
                    <RiMoonLine
                      size={18}
                      color={isDark ? "#94D3C1" : "#9A9A9A"}
                    />
                  </button>
                </div>
              </div>,
              document.body,
            )}
        </div>
      </div>
    </div>
  );
}

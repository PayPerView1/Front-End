"use client";
import { useState, useRef, useEffect } from "react";
import { RiGlobalLine } from "react-icons/ri";
import { IoChevronDownOutline } from "react-icons/io5";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { createPortal } from "react-dom";
const languages = [
  { code: "ar", label: "العربية", flag: "sa" },
  { code: "en", label: "English", flag: "us" },
  { code: "de", label: "Deutsch", flag: "de" },
  { code: "es", label: "Español", flag: "es" },
  { code: "fr", label: "Français", flag: "fr" },
  { code: "pt", label: "Português", flag: "pt" },
  { code: "zh", label: "中文", flag: "cn" },
  { code: "it", label: "Italiano", flag: "it" },
  { code: "nl", label: "Nederlands", flag: "nl" },
  { code: "pl", label: "Polski", flag: "pl" },
  { code: "ja", label: "日本語", flag: "jp" },
  { code: "tr", label: "Türkçe", flag: "tr" },
];

export default function LanguageSelector() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("nav");
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const updatePos = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const menuWidth = 200;
    const screenPadding = 8;
    const preferredLeft =
      locale === "ar" ? rect.right + 8 : rect.left - menuWidth - 8;
    setPos({
      top: rect.top,
      left: Math.max(
        screenPadding,
        Math.min(preferredLeft, window.innerWidth - menuWidth - screenPadding),
      ),
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePos();

    const handleResizeOrScroll = () => {
      updatePos();
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [open, locale]);

  return (
    <div style={{ display: "contents" }}>
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          updatePos();
          setOpen((prev) => !prev);
        }}
        className="w-full flex items-center px-4 py-2.5 bg-transparent border-none rounded-md hover:bg-[#94D3C142] transition-colors duration-150 cursor-pointer"
      >
        <RiGlobalLine
          size={18}
          color={open ? "#94D3C1" : isDark ? "#9A9A9A" : "#555"}
        />
        <span
          style={{ color: isDark ? "#E1E3E3" : "#333" }}
          className="text-[#E1E3E3] text-sm mr-4"
        >
          {t("language")}
        </span>
        <IoChevronDownOutline
          size={16}
          color="#9A9A9A"
          className={`mr-auto transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            dir={locale === "ar" ? "rtl" : "ltr"}
            style={{ top: pos.top, left: pos.left }}
            className={`lang-scroll fixed w-[200px] rounded-xl border shadow-2xl z-[99999] max-h-[320px] overflow-y-auto
    ${isDark ? "bg-[#1a1a1a] border-[#3A3A3A]" : "bg-white border-[#E5E5E5]"}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  // استبدال السجل الحالي بدلاً من إضافة سجل جديد
                  // حتى لا يرجع المتصفح للغة القديمة عند الضغط على رجوع
                  const newPath = `/${lang.code}${pathname || "/"}`;
                  window.location.replace(newPath);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#94D3C142] transition-colors cursor-pointer bg-transparent border-none
          ${isDark ? "text-white" : "text-[#333]"}`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/w20/${lang.flag}.png`}
                    width={20}
                    height={15}
                    alt={lang.label}
                    className="rounded-sm animate-none"
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  />
                  <span>{lang.label}</span>
                </div>
                {locale === lang.code && (
                  <span className="text-[#94D3C1]">✓</span>
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

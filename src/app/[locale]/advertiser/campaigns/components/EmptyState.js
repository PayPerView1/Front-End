"use client";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { MdOutlineBarChart } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

export default function EmptyState() {
  const { isDark } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const tc = useTranslations("campaigns");

  return (
    <div className="flex items-center justify-center flex-1 min-h-screen">
      <div
        className="flex flex-col items-center gap-5 p-10 rounded-2xl text-center max-w-sm w-full"
        style={{
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* الأيقونة الرئيسية */}
        <div className="relative mt-2">
          <div
            className="w-28 h-28 rounded-2xl flex items-center justify-center"
            style={{
              background: "transparent",
              border: "2px solid #FF6B00",
              transform: "rotate(8deg)",
            }}
          >
            <HiOutlineSpeakerphone size={48} color="#FF6B00" />
          </div>

          {/* الكارت الصغير */}
          <div
            className="absolute -bottom-3 -left-3 w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: isDark ? "#1a1a1a" : "white",
              border: "1.5px solid #94D3C1",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transform: "rotate(6deg)",
            }}
          >
            <MdOutlineBarChart size={20} color="#94D3C1" />
          </div>
        </div>

        {/* النص */}
        <div className="flex flex-col gap-2 mt-4">
          <h3
            className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {tc("emptyTitle")}
          </h3>
          <p
            className={`text-sm leading-relaxed ${isDark ? "text-[#9A9A9A]" : "text-gray-500"}`}
          >
            {tc("emptyDesc")}
          </p>
        </div>

        {/* الزر */}
        <button
          type="button"
          onClick={() => router.push(`/${locale}/advertiser/create-campaign`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:opacity-90"
          style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
        >
          <IoAddCircleOutline size={18} />
          {tc("createNew")}
        </button>
      </div>
    </div>
  );
}

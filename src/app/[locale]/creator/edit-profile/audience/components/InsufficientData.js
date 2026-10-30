"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  FiRotateCw,
  FiFileText,
  FiShield,
  FiBell,
  FiBarChart2,
} from "react-icons/fi";
import { LuRocket } from "react-icons/lu";
import { MdOutlineTimer, MdOutlineLightbulb } from "react-icons/md";

export default function InsufficientData({
  current = 0,
  required = 500,
  onRefresh,
  onViewReport,
  onTips,
}) {
  const { isDark } = useTheme();
  const router = useRouter();
  const translate = useTranslations("Audience");
  const [refreshing, setRefreshing] = useState(false);

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    mutedText: isDark ? "text-[#8A8A8A]" : "text-[#707070]",
    card: isDark ? "bg-[#181818] border-[#2D2D2D]" : "bg-white border-[#D6D6D6]",
    progressCard: isDark
      ? "bg-white/5 border-transparent"
      : "bg-[#F7F8F8] border-[#E3E3E3]",
    chip: isDark ? "bg-white/5 text-[#B0B0B0]" : "bg-black/5 text-[#555555]",
    iconBox: isDark ? "bg-white/5" : "bg-black/5",
    track: isDark ? "bg-[#333636]" : "bg-[#E5E5E5]",
    ring: isDark ? "#3A3A3A" : "#CFCFCF",
    accent: isDark ? "#94D3C1" : "#0B625A",
    positive: isDark ? "text-[#94D3C1]" : "text-[#0B625A]",
    yellow: isDark ? "text-[#FACC15]" : "text-[#CA8A04]",
    glow: isDark ? "rgba(148,211,193,0.14)" : "rgba(15,118,110,0.10)",
    mintBtn: isDark
      ? "bg-[#94D3C1] text-[#33403C]"
      : "bg-[#0F766E]/10 text-[#0B625A]",
    gradient: "bg-gradient-to-r from-[#FDA201] to-[#F86603]",
    gradientBtn: "bg-gradient-to-l from-[#F86603] to-[#FDA201]",
  };

  const progress = Math.min(100, Math.round((current / required) * 100));
  const remaining = Math.max(0, required - current);

  const info = [
    { key: "speed", icon: LuRocket, color: "#E9C349" },
    { key: "track", icon: FiShield, color: t.accent },
    { key: "notify", icon: FiBell, color: "#E9C349" },
  ];

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await Promise.all([
        Promise.resolve(onRefresh?.()),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const bold = (chunks) => <b className={`font-bold ${t.positive}`}>{chunks}</b>;

  return (
    <div className="flex flex-col gap-5">
      <section
        className={`flex flex-col items-center gap-6 rounded-2xl border px-5 py-10 text-center ${t.card}`}
      >
        {/* الرادار */}
        <div className="flex flex-col items-center gap-3">
          <span className={`flex items-center gap-2 rounded-full px-3 py-1 text-[10px] ${t.chip}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
            {translate("radarLabel")}
          </span>

          <div className="relative h-44 w-44">
            <div
              className="absolute -inset-4 rounded-full"
              style={{ background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)` }}
            />

            <svg viewBox="0 0 200 200" className="relative h-full w-full" fill="none">
              {[95, 70, 45, 20].map((r) => (
                <circle key={r} cx="100" cy="100" r={r} stroke={t.ring} strokeWidth="1" />
              ))}
              <line x1="100" y1="5" x2="100" y2="195" stroke={t.ring} strokeWidth="1" />
              <line x1="5" y1="100" x2="195" y2="100" stroke={t.ring} strokeWidth="1" />
              <circle cx="100" cy="100" r="5" fill="#FFA800" />
              <circle cx="148" cy="62" r="3.5" fill="#FFB020" />
              <circle cx="62" cy="128" r="3" fill={t.accent} />
            </svg>

            <div className="absolute inset-0 animate-[spin_8s_linear_infinite] motion-reduce:animate-none">
              <div
                className="absolute inset-[5px] rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(255,168,0,0.35) 0deg, transparent 50deg, transparent 360deg)",
                }}
              />
              <div className="absolute left-1/2 top-[5px] h-[calc(50%-5px)] w-px bg-gradient-to-t from-[#FFA800] to-transparent" />
            </div>
          </div>
        </div>

        <div className="flex max-w-xl flex-col gap-2">
          <h2 className={`m-0 text-2xl font-bold sm:text-3xl ${t.text}`}>
            {translate("insufficientTitle")}
          </h2>
          <p className={`m-0 text-sm leading-7 ${t.subText}`}>
            {translate("insufficientBody", { required })}
          </p>
        </div>

        {/* التقدم */}
        <div className={`flex w-full max-w-2xl flex-col gap-3 rounded-2xl border p-5 ${t.progressCard}`}>
          <div className="flex items-center justify-between gap-3">
            <span className={`flex items-center gap-2 text-sm font-bold ${t.text}`}>
              <FiBarChart2 size={16} color={t.accent} />
              {translate("processingProgress")}
            </span>
            <span className="text-xs font-bold" style={{ color: t.yellow }}>
              {progress}%
            </span>
          </div>

          <div className={`h-3 w-full overflow-hidden rounded-full ${t.track}`}>
            <div
              className={`h-full rounded-full ${t.gradient}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-xs">
            <span className={t.mutedText}>
              {translate.rich("progressOf", { b: bold, current, required })}
            </span>
            <span className={`flex items-center gap-1.5 ${t.positive}`}>
              <MdOutlineTimer size={15} />
              {translate("remaining", { count: remaining })}
            </span>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex h-11 cursor-pointer items-center gap-2 rounded-xl border-none px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 ${t.gradientBtn}`}
          >
            <FiRotateCw size={16} className={refreshing ? "animate-spin" : ""} />
            {translate("refreshNow")}
          </button>

          <button
            type="button"
            onClick={onViewReport}
            className={`flex h-11 cursor-pointer items-center gap-2 rounded-xl border-none px-6 text-sm font-medium ${t.mintBtn}`}
          >
            <FiFileText size={16} />
            {translate("viewPrevReport")}
          </button>

          <button
            type="button"
            onClick={onTips}
            className="flex h-11 cursor-pointer items-center gap-2 border-none bg-transparent px-3 text-sm font-medium"
            style={{ color: t.accent }}
          >
            <MdOutlineLightbulb size={18} color={t.accent} />
            {translate("boostTips")}
          </button>
        </div>
      </section>

      {/* بطاقات المعلومات */}
      <div className="grid grid-cols-1 gap-3 @3xl:grid-cols-3" dir="rtl">
        {info.map((i) => {
          const Icon = i.icon;
          return (
            <div
              key={i.key}
              className={`flex flex-col items-start gap-3 rounded-2xl border p-4 ${t.card}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.iconBox}`}
              >
                <Icon size={16} color={i.color} />
              </div>
              <div className="flex flex-col gap-1.5 text-right">
                <h3 className={`m-0 text-base font-bold ${t.text}`}>
                  {translate(`info.${i.key}.title`)}
                </h3>
                <p className={`m-0 text-xs leading-5 ${t.subText}`}>
                  {translate(`info.${i.key}.body`, { required })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

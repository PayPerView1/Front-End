// ============================================================
// ملف: app/[locale]/advertiser/analytics/components/EmptyState.js
// ============================================================

"use client";

import React from "react";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineOpenInNew,
  MdOutlineInfo,
  MdOutlineShield,
  MdOutlineVerified,
  MdOutlineInsertDriveFile,
  MdOutlineAssignmentReturn,
  MdOutlineHeadsetMic,
  MdOutlineChat,
} from "react-icons/md";

export default function EmptyState({ t, dark, onCharge }) {
  // 1. بطاقات الميزات مع الأيقونات والنصوص والألوان المطابقة
  const features = [
    {
      icon: MdOutlineShield,
      title: t("transparencyTitle"),
      desc: t("transparencyDesc"),
      foot: t("transparencyFoot"),
      footColor: dark ? "text-[#94D3C1]" : "text-[#0D9488]",
      accentColor: dark ? "#94D3C1" : "#0D9488",
    },
    {
      icon: MdOutlineInsertDriveFile,
      title: t("taxTitle"),
      desc: t("taxDesc"),
      foot: t("taxFoot"),
      footColor: dark ? "text-[#EAB308]" : "text-[#CA8A04]",
      accentColor: dark ? "#EAB308" : "#CA8A04",
    },
    {
      icon: MdOutlineAssignmentReturn,
      title: t("refundTitle"),
      desc: t("refundDesc"),
      foot: t("refundFoot"),
      footColor: dark ? "text-[#94D3C1]" : "text-[#0D9488]",
      accentColor: dark ? "#94D3C1" : "#0D9488",
    },
  ];

  // 2. شارات الثقة بالأسفل
  const trustBadges = [
    { label: t("trust100"), icon: MdOutlineAccountBalanceWallet },
    { label: t("trustSharia"), icon: MdOutlineVerified },
    { label: t("trustPCI"), icon: MdOutlineShield },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* الحاوية الرئيسية للحالة الفارغة */}
      <div
        className={`rounded-2xl border p-4 sm:p-8 flex flex-col items-center gap-5 sm:gap-6 shadow-sm ${
          dark ? "bg-[#111111] border-[#222222]" : "bg-white border-[#E2E8F0]"
        }`}
      >
        {/* أيقونة المحفظة الرئيسية */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border ${
            dark 
              ? "bg-[rgba(148,211,193,0.08)] border-[#94D3C1]/20" 
              : "bg-[#F0FDFA] border-[#CCFBF1]"
          }`}
        >
          <MdOutlineAccountBalanceWallet size={28} className="sm:w-8 sm:h-8" color={dark ? "#94D3C1" : "#0D9488"} />
        </div>

        {/* النصوص الرئيسية */}
        <div className="text-center max-w-xl px-2">
          <p className={`text-xs font-semibold mb-2 ${dark ? "text-[#EAB308]" : "text-[#CA8A04]"}`}>
            {t("emptyTag")}
          </p>
          <h2 className={`text-xl sm:text-2xl font-bold mb-3 ${dark ? "text-white" : "text-[#0F172A]"}`}>
            {t("emptyTitle")}
          </h2>
          <p className={`text-xs leading-relaxed ${dark ? "text-[#9A9A9A]" : "text-[#475569]"}`}>
            {t("emptyDesc")}
          </p>
        </div>

        {/* الأزرار الرئيسية الثلاثة */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 justify-center w-full sm:w-auto">
          {/* الزر الأول (شحن الرصيد) */}
          <button
            onClick={onCharge}
            className={`group relative isolate flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-300 overflow-hidden shadow-sm w-full sm:w-auto ${
              dark 
                ? "border-[#2A2A2A] text-white" 
                : "border-[#CBD5E1] text-[#0F172A] bg-white hover:bg-slate-50"
            } hover:text-white hover:border-transparent`}
          >
            <span 
              className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg, #FE9C00 0%, #FE5903 100%)" }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <MdOutlineAccountBalanceWallet size={16} />
              {t("chargeNow")}
            </span>
          </button>

          {/* الزر الثاني */}
          <button
            className={`group relative isolate flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-300 overflow-hidden shadow-sm w-full sm:w-auto ${
              dark 
                ? "border-[#2A2A2A] text-white" 
                : "border-[#CBD5E1] text-[#0F172A] bg-white hover:bg-slate-50"
            } hover:text-white hover:border-transparent`}
          >
            <span 
              className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg, #FE9C00 0%, #FE5903 100%)" }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <MdOutlineOpenInNew size={16} />
              {t("exploreMethods")}
            </span>
          </button>

          {/* الزر الثالث */}
          <button
            className={`group relative isolate flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-300 overflow-hidden shadow-sm w-full sm:w-auto ${
              dark 
                ? "border-[#2A2A2A] text-white" 
                : "border-[#CBD5E1] text-[#0F172A] bg-white hover:bg-slate-50"
            } hover:text-white hover:border-transparent`}
          >
            <span 
              className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg, #FE9C00 0%, #FE5903 100%)" }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <MdOutlineInfo size={16} />
              {t("manageGuide")}
            </span>
          </button>
        </div>

        {/* خط فاصل خفيف قبل شارات الثقة */}
        <div className={`w-full border-t my-1 ${dark ? "border-[#222222]" : "border-slate-100"}`} />

        {/* شارات الثقة والضمان موزعة */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between items-center w-full px-2 sm:px-4 gap-3 sm:gap-0">
          {trustBadges.map(({ label, icon: Icon }, index) => (
            <div key={label} className={`flex items-center gap-2 ${
              index === 0 ? "justify-center sm:justify-start" : index === 1 ? "justify-center" : "justify-center sm:justify-end"
            }`}>
              <Icon size={16} color={dark ? "#94D3C1" : "#0D9488"} className="shrink-0" />
              <span className={`text-[0.65rem] font-medium whitespace-nowrap ${dark ? "text-[#9A9A9A]" : "text-[#475569]"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* بطاقات الميزات الثلاثية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className={`rounded-xl p-4 sm:p-5 border flex flex-col justify-between gap-4 shadow-sm ${
                dark ? "bg-[#111111] border-[#222222]" : "bg-white border-[#E2E8F0]"
              }`}
            >
              <div className="flex flex-col gap-2">
                {/* الأيقونة بجانب العنوان مباشرة مع خلفية متكيفة */}
                <div className="flex items-center gap-2.5 mb-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
                    dark ? "bg-[#1A1A1A] border-[#222222]" : "bg-slate-100 border-slate-200"
                  }`}>
                    <Icon size={18} color={f.accentColor} />
                  </div>
                  <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-[#0F172A]"}`}>
                    {f.title}
                  </h3>
                </div>

                <p className={`text-xs leading-relaxed ${dark ? "text-[#888888]" : "text-[#475569]"}`}>
                  {f.desc}
                </p>
              </div>

              {/* النص السفلي الملون */}
              <div className={`text-[0.65rem] pt-3 border-t font-semibold ${f.footColor} ${dark ? "border-[#1F1F1F]" : "border-slate-100"}`}>
                {f.foot}
              </div>
            </div>
          );
        })}
      </div>

      {/* بنر الدعم والاستشارات المالي (السفلي) */}
      <div
        className={`rounded-xl p-4 border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
          dark ? "bg-[#111111] border-[#222222]" : "bg-white border-[#E2E8F0]"
        }`}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
            dark ? "bg-[#1A1A1A] border-[#252525]" : "bg-slate-100 border-slate-200"
          }`}>
            <MdOutlineHeadsetMic size={20} color={dark ? "#9A9A9A" : "#64748B"} />
          </div>
          <div className="text-start">
            <h4 className={`text-xs font-bold mb-0.5 ${dark ? "text-white" : "text-[#0F172A]"}`}>
              {t("supportTitle")}
            </h4>
            <p className={`text-[0.65rem] ${dark ? "text-[#888888]" : "text-[#64748B]"}`}>
              {t("supportDesc")}
            </p>
          </div>
        </div>

        <button
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border cursor-pointer shrink-0 transition-colors w-full sm:w-auto ${
            dark
              ? "bg-[#181818] border-[#2A2A2A] text-white hover:bg-[#222222]"
              : "bg-slate-50 border-slate-300 text-[#0F172A] hover:bg-slate-100"
          }`}
        >
          <MdOutlineChat size={16} />
          {t("supportBtn")}
        </button>
      </div>
    </div>
  );
}
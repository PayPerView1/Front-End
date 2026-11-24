"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "@/i18n/navigation";
import { FiCalendar, FiFileText } from "react-icons/fi";
import { createCampaign } from "@/services/campaignApi";
import { saveDraft, autoSaveDraft, getDraftById, submitDraft } from "@/services/drafts";
import { toast } from "@/components/ui/Toast";

import {
  MdVolumeUp,
  MdImage,
  MdCloudUpload,
  MdDelete,
  MdPlayCircle,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdWarning,
  MdAccountBalanceWallet,
  MdInfoOutline,
  MdFolder,
  MdGpsFixed,
  MdPublic,
  MdPeopleOutline,
  MdErrorOutline,
  MdOutlineTimer,
  MdOutlineAspectRatio,
  MdOutlineTag,
  MdOutlineKey,
  MdOutlineAlternateEmail,
  MdOutlineGavel,
  MdLocalOffer,
  MdOutlineLightbulb,
} from "react-icons/md";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const ALL_PLATFORMS = [
  { key: "tiktok",    icon: FaTiktok,     label: "TikTok",     color: "#FFFFFF",  darkOnly: true },
  { key: "instagram", icon: FaInstagram,  label: "Instagram",  color: "#E1306C" },
  { key: "youtube",   icon: FaYoutube,    label: "YouTube",    color: "#FF0000" },
  { key: "facebook",  icon: FaFacebookF,  label: "Facebook",   color: "#1877F2" },
  { key: "x",         icon: FaXTwitter,   label: "X (Twitter)", color: "#E7E9EA" },
];

const TARGET_COUNTRIES_LIST = [
  { code: "SAU", labelAr: "السعودية", labelEn: "Saudi Arabia", flag: "🇸🇦" },
  { code: "ARE", labelAr: "الإمارات", labelEn: "UAE", flag: "🇦🇪" },
  { code: "EGY", labelAr: "مصر", labelEn: "Egypt", flag: "🇪🇬" },
  { code: "KWT", labelAr: "الكويت", labelEn: "Kuwait", flag: "🇰🇼" },
  { code: "QAT", labelAr: "قطر", labelEn: "Qatar", flag: "🇶🇦" },
  { code: "BHR", labelAr: "البحرين", labelEn: "Bahrain", flag: "🇧🇭" },
  { code: "OMN", labelAr: "عُمان", labelEn: "Oman", flag: "🇴🇲" },
  { code: "JOR", labelAr: "الأردن", labelEn: "Jordan", flag: "🇯🇴" },
  { code: "IRQ", labelAr: "العراق", labelEn: "Iraq", flag: "🇮🇶" },
  { code: "MAR", labelAr: "المغرب", labelEn: "Morocco", flag: "🇲🇦" },
  { code: "DZA", labelAr: "الجزائر", labelEn: "Algeria", flag: "🇩🇿" },
  { code: "USA", labelAr: "الولايات المتحدة", labelEn: "United States", flag: "🇺🇸" },
  { code: "GBR", labelAr: "المملكة المتحدة", labelEn: "United Kingdom", flag: "🇬🇧" },
];

const ASPECT_RATIOS = ["9:16", "1:1", "4:5", "16:9"];

const CONTENT_TYPE_IDS = [
  "CLIPPING",
  "UGC",
  "SLIDESHOW",
  "AUDIO",
  "LOGO",
  "MIXED",
];

const CONTENT_TYPE_ICONS = {
  CLIPPING: MdPlayCircle,
  UGC: MdPeopleOutline,
  SLIDESHOW: MdImage,
  AUDIO: MdVolumeUp,
  LOGO: MdFolder,
  MIXED: MdPublic,
};

const COMPLIANCE_IDS = [
  "noGambling",
  "noSexualContent",
  "noExplicitMusic",
  "noAlcohol",
  "noSuspiciousCurrencies",
  "noUnrealisticProfit",
];

const STEP_IDS = [1, 2, 3, 4];

// ─── DateInput ────────────────────────────────────────────────
function DateInput({ value, onChange, hasError, isRtl, dark }) {
  const ref = useRef(null);
  const placeholder = isRtl ? "أدخل التاريخ" : "Enter date";

  return (
    <div className="relative w-full">
      <div
        className={`w-full rounded-lg border py-2.5 text-sm box-border transition-colors
          ${
            dark
              ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)]"
              : "bg-white border-[#E5E5E5]"
          }
          ${hasError ? "!border-[#E53535]" : ""}
          ${isRtl ? "pr-10 pl-3.5 text-right" : "pl-10 pr-3.5 text-left"}`}
        style={{
          direction: isRtl ? "rtl" : "ltr",
          fontFamily: "var(--font-tajawal,inherit)",
        }}
      >
        <span
          className={
            value ? (dark ? "text-white" : "text-[#111]") : "text-[#999]"
          }
        >
          {value || placeholder}
        </span>
      </div>

      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => ref.current?.showPicker?.()}
        aria-label={placeholder}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
      />

      <button
        type="button"
        onClick={() => ref.current?.showPicker?.()}
        className={`absolute top-1/2 z-20 -translate-y-1/2 pointer-events-none text-[#9A9A9A] ${
          isRtl ? "right-3" : "left-3"
        }`}
      >
        <FiCalendar size={16} />
      </button>
    </div>
  );
}

// ─── ImageField ───────────────────────────────────────────────
function ImageField({ label, image, setImage, dark, isRtl, hasError, maxMB = 5 }) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("يرجى اختيار ملف صورة فقط.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      toast.warning(`حجم الصورة يتجاوز ${maxMB} ميجابايت.`);
      return;
    }
    setImage(file);
  };

  const clearImage = () => {
    setImage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>
        {label}
      </label>

      <div
        className={`flex items-center gap-3 w-full rounded-lg border px-3.5 py-2.5 text-sm box-border transition-colors ${
          dark
            ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)]"
            : "bg-white border-[#E5E5E5]"
        } ${hasError ? "!border-[#E53535]" : ""}`}
        style={{
          direction: isRtl ? "rtl" : "ltr",
          fontFamily: "var(--font-tajawal,inherit)",
        }}
      >
        {/* اسم الصورة أو النص الافتراضي */}
        <span
          className={`flex-1 truncate ${
            image
              ? dark
                ? "text-white"
                : "text-[#111]"
              : "text-[#999]"
          }`}
        >
          {image ? image.name : "لم يتم اختيار صورة"}
        </span>

        {/* زر الحذف يظهر فقط إذا في صورة */}
        {image && (
          <button
            type="button"
            onClick={clearImage}
            className={`bg-transparent border-none cursor-pointer p-1 ${
              dark ? "text-[#9A9A9A]" : "text-[#666]"
            }`}
          >
            <MdDelete size={18} />
          </button>
        )}

        {/* زر اختيار الصورة */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`border rounded-lg px-4 py-1.5 text-sm cursor-pointer bg-transparent shrink-0 ${
            dark
              ? "border-[rgba(63,73,69,1)] text-white"
              : "border-[#E5E5E5] text-[#111]"
          }`}
        >
          {image ? "تغيير" : "اختيار صورة"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

// ─── Step1 ────────────────────────────────────────────────────
function Step1({
  t,
  dark,
  isRtl,
  form,
  setForm,
  attempted,
  coverImage,
  setCoverImage,
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* اسم الحملة */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>
          {t("step1.name")}
          <span className="text-[rgba(178,34,34,1)]"> *</span>
        </label>

        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm((p) => ({ ...p, name: e.target.value }))
          }
          placeholder={t("step1.namePlaceholder")}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border transition-colors
            focus:border-[rgba(148,211,193,1)]
            ${
              dark
                ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
                : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
            }
            ${
              attempted && !form.name.trim()
                ? "!border-[#E53535]"
                : ""
            }`}
          style={{
            direction: isRtl ? "rtl" : "ltr",
            fontFamily: "var(--font-tajawal,inherit)",
          }}
        />

        {attempted && !form.name.trim() && (
          <span className="text-[0.7rem] text-[#E53535]">
            {t("step1.required")}
          </span>
        )}
      </div>

      {/* صورة الحملة */}
      <ImageField
        label="صورة الحملة"
        image={coverImage}
        setImage={setCoverImage}
        dark={dark}
        isRtl={isRtl}
      />

      {/* الميزانية + CPM */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Budget */}
        <div className="flex flex-col gap-1.5">
          <label
            className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}
          >
            {t("step1.budget")}
            <span className="text-[rgba(178,34,34,1)]"> *</span>
          </label>

          <input
            type="number"
            value={form.totalBudget}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                totalBudget: e.target.value,
              }))
            }
            placeholder="10,000$"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border transition-colors
              focus:border-[rgba(148,211,193,1)]
              ${
                dark
                  ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
                  : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
              }
              ${
                attempted && !form.totalBudget
                  ? "!border-[#E53535]"
                  : ""
              }`}
            style={{
              direction: isRtl ? "rtl" : "ltr",
              fontFamily: "var(--font-tajawal,inherit)",
              colorScheme: dark ? "dark" : "light",
            }}
          />

          {attempted && !form.totalBudget && (
            <span className="text-[0.7rem] text-[#E53535]">
              {t("step1.required")}
            </span>
          )}
        </div>

        {/* CPM */}
        <div className="flex flex-col gap-1.5">
          <label
            className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}
          >
            {t("step1.cpm")}
            <span className="text-[rgba(178,34,34,1)]"> *</span>
          </label>

          <input
            type="number"
            value={form.cpm}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                cpm: e.target.value,
              }))
            }
            placeholder="15.50$"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border transition-colors
              focus:border-[rgba(148,211,193,1)]
              ${
                dark
                  ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
                  : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
              }
              ${
                attempted && !form.cpm
                  ? "!border-[#E53535]"
                  : ""
              }`}
            style={{
              direction: isRtl ? "rtl" : "ltr",
              fontFamily: "var(--font-tajawal,inherit)",
              colorScheme: dark ? "dark" : "light",
            }}
          />

          {attempted && !form.cpm && (
            <span className="text-[0.7rem] text-[#E53535]">
              {t("step1.required")}
            </span>
          )}
        </div>
      </div>

      {/* التواريخ */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>
          {t("step1.period")}
          <span className="text-[rgba(178,34,34,1)]"> *</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <DateInput
            value={form.startDate}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                startDate: v,
              }))
            }
            hasError={attempted && !form.startDate}
            isRtl={isRtl}
            dark={dark}
          />

          <DateInput
            value={form.endDate}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                endDate: v,
              }))
            }
            hasError={attempted && !form.endDate}
            isRtl={isRtl}
            dark={dark}
          />
        </div>

        {attempted && (!form.startDate || !form.endDate) && (
          <span className="text-[0.7rem] text-[#E53535]">
            {t("step1.required")}
          </span>
        )}
      </div>

      {/* نوع المحتوى */}
      <div>
        <label
          className={`text-xs block mb-2.5 ${
            dark ? "text-white" : "text-[#111]"
          }`}
        >
          {t("step1.contentType")}
          <span className="text-[rgba(178,34,34,1)]"> *</span>
        </label>

        <div className="grid grid-cols-3 gap-3">
          {CONTENT_TYPE_IDS.map((id) => {
            const Icon = CONTENT_TYPE_ICONS[id];
            const active = form.contentType === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    contentType: id,
                    subCategories: id === "MIXED" ? p.subCategories : [],
                  }))
                }
                className={`flex flex-col items-center gap-2 py-[18px] px-3 rounded-xl border transition-all cursor-pointer
                  ${
                    active
                      ? dark
                        ? "bg-[#3D2516] border-[#FF8C00]"
                        : "bg-[#FF8C00]/25 border-[#FF8C00]"
                      : dark
                      ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)]"
                      : "bg-white border-[#E5E5E5]"
                  }`}
              >
                <Icon
                  size={24}
                  color={
                    active
                      ? "#FF8C00"
                      : dark
                      ? "#9A9A9A"
                      : "#666666"
                  }
                />

                <span
                  className={`text-[0.8rem] font-semibold ${
                    active
                      ? dark
                        ? "text-white"
                        : "text-[#FF8C00]"
                      : dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666666]"
                  }`}
                  style={{
                    fontFamily: "var(--font-tajawal,inherit)",
                  }}
                >
                  {t(`step1.contentTypes.${id}`)}
                </span>
              </button>
            );
          })}
        </div>
        {form.contentType === "MIXED" && (
          <div className="mt-3 rounded-xl border border-[#E5E5E5] p-3 dark:border-white/10">
            <p className={`mb-2 text-xs font-semibold ${dark ? "text-white" : "text-[#333]"}`}>
              {t("step1.contentType")}
            </p>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPE_IDS.filter((id) => id !== "MIXED").map((id) => {
                const selected = form.subCategories.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setForm((current) => ({
                      ...current,
                      subCategories: selected
                        ? current.subCategories.filter((item) => item !== id)
                        : [...current.subCategories, id],
                    }))}
                    className={`rounded-lg border px-3 py-2 text-xs ${selected ? "border-[#FF8C00] bg-[#FF8C00]/10 text-[#FF8C00]" : dark ? "border-white/10 text-gray-300" : "border-[#E5E5E5] text-[#555]"}`}
                  >
                    {t(`step1.contentTypes.${id}`)}
                  </button>
                );
              })}
            </div>
            {attempted && form.subCategories.length === 0 && (
              <p className="mt-2 text-xs text-[#E53535]">{t("step1.required")}</p>
            )}
          </div>
        )}
      </div>

      {/* الجمهور */}
      <div className="flex flex-col gap-2">
        <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>
          {t("step1.audience")}
        </label>

        <textarea
          value={form.audience}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              audience: e.target.value,
            }))
          }
          placeholder={t("step1.audiencePlaceholder")}
          rows={5}
          className={`w-full min-h-[140px] rounded-lg border px-3.5 py-2.5 text-sm outline-none resize-y box-border transition-colors
            focus:border-[rgba(148,211,193,1)]
            ${
              dark
                ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
                : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
            }`}
          style={{
            direction: isRtl ? "rtl" : "ltr",
            fontFamily: "var(--font-tajawal,inherit)",
          }}
        />
      </div>

      {/* ── المنصات ── */}
      <div>
        <label className={`text-xs block mb-2.5 ${dark ? "text-white" : "text-[#111]"}`}>
          المنصات المستهدفة
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_PLATFORMS.map((p) => {
            const active = (form.platforms || []).includes(p.key);
            const PIcon = p.icon;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() =>
                  setForm((prev) => {
                    const cur = prev.platforms || [];
                    return {
                      ...prev,
                      platforms: active
                        ? cur.filter((k) => k !== p.key)
                        : [...cur, p.key],
                    };
                  })
                }
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                  active
                    ? dark
                      ? "border-[#94D3C1] bg-[#94D3C1]/10 text-white"
                      : "border-[#94D3C1] bg-[#94D3C1]/15 text-[#0D4C3C]"
                    : dark
                    ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-[#9A9A9A]"
                    : "bg-white border-[#E5E5E5] text-[#666]"
                }`}
              >
                <PIcon size={14} color={active ? p.color : "#9A9A9A"} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── نسبة العرض إلى الارتفاع ── */}
      <div>
        <label className={`text-xs block mb-2.5 ${dark ? "text-white" : "text-[#111]"}`}>
          <MdOutlineAspectRatio size={13} className="inline mr-1" />
          نسبة الأبعاد (Aspect Ratio)
        </label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => {
            const active = form.aspectRatio === ratio;
            return (
              <button
                key={ratio}
                type="button"
                onClick={() => setForm((p) => ({ ...p, aspectRatio: active ? "" : ratio }))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "border-[#FF8C00] bg-[#FF8C00]/15 text-[#FF8C00]"
                    : dark
                    ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-[#9A9A9A]"
                    : "bg-white border-[#E5E5E5] text-[#666]"
                }`}
              >
                {ratio}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── مدة الفيديو (ثانية) ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={`text-xs flex items-center gap-1 ${dark ? "text-white" : "text-[#111]"}`}>
            <MdOutlineTimer size={13} />
            الحد الأدنى للمدة (ثانية)
          </label>
          <input
            type="number"
            min="0"
            value={form.minDurationSec}
            onChange={(e) => setForm((p) => ({ ...p, minDurationSec: e.target.value }))}
            placeholder="15"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border transition-colors focus:border-[rgba(148,211,193,1)] ${
              dark
                ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
                : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
            }`}
            style={{ direction: "ltr", colorScheme: dark ? "dark" : "light" }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={`text-xs flex items-center gap-1 ${dark ? "text-white" : "text-[#111]"}`}>
            <MdOutlineTimer size={13} />
            الحد الأقصى للمدة (ثانية)
          </label>
          <input
            type="number"
            min="0"
            value={form.maxDurationSec}
            onChange={(e) => setForm((p) => ({ ...p, maxDurationSec: e.target.value }))}
            placeholder="60"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border transition-colors focus:border-[rgba(148,211,193,1)] ${
              dark
                ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
                : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
            }`}
            style={{ direction: "ltr", colorScheme: dark ? "dark" : "light" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step2 ────────────────────────────────────────────────────
function Step2({
  t,
  dark,
  isRtl,
  checked,
  setChecked,
  attempted,
  description,
  setDescription,
  form,
  setForm,
}) {
  const allChecked = Object.values(checked).every(Boolean);
  const showError =
    attempted && (!allChecked || !description.trim());

  return (
    <div className="flex flex-col gap-5">
      <p
        className={`text-sm leading-relaxed ${
          dark ? "text-[#9A9A9A]" : "text-[#666666]"
        }`}
      >
        {t("compliance.intro")}
      </p>

      <div className="flex flex-col gap-4">
        {COMPLIANCE_IDS.map((id) => {
          const isChecked = checked[id];

          return (
            <div
              key={id}
              onClick={() =>
                setChecked((prev) => ({
                  ...prev,
                  [id]: !isChecked,
                }))
              }
              className={`flex gap-3 items-start cursor-pointer p-3.5 rounded-xl border transition-all
                ${
                  isChecked
                    ? dark
                      ? "bg-[#1E2E1E] border-[#4CAF50]"
                      : "bg-[#F0FFF4] border-[#4CAF50]"
                    : dark
                    ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)]"
                    : "border-[#E5E5E5]"
                }`}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <MdCheckBox size={22} color="#4CAF50" />
                ) : (
                  <MdCheckBoxOutlineBlank
                    size={22}
                    color={dark ? "#9A9A9A" : "#666666"}
                  />
                )}
              </div>

              <div>
                <p
                  className={`text-sm font-semibold mb-1 ${
                    dark ? "text-white" : "text-[#111]"
                  }`}
                >
                  {t(`compliance.items.${id}.title`)}
                </p>

                <p
                  className={`text-xs leading-relaxed ${
                    dark ? "text-[#9A9A9A]" : "text-[#666]"
                  }`}
                >
                  {t(`compliance.items.${id}.desc`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* وصف الحملة */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`text-sm font-semibold flex items-center gap-1.5 ${
            dark ? "text-white" : "text-[#111]"
          }`}
        >
          <FiFileText
            size={18}
            color={
              dark ? "rgba(148,211,193,1)" : "#FF8C00"
            }
          />

          {t("compliance.descTitle")}

          <span className="text-[rgba(178,34,34,1)]"> *</span>
        </label>

        <label
          className={`text-xs ${
            dark ? "text-[#9A9A9A]" : "text-[#666]"
          }`}
        >
          {t("compliance.descSub")}
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("compliance.descPlaceholder")}
          rows={5}
          className={`w-full rounded-lg border p-3 text-sm outline-none resize-y transition-colors
            focus:border-[rgba(148,211,193,1)]
            ${
              attempted && !description.trim()
                ? "border-[#E53535]"
                : dark
                ? "border-[rgba(63,73,69,1)]"
                : "border-[#E5E5E5]"
            }
            ${
              dark
                ? "bg-[rgba(17,20,21,1)] text-white placeholder:text-[#9A9A9A]"
                : "bg-white text-[#111] placeholder:text-[#999]"
            }`}
          style={{
            fontFamily: "var(--font-tajawal,inherit)",
          }}
        />

        {attempted && !description.trim() && (
          <span className="text-[0.7rem] text-[#E53535]">
            {t("step1.required")}
          </span>
        )}
      </div>

      {/* ── الهاشتاغات المطلوبة ── */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs flex items-center gap-1 ${dark ? "text-white" : "text-[#111]"}`}>
          <MdOutlineTag size={14} />
          الهاشتاغات المطلوبة
        </label>
        <input
          type="text"
          value={form.requiredHashtags}
          onChange={(e) => setForm((p) => ({ ...p, requiredHashtags: e.target.value }))}
          placeholder="#حلال #استثمار #ادخار (افصل بمسافة أو فاصلة)"
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border transition-colors focus:border-[rgba(148,211,193,1)] ${
            dark
              ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
              : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
        />
      </div>

      {/* ── الكلمات المفتاحية ── */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs flex items-center gap-1 ${dark ? "text-white" : "text-[#111]"}`}>
          <MdOutlineKey size={14} />
          الكلمات المفتاحية المطلوبة
        </label>
        <input
          type="text"
          value={form.requiredKeywords}
          onChange={(e) => setForm((p) => ({ ...p, requiredKeywords: e.target.value }))}
          placeholder="استثمار، ادخار، ذهب، شريعة (افصل بفاصلة)"
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border transition-colors focus:border-[rgba(148,211,193,1)] ${
            dark
              ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
              : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
        />
      </div>

      {/* ── المنشنات المطلوبة ── */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs flex items-center gap-1 ${dark ? "text-white" : "text-[#111]"}`}>
          <MdOutlineAlternateEmail size={14} />
          المنشنات المطلوبة
        </label>
        <input
          type="text"
          value={form.requiredMentions}
          onChange={(e) => setForm((p) => ({ ...p, requiredMentions: e.target.value }))}
          placeholder="@حساب1 @حساب2 (افصل بمسافة)"
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border transition-colors focus:border-[rgba(148,211,193,1)] ${
            dark
              ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
              : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
        />
      </div>

      {/* ── ملاحظة شرعية ── */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs flex items-center gap-1 ${dark ? "text-white" : "text-[#111]"}`}>
          <MdOutlineGavel size={14} />
          الملاحظة الشرعية (Sharia Note)
        </label>
        <textarea
          value={form.shariaNote}
          onChange={(e) => setForm((p) => ({ ...p, shariaNote: e.target.value }))}
          placeholder="أي قيود أو ضوابط شرعية تنطبق على هذه الحملة..."
          rows={3}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none resize-y box-border transition-colors focus:border-[rgba(148,211,193,1)] ${
            dark
              ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
              : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
        />
      </div>

      {/* ── شرط العرض / Offer Condition ── */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs flex items-center gap-1 ${dark ? "text-white" : "text-[#111]"}`}>
          <MdLocalOffer size={14} />
          شرط العرض (Offer Condition)
        </label>
        <textarea
          value={form.offerCondition}
          onChange={(e) => setForm((p) => ({ ...p, offerCondition: e.target.value }))}
          placeholder="الشروط الخاصة التي يجب تلبيتها للحصول على المكافأة..."
          rows={3}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none resize-y box-border transition-colors focus:border-[rgba(148,211,193,1)] ${
            dark
              ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
              : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
        />
      </div>

      {/* ── فكرة الكليب / Clip Idea ── */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs flex items-center gap-1 ${dark ? "text-white" : "text-[#111]"}`}>
          <MdOutlineLightbulb size={14} />
          فكرة الكليب (Clip Idea)
        </label>
        <textarea
          value={form.clipIdea}
          onChange={(e) => setForm((p) => ({ ...p, clipIdea: e.target.value }))}
          placeholder="وصف مختصر للفكرة الإبداعية المطلوب تنفيذها في الكليب..."
          rows={3}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none resize-y box-border transition-colors focus:border-[rgba(148,211,193,1)] ${
            dark
              ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)] text-white placeholder:text-[#9A9A9A]"
              : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
        />
      </div>

      {showError && (
        <div className="bg-[#B71C1C] rounded-lg px-4 py-3 flex items-center gap-2.5">
          <MdWarning size={20} color="#fff" />
          <span className="text-sm text-white">
            {t("compliance.error")}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Step3 ────────────────────────────────────────────────────
function Step3({
  t,
  dark,
  files,
  setFiles,
  dragging,
  setDragging,
  attempted,
  MAX_MB = 20,
}) {
  const MAX_SIZE = MAX_MB * 1024 * 1024;

  const addFiles = (incoming) => {
    let hasOverSize = false;

    const newFiles = Array.from(incoming).map((f) => {
      const isOverSize = f.size > MAX_SIZE;

      if (isOverSize) {
        hasOverSize = true;
      }

      return {
        file: f,
        id: Math.random().toString(36).slice(2),
        progress: isOverSize ? 0 : 100,
        status: isOverSize ? "failed" : "success",
        errorMsg: isOverSize
          ? "فشل في رفع المرفق (تجاوز 20 ميجابايت)"
          : null,
      };
    });

    if (hasOverSize) {
      toast.warning("عذراً، بعض الملفات المرفقة تتجاوز الحد الأقصى المسموح به وهو 20 ميجابايت.");
    }

    setFiles((p) => [...p, ...newFiles]);
  };

  const removeFile = (id) =>
    setFiles((p) => p.filter((f) => f.id !== id));

  const fmtSize = (b) => {
    const mb = b / 1048576;

    return mb >= 1
      ? `${mb.toFixed(1)} MB`
      : `${(b / 1024).toFixed(0)} KB`;
  };

  const fileIcon = (name, status) => {
    if (status === "failed") {
      return (
        <MdErrorOutline
          size={20}
          className="text-[#E53535]"
        />
      );
    }

    const ext = name.split(".").pop().toLowerCase();

    return ["mp4", "mov", "avi"].includes(ext) ? (
      <MdPlayCircle
        size={20}
        color="rgba(148,211,193,1)"
      />
    ) : (
      <MdImage
        size={20}
        color="rgba(148,211,193,1)"
      />
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <p
        className={`text-sm ${
          dark ? "text-[#9A9A9A]" : "text-[#666]"
        }`}
      >
        {t("step3.intro")}
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() =>
          document.getElementById("fileInput")?.click()
        }
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${
            dragging
              ? "border-[rgba(148,211,193,1)]"
              : dark
              ? "border-[rgba(63,73,69,1)]"
              : "border-[#E5E5E5]"
          }
          ${
            dragging
              ? dark
                ? "bg-[#1E1E1E]"
                : "bg-[#FFF8F5]"
              : dark
              ? "bg-[rgba(17,20,21,1)]"
              : "bg-white"
          }`}
      >
        <div
          className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
            dark
              ? "bg-[rgba(148,211,193,0.1)]"
              : "bg-[#E6F4F1]"
          }`}
        >
          <MdCloudUpload
            size={24}
            color="rgba(148,211,193,1)"
          />
        </div>

        <p
          className={`font-semibold text-base mb-1.5 ${
            dark ? "text-white" : "text-[#111]"
          }`}
        >
          {t("step3.dropTitle")}
        </p>

        <p
          className={`text-sm mb-3.5 ${
            dark ? "text-[#9A9A9A]" : "text-[#666]"
          }`}
        >
          {t("step3.dropSub")}
        </p>

        <div className="flex justify-center gap-2 flex-wrap mb-3">
          {["AI", "MP3", "PDF", "PNG", "JPG", "MP4"].map(
            (ext) => (
              <span
                key={ext}
                className={`rounded px-2 py-0.5 text-[0.7rem] ${
                  dark
                    ? "bg-[#2A2A2A] text-[#9A9A9A]"
                    : "bg-[#F0F0F0] text-[#666]"
                }`}
              >
                {ext}
              </span>
            )
          )}
        </div>

        <p
          className={`text-[0.72rem] mb-3.5 ${
            dark ? "text-[#9A9A9A]" : "text-[#666]"
          }`}
        >
          الحد الأقصى لحجم الملف هو {MAX_MB} ميجابايت
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("fileInput")?.click();
          }}
          className={`border rounded-lg px-5 py-2 text-sm cursor-pointer bg-transparent ${
            dark
              ? "border-[rgba(63,73,69,1)] text-white"
              : "border-[#E5E5E5] text-[#111]"
          }`}
          style={{
            fontFamily: "var(--font-tajawal,inherit)",
          }}
        >
          {t("step3.choose")}
        </button>

        <input
          id="fileInput"
          type="file"
          multiple
          accept=".ai,.mp3,.pdf,.png,.jpg,.jpeg,.mp4,.mov"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {files.map((f) => {
            const isFailed = f.status === "failed";

            return (
              <div
                key={f.id}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${
                  isFailed
                    ? "border-[#E53535] bg-[#FFF5F5]"
                    : dark
                    ? "bg-[rgba(17,20,21,1)] border-[rgba(63,73,69,1)]"
                    : "bg-white border-[#E5E5E5]"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isFailed
                      ? "bg-[#FFE5E5]"
                      : dark
                      ? "bg-[#2A2A2A]"
                      : "bg-[#F0F0F0]"
                  }`}
                >
                  {fileIcon(f.file.name, f.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[0.82rem] font-semibold truncate ${
                      isFailed
                        ? "text-[#E53535]"
                        : dark
                        ? "text-white"
                        : "text-[#111]"
                    }`}
                  >
                    {f.file.name}
                  </p>

                  <p
                    className={`text-[0.72rem] mt-0.5 ${
                      isFailed
                        ? "text-[#E53535]"
                        : dark
                        ? "text-[#9A9A9A]"
                        : "text-[#666]"
                    }`}
                  >
                    {isFailed
                      ? f.errorMsg
                      : `${t("step3.complete")} · ${fmtSize(
                          f.file.size
                        )}`}
                  </p>

                  {!isFailed && (
                    <div
                      className={`h-0.5 rounded mt-1.5 ${
                        dark
                          ? "bg-[#2A2A2A]"
                          : "bg-[#E5E5E5]"
                      }`}
                    >
                      <div
                        className="h-full bg-[rgba(148,211,193,1)] rounded"
                        style={{
                          width: `${f.progress}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className={`bg-transparent border-none cursor-pointer p-1 ${
                    dark ? "text-[#9A9A9A]" : "text-[#666]"
                  }`}
                >
                  <MdDelete size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {attempted &&
        files.filter((f) => f.status === "success").length ===
          0 && (
          <p className="text-[0.78rem] text-[#E53535]">
            يرجى رفع ملف صحيح واحد على الأقل للمتابعة.
          </p>
        )}
    </div>
  );
}

// ─── Step4 ────────────────────────────────────────────────────
function Step4({ t, dark, form, files, coverImage }) {
  const cardCls = `border rounded-xl p-5 ${
    dark
      ? "bg-[#141414] border-[#262626]"
      : "bg-white border-[#E5E5E5]"
  }`;

  const innerCardCls = `border rounded-xl p-4 ${
    dark
      ? "bg-[#0D0D0D] border-[#222222]"
      : "bg-[#F9F9F9] border-[#E5E5E5]"
  }`;

  const budgetFormatted = form.totalBudget
    ? Number(form.totalBudget).toLocaleString()
    : "0";

  const iconColorClass = dark
    ? "text-[#94D3C1]"
    : "text-[#FF8C00]";

  const validFiles = files.filter(
    (f) => f.status === "success"
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div
          className={`md:col-span-7 flex flex-col justify-between ${cardCls}`}
        >
          <div>
            <div className="flex items-center gap-2 mb-5">
              <MdInfoOutline
                size={20}
                className={iconColorClass}
              />

              <span
                className={`text-xs font-semibold ${
                  dark ? "text-white" : "text-[#111]"
                }`}
              >
                {t("step4.identity")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="flex flex-col gap-1">
                <span
                  className={`text-xs ${
                    dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666]"
                  }`}
                >
                  {t("step4.campaignName")}
                </span>

                <span
                  className={`text-sm font-semibold ${
                    dark ? "text-white" : "text-[#111]"
                  }`}
                >
                  {form.name || "-"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={`text-xs ${
                    dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666]"
                  }`}
                >
                  النوع
                </span>

                <span
                  className={`text-sm font-semibold ${
                    dark ? "text-white" : "text-[#111]"
                  }`}
                >
                  {form.contentType || "-"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={`text-xs ${
                    dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666]"
                  }`}
                >
                  {t("step4.startDate")}
                </span>

                <span
                  className={`text-sm font-semibold ${
                    dark ? "text-white" : "text-[#111]"
                  }`}
                >
                  {form.startDate || "-"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={`text-xs ${
                    dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666]"
                  }`}
                >
                  {t("step4.endDate")}
                </span>

                <span
                  className={`text-sm font-semibold ${
                    dark ? "text-white" : "text-[#111]"
                  }`}
                >
                  {form.endDate || "-"}
                </span>
              </div>

              {/* صورة الحملة */}
              <div className="flex flex-col gap-1 col-span-2 min-w-0">
                <span
                  className={`text-xs ${
                    dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666]"
                  }`}
                >
                  صورة الحملة
                </span>

                <span
                  className={`text-sm font-semibold truncate ${
                    dark ? "text-white" : "text-[#111]"
                  }`}
                >
                  {coverImage?.name || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`md:col-span-5 flex flex-col justify-between ${cardCls}`}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MdAccountBalanceWallet
                size={20}
                className={iconColorClass}
              />

              <span
                className={`text-xs font-semibold ${
                  dark ? "text-white" : "text-[#111]"
                }`}
              >
                {t("step4.budget")}
              </span>
            </div>

            <div className="flex flex-col gap-1 my-2">
              <span
                className={`text-xs ${
                  dark ? "text-[#9A9A9A]" : "text-[#666]"
                }`}
              >
                إجمالي ميزانية الحملة
              </span>

              <p className="text-3xl font-bold text-[#FF8C00] tracking-tight">
                ${budgetFormatted}
              </p>
            </div>
          </div>

          <div
            className={`w-full flex justify-between items-center border-t pt-3 mt-4 ${
              dark ? "border-[#222222]" : "border-[#E5E5E5]"
            }`}
          >
            <span
              className={`text-xs ${
                dark ? "text-[#9A9A9A]" : "text-[#666]"
              }`}
            >
              {t("step4.reach")}
            </span>

            <span
              className={`text-xs font-semibold ${
                dark ? "text-white" : "text-[#111]"
              }`}
            >
              CPM: ${form.cpm || "0"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div
          className={`md:col-span-7 flex flex-col justify-between ${cardCls}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <MdFolder
              size={20}
              className={iconColorClass}
            />

            <span
              className={`text-xs font-semibold ${
                dark ? "text-white" : "text-[#111]"
              }`}
            >
              {t("step4.assets")}
            </span>
          </div>

          <div className={innerCardCls}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span
                  className={`text-sm font-bold ${
                    dark ? "text-white" : "text-[#111]"
                  }`}
                >
                  تم رفع {validFiles.length} أصول
                </span>

                <span
                  className={`text-xs ${
                    dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666]"
                  }`}
                >
                  {validFiles
                    .map((f) => f.file.name)
                    .join("، ")}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex -space-x-2 space-x-reverse items-center">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                      dark
                        ? "bg-[#1E1E1E] border-[#333]"
                        : "bg-white border-[#DDD]"
                    }`}
                  >
                    <MdImage
                      size={18}
                      className={iconColorClass}
                    />
                  </div>

                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                      dark
                        ? "bg-[#1E1E1E] border-[#333]"
                        : "bg-white border-[#DDD]"
                    }`}
                  >
                    <MdPlayCircle
                      size={18}
                      className={iconColorClass}
                    />
                  </div>

                  {validFiles.length > 2 && (
                    <div className="w-9 h-9 rounded-lg border bg-[#2A2A2A] border-[#333] text-white text-xs font-semibold flex items-center justify-center">
                      +{validFiles.length - 2}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`md:col-span-5 flex flex-col justify-between ${cardCls}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <MdGpsFixed
              size={20}
              className={iconColorClass}
            />

            <span
              className={`text-xs font-semibold ${
                dark ? "text-white" : "text-[#111]"
              }`}
            >
              {t("step4.targeting")}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <MdPublic
                size={18}
                className={`mt-0.5 shrink-0 ${
                  dark
                    ? "text-[#9A9A9A]"
                    : "text-[#FF8C00]"
                }`}
              />

              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-xs font-semibold ${
                    dark ? "text-white" : "text-[#111]"
                  }`}
                >
                  الجمهور المستهدف
                </span>

                <span
                  className={`text-[0.7rem] ${
                    dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666]"
                  }`}
                >
                  {form.audience || "غير محدد"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── الصفحة الرئيسية ──────────────────────────────────────────
export default function NewCampaignPage() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const router = useRouter();
  const t = useTranslations("newCampaign");

  const isRtl = locale === "ar";
  const dark = isDark;

  const [step, setStep] = useState(1);
  const [attempted, setAttempted] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    totalBudget: "",
    cpm: "",
    startDate: "",
    endDate: "",
    contentType: "",
    category: "",
    audience: "",
    subCategories: [],
    targetCountries: [],
    // ── الحقول الجديدة ──
    platforms: [],
    requiredHashtags: "",
    requiredKeywords: "",
    requiredMentions: "",
    aspectRatio: "",
    minDurationSec: "",
    maxDurationSec: "",
    shariaNote: "",
    offerCondition: "",
    clipIdea: "",
    brief: {
      mainIdea: "",
      tone: "",
      keyMessages: "",
      keywords: [],
      visualReferences: "",
    },
  });

  const [checked, setChecked] = useState({
    noGambling: false,
    noSexualContent: false,
    noExplicitMusic: false,
    noAlcohol: false,
    noSuspiciousCurrencies: false,
    noUnrealisticProfit: false,
  });

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const MAX_MB = 20;

  const [draftId, setDraftId] = useState(null);
  const [draftVersion, setDraftVersion] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Load Draft ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlDraftId = new URLSearchParams(
      window.location.search
    ).get("draftId");

    if (!urlDraftId) return;

    setDraftId(urlDraftId);

    async function loadDraftData() {
      try {
        const res = await getDraftById(urlDraftId);

        const d =
          res?.draft ||
          res?.campaign ||
          res?.data?.draft ||
          res?.data?.campaign ||
          res?.data ||
          res;

        if (d) {
          setDraftVersion(Number(d.version) || 1);
          const budgetVal =
            d.totalBudget != null
              ? String(d.totalBudget)
              : d.budget != null
              ? String(d.budget)
              : "";

          const cpmVal =
            d.cpm != null
              ? String(d.cpm)
              : d.rewardPerView != null
              ? String(d.rewardPerView)
              : "";

          const startDateVal = d.startDate
            ? String(d.startDate).split("T")[0]
            : "";

          const endDateVal = d.endDate
            ? String(d.endDate).split("T")[0]
            : "";

          const mainIdeaVal =
            d.brief?.mainIdea ||
            d.description ||
            d.brief?.description ||
            "";

          setForm((prev) => ({
            ...prev,
            name: d.name || d.title || "",
            totalBudget: budgetVal,
            cpm: cpmVal,
            startDate: startDateVal,
            endDate: endDateVal,
            contentType:
              d.contentType || d.category || "",
            category:
              d.category || d.contentType || "",
            audience:
              d.brief?.audience || d.audience || "",
            subCategories: d.subCategories || [],
            targetCountries: d.targetCountries || [],
            // ── الحقول الجديدة ──
            platforms: Array.isArray(d.submissionRequirements?.platforms || d.platforms)
              ? (d.submissionRequirements?.platforms || d.platforms).map((p) => (typeof p === "string" ? p.toLowerCase() : p?.key ?? ""))
              : [],
            requiredHashtags: Array.isArray(d.submissionRequirements?.requiredHashtags || d.requiredHashtags)
              ? (d.submissionRequirements?.requiredHashtags || d.requiredHashtags).join(" ")
              : d.submissionRequirements?.requiredHashtags || d.requiredHashtags || "",
            requiredKeywords: Array.isArray(d.submissionRequirements?.requiredKeywords || d.requiredKeywords)
              ? (d.submissionRequirements?.requiredKeywords || d.requiredKeywords).join(", ")
              : d.submissionRequirements?.requiredKeywords || d.requiredKeywords || "",
            requiredMentions: Array.isArray(d.submissionRequirements?.requiredMentions || d.requiredMentions)
              ? (d.submissionRequirements?.requiredMentions || d.requiredMentions).join(" ")
              : d.submissionRequirements?.requiredMentions || d.requiredMentions || "",
            aspectRatio: d.submissionRequirements?.aspectRatio || d.aspectRatio || "",
            minDurationSec: (d.submissionRequirements?.minDurationSec ?? d.minDurationSec) != null ? String(d.submissionRequirements?.minDurationSec ?? d.minDurationSec) : "",
            maxDurationSec: (d.submissionRequirements?.maxDurationSec ?? d.maxDurationSec) != null ? String(d.submissionRequirements?.maxDurationSec ?? d.maxDurationSec) : "",
            shariaNote: d.submissionRequirements?.shariaNote || d.shariaNote || "",
            offerCondition: d.submissionRequirements?.offerCondition || d.offerCondition || "",
            clipIdea: d.submissionRequirements?.clipIdea || d.clipIdea || "",
            brief: {
              ...prev.brief,
              mainIdea: mainIdeaVal,
              tone: d.brief?.tone || "",
              keyMessages:
                d.brief?.keyMessages || "",
              keywords: d.brief?.keywords || [],
              visualReferences:
                d.brief?.visualReferences || "",
            },
          }));

          if (mainIdeaVal) {
            setDescription(mainIdeaVal);
          }

          if (d.halalDeclared || d.halalDeclaration) {
            const h =
              typeof d.halalDeclaration === "object"
                ? d.halalDeclaration
                : {};

            setChecked({
              noGambling: h.noGambling ?? true,
              noSexualContent:
                h.noSexualContent ?? true,
              noExplicitMusic:
                h.noExplicitMusic ?? true,
              noAlcohol: h.noAlcohol ?? true,
              noSuspiciousCurrencies:
                h.noSuspiciousCurrencies ?? true,
              noUnrealisticProfit:
                h.noUnrealisticProfit ?? true,
            });
          }
        }
      } catch (err) {
        console.warn(
          "Failed to load draft data:",
          err
        );
      }
    }

    loadDraftData();
  }, []);

  // ─── Validation ─────────────────────────────────────────────
  const step1Valid = Boolean(
    form.name.trim() &&
      form.totalBudget &&
      form.cpm &&
      form.startDate &&
      form.endDate &&
      form.contentType &&
      (form.contentType !== "MIXED" || form.subCategories.length > 0)
  );

  const step2Valid =
    Object.values(checked).every(Boolean) &&
    Boolean(description.trim());

  const step3Valid = files.some(
    (f) => f.status === "success"
  );

  const canNext = () =>
    [step1Valid, step2Valid, step3Valid, true][
      step - 1
    ];

  // ─── Country Map ────────────────────────────────────────────
  const COUNTRY_MAP = {
    SA: "SAU",
    AE: "ARE",
    EG: "EGY",
    KW: "KWT",
    QA: "QAT",
    BH: "BHR",
    OM: "OMN",
    JO: "JOR",
    IQ: "IRQ",
    US: "USA",
    UK: "GBR",
    GB: "GBR",
    MA: "MAR",
    DZ: "DZA",
    TN: "TUN",
    LY: "LBY",
    SD: "SDN",
    YE: "YEM",
    SY: "SYR",
    LB: "LBN",
    PS: "PSE",
  };

  function normalizeCountryCodes(countries) {
    if (!countries || !countries.length) {
      return ["SAU"];
    }

    return countries.map((c) => {
      if (!c) return "SAU";

      if (c.length === 3) {
        return c.toUpperCase();
      }

      return (
        COUNTRY_MAP[c.toUpperCase()] || "SAU"
      );
    });
  }

  const buildCampaignPayload = () => {
    const payload = {
      name: (form.name || "").trim(),
      halalDeclaration: checked,
      halalDeclared: Object.values(checked).every(Boolean),
    };

    if (form.contentType) {
      payload.contentType = form.contentType;
      payload.category = form.category || form.contentType;
      if (form.contentType === "MIXED" && form.subCategories?.length) {
        payload.subCategories = form.subCategories;
      }
    }

    if (form.totalBudget && Number(form.totalBudget) > 0) {
      payload.totalBudget = Number(form.totalBudget);
    }

    if (form.cpm && Number(form.cpm) > 0) {
      payload.cpm = Number(form.cpm);
    }

    if (form.startDate) {
      payload.startDate = form.startDate;
    }

    if (form.endDate) {
      payload.endDate = form.endDate;
    }

    if (form.targetCountries?.length) {
      payload.targetCountries = normalizeCountryCodes(form.targetCountries);
    }

    const mainIdea = (description || form.brief?.mainIdea || "").trim();
    if (mainIdea || form.audience) {
      payload.brief = {
        ...form.brief,
        mainIdea: mainIdea || undefined,
        audience: form.audience || undefined,
      };
    }

    const platforms = (form.platforms || []).map((platform) => platform.toUpperCase()).filter(Boolean);
    const requiredHashtags = form.requiredHashtags
      ? form.requiredHashtags.split(/[\s,]+/).filter(Boolean)
      : [];
    const requiredKeywords = form.requiredKeywords
      ? form.requiredKeywords.split(/[,،]+/).map((keyword) => keyword.trim()).filter(Boolean)
      : [];
    const requiredMentions = form.requiredMentions
      ? form.requiredMentions.split(/\s+/).map((mention) => mention.replace(/^@/, "")).filter(Boolean)
      : [];

    payload.submissionRequirements = {
      platforms,
      requiredHashtags,
      requiredKeywords,
      requiredMentions,
      aspectRatio: form.aspectRatio || "9:16",
      minDurationSec: form.minDurationSec ? Number(form.minDurationSec) : undefined,
      maxDurationSec: form.maxDurationSec ? Number(form.maxDurationSec) : undefined,
      shariaNote: form.shariaNote || undefined,
      offerCondition: form.offerCondition || undefined,
      clipIdea: form.clipIdea || undefined,
    };

    return payload;
  };

  const getCampaignAssets = () => ({
    coverImage,
    materials: files.filter((item) => item.status === "success" && item.file instanceof File).map((item) => item.file),
  });

  // ─── Save Draft ─────────────────────────────────────────────
  const handleSaveDraft = async () => {
    if (!form.name.trim()) {
      toast.warning(isRtl ? "يرجى إدخال اسم الحملة أولاً لحفظ المسودة" : "Please enter a campaign name first to save draft");
      setAttempted(true);
      return;
    }
    const payload = buildCampaignPayload();
    const assets = getCampaignAssets();
    try {
      const response = draftId
        ? await autoSaveDraft(draftId, { ...payload, clientVersion: draftVersion }, assets)
        : await saveDraft(payload, assets);
      const draft = response?.draft || response?.data?.draft;
      if (draft?._id || draft?.id) {
        setDraftId(draft._id || draft.id);
        setDraftVersion(Number(draft.version) || 1);
      }
      toast.success("تم حفظ المسودة بنجاح");
      router.push("/advertiser/drafts");
    } catch (error) {
      toast.error(error?.message || "تعذر حفظ المسودة");
    }
  };

  // ─── Submit Campaign ───────────────────────────────────────
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = buildCampaignPayload();
    const assets = getCampaignAssets();

    try {
      if (draftId) {
        const saved = await autoSaveDraft(draftId, { ...payload, clientVersion: draftVersion }, assets);
        setDraftVersion(Number(saved?.draft?.version) || draftVersion + 1);
        const submitted = await submitDraft(draftId, { halalDeclaration: checked }, assets);
        if (submitted?.success !== true || !submitted?.campaign) {
          throw new Error(submitted?.message || "استجابة تسليم المسودة غير صالحة");
        }
      } else {
        const created = await createCampaign(payload, assets);
        if (created?.success !== true || !created?.campaign) {
          throw new Error(created?.message || "استجابة إنشاء الحملة غير صالحة");
        }
      }

      toast.success("تم إرسال الحملة للمراجعة بنجاح ✅");
      router.push("/advertiser/campaigns");
    } catch (error) {
      toast.error(error?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Next ───────────────────────────────────────────────────
  const handleNext = () => {
    if (!canNext()) {
      setAttempted(true);
      return;
    }

    setAttempted(false);

    if (step < 4) {
      setStep(step + 1);
    }
  };

  // ─── Back ───────────────────────────────────────────────────
  const handleBack = () => {
    setAttempted(false);

    if (step > 1) {
      setStep(step - 1);
    }
  };

  // ─── Render Step ────────────────────────────────────────────
  const renderStep = () => {
    if (step === 1) {
      return (
        <Step1
          t={t}
          dark={dark}
          isRtl={isRtl}
          form={form}
          setForm={setForm}
          attempted={attempted}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
        />
      );
    }

    if (step === 2) {
      return (
        <Step2
          t={t}
          dark={dark}
          isRtl={isRtl}
          checked={checked}
          setChecked={setChecked}
          attempted={attempted}
          description={description}
          setDescription={setDescription}
          form={form}
          setForm={setForm}
        />
      );
    }

    if (step === 3) {
      return (
        <Step3
          t={t}
          dark={dark}
          files={files}
          setFiles={setFiles}
          dragging={dragging}
          setDragging={setDragging}
          attempted={attempted}
          MAX_MB={MAX_MB}
        />
      );
    }

    return (
      <Step4
        t={t}
        dark={dark}
        form={form}
        files={files}
        coverImage={coverImage}
      />
    );
  };

  // ─── UI ─────────────────────────────────────────────────────
  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen p-8 transition-colors ${
        dark
          ? "bg-[#0A0A0A]"
          : "bg-[#F4F5F7]"
      }`}
      style={{
        fontFamily:
          "var(--font-tajawal,inherit)",
      }}
    >
      {/* Stepper */}
      <div
        className="flex items-start justify-between w-full mb-9"
        style={{
          direction: isRtl
            ? "rtl"
            : "ltr",
        }}
      >
        {STEP_IDS.map((id, idx) => {
          const done = id < step;
          const active = id === step;

          return (
            <React.Fragment key={id}>
              {idx > 0 && (
                <div
                  className={`flex-1 h-0.5 mt-5 mx-2 ${
                    id <= step
                      ? "bg-[rgba(148,211,193,1)]"
                      : dark
                      ? "bg-[#2D2D2D]"
                      : "bg-[#E5E5E5]"
                  }`}
                />
              )}

              <div className="flex flex-col items-center gap-1 shrink-0 min-w-[60px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    active || done
                      ? "bg-[rgba(148,211,193,1)] text-black"
                      : dark
                      ? "bg-[#2A2A2A] text-[#9A9A9A]"
                      : "bg-[#E5E5E5] text-[#666]"
                  }`}
                >
                  {id}
                </div>

                <span
                  className={`text-[0.65rem] whitespace-nowrap text-center ${
                    active || done
                      ? "text-[rgba(148,211,193,1)] font-semibold"
                      : dark
                      ? "text-[#9A9A9A]"
                      : "text-[#666]"
                  }`}
                >
                  {t(`steps.s${id}`)}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* الكارد */}
      <div
        className={`border rounded-2xl p-9 w-full max-w-[1401px] mx-auto box-border shadow-[0px_4px_30px_0px_rgba(0,0,0,0.1)] backdrop-blur-[20px] transition-colors ${
          dark
            ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]"
            : "bg-white border-[#E5E5E5]"
        }`}
      >
        <div
          className={`mb-7 ${
            isRtl
              ? "text-right"
              : "text-left"
          }`}
        >
          <h1
            className={`text-[1.4rem] font-bold mb-1.5 ${
              dark
                ? "text-white"
                : "text-[#111]"
            }`}
          >
            {t(`titles.t${step}`)}
          </h1>

          <p
            className={`text-sm ${
              dark
                ? "text-[#9A9A9A]"
                : "text-[#666]"
            }`}
          >
            {t(`subtitles.s${step}`)}
          </p>
        </div>

        {renderStep()}

        <div className="flex justify-between items-center mt-8 flex-wrap gap-3">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold border bg-transparent cursor-pointer ${
                  dark
                    ? "border-[rgba(63,73,69,1)] text-white"
                    : "border-[#E5E5E5] text-[#111]"
                }`}
                style={{
                  fontFamily:
                    "var(--font-tajawal,inherit)",
                }}
              >
                {t("nav.back")}
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold border bg-transparent cursor-pointer ${
                dark
                  ? "border-[rgba(63,73,69,1)] text-white"
                  : "border-[#E5E5E5] text-[#111]"
              }`}
              style={{
                fontFamily:
                  "var(--font-tajawal,inherit)",
              }}
            >
              {t("nav.saveDraft")}
            </button>

            <button
              type="button"
              onClick={
                step === 4
                  ? handleSubmit
                  : handleNext
              }
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer border border-transparent flex items-center gap-2 disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(108.21deg,#FF9900 0%,#FF5603 100%)",
                fontFamily:
                  "var(--font-tajawal,inherit)",
              }}
            >
              {step === 4
                ? isSubmitting
                  ? "جارٍ الإرسال..."
                  : t("nav.submit")
                : t("nav.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "@/i18n/navigation";
import { FiCalendar, FiFileText } from "react-icons/fi"; 
import { saveDraft, autoSaveDraft, submitDraft, createCampaign } from "@/lib/campaignApi";
import { getDraftById } from "@/services/drafts";
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
} from "react-icons/md";

const CONTENT_TYPE_IDS = ["CLIPPING", "UGC", "SLIDESHOW", "AUDIO", "LOGO", "MIXED"];
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
function DateInput({ value, onChange, hasError, isRtl }) {
  const ref = useRef(null);
  const placeholder = isRtl ? "أدخل التاريخ" : "Enter date";

  return (
    <div className="relative w-full">
      <div
        className={`w-full rounded-lg border py-2.5 text-sm box-border bg-white ${
          hasError ? "border-[#E53535]" : "border-[#E5E5E5]"
        } ${isRtl ? "pr-10 pl-3.5 text-right" : "pl-10 pr-3.5 text-left"}`}
        style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
      >
        <span className={value ? "text-[#111]" : "text-[#999]"}>{value || placeholder}</span>
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

// ─── Step1 ────────────────────────────────────────────────────
function Step1({ t, dark, isRtl, form, setForm, attempted }) {
  return (
    <div className="flex flex-col gap-5">
      {/* اسم الحملة */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>
          {t("step1.name")}<span className="text-[rgba(178,34,34,1)]"> *</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder={t("step1.namePlaceholder")}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border bg-white text-[#111] placeholder:text-[#999]
            ${attempted && !form.name.trim() ? "border-[#E53535]" : "border-[#E5E5E5]"}`}
          style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
        />
        {attempted && !form.name.trim() && (
          <span className="text-[0.7rem] text-[#E53535]">{t("step1.required")}</span>
        )}
      </div>

      {/* الميزانية + CPM */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>
            {t("step1.budget")}<span className="text-[rgba(178,34,34,1)]"> *</span>
          </label>
          <input
            type="number"
            value={form.totalBudget}
            onChange={(e) => setForm((p) => ({ ...p, totalBudget: e.target.value }))}
            placeholder="10,000$"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border bg-white text-[#111] placeholder:text-[#999]
              ${attempted && !form.totalBudget ? "border-[#E53535]" : "border-[#E5E5E5]"}`}
            style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
          />
          {attempted && !form.totalBudget && (
            <span className="text-[0.7rem] text-[#E53535]">{t("step1.required")}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>
            {t("step1.cpm")}<span className="text-[rgba(178,34,34,1)]"> *</span>
          </label>
          <input
            type="number"
            value={form.cpm}
            onChange={(e) => setForm((p) => ({ ...p, cpm: e.target.value }))}
            placeholder="15.50$"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none box-border bg-white text-[#111] placeholder:text-[#999]
              ${attempted && !form.cpm ? "border-[#E53535]" : "border-[#E5E5E5]"}`}
            style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
          />
          {attempted && !form.cpm && (
            <span className="text-[0.7rem] text-[#E53535]">{t("step1.required")}</span>
          )}
        </div>
      </div>

      {/* التواريخ */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>
          {t("step1.period")}<span className="text-[rgba(178,34,34,1)]"> *</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <DateInput
            value={form.startDate}
            onChange={(v) => setForm((p) => ({ ...p, startDate: v }))}
            hasError={attempted && !form.startDate}
            isRtl={isRtl}
          />
          <DateInput
            value={form.endDate}
            onChange={(v) => setForm((p) => ({ ...p, endDate: v }))}
            hasError={attempted && !form.endDate}
            isRtl={isRtl}
          />
        </div>
        {attempted && (!form.startDate || !form.endDate) && (
          <span className="text-[0.7rem] text-[#E53535]">{t("step1.required")}</span>
        )}
      </div>

      {/* نوع المحتوى */}
      <div>
        <label className={`text-xs block mb-2.5 ${dark ? "text-white" : "text-[#111]"}`}>
          {t("step1.contentType")}<span className="text-[rgba(178,34,34,1)]"> *</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CONTENT_TYPE_IDS.map((id) => {
            const Icon = CONTENT_TYPE_ICONS[id];
            const active = form.contentType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setForm((p) => ({ ...p, contentType: id }))}
                className={`flex flex-col items-center gap-2 py-[18px] px-3 rounded-xl border transition-all cursor-pointer
                  ${
                    active
                      ? dark
                        ? "bg-[#3D2516] border-[#FF8C00]"
                        : "bg-[#FF8C00]/25 border-[#FF8C00]"
                      : dark
                      ? "bg-[#111] border-[#2D2D2D]"
                      : "bg-white border-[#E5E5E5]"
                  }`}
              >
                <Icon size={24} color={active ? "#FF8C00" : dark ? "#9A9A9A" : "#666666"} />
                <span
                  className={`text-[0.8rem] font-semibold ${
                    active ? (dark ? "text-white" : "text-[#FF8C00]") : dark ? "text-[#9A9A9A]" : "text-[#666666]"
                  }`}
                  style={{ fontFamily: "var(--font-tajawal,inherit)" }}
                >
                  {t(`step1.contentTypes.${id}`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* الجمهور */}
      <div className="flex flex-col gap-2">
        <label className={`text-xs ${dark ? "text-white" : "text-[#111]"}`}>{t("step1.audience")}</label>
        <textarea
          value={form.audience}
          onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
          placeholder={t("step1.audiencePlaceholder")}
          rows={5}
          className={`w-full min-h-[140px] rounded-lg border px-3.5 py-2.5 text-sm outline-none resize-y box-border
            ${
              dark
                ? "bg-[#0D0D0D] border-[#2D2D2D] text-white placeholder:text-[#9A9A9A]"
                : "bg-white border-[#E5E5E5] text-[#111] placeholder:text-[#999]"
            }`}
          style={{ direction: isRtl ? "rtl" : "ltr", fontFamily: "var(--font-tajawal,inherit)" }}
        />
      </div>
    </div>
  );
}

// ─── Step2 ────────────────────────────────────────────────────
function Step2({ t, dark, checked, setChecked, attempted, description, setDescription }) {
  const allChecked = Object.values(checked).every(Boolean);
  const showError = attempted && (!allChecked || !description.trim());
  return (
    <div className="flex flex-col gap-5">
      <p className={`text-sm leading-relaxed ${dark ? "text-[#9A9A9A]" : "text-[#666666]"}`}>
        {t("compliance.intro")}
      </p>
      <div className="flex flex-col gap-4">
        {COMPLIANCE_IDS.map((id) => {
          const isChecked = checked[id];
          return (
            <div
              key={id}
              onClick={() => setChecked((prev) => ({ ...prev, [id]: !isChecked }))}
              className={`flex gap-3 items-start cursor-pointer p-3.5 rounded-xl border transition-all
                ${
                  isChecked
                    ? dark
                      ? "bg-[#1E2E1E] border-[#4CAF50]"
                      : "bg-[#F0FFF4] border-[#4CAF50]"
                    : dark
                    ? "border-[#2D2D2D]"
                    : "border-[#E5E5E5]"
                }`}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <MdCheckBox size={22} color="#4CAF50" />
                ) : (
                  <MdCheckBoxOutlineBlank size={22} color={dark ? "#9A9A9A" : "#666666"} />
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold mb-1 ${dark ? "text-white" : "text-[#111]"}`}>
                  {t(`compliance.items.${id}.title`)}
                </p>
                <p className={`text-xs leading-relaxed ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>
                  {t(`compliance.items.${id}.desc`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* وصف الحملة */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-sm font-semibold flex items-center gap-1.5 ${dark ? "text-white" : "text-[#111]"}`}>
          <FiFileText size={18} color={dark ? "rgba(148,211,193,1)" : "#FF8C00"} />
          {t("compliance.descTitle")}
          <span className="text-[rgba(178,34,34,1)]"> *</span>
        </label>
        <label className={`text-xs ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>{t("compliance.descSub")}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("compliance.descPlaceholder")}
          rows={5}
          className={`w-full rounded-lg border p-3 text-sm outline-none resize-y
            ${
              attempted && !description.trim()
                ? "border-[#E53535]"
                : dark
                ? "border-[#2D2D2D]"
                : "border-[#E5E5E5]"
            }
            ${dark ? "bg-[#0A0A0A] text-white placeholder:text-[#9A9A9A]" : "bg-white text-[#111] placeholder:text-[#999]"}`}
          style={{ fontFamily: "var(--font-tajawal,inherit)" }}
        />
        {attempted && !description.trim() && (
          <span className="text-[0.7rem] text-[#E53535]">{t("step1.required")}</span>
        )}
      </div>

      {showError && (
        <div className="bg-[#B71C1C] rounded-lg px-4 py-3 flex items-center gap-2.5">
          <MdWarning size={20} color="#fff" />
          <span className="text-sm text-white">{t("compliance.error")}</span>
        </div>
      )}
    </div>
  );
}

// ─── Step3  ──────────
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
    const newFiles = Array.from(incoming).map((f) => {
      const isOverSize = f.size > MAX_SIZE;
      return {
        file: f,
        id: Math.random().toString(36).slice(2),
        progress: isOverSize ? 0 : 100,
        status: isOverSize ? "failed" : "success",
        errorMsg: isOverSize ? "فشل في رفع المرفق (تجاوز 20 ميجابايت)" : null,
      };
    });
    setFiles((p) => [...p, ...newFiles]);
  };

  const removeFile = (id) => setFiles((p) => p.filter((f) => f.id !== id));

  const fmtSize = (b) => {
    const mb = b / 1048576;
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
  };

  const fileIcon = (name, status) => {
    if (status === "failed") return <MdErrorOutline size={20} className="text-[#E53535]" />;
    const ext = name.split(".").pop().toLowerCase();
    return ["mp4", "mov", "avi"].includes(ext) ? (
      <MdPlayCircle size={20} color="rgba(148,211,193,1)" />
    ) : (
      <MdImage size={20} color="rgba(148,211,193,1)" />
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <p className={`text-sm ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>{t("step3.intro")}</p>
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
        onClick={() => document.getElementById("fileInput")?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${
            dragging
              ? "border-[rgba(148,211,193,1)]"
              : dark
              ? "border-[#2D2D2D]"
              : "border-[#E5E5E5]"
          }
          ${dragging ? (dark ? "bg-[#1E1E1E]" : "bg-[#FFF8F5]") : dark ? "bg-[#141414]" : "bg-white"}`}
      >
        <div
          className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
            dark ? "bg-[rgba(148,211,193,0.1)]" : "bg-[#E6F4F1]"
          }`}
        >
          <MdCloudUpload size={24} color="rgba(148,211,193,1)" />
        </div>
        <p className={`font-semibold text-base mb-1.5 ${dark ? "text-white" : "text-[#111]"}`}>{t("step3.dropTitle")}</p>
        <p className={`text-sm mb-3.5 ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>{t("step3.dropSub")}</p>
        <div className="flex justify-center gap-2 flex-wrap mb-3">
          {["AI", "MP3", "PDF", "PNG", "JPG", "MP4"].map((ext) => (
            <span
              key={ext}
              className={`rounded px-2 py-0.5 text-[0.7rem] ${
                dark ? "bg-[#2A2A2A] text-[#9A9A9A]" : "bg-[#F0F0F0] text-[#666]"
              }`}
            >
              {ext}
            </span>
          ))}
        </div>
        <p className={`text-[0.72rem] mb-3.5 ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>
          الحد الأقصى لحجم الملف هو {MAX_MB} ميجابايت
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("fileInput")?.click();
          }}
          className={`border rounded-lg px-5 py-2 text-sm cursor-pointer bg-transparent ${
            dark ? "border-[#2D2D2D] text-white" : "border-[#E5E5E5] text-[#111]"
          }`}
          style={{ fontFamily: "var(--font-tajawal,inherit)" }}
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
                    ? "bg-[#0D0D0D] border-[#2D2D2D]"
                    : "bg-white border-[#E5E5E5]"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isFailed ? "bg-[#FFE5E5]" : dark ? "bg-[#2A2A2A]" : "bg-[#F0F0F0]"
                  }`}
                >
                  {fileIcon(f.file.name, f.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[0.82rem] font-semibold truncate ${isFailed ? "text-[#E53535]" : dark ? "text-white" : "text-[#111]"}`}>
                    {f.file.name}
                  </p>
                  <p className={`text-[0.72rem] mt-0.5 ${isFailed ? "text-[#E53535]" : dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>
                    {isFailed ? f.errorMsg : `${t("step3.complete")} · ${fmtSize(f.file.size)}`}
                  </p>
                  {!isFailed && (
                    <div className={`h-0.5 rounded mt-1.5 ${dark ? "bg-[#2A2A2A]" : "bg-[#E5E5E5]"}`}>
                      <div className="h-full bg-[rgba(148,211,193,1)] rounded" style={{ width: `${f.progress}%` }} />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className={`bg-transparent border-none cursor-pointer p-1 ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}
                >
                  <MdDelete size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {attempted && files.filter((f) => f.status === "success").length === 0 && (
        <p className="text-[0.78rem] text-[#E53535]">يرجى رفع ملف صحيح واحد على الأقل للمتابعة.</p>
      )}
    </div>
  );
}

// ─── Step4 ────────────────────────────────────────────────────
function Step4({ t, dark, form, files }) {
  const cardCls = `border rounded-xl p-5 ${dark ? "bg-[#141414] border-[#262626]" : "bg-white border-[#E5E5E5]"}`;
  const innerCardCls = `border rounded-xl p-4 ${dark ? "bg-[#0D0D0D] border-[#222222]" : "bg-[#F9F9F9] border-[#E5E5E5]"}`;
  const budgetFormatted = form.totalBudget ? Number(form.totalBudget).toLocaleString() : "0";
  const iconColorClass = dark ? "text-[#94D3C1]" : "text-[#FF8C00]";
  const validFiles = files.filter((f) => f.status === "success");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className={`md:col-span-7 flex flex-col justify-between ${cardCls}`}>
          <div>
            <div className="flex items-center gap-2 mb-5">
              <MdInfoOutline size={20} className={iconColorClass} />
              <span className={`text-xs font-semibold ${dark ? "text-white" : "text-[#111]"}`}>{t("step4.identity")}</span>
            </div>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="flex flex-col gap-1">
                <span className={`text-xs ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>{t("step4.campaignName")}</span>
                <span className={`text-sm font-semibold ${dark ? "text-white" : "text-[#111]"}`}>
                  {form.name || "-"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-xs ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>النوع</span>
                <span className={`text-sm font-semibold ${dark ? "text-white" : "text-[#111]"}`}>
                  {form.contentType || "-"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-xs ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>{t("step4.startDate")}</span>
                <span className={`text-sm font-semibold ${dark ? "text-white" : "text-[#111]"}`}>
                  {form.startDate || "-"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-xs ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>{t("step4.endDate")}</span>
                <span className={`text-sm font-semibold ${dark ? "text-white" : "text-[#111]"}`}>
                  {form.endDate || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`md:col-span-5 flex flex-col justify-between ${cardCls}`}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MdAccountBalanceWallet size={20} className={iconColorClass} />
              <span className={`text-xs font-semibold ${dark ? "text-white" : "text-[#111]"}`}>{t("step4.budget")}</span>
            </div>
            <div className="flex flex-col gap-1 my-2">
              <span className={`text-xs ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>إجمالي ميزانية الحملة</span>
              <p className="text-3xl font-bold text-[#FF8C00] tracking-tight">${budgetFormatted}</p>
            </div>
          </div>
          <div className={`w-full flex justify-between items-center border-t pt-3 mt-4 ${dark ? "border-[#222222]" : "border-[#E5E5E5]"}`}>
            <span className={`text-xs ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>{t("step4.reach")}</span>
            <span className={`text-xs font-semibold ${dark ? "text-white" : "text-[#111]"}`}>CPM: ${form.cpm || "0"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className={`md:col-span-7 flex flex-col justify-between ${cardCls}`}>
          <div className="flex items-center gap-2 mb-4">
            <MdFolder size={20} className={iconColorClass} />
            <span className={`text-xs font-semibold ${dark ? "text-white" : "text-[#111]"}`}>{t("step4.assets")}</span>
          </div>
          <div className={innerCardCls}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className={`text-sm font-bold ${dark ? "text-white" : "text-[#111]"}`}>
                  تم رفع {validFiles.length} أصول
                </span>
                <span className={`text-xs ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>
                  {validFiles.map((f) => f.file.name).join("، ")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex -space-x-2 space-x-reverse items-center">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${dark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-[#DDD]"}`}>
                    <MdImage size={18} className={iconColorClass} />
                  </div>
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${dark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-[#DDD]"}`}>
                    <MdPlayCircle size={18} className={iconColorClass} />
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

        <div className={`md:col-span-5 flex flex-col justify-between ${cardCls}`}>
          <div className="flex items-center gap-2 mb-4">
            <MdGpsFixed size={20} className={iconColorClass} />
            <span className={`text-xs font-semibold ${dark ? "text-white" : "text-[#111]"}`}>{t("step4.targeting")}</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <MdPublic size={18} className={`mt-0.5 shrink-0 ${dark ? "text-[#9A9A9A]" : "text-[#FF8C00]"}`} />
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs font-semibold ${dark ? "text-white" : "text-[#111]"}`}>
                  الجمهور المستهدف
                </span>
                <span className={`text-[0.7rem] ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── تحميل بيانات المسودة عند فتح الرابط للتعديل ───────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlDraftId = new URLSearchParams(window.location.search).get("draftId");
    if (!urlDraftId) return;

    setDraftId(urlDraftId);
    async function loadDraftData() {
      try {
        const res = await getDraftById(urlDraftId);
        const d = res?.draft || res?.campaign || res;
        if (d) {
          setForm({
            name: d.name || d.title || "",
            totalBudget: d.totalBudget ? String(d.totalBudget) : "",
            cpm: d.cpm ? String(d.cpm) : "",
            startDate: d.startDate ? d.startDate.split("T")[0] : "",
            endDate: d.endDate ? d.endDate.split("T")[0] : "",
            contentType: d.contentType || d.category || "",
            category: d.category || d.contentType || "",
            audience: d.brief?.audience || d.audience || "",
            subCategories: d.subCategories || [],
            targetCountries: d.targetCountries || [],
            brief: {
              mainIdea: d.brief?.mainIdea || "",
              tone: d.brief?.tone || "",
              keyMessages: d.brief?.keyMessages || "",
              keywords: d.brief?.keywords || [],
              visualReferences: d.brief?.visualReferences || "",
            },
          });
          if (d.brief?.mainIdea || d.description) {
            setDescription(d.brief?.mainIdea || d.description || "");
          }
          if (d.halalDeclared || d.halalDeclaration) {
            const h = typeof d.halalDeclaration === "object" ? d.halalDeclaration : {};
            setChecked({
              noGambling: h.noGambling ?? true,
              noSexualContent: h.noSexualContent ?? true,
              noExplicitMusic: h.noExplicitMusic ?? true,
              noAlcohol: h.noAlcohol ?? true,
              noSuspiciousCurrencies: h.noSuspiciousCurrencies ?? true,
              noUnrealisticProfit: h.noUnrealisticProfit ?? true,
            });
          }
        }
      } catch (err) {
        console.warn("Failed to load draft data:", err);
      }
    }
    loadDraftData();
  }, []);

  const step1Valid = Boolean(form.name.trim() && form.totalBudget && form.cpm && form.startDate && form.endDate && form.contentType);
  const step2Valid = Object.values(checked).every(Boolean) && Boolean(description.trim());
  const step3Valid = files.some((f) => f.status === "success");

  const canNext = () => [step1Valid, step2Valid, step3Valid, true][step - 1];

  const handleSaveDraft = async () => {
    const payload = {
      name: form.name,
      contentType: form.contentType || undefined,
      category: form.category || undefined,
      totalBudget: form.totalBudget ? Number(form.totalBudget) : undefined,
      cpm: form.cpm ? Number(form.cpm) : undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      targetCountries: form.targetCountries,
      brief: {
        ...form.brief,
        mainIdea: description || form.brief.mainIdea,
        audience: form.audience,
      },
      halalDeclared: Object.values(checked).every(Boolean),
    };

    try {
      if (draftId) {
        await autoSaveDraft(draftId, payload);
      } else {
        const res = await saveDraft(payload);
        if (res?.data?.draft?._id) {
          setDraftId(res.data.draft._id);
        }
      }
    } catch (err) {
      console.error("خطأ في حفظ المسودة:", err);
    } finally {
      router.push("/advertiser/drafts");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (draftId) {
        const res = await submitDraft(draftId);
        if (res.success === "true") {
          alert("تم إرسال الحملة للمراجعة ✅");
        } else {
          alert(res.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("contentType", form.contentType);
        formData.append("category", form.contentType);
        formData.append("totalBudget", form.totalBudget);
        formData.append("cpm", form.cpm);
        formData.append(
          "brief",
          JSON.stringify({
            ...form.brief,
            mainIdea: description || form.brief.mainIdea,
            audience: form.audience,
          })
        );
        formData.append("targetCountries", JSON.stringify(form.targetCountries));
        formData.append("halalDeclaration", JSON.stringify(checked));

        // فقط إرسال الملفات المقبولة للـ API
        const validFiles = files.filter((f) => f.status === "success");
        validFiles.forEach((f) => formData.append("files", f.file));

        const res = await createCampaign(formData);
        if (res.success === "true") {
          alert("تم إرسال الحملة ✅");
        } else {
          alert(res.message);
        }
      }
    } catch (err) {
      console.error("خطأ في الإرسال:", err);
      alert("حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!canNext()) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    setAttempted(false);
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    if (step === 1) return <Step1 t={t} dark={dark} isRtl={isRtl} form={form} setForm={setForm} attempted={attempted} />;
    if (step === 2)
      return (
        <Step2
          t={t}
          dark={dark}
          checked={checked}
          setChecked={setChecked}
          attempted={attempted}
          description={description}
          setDescription={setDescription}
        />
      );
    if (step === 3)
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
    return <Step4 t={t} dark={dark} form={form} files={files} />;
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen p-8 transition-colors ${dark ? "bg-[#0A0A0A]" : "bg-[#F4F5F7]"}`}
      style={{ fontFamily: "var(--font-tajawal,inherit)" }}
    >
      {/* Stepper */}
      <div className="flex items-start justify-between w-full mb-9" style={{ direction: isRtl ? "rtl" : "ltr" }}>
        {STEP_IDS.map((id, idx) => {
          const done = id < step;
          const active = id === step;
          return (
            <React.Fragment key={id}>
              {idx > 0 && (
                <div
                  className={`flex-1 h-0.5 mt-5 mx-2 ${
                    id <= step ? "bg-[rgba(148,211,193,1)]" : dark ? "bg-[#2D2D2D]" : "bg-[#E5E5E5]"
                  }`}
                />
              )}
              <div className="flex flex-col items-center gap-1 shrink-0 min-w-[60px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${
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
        className={`border rounded-2xl p-9 w-full max-w-[1401px] mx-auto box-border shadow-[0px_4px_30px_0px_rgba(0,0,0,0.1)] backdrop-blur-[20px] transition-colors
        ${dark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]" : "bg-white border-[#E5E5E5]"}`}
      >
        <div className={`mb-7 ${isRtl ? "text-right" : "text-left"}`}>
          <h1 className={`text-[1.4rem] font-bold mb-1.5 ${dark ? "text-white" : "text-[#111]"}`}>
            {t(`titles.t${step}`)}
          </h1>
          <p className={`text-sm ${dark ? "text-[#9A9A9A]" : "text-[#666]"}`}>{t(`subtitles.s${step}`)}</p>
        </div>

        {renderStep()}

        <div className="flex justify-between items-center mt-8 flex-wrap gap-3">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold border bg-transparent cursor-pointer
                  ${dark ? "border-[#2D2D2D] text-white" : "border-[#E5E5E5] text-[#111]"}`}
                style={{ fontFamily: "var(--font-tajawal,inherit)" }}
              >
                {t("nav.back")}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold border bg-transparent cursor-pointer
                ${dark ? "border-[#2D2D2D] text-white" : "border-[#E5E5E5] text-[#111]"}`}
              style={{ fontFamily: "var(--font-tajawal,inherit)" }}
            >
              {t("nav.saveDraft")}
            </button>
            <button
              type="button"
              onClick={step === 4 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer border border-transparent flex items-center gap-2 disabled:opacity-60"
              style={{
                background: "linear-gradient(108.21deg,#FF9900 0%,#FF5603 100%)",
                fontFamily: "var(--font-tajawal,inherit)",
              }}
            >
              {step === 4 ? (isSubmitting ? "جارٍ الإرسال..." : t("nav.submit")) : t("nav.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
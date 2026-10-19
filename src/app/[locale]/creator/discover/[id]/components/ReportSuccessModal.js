"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  MdClose,
  MdCheckCircleOutline,
  MdTag,
  MdOutlineCalendarToday,
  MdOutlineCampaign,
  MdOutlinePauseCircleOutline,
  MdOutlineSchedule,
  MdOutlineShield,
  MdArrowBack,
  MdArrowForward,
} from "react-icons/md";

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";
const REPORT_REASONS = new Set([
  "INDECENT_CONTENT",
  "GAMBLING",
  "FORBIDDEN_MUSIC",
  "SUSPICIOUS_CURRENCY",
  "FALSE_PROFIT_CLAIMS",
  "OTHER",
]);

function getTokens(isDark) {
  return isDark
    ? {
        overlay: "rgba(0,0,0,0.65)",
        card: "#141717",
        border: "rgba(255,255,255,0.08)",
        inner: "#1B1E1E",
        innerBorder: "rgba(255,255,255,0.07)",
        iconBg: "rgba(255,255,255,0.05)",
        text: "#FFFFFF",
        sub: "#9A9A9A",
        accent: "#94D3C1",
        gold: "#E9C349",
        orange: "#FFA600",
        success: "#22C55E",
        successBg: "rgba(34,197,94,0.12)",
        dangerBg: "rgba(185,28,28,0.45)",
        dangerText: "#FCA5A5",
        noticeBg: "rgba(20,70,52,0.45)",
        noticeBorder: "rgba(148,211,193,0.35)",
      }
    : {
        overlay: "rgba(15,23,42,0.45)",
        card: "#FFFFFF",
        border: "rgba(0,0,0,0.1)",
        inner: "#F3F6F5",
        innerBorder: "rgba(0,0,0,0.08)",
        iconBg: "rgba(0,0,0,0.04)",
        text: "#0F172A",
        sub: "#64748B",
        accent: "#1C6B58",
        gold: "#B7791F",
        orange: "#EA7A00",
        success: "#16A34A",
        successBg: "rgba(34,197,94,0.14)",
        dangerBg: "rgba(220,38,38,0.12)",
        dangerText: "#B91C1C",
        noticeBg: "rgba(148,211,193,0.22)",
        noticeBorder: "rgba(28,107,88,0.35)",
      };
}

function ModalContent({
  reference,
  campaignCode,
  campaignName,
  reason,
  onClose,
  onContinue,
}) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const s = useTranslations("reportSuccess");
  const isRtl = locale === "ar";
  const t = getTokens(isDark);
  const ArrowIcon = isRtl ? MdArrowBack : MdArrowForward;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[2147483000] flex items-center justify-center overflow-y-auto p-3 sm:p-6"
      style={{ background: t.overlay, backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-success-title"
        dir={isRtl ? "rtl" : "ltr"}
        className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[560px] flex-col items-center gap-3 overflow-y-auto rounded-2xl border p-4 pt-8 text-center sm:p-6 sm:pt-10 ${
          isRtl
            ? "min-[1280px]:-translate-x-[130px]"
            : "min-[1280px]:translate-x-[130px]"
        }`}
        style={{
          background: t.card,
          borderColor: t.border,
          color: t.text,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button
          type="button"
          aria-label={s("close")}
          onClick={onClose}
          className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border transition-opacity hover:opacity-70"
          style={{ background: t.iconBg, borderColor: t.border, color: t.text }}
        >
          <MdClose size={16} />
        </button>

        {/* الأيقونة والعناوين */}
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: t.iconBg }}
        >
          <MdCheckCircleOutline size={30} color={t.success} />
        </span>

        <h2
          id="report-success-title"
          className="text-xl font-extrabold sm:text-2xl"
        >
          {s("title")}
        </h2>
        <p className="text-sm font-bold" style={{ color: t.gold }}>
          {s("subtitle")}
        </p>
        <p className="max-w-md text-[11px] leading-5" style={{ color: t.sub }}>
          {s("desc")}
        </p>

        {/* التفاصيل */}
        <div
          className="flex w-full flex-col gap-2.5 rounded-xl border p-3 text-start"
          style={{ background: t.inner, borderColor: t.innerBorder }}
        >
          {/* رمز المرجع + التاريخ */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: t.iconBg }}
              >
                <MdTag size={16} color={t.orange} />
              </span>
              <div className="flex flex-col">
                <span className="text-[10px]" style={{ color: t.sub }}>
                  {s("refLabel")}
                </span>
                <span
                  className="text-sm font-extrabold"
                  style={{ color: t.gold }}
                  dir="ltr"
                >
                  {reference}
                </span>
              </div>
            </div>

            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px]"
              style={{ background: t.iconBg, color: t.sub }}
            >
              <MdOutlineCalendarToday size={12} />
              {s("dateChip")}
            </span>
          </div>

          {/* الحملة المبلغ عنها */}
          <div
            className="flex flex-col gap-1.5 rounded-lg border p-2.5"
            style={{ borderColor: t.innerBorder, background: t.card }}
          >
            <span className="text-[10px]" style={{ color: t.sub }}>
              {s("campaignLabel")}
            </span>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 text-xs font-bold">
                <MdOutlineCampaign
                  size={15}
                  color={t.accent}
                  className="shrink-0"
                />
                <span className="min-w-0">
                  {campaignCode ? `${campaignCode} - ` : ""}
                  {campaignName}
                </span>
              </span>
              {REPORT_REASONS.has(reason) && (
                <span
                  className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: t.dangerBg, color: t.dangerText }}
                >
                  {s(`reasons.${reason}`)}
                </span>
              )}
            </div>
          </div>

          {/* الحالة + الوقت المتوقع */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div
              className="flex items-center justify-between gap-2 rounded-lg border p-2.5"
              style={{ borderColor: t.innerBorder, background: t.card }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px]" style={{ color: t.sub }}>
                  {s("statusLabel")}
                </span>
                <span className="text-xs font-bold" style={{ color: t.orange }}>
                  {s("statusValue")}
                </span>
              </div>
              <MdOutlinePauseCircleOutline size={20} color={t.sub} />
            </div>

            <div
              className="flex items-center justify-between gap-2 rounded-lg border p-2.5"
              style={{ borderColor: t.innerBorder, background: t.card }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px]" style={{ color: t.sub }}>
                  {s("etaLabel")}
                </span>
                <span className="text-xs font-bold" style={{ color: t.accent }}>
                  {s("etaValue")}
                </span>
              </div>
              <MdOutlineSchedule size={20} color={t.gold} />
            </div>
          </div>

          {/* الإجراء الاحترازي */}
          <div
            className="flex items-start gap-2 rounded-lg border p-2.5 text-[11px] leading-5"
            style={{ background: t.noticeBg, borderColor: t.noticeBorder }}
          >
            <MdOutlineShield
              size={16}
              color={t.accent}
              className="mt-0.5 shrink-0"
            />
            <p style={{ color: t.sub }}>
              <b style={{ color: t.accent }}>{s("noticeTitle")}</b>{" "}
              {s("noticeBody")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-8 text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: ORANGE }}
        >
          {s("cta")}
          <ArrowIcon size={15} />
        </button>
      </div>
    </div>
  );
}

export default function ReportSuccessModal({ open, ...props }) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(<ModalContent {...props} />, document.body);
}

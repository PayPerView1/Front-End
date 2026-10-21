"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  MdClose,
  MdOutlineVerifiedUser,
  MdOutlineCampaign,
  MdCheckCircle,
  MdOutlineTune,
  MdOutlineVisibilityOff,
  MdOutlineCasino,
  MdOutlineMusicOff,
  MdOutlineCurrencyExchange,
  MdOutlineTrendingDown,
  MdOutlineGavel,
  MdOutlineNotes,
  MdOutlineLink,
  MdOutlineShield,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import ReportSuccessModal from "./ReportSuccessModal";

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

// القيم هي اللي بتنبعت للباك، عدّلها حسب الـ API
const REASONS = [
  { id: "INDECENT_CONTENT", key: "indecent", icon: MdOutlineVisibilityOff },
  { id: "GAMBLING", key: "gambling", icon: MdOutlineCasino },
  { id: "FORBIDDEN_MUSIC", key: "music", icon: MdOutlineMusicOff },
  { id: "SUSPICIOUS_CURRENCY", key: "crypto", icon: MdOutlineCurrencyExchange },
  {
    id: "FALSE_PROFIT_CLAIMS",
    key: "fraud",
    icon: MdOutlineTrendingDown,
    full: true,
  },
  { id: "OTHER", key: "other", icon: MdOutlineGavel, full: true },
];

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
        accentBg: "rgba(148,211,193,0.08)",
        accentBorder: "rgba(148,211,193,0.55)",
        badgeBg: "rgba(20,70,52,0.7)",
        danger: "#F87171",
        secondary: "rgba(40, 42, 43, 1)",
        secondaryText: "#E1E3E4",
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
        accentBg: "rgba(148,211,193,0.22)",
        accentBorder: "rgba(28,107,88,0.55)",
        badgeBg: "rgba(148,211,193,0.35)",
        danger: "#DC2626",
        secondary: "#E6ECEA",
        secondaryText: "#334155",
      };
}

function Radio({ t, on }) {
  return (
    <span
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
      style={{ border: `2px solid ${on ? t.accent : t.sub}` }}
    >
      {on && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: t.accent }}
        />
      )}
    </span>
  );
}

function ModalContent({ campaign, onClose, onSubmit }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const tr = useTranslations("reportViolation");
  const isRtl = locale === "ar";
  const t = getTokens(isDark);
  const router = useRouter();
  const [result, setResult] = useState(null);

  const [reason, setReason] = useState(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  // Esc للإغلاق + منع سكرول الصفحة خلف النافذة
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [submitting, onClose]);

  const appendLink = () => {
    setDetails((d) => `${d && !d.endsWith("\n") ? `${d}\n` : d}https://`);
    textareaRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!reason || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await onSubmit?.({
        campaignId: campaign?.id,
        reason,
        details: details.trim(),
      });
      setResult({
        ref:
          res?.reference ??
          `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        reason,
      });
    } catch (e) {
      setError(e?.message || tr("error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <ReportSuccessModal
      open
      reference={result.ref}
      reason={result.reason}
      campaignCode={
        campaign?.code ??
        (campaign?.id ? `#${String(campaign.id).toUpperCase()}` : "")
      }
      campaignName={campaign?.name}
      onClose={onClose}
      onContinue={() => {
        onClose?.();
        router.push(`/${locale}/creator/discover`);
      }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[2147483000] flex items-center justify-center overflow-y-auto p-3 sm:p-6"
      style={{ background: t.overlay, backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        dir={isRtl ? "rtl" : "ltr"}
        className={`flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[560px] flex-col gap-2 overflow-y-auto rounded-xl border p-2.5 sm:p-3 ${
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
        {/* الهيدر */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-label={tr("close")}
            onClick={onClose}
            disabled={submitting}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-opacity hover:opacity-70 disabled:opacity-40"
            style={{
              background: t.iconBg,
              borderColor: t.border,
              color: t.text,
            }}
          >
            <MdClose size={16} />
          </button>

          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border"
            style={{ background: t.iconBg, borderColor: t.border }}
          >
            <MdOutlineVerifiedUser size={15} color={t.accent} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="report-title"
              className="text-sm font-extrabold leading-snug sm:text-base"
            >
              {tr("title")}
            </h2>
            <p className="mt-0.5 text-xs leading-5" style={{ color: t.sub }}>
              {tr("subtitle")}
            </p>
          </div>
        </div>

        {/* الحملة المحددة */}
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="flex items-center gap-2 rounded-xl border p-2"
          style={{ background: t.inner, borderColor: t.innerBorder }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: t.iconBg, borderColor: t.border }}
          >
            <MdOutlineCampaign size={16} color="#E9C349" />
          </div>
          <p className="min-w-0 flex-1 truncate text-sm font-medium">
            {campaign?.name}
          </p>
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold"
            style={{ background: t.badgeBg, color: t.accent }}
          >
            {tr("autoSelected")}
            <MdCheckCircle size={12} />
          </span>
        </div>

        {/* نوع المخالفة */}
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm font-bold">
            <MdOutlineTune size={16} color={t.sub} />
            <span>
              {tr("chooseType")}
              <span style={{ color: t.danger }}> *</span>
            </span>
          </p>

          <div
            role="radiogroup"
            aria-label={tr("chooseType")}
            className="grid grid-cols-1 gap-1.5 sm:grid-cols-2"
          >
            {REASONS.map((r) => {
              const on = reason === r.id;
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setReason(r.id)}
                  className={`flex items-start gap-2 rounded-xl border p-2 text-start transition-all hover:brightness-110 ${
                    r.full ? "sm:col-span-2" : ""
                  }`}
                  style={{
                    background: on ? t.accentBg : t.inner,
                    borderColor: on ? t.accentBorder : t.innerBorder,
                  }}
                >
                  <span className="pt-1">
                    <Radio t={t} on={on} />
                  </span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: on ? t.accent : t.iconBg,
                      color: on ? "#0B1F19" : t.sub,
                    }}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold">
                      {tr(`reasons.${r.key}.title`)}
                    </span>
                    <span
                      className="mt-0.5 block text-[10px] leading-4"
                      style={{ color: t.sub }}
                    >
                      {tr(`reasons.${r.key}.desc`)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* التفاصيل */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="report-details"
              className="flex items-center gap-2 text-sm font-bold"
            >
              <MdOutlineNotes size={16} color={t.sub} />
              {tr("detailsLabel")}
            </label>
            <span className="text-[10px]" style={{ color: t.sub }}>
              {tr("detailsHint")}
            </span>
          </div>

          <div
            className="relative rounded-xl border focus-within:border-[#94D3C1]"
            style={{ background: t.inner, borderColor: t.innerBorder }}
          >
            <textarea
              id="report-details"
              ref={textareaRef}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={1000}
              placeholder={tr("detailsPlaceholder")}
              className="block min-h-[64px] w-full resize-none rounded-xl bg-transparent p-2 pb-9 text-xs leading-5 outline-none"
              style={{ color: t.text }}
            />
            <button
              type="button"
              onClick={appendLink}
              className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium transition-opacity hover:opacity-80"
              style={{
                background: t.iconBg,
                borderColor: t.border,
                color: t.sub,
              }}
            >
              <MdOutlineLink size={13} />
              {tr("attachLinks")}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="text-xs font-bold"
            style={{ color: t.danger }}
          >
            {error}
          </p>
        )}

        {/* الأزرار */}
        <div
          className="flex flex-col-reverse gap-2 border-t pt-2 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: t.border }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="inline-flex h-8 items-center justify-center rounded-xl px-5 text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: t.secondary, color: t.secondaryText }}
          >
            {tr("cancel")}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!reason || submitting}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: ORANGE }}
          >
            <MdOutlineShield size={16} />
            {submitting ? tr("sending") : tr("send")}
          </button>
        </div>
      </div>
    </div>
  );
}

// open=false → ما بنرسم شي. الحالة بتتصفّر تلقائياً بكل فتح.
export default function ReportViolationModal({
  open,
  campaign,
  onClose,
  onSubmit,
}) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <ModalContent campaign={campaign} onClose={onClose} onSubmit={onSubmit} />,
    document.body,
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  MdClose,
  MdOutlineVerifiedUser,
  MdOutlinePayments,
  MdOutlineShield,
} from "react-icons/md";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

const PLATFORM_ICONS = {
  instagram: { icon: FaInstagram, color: "#E1306C" },
  tiktok: { icon: FaTiktok, color: "#FFFFFF" },
  youtube: { icon: FaYoutube, color: "#FF0000" },
  facebook: { icon: FaFacebookF, color: "#1877F2" },
  x: { icon: FaXTwitter, color: "#E7E9EA" },
};

function ModalContent({ campaign, onClose, onConfirm }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const s = useTranslations("applyConfirm");
  const isRtl = locale === "ar";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const t = isDark
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
        noticeBg: "rgba(20,70,52,0.45)",
        noticeBorder: "rgba(148,211,193,0.35)",
        secondary: "rgba(40, 42, 43, 1)",
        secondaryText: "#E1E3E4",
        danger: "#F87171",
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
        noticeBg: "rgba(148,211,193,0.22)",
        noticeBorder: "rgba(28,107,88,0.35)",
        secondary: "#E6ECEA",
        secondaryText: "#334155",
        danger: "#DC2626",
      };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [submitting, onClose]);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await onConfirm?.(campaign);
      onClose?.();
    } catch (e) {
      setError(e?.message || s("error"));
      setSubmitting(false);
    }
  };

  const cpm = Number(campaign?.cpm ?? 0).toString();

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
        aria-labelledby="apply-title"
        dir={isRtl ? "rtl" : "ltr"}
        className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] flex-col gap-3 overflow-y-auto rounded-2xl border p-4 pt-12 sm:p-5 sm:pt-12 ${
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
          disabled={submitting}
          className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border transition-opacity hover:opacity-70 disabled:opacity-40"
          style={{ background: t.iconBg, borderColor: t.border, color: t.text }}
        >
          <MdClose size={16} />
        </button>

        <div className="flex flex-col gap-1.5">
          <h2
            id="apply-title"
            className="text-base font-extrabold leading-snug sm:text-lg"
          >
            {s("title")}
          </h2>
          <p className="text-[11px] leading-5" style={{ color: t.sub }}>
            {s("desc")}
          </p>
        </div>

        {/* التفاصيل */}
        <div
          className="flex flex-col gap-2 rounded-xl border p-3"
          style={{ background: t.inner, borderColor: t.innerBorder }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px]" style={{ color: t.sub }}>
              {s("campaignName")}
            </span>
            <span className="text-sm font-bold" style={{ color: t.accent }}>
              {campaign?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div
              className="flex items-center justify-between gap-2 rounded-lg border p-2.5"
              style={{ borderColor: t.innerBorder, background: t.card }}
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[10px]" style={{ color: t.sub }}>
                  {s("advertiser")}
                </span>
                <span className="truncate text-xs font-bold">
                  {campaign?.brand}
                </span>
              </div>
              <MdOutlineVerifiedUser
                size={16}
                color={t.accent}
                className="shrink-0"
              />
            </div>

            <div
              className="flex items-center justify-between gap-2 rounded-lg border p-2.5"
              style={{ borderColor: t.innerBorder, background: t.card }}
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[10px]" style={{ color: t.sub }}>
                  {s("cpmLabel")}
                </span>
                <span
                  className="text-[11px] font-bold"
                  style={{ color: t.accent }}
                >
                  {s("cpmValue", { v: cpm })}
                </span>
              </div>
              <MdOutlinePayments
                size={16}
                color={t.accent}
                className="shrink-0"
              />
            </div>
          </div>

          {campaign?.platforms?.length > 0 && (
            <div
              className="flex flex-col gap-1.5 rounded-lg border p-2.5"
              style={{ borderColor: t.innerBorder, background: t.card }}
            >
              <span className="text-[10px]" style={{ color: t.sub }}>
                {s("contentType")}
              </span>
              <span className="flex items-center gap-2.5">
                {campaign.platforms.map((p) => {
                  const cfg = PLATFORM_ICONS[p];
                  if (!cfg) return null;
                  const PIcon = cfg.icon;
                  return (
                    <PIcon
                      key={p}
                      size={14}
                      color={p === "tiktok" && !isDark ? "#111111" : cfg.color}
                    />
                  );
                })}
              </span>
            </div>
          )}
        </div>

        {/* الضمان */}
        <div
          className="flex items-start gap-2 rounded-xl border p-3 text-[11px] leading-5"
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-xl px-5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: ORANGE }}
          >
            {submitting ? s("sending") : s("confirm")}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center rounded-xl px-5 text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: t.secondary, color: t.secondaryText }}
          >
            {s("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplyConfirmModal({ open, ...props }) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(<ModalContent {...props} />, document.body);
}

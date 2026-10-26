"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  MdClose,
  MdPause,
  MdOutlineShield,
  MdBlock,
  MdOutlineLightbulb,
  MdOutlineNotificationsActive,
  MdOutlineNotifications,
  MdOutlineExplore,
} from "react-icons/md";

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

function ModalContent({ campaign, onClose, onExplore, onNotify }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const s = useTranslations("campaignOnHold");
  const isRtl = locale === "ar";

  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);
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
        gold: "#E9C349",
        danger: "#EF4444",
        codeBg: "rgba(255,255,255,0.08)",
        secondary: "rgba(40, 42, 43, 1)",
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
        danger: "#DC2626",
        codeBg: "rgba(0,0,0,0.06)",
        secondary: "#E6ECEA",
      };

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

  const handleNotify = async () => {
    if (notifying || notified) return;
    setNotifying(true);
    setError("");
    try {
      if (!onNotify) throw new Error(s("notifyUnavailable"));
      await onNotify?.(campaign);
      setNotified(true);
    } catch (e) {
      setError(e?.message || s("error"));
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[2147483000] flex items-center justify-center overflow-y-auto p-3 sm:p-6 ${
        isRtl ? "min-[1280px]:right-[260px]" : "min-[1280px]:left-[260px]"
      }`}
      style={{ background: t.overlay, backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="on-hold-title"
        dir={isRtl ? "rtl" : "ltr"}
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[520px] flex-col items-center gap-3 overflow-y-auto rounded-2xl border p-4 pt-10 text-center sm:p-6 sm:pt-12"
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
          className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border transition-opacity hover:opacity-70"
          style={{ background: t.iconBg, borderColor: t.border, color: t.text }}
        >
          <MdClose size={15} />
        </button>

        {/* الأيقونة والعنوان */}
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{ background: t.inner, borderColor: t.innerBorder }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: t.danger }}
          >
            <MdPause size={18} color="#FFFFFF" />
          </span>
        </span>

        <h2 id="on-hold-title" className="text-xl font-bold sm:text-2xl">
          {s("title")}
        </h2>
        <p className="max-w-md text-xs leading-6" style={{ color: t.sub }}>
          {s("desc")}
        </p>

        {/* التفاصيل */}
        <div
          className="flex w-full flex-col gap-2.5 rounded-xl border p-3 text-start"
          style={{ background: t.inner, borderColor: t.innerBorder }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2.5"
            style={{ borderColor: t.innerBorder, background: t.card }}
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[10px]" style={{ color: t.sub }}>
                {s("target")}
              </span>
              <span className="text-sm font-bold">{campaign?.name}</span>
            </div>
            {campaign?.code && (
              <span
                className="rounded px-2 py-1 font-mono text-[10px] font-bold"
                style={{ background: t.codeBg, color: t.sub }}
                dir="ltr"
              >
                {campaign.code}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div
              className="flex items-start justify-between gap-2 rounded-lg border p-2.5"
              style={{ borderColor: t.innerBorder, background: t.card }}
            >
                 <MdOutlineShield
                size={15}
                color={t.accent}
                className="mt-0.5 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold">                {s("reasonLabel")}</span>
                <span className="text-[10px] leading-4" style={{ color: t.sub }}>
                  {s("reasonValue")}
                </span>
              </div>
              
            </div>

            <div
              className="flex items-start justify-between gap-2 rounded-lg border p-2.5"
              style={{ borderColor: t.innerBorder, background: t.card }}
            >
                <MdBlock
                size={15}
                color={t.accent}
                className="mt-0.5 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold">                {s("actionLabel")}</span>
                <span className="text-[10px] leading-4" style={{ color: t.sub }}>
                  {s("actionValue")}
                </span>
              </div>
               
            </div>
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px]"
            style={{ color: t.sub }}
          >
            <span>
              {s("errorCode")}{" "}
              <b className="font-mono" style={{ color: t.gold }} dir="ltr">
                ERR_CAMPAIGN_ON_HOLD
              </b>
            </span>
            <span>{s("status")}</span>
          </div>
        </div>

        {/* ماذا يمكنك أن تفعل */}
        <div
          className="flex w-full flex-col gap-2 rounded-xl border p-3 text-start"
          style={{ background: t.inner, borderColor: t.innerBorder }}
        >
          <p
            className="flex items-center gap-1.5 text-[11px] font-bold"
            style={{ color: t.accent }}
          >
            <MdOutlineLightbulb size={14} />
            {s("tipsTitle")}
          </p>
          <p
            className="flex items-start gap-2 text-[10px] leading-5"
            style={{ color: t.sub }}
          >
            <MdOutlineNotificationsActive
              size={13}
              className="mt-0.5 shrink-0"
            />
            {s("tipNotify")}
          </p>
          <p
            className="flex items-start gap-2 text-[10px] leading-5"
            style={{ color: t.sub }}
          >
            <MdOutlineExplore size={13} className="mt-0.5 shrink-0" />
            {s("tipBrowse")}
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: ORANGE }}
          >
            <MdOutlineExplore size={16} />
            {s("explore")}
          </button>

          <button
            type="button"
            onClick={handleNotify}
            disabled={notifying || notified}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              background: t.secondary,
              borderColor: t.innerBorder,
              color: t.accent,
            }}
          >
            <MdOutlineNotifications size={16} />
            {notified
              ? s("notified")
              : notifying
                ? s("notifying")
                : s("notify")}
          </button>

          {error && (
            <p role="alert" className="text-xs font-bold" style={{ color: t.danger }}>
              {error}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-[11px] transition-opacity hover:opacity-70"
          style={{ color: t.sub }}
        >
          {s("back")}
        </button>
      </div>
    </div>
  );
}

export default function CampaignOnHoldModal({ open, ...props }) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(<ModalContent {...props} />, document.body);
}
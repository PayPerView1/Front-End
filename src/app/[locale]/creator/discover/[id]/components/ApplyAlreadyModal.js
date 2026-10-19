"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import {
  MdClose,
  MdOutlineHowToReg,
  MdOutlineAssignment,
  MdOutlineEvent,
  MdOutlinePayments,
  MdOutlineFactCheck,
  MdArrowBack,
  MdArrowForward,
} from "react-icons/md";

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

function ModalContent({
  application,
  onClose,
  onViewOrders,
  onExplore,
}) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const s = useTranslations("applyAlready");
  const isRtl = locale === "ar";
  const BackIcon = isRtl ? MdArrowForward : MdArrowBack;

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
        goldBg: "rgba(233,195,73,0.15)",
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
        gold: "#B7791F",
        goldBg: "rgba(183,121,31,0.14)",
        secondary: "#E6ECEA",
        secondaryText: "#334155",
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

  let dateText = "";
  if (application?.submittedAt) {
    try {
      dateText = new Intl.DateTimeFormat(
        isRtl ? "ar-u-nu-latn" : "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      ).format(new Date(application.submittedAt));
    } catch {}
  }

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
        aria-labelledby="apply-already-title"
        dir={isRtl ? "rtl" : "ltr"}
        className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[520px] flex-col items-center gap-3 overflow-y-auto rounded-2xl border p-4 pt-10 text-center sm:p-6 sm:pt-12 ${
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
          className="absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border transition-opacity hover:opacity-70"
          style={{ background: t.iconBg, borderColor: t.border, color: t.text }}
        >
          <MdClose size={15} />
        </button>

        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{ background: t.inner, borderColor: t.innerBorder }}
        >
          <MdOutlineHowToReg size={26} color={t.gold} />
        </span>

        <h2 id="apply-already-title" className="text-xl font-bold sm:text-2xl">
          {s("title")}
        </h2>
        <p className="max-w-md text-[11px] leading-5" style={{ color: t.sub }}>
          {s("desc")}
        </p>

        {/* تفاصيل الطلب */}
        <div
          className="flex w-full flex-col gap-2.5 rounded-xl border p-3 text-start"
          style={{ background: t.inner, borderColor: t.innerBorder }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="flex items-center gap-1.5 text-[11px] font-bold"
              style={{ color: t.accent }}
            >
              <MdOutlineAssignment size={15} />
              {s("activeRequest")}
            </span>
            {application?.ref && (
              <span
                className="rounded px-2 py-0.5 font-mono text-[10px] font-bold"
                style={{ background: t.goldBg, color: t.gold }}
                dir="ltr"
              >
                #{application.ref}
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[10px]" style={{ color: t.sub }}>
                {s("campaignName")}
              </span>
              <span className="text-sm font-bold">
                {application?.campaignName}
              </span>
            </div>
            {application?.campaignCode && (
              <span
                className="shrink-0 font-mono text-[10px]"
                style={{ color: t.sub }}
                dir="ltr"
              >
                {application.campaignCode}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <MdOutlineEvent
                size={15}
                color={t.sub}
                className="mt-0.5 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px]" style={{ color: t.sub }}>
                  {s("submittedAt")}
                </span>
                <span className="text-[11px] font-bold">{dateText}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MdOutlinePayments
                size={15}
                color={t.accent}
                className="mt-0.5 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px]" style={{ color: t.sub }}>
                  {s("expectedCpm")}
                </span>
                <span
                  className="text-[11px] font-bold"
                  style={{ color: t.accent }}
                  dir="ltr"
                >
                  ${Number(application?.cpm ?? 0).toFixed(2)} CPM
                </span>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2"
            style={{ borderColor: t.innerBorder, background: t.card }}
          >
            <span
              className="flex items-center gap-1.5 text-[10px]"
              style={{ color: t.sub }}
            >
              <MdOutlineFactCheck size={14} />
              {s("currentStatus")}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold"
              style={{ background: t.goldBg, color: t.gold }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: t.gold }}
              />
              {application?.status ?? s("status")}
            </span>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              if (onViewOrders) onViewOrders();
              else router.push(`/${locale}/creator/dashboard`);
            }}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: ORANGE }}
          >
            {s("viewOrders")}
          </button>

          <button
            type="button"
            onClick={onExplore}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
            style={{ background: t.secondary, color: t.secondaryText }}
          >
            {s("explore")}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-medium transition-opacity hover:opacity-80"
            style={{ background: t.secondary, color: t.sub }}
          >
            <BackIcon size={14} />
            {s("back")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplyAlreadyModal({ open, ...props }) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(<ModalContent {...props} />, document.body);
}
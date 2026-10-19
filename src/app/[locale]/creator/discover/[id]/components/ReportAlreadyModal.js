"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  MdClose,
  MdOutlineSchedule,
  MdArrowBack,
  MdArrowForward,
} from "react-icons/md";

const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

function ModalContent({ onClose, onContinue }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const s = useTranslations("reportAlready");
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? MdArrowBack : MdArrowForward;

  const t = isDark
    ? {
        overlay: "rgba(0,0,0,0.65)",
        card: "#141717",
        border: "rgba(255,255,255,0.08)",
        iconBg: "rgba(255,255,255,0.05)",
        text: "#FFFFFF",
        sub: "#9A9A9A",
        gold: "#E9C349",
        accent: "#94D3C1",
      }
    : {
        overlay: "rgba(15,23,42,0.45)",
        card: "#FFFFFF",
        border: "rgba(0,0,0,0.1)",
        iconBg: "rgba(0,0,0,0.04)",
        text: "#0F172A",
        sub: "#64748B",
        gold: "#B7791F",
        accent: "#1C6B58",
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
        aria-labelledby="report-already-title"
        dir={isRtl ? "rtl" : "ltr"}
        className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[520px] flex-col items-center gap-3 overflow-y-auto rounded-2xl border p-5 pt-10 text-center sm:p-8 sm:pt-12 ${
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

        <span
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: t.iconBg }}
        >
          <MdOutlineSchedule size={28} color={t.gold} />
        </span>

        <h2
          id="report-already-title"
          className="text-xl font-extrabold sm:text-2xl"
        >
          {s("title")}
        </h2>

        <p className="text-xs font-bold" style={{ color: t.gold }}>
          {s("subtitle")}
        </p>

        <p className="max-w-sm text-[11px] leading-5" style={{ color: t.sub }}>
          {s("descBefore")} <b style={{ color: t.text }}>{s("descBold")}</b>{" "}
          {s("descAfter")}
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-8 text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: ORANGE }}
        >
          {s("cta")}
          <ArrowIcon size={15} />
        </button>
      </div>
    </div>
  );
}

export default function ReportAlreadyModal({ open, ...props }) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(<ModalContent {...props} />, document.body);
}

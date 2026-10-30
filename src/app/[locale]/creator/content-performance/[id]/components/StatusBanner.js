"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import ExplanationModal from "./ExplanationModal";
import { useTheme } from "@/context/ThemeContext";
import {
  FiAlertTriangle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiCalendar,
  FiActivity,
  FiShield,
} from "react-icons/fi";

const darkTheme = {
  anomaly:
    "border-transparent bg-[linear-gradient(90deg,#191C1D_0%,#1D2021_50%,#191C1D_100%)]",
  anomalyIcon: "border-[#E9C349]/30 bg-[#E9C349]/10 text-[#E9C349]",
  waiting: "border-black bg-[#191C1D]",
  waitingIcon: "border-white/10 bg-white/5 text-[#8FE3C8]",
  error: "border-[#F87171]/30 bg-[#F87171]/5",
  errorIcon: "border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]",
  title: "text-white",
  muted: "text-gray-400",
  time: "border-white/10 text-gray-400",
  timeValue: "text-white",
  tag: "border-[#E9C349]/30 bg-[#E9C349]/10 text-[#E9C349]",
  metaLine: "border-white/5",
  metaValue: "text-white",
  metaWarn: "text-[#E9C349]",
  metaMint: "text-[#8FE3C8]",
};

const lightTheme = {
  anomaly: "border-transparent bg-white",
  anomalyIcon: "border-[#D9A400]/40 bg-[#D9A400]/10 text-[#B7860B]",
  waiting: "border-[#E5E7E7] bg-white shadow-sm",
  waitingIcon: "border-[#E5E7E7] bg-[#EEF3F2] text-[#2F9E83]",
  error: "border-[#F87171]/40 bg-[#F87171]/5",
  errorIcon: "border-[#F87171]/40 bg-[#F87171]/10 text-[#DC2626]",
  title: "text-[#1A1A1A]",
  muted: "text-[#666666]",
  time: "border-[#E5E7E7] text-[#666666]",
  timeValue: "text-[#1A1A1A]",
  tag: "border-[#D9A400]/40 bg-[#D9A400]/10 text-[#B7860B]",
  metaLine: "border-[#E5E7E7]",
  metaValue: "text-[#1A1A1A]",
  metaWarn: "text-[#B7860B]",
  metaMint: "text-[#2F9E83]",
};

const icons = {
  anomaly: FiAlertTriangle,
  waiting: FiClock,
  error: FiAlertCircle,
};

export default function StatusBanner({ status, clip }) {
  const tr = useTranslations("contentPerformance.details.status");
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  const Icon = icons[status];
  if (!Icon) return null;
  const anomaly = status === "anomaly";
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-start md:justify-between ${t[status]}`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${t[`${status}Icon`]}`}
        >
          <Icon size={20} />
        </span>

        <div className="space-y-2">
          <h2 className={`text-lg font-extrabold ${t.title}`}>
            {tr(`${status}.title`)}
          </h2>

          {anomaly && (
            <span
              className={`flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] ${t.tag}`}
            >
              {tr("anomaly.tag")}
            </span>
          )}

          <p className={`max-w-3xl text-sm leading-7 ${t.muted}`}>
            {tr(`${status}.desc`)}
          </p>

          {anomaly && (
            <div
              className={`flex flex-wrap items-center gap-x-8 gap-y-2 border-t pt-3 text-[11px] ${t.metaLine} ${t.muted}`}
            >
              <span className="flex items-center gap-1.5">
                <FiActivity size={13} />
                {tr("anomaly.meta.eta")}{" "}
                <b className={t.metaValue}>{tr("anomaly.meta.etaValue")}</b>
              </span>

              <span className="flex items-center gap-1.5">
                <FiClock size={13} className={t.metaWarn} />
                {tr("anomaly.meta.detectedAt")} <span>{clip.detectedAt}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <FiShield size={13} className={t.metaMint} />
                {tr("anomaly.meta.patternLabel")}{" "}
                <b className={t.metaValue}>{tr("anomaly.meta.patternValue")}</b>
              </span>
            </div>
          )}
        </div>
      </div>

      {anomaly ? (
        <button
            onClick={() => setOpen(true)}
            className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#FB8B03_0%,#FA6203_100%)] px-4 py-2.5 text-sm font-bold text-white transition"
          >
          <FiFileText size={16} />
          {tr("anomaly.cta")}
        </button>
      ) : (
        <div
          className={`flex w-fit shrink-0 items-center gap-3 rounded-xl border px-3 py-2 text-xs ${t.time}`}
        >
          <FiCalendar size={16} />
          <div className="space-y-0.5">
            <p>{tr("publishTime")}</p>
            <b className={t.timeValue}>{clip.publishedLabel}</b>
          </div>
        </div>
      )}
      {open && <ExplanationModal clip={clip} onClose={() => setOpen(false)} />}
    </div>
  );
}
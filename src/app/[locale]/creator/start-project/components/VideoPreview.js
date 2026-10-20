"use client";

import { useTranslations } from "next-intl";
import {
  Play,
  ExternalLink,
  Undo2,
  MonitorPlay,
  Video,
  BadgeCheck,
  VideoOff,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function VideoPreview({
  link = "",
  image,
  platformLabel = "",
  error = false,
}) {
  const t = useTranslations("startProject.preview");
  const { isDark } = useTheme();

  const surface = isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]";
  const secondary = isDark ? "text-gray-400" : "text-[#5f6a66]";
  const btnBase = isDark
    ? "bg-[#1c2223] border-[#252c2d]"
    : "bg-[#f3f6f5] border-[#d8dfdc]";
  const openBtn = `${btnBase} ${isDark ? "text-gray-200" : "text-[#404945]"}`;
  const withdrawBtn = `${btnBase} ${isDark ? "text-[#FFB4AB]" : "text-red-600"}`;

  const hasLink = Boolean(link.trim()) && !error;
  return (
    <div className={`${surface} border rounded-2xl p-4 space-y-3`}>
      {/* العنوان والشارة */}
      <div className="flex items-center justify-between gap-2">
        <h3
          className={`flex items-center gap-2 text-sm font-bold ${
            isDark ? "text-white" : "text-[#191c1d]"
          }`}
        >
          <Video size={20} className="text-[#94D3C1]" />
          {error ? t("detectedTitle") : t("title")}
        </h3>

        {error ? (
          <span className="flex items-center gap-1 text-[10px] font-bold rounded-full border px-2.5 py-1 border-red-500/40 bg-red-500/10 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {t("failedBadge")}
          </span>
        ) : hasLink ? (
          <span className="flex items-center gap-1 text-[10px] font-bold rounded-full border px-2.5 py-1 border-[#94D3C1]/40 bg-[#94D3C1]/10 text-[#94D3C1]">
            <BadgeCheck size={12} />
            {t("verified", { platform: platformLabel })}
          </span>
                ) : platformLabel ? (
          <span className="flex items-center gap-1 text-[10px] font-bold rounded-full border px-2.5 py-1 border-[#94D3C1]/40 bg-[#94D3C1]/10 text-[#94D3C1]">
            <BadgeCheck size={12} />
            {t("verified", { platform: platformLabel })}
          </span>
        ) : null}
      </div>

      {error ? (
        // هاتف فاضي: تعذر جلب المنشور
        <div
          className={`relative mx-auto w-[210px] aspect-[9/17] rounded-[28px] border-4 flex items-center justify-center ${
            isDark ? "bg-[#0b0e0f] border-[#1c2223]" : "bg-[#eef2f0] border-[#d8dfdc]"
          }`}
        >
          <span
            className={`absolute top-2 w-16 h-1.5 rounded-full ${
              isDark ? "bg-[#1c2223]" : "bg-[#d8dfdc]"
            }`}
          />
          <div className="text-center px-4 space-y-2">
            <span className="mx-auto w-12 h-12 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 flex items-center justify-center">
              <VideoOff size={22} />
            </span>
            <p className={`text-xs font-bold ${isDark ? "text-white" : "text-[#191c1d]"}`}>
              {t("failedTitle")}
            </p>
            <p className={`text-[10px] leading-relaxed ${secondary}`}>{t("failedDesc")}</p>
            <span
              dir="ltr"
              className={`inline-block text-[9px] font-mono rounded-md border px-2 py-1 ${
                isDark ? "border-[#252c2d] bg-[#121617]" : "border-[#d8dfdc] bg-white"
              } ${secondary}`}
            >
              {t("httpError")}
            </span>
          </div>
        </div>
      ) : (
        // معاينة الفيديو (أو حالة فاضية قبل إدخال الرابط)
        <div
          className={`relative w-full h-[260px] sm:h-[340px] min-h-[260px] sm:min-h-[340px] rounded-2xl overflow-hidden border flex items-center justify-center ${
            isDark ? "bg-[#0b0e0f] border-[#252c2d]" : "bg-[#eef2f0] border-[#e1e7e4]"
          }`}
        >
          {hasLink && image ? (
            <>
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover object-top"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <span className="absolute w-14 h-14 rounded-full bg-black/50 flex items-center justify-center text-white">
                <Play size={24} />
              </span>
            </>
          ) : (
            <div className="text-center px-6">
              <MonitorPlay size={36} className={`mx-auto mb-2 ${secondary}`} />
              <p className={`text-xs ${secondary}`}>{t("empty")}</p>
            </div>
          )}
        </div>
      )}

      {/* الأزرار */}
      {hasLink && (
        <div className="grid grid-cols-2 gap-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-1.5 px-2.5 py-3 border rounded-xl text-[11px] font-bold whitespace-nowrap ${openBtn}`}
          >
            <ExternalLink size={14} className="shrink-0 text-[#94D3C1]" />
            {t("openOriginal")}
          </a>
          <button
            type="button"
            className={`flex items-center justify-center gap-1.5 px-2.5 py-3 border rounded-xl text-[11px] font-bold whitespace-nowrap ${withdrawBtn}`}
          >
            <Undo2 size={14} className="shrink-0" />
            {t("withdraw")}
          </button>
        </div>
      )}
    </div>
  );
}
"use client";
import AiResultCard from "./AiResultCard";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  CheckCircle2,
  BadgeCheck,
  Info,
  ShieldCheck,
  Eye,
  MonitorPlay,
  Mic2,
} from "lucide-react";
import ResultShell from "./ResultShell";


export default function ReceivedView({ submission, campaign }) {
  const t = useTranslations("startProject.result");
  const tc = useTranslations("startProject");
  const ts = useTranslations("startProject.submit");
  const locale = useLocale();
  const { isDark } = useTheme();

  const link = submission.link;
  const hashtags = campaign?.hashtags || (campaign ? [campaign.hashtag] : []);

  const theme = {
    surface: isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]",
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    primaryText: isDark ? "text-white" : "text-[#191c1d]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };
  const green = isDark ? "text-[#94D3C1]" : "text-emerald-700";

  return (
    <ResultShell
      tone="success"
      title={t("title")}
      description={t("description")}
      steps={["done", "active", "pending"]}
      link={link}
      image={campaign?.image}
      platformLabel={ts(`platforms.${submission.platform}`)}
    >
      {/* بطاقة الحملة */}
      <div className={`${theme.surface} border rounded-2xl p-5 space-y-5`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {campaign?.image && (
              <img
                src={campaign.image}
                alt=""
                className="w-10 h-10 rounded-xl object-cover border border-[#94D3C1]/30 shrink-0"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div className="min-w-0">
              <p className={`text-[10px] ${green}`}>{t("campaignLabel")}</p>
              <p className={`text-sm font-bold truncate ${theme.primaryText}`}>
                {campaign ? tc(`campaigns.${campaign.title}`) : submission.campaignId}
              </p>
            </div>
          </div>
          <span
            dir="ltr"
            className={`text-[10px] font-mono rounded-lg border px-2.5 py-1 shrink-0 ${theme.inset} ${theme.secondaryText}`}
          >
            #{submission.reference}
          </span>
        </div>

        <div className="space-y-1.5">
  <p className={`text-[10px] ${theme.secondaryText}`}>{t("creatorLink")}</p>
  <div
    className={`flex flex-col items-stretch gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 ${theme.inset}`}
  >
    <span dir="ltr" className={`min-w-0 text-xs font-mono truncate ${theme.primaryText}`}>
      {link || "—"}
    </span>
    <span
      className={`flex items-center justify-center gap-1.5 text-center text-[10px] font-bold rounded-lg border px-3 py-1.5 sm:shrink-0 ${
        isDark
          ? "border-[#94D3C1]/30 bg-[#94D3C1]/10 text-[#94D3C1]"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {t("linkConfirmed")}
      <BadgeCheck size={14} />
    </span>
  </div>
</div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className={`text-xs font-bold ${theme.primaryText}`}>
                {t("hashtagsLabel", { count: hashtags.length })}
            </p>
            <span className="text-[10px] font-bold text-[#94D3C1]">
              {t("hashtagsDone", { done: hashtags.length, total: hashtags.length })}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {hashtags.map((tag) => (
              <div
                key={tag}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-xs font-bold ${theme.inset} ${theme.primaryText}`}
              >
                <CheckCircle2 size={12} className="text-[#94D3C1]" />
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border p-3 flex items-start gap-2 ${theme.inset}`}>
          <Info size={16} className="text-[#E9C349] shrink-0 mt-0.5" />
          <div>
            <p className={`text-xs font-bold mb-0.5 ${theme.primaryText}`}>{t("noteTitle")}</p>
            <p className={`text-[11px] leading-relaxed ${theme.secondaryText}`}>
              {t("noteText")}
            </p>
          </div>
        </div>
      </div>

      {/* نتيجة الفحص الذكي */}
      <AiResultCard score={submission.aiScore} />
    </ResultShell>
  );
}
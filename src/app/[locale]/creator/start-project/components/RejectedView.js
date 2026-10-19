"use client";
import SubmitForm from "./SubmitForm";
import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Music,
  Hash,
  MonitorPlay,
  AtSign,
} from "lucide-react";
import ResultShell from "./ResultShell";

const fixIcons = { audio: Music, hashtag: Hash };

const passedChecks = [
  { key: "videoSpecs", icon: MonitorPlay },
  { key: "mainHashtag", icon: Hash },
  { key: "mention", icon: AtSign },
];

export default function RejectedView({ submission, campaign }) {
  const t = useTranslations("startProject.rejected");
  const tc = useTranslations("startProject");
  const ts = useTranslations("startProject.submit");
  const { isDark } = useTheme();

  const fixes = submission.requiredFixes || [];
  const totalChecks = fixes.length + passedChecks.length;
  const hashtags = campaign?.hashtags || (campaign ? [campaign.hashtag] : []);
  const values = { tag: hashtags[0] || "", account: campaign?.account || "" };

  const theme = {
    surface: isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]",
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    iconBox: isDark ? "bg-[#22282a] text-gray-300" : "bg-[#e6ecea] text-[#404945]",
    danger: isDark
      ? "bg-red-500/5 border-red-500/25"
      : "bg-red-50 border-red-200",
    primaryText: isDark ? "text-white" : "text-[#191c1d]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };

  const redBadge = isDark
    ? "border-red-500/40 bg-red-500/10 text-red-300"
    : "border-red-200 bg-red-50 text-red-700";
  const greenBadge = isDark
    ? "border-emerald-500/30 bg-emerald-500/10 text-#94D3C1"
    : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <ResultShell
      tone="danger"
      title={t("title")}
      description={t("description")}
      steps={["done", "error", "pending"]}
      link={submission.link}
      image={campaign?.image}
      platformLabel={ts(`platforms.${submission.platform}`)}
    >
      <div className={`${theme.surface} border rounded-2xl p-5 space-y-5`}>
        {/* رأس الحملة */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-[10px] ${theme.secondaryText}`}>{tc("result.campaignLabel")}</p>
            <p className={`text-sm font-bold truncate ${theme.primaryText}`}>
              {campaign ? tc(`campaigns.${campaign.title}`) : submission.campaignId}
            </p>
          </div>
          <span
            dir="ltr"
            className={`text-[10px] font-mono rounded-lg border px-2.5 py-1 shrink-0 ${theme.inset} ${theme.secondaryText}`}
          >
            #{submission.reference}
          </span>
        </div>

        {/* عنوان التقرير */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${theme.iconBox}`}>
              <ClipboardCheck size={18} />
            </span>
            <div>
              <p className={`text-sm font-bold ${theme.primaryText}`}>{t("reportTitle")}</p>
              <p className={`text-[10px] ${theme.secondaryText}`}>
                {t("reportSubtitle", { passed: passedChecks.length, total: totalChecks })}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold rounded-full border px-2.5 py-1 ${theme.inset} ${theme.secondaryText}`}>
            {t("instant")}
          </span>
        </div>

        {/* المطلوب تعديله */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={`flex items-center gap-2 text-sm font-bold ${theme.primaryText}`}>
              <AlertTriangle size={16} className="text-red-400" />
              {t("fixesTitle", { count: fixes.length })}
            </p>
            <span className={`text-[10px] font-bold rounded-full border px-2.5 py-1 ${redBadge}`}>
              {t("fixesBadge", { count: fixes.length })}
            </span>
          </div>

          {fixes.map((fix, i) => {
            const Icon = fixIcons[fix.key] || AlertTriangle;
            return (
              <div
                key={fix.key}
                className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${theme.danger}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-600"
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold mb-1 ${theme.primaryText}`}>
                      {i + 1}. {t(`fixes.${fix.key}.title`)}
                    </p>
                    <p className={`text-[11px] leading-relaxed ${theme.secondaryText}`}>
                      {t(`fixes.${fix.key}.desc`, values)}
                    </p>
                  </div>
                </div>
                <XCircle size={18} className="text-red-400 shrink-0" />
              </div>
            );
          })}
        </div>

        {/* ما تم قبوله */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={`flex items-center gap-2 text-sm font-bold ${theme.primaryText}`}>
              <CheckCircle2 size={16} className="text-[#94D3C1]" />
              {t("passedTitle", { count: passedChecks.length })}
            </p>
            <span className={`text-[10px] font-bold rounded-full border px-2.5 py-1 ${greenBadge}`}>
              {t("passedBadge", { count: passedChecks.length })}
            </span>
          </div>

          {passedChecks.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${theme.inset}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${theme.iconBox}`}>
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className={`flex flex-wrap items-center gap-2 text-xs font-bold ${theme.primaryText}`}>
                    {t(`passed.${key}.title`)}
                    <span className={`text-[9px] font-bold rounded-full border px-2 py-0.5 ${greenBadge}`}>
                      {t(`passed.${key}.tag`)}
                    </span>
                  </p>
                  <p className={`text-[10px] ${theme.secondaryText}`}>
                    {t(`passed.${key}.desc`, values)}
                  </p>
                </div>
              </div>
              <CheckCircle2 size={18} className="text-[#94D3C1] shrink-0" />
            </div>
          ))}
        </div>
      </div>

     <SubmitForm campaign={campaign} campaignId={submission.campaignId} />
    </ResultShell>
  );
}
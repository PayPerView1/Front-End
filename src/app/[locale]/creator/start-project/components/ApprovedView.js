"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { MonitorPlay, Mic2, Hash, AtSign, ClipboardCheck, Check } from "lucide-react";
import ResultShell from "./ResultShell";
import AiResultCard from "./AiResultCard";

const checks = [
  { key: "videoSpecs", icon: MonitorPlay },
  { key: "audio", icon: Mic2 },
  { key: "mainHashtag", icon: Hash },
  { key: "secondHashtag", icon: Hash },
  { key: "mention", icon: AtSign },
];

export default function ApprovedView({ submission, campaign }) {
  const t = useTranslations("startProject.approved");
  const tc = useTranslations("startProject");
  const ts = useTranslations("startProject.submit");
  const { isDark } = useTheme();

  const hashtags = campaign?.hashtags || (campaign ? [campaign.hashtag] : []);
  const values = {
    tag: hashtags[0] || "",
    tag2: hashtags[1] || "",
    account: campaign?.account || "",
  };

  const theme = {
    surface: isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]",
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    primaryText: isDark ? "text-white" : "text-[#191c1d]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };

  const scoreBox = (
    <div className={`hidden sm:block rounded-xl border px-5 py-3 text-center shrink-0 ${theme.inset}`}>
      <p className={`text-[10px] ${theme.secondaryText}`}>{t("scoreLabel")}</p>
      <p className="text-2xl font-black text-[#94D3C1]">{submission.aiScore ?? 100}%</p>
    </div>
  );

  return (
    <ResultShell
      tone="success"
      title={t("title")}
      description={t("description")}
      headerEnd={scoreBox}
      steps={["done", "passed", "pending"]}
      link={submission.link}
      image={campaign?.image}
      platformLabel={ts(`platforms.${submission.platform}`)}
    >
      {/* تقرير الفحص الشامل */}
      <div className={`${theme.surface} border rounded-2xl p-5 space-y-4`}>
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

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isDark ? "bg-[#212f2c] text-[#94D3C1]" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <ClipboardCheck size={18} />
            </span>
            <div>
              <p className={`text-sm font-bold ${theme.primaryText}`}>{t("reportTitle")}</p>
              <p className={`text-[10px] ${theme.secondaryText}`}>
                {t("reportSubtitle", { passed: checks.length, total: checks.length })}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold rounded-full border px-2.5 py-1 border-[#94D3C1]/40 bg-[#94D3C1]/10 text-[#94D3C1]">
            {t("instant")}
          </span>
        </div>

        <div className="space-y-2">
          {checks.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${theme.inset}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? "bg-[#22282a] text-gray-300" : "bg-[#e6ecea] text-[#404945]"
                  }`}
                >
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${theme.primaryText}`}>
                    {t(`checks.${key}.title`)}
                  </p>
                  <p className={`text-[10px] ${theme.secondaryText}`}>
                    {t(`checks.${key}.desc`, values)}
                  </p>
                </div>
              </div>
              <span
                className={`flex items-center gap-1 text-[10px] font-bold rounded-full border px-2.5 py-1 shrink-0 ${
                  isDark
                    ? "border-emerald-500/30 bg-emerald-500/10 text-#94D3C1"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                <Check size={11} />
                {t(`checks.${key}.badge`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AiResultCard score={submission.aiScore} />
    </ResultShell>
  );
}
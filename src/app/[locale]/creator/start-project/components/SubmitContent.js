"use client";
import ErrorBanner from "./ErrorBanner";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { mockCampaigns } from "./campaignsData";
import ProgressSteps from "./ProgressSteps";
import VideoPreview from "./VideoPreview";
import DeadlineTimer from "./DeadlineTimer";
import SubmitForm from "./SubmitForm";
import LinkGuide from "./LinkGuide";
import DuplicateTips from "./DuplicateTips";
const tipKeys = ["public", "hashtags", "noMusic"];


export default function SubmitContent() {
  const t = useTranslations("startProject.submit");
  const tt = useTranslations("startProject.tips");
  const locale = useLocale();
  const { isDark } = useTheme();
  const { campaignId } = useParams();

  const campaign = mockCampaigns.find((c) => c.id === campaignId);

  // الرابط والمنصة بتجي من النموذج لمعاينة الفيديو
const [draft, setDraft] = useState({ link: "", platform: null });
   const [formError, setFormError] = useState(null);
  // أخطاء الرابط فقط بتخلي المعاينة فاضية (الأخطاء الثانية بتضل تعرض الفيديو)
  const linkErrors = ["invalidUrl", "unsupportedPlatform", "platformMismatch"];
  const previewFailed = linkErrors.includes(formError);
  const theme = {
    page: isDark ? "bg-[#050505] text-gray-100" : "bg-[#f4f6f5] text-[#191c1d]",
    surface: isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]",
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    badge: isDark ? "bg-[#22282a] text-gray-300" : "bg-[#e6ecea] text-[#404945]",
    primaryText: isDark ? "text-white" : "text-[#191c1d]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };

  return (
    <div
      className={`min-h-screen w-full font-tajawal p-4 md:p-6 ${theme.page}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className={`${theme.surface} border rounded-2xl p-5 mb-5`}>
        <h1 className={`text-2xl md:text-3xl font-black mb-1 ${theme.primaryText}`}>
          {t("title")}
        </h1>
        <p className={`text-xs ${theme.secondaryText}`}>{t("description")}</p>
      </div>

      <ProgressSteps statuses={["done", formError ? "error" : "pending", "pending"]} />

      <ErrorBanner reason={formError} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
        <SubmitForm campaign={campaign} campaignId={campaignId} onChange={setDraft} onError={setFormError}/>

        <div className="space-y-4">
          <VideoPreview
            link={draft.link}
            image={campaign?.image}
            platformLabel={draft.platform ? t(`platforms.${draft.platform}`) : ""}
            error={previewFailed}
          />
          <DeadlineTimer hours={23} minutes={14} />

          {/* Quick tips */}
          {previewFailed ? (
                <LinkGuide />
              ) : formError === "missingHashtags" ? (
                <LinkGuide ns="editGuide" />
              ) : formError === "duplicateLink" ? (
                <DuplicateTips />
              ) : (
          <div className={`${theme.surface} border rounded-2xl p-4 space-y-3`}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className={`text-xs font-bold ${theme.primaryText}`}>{tt("title")}</h3>
                <p className={`text-[10px] ${theme.secondaryText}`}>{tt("subtitle")}</p>
              </div>
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isDark ? "bg-[#212f2c] text-[#94D3C1]" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <Lightbulb size={18} />
              </span>
            </div>

            <div className="space-y-2.5">
              {tipKeys.map((key, i) => (
                <TipItem
                  key={key}
                  number={i + 1}
                  title={tt(`${key}.title`)}
                  desc={tt(`${key}.desc`)}
                  theme={theme}
                />
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TipItem({ number, title, desc, theme }) {
  return (
    <div className={`p-3 rounded-xl border space-y-1 ${theme.inset}`}>
      <div className="flex items-center gap-2">
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${theme.badge}`}
        >
          {number}
        </span>
        <h4 className={`text-xs font-bold ${theme.primaryText}`}>{title}</h4>
      </div>
      <p className={`text-[10px] leading-relaxed ${theme.secondaryText}`}>{desc}</p>
    </div>
  );
}
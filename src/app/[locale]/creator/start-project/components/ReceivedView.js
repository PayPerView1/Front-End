"use client";
import AiResultCard from "./AiResultCard";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  Info,
} from "lucide-react";
import ResultShell from "./ResultShell";


export default function ReceivedView({ submission, campaign }) {
  const t = useTranslations("startProject.result");
  const ts = useTranslations("startProject.submit");
  const locale = useLocale();
  const { isDark } = useTheme();

  const link = submission.link;
  const requirementChecks = (Array.isArray(submission.checks) ? submission.checks : []).filter((check) => ["REQUIRED_KEYWORD", "REQUIRED_HASHTAG"].includes(check.code));
  const linkCheck = (Array.isArray(submission.checks) ? submission.checks : []).find((check) => check.code === "POST_LINK_STATUS");
  const processing = ["PROCESSING", "SUBMITTED"].includes(String(submission.displayStatus || submission.status || "").toUpperCase());

  const theme = {
    surface: isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]",
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    primaryText: isDark ? "text-white" : "text-[#191c1d]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };
  const green = isDark ? "text-[#94D3C1]" : "text-emerald-700";

  return (
    <ResultShell
      tone="warning"
      title={processing ? (locale === "ar" ? "جارٍ فحص التسليم" : "Submission is processing") : (locale === "ar" ? "التسليم بانتظار المعلن" : "Submission is awaiting advertiser review")}
      description={processing ? (locale === "ar" ? "يتم فحص التسليم. ستظهر نتائج الفحوص المسجلة هنا عند توفرها." : "Your submission is being checked. Saved review results will appear here when available.") : (locale === "ar" ? "تم حفظ نتيجة الفحص، والتسليم بانتظار قرار المعلن." : "Review results are saved, and the submission is awaiting the advertiser's decision.")}
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
                {campaign?.title || submission.campaignId || "—"}
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
      {linkCheck?.status === "PASSED" ? (locale === "ar" ? "تم التحقق من بيانات الرابط" : "Link metadata verified") : (locale === "ar" ? "حالة الرابط غير مؤكدة" : "Link status unverified")}
  </div>
</div>

        <div className="space-y-2">
          <p className={`text-xs font-bold ${theme.primaryText}`}>{locale === "ar" ? "فحوص الكلمات والوسوم المطلوبة" : "Required keyword and hashtag checks"}</p>
          {requirementChecks.length ? <ul className="space-y-2">{requirementChecks.map((check, index) => <li key={`${check.code}-${index}`} className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${theme.inset}`}><div><p className={`text-[10px] font-semibold ${theme.primaryText}`}>{check.code}</p><p className={`mt-1 text-[10px] ${theme.secondaryText}`}>{check.message || "—"}</p></div><span className={`shrink-0 text-[10px] font-bold ${check.status === "PASSED" ? "text-emerald-500" : check.status === "FAILED" ? "text-red-400" : "text-amber-500"}`}>{check.status || "—"}</span></li>)}</ul> : <p role="status" className={`rounded-lg border p-3 text-xs ${theme.inset} ${theme.secondaryText}`}>{locale === "ar" ? "لا توجد نتائج محفوظة للكلمات والوسوم بعد." : "No keyword or hashtag results have been saved yet."}</p>}
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
      <AiResultCard score={submission.aiScore} checks={submission.checks} />
    </ResultShell>
  );
}

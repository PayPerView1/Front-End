"use client";
import SubmitForm from "./SubmitForm";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ResultShell from "./ResultShell";
import AiResultCard from "./AiResultCard";


export default function RejectedView({ submission, campaign }) {
  const t = useTranslations("startProject.rejected");
  const tc = useTranslations("startProject");
  const ts = useTranslations("startProject.submit");
  const locale = useLocale();
  const { isDark } = useTheme();

  const reviewChecks = Array.isArray(submission.checks) ? submission.checks : [];
  const failedChecks = reviewChecks.filter((check) => check.status === "FAILED");
  const passedChecks = reviewChecks.filter((check) => check.status === "PASSED");
  const fixes = failedChecks.length ? failedChecks : (Array.isArray(submission.rejectionReasons) ? submission.rejectionReasons : []);

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

  const redBadge = isDark ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-red-200 bg-red-50 text-red-700";
  const greenBadge = isDark ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-800";

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
              {campaign?.title || submission.campaignId || "—"}
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
              <p className={`text-[10px] ${theme.secondaryText}`}>{locale === "ar" ? `${passedChecks.length} اجتاز · ${fixes.length} لم يجتز` : `${passedChecks.length} passed · ${fixes.length} failed`}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold rounded-full border px-2.5 py-1 ${redBadge}`}>{submission.displayStatus || submission.status}</span>
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

          {fixes.length === 0 ? <p className={`rounded-xl border p-3 text-xs ${theme.inset} ${theme.secondaryText}`}>{locale === "ar" ? "لم تُحفظ تفاصيل أسباب الرفض مع هذا السجل." : "No saved rejection check details are available for this record."}</p> : fixes.map((fix, i) => {
            return (
              <div
                key={`${fix.code || fix.reasonCode || "reason"}-${i}`}
                className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${theme.danger}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-600"
                    }`}
                  >
                    <AlertTriangle size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold mb-1 ${theme.primaryText}`}>
                      {i + 1}. {fix.code || fix.reasonCode || (locale === "ar" ? "سبب الرفض" : "Review finding")}
                    </p>
                    <p className={`text-[11px] leading-relaxed ${theme.secondaryText}`}>
                      {fix.message || fix.reason || (locale === "ar" ? "راجع متطلبات الحملة وتعليقات المراجع." : "Review the campaign requirements and reviewer feedback.")}
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
              {locale === "ar" ? `الفحوصات التي اجتازت (${passedChecks.length})` : `Passed checks (${passedChecks.length})`}
            </p>
            <span className={`text-[10px] font-bold rounded-full border px-2.5 py-1 ${greenBadge}`}>
              {passedChecks.length}
            </span>
          </div>

          {passedChecks.map((check, index) => (
            <div
              key={`${check.code || "check"}-${index}`}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${theme.inset}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${theme.iconBox}`}>
                  <CheckCircle2 size={15} />
                </span>
                <div className="min-w-0">
                  <p className={`flex flex-wrap items-center gap-2 text-xs font-bold ${theme.primaryText}`}>
                    {check.code || (locale === "ar" ? "فحص" : "Check")}
                  </p>
                  <p className={`text-[10px] ${theme.secondaryText}`}>
                    {check.message || (locale === "ar" ? "اجتاز الفحص." : "Check passed.")}
                  </p>
                </div>
              </div>
              <CheckCircle2 size={18} className="text-[#94D3C1] shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <AiResultCard score={submission.aiScore} checks={submission.checks} />
      <SubmitForm campaign={campaign} campaignId={submission.campaignId} />
    </ResultShell>
  );
}

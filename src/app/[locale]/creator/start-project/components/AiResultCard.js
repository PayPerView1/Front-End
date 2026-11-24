"use client";

import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const statusMeta = {
  PASSED: { en: "Passed", ar: "اجتاز", icon: CheckCircle2, color: "text-emerald-500" },
  FAILED: { en: "Failed", ar: "لم يجتز", icon: XCircle, color: "text-red-400" },
  NEEDS_REVIEW: { en: "Needs review", ar: "يحتاج إلى مراجعة", icon: Clock3, color: "text-amber-500" },
};

export default function AiResultCard({ score, checks = [] }) {
  const t = useTranslations("startProject.result");
  const locale = useLocale();
  const isAr = locale === "ar";
  const { isDark } = useTheme();
  const surface = isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]";
  const inset = isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]";
  const primary = isDark ? "text-white" : "text-[#191c1d]";
  const secondary = isDark ? "text-gray-400" : "text-[#5f6a66]";
  const recordedChecks = Array.isArray(checks) ? checks : [];

  return (
    <section className={`${surface} border rounded-2xl p-5 space-y-4`} aria-labelledby="submission-ai-review-title">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="submission-ai-review-title" className={`text-sm font-bold ${primary}`}>{t("ai.label")}</h2>
          <p className={`text-[10px] ${secondary}`}>{t("ai.subtitle")}</p>
        </div>
        <div className="rounded-xl border border-[#94D3C1]/30 bg-[#94D3C1]/10 px-3 py-1.5 text-center">
          <span className="block text-[10px] opacity-70">{t("ai.scoreLabel")}</span>
          <span className="text-lg font-black text-[#94D3C1]">{Number.isFinite(score) ? `${score}%` : "—"}</span>
        </div>
      </div>

      {recordedChecks.length === 0 ? (
        <p role="status" className={`rounded-xl border p-3 text-xs ${inset} ${secondary}`}>
          {isAr ? "لا تتوفر تفاصيل فحص محفوظة لهذا التسليم." : "No saved review check details are available for this submission."}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {recordedChecks.map((check, index) => {
            const meta = statusMeta[check.status] || { en: check.status || "Unknown", ar: check.status || "غير معروف", icon: Clock3, color: "text-amber-500" };
            const Icon = meta.icon;
            return (
              <li key={`${check.code || "check"}-${index}`} className={`rounded-xl border p-3 ${inset}`}>
                <div className="flex items-start gap-2">
                  <Icon size={15} className={`${meta.color} mt-0.5 shrink-0`} />
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${primary}`}>{check.code || (isAr ? "فحص" : "Check")}</p>
                    <p className={`mt-1 text-[10px] ${meta.color}`}>{isAr ? meta.ar : meta.en}</p>
                    {check.message && <p className={`mt-1 text-[10px] leading-relaxed ${secondary}`}>{check.message}</p>}
                    {check.fixHint && <p className="mt-1 text-[10px] text-amber-500">{isAr ? "توجيه:" : "Guidance:"} {check.fixHint}</p>}
                    {Number.isFinite(check.score) && <p className="mt-1 text-[10px] text-[#4a9b82]">{isAr ? "الدرجة:" : "Score:"} {check.score}/100</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className={`text-[10px] ${secondary}`}>{isAr ? "نتيجة الفحص لا تتجاوز حالة التسليم المسجلة في النظام." : "AI review details do not override the submission status recorded by the backend."}</p>
    </section>
  );
}

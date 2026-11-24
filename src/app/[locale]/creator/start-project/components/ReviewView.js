"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  Headphones,
  ExternalLink,
  Check,
  ListChecks,
  Wallet,
  Timer,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import ResultShell from "./ResultShell";

const flow = [
  { key: "received", state: "done", icon: Check },
  { key: "expert", state: "current", icon: Headphones },
  { key: "reward", state: "next", icon: Wallet },
];

const faqKeys = ["edit", "reward"];

export default function ReviewView({ submission, campaign }) {
  const t = useTranslations("startProject.review");
  const ts = useTranslations("startProject.submit");
  const locale = useLocale();
  const { isDark } = useTheme();

  const platformLabel = ts(`platforms.${submission.platform}`);
  const reviewChecks = Array.isArray(submission.checks) ? submission.checks : [];
  const amount = Number.isFinite(submission.rewardAmount) ? String(submission.rewardAmount) : "—";
  const minH = submission.manualReview?.expectedHours?.min;
  const maxH = submission.manualReview?.expectedHours?.max;

  const theme = {
    surface: isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]",
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    iconBox: isDark ? "bg-[#22282a] text-gray-300" : "bg-[#e6ecea] text-[#404945]",
    gold: isDark
      ? "bg-[#E9C349]/5 border-[#E9C349]/30"
      : "bg-amber-50 border-amber-200",
    primaryText: isDark ? "text-white" : "text-[#191c1d]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };

  const greenBadge = isDark
    ? "border-emerald-500/30 bg-emerald-500/10 text-#94D3C1"
    : "border-emerald-200 bg-emerald-50 text-emerald-800";
  const goldBadge = isDark
    ? "border-[#E9C349]/40 bg-[#E9C349]/10 text-[#E9C349]"
    : "border-amber-300 bg-amber-100 text-amber-800";

  const flowStyles = {
    done: { circle: greenBadge, badge: greenBadge, row: theme.inset },
    current: { circle: goldBadge, badge: goldBadge, row: theme.gold },
    next: { circle: theme.iconBox, badge: `${theme.inset} ${theme.secondaryText}`, row: theme.inset },
  };

  const sideExtra = (
    <>
      {/* المدة الزمنية وضمان الحقوق */}
      <div className={`${theme.surface} border rounded-2xl p-4 space-y-3`}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className={`text-sm font-bold ${theme.primaryText}`}>{t("timelineTitle")}</h3>
            <p className={`text-[10px] ${theme.secondaryText}`}>{t("timelineSubtitle")}</p>
          </div>
          <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${theme.iconBox}`}>
            <Timer size={18} />
          </span>
        </div>

        <div className={`rounded-xl border p-3 space-y-2 ${theme.inset}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] ${theme.secondaryText}`}>{t("etaLabel")}</span>
            <span className="text-xs font-bold text-[#94D3C1]">
              {Number.isFinite(minH) && Number.isFinite(maxH) ? t("etaValue", { min: minH, max: maxH }) : (locale === "ar" ? "قيد المراجعة" : "In review")}
            </span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-[#1c2223]" : "bg-[#e8eeeb]"}`}>
            <div className="h-full w-1/2 rounded-full bg-[#94D3C1]" />
          </div>
        </div>

        <p className={`flex items-start gap-2 text-[10px] leading-relaxed ${theme.secondaryText}`}>
          <ShieldCheck size={14} className="text-[#94D3C1] shrink-0 mt-0.5" />
          {t("guarantee")}
        </p>
      </div>

      {/* أسئلة سريعة */}
      <div className={`${theme.surface} border rounded-2xl p-4 space-y-3`}>
        <h3 className={`flex items-center gap-2 text-sm font-bold ${theme.primaryText}`}>
          <HelpCircle size={16} className="text-[#E9C349]" />
          {t("faqTitle")}
        </h3>
        {faqKeys.map((key) => (
          <div key={key} className={`rounded-xl border p-3 space-y-1 ${theme.inset}`}>
            <p className={`text-xs font-bold ${theme.primaryText}`}>{t(`faq.${key}.q`, { amount })}</p>
            <p className={`text-[10px] leading-relaxed ${theme.secondaryText}`}>
              {t(`faq.${key}.a`, { amount })}
            </p>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <ResultShell
      tone="warning"
      title={t("title")}
      description={t("description")}
      steps={["done", "review", "pending"]}
      link={submission.link}
      image={campaign?.image}
      platformLabel={platformLabel}
      sideExtra={sideExtra}
    >
      {/* بيانات المقطع وفحص المعايير */}
      <div className={`${theme.surface} border rounded-2xl p-5 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${theme.iconBox}`}>
              <ListChecks size={18} />
            </span>
            <div>
              <p className={`text-sm font-bold ${theme.primaryText}`}>{t("dataTitle")}</p>
              <p className={`text-[10px] ${theme.secondaryText}`}>{t("dataSubtitle")}</p>
            </div>
          </div>
          <a
            href={submission.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-1.5 px-3 py-2 border rounded-lg text-center text-[10px] font-bold sm:w-auto ${theme.inset} ${theme.secondaryText}`}
          >
            <ExternalLink size={12} />
            {t("openInPlatform", { platform: platformLabel })}
          </a>
        </div>

        <div className="space-y-2" aria-live="polite">
          {reviewChecks.length === 0 ? <p role="status" className={`rounded-xl border p-3 text-xs ${theme.inset} ${theme.secondaryText}`}>{locale === "ar" ? "لم تُحفظ تفاصيل فحوص بعد. راجع الحالة المسجلة أعلاه." : "No review checks have been saved yet. See the recorded status above."}</p> : reviewChecks.map((check, index) => (
            <div key={`${check.code || "check"}-${index}`} className={`flex items-start justify-between gap-3 rounded-xl border p-3 ${theme.inset}`}>
              <div className="min-w-0"><p className={`text-xs font-bold ${theme.primaryText}`}>{check.code || (locale === "ar" ? "فحص" : "Check")}</p><p className={`mt-1 text-[10px] ${theme.secondaryText}`}>{check.message || "—"}</p>{check.fixHint && <p className="mt-1 text-[10px] text-amber-500">{locale === "ar" ? "توجيه:" : "Guidance:"} {check.fixHint}</p>}</div>
              <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold ${check.status === "PASSED" ? greenBadge : check.status === "FAILED" ? "border-red-500/30 bg-red-500/10 text-red-400" : goldBadge}`}>{check.status || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ماذا يحدث الآن */}
      <div className={`${theme.surface} border rounded-2xl p-5 space-y-4`}>
        <div>
          <p className={`text-sm font-bold ${theme.primaryText}`}>{t("whatNowTitle")}</p>
          <p className={`text-[10px] ${theme.secondaryText}`}>{t("whatNowSubtitle")}</p>
        </div>

        <div className="space-y-2">
          {flow.map(({ key, state, icon: Icon }) => {
            const s = flowStyles[state];
            return (
              <div
                key={key}
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${s.row}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${s.circle}`}>
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${theme.primaryText}`}>
                      {t(`flow.${key}.title`, { amount })}
                    </p>
                    <p className={`text-[10px] leading-relaxed ${theme.secondaryText}`}>
                      {t(`flow.${key}.desc`)}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold rounded-full border px-2.5 py-1 shrink-0 ${s.badge}`}>
                  {t(`flow.${key}.badge`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ResultShell>
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import ResultShell from "./ResultShell";
import AiResultCard from "./AiResultCard";

export default function ApprovedView({ submission, campaign }) {
  const t = useTranslations("startProject.approved");
  const ts = useTranslations("startProject.submit");
  const isAr = useLocale() === "ar";
  const { isDark } = useTheme();

  const theme = {
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };

  const scoreBox = (
    <div className={`hidden sm:block rounded-xl border px-5 py-3 text-center shrink-0 ${theme.inset}`}>
        <p className={`text-[10px] ${theme.secondaryText}`}>{t("scoreLabel")}</p>
      <p className="text-2xl font-black text-[#94D3C1]">{Number.isFinite(submission.aiScore) ? `${submission.aiScore}%` : "—"}</p>
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
      <div className="rounded-xl border px-4 py-3 text-xs" style={{ borderColor: "rgba(148,211,193,0.3)", background: "rgba(148,211,193,0.06)" }}>
        <p className="font-semibold text-[#4a9b82]">{isAr ? "حالة التسليم المسجلة: معتمد" : "Recorded submission status: APPROVED"}</p>
        <p className={`mt-1 ${theme.secondaryText}`}>{isAr ? "حالة الاعتماد محفوظة في النظام. تفاصيل فحوص الذكاء الاصطناعي أدناه ولا تستبدل قرار المعلن." : "Approval is recorded by the backend. AI check details below do not replace the advertiser's decision."}</p>
      </div>
      <AiResultCard score={submission.aiScore} checks={submission.checks} />
    </ResultShell>
  );
}

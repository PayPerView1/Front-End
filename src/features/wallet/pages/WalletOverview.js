"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { useWallet } from "../WalletProvider";
import { useUser } from "@/context/UserContext";
import { getAdvertiserWalletIntelligence } from "@/services/wallet";

export default function WalletOverview() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const t = useTranslations("Analytics");
  const budgetT = useTranslations("budgetManagement");
  const { balance, status, error, refresh } = useWallet();
  const { user } = useUser() || {};
  const [intelligence, setIntelligence] = useState(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState(false);
  const [intelligenceError, setIntelligenceError] = useState("");
  const isBrand = ["BRAND", "BRAND_OWNER"].includes(String(user?.role || "").toUpperCase());
  const isAr = locale === "ar";
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" });
  const styles = {
    page: isDark ? "bg-[#0B0D0E] text-white" : "bg-[#F1F4F3] text-[#191C1D]",
    card: isDark
      ? "border-white/10 bg-[#151819]"
      : "border-[#E5EAE8] bg-white shadow-sm",
    muted: isDark ? "text-gray-400" : "text-[#5F6A66]",
    subtle: isDark ? "text-gray-500" : "text-[#68736F]",
    accent: isDark ? "text-[#94D3C1]" : "text-[#1C6B58]",
    button: isDark
      ? "border-white/10 text-gray-300 hover:border-[#94D3C1]/50"
      : "border-[#D5DEDB] text-[#404945] hover:border-[#1C6B58]/50",
  };
  const actions = [
    { href: "/advertiser/wallet/top-up", title: t("chargeNow"), description: t("stats.balanceBottom") },
    { href: "/advertiser/wallet/refund", title: t("transactions.types.refund"), description: t("refundFoot") },
    { href: "/advertiser/wallet/budget", title: budgetT("title"), description: budgetT("subtitle") },
    { href: "/advertiser/wallet/transactions", title: t("transactions.title"), description: t("manageGuide") },
  ];
  const loadIntelligence = async () => {
    if (!isBrand || intelligenceLoading) return;
    setIntelligenceLoading(true);
    setIntelligenceError("");
    try {
      setIntelligence(await getAdvertiserWalletIntelligence());
    } catch (requestError) {
      setIntelligence(null);
      setIntelligenceError(requestError?.response?.data?.message || requestError?.message || (isAr ? "تعذر تحميل ذكاء المحفظة." : "Wallet intelligence is unavailable."));
    } finally {
      setIntelligenceLoading(false);
    }
  };
  const statusLabel = (value) => value === "INSUFFICIENT_DATA"
    ? (isAr ? "بيانات غير كافية" : "Insufficient data")
    : value === "ESTIMATED" ? (isAr ? "تقديري" : "Estimated")
      : value === "ASSESSED" ? (isAr ? "تم التقييم" : "Assessed")
        : value === "RECOMMENDED" ? (isAr ? "موصى به" : "Recommended") : (value || "—");
  const riskLabel = (value) => ({ UNKNOWN: isAr ? "غير معروف" : "Unknown", LOW: isAr ? "منخفض" : "Low", MEDIUM: isAr ? "متوسط" : "Medium", HIGH: isAr ? "مرتفع" : "High" })[value] || (value || "—");

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className={`min-h-screen px-4 py-8 sm:px-8 ${styles.page}`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`mb-2 text-sm ${styles.accent}`}>{t("emptyTag")}</p>
            <h1 className="text-3xl font-bold">{t("stats.balance")}</h1>
          </div>
          <button
            onClick={() => refresh().catch(() => {})}
            className={`rounded-xl border px-4 py-2 text-sm transition-colors ${styles.button}`}
          >
            {locale === "ar" ? "تحديث الرصيد" : "Refresh balance"}
          </button>
        </header>
        <section className={`mb-6 rounded-2xl border p-6 sm:p-8 ${styles.card}`}>
          <p className={`mb-2 text-sm ${styles.muted}`}>{t("stats.balance")}</p>
          {status === "loading" ? (
            <p className={`text-xl ${styles.muted}`}>جارٍ تحميل الرصيد…</p>
          ) : status === "error" ? (
            <div role="alert" className="flex flex-wrap items-center gap-3 text-red-600">
              <span>{error}</span>
              <button onClick={() => refresh().catch(() => {})} className="underline">
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <p className={`text-4xl font-bold ${styles.accent}`} dir="ltr">
              {money.format(balance)}
            </p>
          )}
          <p className={`mt-3 text-xs ${styles.subtle}`}>
            يتم تحميل الرصيد من حسابك الحالي.
          </p>
        </section>
        {isBrand && <section aria-labelledby="wallet-intelligence-title" className={`mb-6 rounded-2xl border p-5 sm:p-6 ${styles.card}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="wallet-intelligence-title" className="text-lg font-semibold">{isAr ? "ذكاء المدفوعات والميزانية" : "Payment and budget intelligence"}</h2>
              <p className={`mt-1 max-w-2xl text-xs ${styles.muted}`}>{isAr ? "تحليل إرشادي لسجل المدفوعات والميزانيات المملوكة لهذا الحساب. لا يغيّر حالة معاملة أو استرداد." : "Advisory analysis of this account’s payment and campaign budget history. It does not change transaction or refund status."}</p>
            </div>
            <button type="button" onClick={loadIntelligence} disabled={intelligenceLoading} className={`rounded-xl border px-4 py-2 text-sm transition-colors disabled:opacity-50 ${styles.button}`}>
              {intelligenceLoading ? (isAr ? "جارٍ التحليل…" : "Analyzing…") : intelligence ? (isAr ? "تحديث التحليل" : "Refresh analysis") : (isAr ? "تحليل المحفظة" : "Analyze wallet")}
            </button>
          </div>
          {intelligenceError && <div role="alert" className="mt-4 flex flex-wrap items-center gap-3 text-sm text-red-500"><span>{intelligenceError}</span><button type="button" onClick={loadIntelligence} className="underline">{isAr ? "إعادة المحاولة" : "Retry"}</button></div>}
          {intelligenceLoading && <p role="status" className={`mt-4 text-sm ${styles.muted}`}>{isAr ? "جارٍ تحليل السجل المالي المتاح…" : "Analyzing available finance history…"}</p>}
          {intelligence && <div aria-live="polite" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className={`rounded-xl border p-3 ${styles.card}`}><p className={`text-xs ${styles.muted}`}>{isAr ? "مخاطر الدفع" : "Payment risk"}</p><p className="mt-1 font-semibold">{riskLabel(intelligence.paymentFraud?.risk)} · {statusLabel(intelligence.paymentFraud?.status)}</p>{!!intelligence.paymentFraud?.reasonCodes?.length && <p className={`mt-1 text-[11px] ${styles.muted}`}>{intelligence.paymentFraud.reasonCodes.join(" · ")}</p>}</div>
              <div className={`rounded-xl border p-3 ${styles.card}`}><p className={`text-xs ${styles.muted}`}>{isAr ? "توصية الحد اليومي" : "Daily budget recommendation"}</p><p className="mt-1 font-semibold">{intelligence.dailyBudgetRecommendation?.status === "ESTIMATED" && Number.isFinite(intelligence.dailyBudgetRecommendation.recommendedLimit) ? money.format(intelligence.dailyBudgetRecommendation.recommendedLimit) : statusLabel(intelligence.dailyBudgetRecommendation?.status)}</p>{intelligence.dailyBudgetRecommendation?.basis && <p className={`mt-1 text-[11px] ${styles.muted}`}>{intelligence.dailyBudgetRecommendation.basis}</p>}</div>
              <div className={`rounded-xl border p-3 ${styles.card}`}><p className={`text-xs ${styles.muted}`}>{isAr ? "شذوذ الإنفاق" : "Spending anomaly"}</p><p className="mt-1 font-semibold">{riskLabel(intelligence.spendingAnomaly?.risk)} · {statusLabel(intelligence.spendingAnomaly?.status)}</p>{!!intelligence.spendingAnomaly?.reasonCodes?.length && <p className={`mt-1 text-[11px] ${styles.muted}`}>{intelligence.spendingAnomaly.reasonCodes.join(" · ")}</p>}</div>
              <div className={`rounded-xl border p-3 ${styles.card}`}><p className={`text-xs ${styles.muted}`}>{isAr ? "طريقة الدفع المقترحة" : "Payment method recommendation"}</p><p className="mt-1 font-semibold">{intelligence.paymentMethodRecommendation?.method || statusLabel(intelligence.paymentMethodRecommendation?.status)}</p>{intelligence.paymentMethodRecommendation?.basis && <p className={`mt-1 text-[11px] ${styles.muted}`}>{intelligence.paymentMethodRecommendation.basis}</p>}</div>
              <div className={`rounded-xl border p-3 ${styles.card}`}><p className={`text-xs ${styles.muted}`}>{isAr ? "مبلغ الإيداع المقترح" : "Estimated deposit amount"}</p><p className="mt-1 font-semibold">{intelligence.depositAmountPrediction?.status === "ESTIMATED" && Number.isFinite(intelligence.depositAmountPrediction.amount) ? money.format(intelligence.depositAmountPrediction.amount) : statusLabel(intelligence.depositAmountPrediction?.status)}</p>{intelligence.depositAmountPrediction?.basis && <p className={`mt-1 text-[11px] ${styles.muted}`}>{intelligence.depositAmountPrediction.basis}</p>}</div>
              <div className={`rounded-xl border p-3 ${styles.card}`}><p className={`text-xs ${styles.muted}`}>{isAr ? "مؤشرات الاسترداد" : "Refund risk signals"}</p><p className="mt-1 font-semibold">{riskLabel(intelligence.refundFraud?.risk)} · {statusLabel(intelligence.refundFraud?.status)}</p>{intelligence.refundLikelihoodPrediction?.status === "ESTIMATED" && Number.isFinite(intelligence.refundLikelihoodPrediction.probability) && <p className={`mt-1 text-[11px] ${styles.muted}`}>{isAr ? "احتمال الاسترداد التقديري:" : "Estimated refund likelihood:"} {Math.round(intelligence.refundLikelihoodPrediction.probability * 100)}%</p>}</div>
              <div className={`rounded-xl border p-3 ${styles.card}`}><p className={`text-xs ${styles.muted}`}>{isAr ? "طريقة الاسترداد" : "Refund method"}</p><p className="mt-1 font-semibold">{intelligence.refundMethodRecommendation?.method || statusLabel(intelligence.refundMethodRecommendation?.status)}</p>{intelligence.refundMethodRecommendation?.basis && <p className={`mt-1 text-[11px] ${styles.muted}`}>{intelligence.refundMethodRecommendation.basis}</p>}</div>
            </div>
            {intelligence.paymentFraud?.status === "INSUFFICIENT_DATA" && intelligence.spendingAnomaly?.status === "INSUFFICIENT_DATA" && <p role="status" className={`text-xs ${styles.muted}`}>{isAr ? "بعض المؤشرات غير متاحة لعدم كفاية السجل التاريخي." : "Some signals are unavailable because there is not enough history."}</p>}
            <p className={`text-[10px] ${styles.subtle}`}>{isAr ? "هذه مؤشرات وتوقعات إرشادية؛ لا تثبت الاحتيال ولا تؤكد معاملة أو مبلغاً مستقبلياً." : "These are advisory signals and estimates; they do not prove fraud or confirm a transaction or future amount."}</p>
          </div>}
        </section>}
        <nav aria-label="إدارة المحفظة" className="grid gap-4 sm:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={`/${locale}${action.href}`}
              className={`rounded-2xl border p-5 transition-colors hover:border-[#1C6B58]/40 ${styles.card}`}
            >
              <h2 className="mb-2 text-lg font-semibold">{action.title}</h2>
              <p className={`text-sm ${styles.muted}`}>{action.description}</p>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLocale } from "next-intl";
import { useEarnings } from "@/context/Earningscontext";
import {
  addCreatorPaymentMethod,
  getCreatorEarnings,
  getCreatorEarningsPrediction,
  getCreatorEarningsTransactions,
  getCreatorPaymentMethods,
  getCreatorWithdrawalIntelligence,
  requestCreatorWithdrawal,
} from "@/services/wallet";
import EarningsSummary from "./components/EarningsSummary";
import EarningsCards from "./components/EarningsCards";
import HowItWorks from "./components/HowItWorks";
import VideosTable from "./components/VideosTable";
import ViewsByCountry from "./components/ViewsByCountry";
import EmptyState from "./components/EmptyState";
import WelcomeCard from "./components/WelcomeCard";

const messageOf = (error) => error?.response?.data?.message || error?.message || "Request failed.";
const earningStatus = {
  ON_HOLD: "review",
  REVIEW_REQUIRED: "review",
  AVAILABLE: "ready",
  PARTIALLY_RESERVED: "ready",
  PAID: "paid",
  RESERVED: "reserved",
  REJECTED: "rejected",
};

function formatEstimatedEarnings(cents, currency, locale) {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency || "USD"}`;
  }
}

function mapEarningTransactions(items, locale, isAr) {
  return items.map((item) => ({
    id: String(item._id || item.id),
    title: item.postTitle || item.campaignName || (isAr ? "تسليم محتوى" : "Content submission"),
    campaign: item.campaignName || "—",
    publishedAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString(locale) : "—",
    platform: ({ TIKTOK: "TikTok", INSTAGRAM: "Reels", YOUTUBE: "Shorts" })[item.platform] || item.platform || "—",
    thumb: null,
    views: Number(item.views) || 0,
    cpm: null,
    earning: Number(item.netAmount) || 0,
    status: earningStatus[item.status] || "review",
    rawStatus: item.status,
  }));
}

export default function EarningsPage() {
  const { isDark } = useTheme();
  const locale = useLocale();
  const isAr = locale === "ar";
  const { setEarningsData } = useEarnings();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [transactionsError, setTransactionsError] = useState("");
  const [paymentMethodsError, setPaymentMethodsError] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [addMethodOpen, setAddMethodOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [methodForm, setMethodForm] = useState({ type: "PAYPAL", label: "", accountName: "", accountIdentifier: "", bankName: "" });
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [withdrawalAdvice, setWithdrawalAdvice] = useState(null);
  const [withdrawalAdviceLoading, setWithdrawalAdviceLoading] = useState(false);
  const [withdrawalAdviceError, setWithdrawalAdviceError] = useState("");
  const [earningsPrediction, setEarningsPrediction] = useState(null);
  const [earningsPredictionLoading, setEarningsPredictionLoading] = useState(true);
  const [earningsPredictionError, setEarningsPredictionError] = useState("");

  const load = useCallback(async () => {
    const [walletResult, transactionResult, paymentResult, predictionResult] = await Promise.allSettled([
      getCreatorEarnings(),
      getCreatorEarningsTransactions({ page: 1, perPage: 20 }),
      getCreatorPaymentMethods(),
      getCreatorEarningsPrediction(),
    ]);
    setPageError("");
    setTransactionsError("");
    setPaymentMethodsError("");
    if (walletResult.status === "fulfilled") {
      const nextWallet = walletResult.value;
      setWallet(nextWallet);
      setEarningsData({
        total: Number(nextWallet?.totalEarnings) || 0,
        ready: Number(nextWallet?.availableBalance) || 0,
      });
    } else {
      setWallet(null);
      setPageError(messageOf(walletResult.reason));
    }
    if (transactionResult.status === "fulfilled") {
      setTransactions(mapEarningTransactions(transactionResult.value.data, locale, isAr));
    } else {
      setTransactions([]);
      setTransactionsError(messageOf(transactionResult.reason));
    }
    if (paymentResult.status === "fulfilled") {
      setPaymentMethods(paymentResult.value);
      setSelectedMethodId((current) => current || paymentResult.value.find((method) => method.isDefault)?.id || paymentResult.value[0]?.id || "");
    } else {
      setPaymentMethods([]);
      setPaymentMethodsError(messageOf(paymentResult.reason));
    }
    if (predictionResult.status === "fulfilled") {
      setEarningsPrediction(predictionResult.value);
      setEarningsPredictionError("");
    } else {
      setEarningsPrediction(null);
      setEarningsPredictionError(messageOf(predictionResult.reason));
    }
    setEarningsPredictionLoading(false);
    setLoading(false);
  }, [isAr, locale, setEarningsData]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setEarningsPredictionLoading(true);
    await load();
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (!withdrawOpen || !selectedMethodId) return undefined;
    let active = true;
    const timer = setTimeout(async () => {
      if (!active) return;
      setWithdrawalAdviceLoading(true);
      setWithdrawalAdviceError("");
      setWithdrawalAdvice(null);
      try {
        const payload = { paymentMethodId: selectedMethodId };
        if (Number(amount) > 0) payload.amount = Number(amount);
        const result = await getCreatorWithdrawalIntelligence(payload);
        if (active) setWithdrawalAdvice(result);
      } catch {
        if (active) {
          setWithdrawalAdvice(null);
          setWithdrawalAdviceError(isAr ? "تعذر تحميل التقييم الإرشادي للسحب." : "Withdrawal guidance is currently unavailable.");
        }
      } finally {
        if (active) setWithdrawalAdviceLoading(false);
      }
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [amount, isAr, selectedMethodId, withdrawOpen]);

  const data = useMemo(() => ({
    total: Number(wallet?.totalEarnings) || 0,
    ready: Number(wallet?.availableBalance) || 0,
    review: Number(wallet?.pendingBalance) || 0,
    reserved: Number(wallet?.reservedBalance) || 0,
    received: Number(wallet?.totalWithdrawn) || 0,
    totalSar: null,
    readySar: null,
    reviewSar: null,
    receivedSar: null,
    views: Number(wallet?.totalViews) || 0,
    clips: Number(wallet?.earningSubmissions) || 0,
    ecpm: null,
    topCpm: null,
    progress: null,
    payouts: null,
  }), [wallet]);

  const handleWithdrawal = async (event) => {
    event.preventDefault();
    setSaving(true); setActionError(""); setActionMessage("");
    try {
      await requestCreatorWithdrawal({ amount: Number(amount), paymentMethodId: selectedMethodId });
      setActionMessage(isAr ? "تم إرسال طلب السحب." : "Withdrawal request submitted.");
      setAmount(""); setWithdrawOpen(false);
      await refresh();
    } catch (error) { setActionError(messageOf(error)); }
    finally { setSaving(false); }
  };

  const handleAddPaymentMethod = async (event) => {
    event.preventDefault();
    if (!methodForm.label.trim() || !methodForm.accountName.trim() || !methodForm.accountIdentifier.trim()) {
      setActionError(isAr ? "أكمل بيانات وسيلة الدفع المطلوبة." : "Complete the required payment method fields.");
      return;
    }
    setSaving(true); setActionError("");
    try {
      const method = await addCreatorPaymentMethod({
        type: methodForm.type,
        label: methodForm.label,
        details: { accountName: methodForm.accountName, accountIdentifier: methodForm.accountIdentifier, bankName: methodForm.bankName },
      });
      setPaymentMethods((current) => [...current, method]);
      setSelectedMethodId(method.id);
      setAddMethodOpen(false);
      setMethodForm({ type: "PAYPAL", label: "", accountName: "", accountIdentifier: "", bankName: "" });
    } catch (error) { setActionError(messageOf(error)); }
    finally { setSaving(false); }
  };

  const fieldClass = `w-full rounded-lg border px-3 py-2 text-sm ${isDark ? "border-white/10 bg-[#101314] text-white" : "border-gray-300 bg-white text-gray-900"}`;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className={`creator-responsive-page min-h-screen w-full p-3 sm:p-4 md:p-6 flex flex-col gap-4 ${isDark ? "bg-[#000000F2] text-white" : "bg-white text-[#1A1A1A]"}`}>
      <WelcomeCard />
      {loading && <p role="status" className="text-sm">{isAr ? "جارٍ تحميل الأرباح…" : "Loading earnings…"}</p>}
      {pageError && <div role="alert" className="rounded-xl border border-red-500/40 p-4 text-sm text-red-500">{pageError} <button type="button" onClick={refresh} className="ms-2 underline">{isAr ? "إعادة المحاولة" : "Retry"}</button></div>}
      {actionMessage && <p role="status" className="text-sm text-emerald-600">{actionMessage}</p>}
      {actionError && <p role="alert" className="text-sm text-red-500">{actionError}</p>}

      {!pageError && !loading && <>
        <EarningsSummary data={data} />
        <section aria-labelledby="earnings-prediction-title" className={`rounded-2xl border p-4 sm:p-5 ${isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 id="earnings-prediction-title" className="text-sm font-bold">{isAr ? "توقع الأرباح" : "Earnings estimate"}</h2>
              <p className="mt-1 text-xs opacity-70">{isAr ? "تقدير مستقبلي من المشاهدات الناضجة المعتمدة وسجل الأرباح؛ لا يغيّر رصيدك المؤكد." : "A forward estimate from matured validated views and realized earnings; it does not change your confirmed balance."}</p>
            </div>
            {earningsPrediction?.status === "ESTIMATED" && <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-500">{isAr ? "تقديري" : "Estimated"}</span>}
          </div>
          {earningsPredictionLoading ? <p role="status" className="mt-3 text-sm opacity-70">{isAr ? "جارٍ تحميل التوقع…" : "Loading estimate…"}</p>
            : earningsPredictionError ? <div role="alert" className="mt-3 flex flex-wrap items-center gap-2 text-sm text-red-500"><span>{earningsPredictionError}</span><button type="button" onClick={refresh} className="underline">{isAr ? "إعادة المحاولة" : "Retry"}</button></div>
              : earningsPrediction?.status === "ESTIMATED" ? <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div><p className="text-xs opacity-65">{isAr ? "صافي الأرباح المتوقع خلال 7 أيام" : "Estimated creator net · next 7 days"}</p><p className="mt-1 text-xl font-bold text-[#94D3C1]">{formatEstimatedEarnings(earningsPrediction.estimatedCreatorNetAmountCents, earningsPrediction.currency, locale)}</p></div>
                <div><p className="text-xs opacity-65">{isAr ? "المشاهدات المتوقعة" : "Projected views"}</p><p className="mt-1 text-lg font-semibold">{earningsPrediction.predictedNext7DaysViews.toLocaleString(locale)}</p></div>
                <div><p className="text-xs opacity-65">{isAr ? "مستوى الثقة" : "Confidence"}</p><p className="mt-1 text-lg font-semibold">{Number.isFinite(earningsPrediction.confidence) ? `${Math.round(earningsPrediction.confidence * 100)}%` : "—"}</p></div>
                {earningsPrediction.explanation && <p className="text-xs opacity-70 sm:col-span-3">{earningsPrediction.explanation}</p>}
              </div> : <p role="status" className="mt-3 text-sm opacity-70">{earningsPrediction?.explanation || (isAr ? "لا تتوفر بيانات تاريخية كافية لإعداد تقدير." : "There is not enough validated history to produce an estimate.")}</p>}
        </section>
        <EarningsCards data={data} onWithdraw={() => { setActionError(""); setWithdrawOpen(true); }} />
        {data.total > 0 ? <>
          <HowItWorks review={{ completed: data.review === 0 }} />
          {transactionsError && <p role="alert" className="text-sm text-red-500">{transactionsError}</p>}
          <VideosTable videos={transactions} onWithdraw={() => setWithdrawOpen(true)} />
          <ViewsByCountry countries={[]} />
          {paymentMethodsError && <p role="status" className="text-xs opacity-70">{isAr ? "تعذر تحميل وسائل الدفع المحفوظة." : "Saved payment methods could not be loaded."}</p>}
        </> : <EmptyState />}
      </>}

      {withdrawOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="withdraw-title">
        <div className={`w-full max-w-lg rounded-2xl border p-5 ${isDark ? "border-white/10 bg-[#191C1D]" : "border-gray-200 bg-white"}`}>
          <div className="mb-4 flex items-center justify-between"><h2 id="withdraw-title" className="text-lg font-bold">{isAr ? "طلب سحب" : "Request withdrawal"}</h2><button type="button" onClick={() => setWithdrawOpen(false)} aria-label={isAr ? "إغلاق" : "Close"}>×</button></div>
          <p className="mb-4 text-sm opacity-70">{isAr ? `الرصيد المتاح: $${data.ready.toFixed(2)}` : `Available balance: $${data.ready.toFixed(2)}`}</p>
          {!paymentMethods.length && <p className="mb-3 text-sm">{isAr ? "أضف وسيلة دفع للمتابعة." : "Add a payment method to continue."}</p>}
          <form onSubmit={handleWithdrawal} className="flex flex-col gap-3">
            <label className="text-sm">{isAr ? "المبلغ بالدولار" : "Amount (USD)"}<input className={fieldClass} type="number" min="0.01" max={data.ready} step="0.01" required value={amount} onChange={(event) => { setAmount(event.target.value); setWithdrawalAdvice(null); setWithdrawalAdviceError(""); }} /></label>
            {paymentMethods.length > 0 && <label className="text-sm">{isAr ? "وسيلة الدفع" : "Payment method"}<select className={fieldClass} required value={selectedMethodId} onChange={(event) => { setSelectedMethodId(event.target.value); setWithdrawalAdvice(null); setWithdrawalAdviceError(""); }}>{paymentMethods.map((method) => <option key={method.id} value={method.id}>{method.label} ····{method.last4}</option>)}</select></label>}
            {(withdrawalAdviceLoading || withdrawalAdviceError || withdrawalAdvice) && <section aria-live="polite" className="rounded-xl border border-current/10 p-3 text-sm">
              <h3 className="font-semibold">{isAr ? "إرشادات السحب (للاطلاع فقط)" : "Withdrawal guidance (advisory)"}</h3>
              {withdrawalAdviceLoading && <p className="mt-1 opacity-70">{isAr ? "جارٍ التحقق…" : "Checking…"}</p>}
              {withdrawalAdviceError && <p role="status" className="mt-1 opacity-70">{withdrawalAdviceError}</p>}
              {withdrawalAdvice && <div className="mt-1 flex flex-col gap-1 opacity-80">
                <p>{isAr ? "مستوى الإشارة" : "Risk signal"}: {isAr ? ({ UNKNOWN: "بيانات غير كافية", LOW: "منخفض", MEDIUM: "متوسط", HIGH: "مرتفع" }[withdrawalAdvice.risk] || "غير متاح") : withdrawalAdvice.risk}</p>
                {withdrawalAdvice.signals.map((signal) => <p key={signal.code} role="status">{isAr ? ({ REPEATED_REQUEST_PATTERN: "تم رصد طلبات سحب متكررة مؤخراً.", UNUSUAL_WITHDRAWAL_AMOUNT: "المبلغ أعلى من نمط السحوبات السابقة.", HIGH_REQUEST_FREQUENCY: "عدد طلبات السحب الأخيرة مرتفع." }[signal.code] || "توجد إشارة تستحق المراجعة.") : signal.explanation}</p>)}
                {withdrawalAdvice.paymentMethodRecommendation?.methods?.length > 0 && <p>{isAr ? "الوسائل المدعومة في بلدك:" : "Configured methods for your country:"} {withdrawalAdvice.paymentMethodRecommendation.methods.join(", ")}</p>}
                {withdrawalAdvice.processingTimePrediction?.status === "ESTIMATED" && <p>{isAr ? "متوسط وقت المعالجة التاريخي:" : "Historical median processing time:"} {withdrawalAdvice.processingTimePrediction.medianHours} {isAr ? "ساعة" : "hours"}</p>}
                {withdrawalAdvice.requiresHumanReview && <p>{isAr ? "قد تستدعي هذه الإشارات مراجعة بشرية ولا تغيّر حالة طلبك تلقائياً." : "These signals may warrant human review and do not change your withdrawal automatically."}</p>}
              </div>}
            </section>}
            <button type="button" onClick={() => setAddMethodOpen((value) => !value)} className="self-start text-sm underline">{isAr ? "إضافة وسيلة دفع" : "Add payment method"}</button>
            {addMethodOpen && <div className="flex flex-col gap-2 rounded-xl border border-current/10 p-3">
              <select className={fieldClass} value={methodForm.type} onChange={(event) => setMethodForm({ ...methodForm, type: event.target.value })}>{["PAYPAL", "BANK_TRANSFER", "STC_PAY", "MADA", "OTHER"].map((type) => <option key={type}>{type}</option>)}</select>
              {[["label", isAr ? "الاسم" : "Label"], ["accountName", isAr ? "اسم صاحب الحساب" : "Account name"], ["accountIdentifier", isAr ? "البريد أو رقم الحساب" : "Email or account identifier"], ["bankName", isAr ? "اسم البنك (اختياري)" : "Bank name (optional)"]].map(([key, label]) => <input key={key} className={fieldClass} placeholder={label} required={key !== "bankName"} value={methodForm[key]} onChange={(event) => setMethodForm({ ...methodForm, [key]: event.target.value })} />)}
              <button type="button" disabled={saving} onClick={handleAddPaymentMethod} className="self-start rounded-lg border px-3 py-2 text-sm disabled:opacity-50">{isAr ? "حفظ وسيلة الدفع" : "Save payment method"}</button>
            </div>}
            {actionError && <p role="alert" className="text-sm text-red-500">{actionError}</p>}
            <button type="submit" disabled={saving || !paymentMethods.length || Number(amount) > data.ready} className="rounded-xl bg-gradient-to-r from-[#FFA600] to-[#F96303] px-4 py-3 text-sm font-bold text-white disabled:opacity-40">{saving ? (isAr ? "جارٍ الإرسال…" : "Submitting…") : (isAr ? "إرسال الطلب" : "Submit request")}</button>
          </form>
        </div>
      </div>}
    </div>
  );
}

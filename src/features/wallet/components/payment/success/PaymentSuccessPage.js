"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiLoader,
  FiArrowRight,
  FiCreditCard,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { useWallet } from "@/features/wallet/WalletProvider";
import { getTransactionById } from "@/features/wallet/services/walletService";
import PaymentFailed124Page from "@/features/wallet/components/topup/components/PaymentFailed124Page";
import PaymentCancelled125Page from "@/features/wallet/components/topup/components/PaymentCancelled125Page";

/* ─────────────────────────────────────────────
   Design Tokens
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#94D3C1",
  accentBorder: "rgba(148,211,193,0.35)",
  accentBg: "rgba(148,211,193,0.08)",
  orange: "#FF5A00",
  success: "#10B981",
  successBg: "rgba(16,185,129,0.10)",
  successBorder: "rgba(16,185,129,0.25)",
  warning: "#E9C349",
  warningBg: "rgba(233,195,73,0.10)",
  warningBorder: "rgba(233,195,73,0.25)",
  text: "#FFFFFF",
  sub: "#C5CECA",
  muted: "#8A9490",
};

export default function PaymentSuccessPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { refresh: refreshWallet } = useWallet();

  // استقبال التوكن أو معرّف المعاملة من جميع البوابات (PayPal, Moyasar, Bank Transfer, إلخ)
  const tokenFromUrl =
    searchParams.get("token") ||
    searchParams.get("transactionId") ||
    searchParams.get("payment_id") ||
    searchParams.get("paymentId") ||
    searchParams.get("id") ||
    searchParams.get("payment_token") ||
    searchParams.get("order_id") ||
    searchParams.get("orderId");

  const [activeToken, setActiveToken] = useState(tokenFromUrl || "");

  useEffect(() => {
    if (!tokenFromUrl && typeof window !== "undefined") {
      const saved =
        localStorage.getItem("pendingTransactionId") ||
        sessionStorage.getItem("pendingTransactionId");
      if (saved) setActiveToken(saved);
    } else if (tokenFromUrl) {
      setActiveToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const [status, setStatus] = useState("loading"); // loading | completed | pending | failed | cancelled | error
  const [txnData, setTxnData] = useState(null);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const verifyTransaction = useCallback(async (targetId) => {
    const idToVerify = targetId || activeToken;
    if (!idToVerify) {
      setStatus("error");
      setError("لم يتم العثور على التوكن أو معرّف المعاملة في الرابط.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const json = await getTransactionById(idToVerify);
      if (json?.success === false) {
        setStatus("error");
        setError(json?.message || "حدث خطأ أثناء التحقق من الدفعة.");
        return;
      }

      const txn = json?.data ?? json;
      if (!txn || typeof txn !== "object") {
        setStatus("error");
        setError("تعذّر استرجاع تفاصيل المعاملة من الخادم.");
        return;
      }

      const transactionStatus = String(txn?.status || "").toUpperCase();
      setTxnData(txn);

      if (["COMPLETED", "VERIFIED", "PAID", "SUCCESS"].includes(transactionStatus)) {
        setStatus("completed");
        refreshWallet().catch(() => {});
        if (typeof window !== "undefined") {
          localStorage.removeItem("pendingTransactionId");
          sessionStorage.removeItem("pendingTransactionId");
        }
      } else if (["PENDING", "UNDER_REVIEW", "PROCESSING"].includes(transactionStatus)) {
        setStatus("pending");
      } else if (["FAILED", "DECLINED", "REJECTED", "PAYMENT_FAILED", "ERROR"].includes(transactionStatus)) {
        setStatus("failed");
        setError(txn.failureReason || txn.message || "لم تنجح عملية الدفع. تحقق من وسيلة الدفع وحاول مرة أخرى.");
      } else if (["CANCELLED", "CANCELED", "PAYMENT_CANCELLED"].includes(transactionStatus)) {
        setStatus("cancelled");
      } else {
        setStatus("completed");
        refreshWallet().catch(() => {});
      }
    } catch (err) {
      setStatus("error");
      setError(err?.message || "تعذّر الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    }
  }, [activeToken, refreshWallet]);

  useEffect(() => {
    if (!activeToken) return;
    const timer = window.setTimeout(() => verifyTransaction(activeToken), 0);
    return () => window.clearTimeout(timer);
  }, [activeToken, verifyTransaction]);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
    verifyTransaction(activeToken);
  };

  if (status === "failed") return <PaymentFailed124Page />;
  if (status === "cancelled") return <PaymentCancelled125Page />;

  return (
    <div
      dir="rtl"
      className="min-h-screen text-white pb-16 pt-4"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      <div className="max-w-[760px] mx-auto px-4 sm:px-6">

        {/* ── Header Navigation ── */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/advertiser/wallet/top-up`)}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30">
              <FiArrowRight size={14} />
            </span>
            <span>العودة لإدارة الرصيد</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#8A9490]">
            <FiShield size={13} className="text-[#94D3C1]" />
            <span>اتصال آمن ومشفّر</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            STATE: LOADING
        ══════════════════════════════════════════════ */}
        {status === "loading" && (
          <div
            className="rounded-[20px] border p-8 sm:p-12 text-center"
            style={{ backgroundColor: T.card, borderColor: T.cardBorder }}
          >
            {/* Animated Spinner */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full border-4 border-[#94D3C1]/20 animate-spin"
                  style={{ borderTopColor: T.accent }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MdOutlineAccountBalanceWallet size={28} className="text-[#94D3C1]" />
                </div>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
              جاري التحقق من دفعتك...
            </h1>
            <p className="text-sm text-[#8A9490] leading-relaxed max-w-sm mx-auto">
              نتحقق من حالة المعاملة مع بوابة الدفع. يرجى الانتظار لحظة.
            </p>

            {/* Dots animation */}
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#94D3C1] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            STATE: COMPLETED ✓
        ══════════════════════════════════════════════ */}
        {status === "completed" && txnData && (
          <div className="flex flex-col gap-5">

            {/* Main Success Card */}
            <div
              className="rounded-[20px] border p-6 sm:p-8"
              style={{
                backgroundColor: T.card,
                borderColor: T.successBorder,
                boxShadow: "0 0 40px rgba(16,185,129,0.08)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mx-auto sm:mx-0"
                  style={{ backgroundColor: T.successBg, border: `1.5px solid ${T.successBorder}` }}
                >
                  <FiCheckCircle size={32} className="text-emerald-400" />
                </div>

                {/* Text */}
                <div className="flex-1 text-center sm:text-right">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-2">
                    <BsPatchCheckFill size={14} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold">مؤكّد ومعتمد</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    تم شحن المحفظة بنجاح 🎉
                  </h1>
                  <p className="text-sm text-[#8A9490] leading-relaxed">
                    تمّت معالجة دفعتك بنجاح واعتمادها في محفظتك. رصيدك متاح الآن لتخصيص ميزانيات حملاتك الإعلانية.
                  </p>
                </div>
              </div>

              {/* Transaction Details Grid */}
              <div
                className="mt-6 rounded-xl p-4 sm:p-5 grid grid-cols-2 gap-4"
                style={{ backgroundColor: T.cardInner, border: `1px solid ${T.cardBorder}` }}
              >
                {[
                  { label: "المبلغ المدفوع", value: `$${txnData.grossAmount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "—"}` },
                  { label: "صافي الشحن", value: `$${txnData.netAmount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "—"}` },
                  { label: "العمولة", value: `$${txnData.commission?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "0.00"}` },
                  { label: "وسيلة الدفع", value: txnData.paymentMethod === "PAYPAL" ? "PayPal" : txnData.paymentMethod === "MOYASAR" ? "Moyasar" : txnData.paymentMethod === "BANK_TRANSFER" ? "تحويل بنكي" : txnData.paymentMethod ?? "—" },
                  { label: "الرقم المرجعي", value: txnData.referenceId ?? txnData.id?.slice(0, 12) + "..." ?? "—" },
                  { label: "حالة المعاملة", value: "مكتملة ✓", isGreen: true },
                ].map(({ label, value, isGreen }) => (
                  <div key={label}>
                    <p className="text-[11px] text-[#8A9490] mb-1">{label}</p>
                    <p className={`text-sm font-bold ${isGreen ? "text-emerald-400" : "text-white"}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/advertiser/dashboard`)}
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-[0.98] hover:brightness-110 cursor-pointer"
                  style={{
                    background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
                    boxShadow: "0 4px 15px rgba(251,157,0,0.3)",
                  }}
                >
                  <MdOutlineAccountBalanceWallet size={18} />
                  <span>إدارة ميزانيات الحملات</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/advertiser/wallet/top-up`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <FiCreditCard size={16} />
                  <span>العودة لإدارة المحفظة</span>
                </button>
              </div>
            </div>

            {/* Info Note */}
            <div
              className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ backgroundColor: T.accentBg, border: `1px solid ${T.accentBorder}` }}
            >
              <FiShield size={15} className="text-[#94D3C1] mt-0.5 shrink-0" />
              <p className="text-xs text-[#94D3C1] leading-relaxed">
                تم توثيق هذه المعاملة وحفظها في سجل حسابك. يمكنك مراجعة تاريخ المعاملات في أي وقت من قسم الميزانية والمدفوعات.
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            STATE: PENDING ⏳
        ══════════════════════════════════════════════ */}
        {status === "pending" && txnData && (
          <div className="flex flex-col gap-5">

            <div
              className="rounded-[20px] border p-6 sm:p-8"
              style={{
                backgroundColor: T.card,
                borderColor: T.warningBorder,
                boxShadow: "0 0 40px rgba(233,195,73,0.05)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mx-auto sm:mx-0"
                  style={{ backgroundColor: T.warningBg, border: `1.5px solid ${T.warningBorder}` }}
                >
                  <FiClock size={30} className="text-[#E9C349]" />
                </div>

                <div className="flex-1 text-center sm:text-right">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-2">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: T.warning }}
                    />
                    <span className="text-xs text-[#E9C349] font-semibold">قيد المعالجة</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    جاري معالجة الدفعة ⏳
                  </h1>
                  <p className="text-sm text-[#8A9490] leading-relaxed">
                    دفعتك قيد المراجعة والمعالجة. سنعلمك بالنتيجة فور اكتمال التحقق عبر البريد الإلكتروني.
                  </p>
                </div>
              </div>

              {/* Transaction Details */}
              <div
                className="mt-6 rounded-xl p-4 sm:p-5 grid grid-cols-2 gap-4"
                style={{ backgroundColor: T.cardInner, border: `1px solid ${T.cardBorder}` }}
              >
                {[
                  { label: "المبلغ المرسل", value: `$${txnData.grossAmount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "—"}` },
                  { label: "وسيلة الدفع", value: txnData.paymentMethod === "PAYPAL" ? "PayPal" : txnData.paymentMethod === "MOYASAR" ? "Moyasar" : txnData.paymentMethod === "BANK_TRANSFER" ? "تحويل بنكي" : txnData.paymentMethod ?? "—" },
                  { label: "الرقم المرجعي", value: txnData.referenceId ?? txnData.id?.slice(0, 14) + "..." ?? "—" },
                  { label: "الحالة", value: "قيد المعالجة", isWarning: true },
                ].map(({ label, value, isWarning }) => (
                  <div key={label}>
                    <p className="text-[11px] text-[#8A9490] mb-1">{label}</p>
                    <p className={`text-sm font-bold ${isWarning ? "text-[#E9C349]" : "text-white"}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Retry + Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-white/8 border border-white/15 hover:bg-white/12 transition-all cursor-pointer"
                >
                  <FiRefreshCw size={16} />
                  <span>إعادة التحقق ({retryCount} مرة)</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/advertiser/wallet/top-up`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FiArrowRight size={16} />
                  <span>العودة للمحفظة</span>
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div
              className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ backgroundColor: T.warningBg, border: `1px solid ${T.warningBorder}` }}
            >
              <FiClock size={14} className="text-[#E9C349] mt-0.5 shrink-0" />
              <p className="text-xs text-[#E9C349] leading-relaxed">
                تستغرق عمليات المراجعة عادةً من دقائق إلى 24 ساعة. ستتلقى إشعارًا فور تحديث حالة دفعتك.
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            STATE: ERROR ✕
        ══════════════════════════════════════════════ */}
        {status === "error" && (
          <div
            className="rounded-[20px] border p-8 sm:p-10 text-center"
            style={{
              backgroundColor: T.card,
              borderColor: "rgba(248,113,113,0.25)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "rgba(248,113,113,0.10)", border: "1.5px solid rgba(248,113,113,0.25)" }}
            >
              <FiAlertCircle size={30} className="text-red-400" />
            </div>

            <h1 className="text-xl font-bold text-white mb-2">تعذّر التحقق من الدفعة</h1>
            <p className="text-sm text-[#8A9490] leading-relaxed mb-6 max-w-xs mx-auto">
              {error}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold text-white border border-white/20 bg-white/8 hover:bg-white/12 transition-all cursor-pointer"
              >
                <FiRefreshCw size={15} />
                <span>حاول مجدداً</span>
              </button>
              <button
                type="button"
                onClick={() => router.push(`/${locale}/advertiser/wallet/top-up`)}
                className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <FiArrowRight size={15} />
                <span>العودة للمحفظة</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


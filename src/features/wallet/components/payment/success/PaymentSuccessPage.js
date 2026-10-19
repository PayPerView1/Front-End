"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { capturePayPalOrder, getTransactionById } from "@/features/wallet/services/walletService";
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

function clearPendingTransaction() {
  try {
    localStorage.removeItem("pendingTransactionId");
    sessionStorage.removeItem("pendingTransactionId");
  } catch {}
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { refresh: refreshWallet } = useWallet();
  const paypalOrderId = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | completed | pending | failed | cancelled | error
  const [txnData, setTxnData] = useState(null);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [activeTransactionId, setActiveTransactionId] = useState("");
  const [isPolling, setIsPolling] = useState(false);
  const captureRequestRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const requestPayPalCapture = useCallback((orderId) => {
    if (captureRequestRef.current?.orderId === orderId) {
      return captureRequestRef.current.promise;
    }

    let promise;
    promise = capturePayPalOrder(orderId).catch((cause) => {
      if (captureRequestRef.current?.promise === promise) {
        captureRequestRef.current = null;
      }
      throw cause;
    });
    captureRequestRef.current = { orderId, promise };
    return promise;
  }, []);

  const applyTransactionStatus = useCallback((txn) => {
    const transactionStatus = String(txn?.status || "").toUpperCase();
    setTxnData(txn);

    if (["COMPLETED", "VERIFIED", "PAID", "SUCCESS"].includes(transactionStatus)) {
      setStatus("completed");
      clearPendingTransaction();
      refreshWallet().catch(() => {});
      return "completed";
    }

    if (["FAILED", "DECLINED", "REJECTED", "PAYMENT_FAILED", "ERROR"].includes(transactionStatus)) {
      setStatus("failed");
      setError(txn.failureReason || txn.message || "لم تنجح عملية الدفع. تحقق من وسيلة الدفع وحاول مرة أخرى.");
      clearPendingTransaction();
      return "failed";
    }

    if (["CANCELLED", "CANCELED", "PAYMENT_CANCELLED"].includes(transactionStatus)) {
      setStatus("cancelled");
      clearPendingTransaction();
      return "cancelled";
    }

    // PENDING و UNDER_REVIEW وأي حالة غير نهائية تظل قيد المعالجة.
    setStatus("pending");
    return "pending";
  }, [refreshWallet]);

  const verifyTransaction = useCallback(async (transactionId, isActive = () => isMountedRef.current) => {
    if (!transactionId) {
      if (isActive()) {
        setStatus("error");
        setError("لم يتم العثور على معرّف المعاملة.");
      }
      return;
    }

    setError("");
    setIsPolling(true);
    let lastTransaction = null;

    try {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        if (!isActive()) return;

        const response = await getTransactionById(transactionId);
        if (!isActive()) return;
        if (response?.success === false) {
          throw new Error(response.message || "حدث خطأ أثناء التحقق من الدفعة.");
        }

        const transaction = response?.data ?? response;
        if (!transaction || typeof transaction !== "object") {
          throw new Error("تعذّر استرجاع تفاصيل المعاملة من الخادم.");
        }

        lastTransaction = transaction;
        if (applyTransactionStatus(transaction) !== "pending") return;

        if (attempt < 19) {
          await new Promise((resolve) => window.setTimeout(resolve, 3000));
        }
      }

      if (isActive() && lastTransaction) {
        setTxnData(lastTransaction);
        setStatus("pending");
      }
    } catch (cause) {
      if (isActive()) {
        setStatus("error");
        setError(cause?.message || "تعذّر الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      if (isActive()) setIsPolling(false);
    }
  }, [applyTransactionStatus]);

  const runPayPalCapture = useCallback(async (orderId, isActive = () => isMountedRef.current) => {
    if (!orderId) return;
    setError("");

    try {
      const response = await requestPayPalCapture(orderId);
      if (!isActive()) return;
      if (response?.success === false) {
        throw new Error(response.message || "تعذّر تأكيد دفعة PayPal.");
      }

      const capture = response?.data ?? response;
      if (!capture || typeof capture !== "object") {
        throw new Error("تعذّر استرجاع نتيجة تأكيد دفعة PayPal.");
      }

      const transactionId = capture.transactionId ? String(capture.transactionId) : "";
      if (transactionId) setActiveTransactionId(transactionId);
      const transaction = {
        ...capture,
        id: transactionId,
        paymentMethod: capture.paymentMethod || "PAYPAL",
      };
      const captureStatus = String(capture.status || "").toUpperCase();

      if (["COMPLETED", "VERIFIED", "PAID", "SUCCESS"].includes(captureStatus)) {
        applyTransactionStatus(transaction);
        return;
      }

      if (["FAILED", "DECLINED", "REJECTED", "PAYMENT_FAILED", "ERROR", "CANCELLED", "CANCELED"].includes(captureStatus)) {
        applyTransactionStatus(transaction);
        return;
      }

      setTxnData(transaction);
      setStatus("pending");
      if (transactionId) await verifyTransaction(transactionId, isActive);
    } catch (cause) {
      if (isActive()) {
        setStatus("error");
        setError(cause?.message || "تعذّر تأكيد دفعة PayPal. يرجى المحاولة مرة أخرى.");
      }
    }
  }, [applyTransactionStatus, requestPayPalCapture, verifyTransaction]);

  useEffect(() => {
    let isActive = true;

    if (paypalOrderId) {
      runPayPalCapture(paypalOrderId, () => isActive);
    } else {
      let transactionId = "";
      try {
        transactionId =
          localStorage.getItem("pendingTransactionId") ||
          sessionStorage.getItem("pendingTransactionId") ||
          "";
      } catch {}

      if (transactionId) {
        setActiveTransactionId(transactionId);
        verifyTransaction(transactionId, () => isActive);
      } else {
        setStatus("error");
        setError("لم يتم العثور على معرّف المعاملة المحفوظ للتحقق من الدفعة.");
      }
    }

    return () => {
      isActive = false;
    };
  }, [paypalOrderId, runPayPalCapture, verifyTransaction]);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
    if (activeTransactionId) {
      verifyTransaction(activeTransactionId);
    } else if (paypalOrderId) {
      setStatus("loading");
      runPayPalCapture(paypalOrderId);
    }
  };

  if (status === "failed") return <PaymentFailed124Page />;
  if (status === "cancelled") return <PaymentCancelled125Page />;

  return (
    <div
      dir="rtl"
      className="wallet-theme-page min-h-screen text-white pb-16 pt-4"
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
                    {isPolling
                      ? "نتحقق تلقائيًا من حالة الدفعة كل 3 ثوانٍ. قد يستغرق وصول تأكيد بوابة الدفع بضع لحظات."
                      : "ما زالت الدفعة قيد المعالجة. سيتحدث رصيدك فور تأكيدها، ويمكنك متابعة الحالة من سجل المعاملات."}
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
                  disabled={isPolling}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-white/8 border border-white/15 hover:bg-white/12 transition-all cursor-pointer disabled:cursor-wait disabled:opacity-60"
                >
                  <FiRefreshCw size={16} />
                  <span>{isPolling ? "جاري التحقق..." : `إعادة التحقق (${retryCount} مرة)`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/advertiser/wallet/top-up`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FiArrowRight size={16} />
                  <span>العودة للمحفظة</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/advertiser/wallet/transactions`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FiCreditCard size={16} />
                  <span>سجل المعاملات</span>
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
                إذا لم يتحدث الرصيد خلال دقيقة، راجع سجل المعاملات. قد تبقى العملية معلّقة إذا لم يكتمل الدفع.
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

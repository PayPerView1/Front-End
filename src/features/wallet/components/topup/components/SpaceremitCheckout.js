"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiGlobe,
  FiLoader,
  FiLock,
  FiRefreshCw,
  FiShield,
  FiXCircle,
} from "react-icons/fi";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useWallet } from "@/features/wallet/WalletProvider";
import {
  getTransactionById,
  verifySpaceremitPayment,
} from "@/features/wallet/services/walletService";

const SPACEREMIT_SCRIPT_URL = "https://spaceremit.com/api/v2/js_script/spaceremit.js";
export const SPACEREMIT_SESSION_KEY = "wallet:spaceremit-session";

const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  accent: "#94D3C1",
  accentBorder: "rgba(148, 211, 193, 0.35)",
  accentBg: "rgba(148, 211, 193, 0.08)",
  warning: "#E9C349",
  warningBg: "rgba(233, 195, 73, 0.12)",
  warningBorder: "rgba(233, 195, 73, 0.30)",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.10)",
  successBorder: "rgba(16, 185, 129, 0.25)",
  danger: "#F87171",
  dangerBg: "rgba(248, 113, 113, 0.10)",
  dangerBorder: "rgba(248, 113, 113, 0.28)",
  muted: "#8A9490",
};

function clearSpaceremitStorage() {
  try {
    sessionStorage.removeItem(SPACEREMIT_SESSION_KEY);
    localStorage.removeItem("pendingTransactionId");
    sessionStorage.removeItem("pendingTransactionId");
  } catch {}
}

export default function SpaceremitCheckout({
  transactionId,
  spaceremit,
  onBack,
}) {
  const router = useRouter();
  const locale = useLocale();
  const { refresh: refreshWallet } = useWallet();

  const [payType, setPayType] = useState("card-pay");
  const [status, setStatus] = useState("loading_sdk"); // loading_sdk | ready | authenticating | verifying | completed | pending | failed | cancelled | verify_error | sdk_error
  const [gatewayMessage, setGatewayMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [txnData, setTxnData] = useState(null);
  const [lastPaymentCode, setLastPaymentCode] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  const isMountedRef = useRef(true);
  const verifyingRef = useRef(false);
  const verifiedCodesRef = useRef(new Set());
  const callbacksRef = useRef({});

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const applyVerifiedTransaction = useCallback(
    async (txn) => {
      const normalizedStatus = String(txn?.status || "").toUpperCase();
      setTxnData(txn);

      if (["COMPLETED", "VERIFIED", "PAID", "SUCCESS"].includes(normalizedStatus)) {
        setStatus("completed");
        clearSpaceremitStorage();
        await refreshWallet().catch(() => {});
        return "completed";
      }

      if (["FAILED", "DECLINED", "REJECTED", "PAYMENT_FAILED", "ERROR"].includes(normalizedStatus)) {
        setStatus("failed");
        setErrorMessage(
          txn?.failureReason || txn?.message || "لم تنجح عملية الدفع عبر Spaceremit. يرجى المحاولة مرة أخرى."
        );
        clearSpaceremitStorage();
        return "failed";
      }

      if (["CANCELLED", "CANCELED", "PAYMENT_CANCELLED"].includes(normalizedStatus)) {
        setStatus("cancelled");
        clearSpaceremitStorage();
        return "cancelled";
      }

      setStatus("pending");
      return "pending";
    },
    [refreshWallet]
  );

  const pollPendingTransaction = useCallback(
    async (txnId) => {
      if (!txnId || !isMountedRef.current) return;
      setIsPolling(true);
      try {
        for (let attempt = 0; attempt < 20; attempt += 1) {
          if (!isMountedRef.current) return;
          const res = await getTransactionById(txnId);
          if (!isMountedRef.current) return;
          const txn = res?.data ?? res;
          if (txn && typeof txn === "object") {
            const next = await applyVerifiedTransaction(txn);
            if (next !== "pending") return;
          }
          if (attempt < 19) {
            await new Promise((resolve) => window.setTimeout(resolve, 3000));
          }
        }
      } catch (err) {
        if (isMountedRef.current) {
          setErrorMessage(err?.message || "تعذر متابعة حالة المعاملة حالياً.");
        }
      } finally {
        if (isMountedRef.current) setIsPolling(false);
      }
    },
    [applyVerifiedTransaction]
  );

  const handleVerifyCode = useCallback(
    async (paymentCode, forceRetry = false) => {
      if (!paymentCode) return;
      if (verifyingRef.current) return;
      if (!forceRetry && verifiedCodesRef.current.has(paymentCode)) return;

      verifyingRef.current = true;
      verifiedCodesRef.current.add(paymentCode);
      setLastPaymentCode(paymentCode);
      setErrorMessage("");
      setGatewayMessage("");
      setStatus("verifying");

      try {
        const res = await verifySpaceremitPayment({
          paymentCode,
          transactionId,
          verifyUrl: spaceremit?.verifyUrl,
        });
        if (!isMountedRef.current) return;

        if (res?.success === false) {
          throw new Error(res?.message || "فشل التحقق من عملية الدفع مع الخادم.");
        }

        const payload = res?.data ?? res;
        const txn = payload?.transaction ?? payload;
        const resolvedTxn = {
          ...(typeof txn === "object" && txn ? txn : {}),
          id: txn?.id || txn?.transactionId || transactionId,
          transactionId: txn?.transactionId || transactionId,
          paymentMethod: txn?.paymentMethod || "SPACEREMIT",
          status: txn?.status || payload?.status || "COMPLETED",
        };

        const outcome = await applyVerifiedTransaction(resolvedTxn);
        if (outcome === "pending") {
          await pollPendingTransaction(resolvedTxn.transactionId);
        }
      } catch (err) {
        if (isMountedRef.current) {
          setStatus("verify_error");
          setErrorMessage(
            err?.message || "تعذر التحقق من الدفع لدى الخادم. يمكنك إعادة المحاولة دون إعادة الدفع."
          );
        }
      } finally {
        verifyingRef.current = false;
      }
    },
    [applyVerifiedTransaction, pollPendingTransaction, spaceremit, transactionId]
  );

  // Update callbacks ref in an effect to avoid "Cannot update ref during render"
  useEffect(() => {
    callbacksRef.current = {
      onSuccess: (code) => {
        if (!isMountedRef.current) return;
        handleVerifyCode(code, false);
      },
      onFailed: () => {
        if (!isMountedRef.current) return;
        if (verifyingRef.current || status === "completed" || status === "verifying") return;
        setStatus("failed");
        setErrorMessage("تم إلغاء الدفع أو فشل تنفيذه عبر بوابة Spaceremit.");
      },
      onMessage: (message) => {
        if (!isMountedRef.current || !message) return;
        setGatewayMessage(String(message));
      },
      onNeedAuth: () => {
        if (!isMountedRef.current) return;
        setStatus("authenticating");
      },
    };
  }, [handleVerifyCode, status]);

  useEffect(() => {
    if (!spaceremit?.publicKey || !transactionId) {
      // Defer setState to avoid calling it synchronously inside an effect body
      const t = window.setTimeout(() => {
        setStatus("sdk_error");
        setErrorMessage("بيانات تهيئة Spaceremit غير مكتملة.");
      }, 0);
      return () => window.clearTimeout(t);
    }

    // Bind global Spaceremit config and callbacks expected by spaceremit.js
    window.SP_PUBLIC_KEY = spaceremit.publicKey;
    window.SP_FORM_ID = "#spaceremit-form";
    window.SP_SELECT_RADIO_NAME = "sp-pay-type-radio";
    window.LOCAL_METHODS_BOX_STATUS = true;
    window.LOCAL_METHODS_PARENT_ID = "#spaceremit-local-methods-pay";
    window.CARD_BOX_STATUS = true;
    window.CARD_BOX_PARENT_ID = "#spaceremit-card-pay";
    window.SP_FORM_AUTO_SUBMIT_WHEN_GET_CODE = false;

    window.SP_SUCCESSFUL_PAYMENT = (code) => callbacksRef.current.onSuccess(code);
    window.SP_FAILD_PAYMENT = () => callbacksRef.current.onFailed();
    window.SP_RECIVED_MESSAGE = (msg) => callbacksRef.current.onMessage(msg);
    window.SP_NEED_AUTH = (link) => callbacksRef.current.onNeedAuth(link);

    const existingScript = document.querySelector(
      `script[src="${SPACEREMIT_SCRIPT_URL}"], script[data-spaceremit-sdk="true"]`
    );

    if (existingScript || window.__SPACEREMIT_SDK_LOADED__) {
      const cardIframe = document.getElementById("sp_iframe");
      const localIframe = document.getElementById("sp_local_nethods_iframe");
      if (cardIframe || localIframe) {
        const t = window.setTimeout(() => {
          if (isMountedRef.current) setStatus("ready");
        }, 0);
        return () => window.clearTimeout(t);
      } else {
        // spaceremit.js declares top-level consts and binds to the DOM once per page load.
        // Reload cleanly with the active session stored in sessionStorage instead of loading the script twice.
        try {
          sessionStorage.setItem(
            SPACEREMIT_SESSION_KEY,
            JSON.stringify({ transactionId, spaceremit })
          );
          const url = new URL(window.location.href);
          url.searchParams.set("spaceremit", "1");
          window.location.replace(url.toString());
        } catch {
          const t = window.setTimeout(() => {
            if (isMountedRef.current) {
              setStatus("sdk_error");
              setErrorMessage("يرجى تحديث الصفحة لتهيئة نموذج Spaceremit.");
            }
          }, 0);
          return () => window.clearTimeout(t);
        }
      }
      return;
    }

    const script = document.createElement("script");
    script.src = SPACEREMIT_SCRIPT_URL;
    script.async = true;
    script.setAttribute("data-spaceremit-sdk", "true");
    script.onload = () => {
      window.__SPACEREMIT_SDK_LOADED__ = true;
      if (isMountedRef.current) {
        setStatus((prev) => (prev === "loading_sdk" ? "ready" : prev));
      }
    };
    script.onerror = () => {
      if (isMountedRef.current) {
        setStatus("sdk_error");
        setErrorMessage("تعذر تحميل مكتبة بوابة الدفع Spaceremit. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
      }
    };

    document.body.appendChild(script);
  }, [spaceremit, transactionId]);

  const handleCancelCheckout = () => {
    clearSpaceremitStorage();
    setStatus("cancelled");
  };

  const handleBackToMethods = () => {
    clearSpaceremitStorage();
    onBack?.();
  };

  const displayAmount = Number(spaceremit?.amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (status === "completed") {
    return (
      <div dir="rtl" className="min-h-screen text-white pb-16 pt-6" style={{ backgroundColor: T.bg }}>
        <div className="max-w-[760px] mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ backgroundColor: T.card, borderColor: T.successBorder }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: T.successBg, border: `1px solid ${T.successBorder}` }}
              >
                <FiCheckCircle size={24} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 mb-2">
                  <BsPatchCheckFill size={13} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">تم التأكيد من الخادم</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">تم شحن المحفظة بنجاح</h1>
                <p className="text-sm text-[#8A9490]">
                  تم التحقق من دفعتك عبر Spaceremit وتحديث رصيد محفظتك وسجل المعاملات.
                </p>
              </div>
            </div>

            <div
              className="mt-6 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
              style={{ backgroundColor: T.cardInner, border: `1px solid ${T.cardBorder}` }}
            >
              <div>
                <p className="text-[11px] text-[#8A9490] mb-1">المبلغ</p>
                <p className="text-sm font-bold text-white" dir="ltr">
                  {displayAmount} {spaceremit?.currency || "USD"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#8A9490] mb-1">وسيلة الدفع</p>
                <p className="text-sm font-bold text-white">Spaceremit</p>
              </div>
              <div>
                <p className="text-[11px] text-[#8A9490] mb-1">معرّف المعاملة</p>
                <p className="text-xs font-mono text-white truncate" dir="ltr">
                  {txnData?.transactionId || transactionId}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#8A9490] mb-1">الحالة</p>
                <p className="text-sm font-bold text-emerald-400">مكتملة</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={() => router.push(`/${locale}/advertiser/wallet`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white cursor-pointer"
                style={{ background: "linear-gradient(90deg, #FDA100 0%, #FE5403 100%)" }}
              >
                <MdOutlineAccountBalanceWallet size={18} />
                <span>الذهاب إلى المحفظة</span>
              </button>
              <button
                type="button"
                onClick={() => router.push(`/${locale}/advertiser/wallet/transactions`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white border border-white/15 bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                <span>عرض سجل المعاملات</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="wallet-theme-page min-h-screen text-white pb-16 pt-6"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      <div className="max-w-[780px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={handleBackToMethods}
            disabled={status === "verifying"}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
              <FiArrowRight size={14} />
            </span>
            <span>العودة لخيارات الدفع</span>
          </button>

          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs"
            style={{ backgroundColor: T.accentBg, borderColor: T.accentBorder, color: T.accent }}
          >
            <FiLock size={12} />
            <span>بوابة الدفع الآمنة Spaceremit</span>
          </div>
        </div>

        {/* Summary Card */}
        <div
          className="rounded-2xl border p-5 mb-5 flex flex-wrap items-center justify-between gap-4"
          style={{ backgroundColor: T.card, borderColor: T.cardBorder }}
        >
          <div>
            <p className="text-xs text-[#8A9490] mb-1">المبلغ المطلوب للشحن</p>
            <p className="text-2xl font-bold text-white font-mono" dir="ltr">
              {displayAmount} {spaceremit?.currency || "USD"}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-[#8A9490] mb-1">مرجع المعاملة</p>
            <p className="text-xs font-mono text-gray-300" dir="ltr">
              {transactionId}
            </p>
          </div>
        </div>

        {/* Gateway / Verification Status Banners */}
        {gatewayMessage && (
          <div
            className="rounded-xl border p-4 mb-5 flex items-center gap-3 text-sm"
            style={{ backgroundColor: T.warningBg, borderColor: T.warningBorder, color: T.warning }}
          >
            <FiAlertCircle size={18} className="shrink-0" />
            <span>{gatewayMessage}</span>
          </div>
        )}

        {status === "verifying" && (
          <div
            className="rounded-2xl border p-6 mb-5 flex items-center gap-4"
            style={{ backgroundColor: T.card, borderColor: T.accentBorder }}
          >
            <FiLoader size={24} className="text-[#94D3C1] animate-spin shrink-0" />
            <div>
              <h2 className="text-base font-bold text-white">جاري التحقق من عملية الدفع...</h2>
              <p className="text-xs text-[#8A9490] mt-1">
                تم استلام رمز الدفع من Spaceremit، ننتظر الآن تأكيد الخادم قبل تحديث رصيد محفظتك.
              </p>
            </div>
          </div>
        )}

        {status === "pending" && (
          <div
            className="rounded-2xl border p-6 mb-5"
            style={{ backgroundColor: T.card, borderColor: T.warningBorder }}
          >
            <div className="flex items-start gap-3">
              <FiClock size={22} className="text-[#E9C349] shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-base font-bold text-white">الدفعة قيد المعالجة</h2>
                <p className="text-xs text-[#8A9490] mt-1">
                  {isPolling
                    ? "جاري التحقق التلقائي من تأكيد المعاملة مع الخادم..."
                    : "المعاملة ما زالت قيد المراجعة أو المعالجة. سيتم تحديث رصيدك فور اكتمالها."}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => pollPendingTransaction(transactionId)}
                    disabled={isPolling}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white cursor-pointer disabled:opacity-50"
                  >
                    <FiRefreshCw size={14} className={isPolling ? "animate-spin" : ""} />
                    <span>{isPolling ? "جاري الفحص..." : "تحديث الحالة"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/advertiser/wallet/transactions`)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-white/15 text-gray-200 cursor-pointer"
                  >
                    <span>سجل المعاملات</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {(status === "failed" || status === "cancelled" || status === "verify_error" || status === "sdk_error") && (
          <div
            className="rounded-2xl border p-6 mb-5"
            style={{ backgroundColor: T.card, borderColor: T.dangerBorder }}
          >
            <div className="flex items-start gap-3">
              <FiXCircle size={22} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-base font-bold text-white">
                  {status === "cancelled"
                    ? "تم إلغاء عملية الدفع"
                    : status === "verify_error"
                    ? "تعذر التحقق من الدفعة"
                    : "لم تكتمل عملية الدفع"}
                </h2>
                <p className="text-xs text-[#8A9490] mt-1">
                  {errorMessage ||
                    (status === "cancelled"
                      ? "لقد قمت بإلغاء عملية الدفع قبل إتمامها."
                      : "حدث خطأ أثناء معالجة الدفع.")}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {status === "verify_error" && lastPaymentCode && (
                    <button
                      type="button"
                      onClick={() => handleVerifyCode(lastPaymentCode, true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                      style={{ background: "linear-gradient(90deg, #FDA100 0%, #FE5403 100%)" }}
                    >
                      <FiRefreshCw size={14} />
                      <span>إعادة محاولة التحقق</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleBackToMethods}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-white/15 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                  >
                    <span>العودة واختيار وسيلة دفع أخرى</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spaceremit Official Form — kept mounted with CSS visibility so spaceremit.js iframes are never detached */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 ${
            ["verifying", "pending", "cancelled", "sdk_error"].includes(status) ? "hidden" : "block"
          }`}
          style={{ backgroundColor: T.card, borderColor: T.cardBorder }}
        >
            {status === "loading_sdk" && (
              <div className="flex items-center gap-2.5 text-xs text-[#94D3C1] mb-4">
                <FiLoader size={14} className="animate-spin" />
                <span>جاري تحميل نموذج الدفع الآمن من Spaceremit...</span>
              </div>
            )}

            {status === "authenticating" && (
              <div className="flex items-center gap-2.5 text-xs text-[#E9C349] mb-4">
                <FiShield size={14} />
                <span>جاري إتمام التحقق الأمني (3D Secure) مع البنك المصدر...</span>
              </div>
            )}

            <form
              id="spaceremit-form"
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              {/* Hidden fields consumed by spaceremit.js */}
              <input type="hidden" name="amount" value={String(spaceremit?.amount ?? "")} />
              <input type="hidden" name="currency" value={String(spaceremit?.currency ?? "USD")} />
              <input type="hidden" name="notes" value={String(spaceremit?.notes ?? "")} />

              {/* Payment Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className="flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all"
                  style={{
                    backgroundColor: payType === "card-pay" ? T.accentBg : T.cardInner,
                    borderColor: payType === "card-pay" ? T.accentBorder : T.cardBorder,
                  }}
                >
                  <input
                    type="radio"
                    name="sp-pay-type-radio"
                    value="card-pay"
                    checked={payType === "card-pay"}
                    onChange={() => setPayType("card-pay")}
                    className="accent-[#94D3C1]"
                  />
                  <FiCreditCard size={18} className="text-[#94D3C1] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">البطاقة البنكية</span>
                    <span className="text-[10px] text-[#8A9490]">Visa / Mastercard</span>
                  </div>
                </label>

                <label
                  className="flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all"
                  style={{
                    backgroundColor: payType === "local-methods-pay" ? T.accentBg : T.cardInner,
                    borderColor: payType === "local-methods-pay" ? T.accentBorder : T.cardBorder,
                  }}
                >
                  <input
                    type="radio"
                    name="sp-pay-type-radio"
                    value="local-methods-pay"
                    checked={payType === "local-methods-pay"}
                    onChange={() => setPayType("local-methods-pay")}
                    className="accent-[#94D3C1]"
                  />
                  <FiGlobe size={18} className="text-[#94D3C1] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">طرق الدفع المحلية</span>
                    <span className="text-[10px] text-[#8A9490]">محافظ ووسائل محلية</span>
                  </div>
                </label>
              </div>

              {/* Spaceremit Card Box */}
              <div
                className={`rounded-xl border p-3 bg-white ${
                  payType === "card-pay" ? "block" : "hidden"
                }`}
                style={{ borderColor: T.cardBorder }}
              >
                <div id="spaceremit-card-pay" className="min-h-[140px]" />
              </div>

              {/* Spaceremit Local Methods Box */}
              <div
                className={`rounded-xl border p-3 bg-white ${
                  payType === "local-methods-pay" ? "block" : "hidden"
                }`}
                style={{ borderColor: T.cardBorder }}
              >
                <div id="spaceremit-local-methods-pay" className="min-h-[307px]" />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === "loading_sdk"}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                  style={{ background: "linear-gradient(90deg, #FDA100 0%, #FE5403 100%)" }}
                >
                  إتمام الدفع عبر Spaceremit
                </button>
                <button
                  type="button"
                  onClick={handleCancelCheckout}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-white/15 bg-white/5 hover:bg-white/10 cursor-pointer"
                >
                  إلغاء العملية
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}

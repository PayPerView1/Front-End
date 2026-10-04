"use client";

import { useState } from "react";
import {
  FiCheck,
  FiCreditCard,
  FiSmartphone,
  FiLock,
  FiCheckCircle,
  FiDatabase,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { fundWallet } from "@/features/wallet/services/walletService";
import { useWallet } from "@/features/wallet/WalletProvider";

/* ─────────────────────────────────────────────
   Design Tokens — MacBook Pro 16_ - 136
───────────────────────────────────────────── */
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
  text: "#FFFFFF",
  muted: "#8A9490",
};

/* ── Payment Method Card ── */
function PaymentCard({ id, selected, onSelect, icon, title, subtitle, disabled = false }) {
  const isSelected = selected === id;
  return (
    <div
      onClick={() => !disabled && onSelect(id)}
      aria-disabled={disabled}
      className={`rounded-xl border p-3.5 flex items-center gap-3 transition-all ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
      style={{
        backgroundColor: isSelected ? "rgba(148, 211, 193, 0.06)" : T.cardInner,
        borderColor: isSelected
          ? "rgba(148, 211, 193, 0.50)"
          : T.cardBorder,
        boxShadow: isSelected ? "0 0 12px rgba(148, 211, 193, 0.10)" : "none",
      }}
    >
      {/* Radio */}
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all"
        style={{
          backgroundColor: isSelected ? T.accent : "transparent",
          border: isSelected
            ? `2px solid ${T.accent}`
            : "2px solid rgba(255,255,255,0.2)",
        }}
      >
        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
      </div>

      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
        style={{
          backgroundColor: isSelected
            ? "rgba(148, 211, 193, 0.12)"
            : "rgba(255,255,255,0.05)",
          border: `1px solid ${isSelected ? "rgba(148, 211, 193, 0.30)" : "rgba(255,255,255,0.08)"}`,
          color: isSelected ? T.accent : "#8A9490",
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <span
          className={`text-xs font-bold block ${isSelected ? "text-white" : "text-gray-300"}`}
        >
          {title}
        </span>
        <span className="text-[10px] text-gray-500">{subtitle}</span>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function WalletTopupPage({
  initialAmount = "5,000",
  onAmountChange,
  onFailure,
  onValidationFailure,
}) {
  const router = useRouter();
  const locale = useLocale();
  const { balance } = useWallet();

  const [customAmount, setCustomAmount] = useState(String(initialAmount));
  const normalizedAmount = customAmount.replace(/,/g, "").trim();
  const amount = Number(normalizedAmount) || 0;
  const hasValidAmountFormat =
    normalizedAmount === "" || /^(?:(?:\d{1,3}(?:,\d{3})+)|\d+)?(?:\.\d{0,2})?$/.test(customAmount.trim());
  const [selectedMethod, setSelectedMethod] = useState("paypal");
  const [toastMessage, setToastMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [1000, 2500, 5000, 10000];
  const sarRate = 3.75;
  const vatRate = 0.15;
  const gatewayFeeRate = 0.015;
  const vatAmount = amount * vatRate;
  const gatewayFee = amount * gatewayFeeRate;
  const totalSAR = (amount + vatAmount + gatewayFee) * sarRate;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setCustomAmount(raw);
    onAmountChange?.(raw);
  };

  const handleQuickAmount = (val) => {
    const formatted = val.toLocaleString("en-US");
    setCustomAmount(formatted);
    onAmountChange?.(formatted);
  };

  const handleProceed = async () => {
    if (customAmount.trim() && !hasValidAmountFormat) {
      if (onValidationFailure) return onValidationFailure("135", customAmount);
      showToast("أدخل مبلغاً صحيحاً بالأرقام فقط.");
      return;
    }
    if (amount < 10) {
      if (onValidationFailure) return onValidationFailure("133", customAmount);
      showToast("المبلغ الأدنى للشحن هو $10.00 USD");
      return;
    }
    if (amount > 10000) {
      if (onValidationFailure) return onValidationFailure("134", customAmount);
      showToast("الحد الأقصى للشحن هو $10,000 USD");
      return;
    }
    setIsProcessing(true);
    try {
      const paymentMethod = selectedMethod === "bank_transfer" ? "BANK_TRANSFER" : selectedMethod === "moyasar" ? "MOYASAR" : "PAYPAL";
      const response = await fundWallet({ amount, paymentMethod });
      if (response?.success === false) throw new Error(response.message || "تعذّر بدء عملية الشحن.");
      const data = response?.data ?? response;
      if (data.invoiceUrl) {
        if (data.transactionId) {
          try { localStorage.setItem("pendingTransactionId", data.transactionId); } catch {}
        }
        window.location.assign(data.invoiceUrl);
      } else if (data.redirectUrl) {
        if (data.transactionId) {
          try { localStorage.setItem("pendingTransactionId", data.transactionId); } catch {}
        }
        window.location.assign(data.redirectUrl);
      } else if (paymentMethod === "BANK_TRANSFER") {
        try { sessionStorage.setItem("wallet:bank-transfer", JSON.stringify({ ...data, amount })); } catch {}
        router.push(`/${locale}/advertiser/wallet/bank-transfer?transactionId=${encodeURIComponent(data.transactionId || "")}`);
      } else if (data.transactionId) {
        router.push(`/${locale}/advertiser/wallet/payment/success?transactionId=${encodeURIComponent(data.transactionId)}`);
      } else {
        throw new Error("لم يُرجع الخادم معرّفاً لعملية الشحن.");
      }
    } catch (error) {
      const message = error?.message || "تعذّر بدء عملية الشحن. حاول مرة أخرى.";
      if (onFailure) onFailure(message);
      else showToast(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen text-white pb-12"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999999] bg-[#151819] border border-[#94D3C1]/40 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <FiCheckCircle size={16} className="text-[#94D3C1] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div  className="max-w-[1480px] mx-auto w-full min-w-0 px-4 sm:px-6 pt-4 sm:pt-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all shrink-0 mt-0.5"
            >
              <FiChevronRight size={18} />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  شحن المحفظة الرقمية
                </h1>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(148, 211, 193, 0.08)",
                    borderColor: "rgba(148, 211, 193, 0.30)",
                    color: T.accent,
                  }}
                >
                  <BsPatchCheckFill size={13} />
                  <span>معاملة مشفرة وآمنة بنظام الضمان المعتمد</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
                حدود المعاملة الواحدة تبدأ من{" "}
                <span className="text-white font-medium" dir="ltr">$10.00</span>{" "}
                <span className="text-[#E9C349] font-medium">(37.50 ر.س)</span> وتصل كحد أقصى إلى{" "}
                <span className="text-white font-medium" dir="ltr">$10,000.00</span>{" "}
                <span className="text-[#E9C349] font-medium">(37,500.00 ر.س)</span>{" "}
                وفقاً لتشريعات الدفع الإلكتروني المصرفي المعتمدة.
              </p>
            </div>
          </div>

          {/* Balance Card in Header (Top Left in RTL) */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <div
              className="rounded-[14px] border px-4 py-3 flex items-center gap-4 shrink-0"
              style={{ backgroundColor: T.card, borderColor: T.cardBorder }}
            >
              <div>
                <span className="text-[11px] text-gray-400 block mb-0.5">الرصيد المتاح للإنفاق</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white font-mono" dir="ltr">
                    {balance == null ? "—" : Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-[#E9C349] font-medium" dir="ltr">
                    {balance == null ? "—" : (Number(balance) * 3.75).toLocaleString("en-US")} ر.س
                  </span>
                </div>
              </div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <MdOutlineAccountBalanceWallet size={18} className="text-[#94D3C1]" />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MAIN GRID — RTL order:
            First div  → appears on RIGHT
            Second div → appears on LEFT
            RIGHT (col-8): تحديد الشحن + وسائل الدفع + Footer
            LEFT  (col-4): فحص ومعايير المعاملة
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ══════════ RIGHT COLUMN (first = يمين في RTL) ══════════
              تحديد قيمة الشحن + وسائل الدفع + Footer
          ══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col gap-5">

            {/* ── Section 1: تحديد قيمة الشحن ── */}
            <div
              className="rounded-[14px] border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: T.accentBg, border: `1px solid ${T.accentBorder}` }}
                  >
                    <MdOutlineAccountBalanceWallet size={16} className="text-[#94D3C1]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">تحديد قيمة الشحن</h2>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      العملة الأساسية للحساب: الدولار الأمريكي (USD)
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div
                className="flex min-w-0 items-center rounded-xl border px-4 py-3 mb-4 gap-3"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor:
                    !hasValidAmountFormat
                      ? "rgba(248, 113, 113, 0.55)"
                      : amount >= 10 && amount <= 10000
                      ? "rgba(148, 211, 193, 0.40)"
                      : amount > 0
                      ? "rgba(248, 113, 113, 0.35)"
                      : T.cardBorder,
                }}
              >
               <span className="text-xs text-gray-400 font-mono shrink-0">USD</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="min-w-0 w-full flex-1 bg-transparent text-2xl sm:text-3xl font-bold text-white outline-none placeholder-gray-600 font-mono tracking-tight"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  dir="ltr"
                />
              </div>

              {/* Quick Amounts */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] text-gray-500">
                    خيارات مبالغ معتمدة ومطابقة للحدود
                  </span>
                  <span className="text-[10px] text-gray-500">تطبيق فوري معتمد</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {quickAmounts.map((q) => {
                    const isActive = amount === q;
                    const isTop = q === 10000;
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleQuickAmount(q)}
                        className="flex flex-col items-center py-3 px-2 rounded-xl border transition-all cursor-pointer hover:brightness-110"
                        style={{
                          backgroundColor: isActive
                            ? isTop
                              ? "rgba(251, 157, 0, 0.15)"
                              : "rgba(148, 211, 193, 0.10)"
                            : T.cardInner,
                          borderColor: isActive
                            ? isTop
                              ? "rgba(251, 157, 0, 0.55)"
                              : "rgba(148, 211, 193, 0.50)"
                            : T.cardBorder,
                        }}
                      >
                        <span
                          className="text-sm font-bold font-mono"
                          style={{
                            color: isActive
                              ? isTop
                                ? "#FB9D00"
                                : T.accent
                              : "#C5CECA",
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                          }}
                          dir="ltr"
                        >
                          ${q.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-gray-500 mt-0.5" dir="ltr">
                          ر.س {(q * sarRate).toLocaleString()}
                        </span>
                        {isTop && isActive && (
                          <span
                            className="text-[8px] font-bold mt-1 px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: "rgba(251, 157, 0, 0.20)",
                              color: "#FB9D00",
                            }}
                          >
                            أعلى قيمة مسموحة فورياً
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div
                className="rounded-xl border p-4"
                style={{ backgroundColor: T.cardInner, borderColor: T.cardBorder }}
              >
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-gray-400">
                    <span dir="ltr" className="font-mono font-medium text-gray-300">
                      {(amount * sarRate).toLocaleString("en-US", { minimumFractionDigits: 2 })} ر.س
                    </span>
                    <span>المعادل بالريال السعودي (سعر الصرف 1 USD = 3.75 SAR):</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span dir="ltr" className="font-mono font-medium text-gray-300">
                      {vatAmount.toFixed(2)}$
                    </span>
                    <span>ضريبة القيمة المضافة (%15):</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span dir="ltr" className="font-mono font-medium text-gray-300">
                      {gatewayFee.toFixed(2)}$
                    </span>
                    <span>رسوم بوابة الدفع الإلكترونية (%1.5):</span>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-white" dir="ltr">
                        {totalSAR.toLocaleString("en-US", { minimumFractionDigits: 2 })} ر.س
                      </span>
                      <span className="text-xs font-bold text-white">الإجمالي المطلوب دفعه:</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: وسيلة الدفع المفضلة ── */}
            <div
              className="rounded-[14px] border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <FiCreditCard size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">وسيلة الدفع المفضلة</h2>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      يتم تفعيل قنوات الدفع بعد استيفاء الحد الأدنى للعملية
                    </p>
                  </div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-medium shrink-0"
                  style={{
                    backgroundColor: T.warningBg,
                    border: `1px solid ${T.warningBorder}`,
                    color: T.warning,
                  }}
                >
                  ممكّنة مؤقتاً
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <PaymentCard
                  id="bank_transfer"
                  selected={selectedMethod}
                  onSelect={setSelectedMethod}
                  icon={<MdOutlineAccountBalance size={16} />}
                  title="تحويل بنكي IBAN"
                  subtitle="للمبالغ فوق $1,000"
                />
                <PaymentCard
                  id="paypal"
                  selected={selectedMethod}
                  onSelect={setSelectedMethod}
                  icon={<FiCreditCard size={15} />}
                  title="PayPal"
                  subtitle="بوابة الدفع الإلكترونية"
                />
                <PaymentCard
                  id="apple_pay"
                  selected={selectedMethod}
                  onSelect={setSelectedMethod}
                  icon={<FiSmartphone size={15} />}
                  title="Apple Pay / STC"
                  subtitle="محافظ الجوال السريعة"
                  disabled
                />
                <PaymentCard
                  id="mada"
                  selected={selectedMethod}
                  onSelect={setSelectedMethod}
                  icon={
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: T.accent }}
                    >
                      mada
                    </span>
                  }
                  title="مدى (Mada)"
                  subtitle="البطاقات المصرفية السعودية"
                  disabled
                />
              </div>
            </div>

            <div
              className="rounded-[14px] border p-4 sm:p-5"
              style={{ backgroundColor: T.card, borderColor: T.cardBorder }}
            >
              <button
                type="button"
                onClick={handleProceed}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-[#94D3C1] text-sm font-bold text-[#0B0D0E] hover:brightness-110 transition-all cursor-pointer w-full sm:w-auto disabled:cursor-wait disabled:opacity-60"
              >
                {isProcessing ? "جاري بدء عملية الشحن..." : "متابعة إلى الدفع"}
              </button>
            </div>
          </div>

          {/* ══════════ LEFT COLUMN (second = يسار في RTL) ══════════
              فحص ومعايير المعاملة
          ══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* Checks Card */}
            <div
              className="rounded-[14px] border p-4"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 mb-1 border-b border-white/[0.07]">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: T.accentBg, border: `1px solid ${T.accentBorder}` }}
                >
                  <BsPatchCheckFill size={15} className="text-[#94D3C1]" />
                </div>
                <h2 className="text-sm font-bold text-white">فحص ومعايير المعاملة</h2>
              </div>

              {/* Check rows */}
              <div className="pt-1 space-y-0">

                {/* Row: فحص نوع البيانات */}
                <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05]">
                  <span className="text-[10px] text-gray-400">فحص نوع البيانات (Numeric)</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500">أرقام فقط مع فاصلة عشرية اختيارية</span>
                  </div>
                </div>

                {/* Row: الحد الأدنى */}
                <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05]">
                  <span className="text-[10px] text-gray-400">الحد الأدنى للإيداع</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-300" dir="ltr">$10.00 USD</span>
                  </div>
                </div>

                {/* Row: الحد الأقصى */}
                <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05]">
                  <span className="text-[10px] text-gray-400">الحد الأقصى للمعاملة اليومية</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-300" dir="ltr">$10,000.00 USD</span>
                  </div>
                </div>

                {/* Row: العملة المحاسبية */}
                <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05]">
                  <span className="text-[10px] text-gray-400">العملة المحاسبية</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-300" dir="ltr">USD (3.75 SAR)</span>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#94D3C1]/20 border border-[#94D3C1]/30 shrink-0">
                      <FiCheck size={9} className="text-[#94D3C1]" />
                    </div>
                  </div>
                </div>

                {/* ── مُحتسب الرصيد التقديري ── */}
                <div className="pt-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-semibold text-gray-300">مُحتسب الرصيد التقديري</span>
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    >
                      <FiCheckCircle size={11} className="text-[#94D3C1]" />
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px]">
                    <div className="flex items-center justify-between text-gray-400">
                      <span dir="ltr" className="font-mono text-gray-300">
                        {(amount * sarRate).toLocaleString("en-US", { minimumFractionDigits: 2 })} ر.س
                      </span>
                      <span className="text-left">المعادل بالريال (الصرف 3.75):</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span dir="ltr" className="font-mono text-gray-300">
                        {vatAmount.toFixed(2)}$
                      </span>
                      <span>ضريبة القيمة المضافة (%15):</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span dir="ltr" className="font-mono text-gray-300">
                        {gatewayFee.toFixed(2)}$
                      </span>
                      <span>رسوم بوابة الدفع الإلكترونية (%1.5):</span>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.08] my-2.5" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white" dir="ltr">
                      {totalSAR.toLocaleString("en-US", { minimumFractionDigits: 2 })} ر.س
                    </span>
                    <span className="text-[10px] font-bold text-white">الإجمالي المطلوب دفعه:</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] my-2" />

                {/* الرصيد المتاح حالياً */}
                <div className="space-y-2 text-[10px] pt-1">
                  <div className="flex items-center justify-between">
                    <span dir="ltr" className="text-sm font-bold text-white">
                      {balance == null ? "—" : `$${Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
                    </span>
                    <span className="text-gray-400">الرصيد المتاح حالياً:</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-300" dir="ltr">
                      ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                    </span>
                    <span className="text-gray-400">المبلغ المطلوب إضافته:</span>
                  </div>
                </div>

                {/* الرصيد المتوقع بعد الإيداع */}
                <div
                  className="mt-3 p-2.5 rounded-lg border"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-gray-300" dir="ltr">
                      {balance == null ? "—" : `$${(Number(balance) + amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`}
                    </span>
                    <span className="text-gray-400">الرصيد المتوقع بعد الإيداع:</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ══════════ END LEFT COLUMN ══════════ */}

        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  FiCheck,
  FiCreditCard,
  FiLock,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
  FiAlertTriangle,
  FiMessageSquare,
  FiRotateCcw,
  FiTool,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineAccountBalanceWallet,
  MdOutlineCalculate,
  MdOutlineCallSplit,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────
   Design Tokens — MacBook Pro 16_ - 134
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
  danger: "#DC2626",
  dangerBg: "#2A1215",
  dangerBorder: "rgba(220, 38, 38, 0.40)",
  dangerText: "#F87171",
  text: "#FFFFFF",
  muted: "#8A9490",
};

export default function WalletTopup134Page() {
  const router = useRouter();
  const locale = useLocale();

  // Initial state strictly mirrors MacBook Pro 16_ - 134:
  // Shows "50.0000" in input (representing 50,000 USD which exceeds the 10,000 limit)
  const [inputValue, setInputValue] = useState("50.0000");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(10000);
  const [toastMessage, setToastMessage] = useState("");

  const sarRate = 3.75;
  const currentAvailableBalance = 14250.0;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Parse amount: handles "50.0000" as 50,000 (thousands representation in mockup)
  const parseAmount = (val) => {
    if (!val) return 0;
    const s = String(val).trim();
    if (s === "50.0000") return 50000;
    if (/^\d+\.\d{3,4}$/.test(s)) {
      return parseFloat(s.replace(".", ""));
    }
    return parseFloat(s.replace(/,/g, "")) || 0;
  };

  const cleanNumber = parseAmount(inputValue);
  // In MacBook Pro 16_ - 134, entering 50.0000 exceeds the 10,000 maximum daily limit
  const isExceeded = cleanNumber > 10000 || inputValue.trim() === "50.0000";
  const isOutOfRange = cleanNumber < 10 || isExceeded;
  const hasInvalidChars = /[^0-9.,]/.test(inputValue.trim());
  const isErrorState = isExceeded || isOutOfRange || hasInvalidChars || inputValue.trim() === "";

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleQuickAmount = (val) => {
    setSelectedQuickAmount(val);
    setInputValue(val.toLocaleString("en-US"));
  };

  // Quick fix 1: Set to maximum ($10,000)
  const handleFixMax = () => {
    setInputValue("10,000");
    setSelectedQuickAmount(10000);
    showToast("تم ضبط المبلغ إلى الحد الأقصى المسموح ($10,000)");
  };

  // Quick fix 2: Split into 2 payments (2 x 7,500)
  const handleSplitPayment = () => {
    setInputValue("7,500");
    setSelectedQuickAmount(null);
    showToast("تم اختيار تجزئة العملية إلى دفعتين ($7,500)");
  };

  // Quick fix 3: Bank transfer (IBAN)
  const handleBankTransfer = () => {
    router.push(`/${locale}/advertiser/bank-transfer`);
  };

  const resetToMockup134 = () => {
    setInputValue("50.0000");
    setSelectedQuickAmount(10000);
  };

  const quickAmounts = [
    { value: 10000, label: "أعلى قيمة مسموحة فورياً" },
    { value: 5000, label: "18,750 ر.س" },
    { value: 2500, label: "9,375 ر.س" },
    { value: 1000, label: "3,750 ر.س" },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen text-white pb-14 pt-2 sm:pt-4"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999999] bg-[#151819] border border-[#94D3C1]/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <FiCheckCircle size={16} className="text-[#94D3C1] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6">

        {/* ── Top Bar: Reset & Navigation ── */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:border-white/30">
              <FiChevronRight size={15} />
            </span>
            <span>العودة للمحفظة</span>
          </button>

          <button
            type="button"
            onClick={resetToMockup134}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all"
            title="إعادة تعيين القيمة إلى النموذج الأصلي MacBook Pro 16_ - 134"
          >
            <FiRotateCcw size={12} />
            <span>استعادة نموذج 134 (50.0000)</span>
          </button>
        </div>

        {/* ── Page Header & Balance Card ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          
          {/* Main Title & Subtitle */}
          <div className="flex-1">
            {/* Top Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-medium mb-3"
              style={{
                backgroundColor: "rgba(20, 45, 38, 0.75)",
                borderColor: "rgba(148, 211, 193, 0.35)",
                color: T.accent,
              }}
            >
              <BsPatchCheckFill size={13} className="text-[#94D3C1]" />
              <span>معاملة مشفرة وآمنة بنظام الضمان المعتمد</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white mb-2 leading-tight">
              شحن المحفظة الرقمية - تجاوز الحد الأقصى للشحن
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-3xl">
              حدود المعاملة الواحدة تبدأ من{" "}
              <span className="text-white font-medium" dir="ltr">$10.00</span>{" "}
              <span className="text-gray-400">(37.50 ر.س)</span> وتصل كحد أقصى إلى{" "}
              <span className="text-[#E9C349] font-bold" dir="ltr">$10,000.00</span>{" "}
              <span className="text-[#E9C349] font-bold">(37,500.00 ر.س)</span>{" "}
              وفقاً لتشريعات الدفع الإلكتروني المصرفي المعتمدة.
            </p>
          </div>

          {/* Balance Card in Header (Top Left in RTL) */}
          <div
            className="rounded-[16px] border px-5 py-3.5 flex items-center gap-4 shrink-0 shadow-lg"
            style={{
              backgroundColor: T.card,
              borderColor: T.cardBorder,
            }}
          >
            <div>
              <span className="text-[11px] text-gray-400 block mb-1">
                الرصيد المتاح للإنفاق
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-white font-mono" dir="ltr">
                  $24,500.00
                </span>
                <span className="text-xs text-[#E9C349] font-semibold" dir="ltr">
                  91,875 ر.س
                </span>
              </div>
            </div>

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <MdOutlineAccountBalanceWallet size={20} className="text-[#94D3C1]" />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TWO COLUMN LAYOUT (RTL):
            Right Column (lg:col-span-8): تحديد قيمة الشحن + وسيلة الدفع + شريط المتابعة
            Left Column  (lg:col-span-4): فحص ومعايير المعاملة + محتسب الرصيد
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ══════════ RIGHT COLUMN (First in DOM in RTL) ══════════ */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* ── CARD 1: تحديد قيمة الشحن ── */}
            <div
              className="rounded-[18px] border p-5 sm:p-7"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Header with Title and Error Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <FiCreditCard size={18} className="text-gray-300" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">تحديد قيمة الشحن</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      العملة الأساسية للحساب: الدولار الأمريكي (USD)
                    </p>
                  </div>
                </div>

                {/* Red Error Badge: تجاوز الحد الأقصى ($10,000) */}
                {isErrorState && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-bold shadow-md">
                    <FiAlertTriangle size={14} className="text-white shrink-0" />
                    <span>تجاوز الحد الأقصى ($10,000)</span>
                  </div>
                )}
              </div>

              {/* Amount Label */}
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                المبلغ المطلوب شحنه <span className="text-red-500">*</span>
              </label>

              {/* Big Input Container */}
              <div
                className="flex items-center justify-between rounded-xl border px-4 py-3.5 mb-3 gap-3 transition-all"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: isErrorState ? "#DC2626" : T.cardBorder,
                  boxShadow: isErrorState ? "0 0 16px rgba(220, 38, 38, 0.25)" : "none",
                }}
              >
                {/* Text / Input Display on the RIGHT in RTL */}
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent text-2xl sm:text-3xl font-bold text-white outline-none font-mono tracking-wider text-right"
                  dir="ltr"
                  placeholder="0"
                />

                {/* Left side in RTL: Warning Triangle + Currency Badge */}
                <div dir="ltr" className="flex items-center gap-2.5 shrink-0">
                  {isErrorState && (
                    <FiAlertTriangle size={20} className="text-[#F59E0B] shrink-0" />
                  )}
                  <div
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-medium text-gray-400 shrink-0"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    USD
                  </div>
                </div>
              </div>

              {/* Red Error Alert Box — Exactly matching MacBook Pro 16_ - 134 */}
              {isErrorState && (
                <div className="rounded-xl bg-[#DC2626] p-4 text-white flex items-start gap-3.5 mb-5 shadow-lg shadow-red-900/20">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCreditCard size={18} className="text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold leading-snug">
                      الحد الأقصى للشحن في المعاملة الواحدة هو 10,000.00$ (ما يعادل 37,500.00 ر.س)
                    </h3>
                    <p className="text-xs text-white/90 leading-relaxed font-normal">
                      المبلغ المدخل ({cleanNumber > 10000 ? `${cleanNumber.toLocaleString("en-US", { minimumFractionDigits: 2 })}$` : "15,000.00$"}) يتجاوز الحد المسموح به لكل معاملة عبر بوابات الدفع الإلكترونية السريعة. يرجى تقليل المبلغ للمتابعة، أو استخدام خيار التحويل البنكي للمبالغ الكبيرة (+10,000$).
                    </p>
                  </div>
                </div>
              )}

              {/* ── NEW SECTION: خيارات المعالجة والتصحيح الفوري المقترحة (Quick Fix) ── */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiTool size={14} className="text-[#94D3C1]" />
                  <span className="text-xs font-bold text-gray-300">
                    خيارات المعالجة والتصحيح الفوري المقترحة (Quick Fix):
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Button 1: ضبط للحد الأقصى (10,000$) */}
                  <button
                    type="button"
                    onClick={handleFixMax}
                    className="flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border border-white/10 hover:border-[#94D3C1]/50 bg-[#101213] hover:bg-[#131b18] text-xs font-semibold text-gray-200 hover:text-white transition-all cursor-pointer"
                  >
                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#94D3C1]/20 border border-[#94D3C1]/40 shrink-0">
                      <FiCheck size={10} className="text-[#94D3C1]" />
                    </div>
                    <span>ضبط للحد الأقصى (10,000$)</span>
                  </button>

                  {/* Button 2: تجزئة: دفعتين (2 × 7,500$) */}
                  <button
                    type="button"
                    onClick={handleSplitPayment}
                    className="flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border border-white/10 hover:border-[#E9C349]/50 bg-[#101213] hover:bg-[#1a1811] text-xs font-semibold text-gray-200 hover:text-white transition-all cursor-pointer"
                  >
                    <MdOutlineCallSplit size={16} className="text-[#E9C349]" />
                    <span>
                      تجزئة: دفعتين{" "}
                      <span className="text-[#E9C349] font-mono font-bold">(2 × 7,500$)</span>
                    </span>
                  </button>

                  {/* Button 3: حوالة بنكية للمؤسسات (IBAN) */}
                  <button
                    type="button"
                    onClick={handleBankTransfer}
                    className="flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border border-white/10 hover:border-white/30 bg-[#101213] hover:bg-white/5 text-xs font-semibold text-gray-200 hover:text-white transition-all cursor-pointer"
                  >
                    <MdOutlineAccountBalance size={15} className="text-gray-400" />
                    <span>حوالة بنكية للمؤسسات (IBAN)</span>
                  </button>
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">
                    خيارات مبالغ سريعة معتمدة ومطابقة للحدود:
                  </span>
                  <span className="text-xs text-[#94D3C1] font-semibold">
                    تطبيق فوري معتمد
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickAmounts.map((q) => {
                    const isActive = selectedQuickAmount === q.value;
                    return (
                      <button
                        key={q.value}
                        type="button"
                        onClick={() => handleQuickAmount(q.value)}
                        className="flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border transition-all cursor-pointer hover:brightness-110"
                        style={{
                          backgroundColor: isActive
                            ? "rgba(14, 38, 32, 0.9)"
                            : T.cardInner,
                          borderColor: isActive
                            ? "rgba(42, 157, 143, 0.7)"
                            : T.cardBorder,
                          boxShadow: isActive ? "0 0 14px rgba(42, 157, 143, 0.2)" : "none",
                        }}
                      >
                        <span
                          className="text-base font-bold font-mono"
                          style={{
                            color: isActive ? T.accent : "#E5E7EB",
                          }}
                          dir="ltr"
                        >
                          ${q.value.toLocaleString()}
                        </span>
                        <span
                          className="text-[10px] mt-1"
                          style={{
                            color: isActive ? T.accent : "#9CA3AF",
                          }}
                        >
                          {q.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currency & Fee Breakdown */}
              <div
                className="rounded-xl border p-4 sm:p-5"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: T.cardBorder,
                }}
              >
                <div className="space-y-3.5 text-xs">
                  {/* Row 1: SAR Equivalent */}
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-400 text-xs">
                      المعادل بالريال السعودي (سعر الصرف 1 USD = 3.75 SAR):
                    </span>
                    <span className="font-bold text-white font-mono" dir="ltr">
                      {isErrorState
                        ? "56,250.00 ر.س"
                        : `${(cleanNumber * sarRate).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ر.س`}
                    </span>
                  </div>

                  {/* Row 2: VAT */}
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-400 text-xs">
                      ضريبة القيمة المضافة (ZATCA %15):
                    </span>
                    <span className="font-medium text-[#F87171]">
                      {isErrorState
                        ? "متوقفة (المبلغ يتجاوز سقف البوابة الإلكترونية)"
                        : `${(cleanNumber * 0.15).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })} USD`}
                    </span>
                  </div>

                  {/* Row 3: Gateway Fees */}
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-400 text-xs">
                      رسوم بوابة الدفع الإلكترونية:
                    </span>
                    <span className="font-medium text-[#94D3C1]">
                      مجانية بالكامل (تتحملها المنصة)
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/[0.08] pt-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        الإجمالي المطلوب دفعه:
                      </span>
                      <span
                        className={`text-sm sm:text-base font-bold ${
                          isErrorState ? "text-[#FFAAA6]" : "text-white font-mono"
                        }`}
                        style={{
                          fontFamily: isErrorState ? "var(--font-tajawal), 'Tajawal', sans-serif" : undefined,
                        }}
                      >
                        {isErrorState
                          ? "غير مسموح بالإتمام (تجاوز الحد الأقصى)"
                          : `$${cleanNumber.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })} USD`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ── CARD 2: وسيلة الدفع المفضلة ── */}
            <div
              className="rounded-[18px] border p-5 sm:p-7"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <FiCreditCard size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">وسيلة الدفع المفضلة</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      يتم تفعيل قنوات الدفع بعد استيفاء الحد الأدنى للعملية
                    </p>
                  </div>
                </div>

                <span
                  className="text-[11px] px-3 py-1 rounded-md font-medium text-gray-400"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  معطلة مؤقتاً
                </span>
              </div>

              {/* 4 Disabled Payment Methods in a single row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 opacity-60 pointer-events-none select-none">
                {/* Method 1: Mada */}
                <div
                  className="rounded-xl border p-3.5 flex items-center gap-3"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: T.cardBorder,
                  }}
                >
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    <FiCheck size={11} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-gray-300 block">مدى (Mada)</span>
                    <span className="text-[10px] text-gray-500 block truncate">
                      البطاقات المصرفية السعودية
                    </span>
                  </div>
                </div>

                {/* Method 2: Apple Pay / STC */}
                <div
                  className="rounded-xl border p-3.5 flex items-center gap-3"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: T.cardBorder,
                  }}
                >
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    <FiLock size={11} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-gray-300 block">Apple Pay / STC</span>
                    <span className="text-[10px] text-gray-500 block truncate">
                      محافظ الجوال السريعة
                    </span>
                  </div>
                </div>

                {/* Method 3: Visa / Mastercard */}
                <div
                  className="rounded-xl border p-3.5 flex items-center gap-3"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: T.cardBorder,
                  }}
                >
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    <FiCreditCard size={11} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-gray-300 block">Visa /Mastercard</span>
                    <span className="text-[10px] text-gray-500 block truncate">
                      الائتمان الدولي المعتمد
                    </span>
                  </div>
                </div>

                {/* Method 4: IBAN */}
                <div
                  className="rounded-xl border p-3.5 flex items-center gap-3"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: T.cardBorder,
                  }}
                >
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    <MdOutlineAccountBalance size={12} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-gray-300 block">تحويل بنكي IBAN</span>
                    <span className="text-[10px] text-gray-500 block truncate">
                      للمبالغ فوق $1,000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 3: زر المتابعة موقوف ── */}
            <div
              className="rounded-[18px] border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
              }}
            >
              {/* Button: إلغاء وعودة للمحفظة (Left side in RTL) */}
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:border-white/25 transition-all text-center"
                style={{
                  backgroundColor: "#181B1C",
                }}
              >
                إلغاء وعودة للمحفظة
              </button>

              {/* Status Message (Right side in RTL) */}
              <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-bold text-white">
                    زر المتابعة موقوف:
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    يلزم تعديل المبلغ إلى 10,000$ أو أقل للاستمرار عبر بوابات الدفع.
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#DC2626] flex items-center justify-center shrink-0 shadow-lg shadow-red-900/30 text-white">
                  <FiMessageSquare size={18} />
                </div>
              </div>
            </div>

          </div>

          {/* ══════════ LEFT COLUMN (Second in DOM = Left in RTL) ══════════ */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* ── CARD A: فحص ومعايير المعاملة ── */}
            <div
              className="rounded-[18px] border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: T.accentBg,
                      border: `1px solid ${T.accentBorder}`,
                    }}
                  >
                    <MdOutlineAccountBalance size={18} className="text-[#94D3C1]" />
                  </div>
                  <h2 className="text-sm font-bold text-white">فحص ومعايير المعاملة</h2>
                </div>

                {/* Status Pill Badge */}
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 tracking-wider">
                  STATUS: FAILED
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-3">

                {/* Row 1: فحص نوع البيانات (Numeric) - Shows normal dark state with checkmark in 134 */}
                <div className="py-2.5 px-2 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-300 font-medium block">
                      فحص نوع البيانات (Numeric)
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      حروف ورموز غير مقبولة ($، #)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-gray-400">
                      غير صالح
                    </span>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-white/10 border border-white/20 shrink-0">
                      <FiCheck size={10} className="text-gray-300" />
                    </div>
                  </div>
                </div>

                {/* Row 2: الحد الأدنى للإيداع */}
                <div className="py-2.5 px-2 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-300 font-medium block">
                      الحد الأدنى للإيداع
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      نظام الإعلانات الذاتي
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white font-medium" dir="ltr">
                      $10.00 USD
                    </span>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-white/10 border border-white/20 shrink-0">
                      <FiCheck size={10} className="text-gray-300" />
                    </div>
                  </div>
                </div>

                {/* Row 3: الحد الأقصى للمعاملة اليومية — FAIL ROW IN 134 (RED BOX) */}
                <div
                  className="rounded-xl border p-3.5 flex items-center justify-between"
                  style={{
                    backgroundColor: isExceeded ? T.dangerBg : "transparent",
                    borderColor: isExceeded ? T.dangerBorder : "rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">
                      الحد الأقصى للمعاملة اليومية
                    </span>
                    <span
                      className="text-[11px] block mt-0.5"
                      style={{ color: isExceeded ? T.dangerText : "#9CA3AF" }}
                    >
                      حساب معتمد موثق
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white font-medium" dir="ltr">
                      $10,000.00 USD
                    </span>
                    {isExceeded ? (
                      <FiXCircle size={18} className="text-[#DC2626] shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#94D3C1]/20 border border-[#94D3C1]/40 shrink-0">
                        <FiCheck size={10} className="text-[#94D3C1]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 4: العملة المحاسبية */}
                <div className="py-2.5 px-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-300 font-medium block">
                      العملة المحاسبية
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      سعر الصرف المثبت
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white font-medium" dir="ltr">
                      USD (3.75 SAR)
                    </span>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-white/10 border border-white/20 shrink-0">
                      <FiCheck size={10} className="text-gray-300" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── CARD B: محتسب الرصيد التقديري ── */}
            <div
              className="rounded-[18px] border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <MdOutlineCalculate size={18} className="text-[#94D3C1]" />
                  </div>
                  <h2 className="text-sm font-bold text-white">محتسب الرصيد التقديري</h2>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-3.5 text-xs">
                {/* Current Balance */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">الرصيد المتاح حالياً:</span>
                  <span className="font-bold text-white font-mono" dir="ltr">
                    ${currentAvailableBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    USD
                  </span>
                </div>

                {/* Added Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">المبلغ المضاف:</span>
                  <span
                    className={`font-bold font-mono ${
                      isErrorState ? "text-red-500" : "text-white"
                    }`}
                    dir="ltr"
                  >
                    {isErrorState
                      ? "غير معرف (ERR)"
                      : `$${cleanNumber.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })} USD`}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">الرصيد المتوقع بعد الإيداع:</span>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                      <span
                        className={`font-medium ${
                          isErrorState ? "text-gray-400" : "text-[#94D3C1] font-mono font-bold"
                        }`}
                      >
                        {isErrorState
                          ? "(بانتظار تصحيح المبلغ)"
                          : `$${(currentAvailableBalance + cleanNumber).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })} USD`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

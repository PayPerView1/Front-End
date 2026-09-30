"use client";

import { useState } from "react";
import {
  FiRotateCcw,
  FiCreditCard,
  FiCopy,
  FiClock,
  FiXCircle,
  FiInfo,
  FiArrowLeft,
  FiShield,
  FiDownload,
  FiHeadphones,
  FiFilter,
  FiFileText,
  FiCheckCircle,
  FiChevronRight,
  FiSmartphone,
  FiAlertTriangle,
  FiRefreshCw,
  FiRepeat,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineAccountBalanceWallet,
  MdOutlineSwapHoriz,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────
   Design Tokens — MacBook Pro 16_ - 124
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  accent: "#94D3C1",
  accentBorder: "rgba(148, 211, 193, 0.35)",
  orange: "#FF5A00",
  orangeHover: "#FF6A15",
  danger: "#DC2626",
  dangerBg: "#2A1215",
  dangerBorder: "rgba(220, 38, 38, 0.40)",
  warning: "#E9C349",
  text: "#FFFFFF",
  muted: "#8A9490",
};

export default function PaymentFailed124Page() {
  const router = useRouter();
  const locale = useLocale();

  const [toastMessage, setToastMessage] = useState("");
  const gatewayRef = "TXN-ERR-9842-EMR";
  const ibanNumber = "SA03 8000 0542 6080 1019 9231";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCopyGatewayRef = () => {
    navigator.clipboard.writeText(gatewayRef);
    showToast("تم نسخ الرقم المرجعي للعملية بنجاح!");
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(ibanNumber);
    showToast("تم نسخ رقم الآيبان بنجاح!");
  };

  const handleRetrySameCard = () => {
    showToast("جاري إعادة محاولة الخصم من نفس البطاقة (8824)...");
    setTimeout(() => {
      router.push(`/${locale}/advertiser/wallet-topup`);
    }, 1000);
  };

  const handleChooseOtherMethod = () => {
    router.push(`/${locale}/advertiser/wallet-topup`);
  };

  const handleBankTransfer = () => {
    router.push(`/${locale}/advertiser/bank-transfer`);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen text-white pb-16 pt-2 sm:pt-4"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999999] bg-[#151819] border border-[#94D3C1]/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <FiCheckCircle size={16} className="text-[#94D3C1] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6">

        {/* ── Top Small Navigation ── */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/advertiser/wallet-topup`)}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:border-white/30">
              <FiChevronRight size={15} />
            </span>
            <span>العودة لإدارة الرصيد والمدفوعات</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1: TOP BANNER (فشلت عملية الدفع)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-[20px] border p-6 sm:p-7 mb-3"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* Right side in RTL: Title, Bank Ref & Description */}
            <div className="flex items-start gap-4 flex-1">
              {/* Red Square Card Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#DC2626] flex items-center justify-center shrink-0 shadow-lg shadow-red-900/30 text-white mt-1">
                <FiCreditCard size={22} />
              </div>

              <div>
                {/* Bank Reference & Red Pill */}
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-[#DC2626] text-white">
                    رفض المعاملة بنكياً
                  </span>
                  <span className="text-xs text-gray-400 font-mono" dir="ltr">
                    مرجع البنك: ALRAJHI-GW-89412
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-white mb-2 tracking-tight">
                  فشلت عملية الدفع. يرجى المحاولة مرة أخرى أو استخدام وسيلة دفع أخرى.
                </h1>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-3xl">
                  تم رفض محاولة الشحن من قبل البنك المصدر لبطاقتك (رمز الرفض: 051). لم يتم تحصيل أو سحب أي مبالغ إضافية من بطاقتك الائتمانية أو حسابك البنكي.
                </p>
              </div>
            </div>

            {/* Left side in RTL: Sub-card: رصيد المحفظة لم يتأثر */}
            <div className="bg-[#101213] border border-white/[0.08] p-4 rounded-2xl shrink-0 min-w-[240px]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-300">
                  <BsPatchCheckFill size={13} className="text-[#94D3C1]" />
                  <span>رصيد المحفظة لم يتأثر</span>
                </div>
                <span className="text-[11px] font-bold text-[#94D3C1]">آمن 100%</span>
              </div>

              <div className="mb-1">
                <span className="text-2xl font-extrabold text-[#E9C349] font-mono" dir="ltr">
                  $24,500.00
                </span>
                <span className="text-xs text-gray-400 block mt-0.5">
                  91,875.00 ريال سعودي
                </span>
              </div>

              <p className="text-[10px] text-gray-500 leading-normal">
                لم يتم خصم أي مبالغ، رصيدك الإعلاني جاهز للاستخدام.
              </p>
            </div>

          </div>
        </div>

        {/* ── Sub-bar: Action Buttons ── */}
        <div
          className="rounded-2xl border p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
          }}
        >
          {/* Right Group in RTL: Retry & Choose Other Method */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Orange Button: إعادة المحاولة بنفس البطاقة */}
            <button
              type="button"
              onClick={handleRetrySameCard}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all cursor-pointer hover:brightness-110 active:scale-95"
              style={{
                backgroundColor: T.orange,
                boxShadow: "0 4px 16px rgba(255, 90, 0, 0.35)",
              }}
            >
              <FiRotateCcw size={14} className="stroke-[2.5]" />
              <span>إعادة المحاولة بنفس البطاقة (**** 8824)</span>
            </button>

            {/* Dark Button: اختيار وسيلة دفع أخرى */}
            <button
              type="button"
              onClick={handleChooseOtherMethod}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-gray-200 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              style={{
                backgroundColor: "#181B1C",
              }}
            >
              <MdOutlineSwapHoriz size={16} className="text-gray-400" />
              <span>اختيار وسيلة دفع أخرى (بطاقة / Apple Pay / تحويل)</span>
            </button>
          </div>

          {/* Left Group in RTL: Support & Back to Wallet */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => showToast("جاري الاتصال بالدعم الفني المالي...")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <FiHeadphones size={14} className="text-[#94D3C1]" />
              <span>التواصل مع الدعم الفني المالي</span>
            </button>

            <button
              type="button"
              onClick={() => router.push(`/${locale}/advertiser/wallet-topup`)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>العودة إلى المحفظة</span>
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2: TWO COLUMNS (تفاصيل المحاولة المرفوضة + الوضع المالي)
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          {/* ══════════ RIGHT COLUMN (lg:col-span-8): تفاصيل محاولة الشحن المرفوضة ══════════ */}
          <div
            className="lg:col-span-8 rounded-[20px] border p-6 flex flex-col justify-between"
            style={{
              backgroundColor: T.card,
              borderColor: T.cardBorder,
              boxShadow: "0 6px 28px rgba(0,0,0,0.4)",
            }}
          >
            <div>
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <FiFileText size={16} className="text-gray-300" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">تفاصيل محاولة الشحن المرفوضة</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">معلومات التدقيق المالي والمعالجة اللحظية</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2A1215] border border-red-500/30 text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>فشلت المعالجة</span>
                </div>
              </div>

              {/* 6 Key-Value Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                {/* Box 1: المبلغ المطلوب شحنه */}
                <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                  <span className="text-[11px] text-gray-400 block mb-1">المبلغ المطلوب شحنه</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white font-mono" dir="ltr">
                      $2,500.00
                    </span>
                    <span className="text-xs text-[#E9C349]" dir="ltr">
                      (9,375.00 ر.س)
                    </span>
                  </div>
                </div>

                {/* Box 2: الرقم المرجعي للعملية */}
                <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-400">الرقم المرجعي للعملية (Gateway Ref)</span>
                    <button
                      type="button"
                      onClick={handleCopyGatewayRef}
                      className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <FiCopy size={11} />
                      <span>نسخ</span>
                    </button>
                  </div>
                  <span className="text-sm font-mono font-bold text-white block tracking-wider" dir="ltr">
                    {gatewayRef}
                  </span>
                </div>

                {/* Box 3: بوابة الدفع والبنك المعالج */}
                <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                  <span className="text-[11px] text-gray-400 block mb-1">بوابة الدفع والبنك المعالج</span>
                  <div className="flex items-center gap-2">
                    <MdOutlineAccountBalance size={15} className="text-[#E9C349] shrink-0" />
                    <span className="text-xs font-bold text-white font-mono" dir="ltr">
                      Al Rajhi Bank Gateway - E-Commerce API
                    </span>
                  </div>
                </div>

                {/* Box 4: البطاقة المستخدمة للعملية */}
                <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                  <span className="text-[11px] text-gray-400 block mb-1">البطاقة المستخدمة للعملية</span>
                  <div className="flex items-center gap-2">
                    <FiCreditCard size={15} className="text-gray-300 shrink-0" />
                    <span className="text-xs font-bold text-white font-mono" dir="ltr">
                      Mada / Visa •••• 8824
                    </span>
                  </div>
                </div>

                {/* Box 5: رسوم المعاملة المحتسبة */}
                <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                  <span className="text-[11px] text-gray-400 block mb-1">رسوم المعاملة المحتسبة</span>
                  <span className="text-xs font-bold text-[#94D3C1]">
                    $0.00 (مجاناً - لم يتم استقطاع أي عمولة)
                  </span>
                </div>

                {/* Box 6: التاريخ والوقت المسجل */}
                <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                  <span className="text-[11px] text-gray-400 block mb-1">التاريخ والوقت المسجل</span>
                  <span className="text-xs text-gray-200">
                    14 مايو 2024 - 11:28:44 ص (توقيت مكة)
                  </span>
                </div>
              </div>

              {/* Red Callout Error Box */}
              <div className="rounded-xl bg-[#DC2626] p-4 text-white mb-5 shadow-lg shadow-red-900/20">
                <div className="flex items-center gap-2 mb-2 font-bold text-xs sm:text-sm">
                  <FiAlertTriangle size={15} className="shrink-0" />
                  <span>البيان الصريح الوارد من بوابة الدفع:</span>
                </div>

                <div className="bg-[#101213] border border-white/10 rounded-lg p-3 font-mono text-xs text-gray-200 mb-2 leading-relaxed" dir="ltr">
                  ERR_DECLINED_INSUFFICIENT_FUNDS: Transaction declined by issuer bank (ISO-8583 Code: 051 - Insufficient Funds / Credit Limit Exceeded).
                </div>

                <p className="text-xs text-white/95 leading-relaxed font-normal">
                  توضيح: لم يتمكن مصرف الراجحي من إتمام الخصم نظراً لأن الرصيد المتوفر في الحساب الجاري المرتبط بالبطاقة أقل من القيمة المطلوبة، أو لوجود سقف يومي مقيد لعمليات الشراء الإلكتروني.
                </p>
              </div>

              {/* Recommended Steps Box */}
              <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3 text-[#94D3C1] font-bold text-xs">
                  <span>💡</span>
                  <span>الخطوات الموصى بها لحل هذه المشكلة:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
                    <span className="font-bold text-white block mb-1">1. تغذية رصيد البطاقة</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      تأكد من وجود رصيد يعادل 9,375.00 ر.س على الأقل ثم اضغط إعادة المحاولة.
                    </p>
                  </div>

                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
                    <span className="font-bold text-white block mb-1">2. رفع حد الشراء الإلكتروني</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      تحقق من تطبيق مصرفك لزيادة الحد اليومي لعمليات الشراء عبر الإنترنت (e-Commerce Limit).
                    </p>
                  </div>

                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
                    <span className="font-bold text-white block mb-1">3. استخدام Apple Pay أو التحويل</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      اختر بطاقة أخرى مسجلة أو قم بالتحويل البنكي الفوري السريع بحساب الآيبان.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ══════════ LEFT COLUMN (lg:col-span-4): الوضع المالي + بدائل الدفع ══════════ */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* ── CARD A: الوضع المالي للمحفظة ── */}
            <div
              className="rounded-[20px] border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 28px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <MdOutlineAccountBalanceWallet size={16} className="text-[#94D3C1]" />
                  </div>
                  <h3 className="text-sm font-bold text-white">الوضع المالي للمحفظة</h3>
                </div>

                <span className="text-[10px] px-2.5 py-0.5 rounded font-bold bg-[#94D3C1]/10 border border-[#94D3C1]/30 text-[#94D3C1]">
                  نشط ومستقر
                </span>
              </div>

              <div className="mb-4">
                <span className="text-xs text-gray-400 block mb-1">إجمالي الرصيد الإعلاني المتاح حالياً</span>
                <div className="text-3xl font-extrabold text-white font-mono" dir="ltr">
                  $24,500.00
                </div>
                <div className="text-xs font-semibold text-[#E9C349] mt-0.5" dir="ltr">
                  91,875.00 ريال سعودي
                </div>
              </div>

              {/* Progress Bar & Compliance */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                <div className="bg-[#94D3C1] h-full w-full" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-5">
                <span>جميع الحملات الحالية قيد التشغيل دون توقف</span>
                <span className="text-[#94D3C1] font-semibold">100% متوافق</span>
              </div>

              {/* Sharia & Security Callout */}
              <div className="bg-[#101213] p-3.5 rounded-xl border border-white/[0.06] flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <FiShield size={14} className="text-[#94D3C1]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block mb-0.5">حماية أموال المستثمرين والشريعة</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    أموالك مفصولة في حسابات ائتمانية خاضعة للهيئة الشرعية ومعتمدة بدون فوائد تأخير.
                  </p>
                </div>
              </div>
            </div>

            {/* ── CARD B: بدائل الدفع الفورية المتوفرة ── */}
            <div
              className="rounded-[20px] border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 28px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔄</span>
                  <h3 className="text-sm font-bold text-white">بدائل الدفع الفورية المتوفرة</h3>
                </div>
                <span className="text-[10px] text-[#94D3C1] font-medium">معتمدة وفورية</span>
              </div>

              <div className="space-y-2.5 mb-4">
                {/* Alternative 1: Apple Pay */}
                <button
                  type="button"
                  onClick={handleChooseOtherMethod}
                  className="w-full p-3 rounded-xl border border-white/10 hover:border-white/25 bg-[#101213] hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <FiSmartphone size={15} className="text-gray-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Apple Pay</span>
                      <span className="text-[10px] text-gray-400">دفع سريع عبر القياسات الحيوية (Touch/Face ID)</span>
                    </div>
                  </div>
                  <FiArrowLeft size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>

                {/* Alternative 2: بطاقة ائتمان / مدى أخرى */}
                <button
                  type="button"
                  onClick={handleChooseOtherMethod}
                  className="w-full p-3 rounded-xl border border-white/10 hover:border-white/25 bg-[#101213] hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <FiCreditCard size={15} className="text-gray-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">بطاقة ائتمان / مدى أخرى</span>
                      <span className="text-[10px] text-gray-400">أدخل بيانات بطاقة صادرة من بنك آخر</span>
                    </div>
                  </div>
                  <FiArrowLeft size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>

                {/* Alternative 3: تحويل بنكي فوري */}
                <button
                  type="button"
                  onClick={handleBankTransfer}
                  className="w-full p-3 rounded-xl border border-white/10 hover:border-white/25 bg-[#101213] hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer text-right group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <MdOutlineAccountBalance size={15} className="text-gray-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">تحويل بنكي فوري (سريع / آيبان)</span>
                      <span className="text-[10px] text-gray-400">حساب مصرف الراجحي المعتمد لشركة إمبيرالد</span>
                    </div>
                  </div>
                  <FiArrowLeft size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Direct IBAN Box */}
              <div className="bg-[#101213] p-3.5 rounded-xl border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-gray-400">الآيبان المعتمد للتحويل المباشر:</span>
                  <button
                    type="button"
                    onClick={handleCopyIban}
                    className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#94D3C1]/15 text-[#94D3C1] border border-[#94D3C1]/30 hover:bg-[#94D3C1]/25 transition-colors cursor-pointer"
                  >
                    نسخ IBAN
                  </button>
                </div>
                <span className="text-xs font-mono font-bold text-white block tracking-wider" dir="ltr">
                  {ibanNumber}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 3: BOTTOM TABLE (سجل المعاملات والعمليات الأخيرة)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-[20px] border p-6"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                سجل المعاملات والعمليات الأخيرة
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                تحديث فوري لجميع حركات الإيداع والخصم في محفظتك
              </p>
            </div>

            {/* Filter and Export Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => showToast("تم تفعيل تصفية العمليات")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101213] hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                <FiFilter size={13} />
                <span>تصفية العمليات</span>
              </button>

              <button
                type="button"
                onClick={() => showToast("جاري تصدير سجل العمليات...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101213] hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                <FiDownload size={13} />
                <span>تصدير السجل</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-white/[0.06] text-[11px]">
                  <th className="py-3 px-4 font-semibold">الرقم المرجعي</th>
                  <th className="py-3 px-4 font-semibold">التاريخ والوقت</th>
                  <th className="py-3 px-4 font-semibold">نوع الحركة وطريقة الدفع</th>
                  <th className="py-3 px-4 font-semibold">المبلغ المالي</th>
                  <th className="py-3 px-4 font-semibold">حالة العملية</th>
                  <th className="py-3 px-4 font-semibold text-center">الإيصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">

                {/* ROW 1: The Failed Bank Transaction (Red highlighted row!) */}
                <tr className="bg-[#2A1215]/60 hover:bg-[#2A1215]/90 transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      <span className="text-white font-mono" dir="ltr">TX-89211 • TXN-ERR-9842</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#F87171] font-medium">
                    14 مايو 2024 - 11:25 ص
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                        <FiCreditCard size={14} className="text-[#F87171]" />
                      </div>
                      <div>
                        <span className="font-bold text-[#F87171] block">شحن محفظة - بطاقة مدى البنكية</span>
                        <span className="text-[10px] text-gray-400 font-mono" dir="ltr">8824 ****</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-[#DC2626] block text-sm" dir="ltr">
                      $2,500.00
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans">
                      (لم يتم خصمها)
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#F87171]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                      <span>فشلت (رصيد غير كافٍ 051)</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleRetrySameCard}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181B1C] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        <FiRotateCcw size={11} />
                        <span>إعادة المحاولة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => showToast("عرض تقرير الخطأ البنكي...")}
                        className="px-2.5 py-1 rounded-lg bg-[#181B1C] hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-[11px] transition-colors cursor-pointer"
                      >
                        تقرير الخطأ
                      </button>
                    </div>
                  </td>
                </tr>

                {/* ROW 2: Mada Success */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono text-gray-400" dir="ltr">
                    TX-89210#
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    14 مايو 2024 - 11:25 ص
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <FiCreditCard size={14} className="text-gray-300" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-300 block">شحن محفظة - بطاقة مدى البنكية</span>
                        <span className="text-[10px] text-gray-500 font-mono" dir="ltr">8824 ****</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-white block text-sm" dir="ltr">
                      +$2,500.00 USD
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans" dir="ltr">
                      +9,375.00 SAR
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span>مكتملة ومودعة</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => showToast("جاري تحميل الإيصال...")}
                      className="text-gray-400 hover:text-white transition-colors inline-block cursor-pointer"
                      title="تحميل الإيصال"
                    >
                      <FiDownload size={14} />
                    </button>
                  </td>
                </tr>

                {/* ROW 3: Apple Pay Approved */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono text-gray-400" dir="ltr">
                    TX-89144#
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    08 مايو 2024 - 04:15 م
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <FiSmartphone size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-300 block">شحن محفظة - Apple Pay</span>
                        <span className="text-[10px] text-gray-500">معتمد فورياً</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-white block text-sm" dir="ltr">
                      +$1,000.00 USD
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans" dir="ltr">
                      +3,750.00 SAR
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span>مكتملة ومودعة</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => showToast("جاري تحميل الإيصال...")}
                      className="text-gray-400 hover:text-white transition-colors inline-block cursor-pointer"
                      title="تحميل الإيصال"
                    >
                      <FiDownload size={14} />
                    </button>
                  </td>
                </tr>

                {/* ROW 4: IBAN Approved */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono text-gray-400" dir="ltr">
                    TX-88902#
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    29 أبريل 2024 - 09:00 ص
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <MdOutlineAccountBalance size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-300 block">إيداع بنكي مؤسسي (IBAN)</span>
                        <span className="text-[10px] text-gray-500">مصرف الإنماء</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-white block text-sm" dir="ltr">
                      +$10,000.00 USD
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans" dir="ltr">
                      +37,500.00 SAR
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span>مكتملة ومودعة</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => showToast("جاري تحميل الإيصال...")}
                      className="text-gray-400 hover:text-white transition-colors inline-block cursor-pointer"
                      title="تحميل الإيصال"
                    >
                      <FiDownload size={14} />
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

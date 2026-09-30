"use client";

import { useState } from "react";
import {
  FiCheckCircle,
  FiFileText,
  FiDownload,
  FiCreditCard,
  FiSmartphone,
  FiCopy,
  FiCheck,
  FiBriefcase,
  FiSend,
  FiShield,
  FiPrinter,
  FiSliders,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineAccountBalanceWallet,
  MdOutlineCampaign,
  MdOutlineLayers,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────
   Design Tokens - MacBook Pro 16_ - 143
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  accent: "#94D3C1",
  accentBorder: "rgba(148, 211, 193, 0.35)",
  warning: "#E9C349",
  warningBg: "rgba(233, 195, 73, 0.12)",
  text: "#FFFFFF",
  sub: "#C5CECA",
  muted: "#8A9490",
  orangeFrom: "#FB9D00",
  orangeTo: "#FC5601",
};

export default function DepositSuccessPage() {
  const router = useRouter();
  const locale = useLocale();

  const [copiedTxn, setCopiedTxn] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCopy = (text) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedTxn(true);
    showToast(`تم نسخ المعرف: ${text}`);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen text-white pb-16 selection:bg-[#EA580C] selection:text-white"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[999999] bg-[#151819] border border-[#94D3C1]/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <FiCheckCircle size={18} className="text-[#94D3C1]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1480px] mx-auto px-3 sm:px-6 pt-3 sm:pt-4">

        {/* ─────────────────────────────────────────────
            TOP BAR: Breadcrumbs & Status Indicator
        ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
              <MdOutlineAccountBalanceWallet size={16} className="text-gray-400" />
              المحفظة والمالية
            </span>
            <span className="text-gray-600 text-xs">‹</span>
            <span className="text-[#C5CECA] font-medium">تأكيد عملية الشحن</span>
          </div>

          {/* Status Badge */}
          <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151819] border border-white/10 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
            <span className="text-[#94D3C1] font-medium">معاملة موثقة فورياً</span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            HERO CARD: Main Banner (اشحن محفظتك لتخصيص ميزانيات الحملة)
        ───────────────────────────────────────────── */}
        <div
          className="rounded-[16px] border p-5 sm:p-7 mb-6 relative overflow-hidden transition-all"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 10px 35px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

            {/* Right Side: Title + Badges + Subtitle */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 font-medium">
                  <FiCheckCircle size={13} />
                  ناجحة ومودعة بالكامل
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium">
                  <FiFileText size={12} className="text-[#94D3C1]" />
                  معتمدة ومتوافقة مع المعايير الشرعية
                </span>
              </div>

              {/* Title with Shield Icon */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#94D3C1]/10 border border-[#94D3C1]/30 flex items-center justify-center shrink-0 text-[#94D3C1]">
                  <FiShield size={22} />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white leading-tight">
                  اشحن محفظتك لتخصيص ميزانيات الحملة
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-[13px] text-[#8A9490] leading-relaxed max-w-3xl mt-1 pr-0 sm:pr-13">
                سيتم استلام الدفعة واعتمادها بنجاح عبر بوابة الدفع الإلكتروني المشفرة، والرصيد متاح الآن بالكامل لبدء وإطلاق حملاتك الإعلانية.
              </p>
            </div>

            {/* Left Side: 2 Action Buttons */}
            <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto min-w-[240px]">
              {/* Primary Orange Gradient Button */}
              <button
                type="button"
                onClick={() => router.push(`/${locale}/advertiser/deposit`)}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-[0.98] hover:brightness-110 cursor-pointer"
                style={{
                  background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
                  boxShadow: "0 4px 15px rgba(251, 157, 0, 0.35)",
                }}
              >
                <FiCreditCard size={18} />
                <span>إعادة شحن المحفظة</span>
              </button>

              {/* Secondary Ghost Button */}
              <button
                type="button"
                onClick={() => showToast("الانتقال إلى لوحة تخصيص الميزانيات للحملات")}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <FiBriefcase size={15} className="text-[#94D3C1]" />
                <span>تخصيص الميزانية لحملة إعلانية</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            MIDDLE SECTION: Grid 2 Columns
            - RIGHT (~65% in RTL): حالة رصيد المحفظة المحدث + الضمان + بطاقات التنقل
            - LEFT (~35% in RTL): ملخص إيصال الإيداع المالي
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          {/* ═══════════════════════════════════════════
              RIGHT COLUMN (lg:col-span-8 in RTL = RIGHT side):
              حالة رصيد المحفظة المحدث فورياً
          ═══════════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Main Wallet Live Card */}
            <div
              className="rounded-[16px] border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
              }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#94D3C1] shrink-0">
                    <MdOutlineAccountBalanceWallet size={22} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      حالة رصيد المحفظة المحدث فورياً
                    </h2>
                    <p className="text-xs text-[#8A9490] mt-0.5">
                      الرصيد جاهز للتخصيص دون فترة انتظار
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 font-medium self-start sm:self-auto">
                  محمي بنظام الضمان
                </span>
              </div>

              {/* 3 Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

                {/* Box 1: الرصيد السابق */}
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: T.cardBorder,
                  }}
                >
                  <span className="text-xs text-gray-400 block mb-2 font-medium">
                    الرصيد السابق
                  </span>
                  <div className="text-lg sm:text-xl font-bold text-white" dir="ltr">
                    $24,500.00
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5" dir="ltr">
                    91,875.00 SAR
                  </div>
                </div>

                {/* Box 2: المبلغ المضاف */}
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: T.cardBorder,
                  }}
                >
                  <span className="text-xs text-gray-400 block mb-2 font-medium">
                    المبلغ المضاف
                  </span>
                  <div className="text-lg sm:text-xl font-bold text-[#94D3C1]" dir="ltr">
                    +$2,500.00
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5" dir="ltr">
                    +9,375.00 SAR
                  </div>
                </div>

                {/* Box 3: الرصيد الإجمالي المتاح (Highlighted) */}
                <div
                  className="rounded-xl p-4 border relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(148, 211, 193, 0.08)",
                    borderColor: "rgba(148, 211, 193, 0.40)",
                    boxShadow: "0 0 20px rgba(148, 211, 193, 0.12)",
                  }}
                >
                  <span className="text-xs font-semibold text-[#94D3C1] block mb-2">
                    الرصيد الإجمالي المتاح
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#94D3C1]" dir="ltr">
                    $27,000.00
                  </div>
                  <div className="text-xs text-[#E9C349] font-medium mt-0.5" dir="ltr">
                    101,250.00 SAR
                  </div>
                </div>
              </div>

              {/* Sub-box: حالة الرصيد الشرعي والائتماني (Escrow Protection) */}
              <div
                className="rounded-xl p-4 border mb-4"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: T.cardBorder,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MdOutlineAccountBalance size={18} className="text-[#94D3C1]" />
                      <h3 className="text-sm font-bold text-white">حالة الرصيد الشرعي والائتماني</h3>
                    </div>
                    <p className="text-xs text-[#8A9490] leading-relaxed max-w-2xl pr-6">
                      الرصيد مودع فورياً في حساب أمانات الضمان (Escrow Protection) المتوافق مع الشريعة الإسلامية. لا يتم خصم أي مبالغ إلا عند تحقيق نقرات ومشاهدات فعلية لحملاتك المعتمدة.
                    </p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium shrink-0 self-start sm:self-auto">
                    نشط ومودع فورياً
                  </span>
                </div>
              </div>

              {/* Progress Bar: Readiness for Campaigns */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">جاهزية تخصيص الميزانية للحملات الحالية</span>
                  <span className="text-[#94D3C1] font-bold" dir="ltr">100% متوفر</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full w-full"
                    style={{
                      background: "linear-gradient(to left, #94D3C1, #E9C349)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom 2 Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Card 1: إطلاق حملة جديدة */}
              <div
                onClick={() => showToast("الانتقال إلى إنشاء حملة جديدة")}
                className="rounded-xl border p-4 flex items-center justify-between cursor-pointer group transition-all hover:border-white/20"
                style={{
                  backgroundColor: T.card,
                  borderColor: T.cardBorder,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#94D3C1] group-hover:scale-105 transition-transform">
                    <MdOutlineCampaign size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#94D3C1] transition-colors">
                      إطلاق حملة جديدة
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      استثمر رصيدك فورياً
                    </p>
                  </div>
                </div>
                <span className="text-gray-500 group-hover:text-white transition-colors text-sm">
                  ←
                </span>
              </div>

              {/* Card 2: استرداد الرصيد الغير مستخدم */}
              <div
                onClick={() => showToast("الانتقال إلى أرشيف ZATCA واسترداد الرصيد")}
                className="rounded-xl border p-4 flex items-center justify-between cursor-pointer group transition-all hover:border-white/20"
                style={{
                  backgroundColor: T.card,
                  borderColor: T.cardBorder,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform">
                    <FiFileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#94D3C1] transition-colors">
                      استرداد الرصيد الغير مستخدم
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      أرشيف ZATCA المعتمد
                    </p>
                  </div>
                </div>
                <span className="text-gray-500 group-hover:text-white transition-colors text-sm">
                  ←
                </span>
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════
              LEFT COLUMN (lg:col-span-4 in RTL = LEFT side):
              ملخص إيصال الإيداع المالي
          ═══════════════════════════════════════════ */}
          <div
            className="lg:col-span-4 rounded-[16px] border p-5 flex flex-col justify-between"
            style={{
              backgroundColor: T.card,
              borderColor: T.cardBorder,
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <FiFileText size={18} className="text-[#94D3C1]" />
                  <h2 className="text-base font-bold text-white">ملخص إيصال الإيداع المالي</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium">
                  <FiCheck size={12} className="stroke-[3]" />
                  مكتملة
                </span>
              </div>

              {/* Transaction Key Attributes Box */}
              <div
                className="rounded-xl p-3.5 border mb-4 space-y-3 text-xs"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: T.cardBorder,
                }}
              >
                {/* Transaction ID */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 shrink-0">الرقم المرجعي للعملية (Transaction ID)</span>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => handleCopy("TXN-99842-EMR")}
                      className="font-bold text-white hover:text-[#94D3C1] cursor-pointer flex items-center gap-1"
                      dir="ltr"
                      title="انقر لنسخ المعرف"
                    >
                      TXN-99842-EMR
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("TXN-99842-EMR")}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {copiedTxn ? (
                        <FiCheck size={11} className="text-[#94D3C1]" />
                      ) : (
                        <FiCopy size={11} className="text-gray-400" />
                      )}
                      <span>نسخ</span>
                    </button>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">تاريخ وتوقيت المعاملة</span>
                  <span className="text-gray-200 font-medium">14 مايو 2024 - 11:25 ص</span>
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">وسيلة الدفع المستخدمة</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-200 font-medium" dir="ltr">Mada **** 8824</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-300">دفع فوري</span>
                  </div>
                </div>

                {/* Gateway Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">حالة الدفع في البوابة</span>
                  <div className="text-left">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <FiCheckCircle size={13} />
                      مقبولة فورياً
                    </span>
                    <span className="text-[10px] text-gray-500 block">Al Rajhi Bank Gateway</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/10 pt-3 space-y-2.5 text-xs mb-4">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-400">المبلغ المشحون الصافي</span>
                  <span className="font-bold text-white" dir="ltr">$2,173.91 USD</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-400">رسوم معالجة البوابة (0%)</span>
                  <span className="text-[#94D3C1]" dir="ltr">$0.00 USD</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-400">ضريبة القيمة المضافة (15% VAT)</span>
                  <span className="font-bold text-white" dir="ltr">$326.09 USD</span>
                </div>
              </div>

              {/* Total Box */}
              <div
                className="rounded-xl p-3.5 border mb-3 flex items-center justify-between"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: T.cardBorder,
                }}
              >
                <div>
                  <span className="text-sm font-bold text-white block mb-0.5">
                    الإجمالي المدفوع
                  </span>
                  <span className="text-xs text-[#E9C349]" dir="ltr">
                    (9,375.00 SAR)
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-lg font-bold text-[#E9C349] block" dir="ltr">
                    $2,500.00 USD
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Button: Print Receipt */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-200 transition-colors cursor-pointer"
            >
              <FiPrinter size={14} />
              <span>طباعة الإيصال الفوري</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            BOTTOM SECTION: سجل المعاملات والعمليات الأخيرة (Full Table)
        ───────────────────────────────────────────── */}
        <div
          className="rounded-[16px] border p-5 sm:p-6"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                سجل المعاملات والعمليات الأخيرة
              </h2>
              <p className="text-xs text-[#8A9490] mt-0.5">
                تحديث فوري لجميع حركات الإيداع والخصم في محفظتك
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => showToast("تصفية سجل المعاملات")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-300 font-medium transition-all cursor-pointer"
              >
                <FiSliders size={14} />
                <span>تصفية العمليات</span>
              </button>

              <button
                type="button"
                onClick={() => showToast("جاري تصدير سجل المعاملات (PDF/Excel)...")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-300 font-medium transition-all cursor-pointer"
              >
                <FiDownload size={14} />
                <span>تصدير السجل</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-medium bg-white/[0.01]">
                  <th className="py-3 px-3">الرقم المرجعي</th>
                  <th className="py-3 px-3">التاريخ والوقت</th>
                  <th className="py-3 px-3">نوع الحركة وطريقة الدفع</th>
                  <th className="py-3 px-3">المبلغ المالي</th>
                  <th className="py-3 px-3">حالة العملية</th>
                  <th className="py-3 px-3 text-center">الإيصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Row 1 */}
                <tr className="hover:bg-white/[0.02] transition-colors bg-[#94D3C1]/[0.02]">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#94D3C1] shrink-0" />
                      <span className="font-bold text-white" dir="ltr">
                        #TX-89210
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-gray-200">
                        الآن
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-gray-300">14 مايو 2024 - 11:25 ص</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <FiCreditCard size={15} className="text-gray-400 shrink-0" />
                      <div>
                        <div className="text-white font-medium">شحن محفظة - بطاقة مدى البنكية</div>
                        <div className="text-[11px] text-gray-400" dir="ltr">Mada **** 8824</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#94D3C1] text-sm" dir="ltr">+$2,500.00 USD</div>
                    <div className="text-[11px] text-[#E9C349]" dir="ltr">+9,375.00 SAR</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      مكتملة ومودعة (Completed)
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => showToast("جاري تنزيل إيصال المعاملة #TX-89210...")}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-[#94D3C1] text-gray-400 inline-flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <FiFileText size={13} />
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400" dir="ltr">#TX-89144</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-gray-300">08 مايو 2024 - 04:15 م</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <FiSmartphone size={15} className="text-gray-400 shrink-0" />
                      <div>
                        <div className="text-white font-medium">شحن محفظة - Apple Pay</div>
                        <div className="text-[11px] text-gray-400">معتمد فورياً</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#94D3C1] text-sm" dir="ltr">+$1,000.00 USD</div>
                    <div className="text-[11px] text-[#E9C349]" dir="ltr">+3,750.00 SAR</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] font-medium whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      مكتملة ومودعة
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => showToast("جاري تنزيل إيصال المعاملة #TX-89144...")}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-[#94D3C1] text-gray-400 inline-flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <FiFileText size={13} />
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400" dir="ltr">#TX-88902</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-gray-300">29 أبريل 2024 - 09:00 ص</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <MdOutlineAccountBalance size={15} className="text-gray-400 shrink-0" />
                      <div>
                        <div className="text-white font-medium">إيداع بنكي مؤسسي (IBAN)</div>
                        <div className="text-[11px] text-gray-400">مصرف الإنماء</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#94D3C1] text-sm" dir="ltr">+$10,000.00 USD</div>
                    <div className="text-[11px] text-[#E9C349]" dir="ltr">+37,500.00 SAR</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] font-medium whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      مكتملة ومودعة
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => showToast("جاري تنزيل إيصال المعاملة #TX-88902...")}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-[#94D3C1] text-gray-400 inline-flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <FiFileText size={13} />
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

"use client";

import { useState } from "react";
import {
  FiCheck,
  FiDownload,
  FiPrinter,
  FiCopy,
  FiCheckCircle,
  FiCreditCard,
  FiSmartphone,
  FiChevronLeft,
  FiArrowLeft,
  FiFileText,
  FiShield,
  FiSliders,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineAccountBalanceWallet,
  MdOutlineCampaign,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────
   Design Tokens — MacBook Pro 16_ - 122
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
  success: "#22C55E",
  successBg: "rgba(34, 197, 94, 0.12)",
  text: "#FFFFFF",
  muted: "#8A9490",
};

export default function DepositConfirmedPage() {
  const router = useRouter();
  const locale = useLocale();

  const [toastMessage, setToastMessage] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCopyTxn = () => {
    navigator.clipboard?.writeText("TXN-99842-EMR");
    setCopiedId(true);
    showToast("تم نسخ الرقم المرجعي للعملية (TXN-99842-EMR) بنجاح!");
    setTimeout(() => setCopiedId(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    showToast("جاري تجهيز وتحميل الفاتورة الضريبية الرسمية (PDF)...");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen text-white pb-14"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999999] bg-[#151819] border border-[#22C55E]/40 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <FiCheckCircle size={16} className="text-[#22C55E] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 pt-5">

        {/* ── TOP BREADCRUMB & STATUS BADGE ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <MdOutlineAccountBalanceWallet size={16} className="text-gray-400" />
              <span>المحفظة والمالية</span>
            </div>
            <FiChevronLeft size={14} className="text-gray-600" />
            <span className="text-gray-200 font-medium">تأكيد عملية الشحن</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span>معاملة موثقة فورياً</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            HERO CONFIRMATION BANNER
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl border p-6 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          {/* Right info (in RTL) */}
          <div className="flex-1">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
                <FiCheck size={12} className="stroke-[3]" />
                <span>ناجحة ومودعة بالكامل</span>
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border"
                style={{
                  backgroundColor: T.accentBg,
                  borderColor: T.accentBorder,
                  color: T.accent,
                }}
              >
                <BsPatchCheckFill size={13} />
                <span>معتمدة ومتوافقة مع المعايير الشرعية</span>
              </span>
            </div>

            {/* Main title */}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1"
                style={{ backgroundColor: "rgba(148, 211, 193, 0.12)", border: `1px solid ${T.accentBorder}` }}
              >
                <FiShield size={20} className="text-[#94D3C1]" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  تم شحن محفظتك بنجاح بمبلغ{" "}
                  <span className="font-mono text-white" dir="ltr">2,500.00$</span>{" "}
                  دولار أمريكي{" "}
                  <span className="text-[#E9C349] font-medium font-mono text-lg sm:text-xl block sm:inline mt-1 sm:mt-0">
                    (ما يعادل 9,375.00 ر.س)
                  </span>
                </h1>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-3xl">
                  تم استلام الدفعة واعتمادها بنجاح عبر بوابة الدفع الإلكتروني المشفرة، والرصيد متاح الآن بالكامل لبدء وإطلاق حملاتك الإعلانية.
                </p>
              </div>
            </div>

            {/* Email notice */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-gray-400 flex flex-wrap items-center gap-2">
              <span>تم إرسال إشعار تأكيد الدفع ونسخة الفاتورة الإلكترونية المعتمدة إلى بريدك المسجل:</span>
              <span
                className="px-2.5 py-0.5 rounded-lg border text-gray-200 font-mono text-xs"
                style={{ backgroundColor: T.cardInner, borderColor: "rgba(255,255,255,0.10)" }}
                dir="ltr"
              >
                advertiser@company.sa
              </span>
            </div>
          </div>

          {/* Left CTA Buttons (in RTL) */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-72 shrink-0">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/advertiser/campaigns`)}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-orange-500/25"
              style={{
                background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
              }}
            >
              <MdOutlineCampaign size={18} />
              <span>تخصيص الميزانية لحملة إعلانية</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="w-full py-3.5 px-5 rounded-xl border border-white/10 hover:border-white/20 bg-[#101213] hover:bg-white/[0.04] text-xs sm:text-sm font-semibold text-gray-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiDownload size={16} />
              <span>تحميل الفاتورة الضريبية (PDF)</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MIDDLE SECTION — 2 COLUMNS
            Right: حالة رصيد المحفظة المحدث (Col-8 in RTL)
            Left:  ملخص إيصال الإيداع المالي (Col-4 in RTL)
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 items-start">

          {/* ══════════ RIGHT COLUMN (lg:col-span-8 in RTL) ══════════ */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Main Balance Card */}
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: T.accentBg, border: `1px solid ${T.accentBorder}` }}
                  >
                    <MdOutlineAccountBalanceWallet size={16} className="text-[#94D3C1]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">حالة رصيد المحفظة المحدث فورياً</h2>
                    <p className="text-[10px] text-gray-500 mt-0.5">الرصيد جاهز للتخصيص دون فترة انتظار</p>
                  </div>
                </div>

                <span
                  className="text-[11px] px-3 py-1 rounded-lg border text-gray-300 font-medium"
                  style={{ backgroundColor: T.cardInner, borderColor: "rgba(255,255,255,0.08)" }}
                >
                  محمي بنظام الضمان
                </span>
              </div>

              {/* 3 Balance Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
                {/* 1. الرصيد السابق */}
                <div
                  className="rounded-xl border p-4 text-center sm:text-right"
                  style={{ backgroundColor: T.cardInner, borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <span className="text-[11px] text-gray-400 block mb-1">الرصيد السابق</span>
                  <div className="text-lg font-bold text-white font-mono" dir="ltr">
                    $24,500.00
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono mt-0.5 block" dir="ltr">
                    91,875.00 SAR
                  </span>
                </div>

                {/* 2. المبلغ المضاف */}
                <div
                  className="rounded-xl border p-4 text-center sm:text-right"
                  style={{ backgroundColor: T.cardInner, borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <span className="text-[11px] text-gray-400 block mb-1">المبلغ المضاف</span>
                  <div className="text-lg font-bold text-[#22C55E] font-mono" dir="ltr">
                    +$5000
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono mt-0.5 block" dir="ltr">
                    +9,375.00 SAR
                  </span>
                </div>

                {/* 3. الرصيد الإجمالي المتاح (Highlighted) */}
                <div
                  className="rounded-xl border p-4 text-center sm:text-right"
                  style={{
                    backgroundColor: "rgba(148, 211, 193, 0.08)",
                    borderColor: "rgba(148, 211, 193, 0.35)",
                  }}
                >
                  <span className="text-[11px] text-[#94D3C1] font-medium block mb-1">
                    الرصيد الإجمالي المتاح
                  </span>
                  <div className="text-xl font-extrabold text-[#94D3C1] font-mono" dir="ltr">
                    $29,500.00
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 block" dir="ltr">
                    101,250.00 SAR
                  </span>
                </div>
              </div>

              {/* Escrow Legal Box */}
              <div
                className="rounded-xl border p-4 mb-4"
                style={{ backgroundColor: T.cardInner, borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MdOutlineAccountBalance size={16} className="text-[#94D3C1]" />
                    <span className="text-xs font-bold text-white">حالة الرصيد الشرعي والائتماني</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20">
                    نشط ومودع فورياً
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  الرصيد مودع فورياً في حساب أمانات الضمان (Escrow Protection) المتوافق مع الشريعة الإسلامية. لا يتم خصم أي مبالغ إلا عند تحقيق نقرات ومشاهدات فعلية لحملاتك المعتمدة.
                </p>
              </div>

              {/* Progress bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>جاهزية تخصيص الميزانية للحملات الحالية</span>
                  <span className="font-bold text-[#E9C349] font-mono">100% متوفر</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full w-full"
                    style={{
                      background: "linear-gradient(90deg, #E9C349 0%, #AACEC6 50%, #94D3C1 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 2 Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: إطلاق حملة جديدة */}
              <div
                onClick={() => router.push(`/${locale}/advertiser/campaigns`)}
                className="rounded-xl border p-4 flex items-center justify-between cursor-pointer transition-all hover:border-white/20 group"
                style={{ backgroundColor: T.card, borderColor: T.cardBorder }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <MdOutlineCampaign size={20} className="text-[#94D3C1]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#94D3C1] transition-colors">
                      إطلاق حملة جديدة
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">استثمر رصيدك فورياً</p>
                  </div>
                </div>
                <FiArrowLeft size={16} className="text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
              </div>

              {/* Card 2: سجل الفواتير الضريبية */}
              <div
                onClick={handleDownloadInvoice}
                className="rounded-xl border p-4 flex items-center justify-between cursor-pointer transition-all hover:border-white/20 group"
                style={{ backgroundColor: T.card, borderColor: T.cardBorder }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <MdOutlineReceiptLong size={20} className="text-[#E9C349]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#E9C349] transition-colors">
                      سجل الفواتير الضريبية
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">أرشيف ZATCA المعتمد</p>
                  </div>
                </div>
                <FiArrowLeft size={16} className="text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
              </div>
            </div>

          </div>

          {/* ══════════ LEFT COLUMN (lg:col-span-4 in RTL) ══════════
              ملخص إيصال الإيداع المالي
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4">
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <MdOutlineReceiptLong size={18} className="text-gray-400" />
                  <h3 className="text-sm font-bold text-white">ملخص إيصال الإيداع المالي</h3>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
                  <FiCheck size={10} className="stroke-[3]" />
                  <span>مكتملة</span>
                </span>
              </div>

              {/* Transaction ID box */}
              <div
                className="rounded-xl border p-3 mb-4 flex items-center justify-between"
                style={{ backgroundColor: T.cardInner, borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div>
                  <span className="text-[10px] text-gray-400 block mb-0.5">
                    الرقم المرجعي للعملية (Transaction ID)
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-200" dir="ltr">
                    TXN-99842-EMR
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTxn}
                  className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/25 bg-white/5 text-[11px] text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FiCopy size={12} />
                  <span>{copiedId ? "تم النسخ" : "نسخ"}</span>
                </button>
              </div>

              {/* Detail Rows */}
              <div className="space-y-3 text-xs">
                {/* Row 1 */}
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-gray-300 font-mono" dir="ltr">
                    14 مايو 2024 · 11:25 ص
                  </span>
                  <span>تاريخ وتوقيت المعاملة</span>
                </div>

                {/* Row 2 */}
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 font-medium">
                      دفع فوري
                    </span>
                    <span className="text-[11px] text-[#E9C349] font-mono" dir="ltr">
                      **** 8824
                    </span>
                    <span className="text-gray-300 font-bold">Mada</span>
                  </div>
                  <span>وسيلة الدفع المستخدمة</span>
                </div>

                {/* Row 3 */}
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center gap-1.5 text-[#22C55E] font-medium text-xs">
                    <FiCheck size={12} className="stroke-[3]" />
                    <span>مقبولة فورياً</span>
                  </div>
                  <span>حالة الدفع في البوابة</span>
                </div>

                {/* Row 4 */}
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-gray-300 font-mono" dir="ltr">
                    Al Rajhi Bank Gateway
                  </span>
                  <span>المصدر والاعتماد</span>
                </div>

                <div className="border-t border-white/[0.07] pt-2 my-2 space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="font-mono text-gray-300" dir="ltr">
                      $2,173.91 USD
                    </span>
                    <span>المبلغ المشحون الصافي</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="font-mono text-gray-300" dir="ltr">
                      $0.00 USD
                    </span>
                    <span>رسوم معالجة البوابة (%0)</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="font-mono text-gray-300" dir="ltr">
                      $326.09 USD
                    </span>
                    <span>ضريبة القيمة المضافة (15% VAT)</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.10] pt-3">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-base font-extrabold text-[#22C55E] font-mono block" dir="ltr">
                        $2,500.00 USD
                      </span>
                      <span className="text-[10px] text-[#E9C349] font-mono" dir="ltr">
                        (9,375.00 SAR)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white">الإجمالي المدفوع</span>
                  </div>
                </div>
              </div>

              {/* Print Receipt Link */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full mt-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] text-xs text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FiPrinter size={13} />
                <span>طباعة الإيصال الفوري</span>
              </button>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            BOTTOM SECTION: سجل المعاملات والعمليات الأخيرة
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl border p-5 sm:p-6 mt-5"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.07] gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">سجل المعاملات والعمليات الأخيرة</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                تحديث فوري لجميع حركات الإيداع والخصم في محفظتك
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => showToast("تم تفعيل فلترة العمليات")}
                className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/25 bg-[#101213] text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FiSliders size={13} />
                <span>تصفية العمليات</span>
              </button>

              <button
                type="button"
                onClick={() => showToast("جاري تصدير سجل العمليات...")}
                className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/25 bg-[#101213] text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FiDownload size={13} />
                <span>تصدير السجل</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-white/[0.06] text-gray-400 text-[11px]">
                  <th className="py-3 px-3 font-medium">الرقم المرجعي</th>
                  <th className="py-3 px-3 font-medium">التاريخ والوقت</th>
                  <th className="py-3 px-3 font-medium">نوع الحركة وطريقة الدفع</th>
                  <th className="py-3 px-3 font-medium">المبلغ المالي</th>
                  <th className="py-3 px-3 font-medium">حالة العملية</th>
                  <th className="py-3 px-3 font-medium text-center">الإيصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {/* Row 1 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-gray-200 font-bold" dir="ltr">
                      <span>TX-89210#</span>
                      <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-[#94D3C1]/15 text-[#94D3C1] font-semibold">
                        الآن
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-gray-400 font-mono" dir="ltr">
                    14 مايو 2024 · 11:25 ص
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-gray-400">
                        <FiCreditCard size={12} />
                      </div>
                      <span className="text-gray-200">شحن محفظة - بطاقة مدى البنكية</span>
                      <span className="text-[#E9C349] font-mono text-[10px]" dir="ltr">
                        **** 8824
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-[#22C55E]" dir="ltr">
                      +$5000 USD
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono" dir="ltr">
                      +9,375.00 SAR
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#94D3C1]/15 border border-[#94D3C1]/30 text-[#94D3C1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]"></span>
                      <span>مكتملة ومودعة (Completed)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={handleDownloadInvoice}
                      className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      <FiDownload size={13} />
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-mono text-gray-300 font-medium" dir="ltr">
                    TX-89144#
                  </td>
                  <td className="py-3.5 px-3 text-gray-400 font-mono" dir="ltr">
                    08 مايو 2024 · 04:15 م
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-gray-400">
                        <FiSmartphone size={12} />
                      </div>
                      <span className="text-gray-200">شحن محفظة - Apple Pay</span>
                      <span className="text-gray-500 text-[10px]">(معتمد فورياً)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-white" dir="ltr">
                      +$1,000.00 USD
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono" dir="ltr">
                      +3,750.00 SAR
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#94D3C1]/15 border border-[#94D3C1]/30 text-[#94D3C1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]"></span>
                      <span>مكتملة ومودعة</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={handleDownloadInvoice}
                      className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      <FiDownload size={13} />
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-mono text-gray-300 font-medium" dir="ltr">
                    TX-88902#
                  </td>
                  <td className="py-3.5 px-3 text-gray-400 font-mono" dir="ltr">
                    29 أبريل 2024 · 09:00 ص
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-gray-400">
                        <MdOutlineAccountBalance size={12} />
                      </div>
                      <span className="text-gray-200">إيداع بنكي مؤسسي (IBAN)</span>
                      <span className="text-gray-500 text-[10px]">(مصرف الإنماء)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-white" dir="ltr">
                      +$10,000.00 USD
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono" dir="ltr">
                      +37,500.00 SAR
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#94D3C1]/15 border border-[#94D3C1]/30 text-[#94D3C1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]"></span>
                      <span>مكتملة ومودعة</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={handleDownloadInvoice}
                      className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      <FiDownload size={13} />
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

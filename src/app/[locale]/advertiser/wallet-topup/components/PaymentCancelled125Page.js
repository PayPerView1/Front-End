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
  FiSliders,
  FiEdit3,
  FiHeadphones,
  FiFilter,
  FiFileText,
  FiEye,
  FiCheckCircle,
  FiChevronRight,
  FiSmartphone,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────
   Design Tokens — MacBook Pro 16_ - 125
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  accent: "#94D3C1",
  accentBorder: "rgba(148, 211, 193, 0.35)",
  accentBg: "rgba(148, 211, 193, 0.08)",
  orange: "#FF5A00",
  orangeHover: "#FF6A15",
  warning: "#E9C349",
  warningBg: "rgba(233, 195, 73, 0.12)",
  warningBorder: "rgba(233, 195, 73, 0.30)",
  text: "#FFFFFF",
  muted: "#8A9490",
};

export default function PaymentCancelled125Page() {
  const router = useRouter();
  const locale = useLocale();

  const [toastMessage, setToastMessage] = useState("");
  const txnCode = "TXN-CNL-8421-EMR";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(txnCode);
    showToast("تم نسخ الرقم المرجعي بنجاح!");
  };

  const handleRetryTopup = () => {
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
            SECTION 1: TOP BANNER (تم إلغاء عملية الدفع)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-[20px] border p-6 sm:p-7 mb-6"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* Right side in RTL: Title, Icon & Description */}
            <div className="flex items-start gap-4 flex-1">
              {/* Circular Avatar / Pause Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#1D2123] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-lg font-bold text-[#94D3C1]">⏸</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  تم إلغاء عملية الدفع
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-3xl">
                  قمت بإلغاء المعاملة أثناء التواجد في بوابة الدفع الإلكتروني. نؤكد لك أنه لم يتم خصم أي مبلغ من حسابك البنكي أو بطاقتك الائتمانية، ولم تترتب أي رسوم إدارية على هذا الإلغاء.
                </p>
              </div>
            </div>

            {/* Left side in RTL: Pill & Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#101F1B] border border-[#94D3C1]/30 text-[#94D3C1]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]" />
                <span>تم الإلغاء بواسطة المستخدم</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-1">
                {/* Orange Button: إعادة محاولة شحن المحفظة */}
                <button
                  type="button"
                  onClick={handleRetryTopup}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all cursor-pointer hover:brightness-110 active:scale-95"
                  style={{
                    backgroundColor: T.orange,
                    boxShadow: "0 4px 16px rgba(255, 90, 0, 0.35)",
                  }}
                >
                  <FiRotateCcw size={14} className="stroke-[2.5]" />
                  <span>إعادة محاولة شحن المحفظة</span>
                </button>

                {/* Dark Button: العودة للمحفظة */}
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/advertiser/wallet-topup`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  style={{
                    backgroundColor: "#181B1C",
                  }}
                >
                  <MdOutlineAccountBalanceWallet size={16} />
                  <span>العودة للمحفظة</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2: TWO COLUMNS (تفاصيل المعاملة الملغاة + سلامة الرصيد)
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* ── CARD 1 (RIGHT in RTL): سلامة رصيد المحفظة ── */}
          <div
            className="rounded-[20px] border p-6 flex flex-col justify-between"
            style={{
              backgroundColor: T.card,
              borderColor: T.cardBorder,
              boxShadow: "0 6px 28px rgba(0,0,0,0.4)",
            }}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#94D3C1]/10 border border-[#94D3C1]/30 flex items-center justify-center shrink-0">
                    <BsPatchCheckFill size={16} className="text-[#94D3C1]" />
                  </div>
                  <h2 className="text-base font-bold text-white">سلامة رصيد المحفظة</h2>
                </div>

                <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#94D3C1]/10 border border-[#94D3C1]/30 text-[#94D3C1]">
                  الرصيد لم يتأثر 100%
                </span>
              </div>

              {/* Main Balance Display */}
              <div className="mb-6">
                <span className="text-xs text-gray-400 block mb-1.5 font-medium">
                  رصيد المحفظة المتاح حالياً
                </span>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight" dir="ltr">
                    $24,500
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#E9C349]" dir="ltr">
                    (91,875.00 ر.س)
                  </span>
                </div>
              </div>

              {/* Green Verification Note */}
              <div className="flex items-center gap-2.5 text-xs text-gray-300 mb-6 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                <FiCheckCircle size={16} className="text-[#94D3C1] shrink-0" />
                <span>جاهز لتخصيص الميزانيات أو تشغيل الحملات الإعلانية الحالية فوراً.</span>
              </div>

              {/* Sub-Section: خيارات مرنة لإكمال العملية */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiSliders size={14} className="text-[#94D3C1]" />
                  <span className="text-xs font-bold text-gray-300">
                    خيارات مرنة لإكمال العملية
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: تعديل المبلغ */}
                  <button
                    type="button"
                    onClick={handleRetryTopup}
                    className="p-3.5 rounded-xl border border-white/10 hover:border-[#94D3C1]/50 bg-[#101213] hover:bg-[#131b18] text-right transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#94D3C1]">تعديل المبلغ</span>
                      <FiEdit3 size={13} className="text-[#94D3C1] opacity-70 group-hover:opacity-100" />
                    </div>
                    <span className="text-[11px] text-gray-400 block">شحن مبلغ أقل أو مخصص</span>
                  </button>

                  {/* Option 2: التحويل البنكي */}
                  <button
                    type="button"
                    onClick={handleBankTransfer}
                    className="p-3.5 rounded-xl border border-white/10 hover:border-[#E9C349]/50 bg-[#101213] hover:bg-[#1a1811] text-right transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#E9C349]">التحويل البنكي</span>
                      <MdOutlineAccountBalance size={14} className="text-[#E9C349] opacity-70 group-hover:opacity-100" />
                    </div>
                    <span className="text-[11px] text-gray-400 block">إيداع حسابات الشركات (IBAN)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card Footer: محادثة الدعم المالي */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => showToast("جاري فتح محادثة الدعم المالي...")}
                className="text-white hover:text-[#94D3C1] font-bold transition-colors cursor-pointer"
              >
                محادثة الدعم المالي
              </button>

              <div className="flex items-center gap-1.5 text-gray-400">
                <FiHeadphones size={14} className="text-gray-400" />
                <span>تحتاج لمساعدة فورية؟</span>
              </div>
            </div>
          </div>

          {/* ── CARD 2 (LEFT in RTL): تفاصيل محاولة المعاملة الملغاة ── */}
          <div
            className="rounded-[20px] border p-6 flex flex-col justify-between"
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
                    <h2 className="text-base font-bold text-white">تفاصيل محاولة المعاملة الملغاة</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">سجل تدقيق النظام الأمني المالي</p>
                  </div>
                </div>

                {/* Transaction Code Pill */}
                <div className="flex items-center gap-2 bg-[#101213] border border-white/10 px-3 py-1 rounded-lg">
                  <span className="text-xs font-mono text-gray-300 tracking-wider" dir="ltr">
                    {txnCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="نسخ الرقم المرجعي"
                  >
                    <FiCopy size={12} />
                  </button>
                </div>
              </div>

              {/* Two rows of details grid */}
              <div className="space-y-4 mb-5">
                {/* Row 1: Amount & Gateway */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount Requested */}
                  <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-gray-400">المبلغ المطلوب شحنه</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#E9C349]/10 text-[#E9C349] border border-[#E9C349]/30">
                        لم يتم الخصم
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white font-mono" dir="ltr">
                        $2,500.00
                      </span>
                      <span className="text-xs text-[#E9C349] font-medium" dir="ltr">
                        (9,375.00 ر.س)
                      </span>
                    </div>
                  </div>

                  {/* Payment Gateway */}
                  <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                    <span className="text-[11px] text-gray-400 block mb-1.5">بوابة الدفع المحددة</span>
                    <div className="flex items-center gap-2">
                      <FiCreditCard size={15} className="text-[#94D3C1] shrink-0" />
                      <span className="text-xs font-bold text-white">
                        بوابة الدفع الآمنة (Mada / Visa / Apple Pay)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Date & Cancellation Reason */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cancellation Date */}
                  <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                    <span className="text-[11px] text-gray-400 block mb-1.5">وقت وتاريخ الإلغاء</span>
                    <div className="flex items-center gap-2">
                      <FiClock size={14} className="text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-200">
                        الآن • 14 مايو 2024 - 11:32:18 ص (توقيت مكة)
                      </span>
                    </div>
                  </div>

                  {/* Stop Reason */}
                  <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06]">
                    <span className="text-[11px] text-gray-400 block mb-1.5">سبب الإيقاف المسجل</span>
                    <div className="flex items-center gap-2 text-[#E9C349]">
                      <FiXCircle size={15} className="shrink-0" />
                      <span className="text-xs font-semibold">
                        إلغاء يدوي من قبل العميل (Checkout Aborted)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative Note */}
              <div className="bg-[#101213] p-4 rounded-xl border border-white/[0.06] flex items-start gap-3 mb-5">
                <FiInfo size={16} className="text-[#E9C349] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  إذا قمت بإلغاء العملية لتغيير طريقة السداد أو تعديل ميزانية الحملات الإعلانية الحلال، يمكنك البدء من جديد واختيار التحويل عبر الحسابات البنكية المعتمدة أو استكمال الدفع باستخدام Apple Pay في ثوانٍ معدودة.
                </p>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Right: تغيير وسيلة الدفع أو المبلغ */}
              <button
                type="button"
                onClick={handleRetryTopup}
                className="inline-flex items-center gap-1.5 text-[#E9C349] hover:text-[#f3d262] font-bold transition-colors cursor-pointer"
              >
                <span>تغيير وسيلة الدفع أو المبلغ</span>
                <FiArrowLeft size={14} />
              </button>

              {/* Left Group: PCI-DSS Badge + Download Button */}
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101213] border border-white/10 text-gray-400 text-[11px]">
                  <FiShield size={13} className="text-[#94D3C1]" />
                  <span>شهادة الأمان المالي PCI-DSS</span>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("جاري إنشاء وتحميل إشعار العملية (PDF)...")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101213] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <FiDownload size={13} />
                  <span>تحميل إشعار العملية (PDF)</span>
                </button>
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

                {/* ROW 1: The Cancelled Transaction (Highlighted) */}
                <tr className="bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349]" />
                      <span dir="ltr">TX-89210#</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-sans">
                        الآن
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    14 مايو 2024 - 11:25 ص
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <FiCreditCard size={14} className="text-gray-300" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">شحن محفظة - بطاقة مدى البنكية</span>
                        <span className="text-[10px] text-gray-500 font-mono" dir="ltr">8824 ****</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-[#94D3C1] block text-sm" dir="ltr">
                      +$2,500.00 USD
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans" dir="ltr">
                      +9,375.00 SAR
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E9C349]/15 border border-[#E9C349]/30 text-[#E9C349]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349]" />
                      <span>ملغاة بواسطة المستخدم</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleRetryTopup}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181B1C] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        <FiRotateCcw size={11} />
                        <span>إعادة المحاولة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => showToast("عرض تفاصيل المحاولة...")}
                        className="w-7 h-7 rounded-lg bg-[#181B1C] hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="معاينة"
                      >
                        <FiEye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* ROW 2: Apple Pay Approved */}
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
                      className="text-gray-400 hover:text-white transition-colors inline-block"
                      title="تحميل الإيصال"
                    >
                      <FiDownload size={14} />
                    </button>
                  </td>
                </tr>

                {/* ROW 3: IBAN Approved */}
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
                      className="text-gray-400 hover:text-white transition-colors inline-block"
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

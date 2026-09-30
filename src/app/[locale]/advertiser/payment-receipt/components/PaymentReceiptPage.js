"use client";

import { useState } from "react";
import {
  FiCheck,
  FiMail,
  FiSend,
  FiSliders,
  FiAlertTriangle,
  FiFileText,
  FiShield,
  FiPrinter,
  FiCopy,
  FiDownload,
  FiClock,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineAccountBalanceWallet,
  MdOutlineQrCode2,
} from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────
   Design Tokens — MacBook Pro 16_ - 129
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  emailBg: "#0E1011",
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

export default function PaymentReceiptPage() {
  const router = useRouter();
  const locale = useLocale();

  const [toastMessage, setToastMessage] = useState("");
  const [pref1, setPref1] = useState(true);
  const [pref2, setPref2] = useState(true);
  const [pref3, setPref3] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCopyNotice = () => {
    navigator.clipboard?.writeText(
      "تأكيد استلام الدفعة وشحن المحفظة بنجاح - إشعار رقم TXN-89240-EMR | المبلغ: $5,000.00 USD"
    );
    showToast("تم نسخ نص الإشعار إلى الحافظة!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    showToast("جاري تجهيز وتحميل الفاتورة الضريبية الرسمية (PDF)...");
  };

  const handleResendEmail = () => {
    showToast("تمت إعادة إرسال الإشعار التوثيقي إلى advertiser@emeraldbrand.sa بنجاح!");
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999999] bg-[#151819] border border-[#22C55E]/40 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <FiCheckCircle size={16} className="text-[#22C55E] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 pt-5">

        {/* ══════════════════════════════════════════════════════════════
            TOP BANNER: إشعار التسليم التوثيقي بنجاح
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ backgroundColor: T.card, borderColor: T.cardBorder }}
        >
          {/* Right side: Icon + Title + Email info */}
          <div className="flex items-start gap-3.5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <FiMail size={20} className="text-gray-300" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-base sm:text-lg font-bold text-white">
                  تم تسليم إشعار تأكيد الدفع التوثيقي بنجاح
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
                  <FiCheck size={12} className="stroke-[3]" />
                  <span>تم التسليم للمستلم (Delivered 200 OK)</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                تم إرسال بريد المعاملة الفوري تلقائياً إلى بريدك المعتمد{" "}
                <span className="text-[#E9C349] font-mono font-medium" dir="ltr">
                  advertiser@emeraldbrand.sa
                </span>{" "}
                مع إرفاق الفاتورة الضريبية المبسطة وكشف الحساب المالي.
              </p>
            </div>
          </div>

          {/* Left side: Timestamp Badge */}
          <div
            className="rounded-xl border p-3 text-right shrink-0 w-full md:w-auto"
            style={{ backgroundColor: T.cardInner, borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="text-[11px] text-gray-500 mb-0.5">طابع الإرسال الزمني:</div>
            <div className="text-xs font-bold text-gray-200 font-mono" dir="ltr">
              14 مايو 2024 · 04:30:16 PM (توقيت مكة)
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MAIN GRID — 2 COLUMNS (RTL order: Right = Preview, Left = Details)
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 items-start">

          {/* ══════════ RIGHT COLUMN (lg:col-span-8 in RTL) ══════════
              معاينة البريد الإلكتروني الرسمي المستلم (RFC 822 / MIME Preview)
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8">
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              {/* Preview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.07] gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <FiMail size={15} className="text-gray-300" />
                  </div>
                  <h2 className="text-sm font-bold text-white">
                    معاينة البريد الإلكتروني الرسمي المستلم (RFC 822 / MIME Preview)
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-[#94D3C1] animate-pulse"></span>
                  <span className="text-[11px]">مشفر 1.3 TLS مع شهادة DKIM & DMARC صالحة</span>
                </div>
              </div>

              {/* Email Metadata Block (Header Fields) */}
              <div
                className="rounded-xl border p-3.5 my-4 space-y-2 text-xs"
                style={{ backgroundColor: T.cardInner, borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-gray-400">من (Sender):</span>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span>قسم الفواتير والتحصيل | إيميرالد للإعلانات</span>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-mono text-gray-400"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      dir="ltr"
                    >
                      &lt;billing@emerald-ads.com&gt;
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-gray-400">إلى (Recipient):</span>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span>المعلن المعتمد (شركة الأفق الرقمية للتسويق)</span>
                    <span className="text-gray-400 font-mono text-[11px]" dir="ltr">
                      &lt;advertiser@emeraldbrand.sa&gt;
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1 border-t border-white/[0.05] pt-2">
                  <span className="text-gray-400">الموضوع:</span>
                  <span className="font-bold text-white">
                    تأكيد استلام الدفعة وشحن المحفظة بنجاح - إشعار رقم TXN-89240-EMR
                  </span>
                </div>
              </div>

              {/* ── STYLIZED EMAIL BODY (LETTER) ── */}
              <div
                className="rounded-2xl border p-6 sm:p-8"
                style={{
                  backgroundColor: T.emailBg,
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                {/* Brand / Logo Top Row inside Email */}
                <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
                  {/* Left: Financial Notice Tag */}
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#E9C349]">إشعار مالي معتمد</div>
                    <div className="text-[10px] text-gray-500 font-mono" dir="ltr">
                      TXN-89240-EMR
                    </div>
                  </div>

                  {/* Right: PPV Logo */}
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white tracking-wide">Pay Per View</div>
                      <div className="text-[8px] text-gray-400 tracking-wider">
                        PAY PER VIEW ADS • HALAL AD EXCHANGE
                      </div>
                    </div>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #FB9D00 0%, #FC5601 100%)",
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
                        <path d="M10 8L16 12L10 16V8Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hero Confirmation */}
                <div className="py-6 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-green-500/10"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.12)",
                      border: "1px solid rgba(34, 197, 94, 0.35)",
                    }}
                  >
                    <FiCheck size={28} className="text-[#22C55E] stroke-[2.5]" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                    تم شحن محفظتك بنجاح
                  </h3>
                  <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                    مرحباً شريكنا العزيز، نؤكد لك استلام المبلغ وإضافته فورياً إلى رصيد حسابك الإعلاني المتاح للصرف على الحملات الإعلانية الحلال.
                  </p>

                  {/* Highlight Amount Pill */}
                  <div
                    className="inline-flex items-baseline gap-2.5 px-6 py-2.5 rounded-xl border mt-5"
                    style={{
                      backgroundColor: T.card,
                      borderColor: "rgba(255,255,255,0.10)",
                    }}
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono" dir="ltr">
                      $5,000
                    </span>
                    <span className="text-xs text-gray-400 font-mono" dir="ltr">
                      (18,750.00 ر.س)
                    </span>
                  </div>
                </div>

                {/* 2x2 Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Card 1: Amount Deposited */}
                  <div
                    className="rounded-xl border p-3.5 flex items-start justify-between"
                    style={{ backgroundColor: T.card, borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">
                        1. المبلغ المشحون (Amount Deposited)
                      </span>
                      <div className="text-sm font-bold text-white font-mono" dir="ltr">
                        $5,000.00 USD
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        ما يعادل 18,750.00 ريال سعودي
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(34, 197, 94, 0.12)", color: "#22C55E" }}
                    >
                      <MdOutlineAccountBalanceWallet size={15} />
                    </div>
                  </div>

                  {/* Card 2: Payment Method */}
                  <div
                    className="rounded-xl border p-3.5 flex items-start justify-between"
                    style={{ backgroundColor: T.card, borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">
                        2. وسيلة الدفع (Payment Method)
                      </span>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>بطاقة مدى المصرفية (Mada)</span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        معتمدة عبر نظام سداد المالي 3D-Secure
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "rgba(233, 195, 73, 0.12)", color: "#E9C349" }}
                      >
                        <FiCreditCard size={14} />
                      </div>
                      <span className="text-[10px] font-mono text-[#E9C349]" dir="ltr">
                        **** 8824
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Timestamp */}
                  <div
                    className="rounded-xl border p-3.5 flex items-start justify-between"
                    style={{ backgroundColor: T.card, borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">
                        3. تاريخ وتوقيت المعاملة (Timestamp)
                      </span>
                      <div className="text-xs font-bold text-white">
                        14 مايو 2024 - 04:30:15 مساءً
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        توقيت مكة المكرمة (GMT +3) - رقم المرجع 89240#
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#8A9490" }}
                    >
                      <FiClock size={14} />
                    </div>
                  </div>

                  {/* Card 4: New Balance */}
                  <div
                    className="rounded-xl border p-3.5 flex items-start justify-between"
                    style={{ backgroundColor: T.card, borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">
                        4. الرصيد الجديد بعد الشحن (New Balance)
                      </span>
                      <div className="text-sm font-bold text-white font-mono" dir="ltr">
                        $32,000.00 USD
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        120,000.00 ريال سعودي متاح للإعلانات
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(148, 211, 193, 0.12)", color: T.accent }}
                    >
                      <MdOutlineAccountBalance size={15} />
                    </div>
                  </div>
                </div>

                {/* ZATCA Tax & QR Code Banner */}
                <div
                  className="rounded-xl border p-3.5 flex items-center justify-between mt-3.5 gap-4"
                  style={{ backgroundColor: T.card, borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <div className="text-xs space-y-1">
                    <div className="text-gray-400">
                      الرقم الضريبي الموحد للمنصة (VAT ID):{" "}
                      <span className="text-[#E9C349] font-mono font-bold" dir="ltr">
                        310294857200003
                      </span>
                    </div>
                    <div className="text-gray-400">
                      رقم الفاتورة الضريبية الرسمية:{" "}
                      <span className="text-gray-200 font-mono" dir="ltr">
                        INV-2024-0514-99
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-left hidden sm:block">
                      <span className="text-[10px] text-gray-300 block font-medium">فاتورة ضريبية مبسطة</span>
                      <span className="text-[9px] text-[#94D3C1] block">مشفّرة بتطبيق ZATCA مرحلة 2</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                      <MdOutlineQrCode2 size={32} className="text-black" />
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {/* Button 1: To Budget/Payments */}
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/advertiser/wallet-topup-142`)}
                    className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-orange-500/25"
                    style={{
                      background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
                    }}
                  >
                    <MdOutlineAccountBalanceWallet size={16} />
                    <span>الانتقال إلى لوحة الميزانية والمدفوعات</span>
                  </button>

                  {/* Button 2: Download Tax Invoice */}
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="py-3 px-4 rounded-xl border border-white/10 bg-[#151819] hover:bg-white/[0.06] text-xs sm:text-sm font-bold text-gray-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FiDownload size={15} />
                    <span>تحميل الفاتورة الضريبية (PDF)</span>
                  </button>
                </div>

                {/* Legal Escrow Disclaimer */}
                <div className="text-center text-[10px] text-gray-500 mt-6 pt-4 border-t border-white/[0.05] space-y-1 leading-relaxed">
                  <p>
                    هذا البريد الإلكتروني آلي وموثق محاسبياً من نظام الضمان المالي Escrow التابع لمنصة إيميرالد للإعلانات الحلال.
                  </p>
                  <p>
                    إذا لم تكن قد قمت بهذه المعاملة، يرجى تجميد الحساب فوراً والتواصل مع فريق الأمن المالي عبر{" "}
                    <span className="text-[#94D3C1] font-mono" dir="ltr">
                      security@emerald-ads.com
                    </span>
                  </p>
                </div>
              </div>

              {/* Bottom Footer Bar below Preview */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-white/[0.06] gap-3">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <FiShield size={14} className="text-[#94D3C1] shrink-0" />
                  <span>تم التحقق من تطابق نص الإشعار مع متطلبات سيناريو الدفع رقم 8 (US-BUDGET-01)</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    <FiPrinter size={13} />
                    <span>طباعة المعاينة</span>
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    type="button"
                    onClick={handleCopyNotice}
                    className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    <FiCopy size={13} />
                    <span>نسخ نص الإشعار</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════ LEFT COLUMN (lg:col-span-4 in RTL) ══════════
              3 Cards: بيانات التسليم + تخصيص التنبيهات + حالة الرصيد
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* ── CARD 1: بيانات التسليم الفوري للبريد ── */}
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: T.accentBg, border: `1px solid ${T.accentBorder}` }}
                  >
                    <FiSend size={13} className="text-[#94D3C1]" />
                  </div>
                  <h3 className="text-sm font-bold text-white">بيانات التسليم الفوري للبريد</h3>
                </div>
                <span
                  className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#94D3C1]/30 text-[#94D3C1]"
                  style={{ backgroundColor: T.accentBg }}
                >
                  ONLINE SMTP
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-gray-400">حالة الإرسال:</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22C55E]">
                    <FiCheck size={12} className="stroke-[3]" />
                    <span>تم التسليم (200 OK)</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-gray-400">البريد المستلم:</span>
                  <span className="text-xs text-gray-300 font-mono truncate max-w-[170px]" dir="ltr">
                    ...advertiser@emeraldbrand.sa
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-gray-400">بروتوكول التشفير:</span>
                  <span className="text-xs font-mono font-bold text-[#E9C349]" dir="ltr">
                    TLS 1.3 Strict / AES-256
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-gray-400">معرّف الرسالة المالي:</span>
                  <span className="text-xs font-mono text-gray-400" dir="ltr">
                    msg_emr_994827103984
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-400">مدة معالجة الإشعار:</span>
                  <span className="text-xs text-gray-300 font-mono" dir="ltr">
                    (فوري عقب الدفع) 340ms
                  </span>
                </div>
              </div>

              {/* Action Button: Resend Notification */}
              <button
                type="button"
                onClick={handleResendEmail}
                className="w-full mt-4 py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/20 text-xs font-semibold text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                style={{ backgroundColor: T.cardInner }}
              >
                <FiMail size={14} className="text-[#94D3C1]" />
                <span>إعادة إرسال الإشعار إلى نفس البريد</span>
              </button>
            </div>

            {/* ── CARD 2: تخصيص تنبيهات المحفظة والمالية ── */}
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: T.accentBg, border: `1px solid ${T.accentBorder}` }}
                  >
                    <FiSliders size={13} className="text-[#94D3C1]" />
                  </div>
                  <h3 className="text-sm font-bold text-white">تخصيص تنبيهات المحفظة والمالية</h3>
                </div>
                <span className="text-[10px] text-gray-500">تحديث تلقائي</span>
              </div>

              <p className="text-[11px] text-gray-400 mt-2 mb-4 leading-relaxed">
                تحكم في أنواع إشعارات البريد التي تتلقاها فور حدوث أي نشاط مالي في حسابك.
              </p>

              <div className="space-y-2.5">
                {/* Option 1 */}
                <label
                  onClick={() => setPref1(!pref1)}
                  className="rounded-xl border p-3 flex items-center justify-between cursor-pointer transition-all hover:border-white/20"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: pref1 ? "rgba(148, 211, 193, 0.35)" : T.cardBorder,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#94D3C1]/10 border border-[#94D3C1]/20 flex items-center justify-center shrink-0 text-[#94D3C1]">
                      <FiMail size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        إشعار شحن المحفظة فورياً
                      </span>
                      <span className="text-[10px] text-gray-500">
                        تأكيد المبالغ المودعة (موصى به دائماً)
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0"
                    style={{
                      backgroundColor: pref1 ? T.accent : "transparent",
                      borderColor: pref1 ? T.accent : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {pref1 && <FiCheck size={11} className="text-black stroke-[3]" />}
                  </div>
                </label>

                {/* Option 2 */}
                <label
                  onClick={() => setPref2(!pref2)}
                  className="rounded-xl border p-3 flex items-center justify-between cursor-pointer transition-all hover:border-white/20"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: pref2 ? "rgba(239, 68, 68, 0.35)" : T.cardBorder,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-red-400">
                      <FiAlertTriangle size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        تنبيه انخفاض الرصيد عن 500$
                      </span>
                      <span className="text-[10px] text-gray-500">
                        لتفادي توقف بث إعلانات الحملات
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0"
                    style={{
                      backgroundColor: pref2 ? "#EF4444" : "transparent",
                      borderColor: pref2 ? "#EF4444" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {pref2 && <FiCheck size={11} className="text-white stroke-[3]" />}
                  </div>
                </label>

                {/* Option 3 */}
                <label
                  onClick={() => setPref3(!pref3)}
                  className="rounded-xl border p-3 flex items-center justify-between cursor-pointer transition-all hover:border-white/20"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: pref3 ? "rgba(251, 157, 0, 0.35)" : T.cardBorder,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
                      <FiFileText size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        كشف حساب شهري مجمع
                      </span>
                      <span className="text-[10px] text-gray-500">
                        ملف PDF شامل الفواتير الضريبية
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0"
                    style={{
                      backgroundColor: pref3 ? "#FB9D00" : "transparent",
                      borderColor: pref3 ? "#FB9D00" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {pref3 && <FiCheck size={11} className="text-black stroke-[3]" />}
                  </div>
                </label>
              </div>

              {/* Save Preferences Button */}
              <button
                type="button"
                onClick={() => showToast("تم حفظ وتطبيق تفضيلات التنبيهات بنجاح!")}
                className="w-full mt-4 py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/20 text-xs font-semibold text-gray-300 hover:text-white text-center transition-all cursor-pointer"
                style={{ backgroundColor: T.cardInner }}
              >
                حفظ وتطبيق التفضيلات
              </button>
            </div>

            {/* ── CARD 3: حالة رصيد المحفظة النشط ── */}
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-white/[0.07]">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: T.accentBg, border: `1px solid ${T.accentBorder}` }}
                >
                  <MdOutlineAccountBalanceWallet size={15} className="text-[#94D3C1]" />
                </div>
                <h3 className="text-sm font-bold text-white">حالة رصيد المحفظة النشط</h3>
              </div>

              {/* Big Balance */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono" dir="ltr">
                  $32,000.00
                </span>
                <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-full" dir="ltr">
                  +18.5% شحن جديد
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1 mb-4">
                120,000.00 ر.س جاهزة للتوزيع على الميزانيات
              </p>

              {/* Allocate Budget Button (Orange) */}
              <button
                type="button"
                onClick={() => router.push(`/${locale}/advertiser/campaigns`)}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-orange-500/25"
                style={{
                  background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
                }}
              >
                <TbTargetArrow size={16} />
                <span>تخصيص الرصيد على الحملات الإعلانية</span>
              </button>

              {/* Transactions History Link */}
              <button
                type="button"
                onClick={() => router.push(`/${locale}/advertiser/wallet-topup-142`)}
                className="w-full mt-3 text-center text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                عرض سجل حركات الإيداع والسحب
              </button>
            </div>

          </div>
          {/* ══════════ END LEFT COLUMN ══════════ */}

        </div>
      </div>
    </div>
  );
}

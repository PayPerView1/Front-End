"use client";

import { useState } from "react";
import {
  FiCheck,
  FiCreditCard,
  FiSmartphone,
  FiLock,
  FiSliders,
  FiGlobe,
  FiHelpCircle,
  FiSlash,
  FiInfo,
  FiBriefcase,
  FiArrowLeft,
  FiX,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineGavel,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────
   Design Tokens - MacBook Pro 16_ - 126
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  cardBorderHover: "rgba(255, 255, 255, 0.16)",
  accent: "#94D3C1",
  accentBorder: "rgba(148, 211, 193, 0.35)",
  accentBorder50: "rgba(148, 211, 193, 0.50)",
  accentBg: "rgba(148, 211, 193, 0.08)",
  warning: "#E9C349",
  warningBg: "rgba(233, 195, 73, 0.12)",
  warningBorder: "rgba(233, 195, 73, 0.30)",
  danger: "#F87171",
  dangerBg: "rgba(248, 113, 113, 0.10)",
  dangerBorder: "rgba(248, 113, 113, 0.25)",
  text: "#FFFFFF",
  sub: "#C5CECA",
  muted: "#8A9490",
  orangeFrom: "#FB9D00",
  orangeTo: "#FC5601",
};

export default function DepositGatewayPage() {
  const router = useRouter();
  const locale = useLocale();

  // Selected Method (Default: mada as in screenshot)
  const [selectedMethod, setSelectedMethod] = useState("mada");

  // Deposit Amount (Default: $2,500.00 as in screenshot)
  const [depositAmount, setDepositAmount] = useState(2500);

  // Modals & Drawers
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("المملكة العربية السعودية (SA)");
  const [explanationModal, setExplanationModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Calculations
  const vatRate = 0.15;
  const vatAmount = depositAmount * vatRate;
  const gatewayFee = selectedMethod === "card" ? depositAmount * 0.015 : 0;
  const totalAmount = depositAmount + vatAmount + gatewayFee;

  const sarRate = 3.75;
  const depositSar = depositAmount * sarRate;
  const vatSar = vatAmount * sarRate;
  const totalSar = totalAmount * sarRate;

  // Submit / Proceed
  const handleProceed = () => {
    if (selectedMethod === "bank_transfer") {
      showToast("جاري الانتقال إلى صفحة تأكيد وتدقيق الحوالة البنكية...");
      setTimeout(() => {
        router.push(`/${locale}/advertiser/bank-transfer`);
      }, 700);
    } else {
      showToast("تم تأكيد وسيلة الدفع والانتقال إلى الرصيد التراكمي...");
      setTimeout(() => {
        router.push(`/${locale}/advertiser/multi-deposit`);
      }, 700);
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
            TOP SECTION: Geo-detection Banner (المملكة العربية السعودية)
        ───────────────────────────────────────────── */}
        <div
          className="rounded-[16px] border p-4 sm:p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* Right Side: Globe Icon + Title + Description */}
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#94D3C1]">
              <FiGlobe size={24} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
                  المنطقة الجغرافية المكتشفة: {currentCountry}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#94D3C1]/10 border border-[#94D3C1]/30 text-[#94D3C1] text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]" />
                  IP محلي موثق
                </span>
              </div>

              <p className="text-xs text-[#8A9490] leading-relaxed mt-1 max-w-3xl">
                وفقاً للنظام المالي المعتمد والمعايير الشرعية لمنصة Pay Per View، تُعرض فقط قنوات الدفع المصرحة والمستقرة
                إقليمياً. الوسائل غير المتوافقة تظهر مقيدة ولا يمكن اعتمادها للمعاملة الحالية.
              </p>
            </div>
          </div>

          {/* Left Side: Change Country Button */}
          <button
            type="button"
            onClick={() => setIsCountryModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-300 font-medium transition-all cursor-pointer shrink-0 self-start md:self-center"
          >
            <FiSliders size={14} />
            <span>تغيير البلد أو طلب استثناء تجاري</span>
          </button>
        </div>

        {/* ─────────────────────────────────────────────
            MAIN TWO-COLUMN GRID:
            - RIGHT (~67% in RTL): الوسائل المعتمدة + غير المتاحة + بانر الوكالة
            - LEFT (~33% in RTL): الرصيد المتاح + تفاصيل طلب الشحن
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ═══════════════════════════════════════════
              RIGHT COLUMN (lg:col-span-8 in RTL = RIGHT side):
          ═══════════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* ── SECTION 1: الوسائل المعتمدة والنشطة لمنطقتك (4) ── */}
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
                <div className="flex items-center gap-2.5">
                  <FiCheckCircle size={20} className="text-[#94D3C1]" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    الوسائل المعتمدة والنشطة لمنطقتك (4)
                  </h2>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 font-medium self-start sm:self-auto">
                  معالجة فورية · توافق شرعي 100%
                </span>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                {/* Card 1: بطاقة مدى البنكية (Mada) */}
                <div
                  onClick={() => setSelectedMethod("mada")}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[135px] ${
                    selectedMethod === "mada"
                      ? "border-[#94D3C1] shadow-[0_0_15px_rgba(148,211,193,0.15)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  style={{
                    backgroundColor:
                      selectedMethod === "mada"
                        ? "rgba(148, 211, 193, 0.05)"
                        : T.cardInner,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Radio / Check indicator */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedMethod === "mada"
                            ? "bg-[#94D3C1] text-black"
                            : "border border-white/20 bg-transparent"
                        }`}
                      >
                        {selectedMethod === "mada" && <FiCheck size={13} className="stroke-[3]" />}
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          بطاقة مدى البنكية (Mada)
                        </h3>
                        <p className="text-xs text-[#8A9490] mt-0.5">خصم فوري مباشر</p>
                      </div>
                    </div>

                    {/* Mada Logo Tag */}
                    <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold font-mono tracking-wider">
                      mada
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3 text-xs">
                    <span className="text-gray-400">فوري · آمن</span>
                    <span className="text-[#94D3C1] font-medium">رسوم الخدمة: 0.00 ر.س (مجاناً)</span>
                  </div>
                </div>

                {/* Card 2: البطاقات الائتمانية (Visa / MC) */}
                <div
                  onClick={() => setSelectedMethod("card")}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[135px] ${
                    selectedMethod === "card"
                      ? "border-[#94D3C1] shadow-[0_0_15px_rgba(148,211,193,0.15)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  style={{
                    backgroundColor:
                      selectedMethod === "card"
                        ? "rgba(148, 211, 193, 0.05)"
                        : T.cardInner,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedMethod === "card"
                            ? "bg-[#94D3C1] text-black"
                            : "border border-white/20 bg-transparent"
                        }`}
                      >
                        {selectedMethod === "card" && <FiCheck size={13} className="stroke-[3]" />}
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          البطاقات الائتمانية (Visa / MC)
                        </h3>
                        <p className="text-xs text-[#8A9490] mt-0.5">الشركات والبطاقات الدولية</p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                      <FiCreditCard size={16} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3 text-xs">
                    <span className="text-gray-400">تأكيد تلقائي</span>
                    <span className="text-gray-300 font-medium">رسوم العمليات: 1.5%</span>
                  </div>
                </div>

                {/* Card 3: التحويل البنكي المباشر (سداد / آيبان) */}
                <div
                  onClick={() => setSelectedMethod("bank_transfer")}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[135px] ${
                    selectedMethod === "bank_transfer"
                      ? "border-[#94D3C1] shadow-[0_0_15px_rgba(148,211,193,0.15)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  style={{
                    backgroundColor:
                      selectedMethod === "bank_transfer"
                        ? "rgba(148, 211, 193, 0.05)"
                        : T.cardInner,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedMethod === "bank_transfer"
                            ? "bg-[#94D3C1] text-black"
                            : "border border-white/20 bg-transparent"
                        }`}
                      >
                        {selectedMethod === "bank_transfer" && (
                          <FiCheck size={13} className="stroke-[3]" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          التحويل البنكي المباشر (سداد / آيبان)
                        </h3>
                        <p className="text-xs text-[#8A9490] mt-0.5">مخصص للحسابات المؤسسية الكبرى</p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                      <MdOutlineAccountBalance size={18} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3 text-xs">
                    <span className="text-[#E9C349] font-medium">فاتورة ضريبية رسمية</span>
                    <span className="text-gray-300 font-medium">المبالغ الكبيرة (+5,000$)</span>
                  </div>
                </div>

                {/* Card 4: Apple Pay */}
                <div
                  onClick={() => setSelectedMethod("apple_pay")}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer relative flex flex-col justify-between min-h-[135px] ${
                    selectedMethod === "apple_pay"
                      ? "border-[#94D3C1] shadow-[0_0_15px_rgba(148,211,193,0.15)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  style={{
                    backgroundColor:
                      selectedMethod === "apple_pay"
                        ? "rgba(148, 211, 193, 0.05)"
                        : T.cardInner,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedMethod === "apple_pay"
                            ? "bg-[#94D3C1] text-black"
                            : "border border-white/20 bg-transparent"
                        }`}
                      >
                        {selectedMethod === "apple_pay" && (
                          <FiCheck size={13} className="stroke-[3]" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white">Apple Pay</h3>
                        <p className="text-xs text-[#8A9490] mt-0.5">دفع بلمسة واحدة عبر الجهاز</p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                      <FiSmartphone size={16} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3 text-xs">
                    <span className="text-gray-400">موصى به للأجهزة الذكية</span>
                    <span className="text-gray-300 font-medium">رسوم الخدمة: 0.00 ر.س</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ── SECTION 2: وسائل دفع غير متاحة أو مقيدة جغرافياً (3) ── */}
            <div
              className="rounded-[16px] border p-5 sm:p-6"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
              }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <FiSlash size={20} className="text-red-400" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    وسائل دفع غير متاحة أو مقيدة جغرافياً (3)
                  </h2>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 font-medium self-start sm:self-auto">
                  <FiLock size={12} />
                  تخضع لقيود النطاق الجغرافي والضوابط التمويلية
                </span>
              </div>

              {/* Disabled List */}
              <div className="space-y-3">

                {/* Item 1: PayPal */}
                <div
                  className="rounded-xl border p-4 transition-all opacity-80 hover:opacity-100"
                  style={{
                    backgroundColor: "rgba(16, 18, 19, 0.6)",
                    borderColor: T.cardBorder,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-gray-500">
                        <MdOutlineAccountBalanceWallet size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-300">
                            حساب بايبال التجاري (PayPal International)
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-medium">
                            غير مدعوم في منطقتك الجغرافية
                          </span>
                        </div>
                        <p className="text-xs text-[#8A9490] mt-1 leading-relaxed">
                          غير مصرح به لفوترة الإعلانات في النطاق الجغرافي (SA / GCC) طبقاً للوائح الإفصاح المالي.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExplanationModal({
                          title: "سبب قيد بوابة PayPal",
                          body: "نظراً للوائح البنك المركزي السعودي وهيئة الزكاة والضريبة والجمارك (ZATCA)، تتطلب الفواتير الضريبية المعتمدة ربطاً بنكياً وطنياً عبر شبكة مدى أو سداد أو حسابات آيبان محلية مرخصة.",
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <FiInfo size={13} />
                      <span>سبب القيد</span>
                    </button>
                  </div>
                </div>

                {/* Item 2: BNPL / Klarna */}
                <div
                  className="rounded-xl border p-4 transition-all opacity-80 hover:opacity-100"
                  style={{
                    backgroundColor: "rgba(16, 18, 19, 0.6)",
                    borderColor: T.cardBorder,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-gray-500">
                        <MdOutlineGavel size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-300">
                            الدفع الآجل والتقسيط المالي (BNPL / Klarna)
                          </h3>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E9C349]/10 border border-[#E9C349]/25 text-[#E9C349] text-[10px] font-medium">
                            <MdOutlineGavel size={11} />
                            محظور لعدم التوافق مع الضوابط الشرعية
                          </span>
                        </div>
                        <p className="text-xs text-[#8A9490] mt-1 leading-relaxed">
                          تتضمن غرامات تأخير أو فوائد مركبة لا تتطابق مع ميثاق الرقابة الشرعية المعتمد لإعلانات إدميرالد.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExplanationModal({
                          title: "الحكم والضوابط الشرعية بخصوص الدفع الآجل (BNPL)",
                          body: "تنص معايير الهيئة الشرعية للمنصة على عدم السماح بأي شروط تعاقدية تتضمن فوائد ربوية أو غرامات تأخير تصاعدية، وتلتزم المنصة بالمعاملات النقدية الخالصة المتوافقة 100%.",
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <FiInfo size={13} />
                      <span>الحكم الشرعي</span>
                    </button>
                  </div>
                </div>

                {/* Item 3: Western Union / SEPA */}
                <div
                  className="rounded-xl border p-4 transition-all opacity-80 hover:opacity-100"
                  style={{
                    backgroundColor: "rgba(16, 18, 19, 0.6)",
                    borderColor: T.cardBorder,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-gray-500">
                        <MdOutlineAccountBalance size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-300">
                            الحوالات السريعة والمحافظ الدولية (Western Union / SEPA)
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium">
                            غير مدعومة لأسباب الامتثال المالي الدولي
                          </span>
                        </div>
                        <p className="text-xs text-[#8A9490] mt-1 leading-relaxed">
                          تتطلب المعاملات تسوية مصرفية مباشرة عبر حساب آيبان معتمد لشركتك أو بطاقتك المسجلة.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExplanationModal({
                          title: "شروط الامتثال الدولي للحوالات",
                          body: "وفقاً لمتطلبات مكافحة غسل الأموال (AML) وتوثيق هوية الشركات (KYB)، لا تُقبل الحوالات مجهولة المصدر أو عبر شركات الصرافة السريعة غير المربوطة بسجل تجاري.",
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <FiInfo size={13} />
                      <span>شروط الامتثال</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* ── SECTION 3: هل تدير وكالة إعلانية متعددة الفروع خارج الشرق الأوسط؟ ── */}
            <div
              className="rounded-[16px] border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#94D3C1]">
                  <FiBriefcase size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    هل تدير وكالة إعلانية متعددة الفروع خارج الشرق الأوسط؟
                  </h3>
                  <p className="text-xs text-[#8A9490] leading-relaxed mt-1 max-w-2xl">
                    يمكن للحسابات الموثقة من فئة الشركات القابضة (Enterprise Verified) طلب استثناءات لتفعيل بوابات مصرفية
                    أوروبية أو أمريكية (مثل Stripe Wire أو SEPA B2B Direct Debit) بعد تقديم السجل التجاري والشهادة الضريبية
                    للدولة المعنية.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("فتح استمارة طلب استثناء تجاري للمؤسسات الدولية")}
                className="text-xs text-[#94D3C1] hover:underline font-semibold flex items-center gap-1 shrink-0 cursor-pointer self-start md:self-auto"
              >
                <span>تقديم طلب تفعيل وسيلة إقليمية مخصصة</span>
                <span>←</span>
              </button>
            </div>

          </div>

          {/* ═══════════════════════════════════════════
              LEFT COLUMN (lg:col-span-4 in RTL = LEFT side):
              - الرصيد المتاح حالياً
              - تفاصيل طلب الشحن
          ═══════════════════════════════════════════ */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* Card A: الرصيد المتاح حالياً */}
            <div
              className="rounded-[16px] border p-5"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
              }}
            >
              {/* Header: Label on Right, Badge on Left */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs text-gray-400 font-medium">الرصيد المتاح حالياً</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300">
                  <MdOutlineAccountBalanceWallet size={13} className="text-[#94D3C1]" />
                  محفظة نشطة
                </span>
              </div>

              {/* Big Balance Amount: Right Aligned */}
              <div className="flex items-baseline justify-start gap-2 mb-0.5">
                <span
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  dir="ltr"
                >
                  $24,500.00
                </span>
                <span className="text-xs text-gray-400 font-medium">USD</span>
              </div>

              {/* SAR Equivalent: Right Aligned */}
              <div className="text-xs text-[#E9C349] font-medium mb-3.5 text-right">
                <span dir="ltr">91,875.00</span> ر.س (ريال سعودي)
              </div>

              {/* Progress Runway bar (Fills from Right to Left in RTL) */}
              <div
                className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-2.5 relative flex justify-start"
                dir="rtl"
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "55%",
                    background: "linear-gradient(to left, #94D3C1, #10B981)",
                  }}
                />
              </div>

              <p className="text-[11px] text-[#8A9490] leading-relaxed text-right">
                كفاية الميزانية: تغطي 18 يوماً من الحملات النشطة بمعدل الصرف الحالي.
              </p>
            </div>

            {/* Card B: تفاصيل طلب الشحن */}
            <div
              className="rounded-[16px] border p-5"
              style={{
                backgroundColor: T.card,
                borderColor: T.cardBorder,
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
              }}
            >
              {/* Header: Title on Right, Order Tag on Left */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                <h3 className="text-base font-bold text-white">تفاصيل طلب الشحن</h3>
                <span
                  className="text-[11px] px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold"
                  dir="ltr"
                >
                  ORD-8942-SA
                </span>
              </div>

              {/* Selected Method Display */}
              <div
                className="rounded-xl p-3 border mb-4 flex items-center justify-between"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: T.cardBorder,
                }}
              >
                <span className="text-xs text-gray-400">الوسيلة المختارة:</span>
                <div className="flex items-center gap-2">
                  <FiCreditCard size={15} className="text-[#94D3C1]" />
                  <span className="text-xs font-bold text-white">
                    {selectedMethod === "mada"
                      ? "بطاقة مدى البنكية (Mada)"
                      : selectedMethod === "card"
                      ? "البطاقات الائتمانية (Visa / MC)"
                      : selectedMethod === "bank_transfer"
                      ? "التحويل البنكي المباشر (سداد / آيبان)"
                      : "Apple Pay"}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs mb-4">
                {/* Net Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">مبلغ الشحن الصافي:</span>
                  <div className="text-left">
                    <span className="font-bold text-white text-sm block" dir="ltr">
                      ${depositAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-gray-400 block" dir="ltr">
                      {depositSar.toLocaleString("en-US", { minimumFractionDigits: 2 })} ر.س
                    </span>
                  </div>
                </div>

                {/* Gateway Fee */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">رسوم بوابة الدفع الإلكترونية:</span>
                  <span className="text-[#94D3C1] font-medium">0.00 ر.س (معفية)</span>
                </div>

                {/* VAT (15%) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span>ضريبة القيمة المضافة</span>
                    <span dir="ltr">(15% VAT):</span>
                    <FiHelpCircle size={13} className="text-gray-500 cursor-pointer" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-white text-sm block" dir="ltr">
                      ${vatAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-gray-400 block" dir="ltr">
                      {vatSar.toLocaleString("en-US", { minimumFractionDigits: 2 })} ر.س
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Total Box */}
              <div
                className="rounded-xl p-3.5 border mb-4"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: T.cardBorder,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-200 block mb-0.5">
                      الإجمالي المستحق للدفع:
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      شامل كافة الضرائب والرسوم
                    </span>
                  </div>
                  <div className="text-left">
                    <span
                      className="text-xl sm:text-2xl font-bold text-[#E9C349] tracking-tight block"
                      dir="ltr"
                    >
                      ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className="text-xs text-[#E9C349] font-medium block mt-0.5"
                      dir="ltr"
                    >
                      {totalSar.toLocaleString("en-US", { minimumFractionDigits: 2 })} ر.س
                    </span>
                  </div>
                </div>
              </div>

              {/* Sharia Compliance Badge (Matches Single Line with Checkmark on Left) */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-300 flex items-center justify-between gap-2 mb-4">
                <span className="leading-snug">
                  معاملة مالية نقية مطابقة للمعيار الشرعي رقم (14) للمصارف الإسلامية
                </span>
                <FiCheckCircle size={16} className="text-[#94D3C1] shrink-0" />
              </div>

              {/* Action Button: Orange Gradient */}
              <button
                type="button"
                onClick={handleProceed}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-[0.98] hover:brightness-110 cursor-pointer"
                style={{
                  background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
                  boxShadow: "0 4px 18px rgba(251, 157, 0, 0.35)",
                }}
              >
                <FiLock size={16} />
                <span>المتابعة لإتمام الدفع الآمن</span>
              </button>

              <p className="text-[10.5px] text-gray-500 text-center mt-2.5 leading-relaxed">
                بالنقر على المتابعة، أنت توافق على شروط سياسة الفوترة والامتثال المالي لإعلانات Pay Per View.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────
          MODAL: Change Country / Exception Modal
      ───────────────────────────────────────────── */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-[99999999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-2xl border p-6 text-white relative shadow-2xl"
            style={{
              backgroundColor: T.card,
              borderColor: T.accentBorder,
            }}
          >
            <button
              type="button"
              onClick={() => setIsCountryModalOpen(false)}
              className="absolute left-4 top-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#94D3C1]/10 border border-[#94D3C1]/30 flex items-center justify-center text-[#94D3C1]">
                <FiGlobe size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تغيير النطاق الجغرافي للفوترة</h3>
                <p className="text-xs text-gray-400">تحديد البلد وتحديث البوابات المعتمدة</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {[
                { name: "المملكة العربية السعودية (SA)", note: "مدى، سداد، فيزا، ماستركارد" },
                { name: "الإمارات العربية المتحدة (AE)", note: "Visa, Mastercard, Apple Pay, SEPA" },
                { name: "الكويت (KW)", note: "KNET, Visa, Mastercard" },
                { name: "قطر (QA)", note: "QCB, Visa, Mastercard" },
                { name: "مصر (EG)", note: "Fawry, Meeza, Visa" },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => {
                    setCurrentCountry(c.name);
                    setIsCountryModalOpen(false);
                    showToast(`تم تحديث النطاق الجغرافي: ${c.name}`);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    currentCountry === c.name
                      ? "border-[#94D3C1] bg-[#94D3C1]/10 text-white"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/5 text-gray-300"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{c.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{c.note}</div>
                  </div>
                  {currentCountry === c.name && <FiCheck size={16} className="text-[#94D3C1]" />}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsCountryModalOpen(false)}
              className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          MODAL: Explanation Modal (سبب القيد / الحكم الشرعي / الامتثال)
      ───────────────────────────────────────────── */}
      {explanationModal && (
        <div className="fixed inset-0 z-[99999999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-2xl border p-6 text-white relative shadow-2xl"
            style={{
              backgroundColor: T.card,
              borderColor: T.cardBorder,
            }}
          >
            <button
              type="button"
              onClick={() => setExplanationModal(null)}
              className="absolute left-4 top-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E9C349]">
                <FiInfo size={18} />
              </div>
              <h3 className="text-base font-bold text-white">{explanationModal.title}</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {explanationModal.body}
            </p>

            <button
              type="button"
              onClick={() => setExplanationModal(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium cursor-pointer"
            >
              فهمت ذلك
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

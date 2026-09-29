"use client";

import { useState } from "react";
import {
  FiPlus,
  FiFileText,
  FiDownload,
  FiTrendingUp,
  FiCheckCircle,
  FiRefreshCw,
  FiArrowUpRight,
  FiSliders,
  FiCreditCard,
  FiSmartphone,
  FiShield,
  FiLock,
  FiCheck,
  FiCopy,
  FiX,
  FiSearch,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineCampaign,
  MdOutlineLayers,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { Link } from "@/i18n/navigation";

/* ─────────────────────────────────────────────
   Design Tokens - MacBook Pro 16_ - 127
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  cardBorderHover: "rgba(255, 255, 255, 0.15)",
  accent: "#94D3C1",
  accentBorder: "rgba(148, 211, 193, 0.35)",
  accentBorder50: "rgba(148, 211, 193, 0.50)",
  accentBg: "rgba(148, 211, 193, 0.08)",
  accentGlow: "rgba(148, 211, 193, 0.15)",
  warning: "#E9C349",
  warningBg: "rgba(233, 195, 73, 0.12)",
  warningBorder: "rgba(233, 195, 73, 0.30)",
  text: "#FFFFFF",
  sub: "#C5CECA",
  muted: "#8A9490",
  orangeFrom: "#FB9D00",
  orangeTo: "#FC5601",
};

export default function MultiDepositPage() {
  // Interactive States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [copiedTxn, setCopiedTxn] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Deposit Form
  const [newAmount, setNewAmount] = useState("1000");
  const [newMethod, setNewMethod] = useState("visa");

  // Initial Transactions Data matching MacBook Pro 16_ - 127
  const [transactions, setTransactions] = useState([
    {
      id: "TXN-89240",
      batch: "الدفعة 3 (الآن)",
      dotColor: "#94D3C1",
      date: "14 مايو 2024 - 04:30 م",
      title: "شحن فوري - فيزا دولية",
      subtitle: "Visa **** 4419",
      type: "visa",
      amountUSD: "+$2,500.00 USD",
      amountSAR: "+9,375.00 SAR",
      balanceUSD: "$32,000.00 USD",
      isLatest: true,
      status: "مكتملة ومودعة",
      statusCode: "deposited",
    },
    {
      id: "TXN-89228",
      batch: "الدفعة 2",
      dotColor: "#E9C349",
      date: "14 مايو 2024 - 01:45 م",
      title: "شحن فوري - بطاقة مدى البنكية",
      subtitle: "Mada **** 8824",
      type: "mada",
      amountUSD: "+$3,000.00 USD",
      amountSAR: "+11,250.00 SAR",
      balanceUSD: "$29,500.00 USD",
      isLatest: false,
      status: "مكتملة ومودعة",
      statusCode: "deposited",
    },
    {
      id: "TXN-89210",
      batch: "الدفعة 1",
      dotColor: "#E9C349",
      date: "14 مايو 2024 - 10:15 ص",
      title: "شحن فوري - Apple Pay",
      subtitle: "معتمد ومودع",
      type: "apple_pay",
      amountUSD: "+$2,000.00 USD",
      amountSAR: "+7,500.00 SAR",
      balanceUSD: "$26,500.00 USD",
      isLatest: false,
      status: "مكتملة ومودعة",
      statusCode: "deposited",
    },
    {
      id: "TXN-88992",
      batch: "",
      dotColor: "#8A9490",
      date: "13 مايو 2024 - 05:20 م",
      title: "شحن محفظة - نظام سداد (SADAD)",
      subtitle: "يوم أمس",
      type: "sadad",
      amountUSD: "+$5,000.00 USD",
      amountSAR: "+18,750.00 SAR",
      balanceUSD: "$24,500.00 USD",
      isLatest: false,
      status: "مكتملة",
      statusCode: "completed_old",
    },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCopy = (text) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedTxn(text);
    showToast(`تم نسخ المعرف: ${text}`);
    setTimeout(() => setCopiedTxn(null), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("تم تحديث الرصيد التراكمي وسجل الحركات فورياً");
    }, 600);
  };

  const handleAddDeposit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmount) || 1000;
    const sarAmount = (parsedAmount * 3.75).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const usdFormatted = parsedAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const newTxnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxn = {
      id: newTxnId,
      batch: `الدفعة ${transactions.length} (الآن)`,
      dotColor: "#94D3C1",
      date: "الآن - 14 مايو 2024",
      title:
        newMethod === "visa"
          ? "شحن فوري - فيزا دولية"
          : newMethod === "mada"
          ? "شحن فوري - بطاقة مدى البنكية"
          : "شحن فوري - Apple Pay",
      subtitle:
        newMethod === "visa"
          ? "Visa **** 7712"
          : newMethod === "mada"
          ? "Mada **** 9910"
          : "معتمد ومودع",
      type: newMethod,
      amountUSD: `+$${usdFormatted} USD`,
      amountSAR: `+${sarAmount} SAR`,
      balanceUSD: `$${(32000 + parsedAmount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })} USD`,
      isLatest: true,
      status: "مكتملة ومودعة",
      statusCode: "deposited",
    };

    setTransactions([newTxn, ...transactions.map((t) => ({ ...t, isLatest: false }))]);
    setIsDepositModalOpen(false);
    showToast(`تمت إضافة دفعة جديدة بنجاح (${newTxn.amountUSD}) وتحديث الرصيد تراكمياً`);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.title.includes(filterQuery) ||
      t.subtitle.includes(filterQuery);
    const matchesType = filterMethod === "all" || t.type === filterMethod;
    return matchesSearch && matchesType;
  });

  return (
    <div
      dir="rtl"
      className="min-h-screen text-white pb-16 selection:bg-[#EA580C] selection:text-white"
      style={{
        backgroundColor: T.bg,
        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[999999] bg-[#151819] border border-[#94D3C1]/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <FiCheckCircle size={18} className="text-[#94D3C1]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1480px] mx-auto px-3 sm:px-6 pt-3 sm:pt-4">

        {/* ─────────────────────────────────────────────
            TOP BAR: Breadcrumbs & Date Pill Indicator
        ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
              <MdOutlineAccountBalance size={16} className="text-gray-400" />
              المحفظة والمالية
            </span>
            <span className="text-gray-600 text-xs">‹</span>
            <span className="text-[#C5CECA] font-medium">
              عمليات الشحن المتعددة لليوم وتحديث الرصيد تراكمياً
            </span>
          </div>

          {/* Date Indicator Pill */}
          <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151819] border border-white/10 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
            <span className="text-gray-200 font-medium">اليوم: 14 مايو 2024 · 3 عمليات ناجحة</span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            HERO CARD: Main Multiple Charges & Cumulative Banner
        ───────────────────────────────────────────── */}
        <div
          className="rounded-[16px] border p-5 sm:p-7 mb-6 relative overflow-hidden transition-all"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 10px 35px rgba(0, 0, 0, 0.45)",
          }}
        >
          {/* Top Row: Badges & Actions */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

            {/* Right Side: Text, Tags, Big Numbers */}
            <div className="flex-1 min-w-0">
              {/* Badges Cluster */}
              <div className="flex flex-wrap items-center gap-2 mb-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94D3C1]" />
                  3 عمليات شحن ناجحة ومكتملة اليوم
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium">
                  <FiShield size={12} className="text-[#94D3C1]" />
                  ضمن الحدود اليومية المسموحة
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium">
                  <FiLock size={12} className="text-gray-400" />
                  حساب أمانات Escrow شرعي
                </span>
              </div>

              {/* Title & Icon Header */}
              <div className="flex items-start gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/80">
                  <MdOutlineLayers size={26} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-white leading-tight">
                    عمليات شحن متعددة في نفس اليوم وتحديث الرصيد تراكمياً{" "}
                    <span
                      dir="ltr"
                      className="inline-block text-[#94D3C1] font-bold font-mono tracking-tight mr-1"
                      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                    >
                      $32,000.00
                    </span>{" "}
                    <span
                      dir="ltr"
                      className="inline-block text-[#E9C349] font-bold font-mono text-lg sm:text-xl"
                      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                    >
                      (120,000.00 SAR)
                    </span>
                  </h1>
                </div>
              </div>

              {/* Explanatory Paragraph */}
              <p className="text-xs sm:text-[13px] text-[#8A9490] leading-relaxed max-w-3xl mt-1 pr-0 sm:pr-16">
                يقبل النظام كافة عمليات الشحن المجراة خلال اليوم طالما أنها ضمن السقف المالي اليومي المعتمد (50,000$ /
                يومياً). تم قيد كل حركة بشكل منفصل برقم مرجعي مستقل مع تحديث رصيد المحفظة الإجمالي تراكمياً وفورياً.
              </p>
            </div>

            {/* Left Side: 3 Action Buttons */}
            <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto min-w-[240px]">
              {/* Primary Orange Gradient Button */}
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-[0.98] hover:brightness-110 cursor-pointer"
                style={{
                  background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
                  boxShadow: "0 4px 15px rgba(251, 157, 0, 0.35)",
                }}
              >
                <FiCreditCard size={18} />
                <span>إجراء عملية شحن جديدة</span>
              </button>

              {/* Secondary Button 1: Campaign Allocation */}
              <button
                type="button"
                onClick={() => showToast("الانتقال إلى تخصيص الرصيد للحملات الإعلانية")}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <MdOutlineCampaign size={16} className="text-[#94D3C1]" />
                <span>تخصيص الرصيد للحملات الإعلانية</span>
              </button>

              {/* Secondary Button 2: Export Statement */}
              <button
                type="button"
                onClick={() => showToast("جاري إعداد وتحميل كشف حساب اليوم (PDF/Excel)...")}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <FiFileText size={16} className="text-gray-400" />
                <span>تصدير كشف حساب اليوم (PDF/Excel)</span>
              </button>
            </div>
          </div>

          {/* Bottom Status Ribbon inside Hero */}
          <div className="border-t border-white/10 mt-6 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Tracking Today */}
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[#94D3C1]">
                <FiTrendingUp size={14} />
              </div>
              <span>
                التتبع التراكمي المباشر لليوم: 3 حركات إيداع بنجاح - إجمالي المودع اليوم:{" "}
                <strong
                  dir="ltr"
                  className="text-[#94D3C1] font-mono text-sm inline-block"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  +$7,500.00 USD
                </strong>{" "}
                <span
                  dir="ltr"
                  className="text-[#E9C349] font-mono text-xs inline-block"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  (28,125.00 SAR)
                </span>
              </span>
            </div>

            {/* ZATCA Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9C349]/10 border border-[#E9C349]/30 text-[#E9C349] text-[11px] font-medium self-start md:self-auto">
              <BsPatchCheckFill size={13} />
              <span>ZATCA Phase 2 Validated e-Invoices</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            MIDDLE SECTION: Grid 2 Columns
            - RIGHT (in RTL): lg:col-span-8 (تحديث الرصيد التراكمي الفوري + المؤشرات + الخطوات + بطاقات التنقل)
            - LEFT (in RTL): lg:col-span-4 (ملخص المعاملة الأخيرة المنفذة)
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          {/* ═══════════════════════════════════════════
              RIGHT SECTION (lg:col-span-8 in RTL flow = RIGHT side):
              تحديث الرصيد التراكمي الفوري + المؤشرات + الخطوات + بطاقات التنقل
          ═══════════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Main Interactive Balance Card */}
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
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>تحديث الرصيد التراكمي الفوري (سلسلة عمليات اليوم)</span>
                  </h2>
                  <p className="text-xs text-[#8A9490] mt-0.5">
                    التسلسل الزمني لنمو رصيد المحفظة عبر الدفعات المتعاقبة
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-300 font-medium transition-all cursor-pointer"
                  >
                    <FiRefreshCw size={13} className={isRefreshing ? "animate-spin text-[#94D3C1]" : ""} />
                    <span>تحديث فوري مباشر</span>
                  </button>
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <FiArrowUpRight size={16} />
                  </div>
                </div>
              </div>

              {/* 3 Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">

                {/* Card 1: بداية اليوم (First on Right in RTL) */}
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: T.cardBorder,
                  }}
                >
                  <span className="text-xs text-gray-400 block mb-2 font-medium">
                    رصيد بداية اليوم (00:00)
                  </span>
                  <div
                    className="text-lg sm:text-xl font-bold text-white font-mono"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    $24,500.00
                  </div>
                  <div
                    className="text-[11px] text-gray-400 font-mono mt-0.5"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    SAR 91,875.00
                  </div>
                </div>

                {/* Card 2: إجمالي مشحون اليوم (Middle) */}
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: T.cardInner,
                    borderColor: T.cardBorder,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-medium">
                      إجمالي مشحون اليوم (3 دفعات)
                    </span>
                    <FiPlus size={14} className="text-[#94D3C1]" />
                  </div>
                  <div
                    className="text-lg sm:text-xl font-bold text-[#94D3C1] font-mono"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    +$7,500.00
                  </div>
                  <div
                    className="text-[11px] text-gray-400 font-mono mt-0.5"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    +28,125.00 SAR
                  </div>
                </div>

                {/* Card 3: الرصيد التراكمي المتاح الآن (Left - Highlighted with glow) */}
                <div
                  className="rounded-xl p-4 border relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(148, 211, 193, 0.06)",
                    borderColor: "rgba(148, 211, 193, 0.40)",
                    boxShadow: "0 0 20px rgba(148, 211, 193, 0.12)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#94D3C1]">
                      الرصيد التراكمي المتاح الآن
                    </span>
                    <FiCheck size={16} className="text-[#94D3C1]" />
                  </div>
                  <div
                    className="text-xl sm:text-2xl font-bold text-[#94D3C1] font-mono"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    $32,000.00
                  </div>
                  <div
                    className="text-xs text-[#E9C349] font-mono mt-0.5 font-medium"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    SAR 120,000.00
                  </div>
                </div>
              </div>

              {/* Timeline Box: سلسلة تراكم الرصيد حسب توقيت الدفع اليوم */}
              <div
                className="rounded-xl p-4 border mb-5"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: T.cardBorder,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-200">
                    سلسلة تراكم الرصيد حسب توقيت الدفع اليوم
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                    14 مايو 2024
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Step 1 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-gray-300 font-mono text-[11px] flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span className="text-gray-300">دفعة الصباح (10:15 ص) - Apple Pay</span>
                    </div>
                    <div className="flex items-center gap-3 pr-7 sm:pr-0">
                      <span className="text-[#94D3C1] font-mono font-medium" dir="ltr">+$2,000.00</span>
                      <span className="text-gray-500 text-xs">←</span>
                      <span className="text-gray-400 font-mono">
                        الرصيد: <span dir="ltr">$26,500.00</span>
                      </span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-gray-300 font-mono text-[11px] flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span className="text-gray-300">دفعة الظهيرة (01:45 م) - بطاقة مدى Mada</span>
                    </div>
                    <div className="flex items-center gap-3 pr-7 sm:pr-0">
                      <span className="text-[#94D3C1] font-mono font-medium" dir="ltr">+$3,000.00</span>
                      <span className="text-gray-500 text-xs">←</span>
                      <span className="text-gray-400 font-mono">
                        الرصيد: <span dir="ltr">$29,500.00</span>
                      </span>
                    </div>
                  </div>

                  {/* Step 3 (Active Highlighted) */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-lg border transition-all"
                    style={{
                      backgroundColor: "rgba(148, 211, 193, 0.08)",
                      borderColor: "rgba(148, 211, 193, 0.40)",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#94D3C1] text-black font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                        3
                      </span>
                      <span className="text-white font-semibold">
                        دفعة العصر (04:30 م - الأحدث) - فيزا دولية
                      </span>
                    </div>
                    <div className="flex items-center gap-3 pr-7 sm:pr-0">
                      <span className="text-[#94D3C1] font-mono font-bold" dir="ltr">+$2,500.00</span>
                      <span className="text-[#94D3C1] text-xs">←</span>
                      <span className="text-[#E9C349] font-mono font-bold">
                        الرصيد التراكمي: <span dir="ltr">$32,000.00</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Limit Bar */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="text-gray-400">
                    مؤشر الحد اليومي المسموح للشحن (50,000$/يوم)
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#E9C349] font-mono font-medium">
                      <span dir="ltr">$7,500</span> من <span dir="ltr">50,000$</span> (15% مستخدم)
                    </span>
                    <span className="text-gray-400 font-mono">
                      المتبقي المتاح للشحن اليوم: <span dir="ltr">$42,500.00 USD</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: "15%",
                      background: "linear-gradient(90deg, #94D3C1 0%, #10B981 100%)",
                    }}
                  />
                </div>

                <div className="text-[11px] text-[#94D3C1] text-right font-medium">
                  إمكانية الشحن المتعدد مفتوحة فورياً
                </div>
              </div>
            </div>

            {/* Bottom 2 Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Card 1: توزيع الميزانيات على الحملات */}
              <div
                onClick={() => showToast("الانتقال إلى توزيع الميزانيات على الحملات")}
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
                      توزيع الميزانيات على الحملات
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      استثمار الرصيد المتاح البالغ $32,000
                    </p>
                  </div>
                </div>
                <span className="text-gray-500 group-hover:text-white transition-colors text-sm">
                  ←
                </span>
              </div>

              {/* Card 2: كشف الحساب الضريبي الشامل */}
              <div
                onClick={() => showToast("تحميل كشف الحساب الضريبي وفواتير ZATCA...")}
                className="rounded-xl border p-4 flex items-center justify-between cursor-pointer group transition-all hover:border-white/20"
                style={{
                  backgroundColor: T.card,
                  borderColor: T.cardBorder,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E9C349] group-hover:scale-105 transition-transform">
                    <MdOutlineAccountBalance size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#94D3C1] transition-colors">
                      كشف الحساب الضريبي الشامل
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      تحميل فواتير ZATCA الإلكترونية
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
              LEFT SECTION (lg:col-span-4 in RTL flow = LEFT side):
              ملخص المعاملة الأخيرة المنفذة (الدفعة 3)
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
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <MdOutlineReceiptLong size={20} className="text-[#94D3C1]" />
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    ملخص المعاملة الأخيرة المنفذة (الدفعة 3)
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  مكتملة ومقيدة
                </span>
              </div>

              {/* Transaction Key Attributes */}
              <div className="space-y-3.5 text-xs">
                {/* Reference */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 shrink-0">الرقم المرجعي المستقل للعملية</span>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300 shrink-0">
                      الدفعة 3 لليوم
                    </span>
                    <span
                      onClick={() => handleCopy("TXN-89240-EMR")}
                      className="font-mono font-bold text-white hover:text-[#94D3C1] cursor-pointer flex items-center gap-1"
                      dir="ltr"
                      title="انقر لنسخ المعرف"
                      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                    >
                      TXN-89240-EMR
                      {copiedTxn === "TXN-89240-EMR" ? (
                        <FiCheck size={12} className="text-[#94D3C1]" />
                      ) : (
                        <FiCopy size={12} className="text-gray-500" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">توقيت العملية الأخيرة</span>
                  <span className="text-gray-200">
                    اليوم 14 مايو - 04:30 م
                  </span>
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">وسيلة الدفع للعملية 3</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-300">فوري</span>
                    <span className="text-gray-200 font-mono" dir="ltr" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                      Visa **** 4419
                    </span>
                  </div>
                </div>

                {/* Certification */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">حالة التوثيق والقيد</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <FiCheckCircle size={13} />
                    مقيدة ومحدثة تراكمياً
                  </span>
                </div>

                {/* Cumulative Balance Result */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-400">الرصيد التراكمي بعد العملية</span>
                  <span
                    className="text-[#E9C349] font-bold text-sm font-mono"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    $32,000.00 USD
                  </span>
                </div>
              </div>

              {/* Cumulative Sub-list for Today */}
              <div className="border-t border-white/10 my-4 pt-4">
                <p className="text-[11px] font-semibold text-gray-400 mb-2.5">
                  ملخص الشحن التراكمي لليوم (14 مايو):
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>الدفعة 1 (10:15 ص - Apple Pay)</span>
                    <span className="font-mono font-medium text-white" dir="ltr" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                      +$2,000.00 USD
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span>الدفعة 2 (01:45 م - Mada بطاقة)</span>
                    <span className="font-mono font-medium text-white" dir="ltr" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                      +$3,000.00 USD
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span>الدفعة 3 (04:30 م - Visa)</span>
                    <span className="font-mono font-medium text-white" dir="ltr" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                      +$2,500.00 USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Net Total Box */}
              <div
                className="rounded-xl p-3.5 border mb-3 flex items-center justify-between"
                style={{
                  backgroundColor: T.cardInner,
                  borderColor: T.cardBorder,
                }}
              >
                <div>
                  <span className="text-xs font-bold text-gray-300 block mb-0.5">
                    صافي الإيداع التراكمي لليوم
                  </span>
                  <span
                    className="text-xs text-[#E9C349] font-mono"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    (28,125.00 SAR)
                  </span>
                </div>
                <div className="text-left">
                  <span
                    className="text-xl font-bold text-[#94D3C1] font-mono tracking-tight block"
                    dir="ltr"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    +$7,500.00 USD
                  </span>
                </div>
              </div>
            </div>

            {/* Footer of Left Card */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => showToast("جاري تنزيل ملف الإيصالات المجمعة (ZIP)...")}
                className="text-gray-400 hover:text-[#94D3C1] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FiDownload size={14} />
                <span>تحميل إيصالات اليوم مجمعة (ZIP/PDF)</span>
              </button>
              <Link
                href="/advertiser/bank-transfer"
                className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>إدارة المحفظة</span>
                <span className="text-xs">←</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            BOTTOM CARD: سجل عمليات الشحن لليوم (14 مايو 2024)
            - كل معاملة مقيدة برقم مرجعي مستقل
        ───────────────────────────────────────────── */}
        <div
          className="rounded-[16px] border p-5 sm:p-6"
          style={{
            backgroundColor: T.card,
            borderColor: T.cardBorder,
            boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* Header & Filter/Export Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                سجل عمليات الشحن لليوم (14 مايو 2024) - كل معاملة مقيدة برقم مرجعي مستقل
              </h2>
              <p className="text-xs text-[#8A9490] mt-0.5">
                سجل مفصل يوضح توقيت كل دفعة، وسيلة الدفع، والمبلغ، والرصيد التراكمي المتولد بعدها
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-300 font-medium transition-all cursor-pointer"
              >
                <FiSliders size={14} />
                <span>تصفية حركات اليوم</span>
              </button>

              {/* Export Button */}
              <button
                type="button"
                onClick={() => showToast("جاري تصدير تقرير عمليات الشحن اليومية (Excel/CSV)...")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-300 font-medium transition-all cursor-pointer"
              >
                <FiDownload size={14} />
                <span>تصدير تقرير اليوم</span>
              </button>
            </div>
          </div>

          {/* Optional Filter Drawer/Bar */}
          {isFilterOpen && (
            <div className="mb-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center gap-3 animate-fadeIn">
              <div className="flex-1 min-w-[200px] relative">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="ابحث بالرقم المرجعي أو البطاقة..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#94D3C1]"
                />
              </div>

              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#94D3C1] cursor-pointer"
              >
                <option value="all">كافة وسائل الدفع</option>
                <option value="visa">فيزا (Visa)</option>
                <option value="mada">مدى (Mada)</option>
                <option value="apple_pay">Apple Pay</option>
                <option value="sadad">سداد (SADAD)</option>
              </select>

              {(filterQuery || filterMethod !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterQuery("");
                    setFilterMethod("all");
                  }}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                >
                  إعادة تعيين
                </button>
              )}
            </div>
          )}

          {/* Table Container (Responsive Scroll) */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-medium bg-white/[0.01]">
                  <th className="py-3 px-3">الدفعة والرقم المرجعي</th>
                  <th className="py-3 px-3">التوقيت الدقيق</th>
                  <th className="py-3 px-3">طريقة الدفع والتفاصيل</th>
                  <th className="py-3 px-3">المبلغ المشحون</th>
                  <th className="py-3 px-3">الرصيد بعد الحركة</th>
                  <th className="py-3 px-3">حالة العملية</th>
                  <th className="py-3 px-3 text-center">الإيصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      tx.isLatest ? "bg-[#94D3C1]/[0.02]" : ""
                    }`}
                  >
                    {/* Reference & Batch */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: tx.dotColor }}
                        />
                        <span
                          onClick={() => handleCopy(tx.id)}
                          className="font-mono font-bold text-white hover:text-[#94D3C1] cursor-pointer"
                          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                        >
                          #{tx.id}
                        </span>
                        {tx.batch && (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              tx.isLatest
                                ? "bg-white/10 text-gray-200"
                                : "bg-white/5 text-gray-400"
                            }`}
                          >
                            {tx.batch}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Exact Time */}
                    <td className="py-3.5 px-3">
                      <span
                        className="text-gray-300 font-mono"
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        {tx.date}
                      </span>
                    </td>

                    {/* Method & Details */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        {tx.type === "apple_pay" ? (
                          <FiSmartphone size={16} className="text-gray-400 shrink-0" />
                        ) : tx.type === "sadad" ? (
                          <MdOutlineAccountBalance size={16} className="text-gray-400 shrink-0" />
                        ) : (
                          <FiCreditCard size={16} className="text-gray-400 shrink-0" />
                        )}
                        <div>
                          <div className="text-white font-medium">{tx.title}</div>
                          <div
                            className="text-[11px] text-gray-400 font-mono"
                            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                          >
                            {tx.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Charged Amount */}
                    <td className="py-3.5 px-3">
                      <div
                        className={`font-bold font-mono text-sm ${
                          tx.statusCode === "completed_old"
                            ? "text-gray-300"
                            : "text-[#94D3C1]"
                        }`}
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        {tx.amountUSD}
                      </div>
                      <div
                        className={`text-[11px] font-mono ${
                          tx.statusCode === "completed_old"
                            ? "text-gray-400"
                            : "text-[#E9C349]"
                        }`}
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        {tx.amountSAR}
                      </div>
                    </td>

                    {/* Resulting Balance */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-mono font-bold text-sm ${
                          tx.isLatest ? "text-[#E9C349]" : "text-gray-200"
                        }`}
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                      >
                        {tx.balanceUSD}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {tx.statusCode === "deposited" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {tx.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[11px] font-medium whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          {tx.status}
                        </span>
                      )}
                    </td>

                    {/* Receipt Download */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => showToast(`جاري تنزيل إيصال المعاملة ${tx.id}...`)}
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-[#94D3C1] text-gray-400 inline-flex items-center justify-center transition-colors cursor-pointer"
                        title="تحميل الإيصال"
                      >
                        <FiDownload size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────
          MODAL: إضافة دفعة شحن جديدة (New Deposit Modal)
      ───────────────────────────────────────────── */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-[99999999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg rounded-2xl border p-6 text-white relative shadow-2xl animate-scaleUp"
            style={{
              backgroundColor: T.card,
              borderColor: T.accentBorder,
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute left-4 top-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
            >
              <FiX size={18} />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#94D3C1]/10 border border-[#94D3C1]/30 flex items-center justify-center text-[#94D3C1]">
                <FiCreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">إجراء عملية شحن جديدة</h3>
                <p className="text-xs text-gray-400">إضافة رصيد فوري إلى المحفظة وتحديث الرصيد تراكمياً</p>
              </div>
            </div>

            <form onSubmit={handleAddDeposit} className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  المبلغ المراد شحنه بالدولار (USD)
                </label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="42500"
                    step="50"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    required
                    className="w-full bg-[#101213] border border-white/15 rounded-xl pr-8 pl-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#94D3C1]"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                  <span>المعادل بالريال: ≈ {(parseFloat(newAmount || 0) * 3.75).toLocaleString()} SAR</span>
                  <span>الحد المتاح اليوم: 42,500.00$ USD</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  وسيلة الدفع الفورية
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMethod("visa")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all cursor-pointer ${
                      newMethod === "visa"
                        ? "bg-[#94D3C1]/10 border-[#94D3C1] text-[#94D3C1]"
                        : "bg-[#101213] border-white/10 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <FiCreditCard size={18} />
                    <span>فيزا / ماستركارد</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMethod("mada")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all cursor-pointer ${
                      newMethod === "mada"
                        ? "bg-[#94D3C1]/10 border-[#94D3C1] text-[#94D3C1]"
                        : "bg-[#101213] border-white/10 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <FiCreditCard size={18} />
                    <span>بطاقة مدى (Mada)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMethod("apple_pay")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all cursor-pointer ${
                      newMethod === "apple_pay"
                        ? "bg-[#94D3C1]/10 border-[#94D3C1] text-[#94D3C1]"
                        : "bg-[#101213] border-white/10 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <FiSmartphone size={18} />
                    <span>Apple Pay</span>
                  </button>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 flex items-start gap-2">
                <FiShield size={16} className="text-[#94D3C1] shrink-0 mt-0.5" />
                <span>
                  سيتم قيد هذه العملية فورا برقم مرجعي TXN مستقل، وتحديث رصيد المحفظة التراكمي دون الحاجة لانتظار موافقة يدوية طالما أنها ضمن السقف اليومي.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white cursor-pointer hover:brightness-110 transition-all"
                  style={{
                    background: "linear-gradient(90deg, #FB9D00 0%, #FC5601 100%)",
                  }}
                >
                  تأكيد وإيداع فوري
                </button>
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="py-3 px-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 cursor-pointer transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

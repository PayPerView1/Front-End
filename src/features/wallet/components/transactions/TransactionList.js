"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import EmptyState from "./EmptyState";
import {
  MdOutlineReceiptLong,
  MdOutlineSearch,
  MdOutlineCalendarToday,
  MdOutlineFileDownload,
  MdOutlineChevronLeft,
  MdOutlineChevronRight,
  MdOutlineSync,
  MdRemoveRedEye,
  MdContentCopy,
  MdOutlineAccountBalance,
  MdOutlineCreditCard,
  MdOutlineSwapHoriz,
  MdOutlineAccountBalanceWallet,
  MdOutlineAddCircleOutline,
  MdOutlineRemoveCircleOutline,
  MdOutlineCheckCircle,
  MdOutlineVerifiedUser,
} from "react-icons/md";

// ─── البيانات التجريبية (مع تنويع التواريخ لتجربة النطاق الزمني) ─────────────
export const MOCK_TRANSACTIONS = [
  {
    id: "TXN-2026-08941",
    dateISO: "2026-03-29",
    time: "16:45:10 مكة",
    type: "deposit",
    typeLabel: "إيداع رصيد",
    description: "إيداع سيولة مصرفية مباشرة لحساب الإعلانات",
    ref: "REF : ALRAJHI-CORP-932104",
    paymentMethod: "مصرف الراجحي",
    paymentSub: "(حساب تجاري)",
    paymentIcon: "bank",
    amount: "+$10,000.00",
    amountSar: "+37,500.00 ر.س",
    amountUp: true,
    status: "verified",
  },
  {
    id: "TXN-2026-08940",
    dateISO: "2026-03-25",
    time: "15:22:15 مكة",
    type: "adSpend",
    typeLabel: "خصم ميزانية",
    description: "خصم مسبق لمرحلة الإطلاق - حملة رمضان 2026...",
    ref: "CMP-RAMADAN-GULF-V2",
    paymentMethod: "المحفظة الداخلية",
    paymentSub: "",
    paymentIcon: "wallet",
    amount: "-$3,200.00",
    amountSar: "-12,000.00 ر.س",
    amountUp: false,
    status: "verified",
  },
  {
    id: "TXN-2026-08939",
    dateISO: "2026-03-20",
    time: "11:10:00 مكة",
    type: "deposit",
    typeLabel: "إيداع رصيد",
    description: "تغذية المحفظة عبر بوابة الدفع الوطنية مدى",
    ref: "GATEWAY : MADA-ECOM-6811",
    paymentMethod: "بطاقة مدى",
    paymentSub: "(آبل)",
    paymentIcon: "card",
    amount: "+$5,450.00",
    amountSar: "+20,437.50 ر.س",
    amountUp: true,
    status: "verified",
  },
  {
    id: "TXN-2026-08938",
    dateISO: "2026-03-15",
    time: "09:30:45 مكة",
    type: "refund",
    typeLabel: "استرداد / فائض",
    description: "إعادة الرصيد المتبقي بعد انتهاء مدة البث",
    ref: "REFUND-AUTOCLOSE-7701",
    paymentMethod: "المحفظة الداخلية",
    paymentSub: "",
    paymentIcon: "wallet",
    amount: "+$1,450.00",
    amountSar: "+5,437.50 ر.س",
    amountUp: true,
    status: "verified",
  },
  {
    id: "TXN-2026-08937",
    dateISO: "2026-03-10",
    time: "14:15:20 مكة",
    type: "audit",
    typeLabel: "رسوم فحص",
    description: "رسوم الاعتماد الأخلاقي والشرعي لـ 4 مقاطع",
    ref: "SHARIA-AUDIT-BOARD-44",
    paymentMethod: "المحفظة الداخلية",
    paymentSub: "",
    paymentIcon: "wallet",
    amount: "-$120.00",
    amountSar: "-450.00 ر.س",
    amountUp: false,
    status: "verified",
  },
  {
    id: "TXN-2026-08936",
    dateISO: "2026-03-05",
    time: "18:00:00 مكة",
    type: "adSpend",
    typeLabel: "خصم ميزانية",
    description: "حملة النشر الذكي والتوزيع على المؤثرين",
    ref: "CMP-INFLUENCER-TIKTOK-SNAP",
    paymentMethod: "Visa Infinite",
    paymentSub: "(**9012)",
    paymentIcon: "card",
    amount: "-$5,000.00",
    amountSar: "-18,750.00 ر.س",
    amountUp: false,
    status: "verified",
  },
  {
    id: "TXN-2026-08935",
    dateISO: "2026-03-01",
    time: "12:40:10 مكة",
    type: "deposit",
    typeLabel: "إيداع رصيد",
    description: "تغذية المحفظة عبر تحويل بنكي سريع",
    ref: "REF : SNB-CORP-481902",
    paymentMethod: "البنك الأهلي",
    paymentSub: "(حساب تجاري)",
    paymentIcon: "bank",
    amount: "+$8,000.00",
    amountSar: "+30,000.00 ر.س",
    amountUp: true,
    status: "verified",
  },
  {
    id: "TXN-2026-08934",
    dateISO: "2026-02-28",
    time: "20:15:00 مكة",
    type: "adSpend",
    typeLabel: "خصم ميزانية",
    description: "حملة الترويج الموسمي - العودة للمدارس",
    ref: "CMP-BACK2SCHOOL-2026",
    paymentMethod: "المحفظة الداخلية",
    paymentSub: "",
    paymentIcon: "wallet",
    amount: "-$2,100.00",
    amountSar: "-7,875.00 ر.س",
    amountUp: false,
    status: "verified",
  },
  {
    id: "TXN-2026-08933",
    dateISO: "2026-02-20",
    time: "10:05:30 مكة",
    type: "refund",
    typeLabel: "استرداد / فائض",
    description: "فائض ميزانية حملة الاستطلاع الميداني",
    ref: "REFUND-SURVEY-3901",
    paymentMethod: "المحفظة الداخلية",
    paymentSub: "",
    paymentIcon: "wallet",
    amount: "+$650.00",
    amountSar: "+2,437.50 ر.س",
    amountUp: true,
    status: "verified",
  },
  {
    id: "TXN-2026-08932",
    dateISO: "2026-02-15",
    time: "17:50:22 مكة",
    type: "deposit",
    typeLabel: "إيداع رصيد",
    description: "إيداع بطاقة ائتمانية مباشرة",
    ref: "GATEWAY : STRIPE-CARD-9921",
    paymentMethod: "Mastercard",
    paymentSub: "(**4431)",
    paymentIcon: "card",
    amount: "+$3,000.00",
    amountSar: "+11,250.00 ر.س",
    amountUp: true,
    status: "verified",
  },
  {
    id: "TXN-2026-08931",
    dateISO: "2026-02-10",
    time: "14:00:00 مكة",
    type: "audit",
    typeLabel: "رسوم فحص",
    description: "فحص وتوثيق المحتوى الإعلاني الجديد",
    ref: "SHARIA-AUDIT-BOARD-12",
    paymentMethod: "المحفظة الداخلية",
    paymentSub: "",
    paymentIcon: "wallet",
    amount: "-$150.00",
    amountSar: "-562.50 ر.س",
    amountUp: false,
    status: "verified",
  },
  {
    id: "TXN-2026-08930",
    dateISO: "2026-02-01",
    time: "11:30:00 مكة",
    type: "adSpend",
    typeLabel: "خصم ميزانية",
    description: "حملة التسويق عبر الشبكات الاجتماعية",
    ref: "CMP-SOCIAL-BOOST-Q1",
    paymentMethod: "المحفظة الداخلية",
    paymentSub: "",
    paymentIcon: "wallet",
    amount: "-$4,500.00",
    amountSar: "-16,875.00 ر.س",
    amountUp: false,
    status: "verified",
  },
];

// ─── إعدادات الألوان والشارات ──────────────────────────────────
const TYPE_CONFIG = {
  deposit: {
    bg: "rgba(148,211,193,0.12)",
    text: "#94D3C1",
    border: "rgba(148,211,193,0.3)",
    icon: MdOutlineAddCircleOutline,
  },
  adSpend: {
    bg: "rgba(255,184,0,0.1)",
    text: "#FFB800",
    border: "rgba(255,184,0,0.25)",
    icon: MdOutlineRemoveCircleOutline,
  },
  refund: {
    bg: "rgba(42,157,143,0.12)",
    text: "#2A9D8F",
    border: "rgba(42,157,143,0.3)",
    icon: MdOutlineSync,
  },
  audit: {
    bg: "rgba(255,255,255,0.06)",
    text: "#CCCCCC",
    border: "rgba(255,255,255,0.15)",
    icon: MdOutlineCheckCircle,
  },
};

const STATUS_CONFIG = {
  verified: {
    color: "#2A9D8F",
    bg: "rgba(42,157,143,0.1)",
    border: "rgba(42,157,143,0.2)",
    defaultLabel: "مكتملة وموثقة",
  },
  pending: {
    color: "#FFB800",
    bg: "rgba(255,184,0,0.1)",
    border: "rgba(255,184,0,0.2)",
    defaultLabel: "قيد المعالجة",
  },
  failed: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
    defaultLabel: "فشلت العملية",
  },
  cancelled: {
    color: "#9A9A9A",
    bg: "rgba(154,154,154,0.1)",
    border: "rgba(154,154,154,0.2)",
    defaultLabel: "أُلغيت العملية",
  },
};

const TYPE_FILTERS = ["all", "deposit", "adSpend", "refund", "audit"];
const ITEMS_PER_PAGE = 10;

function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ─── أيقونة وسيلة الدفع ──────────────────────────────────────
function PaymentIcon({ type, dark }) {
  const cls = `flex-shrink-0 ${dark ? "text-[#888]" : "text-[#666]"}`;
  switch (type) {
    case "bank":
      return <MdOutlineAccountBalance size={14} className={cls} />;
    case "card":
      return <MdOutlineCreditCard size={14} className={cls} />;
    case "swift":
      return <MdOutlineSwapHoriz size={14} className={cls} />;
    default:
      return <MdOutlineAccountBalanceWallet size={14} className={cls} />;
  }
}

// ─── المكوّن الرئيسي ──────────────────────────────────────────
export default function TransactionList({
  transactions = MOCK_TRANSACTIONS,
  t = (key) => key,
  dark = true,
  isRtl = true,
  onViewDetail,
  onExport,
  onCharge,
  onFilterChange,
}) {
  const calendarBtnRef = useRef(null);
  const typeBtnRef = useRef(null);

  const [calendarCoords, setCalendarCoords] = useState({ top: 0, left: 0, right: 0 });
  const [typeCoords, setTypeCoords] = useState({ top: 0, left: 0, right: 0 });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedType, setSelectedType] = useState("all");

  // تواريخ الفلترة (بداية ونهاية)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [copiedId, setCopiedId] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // تحديث إحداثيات التقويم مع مراعاة حواف الشاشة للأجهزة الصغيرة
  const updateCalendarCoords = () => {
    if (calendarBtnRef.current) {
      const rect = calendarBtnRef.current.getBoundingClientRect();
      const popupWidth = 288;
      const leftCoord = Math.max(10, Math.min(rect.left, window.innerWidth - popupWidth - 10));
      const rightCoord = Math.max(10, Math.min(window.innerWidth - rect.right, window.innerWidth - popupWidth - 10));
      setCalendarCoords({
        top: rect.bottom + 6,
        left: leftCoord,
        right: rightCoord,
      });
    }
  };

  // تحديث إحداثيات قائمة نوع الحركة مع مراعاة حواف الشاشة للأجهزة الصغيرة
  const updateTypeCoords = () => {
    if (typeBtnRef.current) {
      const rect = typeBtnRef.current.getBoundingClientRect();
      const popupWidth = 224;
      const leftCoord = Math.max(10, Math.min(rect.left, window.innerWidth - popupWidth - 10));
      const rightCoord = Math.max(10, Math.min(window.innerWidth - rect.right, window.innerWidth - popupWidth - 10));
      setTypeCoords({
        top: rect.bottom + 6,
        left: leftCoord,
        right: rightCoord,
      });
    }
  };

  useEffect(() => {
    if (showCalendar) {
      updateCalendarCoords();
      window.addEventListener("resize", updateCalendarCoords);
      window.addEventListener("scroll", updateCalendarCoords, true);
    }
    return () => {
      window.removeEventListener("resize", updateCalendarCoords);
      window.removeEventListener("scroll", updateCalendarCoords, true);
    };
  }, [showCalendar]);

  useEffect(() => {
    if (showTypeDropdown) {
      updateTypeCoords();
      window.addEventListener("resize", updateTypeCoords);
      window.addEventListener("scroll", updateTypeCoords, true);
    }
    return () => {
      window.removeEventListener("resize", updateTypeCoords);
      window.removeEventListener("scroll", updateTypeCoords, true);
    };
  }, [showTypeDropdown]);

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        typeBtnRef.current &&
        !typeBtnRef.current.contains(e.target) &&
        !e.target.closest(".type-dropdown-portal")
      ) {
        setShowTypeDropdown(false);
      }
      if (
        calendarBtnRef.current &&
        !calendarBtnRef.current.contains(e.target) &&
        !e.target.closest(".calendar-portal")
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Reset pagination after a user changes the visible transaction filters.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search, selectedType, startDate, endDate]);

  // في حال عدم وجود أي بيانات معاملات، يتم إظهار الصفحة الفاضية (EmptyState)
  if (!transactions || transactions.length === 0) {
    return <EmptyState t={t} dark={dark} onCharge={onCharge} />;
  }

  const dateFormatter = new Intl.DateTimeFormat(isRtl ? "ar" : "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // النص الظاهر على زر التقويم
  const dateRangeLabel = (() => {
    if (!startDate) return t("transactions.dates.all");
    const startFormatted = dateFormatter.format(new Date(`${startDate}T00:00:00`));
    if (!endDate || startDate === endDate) {
      return startFormatted; // يوم واحد
    }
    const endFormatted = dateFormatter.format(new Date(`${endDate}T00:00:00`));
    return `${startFormatted} - ${endFormatted}`; // نطاق زمني
  })();

  const calendarDays = Array.from(
    {
      length:
        new Date(
          calendarMonth.getFullYear(),
          calendarMonth.getMonth() + 1,
          0
        ).getDate() +
        ((new Date(
          calendarMonth.getFullYear(),
          calendarMonth.getMonth(),
          1
        ).getDay() -
          (isRtl ? 6 : 0) +
          7) %
          7),
    },
    (_, index) => {
      const firstWeekday =
        (new Date(
          calendarMonth.getFullYear(),
          calendarMonth.getMonth(),
          1
        ).getDay() -
          (isRtl ? 6 : 0) +
          7) %
        7;
      if (index < firstWeekday) return null;
      return new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth(),
        index - firstWeekday + 1
      );
    }
  );

  const weekdayLabels = Array.from({ length: 7 }, (_, index) => {
    const weekStart = isRtl ? 6 : 0;
    const weekday = (weekStart + index) % 7;
    const referenceDate = new Date(2020, 10, 1 + weekday);
    return new Intl.DateTimeFormat(isRtl ? "ar" : "en", {
      weekday: "short",
    }).format(referenceDate);
  });

  // ─── منطق اختيار التاريخ (يوم واحد أو بين تاريخين) ─────────────────
  const selectCalendarDate = (date) => {
    const clickedDateStr = toLocalDateString(date);

    // 1. إذا لم نحدد أي تاريخ بعد، أو كنا قد حددنا فترة مكتملة سابقاً -> ابدأ تحديد جديد
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDateStr);
      setEndDate("");
      onFilterChange?.({ dateFrom: clickedDateStr, dateTo: "" });
    }
    // 2. إذا كنا حددنا تاريخ بداية فقط وننتظر تاريخ النهاية
    else if (startDate && !endDate) {
      if (clickedDateStr < startDate) {
        // إذا ضغط تاريخ أقدم من البداية -> نجعله هو تاريخ البداية الجديد
        setStartDate(clickedDateStr);
        setEndDate("");
        onFilterChange?.({ dateFrom: clickedDateStr, dateTo: "" });
      } else if (clickedDateStr === startDate) {
        // إذا ضغط نفس التاريخ مرتين -> يبقى يوم واحد ويغلق التقويم
        setShowCalendar(false);
      } else {
        // إذا ضغط تاريخ بعد البداية -> نحدد تاريخ النهاية ونغلق التقويم
        setEndDate(clickedDateStr);
        onFilterChange?.({ dateFrom: startDate, dateTo: clickedDateStr });
        setShowCalendar(false);
      }
    }
  };

  const changeCalendarMonth = (offset) => {
    setCalendarMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1)
    );
  };

  const handleCopy = (id, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── فلترة المعاملات بناءً على التاريخ والتطابق ─────────────────
  const filtered = (transactions || []).filter((tx) => {
    const matchSearch =
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.description.toLowerCase().includes(search.toLowerCase());

    const matchType = selectedType === "all" ? true : tx.type === selectedType;

    // منطق فلترة التاريخ
    const matchDate = (() => {
      if (!startDate) return true; // لا يوجد فلتر تاريخ
      if (startDate && !endDate) return tx.dateISO === startDate; // يوم واحد
      if (startDate && endDate) return tx.dateISO >= startDate && tx.dateISO <= endDate; // بين تاريخين
      return true;
    })();

    return matchSearch && matchType && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedTransactions = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const borderCls = dark ? "border-[#222]" : "border-[#E5E5E5]";
  const inputCls = dark
    ? "bg-[#1A1A1A] border-[#2E2E2E] text-white placeholder:text-[#777]"
    : "bg-[#F9F9F9] border-[#E5E5E5] text-[#111] placeholder:text-[#999]";
  const btnCls = dark
    ? "bg-[#1A1A1A] border-[#2E2E2E] text-[#BBB] hover:text-white"
    : "bg-[#F9F9F9] border-[#E5E5E5] text-[#555] hover:text-[#111]";
  const dropdownCls = dark
    ? "bg-[#1A1A1A] border-[#333] text-white"
    : "bg-white border-[#E5E5E5] text-[#111]";
  const rowHoverCls = dark ? "hover:bg-[#161616]" : "hover:bg-[#F9F9F9]";
  const thCls = dark
    ? "bg-[#171717] text-[#777] border-[#222]"
    : "bg-[#F8F9FA] text-[#666] border-[#E5E5E5]";

  const columnHeaders = {
    id: t("transactions.columns.id"),
    date: t("transactions.columns.date"),
    type: t("transactions.columns.type"),
    description: t("transactions.columns.description"),
    payment: t("transactions.columns.payment"),
    amount: t("transactions.columns.amount"),
    status: t("transactions.columns.status"),
    actions: t("transactions.columns.actions"),
  };

  return (
    <div
      className="w-full space-y-3"
      style={{
        direction: isRtl ? "rtl" : "ltr",
        fontFamily: "var(--font-tajawal, inherit)",
      }}
    >
      {/* ─── الكرت الرئيسي ────────────────────────────────── */}
      <div
        className={`rounded-2xl border overflow-hidden ${dark ? "bg-[#121212] border-[#222]" : "bg-white border-[#E5E5E5]"
          }`}
      >
        {/* شريط الفلاتر الهيدر */}
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 border-b ${borderCls}`}
        >
          {/* العنوان + البحث */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0">
            <h2
              className={`text-sm font-bold whitespace-nowrap flex-shrink-0 ${dark ? "text-white" : "text-[#111]"
                }`}
            >
              {t("transactions.title")}
            </h2>
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 flex-1 w-full sm:max-w-sm ${inputCls}`}
            >
              <MdOutlineSearch size={15} className="flex-shrink-0 text-[#777]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); onFilterChange?.({ search: e.target.value }); }}
                placeholder={t("transactions.searchPlaceholder")}
                className="text-xs bg-transparent outline-none w-full"
                style={{ direction: isRtl ? "rtl" : "ltr" }}
              />
            </div>
          </div>

          {/* أزرار الفلتر والتحكم */}
          <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap sm:flex-nowrap">
            {/* ── فلتر نوع الحركة (Portal) ────────────────── */}
            <div className="relative">
              <button
                ref={typeBtnRef}
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowCalendar(false);
                }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors whitespace-nowrap ${selectedType !== "all"
                  ? dark
                    ? "border-[#94D3C1] text-[#94D3C1] bg-[#94D3C1]/10"
                    : "border-[#1C6B58] text-[#1C6B58] bg-[#94D3C1]/20"
                  : btnCls
                  }`}
              >
                {t("transactions.typeFilter")}:{" "}
                {selectedType === "all"
                  ? t("transactions.types.all")
                  : t(`transactions.types.${selectedType}`)}
              </button>

              {showTypeDropdown &&
                createPortal(
                  <div
                    style={{
                      position: "fixed",
                      top: `${typeCoords.top}px`,
                      ...(isRtl
                        ? { right: `${typeCoords.right}px` }
                        : { left: `${typeCoords.left}px` }),
                    }}
                    className={`type-dropdown-portal z-[9999] w-56 rounded-xl border p-1 shadow-2xl flex flex-col gap-0.5 ${dropdownCls}`}
                  >
                    {TYPE_FILTERS.map((item) => {
                      const active = selectedType === item;
                      const labels = {
                        all: t("transactions.types.all"),
                        deposit: t("transactions.types.deposit"),
                        adSpend: t("transactions.types.adSpend"),
                        refund: t("transactions.types.refund"),
                        audit: t("transactions.types.audit"),
                      };
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            setSelectedType(item);
                            onFilterChange?.({ type: item === "all" ? "" : item });
                            setShowTypeDropdown(false);
                          }}
                          className={`text-xs px-3 py-2 rounded-lg w-full transition-colors ${isRtl ? "text-right" : "text-left"
                            } ${active
                              ? dark
                                ? "bg-[#94D3C1]/15 text-[#94D3C1] font-bold"
                                : "bg-[#94D3C1]/20 text-[#1C6B58] font-bold"
                              : dark
                                ? "hover:bg-[#252525]"
                                : "text-[#404945] hover:bg-gray-100"
                            }`}
                        >
                          {labels[item]}
                        </button>
                      );
                    })}
                  </div>,
                  document.body
                )}
            </div>

            {/* ── فلتر الفترة والتقويم (Portal + نطاق أو تاريخ محدد) ────── */}
            <div className="relative">
              <button
                ref={calendarBtnRef}
                onClick={() => {
                  setShowCalendar(!showCalendar);
                  setShowTypeDropdown(false);
                }}
                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors whitespace-nowrap ${startDate
                  ? "bg-[#FF8C00]/10 border-[#FF8C00] text-[#FF8C00]"
                  : btnCls
                  }`}
              >
                <MdOutlineCalendarToday
                  size={14}
                  className={startDate ? "text-[#FF8C00]" : ""}
                />
                {t("transactions.periodFilter")}: {dateRangeLabel}
              </button>

              {showCalendar &&
                createPortal(
                  <div
                    style={{
                      position: "fixed",
                      top: `${calendarCoords.top}px`,
                      ...(isRtl
                        ? { right: `${calendarCoords.right}px` }
                        : { left: `${calendarCoords.left}px` }),
                    }}
                    className={`calendar-portal z-[9999] w-72 rounded-2xl border p-4 shadow-2xl space-y-3.5 ${dark
                      ? "bg-[#1A1A1A] border-[#333] text-white"
                      : "bg-white border-[#E5E5E5] text-[#111]"
                      }`}
                  >
                    {/* هيدر التقويم (التحكم بالشهر) */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(-1)}
                        className={`rounded-lg border p-1.5 ${btnCls}`}
                      >
                        {isRtl ? (
                          <MdOutlineChevronRight size={16} />
                        ) : (
                          <MdOutlineChevronLeft size={16} />
                        )}
                      </button>

                      <strong className="text-sm font-semibold">
                        {new Intl.DateTimeFormat(isRtl ? "ar" : "en", {
                          month: "long",
                          year: "numeric",
                        }).format(calendarMonth)}
                      </strong>

                      <button
                        type="button"
                        onClick={() => changeCalendarMonth(1)}
                        className={`rounded-lg border p-1.5 ${btnCls}`}
                      >
                        {isRtl ? (
                          <MdOutlineChevronLeft size={16} />
                        ) : (
                          <MdOutlineChevronRight size={16} />
                        )}
                      </button>
                    </div>

                    {/* شبكة أيام الأسبوع والتواريخ */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {weekdayLabels.map((weekday, index) => (
                        <span
                          key={`${weekday}-${index}`}
                          className="py-1 text-[0.7rem] font-medium text-[#888] truncate select-none"
                        >
                          {weekday}
                        </span>
                      ))}

                      {calendarDays.map((date, index) => {
                        if (!date) return <span key={`blank-${index}`} />;
                        const day = toLocalDateString(date);

                        const isStart = day === startDate;
                        const isEnd = day === endDate;
                        const isInRange =
                          startDate &&
                          endDate &&
                          day > startDate &&
                          day < endDate;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => selectCalendarDate(date)}
                            className={`aspect-square rounded-lg text-xs transition-colors cursor-pointer ${isStart || isEnd
                              ? "bg-[#FF8C00] font-bold text-white shadow-md"
                              : isInRange
                                ? "bg-[#FF8C00]/20 text-[#FF8C00] font-semibold"
                                : dark
                                  ? "text-[#DDD] hover:bg-[#2A2A2A]"
                                  : "text-[#222] hover:bg-gray-100"
                              }`}
                          >
                            {new Intl.DateTimeFormat(isRtl ? "ar" : "en", {
                              day: "numeric",
                            }).format(date)}
                          </button>
                        );
                      })}
                    </div>

                    {/* فوتر التقويم للتحكم والمسح */}
                    <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#333] flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setStartDate("");
                          setEndDate("");
                          onFilterChange?.({ dateFrom: "", dateTo: "" });
                        }}
                        disabled={!startDate}
                        className={`font-medium transition-colors px-2 py-1 rounded-lg ${startDate
                          ? "text-red-500 hover:bg-red-500/10 cursor-pointer"
                          : "text-gray-500 cursor-not-allowed opacity-50"
                          }`}
                      >
                        {t("transactions.dates.clear")}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCalendar(false)}
                        className="font-medium px-3 py-1 rounded-lg text-white bg-[#FF8C00] hover:bg-[#e07b00] transition-colors cursor-pointer"
                      >
                        {t("transactions.dates.apply")}
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
            </div>

            {/* ── زر التصدير البرتقالي ────────────────────── */}
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 text-xs text-white px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap border-none"
              style={{
                background:
                  "linear-gradient(108.21deg,#FF9900 0%,#FF5603 100%)",
              }}
            >
              <MdOutlineFileDownload size={16} />
              {t("transactions.export")}
            </button>
          </div>
        </div>

        {/* ─── الجدول ──────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table
            className="w-full text-xs"
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            <thead>
              <tr className={`border-b text-[0.65rem] ${thCls}`}>
                {[
                  "id",
                  "date",
                  "type",
                  "description",
                  "payment",
                  "amount",
                  "status",
                  "actions",
                ].map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 font-semibold whitespace-nowrap ${isRtl ? "text-right" : "text-left"
                      }`}
                  >
                    {columnHeaders[col]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${dark ? "divide-[#1A1A1A]" : "divide-[#E5E5E5]"
                }`}
            >
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className={`px-4 py-10 text-center ${dark ? "text-[#777]" : "text-[#666]"
                      }`}
                  >
                    {t("transactions.noResults")}
                  </td>
                </tr>
              )}
              {paginatedTransactions.map((tx) => {
                const typeCfg =
                  TYPE_CONFIG[tx.type] || TYPE_CONFIG.deposit;
                const statusCfg =
                  STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending;
                const TypeIcon = typeCfg.icon;

                return (
                  <tr
                    key={tx.id}
                    className={`transition-colors cursor-pointer ${rowHoverCls}`}
                    onClick={() => onViewDetail?.(tx)}
                  >
                    {/* رقم المعاملة */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div
                        className={`flex flex-row-reverse items-center gap-1.5 px-2 py-1 rounded-md w-fit border ${dark
                          ? "bg-[#171717] border-[#262626]"
                          : "bg-[#F3F4F6] border-[#E5E5E5]"
                          }`}
                      >
                        <span className="font-mono text-[0.65rem] text-[#2A9D8F] font-bold">
                          {copiedId === tx.id ? t("transactions.copied") : tx.id}
                        </span>
                        <MdContentCopy
                          size={11}
                          className={`cursor-pointer transition-colors ${dark
                            ? "text-[#666] hover:text-white"
                            : "text-[#999] hover:text-[#111]"
                            }`}
                          onClick={(e) => handleCopy(tx.id, e)}
                        />
                      </div>
                    </td>

                    {/* التاريخ والوقت */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div
                        className={`font-medium text-xs ${dark ? "text-white" : "text-[#111]"
                          }`}
                      >
                        {dateFormatter.format(
                          new Date(`${tx.dateISO}T00:00:00`)
                        )}
                      </div>
                      <div className="text-[0.6rem] text-[#666] mt-0.5">
                        {tx.time}
                      </div>
                    </td>

                    {/* نوع الحركة */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1 text-[0.65rem] px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: typeCfg.bg,
                          color: !dark && tx.type === "deposit" ? "#1C6B58" : typeCfg.text,
                          border: `1px solid ${typeCfg.border}`,
                        }}
                      >
                        <TypeIcon size={11} />
                        {t(`transactions.types.${tx.type}`)}
                      </span>
                    </td>

                    {/* الوصف */}
                    <td className="px-4 py-3.5 max-w-[240px]">
                      <div
                        className={`font-medium leading-snug truncate text-xs ${dark ? "text-white" : "text-[#111]"
                          }`}
                      >
                        {tx.description}
                      </div>
                      <div className="text-[0.6rem] font-mono text-[#555] mt-0.5 truncate">
                        {tx.ref}
                      </div>
                    </td>

                    {/* وسيلة الدفع */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <PaymentIcon type={tx.paymentIcon} dark={dark} />
                        <div>
                          <div
                            className={`text-[0.7rem] ${dark ? "text-white" : "text-[#111]"
                              }`}
                          >
                            {tx.paymentMethod}
                          </div>
                          {tx.paymentSub && (
                            <div className="text-[0.6rem] text-[#666]">
                              {tx.paymentSub}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* المبلغ */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono">
                      <div className={`font-bold text-sm ${dark ? "text-[#FFB800]" : "text-[#8A6100]"}`}>
                        {tx.amount}
                      </div>
                      <div className="text-[0.6rem] text-[#666] mt-0.5">
                        {tx.amountSar}
                      </div>
                    </td>

                    {/* الحالة */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6rem] font-medium"
                        style={{
                          background: statusCfg.bg,
                          color: statusCfg.color,
                          border: `1px solid ${statusCfg.border}`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: statusCfg.color }}
                        />
                        {t(`transactions.status.${tx.status}`)}
                      </span>
                    </td>

                    {/* الإجراءات */}
                    <td
                      className="px-4 py-3.5 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5 justify-center">
                        <button
                          onClick={() => onViewDetail?.(tx)}
                          title={t("transactions.viewDetails")}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${dark
                            ? "bg-[#1A1A1A] border-[#2A2A2A] text-[#888] hover:text-white"
                            : "bg-[#F3F4F6] border-[#E5E5E5] text-[#666] hover:text-[#111]"
                            }`}
                        >
                          <MdRemoveRedEye size={13} />
                        </button>
                        <button
                          title={t("transactions.printInvoice")}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${dark
                            ? "bg-[#1A1A1A] border-[#2A2A2A] text-[#888] hover:text-white"
                            : "bg-[#F3F4F6] border-[#E5E5E5] text-[#666] hover:text-[#111]"
                            }`}
                        >
                          <MdOutlineReceiptLong size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ──────────────────────────────────── */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t text-xs ${dark
            ? "border-[#222] text-[#777]"
            : "border-[#E5E5E5] text-[#666]"
            }`}
        >
          <div>
            {t("transactions.showing", { count: paginatedTransactions.length, total: filtered.length })}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 disabled:opacity-40 cursor-pointer transition-colors ${dark
                ? "bg-[#1A1A1A] border-[#2A2A2A] text-[#AAA] hover:text-white"
                : "bg-[#F9F9F9] border-[#E5E5E5] text-[#666] hover:text-[#111]"
                }`}
            >
              {isRtl ? (
                <MdOutlineChevronRight size={14} />
              ) : (
                <MdOutlineChevronLeft size={14} />
              )}
              {t("transactions.previous")}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${currentPage === p
                  ? "bg-[#FF8C00] border-[#FF8C00] text-white"
                  : dark
                    ? "bg-[#1A1A1A] border-[#2A2A2A] text-[#AAA] hover:text-white"
                    : "bg-[#F9F9F9] border-[#E5E5E5] text-[#666] hover:text-[#111]"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 disabled:opacity-40 cursor-pointer transition-colors ${dark
                ? "bg-[#1A1A1A] border-[#2A2A2A] text-[#AAA] hover:text-white"
                : "bg-[#F9F9F9] border-[#E5E5E5] text-[#666] hover:text-[#111]"
                }`}
            >
              {t("transactions.next")}
              {isRtl ? (
                <MdOutlineChevronLeft size={14} />
              ) : (
                <MdOutlineChevronRight size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── شريط التدقيق الشرعي ─────────────────────────── */}
      <div
        className={`border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-[0.65rem] ${dark
          ? "bg-[#121212] border-[#1E2E2B]"
          : "bg-[#F4FBF9] border-[#D1EBE5]"
          }`}
      >
        <div className="flex items-center gap-2 text-[#2A9D8F]">
          <MdOutlineVerifiedUser size={15} className="flex-shrink-0" />
          <span>
            <strong
              className={`font-semibold ${dark ? "text-white" : "text-[#111]"
                }`}
            >
              {t("transactions.auditTitle")}
            </strong>{" "}
            {t("transactions.auditDescription")}
          </span>
        </div>
        <div className="font-mono text-[#555] text-[0.6rem]">
          {t("transactions.auditHash")}
        </div>
      </div>
    </div>
  );
}

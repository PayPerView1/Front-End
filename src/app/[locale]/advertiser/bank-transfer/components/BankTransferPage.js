"use client";

import { useState } from "react";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiShield,
  FiFileText,
  FiExternalLink,
  FiGlobe,
  FiClock,
  FiHeadphones,
  FiInfo,
} from "react-icons/fi";
import {
  MdOutlineAccountBalance,
  MdOutlineReceipt,
  MdOutlineHistory,
  MdOutlineLock,
  MdOutlineCheckCircle,
  MdOutlineSearch,
  MdOutlineGavel,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsCheckCircleFill, BsClipboardCheck } from "react-icons/bs";

/* ─────────────────────────────────────────────
   Design Tokens - Matching MacBook Pro 16_ - 130.png
───────────────────────────────────────────── */
const T = {
  bg: "#0B0D0E",
  card: "#151819",
  cardInner: "#101213",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  accentBorder: "rgba(148, 211, 193, 0.25)",
  accentBorder50: "rgba(148, 211, 193, 0.50)",
  accentBorder30: "rgba(148, 211, 193, 0.30)",
  text: "#FFFFFF",
  sub: "#C5CECA",
  muted: "#8A9490",
  accent: "#94D3C1",
  warning: "#E9C349",
  headerBorder: "rgba(255, 255, 255, 0.06)",
  stepBgActive: "rgba(148, 211, 193, 0.08)",
  stepBgDefault: "rgba(255, 255, 255, 0.02)",
  gradFrom: "#FB9D00",
  gradTo: "#FC5601",
  mono: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
  taj: "var(--font-tajawal), 'Tajawal', system-ui, sans-serif",
};

/* ─────────────────────────────────────────────
   Helper: Copy Button
───────────────────────────────────────────── */
function CopyButton({ text, label = "نسخ الأيبان" }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        height: "36px",
        padding: "0 16px",
        borderRadius: "8px",
        border: `1px solid ${T.accentBorder30}`,
        background: "rgba(148, 211, 193, 0.08)",
        color: T.accent,
        fontFamily: T.taj,
        fontWeight: 600,
        fontSize: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(148, 211, 193, 0.16)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(148, 211, 193, 0.08)")}
    >
      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      {copied ? "تم النسخ" : label}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Helper: Ghost Button (معاينة / استبدال)
───────────────────────────────────────────── */
function GhostBtn({ icon, label }) {
  return (
    <button
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        height: "32px",
        padding: "0 14px",
        borderRadius: "8px",
        border: `1px solid ${T.cardBorder}`,
        background: "rgba(255, 255, 255, 0.03)",
        color: T.sub,
        fontFamily: T.taj,
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.accentBorder50;
        e.currentTarget.style.color = T.accent;
        e.currentTarget.style.background = "rgba(148, 211, 193, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.cardBorder;
        e.currentTarget.style.color = T.sub;
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 1 — PAGE HEADER
═══════════════════════════════════════════════ */
function PageHeader() {
  return (
    <div
      style={{
        width: "100%",
        padding: "20px 0 24px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Title + Verification Badges */}
        <div>
          {/* Top pill badge with two verification tags */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "16px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${T.cardBorder}`,
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: T.taj,
                fontWeight: 500,
                fontSize: "11px",
                color: T.accent,
              }}
            >
              <BsCheckCircleFill size={12} color={T.accent} />
              حساب مصرفي تجاري معتمد
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.15)", fontSize: "12px" }}>|</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: T.taj,
                fontWeight: 400,
                fontSize: "11px",
                color: T.sub,
              }}
            >
              <MdOutlineCheckCircle size={13} color={T.sub} />
              متوافق مع هيئة الزكاة والضريبة والجمارك (ZATCA)
            </span>
          </div>

          <h1
            style={{
              fontFamily: T.taj,
              fontWeight: 700,
              fontSize: "30px",
              lineHeight: "1.2",
              letterSpacing: "-0.5px",
              color: T.text,
              margin: 0,
            }}
          >
            تأكيد وإيداع التحويل المصرفي
          </h1>
        </div>

        {/* Status Pill Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "20px",
            background: "rgba(148, 211, 193, 0.08)",
            border: `1px solid ${T.accentBorder}`,
            fontFamily: T.taj,
            fontWeight: 500,
            fontSize: "12px",
            color: T.accent,
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: T.accent,
              boxShadow: "0 0 8px #94D3C1",
              animation: "pulse-dot 2s infinite ease-in-out",
            }}
          />
          طلب قيد المعالجة
          <span style={{ fontFamily: T.mono, fontWeight: 600, fontSize: "11px", marginLeft: "4px" }}>
            #REQ-BNK-77192
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 2 — STATUS & PROGRESS BANNER CARD
═══════════════════════════════════════════════ */
const STAGES = [
  {
    num: 1,
    label: "المرحلة الأولى",
    title: "رفع إيصال الحوالة",
    detail: "14 مايو 2024 - 04:30 م",
    status: "done",
    icon: <MdOutlineCheckCircle size={20} />,
  },
  {
    num: 2,
    label: "المرحلة الحالية",
    title: "التدقيق والمطابقة البنكية",
    detail: "جاري التحقق من كشف الحساب",
    status: "active",
    icon: <MdOutlineSearch size={22} />,
  },
  {
    num: 3,
    label: "المرحلة الثالثة",
    title: "الاعتماد المالي اليدوي",
    detail: "متوقع خلال 24 ساعة",
    status: "pending",
    icon: <MdOutlineGavel size={20} />,
  },
  {
    num: 4,
    label: "المرحلة الرابعة",
    title: "إيداع المحفظة والفاتورة",
    detail: "تحديث فوري للرصيد",
    status: "upcoming",
    icon: <MdOutlineAccountBalanceWallet size={20} />,
  },
];

function StatusBannerCard() {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "16px",
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
        marginBottom: "24px",
        overflow: "hidden",
      }}
    >
      {/* Top Main Status Section */}
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* Right: Hourglass icon + Content */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flex: 1, minWidth: "300px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(148, 211, 193, 0.08)",
                border: `1px solid ${T.accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BsClipboardCheck size={24} color={T.accent} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
                <h2
                  style={{
                    fontFamily: T.taj,
                    fontWeight: 700,
                    fontSize: "19px",
                    color: T.text,
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  حالة الطلب: قيد المراجعة والتدقيق المالي (Under Review)
                </h2>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "rgba(233, 195, 73, 0.12)",
                    border: "1px solid rgba(233, 195, 73, 0.25)",
                    fontFamily: T.mono,
                    fontWeight: 600,
                    fontSize: "11px",
                    color: T.warning,
                    whiteSpace: "nowrap",
                  }}
                >
                  ساعة 24-48 SLA
                </span>
              </div>
              <p
                style={{
                  fontFamily: T.taj,
                  fontWeight: 400,
                  fontSize: "14px",
                  color: T.sub,
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: "780px",
                }}
              >
                تم إستلام بيانات الحوالة وإيصال السداد بنجاح. يجري الآن تدقيق المطابقة المحاسبية بالتعاون مع بنك الراجحي لإيداع الاعتماد داخل محفظتك فوراً.
              </p>
            </div>
          </div>

          {/* Left: Action Buttons */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "38px",
                padding: "0 16px",
                borderRadius: "8px",
                border: `1px solid ${T.cardBorder}`,
                background: "rgba(255, 255, 255, 0.03)",
                color: T.text,
                fontFamily: T.taj,
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.accentBorder50;
                e.currentTarget.style.color = T.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.cardBorder;
                e.currentTarget.style.color = T.text;
              }}
            >
              <FiRefreshCw size={14} />
              تحديث الحالة
            </button>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "38px",
                padding: "0 16px",
                borderRadius: "8px",
                border: `1px solid ${T.accentBorder30}`,
                background: "rgba(148, 211, 193, 0.06)",
                color: T.accent,
                fontFamily: T.taj,
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(148, 211, 193, 0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(148, 211, 193, 0.06)")}
            >
              <FiExternalLink size={14} />
              مسار التدقيق
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps (4 cards at bottom of status banner) */}
      <div
        style={{
          borderTop: `1px solid ${T.headerBorder}`,
          padding: "16px 24px",
          background: "rgba(0, 0, 0, 0.20)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {STAGES.map((s) => {
            const isActive = s.status === "active";
            const isDone = s.status === "done";
            const isFaded = s.status === "pending" || s.status === "upcoming";

            return (
              <div
                key={s.num}
                style={{
                  background: isActive ? T.stepBgActive : T.stepBgDefault,
                  border: isActive
                    ? `1px solid ${T.accentBorder50}`
                    : `1px solid ${T.cardBorder}`,
                  borderRadius: "10px",
                  padding: "12px 14px",
                  opacity: isFaded ? 0.75 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Step Icon */}
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: isDone
                      ? "rgba(148, 211, 193, 0.15)"
                      : isActive
                      ? "rgba(148, 211, 193, 0.12)"
                      : "rgba(255, 255, 255, 0.04)",
                    border: isDone
                      ? `2px solid ${T.accent}`
                      : isActive
                      ? `2px solid ${T.accent}`
                      : `1px solid ${T.cardBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: isDone || isActive ? T.accent : T.muted,
                    boxShadow: isActive ? "0 0 10px rgba(148, 211, 193, 0.25)" : "none",
                  }}
                >
                  {s.icon}
                </div>

                {/* Step Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: T.taj,
                      fontWeight: 400,
                      fontSize: "10px",
                      color: T.muted,
                      margin: "0 0 2px 0",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontFamily: T.taj,
                      fontWeight: isActive ? 700 : 600,
                      fontSize: isActive ? "13px" : "12px",
                      color: isActive ? T.text : isDone ? T.sub : T.sub,
                      margin: "0 0 2px 0",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.title}
                  </p>
                  <p
                    style={{
                      fontFamily: T.taj,
                      fontWeight: 400,
                      fontSize: "11px",
                      color: isActive ? T.accent : T.muted,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3 — OFFICIAL BANK DETAILS
═══════════════════════════════════════════════ */
function BankAccountDetails() {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: "14px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <MdOutlineAccountBalance size={22} color={T.accent} />
            <h2
              style={{
                fontFamily: T.taj,
                fontWeight: 700,
                fontSize: "18px",
                color: T.text,
                margin: 0,
              }}
            >
              تفاصيل الحساب المصرفي المعتمد للإيداع
            </h2>
          </div>
          <p
            style={{
              fontFamily: T.taj,
              fontWeight: 400,
              fontSize: "13px",
              color: T.sub,
              margin: 0,
              paddingRight: "32px",
            }}
          >
            يُرجى التحويل الحصري إلى الحساب الرسمي أدناه لضمان سلامة الضمان المالي
          </p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: "rgba(148, 211, 193, 0.08)",
            border: `1px solid ${T.accentBorder}`,
            fontFamily: T.taj,
            fontWeight: 500,
            fontSize: "11px",
            color: T.accent,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.accent }} />
          حساب تجاري نشط
        </span>
      </div>

      {/* Fields Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {/* Beneficiary Name */}
        <div style={{ background: T.cardInner, borderRadius: "10px", padding: "14px 16px", border: `1px solid ${T.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <MdOutlineAccountBalance size={14} color={T.muted} />
            <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "11px", color: T.muted }}>اسم المستفيد المعتمد</span>
          </div>
          <p style={{ fontFamily: T.taj, fontWeight: 600, fontSize: "13px", color: T.text, margin: 0, lineHeight: 1.5 }}>
            شركة Pay Per View للإعلانات المحدودة .Pay Per View Advertising Co. Ltd
          </p>
        </div>

        {/* Bank & SWIFT */}
        <div style={{ background: T.cardInner, borderRadius: "10px", padding: "14px 16px", border: `1px solid ${T.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <MdOutlineAccountBalance size={14} color={T.muted} />
            <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "11px", color: T.muted }}>المصرف الشريك ورمز السويفت</span>
          </div>
          <p style={{ fontFamily: T.taj, fontWeight: 600, fontSize: "14px", color: T.text, margin: 0, lineHeight: 1.5 }}>
            مصرف الراجحي (Al Rajhi Bank)
          </p>
        </div>

        {/* IBAN - Full Width */}
        <div
          style={{
            gridColumn: "1 / -1",
            background: T.cardInner,
            borderRadius: "10px",
            padding: "16px 18px",
            border: `1px solid ${T.cardBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <FiShield size={14} color={T.muted} />
              <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "11px", color: T.muted }}>رقم الأيبان الدولي (IBAN)</span>
            </div>
            <p
              style={{
                fontFamily: T.mono,
                fontWeight: 700,
                fontSize: "17px",
                color: T.text,
                margin: 0,
                letterSpacing: "1px",
              }}
            >
              SA44 8000 0123 4567 8901 2345
            </p>
          </div>
          <CopyButton text="SA4480000123456789012345" />
        </div>

        {/* Accepted Currencies */}
        <div
          style={{
            background: T.cardInner,
            borderRadius: "10px",
            padding: "14px 16px",
            border: `1px solid ${T.cardBorder}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(148, 211, 193, 0.08)",
              border: `1px solid ${T.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FiGlobe size={18} color={T.accent} />
          </div>
          <div>
            <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "11px", color: T.muted, display: "block", marginBottom: "3px" }}>العملات المقبولة</span>
            <p style={{ fontFamily: T.taj, fontWeight: 700, fontSize: "14px", color: T.text, margin: 0 }}>
              ريال سعودي (SAR) / دولار أمريكي (USD)
            </p>
          </div>
        </div>

        {/* Internal Account Number */}
        <div style={{ background: T.cardInner, borderRadius: "10px", padding: "14px 16px", border: `1px solid ${T.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "11px", color: T.muted, display: "block", marginBottom: "4px" }}>رقم الحساب الداخلي</span>
              <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: "16px", color: T.text, letterSpacing: "1px" }}>
                1234567890
              </span>
            </div>
            <button
              type="button"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: `1px solid ${T.cardBorder}`,
                background: "transparent",
                color: T.muted,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText("1234567890").catch(() => {});
                }
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.accent; e.currentTarget.style.borderColor = T.accentBorder30; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.cardBorder; }}
            >
              <FiCopy size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 4 — UPLOADED RECEIPT & TRANSACTION DATA
═══════════════════════════════════════════════ */
const TX_METADATA = [
  { label: "رقم الحوالة البنكية (Ref)", value: "TR-98234190", isWarning: true },
  { label: "بنك المُرسِل (المُحوِّل)", value: "بنك الرياض (Riyad Bank)", isBold: true },
  { label: "تاريخ ووقت التحويل", value: "14 مايو 2024 - 04:15 م" },
  { label: "المبلغ المحول الفعلي", value: "$10,000.00 USD", subValue: "(37,500.00 ر.س)", isLarge: true },
];

function ReceiptSection() {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: "14px",
        padding: "24px",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <MdOutlineReceipt size={22} color={T.accent} />
            <h2 style={{ fontFamily: T.taj, fontWeight: 700, fontSize: "18px", color: T.text, margin: 0 }}>
              إيصال التحويل المرفوع وبيانات المعاملة
            </h2>
          </div>
          <p style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "13px", color: T.sub, margin: 0, paddingRight: "32px" }}>
            البيانات المسجلة بواسطة المُعلن للتحقق من قيد الحساب
          </p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: "rgba(148, 211, 193, 0.08)",
            border: `1px solid ${T.accentBorder}`,
            fontFamily: T.taj,
            fontWeight: 500,
            fontSize: "11px",
            color: T.accent,
            whiteSpace: "nowrap",
          }}
        >
          <FiCheck size={13} color={T.accent} />
          تم التحميل بنجاح
        </span>
      </div>

      {/* PDF File Box */}
      <div
        style={{
          background: T.cardInner,
          border: `1px solid ${T.cardBorder}`,
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            background: "rgba(148, 211, 193, 0.08)",
            border: `1px solid ${T.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FiFileText size={22} color={T.accent} />
        </div>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <p style={{ fontFamily: T.mono, fontWeight: 600, fontSize: "14px", color: T.text, margin: "0 0 4px 0" }}>
            receipt_bank_transfer_may2024.pdf
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: T.taj, fontSize: "11px", color: T.sub }}>1.8 MB</span>
            <span style={{ color: T.muted, fontSize: "11px" }}>•</span>
            <span style={{ fontFamily: T.taj, fontSize: "11px", color: T.sub }}>14 مايو 2024، 04:28 م</span>
            <span style={{ color: T.muted, fontSize: "11px" }}>•</span>
            <span style={{ fontFamily: T.mono, fontWeight: 500, fontSize: "11px", color: T.accent }}>
              SHA256: 8a9f ... c21d
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <GhostBtn icon={<FiEye size={14} />} label="معاينة" />
          <GhostBtn icon={<FiRefreshCw size={14} />} label="استبدال" />
        </div>
      </div>

      {/* Transaction Metadata Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "16px" }}>
        {TX_METADATA.map((row) => (
          <div
            key={row.label}
            style={{
              background: T.cardInner,
              border: `1px solid ${T.cardBorder}`,
              borderRadius: "10px",
              padding: "14px 16px",
            }}
          >
            <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "11px", color: T.muted, display: "block", marginBottom: "8px" }}>
              {row.label}
            </span>
            <span
              style={{
                fontFamily: row.isWarning ? T.mono : T.taj,
                fontWeight: row.isBold || row.isWarning ? 700 : 600,
                fontSize: row.isLarge ? "16px" : row.isWarning ? "15px" : "14px",
                color: row.isWarning ? T.warning : T.text,
                display: "block",
              }}
            >
              {row.value}
            </span>
            {row.subValue && (
              <span style={{ fontFamily: T.taj, fontSize: "11px", color: T.sub, marginTop: "4px", display: "block" }}>
                {row.subValue}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Security Footer Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "8px",
          background: "rgba(148, 211, 193, 0.04)",
          border: `1px solid ${T.accentBorder}`,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FiShield size={16} color={T.accent} style={{ flexShrink: 0 }} />
          <p style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "12px", color: T.sub, margin: 0 }}>
            الإيصال موقع إلكترونياً ومحفوظ في الخزينة السحابية المشفرة (AES-256 Escrow Vault)
          </p>
        </div>
        <span style={{ fontFamily: T.mono, fontWeight: 600, fontSize: "11px", color: T.accent }}>
          DOC-ID: #8942-TX-SA
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 5 — AUDIT & OPERATIONS LOG
═══════════════════════════════════════════════ */
const LOG_EVENTS = [
  {
    id: 1,
    title: "إنشاء طلب الإيداع البنكي المباشر #REQ-BNK-77192",
    time: "14 مايو 2024 - 04:25 م",
    note: "تم اختيار المسار المالي البنكي المعتمد لحملات \"US-BUDGET-01\".",
    done: true,
  },
  {
    id: 2,
    title: "تم فحص تطابق الوثيقة عبر الخوارزمية الذكية (OCR Match)",
    time: "14 مايو 2024 - 04:29 م",
    note: "تطابق اسم الحساب ورقم الحوالة بنسبة 99.4% مع مدخلات النموذج المصرفي.",
    done: true,
  },
  {
    id: 3,
    title: "إحالة المعاملة إلى مكتب التدقيق المالي بالرياض",
    time: "",
    note: "في انتظار ورود كشف التسوية البنكية من البنك الأهلي / الراجحي للمطابقة النهائية.",
    badge: "قيد المعالجة الآن",
    badgeColor: T.warning,
    done: false,
    active: true,
  },
];

function AuditLog() {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: "14px",
        padding: "24px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <MdOutlineHistory size={22} color={T.accent} />
          <h2 style={{ fontFamily: T.taj, fontWeight: 700, fontSize: "18px", color: T.text, margin: 0 }}>
            سجل العمليات والتدقيق الآلي
          </h2>
        </div>
        <span
          style={{
            fontFamily: T.taj,
            fontWeight: 500,
            fontSize: "12px",
            color: T.accent,
            cursor: "pointer",
          }}
        >
          معايير الامتثال المالي الشرعي
        </span>
      </div>

      {/* Timeline List */}
      <div>
        {LOG_EVENTS.map((evt, idx) => (
          <div key={evt.id} style={{ display: "flex", gap: "16px" }}>
            {/* Dot + Connecting Line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: "16px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: evt.done ? T.accent : evt.active ? T.accent : T.muted,
                  border: `2px solid ${evt.done ? T.accent : evt.active ? T.accent : T.muted}`,
                  flexShrink: 0,
                  marginTop: "6px",
                  boxShadow: evt.done || evt.active ? "0 0 10px rgba(148, 211, 193, 0.40)" : "none",
                }}
              />
              {idx < LOG_EVENTS.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    flex: 1,
                    minHeight: "36px",
                    background: `linear-gradient(to bottom, ${evt.done ? T.accent : T.cardBorder}, ${T.cardBorder})`,
                    margin: "4px 0",
                  }}
                />
              )}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, paddingBottom: idx < LOG_EVENTS.length - 1 ? "20px" : "0" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "4px" }}>
                <p style={{ fontFamily: T.taj, fontWeight: 600, fontSize: "14px", color: T.text, margin: 0, lineHeight: 1.4 }}>
                  {evt.title}
                </p>
                {evt.time && (
                  <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "11px", color: T.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {evt.time}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "13px", color: T.sub, margin: "0 0 6px 0", lineHeight: 1.5 }}>
                {evt.note}
              </p>
              {evt.badge && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "rgba(233, 195, 73, 0.10)",
                    border: "1px solid rgba(233, 195, 73, 0.25)",
                    fontFamily: T.taj,
                    fontWeight: 500,
                    fontSize: "11px",
                    color: T.warning,
                  }}
                >
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.warning }} />
                  {evt.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 6 — DEPOSIT SUMMARY (SIDEBAR CARD 1)
═══════════════════════════════════════════════ */
function SummaryCard() {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: "14px",
        padding: "22px",
        marginBottom: "16px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ fontFamily: T.taj, fontWeight: 700, fontSize: "16px", color: T.text, margin: 0 }}>
          ملخص الإيداع البنكي
        </h3>
        <span
          style={{
            fontFamily: T.mono,
            fontWeight: 600,
            fontSize: "11px",
            color: T.warning,
            padding: "3px 8px",
            borderRadius: "4px",
            background: "rgba(233, 195, 73, 0.10)",
            border: "1px solid rgba(233, 195, 73, 0.20)",
          }}
        >
          REQ-BNK-77192
        </span>
      </div>

      {/* Subhead + USD tag */}
      <div style={{ marginBottom: "8px" }}>
        <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "12px", color: T.muted }}>
          المبلغ الإجمالي المودع
        </span>
      </div>

      {/* Huge Amount Display */}
      <div
        style={{
          background: T.cardInner,
          borderRadius: "10px",
          padding: "16px",
          textAlign: "center",
          border: `1px solid ${T.cardBorder}`,
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              background: "rgba(148, 211, 193, 0.12)",
              fontFamily: T.mono,
              fontWeight: 700,
              fontSize: "11px",
              color: T.accent,
            }}
          >
            USD
          </span>
          <span style={{ fontFamily: T.taj, fontWeight: 700, fontSize: "32px", color: T.text, lineHeight: 1.1 }}>
            $10,000.00
          </span>
        </div>
        <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "12px", color: T.sub }}>
          المعادل بالعملة المحلية: 37,500.00 ر.س
        </span>
      </div>

      {/* Breakdown Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "12px", color: T.muted }}>
            رسوم التحويل البنكي للمنصة:
          </span>
          <span style={{ fontFamily: T.taj, fontWeight: 600, fontSize: "12px", color: T.accent }}>
            $0.00 (مجاناً 100%)
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "12px", color: T.muted }}>
            ضريبة القيمة المضافة (15% VAT):
          </span>
          <span style={{ fontFamily: T.taj, fontWeight: 500, fontSize: "12px", color: T.sub }}>
            مشمولة ضمن الفاتورة
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "12px", color: T.muted }}>
            الرصيد المتاح الحالي:
          </span>
          <span style={{ fontFamily: T.mono, fontWeight: 600, fontSize: "13px", color: T.text }}>
            $14,250.00
          </span>
        </div>
      </div>

      {/* Expected Balance Highlight Box */}
      <div
        style={{
          background: "rgba(148, 211, 193, 0.06)",
          border: `1px solid ${T.accentBorder}`,
          borderRadius: "10px",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontFamily: T.taj, fontWeight: 500, fontSize: "12px", color: T.text }}>
          الرصيد المتوقع بعد الاعتماد:
        </span>
        <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: "17px", color: T.accent }}>
          $24,250.00
        </span>
      </div>

      {/* Primary PDF Download Button */}
      <button
        type="button"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          height: "46px",
          borderRadius: "10px",
          border: "none",
          background: `linear-gradient(135deg, ${T.gradFrom} 0%, ${T.gradTo} 100%)`,
          color: "#FFFFFF",
          fontFamily: T.taj,
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(252, 86, 1, 0.35)",
          transition: "all 0.2s ease",
          marginBottom: "10px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.92";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <FiDownload size={16} />
        تحميل إشعار استلام الطلب (PDF)
      </button>

      {/* Track Order Button */}
      <button
        type="button"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          height: "42px",
          borderRadius: "10px",
          border: `1px solid ${T.cardBorder}`,
          background: "rgba(255, 255, 255, 0.03)",
          color: T.sub,
          fontFamily: T.taj,
          fontWeight: 500,
          fontSize: "13px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginBottom: "14px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = T.accentBorder30;
          e.currentTarget.style.color = T.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = T.cardBorder;
          e.currentTarget.style.color = T.sub;
        }}
      >
        <FiReceipt size={14} />
        تتبع حالة الطلب في سجل المعاملات
      </button>

      {/* Return to Wallet Link */}
      <a
        href="#"
        style={{
          display: "block",
          textAlign: "center",
          fontFamily: T.taj,
          fontSize: "12px",
          fontWeight: 500,
          color: T.muted,
          textDecoration: "none",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = T.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
      >
        العودة إلى لوحة تحكم المحفظة والمالية
      </a>
    </div>
  );
}

function FiReceipt({ size }) {
  return <MdOutlineReceipt size={size} />;
}

/* ═══════════════════════════════════════════════
   SECTION 7 — GUIDELINES (SIDEBAR CARD 2)
═══════════════════════════════════════════════ */
const GUIDELINES = [
  "تأكد من كتابة رقم الطلب (REQ-BNK-77192) في خانة الغرض من التحويل لدى بنكك لتسريع عملية المطابقة.",
  "لا يتغير رصيد المحفظة الإعلانية فوراً، بل فور مصادقة الإيداع من قبل المشرف المالي.",
  "سيتم إرسال إشعار SMS ورسالة بريد إلكتروني فورية مرفق بها الفاتورة الضريبية الرسمية.",
  "جميع العمليات تخضع للرقابة المالية المباشرة والضوابط الشرعية للأمانات والضمان.",
];

function GuidelinesCard() {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: "14px",
        padding: "20px",
        marginBottom: "16px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <HiOutlineLightBulb size={18} color={T.warning} />
        <h3 style={{ fontFamily: T.taj, fontWeight: 700, fontSize: "15px", color: T.text, margin: 0 }}>
          إرشادات وضوابط التحويل البنكي
        </h3>
      </div>

      {/* Bullet Points */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        {GUIDELINES.map((txt, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "rgba(148, 211, 193, 0.12)",
                border: `1px solid ${T.accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              {i === 3 ? (
                <FiInfo size={9} color={T.accent} />
              ) : (
                <FiCheck size={10} color={T.accent} />
              )}
            </div>
            <p
              style={{
                fontFamily: T.taj,
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "1.6",
                color: T.sub,
                margin: 0,
              }}
            >
              {txt}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Support Link */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "12px",
          borderTop: `1px solid ${T.cardBorder}`,
        }}
      >
        <span style={{ fontFamily: T.taj, fontWeight: 400, fontSize: "11px", color: T.muted }}>
          هل تواجه استفساراً؟
        </span>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            color: T.accent,
            textDecoration: "none",
            fontFamily: T.taj,
            fontWeight: 600,
            fontSize: "12px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          <FiHeadphones size={13} />
          التواصل مع الدعم المالي
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 8 — ESCROW SECURITY (SIDEBAR CARD 3)
═══════════════════════════════════════════════ */
function EscrowCard() {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: "14px",
        padding: "18px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "rgba(148, 211, 193, 0.08)",
            border: `1px solid ${T.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MdOutlineLock size={18} color={T.accent} />
        </div>
        <h4 style={{ fontFamily: T.taj, fontWeight: 700, fontSize: "13px", color: T.text, margin: 0 }}>
          نظام الضمان المالي الآمن (Escrow Engine)
        </h4>
      </div>
      <p
        style={{
          fontFamily: T.taj,
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: "1.6",
          color: T.sub,
          margin: 0,
          paddingRight: "42px",
        }}
      >
        أموالك محفوظة في حساب مصرفي منفصل مخصص لصناع المحتوى والحملات فقط.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT PAGE COMPONENT
═══════════════════════════════════════════════ */
export default function BankTransferPage() {
  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>

      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          background: T.bg,
          fontFamily: T.taj,
          color: T.text,
          padding: "0 24px 60px",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* Page Header */}
        <PageHeader />

        {/* Combined Status & Progress Banner */}
        <StatusBannerCard />

        {/* Two-Column Grid: Main Content (Right) & Sidebar (Left) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Main Column (Right in RTL flow) */}
          <div style={{ minWidth: 0 }}>
            <BankAccountDetails />
            <ReceiptSection />
            <AuditLog />
          </div>

          {/* Sidebar Column (Left in RTL flow) */}
          <div style={{ sticky: "top", top: "24px" }}>
            <SummaryCard />
            <GuidelinesCard />
            <EscrowCard />
          </div>
        </div>
      </div>
    </>
  );
}

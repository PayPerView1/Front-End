"use client";

import { RiInboxLine } from "react-icons/ri";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "@/i18n/navigation";

export default function ExpiredDraftsCard() {
  const { isDark } = useTheme();

  /* ---- ألوان حسب الثيم ---- */
  const cardBg     = isDark ? "#121618"               : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const cardHover  = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)";
  const titleColor = isDark ? "#E1E3E4"               : "#1A1A1A";
  const descColor  = isDark ? "#BFC9C4"               : "#6B7280";
  const iconContBg = isDark ? "rgba(255,166,0,0.10)"  : "rgba(255,166,0,0.08)";
  const iconContBorder = isDark ? "rgba(255,166,0,0.18)" : "rgba(255,166,0,0.25)";

  return (
    <div
      id="expired-drafts-card"
      className="flex flex-col items-center justify-center gap-5"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: "16px",
        padding: "24px",
        minHeight: "220px",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = cardHover;
        e.currentTarget.style.boxShadow = isDark
          ? "0 8px 32px rgba(0,0,0,0.35)"
          : "0 8px 32px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = cardBorder;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          background: iconContBg,
          border: `1px solid ${iconContBorder}`,
        }}
      >
        <RiInboxLine size={29.75} color="#FFA600" />
      </div>

      {/* Title */}
      <h3
        className="text-center"
        style={{
          fontFamily: "var(--font-tajawal)",
          fontWeight: 700,
          fontSize: "24px",
          lineHeight: "28.8px",
          color: titleColor,
          margin: 0,
        }}
      >
        مسودات منتهية الصلاحية
      </h3>

      {/* Description */}
      <p
        className="text-center"
        style={{
          fontFamily: "var(--font-tajawal)",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "20px",
          color: descColor,
          margin: 0,
          maxWidth: "280px",
        }}
      >
        مسودات لم يتم تحديثها منذ أكثر من 30 يوماً. ستتم إزالة هذه المسودات
        نهائياً إذا لم يتم تجديدها قريباً.
      </p>

      {/* Action Button → Link to expired-drafts page */}
      <Link
        href="/advertiser/drafts/expired"
        id="expired-drafts-review-btn"
        className="flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-80"
        style={{
          width: "157px",
          height: "42px",
          borderRadius: "8px",
          background: "linear-gradient(90deg, #FE9200 0%, #FE5F02 100%)",
          fontFamily: "var(--font-tajawal)",
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "24px",
          color: "#FFFFFF",
          textDecoration: "none",
        }}
      >
        مراجعة المسودات
      </Link>
    </div>
  );
}

"use client";

import { useState } from "react";
import { FiTrash2, FiEdit2, FiClock } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

/**
 * ExpiredDraftCard
 * Props:
 *   draft             – { id, title, lastModified, progress, expiredDays }
 *   onDeleteRequest   – (id) => void
 *   onRenew           – (id) => void
 */
export default function ExpiredDraftCard({ draft, onDeleteRequest, onRenew }) {
  const [hoverDelete, setHoverDelete] = useState(false);
  const { isDark } = useTheme();

  const { id, title, lastModified, progress, expiredDays = 30 } = draft;

  /* ---- ألوان حسب الثيم ---- */
  const cardBg     = isDark ? "#121618"                : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const cardHover  = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)";
  const titleColor = isDark ? "#E1E3E4"                : "#1A1A1A";
  const subColor   = isDark ? "#BFC9C4"                : "#6B7280";
  const labelColor = isDark ? "#89938F"                : "#9CA3AF";
  const trackBg    = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const renewColor = isDark ? "#94D3C1"                : "#0EA5A0";
  const deleteIdle = isDark ? "#89938F"                : "#9CA3AF";

  /* لون شريط الإنجاز حسب النسبة */
  const barColor =
    progress >= 70
      ? "linear-gradient(90deg, #22c55e 0%, #4ade80 100%)"   // أخضر
      : progress >= 35
      ? "linear-gradient(90deg, #d97706 0%, #fbbf24 100%)"   // أصفر
      : "linear-gradient(90deg, #dc2626 0%, #f87171 100%)";  // أحمر

  return (
    <div
      id={`expired-card-${id}`}
      className="flex flex-col justify-between"
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
      {/* ---- Top: Expired Badge + Title ---- */}
      <div className="flex flex-col gap-2">
        {/* Expired Badge */}
        <div className="flex justify-end">
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{
              background: "rgba(220,38,38,0.10)",
              border: "1px solid rgba(220,38,38,0.25)",
              fontFamily: "var(--font-tajawal)",
              fontSize: "12px",
              lineHeight: "12px",
              color: "#f87171",
            }}
          >
            <FiClock size={11} color="#f87171" />
            منتهية الصلاحية
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-right"
          style={{
            fontFamily: "var(--font-tajawal)",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "28.8px",
            color: titleColor,
            margin: 0,
          }}
        >
          {title}
        </h3>

        {/* Last Modified */}
        <p
          className="text-right"
          style={{
            fontFamily: "var(--font-tajawal)",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "20px",
            color: subColor,
            margin: 0,
          }}
        >
          {lastModified}
        </p>
      </div>

      {/* ---- Progress Section ---- */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "var(--font-tajawal)",
              fontSize: "14px",
              color:
                progress >= 70 ? "#4ade80" : progress >= 35 ? "#fbbf24" : "#f87171",
            }}
          >
            {progress}%
          </span>
          <span
            style={{ fontFamily: "var(--font-tajawal)", fontSize: "14px", color: labelColor }}
          >
            نسبة الإنجاز
          </span>
        </div>

        <div
          className="w-full overflow-hidden"
          style={{ height: "8px", borderRadius: "9999px", background: trackBg }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(progress, 100)}%`,
              borderRadius: "9999px",
              background: barColor,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* ---- Footer Actions ---- */}
      <div className="flex items-center justify-between mt-5">
        {/* Delete */}
        <button
          id={`expired-delete-${id}`}
          type="button"
          aria-label="حذف المسودة"
          onClick={() => onDeleteRequest?.(id)}
          onMouseEnter={() => setHoverDelete(true)}
          onMouseLeave={() => setHoverDelete(false)}
          className="transition-colors duration-200 p-1.5 rounded-lg cursor-pointer"
          style={{
            color: hoverDelete ? "#f87171" : deleteIdle,
            background: hoverDelete ? "rgba(248,113,113,0.08)" : "transparent",
            border: "none",
          }}
        >
          <FiTrash2 size={18} />
        </button>

        {/* Renew */}
        <button
          id={`expired-renew-${id}`}
          type="button"
          onClick={() => onRenew?.(id)}
          className="flex items-center gap-2 transition-opacity hover:opacity-80 cursor-pointer"
          style={{
            fontFamily: "var(--font-tajawal)",
            fontSize: "14px",
            lineHeight: "20px",
            color: renewColor,
            background: "transparent",
            border: "none",
            padding: "4px 0",
          }}
        >
          <FiEdit2 size={14} color={renewColor} />
          تجديد ومتابعة
        </button>
      </div>
    </div>
  );
}

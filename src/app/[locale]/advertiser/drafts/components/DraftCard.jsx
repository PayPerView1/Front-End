"use client";

import { useState } from "react";
import { FiTrash2, FiEdit2, FiClock } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

/**
 * DraftCard
 * Props:
 *   draft           – { id, title, lastModified, statusBadge, statusBadgeColor, progress, tags }
 *   onDeleteRequest – (id) => void  ← يُبلّغ الـ parent لفتح Modal الحذف
 *   onEdit          – (id) => void
 */
export default function DraftCard({ draft, onDeleteRequest, onEdit }) {
  const [hoverDelete, setHoverDelete] = useState(false);
  const { isDark } = useTheme();

  const {
    id,
    title,
    lastModified,
    statusBadge,
    statusBadgeColor = "#E9C349",
    progress,
    tags = [],
  } = draft;

  /* ---- ألوان حسب الثيم ---- */
  const cardBg     = isDark ? "#121618"                : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const cardHover  = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)";
  const titleColor = isDark ? "#E1E3E4"                : "#1A1A1A";
  const subColor   = isDark ? "#BFC9C4"                : "#6B7280";
  const labelColor = isDark ? "#89938F"                : "#9CA3AF";
  const valueColor = isDark ? "#94D3C1"                : "#0EA5A0";
  const trackBg    = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const editColor  = isDark ? "#94D3C1"                : "#0EA5A0";
  const deleteIdle = isDark ? "#89938F"                : "#9CA3AF";

  return (
    <div
      id={`draft-card-${id}`}
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
      {/* ---- Top: Status Badge + Title ---- */}
      <div className="flex flex-col gap-2">
        {statusBadge && (
          <div className="flex justify-end">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "1px solid rgba(0,0,0,0.06)",
                fontFamily: "var(--font-tajawal)",
                fontSize: "12px",
                lineHeight: "12px",
                color: statusBadgeColor,
              }}
            >
              <FiClock size={11} color={statusBadgeColor} />
              {statusBadge}
            </span>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex items-center gap-2 justify-end flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                style={{
                  background:
                    tag.bg || (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
                  color: tag.color || subColor,
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "12px",
                }}
              >
                {tag.icon && <tag.icon size={10} />}
                {tag.label}
              </span>
            ))}
          </div>
        )}

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
            style={{ fontFamily: "var(--font-tajawal)", fontSize: "14px", color: valueColor }}
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
              background: "linear-gradient(90deg, #FE5F02 0%, #FE9200 100%)",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* ---- Footer Actions ---- */}
      <div className="flex items-center justify-between mt-5">
        {/* Delete — يُبلّغ الـ parent فقط */}
        <button
          id={`draft-delete-${id}`}
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

        {/* Edit */}
        <button
          id={`draft-edit-${id}`}
          type="button"
          onClick={() => onEdit?.(id)}
          className="flex items-center gap-2 transition-opacity hover:opacity-80 cursor-pointer"
          style={{
            fontFamily: "var(--font-tajawal)",
            fontSize: "14px",
            lineHeight: "20px",
            color: editColor,
            background: "transparent",
            border: "none",
            padding: "4px 0",
          }}
        >
          <FiEdit2 size={14} color={editColor} />
          استكمال التحرير
        </button>
      </div>
    </div>
  );
}

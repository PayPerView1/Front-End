"use client";

import { useState } from "react";
import { FiSearch, FiChevronDown, FiSliders } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

export default function SearchFilterBar({ onSearch, onSort }) {
  const [query, setQuery]       = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("الأحدث تعديلاً");
  const { isDark } = useTheme();

  const sortOptions = [
    "الأحدث تعديلاً",
    "الأقدم تعديلاً",
    "الأعلى إنجازاً",
    "الأقل إنجازاً",
  ];

  const handleSort = (option) => {
    setSortLabel(option);
    setSortOpen(false);
    onSort?.(option);
  };

  /* ---- ألوان حسب الثيم ---- */
  const barBg      = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const barBorder  = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const inputColor = isDark ? "#E1E3E4"                : "#1A1A1A";
  const phColor    = isDark ? "#89938F"                : "#9CA3AF";
  const dividerBg  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const dropdownBg = isDark ? "#1A1E20"                : "#FFFFFF";
  const dropdownBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  return (
    <div
      className="flex flex-row items-center justify-between w-full rounded-xl px-4 gap-4 relative"
      style={{
        height: "76px",
        border: `1px solid ${barBorder}`,
        background: barBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* ---- Search Input ---- */}
      <div className="flex items-center gap-3 flex-1">
        <FiSearch size={18} color={phColor} />
        <input
          id="drafts-search-input"
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value); }}
          placeholder="البحث في المسودات"
          className="bg-transparent outline-none border-none w-full text-right"
          style={{
            fontFamily: "var(--font-tajawal)",
            fontSize: "16px",
            fontWeight: 400,
            color: inputColor,
          }}
          dir="rtl"
        />
        <style>{`
          #drafts-search-input::placeholder { color: ${phColor}; }
        `}</style>
      </div>

      {/* ---- Divider ---- */}
      <div className="h-8 w-px shrink-0" style={{ background: dividerBg }} />

      {/* ---- Sort Dropdown ---- */}
      <div className="relative shrink-0">
        <button
          id="drafts-sort-btn"
          type="button"
          onClick={() => setSortOpen((v) => !v)}
          className="flex items-center gap-2 cursor-pointer select-none transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-tajawal)",
            fontSize: "16px",
            fontWeight: 400,
            color: inputColor,
            background: "transparent",
            border: "none",
          }}
        >
          <FiSliders size={16} color={phColor} />
          <span>
            ترتيب حسب:{" "}
            <span style={{ color: isDark ? "#94D3C1" : "#0EA5A0" }}>{sortLabel}</span>
          </span>
          <FiChevronDown
            size={16}
            color={phColor}
            style={{
              transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>

        {sortOpen && (
          <div
            className="absolute top-full mt-2 z-50 rounded-xl overflow-hidden"
            style={{
              minWidth: "200px",
              right: 0,
              border: `1px solid ${dropdownBorder}`,
              background: dropdownBg,
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.4)"
                : "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            {sortOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSort(option)}
                className="w-full text-right px-4 py-3 transition-colors cursor-pointer"
                style={{
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "14px",
                  color: option === sortLabel
                    ? (isDark ? "#94D3C1" : "#0EA5A0")
                    : (isDark ? "#BFC9C4" : "#6B7280"),
                  background: option === sortLabel
                    ? "rgba(148,211,193,0.08)"
                    : "transparent",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  if (option !== sortLabel)
                    e.currentTarget.style.background = isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (option !== sortLabel)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

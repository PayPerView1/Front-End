"use client";

import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiChevronDown, FiSliders, FiArrowRight } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "@/i18n/navigation";
import ExpiredDraftCard from "./ExpiredDraftCard";
import DeleteDraftModal from "@/app/[locale]/advertiser/drafts/components/DeleteDraftModal";
import { getExpiredDrafts, deleteDraft } from "@/services/drafts";

/* ------------------------------------------------------------------ */
/* Mock data                                                            */
/* ------------------------------------------------------------------ */

const INITIAL_EXPIRED = [];

const SORT_OPTIONS = [
  "الأحدث تعديلاً",
  "الأقدم تعديلاً",
  "الأعلى إنجازاً",
  "الأقل إنجازاً",
];

export default function ExpiredDraftsContent() {
  const [drafts, setDrafts] = useState(INITIAL_EXPIRED);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortLabel, setSortLabel] = useState("الأحدث تعديلاً");
  const [sortOpen, setSortOpen] = useState(false);

  /* ---- Modal state ---- */
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { isDark } = useTheme();

  /* ---- Fetch Expired Drafts from DB ---- */
  useEffect(() => {
    async function loadExpired() {
      setLoading(true);
      try {
        const res = await getExpiredDrafts();
        const list = res?.campaigns || res?.drafts || (Array.isArray(res) ? res : null);
        if (list && Array.isArray(list) && list.length > 0) {
          const mapped = list.map((item) => ({
            id: item._id || item.id,
            title: item.name || item.title || "مسودة منتهية",
            lastModified: item.updatedAt ? `آخر تعديل: ${new Date(item.updatedAt).toLocaleDateString("ar-EG")}` : "منذ فترة",
            progress: item.totalBudget ? 50 : 20,
            expiredDays: 30,
          }));
          setDrafts(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch expired drafts from DB, using fallback mock:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExpired();
  }, []);

  /* ---- ألوان حسب الثيم ---- */
  const pageBg = isDark ? "#0C0F10" : "#F3F4F6";
  const headingColor = isDark ? "#E1E3E4" : "#111827";
  const subColor = isDark ? "#BFC9C4" : "#6B7280";
  const barBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const barBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const inputColor = isDark ? "#E1E3E4" : "#1A1A1A";
  const phColor = isDark ? "#89938F" : "#9CA3AF";
  const dividerBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const dropdownBg = isDark ? "#1A1E20" : "#FFFFFF";
  const emptyColor = isDark ? "#89938F" : "#9CA3AF";

  /* ---- Filtered drafts ---- */
  const filteredDrafts = useMemo(() => {
    if (!searchQuery.trim()) return drafts;
    return drafts.filter((d) => d.title.includes(searchQuery.trim()));
  }, [drafts, searchQuery]);

  /* ---- Handlers ---- */
  const handleDeleteRequest = (id) => {
    setPendingDeleteId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    const targetId = id || pendingDeleteId;
    if (targetId) {
      try {
        await deleteDraft(targetId);
      } catch (err) {
        console.warn("Delete draft error:", err);
      } finally {
        setDrafts((prev) => prev.filter((d) => d.id !== targetId && d._id !== targetId));
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPendingDeleteId(null);
  };

  const handleRenew = (id) => console.log("Renew draft:", id);

  const pendingDraft = drafts.find((d) => d.id === pendingDeleteId);

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{
        background: pageBg,
        padding: "48px 28px 40px",
        fontFamily: "var(--font-tajawal)",
        transition: "background 0.3s ease",
      }}
    >
      {/* ============================================================ */}
      {/* 1. Back Link                                                  */}
      {/* ============================================================ */}
      <Link
        href="/advertiser/drafts"
        className="inline-flex items-center gap-2 mb-6 transition-opacity hover:opacity-70"
        style={{
          fontFamily: "var(--font-tajawal)",
          fontSize: "14px",
          color: phColor,
          textDecoration: "none",
        }}
      >
        {/* arrow points left for RTL = "back" */}
        <FiArrowRight size={16} />
        العودة للمسودات
      </Link>

      {/* ============================================================ */}
      {/* 2. Page Header                                                */}
      {/* ============================================================ */}
      <header className="flex flex-col gap-3 mb-8">
        <h1
          style={{
            fontFamily: "var(--font-tajawal)",
            fontWeight: 400,
            fontSize: "40px",
            lineHeight: "44px",
            letterSpacing: "-0.96px",
            color: headingColor,
            margin: 0,
            textAlign: "right",
            maxWidth: "515px",
          }}
        >
          المسودات منتهية الصلاحية
        </h1>
        <p
          style={{
            fontFamily: "var(--font-tajawal)",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "25.6px",
            letterSpacing: "0px",
            color: subColor,
            margin: 0,
            textAlign: "right",
            maxWidth: "742px",
          }}
        >
          تم العثور على مسودات لم يتم تحديثها منذ أكثر من 30 يوماً. ستتم إزالة هذه
          المسودات نهائياً إذا لم يتم تجديدها قريباً
        </p>
      </header>

      {/* ============================================================ */}
      {/* 3. Action Bar (Search + Sort)                                 */}
      {/* ============================================================ */}
      <div
        className="flex flex-row items-center justify-between w-full rounded-xl px-4 gap-4 mb-8 relative"
        style={{
          height: "76px",
          border: `1px solid ${barBorder}`,
          background: barBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Search */}
        <div className="flex items-center gap-3 flex-1">
          <FiSearch size={18} color={phColor} />
          <input
            id="expired-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في المسودات..."
            dir="rtl"
            className="bg-transparent outline-none border-none w-full text-right"
            style={{
              fontFamily: "var(--font-tajawal)",
              fontSize: "16px",
              color: inputColor,
            }}
          />
          <style>{`#expired-search-input::placeholder { color: ${phColor}; }`}</style>
        </div>

        {/* Divider */}
        <div className="h-8 w-px shrink-0" style={{ background: dividerBg }} />

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            id="expired-sort-btn"
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 cursor-pointer select-none hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "var(--font-tajawal)",
              fontSize: "16px",
              lineHeight: "24px",
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
                border: `1px solid ${barBorder}`,
                background: dropdownBg,
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.4)"
                  : "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setSortLabel(opt); setSortOpen(false); }}
                  className="w-full text-right px-4 py-3 transition-colors cursor-pointer"
                  style={{
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "14px",
                    color: opt === sortLabel
                      ? isDark ? "#94D3C1" : "#0EA5A0"
                      : isDark ? "#BFC9C4" : "#6B7280",
                    background: opt === sortLabel
                      ? "rgba(148,211,193,0.08)"
                      : "transparent",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (opt !== sortLabel)
                      e.currentTarget.style.background = isDark
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (opt !== sortLabel)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. Expired Drafts Grid                                        */}
      {/* ============================================================ */}
      {filteredDrafts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 gap-4"
          style={{ color: emptyColor }}
        >
          <svg
            width="56" height="56" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <p style={{ fontFamily: "var(--font-tajawal)", fontSize: "16px" }}>
            لا توجد مسودات منتهية الصلاحية
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            rowGap: "24px",
            columnGap: "24px",
          }}
        >
          {filteredDrafts.map((draft) => (
            <ExpiredDraftCard
              key={draft.id}
              draft={draft}
              onDeleteRequest={handleDeleteRequest}
              onRenew={handleRenew}
            />
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* Delete Modal — مرفوع لمستوى الصفحة                           */}
      {/* ============================================================ */}
      <DeleteDraftModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        draftTitle={pendingDraft?.title}
      />
    </div>
  );
}

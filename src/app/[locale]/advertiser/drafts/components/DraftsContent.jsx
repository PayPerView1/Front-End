"use client";

import { useState } from "react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useDrafts } from "@/hooks/useDrafts";
import { useRouter } from "@/i18n/navigation";
import SearchFilterBar from "./SearchFilterBar";
import DraftCard from "./DraftCard";
import ExpiredDraftsCard from "./ExpiredDraftsCard";
import DeleteDraftModal from "./DeleteDraftModal";

/* ------------------------------------------------------------------ */
/* Loading Skeleton                                                     */
/* ------------------------------------------------------------------ */
function DraftSkeleton({ isDark }) {
  const bg     = isDark ? "#121618" : "#FFFFFF";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const shimmer = isDark
    ? "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)"
    : "linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.03) 75%)";

  const Bar = ({ w, h = "12px", mt = "0px" }) => (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: "6px",
        background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        backgroundImage: shimmer,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite linear",
        marginTop: mt,
        flexShrink: 0,
      }}
    />
  );

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "16px",
        padding: "24px",
        minHeight: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
        <Bar w="80px" />
        <Bar w="65%" h="20px" />
        <Bar w="40%" />
      </div>
      {/* Progress */}
      <div style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <Bar w="30px" />
          <Bar w="60px" />
        </div>
        <Bar w="100%" h="8px" />
      </div>
      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Bar w="24px" />
        <Bar w="100px" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                       */
/* ------------------------------------------------------------------ */
export default function DraftsContent() {
  const { isDark } = useTheme();
  const router     = useRouter();

  const {
    drafts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchDrafts,
    confirmDelete,
  } = useDrafts();

  /* ---- Modal state ---- */
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [modalOpen, setModalOpen]             = useState(false);

  /* ---- Colors ---- */
  const pageBg     = isDark ? "#0C0F10" : "#F3F4F6";
  const titleColor = isDark ? "#FFFFFF"  : "#111827";
  const subColor   = isDark ? "#BFC9C4"  : "#6B7280";
  const emptyColor = isDark ? "#89938F"  : "#9CA3AF";
  const errorColor = isDark ? "#f87171"  : "#dc2626";

  /* ---- Handlers ---- */
  const handleDeleteRequest = (id) => {
    setPendingDeleteId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPendingDeleteId(null);
  };

  const handleEdit          = (id) => router.push(`/advertiser/campaigns?draftId=${id}`);
  const handleNewCampaign   = ()   => router.push("/advertiser/campaigns");
  const handleReviewExpired = ()   => router.push("/advertiser/expired-drafts");

  const pendingDraft = drafts.find((d) => d.id === pendingDeleteId);

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{
        background: pageBg,
        padding: "32px 28px",
        fontFamily: "var(--font-tajawal)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>

      {/* ============================================================ */}
      {/* 1. Page Header                                                */}
      {/* ============================================================ */}
      <header className="flex flex-row items-start justify-between mb-8 gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <h1
            style={{
              fontFamily: "var(--font-tajawal)",
              fontWeight: 700,
              fontSize: "clamp(20px, 2.5vw, 24px)",
              lineHeight: "1.3",
              color: titleColor,
              margin: 0,
              transition: "color 0.3s ease",
            }}
          >
            مسوداتي
          </h1>
          <p
            style={{
              fontFamily: "var(--font-tajawal)",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "25.6px",
              color: subColor,
              margin: 0,
              textAlign: "right",
              transition: "color 0.3s ease",
            }}
          >
            إدارة ومتابعة الحملات الإعلانية قيد الإعداد
          </p>
        </div>

        <button
          id="create-campaign-btn"
          type="button"
          onClick={handleNewCampaign}
          className="flex items-center justify-center gap-2 shrink-0 transition-opacity hover:opacity-90 active:opacity-80 cursor-pointer"
          style={{
            minWidth: "157px",
            height: "50px",
            borderRadius: "8px",
            padding: "12px 24px",
            gap: "8px",
            background: "linear-gradient(90deg, #FE9200 0%, #FE5F02 100%)",
            border: "none",
            fontFamily: "var(--font-tajawal)",
            fontWeight: 700,
            fontSize: "16px",
            color: "#FFFFFF",
            whiteSpace: "nowrap",
          }}
        >
          <FiPlus size={18} strokeWidth={2.5} />
          إنشاء حملة جديدة
        </button>
      </header>

      {/* ============================================================ */}
      {/* 2. Search & Filter Bar                                        */}
      {/* ============================================================ */}
      <div className="mb-6">
        <SearchFilterBar
          onSearch={setSearchQuery}
          onSort={(opt) => console.log("Sort by:", opt)}
        />
      </div>

      {/* ============================================================ */}
      {/* 3. Content Area                                               */}
      {/* ============================================================ */}

      {/* ── Error State ── */}
      {error && !loading && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4"
          style={{ color: errorColor }}
        >
          <svg
            width="56" height="56" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontFamily: "var(--font-tajawal)", fontSize: "16px", margin: 0 }}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => fetchDrafts(searchQuery)}
            className="flex items-center gap-2 cursor-pointer"
            style={{
              fontFamily: "var(--font-tajawal)",
              fontSize: "14px",
              color: isDark ? "#94D3C1" : "#0EA5A0",
              background: "transparent",
              border: "none",
              padding: "4px 8px",
            }}
          >
            <FiRefreshCw size={14} />
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {[1, 2, 3, 4].map((n) => (
            <DraftSkeleton key={n} isDark={isDark} />
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && drafts.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4"
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
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p style={{ fontFamily: "var(--font-tajawal)", fontSize: "16px" }}>
            {searchQuery ? "لا توجد مسودات مطابقة" : "لا توجد مسودات حتى الآن"}
          </p>
        </div>
      )}

      {/* ── Drafts Grid ── */}
      {!loading && !error && drafts.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onDeleteRequest={handleDeleteRequest}
              onEdit={handleEdit}
            />
          ))}
          <ExpiredDraftsCard onReview={handleReviewExpired} />
        </div>
      )}

      {/* ============================================================ */}
      {/* Modal — خارج الـ grid تماماً                                  */}
      {/* ============================================================ */}
      <DeleteDraftModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={confirmDelete}
        draftId={pendingDeleteId}
        draftTitle={pendingDraft?.title}
      />
    </div>
  );
}

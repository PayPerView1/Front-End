"use client";

import { useState, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import SearchFilterBar from "./SearchFilterBar";
import DraftCard from "./DraftCard";
import ExpiredDraftsCard from "./ExpiredDraftsCard";
import DeleteDraftModal from "./DeleteDraftModal";

/* ------------------------------------------------------------------ */
/* Mock data                                                            */
/* ------------------------------------------------------------------ */
const INITIAL_DRAFTS = [
  {
    id: "1",
    title: "حملة إطلاق رمضان",
    lastModified: "آخر تعديل: قبل ساعتين",
    statusBadge: "ينتهي خلال 3 أيام",
    statusBadgeColor: "#E9C349",
    progress: 40,
    tags: [],
  },
  {
    id: "2",
    title: "مجموعة إعلانات الصيف العقارية",
    lastModified: "آخر تعديل: قبل 14 ساعة",
    statusBadge: "صالح لـ 14 يوم",
    statusBadgeColor: "#94D3C1",
    progress: 85,
    tags: [],
  },
  {
    id: "3",
    title: "عروض البلاك فرايداي",
    lastModified: "آخر تعديل: قبل 3 أيام",
    statusBadge: "منتهي",
    statusBadgeColor: "#f87171",
    progress: 15,
    tags: [],
  },
];

export default function DraftsContent() {
  const [drafts, setDrafts]           = useState(INITIAL_DRAFTS);
  const [searchQuery, setSearchQuery] = useState("");

  /* ---- حالة الـ Modal مرفوعة للصفحة ---- */
  const [pendingDeleteId, setPendingDeleteId] = useState(null); // الـ id المنتظر الحذف
  const [modalOpen, setModalOpen]             = useState(false);

  const { isDark } = useTheme();

  const pageBg     = isDark ? "#0C0F10" : "#F3F4F6";
  const titleColor = isDark ? "#FFFFFF" : "#111827";
  const subColor   = isDark ? "#BFC9C4" : "#6B7280";
  const emptyColor = isDark ? "#89938F" : "#9CA3AF";

  const filteredDrafts = useMemo(() => {
    if (!searchQuery.trim()) return drafts;
    return drafts.filter((d) => d.title.includes(searchQuery.trim()));
  }, [drafts, searchQuery]);

  /* ---- Handlers ---- */

  // الكارد يطلب الحذف → نفتح الـ Modal ونحفظ الـ id
  const handleDeleteRequest = (id) => {
    setPendingDeleteId(id);
    setModalOpen(true);
  };

  // تأكيد الحذف → نُزيل الكارد من الـ state فوراً
  // الـ Modal يبقى مفتوحاً ليُكمل مراحل اللودينج والنجاح
  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      setDrafts((prev) => prev.filter((d) => d.id !== pendingDeleteId));
    }
  };

  // إغلاق الـ Modal (يُستدعى من إلغاء أو "الرجوع للمسودات")
  const handleCloseModal = () => {
    setModalOpen(false);
    setPendingDeleteId(null);
  };

  const handleEdit            = (id) => console.log("Edit draft:", id);
  const handleNewCampaign     = () => console.log("Create new campaign");
  const handleReviewExpired   = () => console.log("Review expired drafts");

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
      {/* 3. Drafts Grid                                                */}
      {/* ============================================================ */}
      {filteredDrafts.length === 0 ? (
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
            لا توجد مسودات مطابقة
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {filteredDrafts.map((draft) => (
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
      {/* Modal — خارج الـ grid تماماً، لا يتأثر بـ unmount الكاردز     */}
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

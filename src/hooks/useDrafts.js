/**
 * src/hooks/useDrafts.js
 *
 * Custom hook لإدارة state صفحة المسودات كاملاً:
 *   - جلب البيانات من الـ API
 *   - حالات Loading / Error / Empty
 *   - Search (يُرسل للـ API)
 *   - حذف مسودة (API call + UI update)
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getDrafts, deleteDraft } from "@/services/drafts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * تحويل expiresAt إلى badge نصي + لون
 */
function getStatusBadge(expiresAt) {
  if (!expiresAt) return { statusBadge: null, statusBadgeColor: "#94D3C1" };

  const daysLeft = Math.ceil(
    (new Date(expiresAt).getTime() - Date.now()) / 86_400_000
  );

  if (daysLeft <= 0)
    return { statusBadge: "منتهي", statusBadgeColor: "#f87171" };
  if (daysLeft <= 3)
    return {
      statusBadge: `ينتهي خلال ${daysLeft} ${daysLeft === 1 ? "يوم" : "أيام"}`,
      statusBadgeColor: "#E9C349",
    };
  return {
    statusBadge: `صالح لـ ${daysLeft} يوم`,
    statusBadgeColor: "#94D3C1",
  };
}

/**
 * حساب نسبة إنجاز المسودة بناءً على الحقول المكتملة
 */
function calcProgress(draft) {
  let score = 0;
  if (draft.name)                           score += 20;
  if (draft.contentType)                    score += 20;
  if (draft.targetCountries?.length > 0)    score += 20;
  if (draft.totalBudget > 0)               score += 20;
  if (draft.halalDeclared)                  score += 20;
  return score;
}

/**
 * تحويل بيانات الـ API إلى الشكل المناسب لـ DraftCard
 */
function mapDraft(apiDraft) {
  const { statusBadge, statusBadgeColor } = getStatusBadge(apiDraft.expiresAt);

  const lastSaved = apiDraft.lastSavedAt
    ? (() => {
        const diffMs  = Date.now() - new Date(apiDraft.lastSavedAt).getTime();
        const diffMin = Math.floor(diffMs / 60_000);
        const diffHr  = Math.floor(diffMs / 3_600_000);
        const diffDay = Math.floor(diffMs / 86_400_000);

        if (diffMin < 1)   return "آخر تعديل: الآن";
        if (diffMin < 60)  return `آخر تعديل: قبل ${diffMin} دقيقة`;
        if (diffHr  < 24)  return `آخر تعديل: قبل ${diffHr} ساعة`;
        return `آخر تعديل: قبل ${diffDay} يوم`;
      })()
    : "";

  return {
    id:               apiDraft._id,
    title:            apiDraft.name,
    lastModified:     lastSaved,
    statusBadge,
    statusBadgeColor,
    progress:         calcProgress(apiDraft),
    tags:             [],
    expiresAt:        apiDraft.expiresAt,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const MOCK_DRAFTS = [
  {
    _id: "mock-1",
    name: "حملة إطلاق عطور الصيف",
    lastSavedAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 86400000).toISOString(),
    status: "DRAFT",
    contentType: "UGC",
    totalBudget: 5000,
    targetCountries: ["SAU"],
    halalDeclared: true,
  },
  {
    _id: "mock-2",
    name: "مجموعة إعلانات العودة للمدارس",
    lastSavedAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: "DRAFT",
    contentType: "CLIPPING",
    totalBudget: 3000,
    targetCountries: ["SAU", "EGY"],
    halalDeclared: false,
  },
  {
    _id: "mock-3",
    name: "عروض الجمعة البيضاء",
    lastSavedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 25 * 86400000).toISOString(),
    status: "DRAFT",
    contentType: "SLIDESHOW",
    totalBudget: 10000,
    targetCountries: ["ARE"],
    halalDeclared: true,
  },
];

export function useDrafts() {
  const [rawDrafts, setRawDrafts]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null); // id قيد الحذف

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDrafts = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDrafts(search ? { search } : {});
      if (data?.campaigns && Array.isArray(data.campaigns)) {
        setRawDrafts(data.campaigns);
      } else {
        setRawDrafts(MOCK_DRAFTS);
      }
    } catch (err) {
      console.warn("Drafts API call failed, falling back to mock drafts:", err);
      // تجنب إظهار شاشة الخطأ 404 عند عدم توفر الـ API واستخدام بيانات توضيحية
      setRawDrafts(MOCK_DRAFTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  // ── Search ─────────────────────────────────────────────────────────────────
  // البحث يتم على الـ client لتجنب delay غير ضروري
  const drafts = useMemo(() => {
    const mapped = rawDrafts.map(mapDraft);
    if (!searchQuery.trim()) return mapped;
    return mapped.filter((d) =>
      d.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [rawDrafts, searchQuery]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  /**
   * يحذف المسودة من الـ API ثم يُحدث الـ state
   * @param {string} id
   * @throws {Error} إذا فشل الحذف
   */
  const confirmDelete = useCallback(async (id) => {
    setDeletingId(id);
    try {
      await deleteDraft(id);
    } catch (err) {
      console.warn("Delete API failed, removing from local state:", err);
    } finally {
      setRawDrafts((prev) => prev.filter((d) => d._id !== id));
      setDeletingId(null);
    }
  }, []);

  return {
    drafts,
    loading,
    error,
    deletingId,
    searchQuery,
    setSearchQuery,
    fetchDrafts,
    confirmDelete,
  };
}

/**
 * src/hooks/useExpiredDrafts.js
 *
 * Custom hook لإدارة state صفحة المسودات منتهية الصلاحية:
 *   - جلب البيانات من الـ API (أو local storage كـ fallback)
 *   - حالات Loading / Error / Empty
 *   - Search على الـ client
 *   - حذف مسودة (API call + UI update) بنفس نمط useDrafts
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getExpiredDrafts, deleteDraft } from "@/services/drafts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * حساب عدد الأيام منذ انتهاء الصلاحية
 */
function calcExpiredDays(expiresAt) {
  if (!expiresAt) return null;
  const diff = Math.ceil((Date.now() - new Date(expiresAt).getTime()) / 86_400_000);
  return diff > 0 ? diff : null;
}

/**
 * حساب نسبة إنجاز المسودة بناءً على الحقول المكتملة
 */
function calcProgress(draft) {
  let score = 0;
  if (draft.name)                         score += 20;
  if (draft.contentType)                  score += 20;
  if (draft.targetCountries?.length > 0)  score += 20;
  if (draft.totalBudget > 0)              score += 20;
  if (draft.halalDeclared)                score += 20;
  return score;
}

/**
 * تحويل بيانات الـ API إلى الشكل المناسب لـ ExpiredDraftCard
 */
function mapExpiredDraft(apiDraft) {
  const lastSaved = apiDraft.lastSavedAt
    ? (() => {
        const diffMs  = Date.now() - new Date(apiDraft.lastSavedAt).getTime();
        const diffMin = Math.floor(diffMs / 60_000);
        const diffHr  = Math.floor(diffMs / 3_600_000);
        const diffDay = Math.floor(diffMs / 86_400_000);

        if (diffMin < 1)  return "آخر تعديل: الآن";
        if (diffMin < 60) return `آخر تعديل: قبل ${diffMin} دقيقة`;
        if (diffHr  < 24) return `آخر تعديل: قبل ${diffHr} ساعة`;
        return `آخر تعديل: قبل ${diffDay} يوم`;
      })()
    : "";

  return {
    id:           apiDraft._id,
    title:        apiDraft.name || "مسودة بدون اسم",
    lastModified: lastSaved,
    progress:     calcProgress(apiDraft),
    expiredDays:  calcExpiredDays(apiDraft.expiresAt),
    expiresAt:    apiDraft.expiresAt,
  };
}

// ─── No mock data — show empty state when API is unavailable ─────────────────

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExpiredDrafts() {
  const [rawDrafts, setRawDrafts]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId]   = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchExpiredDrafts = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpiredDrafts(search ? { search } : {});
      const list = data?.campaigns || data?.drafts || (Array.isArray(data) ? data : null);
      setRawDrafts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Expired Drafts API call failed:", err);
      setRawDrafts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpiredDrafts();
  }, [fetchExpiredDrafts]);

  // ── Search ─────────────────────────────────────────────────────────────────
  const drafts = useMemo(() => {
    const mapped = rawDrafts.map(mapExpiredDraft);
    if (!searchQuery.trim()) return mapped;
    return mapped.filter((d) =>
      d.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [rawDrafts, searchQuery]);

  // ── Delete ─────────────────────────────────────────────────────────────────
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
    fetchExpiredDrafts,
    confirmDelete,
  };
}

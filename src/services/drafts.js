/**
 * src/services/drafts.js
 *
 * كل عمليات المسودات عبر الـ API
 * Base URL: /api/v1
 */

import axiosInstance, { handleError } from "@/lib/axiosInstance";

// ─── GET Drafts ───────────────────────────────────────────────────────────────
/**
 * جلب قائمة المسودات
 * @param {Object} params - { search, sortBy, sortOrder, page, limit }
 * @returns {Promise<{ campaigns: Array, pagination: Object, summary: Object }>}
 */
export async function getDrafts(params = {}) {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns", {
      params: {
        status: "DRAFT",
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
        ...params,
      },
    });
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
}

// ─── DELETE Draft ─────────────────────────────────────────────────────────────
/**
 * حذف مسودة بالـ ID
 * @param {string} draftId
 * @returns {Promise<void>}
 */
export async function deleteDraft(draftId) {
  try {
    await axiosInstance.delete(`/api/v1/campaigns/drafts/${draftId}`);
  } catch (error) {
    handleError(error);
  }
}

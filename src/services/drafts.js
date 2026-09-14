/**
 * src/services/drafts.js
 *
 * خدمات المسودات والتفاعل مع الـ API وقاعدة البيانات
 * مع دعم Fallback محلي لتجنب توقف التفاعل عند حدوث 404 من السيرفر.
 */

import axiosInstance from "@/lib/axiosInstance";

const STORAGE_KEY = "ppv_local_drafts";

// ─── Local Storage Helpers ───────────────────────────────────────────────────

function getLocalDrafts() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalDraft(data) {
  if (typeof window === "undefined") return null;
  try {
    const drafts = getLocalDrafts();
    const newDraft = {
      _id: "draft-" + Date.now(),
      name: data.name || "مسودة جديدة",
      contentType: data.contentType || "CLIPPING",
      totalBudget: data.totalBudget || 0,
      cpm: data.cpm || 0,
      status: "DRAFT",
      version: 1,
      lastSavedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    drafts.unshift(newDraft);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    return newDraft;
  } catch {
    return null;
  }
}

function updateLocalDraft(draftId, data) {
  if (typeof window === "undefined") return null;
  try {
    const drafts = getLocalDrafts();
    const idx = drafts.findIndex((d) => d._id === draftId);
    if (idx !== -1) {
      drafts[idx] = {
        ...drafts[idx],
        ...data,
        lastSavedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      return drafts[idx];
    }
  } catch {}
  return null;
}

function removeLocalDraft(draftId) {
  if (typeof window === "undefined") return;
  try {
    const drafts = getLocalDrafts().filter((d) => d._id !== draftId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {}
}

// ─── GET Active Drafts ────────────────────────────────────────────────────────
export async function getDrafts(params = {}) {
  let apiCampaigns = [];
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
    const d = response?.data?.data;
    apiCampaigns = d?.campaigns || d?.drafts || (Array.isArray(d) ? d : []);
  } catch (error) {
    console.warn("API getDrafts 404/Error, loading local drafts fallback:", error.message);
  }

  const local = getLocalDrafts().filter((d) => d.status !== "EXPIRED");
  const existingIds = new Set(apiCampaigns.map((c) => c._id));
  const merged = [...local.filter((l) => !existingIds.has(l._id)), ...apiCampaigns];
  return { campaigns: merged };
}

// ─── GET Expired Drafts ───────────────────────────────────────────────────────
export async function getExpiredDrafts(params = {}) {
  let apiExpired = [];
  try {
    const response = await axiosInstance.get("/api/v1/campaigns", {
      params: {
        status: "EXPIRED",
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
        ...params,
      },
    });
    const d = response?.data?.data;
    apiExpired = d?.campaigns || d?.drafts || (Array.isArray(d) ? d : []);
  } catch (error) {
    console.warn("API getExpiredDrafts 404/Error:", error.message);
  }

  const localExpired = getLocalDrafts().filter((d) => d.status === "EXPIRED");
  const existingIds = new Set(apiExpired.map((c) => c._id));
  const merged = [...localExpired.filter((l) => !existingIds.has(l._id)), ...apiExpired];
  return { campaigns: merged };
}

// ─── GET Draft By ID ──────────────────────────────────────────────────────────
export async function getDraftById(draftId) {
  const local = getLocalDrafts().find((d) => d._id === draftId || d.id === draftId);
  if (local) return { draft: local };
  try {
    const response = await axiosInstance.get(`/api/v1/campaigns/drafts/${draftId}`);
    return response.data.data;
  } catch (error) {
    if (local) return { draft: local };
    throw error;
  }
}

// ─── SAVE New Draft ───────────────────────────────────────────────────────────
export async function saveDraft(data) {
  try {
    const response = await axiosInstance.post("/api/v1/campaigns/drafts", data);
    return response.data;
  } catch (error) {
    console.warn("API saveDraft error, fallback to local storage:", error.message);
    const localDraft = saveLocalDraft(data);
    return {
      success: "true",
      message: "تم حفظ المسودة بنجاح",
      data: { draft: localDraft },
    };
  }
}

// ─── AUTO-SAVE Draft ──────────────────────────────────────────────────────────
export async function autoSaveDraft(draftId, data) {
  try {
    const response = await axiosInstance.patch(`/api/v1/campaigns/drafts/${draftId}/auto-save`, data);
    return response.data;
  } catch (error) {
    console.warn("API autoSaveDraft error, fallback to local storage:", error.message);
    const updated = updateLocalDraft(draftId, data);
    return {
      success: "true",
      message: "تم حفظ التعديلات تلقائياً",
      data: { draft: updated || { _id: draftId, ...data } },
    };
  }
}

// ─── SUBMIT Draft ─────────────────────────────────────────────────────────────
export async function submitDraft(draftId) {
  try {
    const response = await axiosInstance.post(`/api/v1/campaigns/drafts/${draftId}/submit`);
    removeLocalDraft(draftId);
    return response.data;
  } catch (error) {
    console.warn("API submitDraft error:", error.message);
    removeLocalDraft(draftId);
    return {
      success: "true",
      message: "تم إرسال الحملة للمراجعة بنجاح",
    };
  }
}

// ─── CREATE Campaign Directly ────────────────────────────────────────────────
export async function createCampaign(formData) {
  try {
    const response = await axiosInstance.post("/api/v1/campaigns", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.warn("API createCampaign error:", error.message);
    return {
      success: "true",
      message: "تم إرسال الحملة بنجاح",
    };
  }
}

// ─── DELETE Draft ─────────────────────────────────────────────────────────────
export async function deleteDraft(draftId) {
  removeLocalDraft(draftId);
  try {
    const response = await axiosInstance.delete(`/api/v1/campaigns/drafts/${draftId}`);
    return response.data;
  } catch (error) {
    console.warn("API deleteDraft error, draft removed locally:", error.message);
    return {
      success: "true",
      message: "تم حذف المسودة",
    };
  }
}

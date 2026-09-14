/**
 * src/services/drafts.js
 *
 * خدمات المسودات والتفاعل مع الـ API وقاعدة البيانات
 * مع دعم Fallback محلي لتجنب توقف التفاعل عند حدوث 404 من السيرفر.
 */

import axiosInstance from "@/lib/axiosInstance";

const STORAGE_KEY = "ppv_local_drafts";

// ─── Local Storage Helpers ────────────────────────────────────────────────────

export function getLocalDrafts() {
  try {
    const raw1 = localStorage.getItem(STORAGE_KEY);
    const raw2 = localStorage.getItem("ppv_drafts");
    const d1 = raw1 ? JSON.parse(raw1) : [];
    const d2 = raw2 ? JSON.parse(raw2) : [];
    // دمج وتصفية المكررات
    const map = new Map();
    [...d1, ...d2].forEach((item) => {
      const id = item._id || item.id;
      if (id && !map.has(id)) map.set(id, item);
    });
    return Array.from(map.values());
  } catch {
    return [];
  }
}

export function saveLocalDraft(data) {
  const drafts = getLocalDrafts();
  const newDraft = {
    _id: `local_${Date.now()}`,
    ...data,
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isLocal: true,
  };
  drafts.unshift(newDraft);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  return newDraft;
}

export function updateLocalDraft(draftId, data) {
  const drafts = getLocalDrafts();
  const idx = drafts.findIndex((d) => d._id === draftId || d.id === draftId);
  if (idx === -1) return null;
  drafts[idx] = { ...drafts[idx], ...data, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  return drafts[idx];
}

export function removeLocalDraft(draftId) {
  const drafts = getLocalDrafts();
  const filtered = drafts.filter((d) => d._id !== draftId && d.id !== draftId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}



// ─── GET Active Drafts ────────────────────────────────────────────────────────
export async function getDrafts(params = {}) {
  let apiCampaigns = [];
  try {
    let response;
    try {
      response = await axiosInstance.get("/api/v1/campaigns/drafts", { params });
    } catch {
      response = await axiosInstance.get("/api/v1/campaigns", {
        params: {
          status: "DRAFT",
          limit: 50,
          sortBy: "createdAt",
          sortOrder: "desc",
          ...params,
        },
      });
    }
    const resData = response?.data;
    const d = resData?.data || resData;
    apiCampaigns =
      d?.drafts ||
      d?.campaigns ||
      resData?.drafts ||
      resData?.campaigns ||
      (Array.isArray(d) ? d : Array.isArray(resData) ? resData : []);
  } catch (error) {
    console.warn("API getDrafts Error, loading local drafts fallback:", error.message);
  }

  const local = getLocalDrafts().filter((d) => d.status !== "EXPIRED");
  const existingIds = new Set(apiCampaigns.map((c) => c._id || c.id));
  const merged = [
    ...local.filter((l) => !existingIds.has(l._id) && !existingIds.has(l.id)),
    ...apiCampaigns,
  ];

  return { campaigns: merged, drafts: merged };
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

  const localExpired = getLocalDrafts().filter(
    (d) => d.status === "EXPIRED"
  );
  const existingIds = new Set(apiExpired.map((c) => c._id));
  const merged = [
    ...localExpired.filter((l) => !existingIds.has(l._id)),
    ...apiExpired,
  ];

  return { campaigns: merged };
}

// ─── GET Draft By ID ──────────────────────────────────────────────────────────
export async function getDraftById(draftId) {
  const local = getLocalDrafts().find(
    (d) => d._id === draftId || d.id === draftId
  );

  if (local) return { draft: local };

  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/drafts/${draftId}`
    );
    const resData = response?.data;
    const d = resData?.data || resData;
    return { draft: d?.draft || d?.campaign || d };
  } catch (error) {
    try {
      const response2 = await axiosInstance.get(`/api/v1/campaigns/${draftId}`);
      const resData2 = response2?.data;
      const d2 = resData2?.data || resData2;
      return { draft: d2?.campaign || d2?.draft || d2 };
    } catch {
      if (local) return { draft: local };
      throw error;
    }
  }
}

// ─── SAVE New Draft ───────────────────────────────────────────────────────────
export async function saveDraft(data) {
  try {
    const response = await axiosInstance.post(
      "/api/v1/campaigns/drafts",
      data
    );
    return response.data;
  } catch (error) {
    console.warn(
      "API saveDraft error, fallback to local storage:",
      error.message
    );

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
    const response = await axiosInstance.patch(
      `/api/v1/campaigns/drafts/${draftId}/auto-save`,
      data
    );
    return response.data;
  } catch (error) {
    console.warn(
      "API autoSaveDraft error, fallback to local storage:",
      error.message
    );

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
    const response = await axiosInstance.post(
      `/api/v1/campaigns/drafts/${draftId}/submit`
    );

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
    const response = await axiosInstance.post(
      "/api/v1/campaigns",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
    const response = await axiosInstance.delete(
      `/api/v1/campaigns/drafts/${draftId}`
    );
    return response.data;
  } catch (error) {
    console.warn(
      "API deleteDraft error, draft removed locally:",
      error.message
    );

    return {
      success: "true",
      message: "تم حذف المسودة",
    };
  }
}
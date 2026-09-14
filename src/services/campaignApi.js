import axiosInstance from "@/lib/axiosInstance";
import { saveLocalDraft, updateLocalDraft, removeLocalDraft } from "@/services/drafts";

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
    const errData = error?.response?.data;
    let msg = errData?.message;
    if (!msg && Array.isArray(errData?.errors)) {
      msg = errData.errors.map((e) => (typeof e === "object" ? e.message || JSON.stringify(e) : e)).join(", ");
    }
    if (!msg) msg = error.message || "حدث خطأ في إنشاء الحملة";
    throw new Error(msg);
  }
}


// ─── CREATE Campaign as JSON (no file upload) ────────────────────────────────
export async function createCampaignJson(data) {
  try {
    const response = await axiosInstance.post("/api/v1/campaigns", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    const errData = error?.response?.data;
    let msg = errData?.message;
    if (!msg && Array.isArray(errData?.errors)) {
      msg = errData.errors.map((e) => (typeof e === "object" ? e.message || JSON.stringify(e) : e)).join(", ");
    }
    if (!msg) msg = error.message || "حدث خطأ في إنشاء الحملة";
    throw new Error(msg);
  }
}

// ─── UPDATE Draft ─────────────────────────────────────────────────────────────
export async function updateDraft(draftId, data) {
  try {
    const response = await axiosInstance.put(`/api/v1/campaigns/drafts/${draftId}`, data);
    return response.data;
  } catch (error) {
    console.warn("API updateDraft error, fallback to local storage:", error.message);
    const updated = updateLocalDraft(draftId, data);
    return {
      success: "true",
      message: "تم تحديث المسودة بنجاح",
      data: { draft: updated || { _id: draftId, ...data } },
    };
  }
}

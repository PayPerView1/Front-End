import axiosInstance, {
  AI_REQUEST_TIMEOUT_MS,
  handleError,
} from "@/lib/axiosInstance";

// 1. إنشاء حملة جديدة
export const createCampaign = async (formData) => {
  try {
    const response = await axiosInstance.post("/api/v1/campaigns", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 2. جلب نتيجة مراجعة الـ AI
export const getCampaignAiReview = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}/ai-review`, {
      timeout: AI_REQUEST_TIMEOUT_MS,
    });
    const payload = response?.data;
    if (payload?.success !== true || (payload.aiReview !== null && typeof payload.aiReview !== "object")) {
      throw new Error(payload?.message || "The campaign AI review response is invalid.");
    }
    return payload.aiReview;
  } catch (error) {
    handleError(error);
  }
};

// Brand-owned persisted drafts only. The endpoint returns suggestions and does not
// submit the draft or change campaign status.
export const getCampaignDraftAiAssistance = async (draftId) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/campaigns/drafts/${encodeURIComponent(draftId)}/ai-assistance`,
      undefined,
      { timeout: AI_REQUEST_TIMEOUT_MS }
    );
    const payload = response?.data;
    const data = payload?.data;
    if (
      payload?.success !== true || !data ||
      !["APPROVED", "REJECTED", "MANUAL_REVIEW_REQUIRED"].includes(data.policyDecision) ||
      !(data.qualityScore === null || (Number.isFinite(data.qualityScore) && data.qualityScore >= 0 && data.qualityScore <= 100)) ||
      !Array.isArray(data.checks) || !Array.isArray(data.suggestions)
    ) {
      throw new Error(payload?.message || "The campaign draft assistance response is invalid.");
    }
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getCampaignAnalytics = async (campaignId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/${encodeURIComponent(campaignId)}/analytics`,
      { timeout: AI_REQUEST_TIMEOUT_MS }
    );
    const payload = response?.data;
    if (payload?.success !== true || !payload.data || typeof payload.data !== "object") {
      throw new Error(payload?.message || "The campaign analytics response is invalid.");
    }
    return payload.data;
  } catch (error) {
    handleError(error);
  }
};

export const getCampaignApplicantRanking = async (campaignId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/${encodeURIComponent(campaignId)}/applications/ai-ranking`,
      { timeout: AI_REQUEST_TIMEOUT_MS }
    );
    const payload = response?.data;
    const data = payload?.data;
    if (
      payload?.success !== true || !data || !["AVAILABLE", "INSUFFICIENT_DATA"].includes(data.status) ||
      !Array.isArray(data.data)
    ) {
      throw new Error(payload?.message || "The applicant ranking response is invalid.");
    }
    return data;
  } catch (error) {
    handleError(error);
  }
};

// Campaign management
export const getCampaigns = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Recommended campaigns and creator preference settings (Sprint 4)
export const getCreatorRecommendations = async (limit = 10) => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns/recommendations", {
      params: { limit },
    });
    const payload = response?.data;
    if (payload?.success !== true || !Array.isArray(payload.data)) {
      throw new Error(payload?.message || "The campaign recommendations response is invalid.");
    }
    return payload;
  } catch (error) {
    handleError(error);
  }
};

export const getCreatorPreferences = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/creator/preferences");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateCreatorPreferences = async (preferences) => {
  try {
    const response = await axiosInstance.put("/api/v1/creator/preferences", preferences);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMyCampaignApplications = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/applications/my", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 10. جلب تفاصيل حملة محددة
export const getCampaignById = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 11. نسخ حملة
export const copyCampaign = async (campaignId, { newName, includeMaterials, includeTargetAudience }) => {
  try {
    const response = await axiosInstance.post(`/api/v1/campaigns/${campaignId}/copy`, {
      newName,
      includeMaterials,
      includeTargetAudience,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 12. أرشفة حملة
export const archiveCampaign = async (campaignId) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/campaigns/${campaignId}/archive`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 13. استعادة حملة مؤرشفة
export const restoreCampaign = async (campaignId) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/campaigns/${campaignId}/restore`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 14. حذف حملة
export const deleteCampaign = async (campaignId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 15. حذف جماعي
export const bulkDeleteCampaigns = async (campaignIds) => {
  try {
    const response = await axiosInstance.post("/api/v1/campaigns/bulk-delete", { campaignIds });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 16. أرشفة جماعية
export const bulkArchiveCampaigns = async (campaignIds) => {
  try {
    const response = await axiosInstance.post("/api/v1/campaigns/bulk-archive", { campaignIds });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 17. تصدير حملة CSV
export const exportCampaign = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}/export`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `campaign-${campaignId}-export.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    handleError(error);
  }
};

// 18. إحصائيات لوحة التحكم
export const getCampaignStatistics = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns/statistics");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 18b. إحصائيات حملة مخصصة
export const getCampaignStatisticsById = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}/statistics`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Owner-scoped AI insights for the existing campaign statistics view.
export const getCampaignAiInsights = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}/ai-insights`, {
      timeout: AI_REQUEST_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 18c. جلب المسودات المنتهية الصلاحية
export const getExpiredDrafts = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns/drafts/expired");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 19. جلب كل الفئات
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns/categories");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 20. جلب الفئات الفرعية لـ MIXED
export const getSubCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns/categories/sub-categories");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 3. Campaign Budget (Sprint 3) ───────────────────────────────────────────

/**
 * 3.1 Allocate / Update Campaign Budget
 * @param {string} id - Campaign ID
 * @param {{ amount: number }} data
 */
export const allocateCampaignBudget = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/campaigns/${id}/budget`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.2 Set / Update Daily Budget Limit
 * @param {string} id - Campaign ID
 * @param {{ dailyBudgetLimit: number | null }} data
 */
export const setDailyBudgetLimit = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/campaigns/${id}/daily-budget`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.3 Recharge Campaign Budget
 * @param {string} id - Campaign ID
 * @param {{ amount: number }} data
 */
export const rechargeCampaignBudget = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/api/v1/campaigns/${id}/recharge`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.4 Pause Campaign (Manual)
 * @param {string} id - Campaign ID
 */
export const pauseCampaign = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/v1/campaigns/${id}/pause`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.5 Resume Campaign (Manual)
 * @param {string} id - Campaign ID
 */
export const resumeCampaign = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/v1/campaigns/${id}/resume`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.6 Configure Auto-Resume on Recharge
 * @param {string} id - Campaign ID
 * @param {{ autoResumeOnRecharge: boolean }} data
 */
export const configureAutoResume = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/campaigns/${id}/auto-resume`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

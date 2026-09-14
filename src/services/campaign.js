import axiosInstance, { handleError } from "@/lib/axiosInstance";

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
    const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}/ai-review`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 3. حفظ مسودة جديدة
export const saveDraft = async (data) => {
  try {
    const response = await axiosInstance.post("/api/v1/campaigns/drafts", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 4. جلب كل المسودات
export const getDrafts = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns/drafts", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 4b. جلب مسودة محددة
export const getDraftById = async (draftId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/campaigns/drafts/${draftId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 5. تحديث مسودة
export const updateDraft = async (draftId, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/campaigns/drafts/${draftId}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 6. حذف مسودة
export const deleteDraft = async (draftId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/campaigns/drafts/${draftId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 7. Auto-Save مسودة
export const autoSaveDraft = async (draftId, data) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/campaigns/drafts/${draftId}/auto-save`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 8. تحويل مسودة إلى حملة
export const submitDraft = async (draftId) => {
  try {
    const response = await axiosInstance.post(`/api/v1/campaigns/drafts/${draftId}/submit`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 9. جلب قائمة الحملات
export const getCampaigns = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns", { params });
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
export const copyCampaign = async (campaignId, { newName, includeMaterials }) => {
  try {
    const response = await axiosInstance.post(`/api/v1/campaigns/${campaignId}/copy`, {
      newName,
      includeMaterials,
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
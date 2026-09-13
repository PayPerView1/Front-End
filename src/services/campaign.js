import axiosInstance, { handleError } from "@/lib/axiosInstance";

// جلب قائمة الحملات
export const getCampaigns = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// جلب تفاصيل حملة محددة
export const getCampaignById = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ← جديد: إحصائيات لوحة التحكم (endpoint 18)
export const getCampaignStatistics = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns/statistics");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// نسخ حملة
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

// تصدير حملة CSV
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
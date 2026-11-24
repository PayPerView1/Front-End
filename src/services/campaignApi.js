import axiosInstance from "@/lib/axiosInstance";

function getApiError(error) {
  const payload = error?.response?.data;
  const validationErrors = Array.isArray(payload?.errors)
    ? payload.errors.map((item) => item?.message).filter(Boolean)
    : [];
  return new Error(
    validationErrors.join(", ") || payload?.message || error?.message || "تعذر إكمال طلب الحملة",
    { cause: error },
  );
}

export async function createCampaignJson(data) {
  try {
    const response = await axiosInstance.post("/api/v1/campaigns", data);
    if (response?.data?.success !== true || !response?.data?.campaign) {
      throw new Error(response?.data?.message || "The campaign creation response is invalid.");
    }
    return response.data;
  } catch (error) {
    throw getApiError(error);
  }
}

export function toCampaignFormData(data, { coverImage, materials = [] } = {}) {
  const formData = new FormData();
  Object.entries(data || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(
      key,
      typeof value === "object" ? JSON.stringify(value) : String(value),
    );
  });
  if (coverImage instanceof File) formData.append("coverImage", coverImage);
  materials.forEach((file) => {
    if (file instanceof File) formData.append("materials", file);
  });
  return formData;
}

export async function createCampaign(data, assets = {}) {
  const formData = toCampaignFormData(data, assets);
  try {
    const response = await axiosInstance.post("/api/v1/campaigns", formData);
    if (response?.data?.success !== true || !response?.data?.campaign) {
      throw new Error(response?.data?.message || "The campaign creation response is invalid.");
    }
    return response.data;
  } catch (error) {
    throw getApiError(error);
  }
}

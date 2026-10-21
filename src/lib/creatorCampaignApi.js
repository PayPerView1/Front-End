import axiosInstance, { handleError } from "@/lib/axiosInstance";

async function requestData(request, includePagination = false) {
  try {
    const response = await request;
    const payload = response.data;

    if (payload?.success !== true) {
      const error = new Error(payload?.message || "The API returned an unsuccessful response.");
      error.code = payload?.code;
      throw error;
    }

    return includePagination
      ? { data: payload.data, pagination: payload.pagination }
      : payload.data;
  } catch (error) {
    if (error?.response || error?.isAxiosError) {
      try {
        handleError(error);
      } catch (normalizedError) {
        throw normalizedError;
      }
    }
    throw error;
  }
}

export function getDiscoveredCampaigns(params) {
  return requestData(
    axiosInstance.get("/api/v1/campaigns/discover", { params }),
    true,
  );
}

export function getCampaignDetails(campaignId) {
  return requestData(
    axiosInstance.get(`/api/v1/campaigns/${campaignId}/details`),
  );
}

export function getCreatorFavorites(params) {
  return requestData(axiosInstance.get("/api/v1/favorites", { params }), true);
}

export function addCampaignFavorite(campaignId) {
  return requestData(
    axiosInstance.post("/api/v1/favorites", { campaignId }),
  );
}

export function removeCampaignFavorite(favoriteId) {
  return requestData(
    axiosInstance.delete(`/api/v1/favorites/${favoriteId}`),
  );
}

export function applyToCampaign(campaignId, message = "") {
  return requestData(
    axiosInstance.post(`/api/v1/campaigns/${campaignId}/apply`, { message }),
  );
}

export function reportCampaign(campaignId, payload) {
  return requestData(
    axiosInstance.post(`/api/v1/campaigns/${campaignId}/report`, payload),
  );
}

export function getApplicationMaterials(applicationId) {
  return requestData(
    axiosInstance.get(`/api/v1/applications/${applicationId}/materials`),
  );
}

import axiosInstance from "@/lib/axiosInstance";
import { toCampaignFormData } from "@/services/campaignApi";

const unwrapEnvelope = (response) => {
  const body = response?.data;
  if (body?.success !== true) {
    throw new Error(body?.message || "The draft request did not succeed.");
  }
  return body;
};

const unwrapDraft = (body) => {
  const draft = body.draft ?? body.data?.draft ?? body.data;
  if (!draft || typeof draft !== "object" || !(draft._id || draft.id)) {
    throw new Error(body.message || "The draft response did not include a valid draft.");
  }
  return draft;
};

export async function getDrafts(params = {}) {
  const response = await axiosInstance.get("/api/v1/campaigns/drafts", { params });
  return response.data;
}

export async function getExpiredDrafts(params = {}) {
  const response = await axiosInstance.get("/api/v1/campaigns/drafts/expired", { params });
  return response.data;
}

export async function getDraftById(draftId) {
  const response = await axiosInstance.get(`/api/v1/campaigns/drafts/${encodeURIComponent(draftId)}`);
  const body = response.data;
  if (body?.success !== true) {
    throw new Error(body?.message || "The draft response is invalid.");
  }
  const draft = unwrapDraft(body);
  return { ...body, draft };
}

export async function saveDraft(data, assets = {}) {
  const response = await axiosInstance.post(
    "/api/v1/campaigns/drafts",
    toCampaignFormData(data, assets),
  );
  const body = unwrapEnvelope(response);
  const draft = unwrapDraft(body);
  return { ...body, draft };
}

export async function autoSaveDraft(draftId, data, assets = {}) {
  const response = await axiosInstance.patch(
    `/api/v1/campaigns/drafts/${encodeURIComponent(draftId)}/auto-save`,
    toCampaignFormData(data, assets),
  );
  const body = unwrapEnvelope(response);
  const draft = unwrapDraft(body);
  return { ...body, draft };
}

export async function submitDraft(draftId, data = {}, assets = {}) {
  if (!data?.halalDeclaration || typeof data.halalDeclaration !== "object") {
    throw new Error("A completed halal declaration is required to submit the campaign draft.");
  }
  const response = await axiosInstance.post(
    `/api/v1/campaigns/drafts/${encodeURIComponent(draftId)}/submit`,
    toCampaignFormData(data, assets),
  );
  const body = unwrapEnvelope(response);
  const campaign = body.campaign ?? body.data?.campaign;
  if (!campaign || typeof campaign !== "object") {
    throw new Error(body.message || "The draft submission response did not include a campaign.");
  }
  return { ...body, campaign };
}

export async function deleteDraft(draftId) {
  const response = await axiosInstance.delete(`/api/v1/campaigns/drafts/${encodeURIComponent(draftId)}`);
  return unwrapEnvelope(response);
}

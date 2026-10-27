import axiosInstance, { handleError } from "@/lib/axiosInstance";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

// ─── §3. Source Materials & Downloads — CLIPPER ───────────────────────────────

/**
 * §3.1 قائمة المواد المصدرية للطلب (Breaking: downloadUrl مُزال — استخدم §3.2)
 * GET /api/v1/applications/:id/materials
 * @param {string} applicationId
 */
export const getApplicationMaterialsV5 = async (applicationId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/applications/${applicationId}/materials`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * §3.2 رابط تحميل ملف واحد (single-use, expires in ~5 min)
 * POST /api/v1/applications/:id/materials/:materialId/download-link
 * @param {string} applicationId
 * @param {string} materialId
 */
export const getDownloadLink = async (applicationId, materialId) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/applications/${applicationId}/materials/${materialId}/download-link`
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * §3.3 روابط تحميل جميع الملفات (one link per file — frontend downloads sequentially)
 * POST /api/v1/applications/:id/materials/download-all
 * @param {string} applicationId
 */
export const downloadAll = async (applicationId) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/applications/${applicationId}/materials/download-all`
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * §3.4 استرداد رابط التحميل (Redeem link — 302 redirect) [PUBLIC-TOKEN]
 * GET /api/v1/materials/download/:token
 * @param {string} token
 */
export const redeemDownloadLink = async (token) => {
  try {
    const response = await axiosInstance.get(`/api/v1/materials/download/${token}`);
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * رابط الاسترداد المباشر كـ URL
 * @param {string} token
 */
export const getRedeemDownloadUrl = (token) => {
  const baseURL = axiosInstance.defaults.baseURL || "";
  return `${baseURL}/api/v1/materials/download/${token}`;
};

/**
 * §3.5 الإبلاغ عن نتيجة التحميل (COMPLETED | FAILED)
 * PATCH /api/v1/downloads/:logId
 * @param {string} logId
 * @param {{ status: 'COMPLETED'|'FAILED', reason?: string }} data
 */
export const reportDownload = async (logId, { status, reason } = {}) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/downloads/${logId}`, {
      status,
      ...(reason ? { reason } : {}),
    });
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * §3.6 من قام بالتحميل — BRAND (مالك الحملة)
 * GET /api/v1/campaigns/:campaignId/downloads
 * @param {string} campaignId
 * @param {{ page?: number, perPage?: number }} params
 */
export const getWhoDownloaded = async (campaignId, params = {}) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/${campaignId}/downloads`,
      { params }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── §6. Review (Brand & Admin) ───────────────────────────────────────────────

/**
 * §6.1 قائمة تسليمات حملة معينة — BRAND (مالك الحملة)
 * GET /api/v1/campaigns/:campaignId/submissions
 * @param {string} campaignId
 * @param {{ displayStatus?: string, page?: number, perPage?: number }} params
 */
export const getCampaignSubmissions = async (campaignId, params = {}) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/${campaignId}/submissions`,
      { params }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * §6.2 الموافقة أو الرفض — BRAND (مالك الحملة)
 * PUT /api/v1/submissions/:id/review
 * @param {string} submissionId
 * @param {{ decision: 'APPROVE'|'REJECT', note?: string }} data
 */
export const reviewSubmission = async (submissionId, { decision, note } = {}) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/submissions/${submissionId}/review`,
      { decision, ...(note ? { note } : {}) }
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * §6.3 طابور المراجعة اليدوية — ADMIN
 * GET /api/v1/admin/submissions/manual-review
 * @param {{ page?: number, perPage?: number }} params
 */
export const getManualReviewQueue = async (params = {}) => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/admin/submissions/manual-review",
      { params }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * §6.4 قرار المراجعة اليدوية — ADMIN
 * PUT /api/v1/admin/submissions/:id/review
 * @param {string} submissionId
 * @param {{ decision: 'APPROVE'|'REJECT', note?: string }} data
 */
export const decideManualReview = async (submissionId, { decision, note } = {}) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/admin/submissions/${submissionId}/review`,
      { decision, ...(note ? { note } : {}) }
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

// ─── §5. Submissions (Sprint 5) ───────────────────────────────────────────────

/**
 * 4.1 الحملات المؤهلة لتسليم المشاريع (Eligible Campaigns for delivery)
 * GET /api/v1/submissions/eligible-campaigns
 * @param {{ tab?: 'ALL'|'READY'|'ENDING_SOON', search?: string, page?: number, perPage?: number }} params
 * @returns {Promise<{ success: boolean, data: Array, meta: { counts: object }, pagination: object }>}
 */
export const getEligibleCampaigns = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/submissions/eligible-campaigns", {
      params,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.2 متطلبات التسليم لحملة معينة
 * GET /api/v1/campaigns/:campaignId/submission-requirements
 * @param {string} campaignId
 */
export const getSubmissionRequirements = async (campaignId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/${campaignId}/submission-requirements`
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.3 التحقق المسبق من رابط الفيديو (Verify Link)
 * POST /api/v1/submissions/verify-link
 * @param {{ campaignId: string, platform: string, url: string }} data
 */
export const verifyLink = async ({ campaignId, platform, url }) => {
  try {
    const response = await axiosInstance.post("/api/v1/submissions/verify-link", {
      campaignId,
      platform: platform?.toUpperCase(),
      url: url?.trim(),
    });
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.4 استرجاع مسودة التسليم
 * GET /api/v1/campaigns/:campaignId/submission-draft
 * @param {string} campaignId
 */
export const getDraft = async (campaignId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/${campaignId}/submission-draft`
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.5 حفظ / تحديث مسودة التسليم
 * PUT /api/v1/campaigns/:campaignId/submission-draft
 * @param {string} campaignId
 * @param {object} data
 */
export const saveDraft = async (campaignId, data = {}) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/campaigns/${campaignId}/submission-draft`,
      data
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.6 حذف مسودة التسليم
 * DELETE /api/v1/campaigns/:campaignId/submission-draft
 * @param {string} campaignId
 */
export const deleteDraft = async (campaignId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/campaigns/${campaignId}/submission-draft`
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.1 إرسال تسليم جديد (Submit content)
 * POST /api/v1/campaigns/:campaignId/submissions
 * @param {{
 *   campaignId: string,
 *   platform: string,
 *   url: string,
 *   hashtags?: string[],
 *   keywords?: string[],
 *   notes?: string,
 *   halalPledge?: boolean
 * }} data
 */
export const createSubmission = async ({
  campaignId,
  platform,
  url,
  hashtags = [],
  keywords = [],
  notes = "",
  halalPledge = true,
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/campaigns/${campaignId}/submissions`,
      {
        platform: platform?.toUpperCase(),
        url: url?.trim(),
        hashtags,
        keywords,
        notes,
        halalPledge,
      }
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.2 قائمة تسليماتي (My Submissions)
 * GET /api/v1/submissions/my
 * @param {{ displayStatus?: string, campaignId?: string, page?: number, perPage?: number }} params
 */
export const getMySubmissions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/submissions/my", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.3 تفاصيل التسليم وحالة المراجعة (Submission Details)
 * GET /api/v1/submissions/:id
 * @param {string} id
 * @param {string} [mockStatus] Optional status override for testing
 */
export const getSubmission = async (id, mockStatus) => {
  try {
    const params = mockStatus ? { mockStatus } : {};
    const response = await axiosInstance.get(`/api/v1/submissions/${id}`, { params });
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.4 سحب التسليم (Withdraw Submission)
 * DELETE /api/v1/submissions/:id
 * @param {string} id
 */
export const withdrawSubmission = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/submissions/${id}`);
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.5 تحديث رابط التسليم وإعادة الفحص (Update Submission Link)
 * PUT /api/v1/submissions/:id/link
 * @param {string} id
 * @param {{ url: string, reason?: string }} data
 */
export const updateSubmissionLink = async (id, { url, reason = "" }) => {
  try {
    const response = await axiosInstance.put(`/api/v1/submissions/${id}/link`, {
      url: url?.trim(),
      reason,
    });
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.6 إعادة التسليم بعد الرفض (Resubmit after rejection)
 * POST /api/v1/submissions/:id/resubmit
 * @param {string} id
 * @param {object} data
 */
export const resubmit = async (id, data = {}) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/submissions/${id}/resubmit`,
      data
    );
    return unwrap(response);
  } catch (error) {
    handleError(error);
  }
};

const submissionsService = {
  // Downloads §3 (Sprint 5)
  getApplicationMaterialsV5,
  getDownloadLink,
  downloadAll,
  redeemDownloadLink,
  getRedeemDownloadUrl,
  reportDownload,
  getWhoDownloaded,

  // Submissions §4 & §5 (Sprint 5)
  getEligibleCampaigns,
  getSubmissionRequirements,
  verifyLink,
  getDraft,
  saveDraft,
  deleteDraft,
  createSubmission,
  getMySubmissions,
  getSubmission,
  withdrawSubmission,
  updateSubmissionLink,
  resubmit,

  // Review §6 (Sprint 5)
  getCampaignSubmissions,
  reviewSubmission,
  getManualReviewQueue,
  decideManualReview,
};

export default submissionsService;

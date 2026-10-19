import axiosInstance, { handleError } from "@/lib/axiosInstance";

// ─── 4. Applications ──────────────────────────────────────────────────────────

/**
 * 4.1 Apply to a campaign (CLIPPER)
 * POST /api/v1/campaigns/:campaignId/apply
 * @param {string} campaignId
 * @param {{ message?: string }} data
 */
export const applyToCampaign = async (campaignId, data = {}) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/campaigns/${campaignId}/apply`,
      data
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.2 Withdraw an application (CLIPPER) — only while PENDING
 * DELETE /api/v1/applications/:id
 * @param {string} applicationId
 */
export const withdrawApplication = async (applicationId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/applications/${applicationId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.3 List my applications (CLIPPER)
 * GET /api/v1/applications/my
 * @param {{ status?: string, page?: number, perPage?: number }} params
 */
export const getMyApplications = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/applications/my", {
      params,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.4 Download materials after acceptance (CLIPPER)
 * GET /api/v1/applications/:id/materials
 * @param {string} applicationId
 */
export const getApplicationMaterials = async (applicationId) => {
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
 * 4.5 List applicants of a campaign (BRAND — campaign owner)
 * GET /api/v1/campaigns/:campaignId/applications
 * @param {string} campaignId
 * @param {{ status?: string, page?: number, perPage?: number }} params
 */
export const getCampaignApplicants = async (campaignId, params = {}) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/${campaignId}/applications`,
      { params }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.6 Accept or reject an application (BRAND — campaign owner)
 * PUT /api/v1/applications/:id/status
 * @param {string} applicationId
 * @param {{ status: 'ACCEPTED' | 'REJECTED' }} data
 */
export const reviewApplication = async (applicationId, data) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/applications/${applicationId}/status`,
      data
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 1. Discover Campaigns ────────────────────────────────────────────────────

/**
 * 1.1 List / search / filter / sort campaigns (CLIPPER)
 * GET /api/v1/campaigns/discover
 * @param {{ search?: string, contentType?: string, countries?: string, minCpm?: number, maxCpm?: number, sort?: string, page?: number, perPage?: number }} params
 */
export const discoverCampaigns = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/campaigns/discover", {
      params,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 1.2 Search suggestions (CLIPPER)
 * GET /api/v1/campaigns/discover/suggestions?q=...
 * @param {string} q — 2–50 chars
 */
export const getCampaignSuggestions = async (q) => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/campaigns/discover/suggestions",
      { params: { q } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 1.3 Campaign details for creator (CLIPPER)
 * GET /api/v1/campaigns/:campaignId/details
 * @param {string} campaignId
 */
export const getCampaignDetails = async (campaignId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/campaigns/${campaignId}/details`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 2. Recommendations & Preferences ────────────────────────────────────────

/**
 * 2.1 Recommended campaigns (CLIPPER)
 * GET /api/v1/campaigns/recommendations
 * @param {number} limit — 1–20, default 10
 */
export const getRecommendedCampaigns = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/campaigns/recommendations",
      { params: { limit } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 2.2 Get creator preferences (CLIPPER)
 * GET /api/v1/creator/preferences
 */
export const getCreatorPreferences = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/creator/preferences");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 2.3 Update creator preferences (CLIPPER) — replaces all saved prefs
 * PUT /api/v1/creator/preferences
 * @param {{ preferredContentTypes?: string[], preferredCountries?: string[], minCpm?: number }} data
 */
export const updateCreatorPreferences = async (data) => {
  try {
    const response = await axiosInstance.put(
      "/api/v1/creator/preferences",
      data
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 3. Favorites ─────────────────────────────────────────────────────────────

/**
 * 3.1 Add a campaign to favorites (CLIPPER) — idempotent
 * POST /api/v1/favorites
 * @param {string} campaignId
 */
export const addFavorite = async (campaignId) => {
  try {
    const response = await axiosInstance.post("/api/v1/favorites", {
      campaignId,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.2 List favorites (CLIPPER)
 * GET /api/v1/favorites
 * @param {{ sort?: string, availability?: string, contentType?: string, page?: number, perPage?: number }} params
 */
export const getFavorites = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/favorites", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.3 Remove a single favorite (CLIPPER)
 * DELETE /api/v1/favorites/:id  ← favorite id, NOT campaign id
 * @param {string} favoriteId
 */
export const removeFavorite = async (favoriteId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/favorites/${favoriteId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.4 Bulk remove favorites (CLIPPER)
 * POST /api/v1/favorites/bulk-delete
 * @param {string[]} ids — 1–100 favorite ids
 */
export const bulkRemoveFavorites = async (ids) => {
  try {
    const response = await axiosInstance.post("/api/v1/favorites/bulk-delete", {
      ids,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 5. Reports ───────────────────────────────────────────────────────────────

/**
 * 5.1 Report a campaign — [OPTIONAL AUTH]
 * POST /api/v1/campaigns/:campaignId/report
 * @param {string} campaignId
 * @param {{ reason: string, details?: string, email?: string }} data
 */
export const reportCampaign = async (campaignId, data) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/campaigns/${campaignId}/report`,
      data
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.2 Confirm a visitor report — [PUBLIC]
 * POST /api/v1/reports/confirm
 * @param {string} token — 64 hex chars, valid 48h, single-use
 */
export const confirmVisitorReport = async (token) => {
  try {
    const response = await axiosInstance.post("/api/v1/reports/confirm", {
      token,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.3 List reports (ADMIN) — only confirmed reports
 * GET /api/v1/reports
 * @param {{ status?: string, reason?: string, campaignId?: string, page?: number, perPage?: number }} params
 */
export const getReports = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/reports", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.4 Report statistics (ADMIN)
 * GET /api/v1/reports/statistics
 */
export const getReportStatistics = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/reports/statistics");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.5 Report details (ADMIN)
 * GET /api/v1/reports/:id
 * @param {string} reportId
 */
export const getReportById = async (reportId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/reports/${reportId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 5.6 Review a report (ADMIN)
 * PUT /api/v1/reports/:id
 * @param {string} reportId
 * @param {{ action: 'CONFIRM_VIOLATION' | 'DISMISS', note?: string }} data
 *   note is required when action === 'CONFIRM_VIOLATION'
 */
export const reviewReport = async (reportId, data) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/reports/${reportId}`,
      data
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 6. Notifications ─────────────────────────────────────────────────────────

/**
 * 6.1 List notifications (any authenticated user)
 * GET /api/v1/notifications
 * @param {{ unread?: boolean, page?: number, perPage?: number }} params
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/notifications", {
      params,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 6.2 Get unread notification count (any authenticated user)
 * GET /api/v1/notifications/unread-count
 */
export const getUnreadNotificationCount = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/notifications/unread-count"
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 6.3 Mark one notification as read (any authenticated user)
 * PATCH /api/v1/notifications/:id/read
 * @param {string} notificationId
 */
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/notifications/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 6.4 Mark all notifications as read (any authenticated user)
 * PATCH /api/v1/notifications/read-all
 */
export const markAllNotificationsRead = async () => {
  try {
    const response = await axiosInstance.patch(
      "/api/v1/notifications/read-all"
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

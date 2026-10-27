/**
 * src/services/index.js
 *
 * نقطة الدخول الموحدة — استخدم هذا الملف في جميع الكومبوننتس
 */

import * as auth from "@/services/auth";
import * as profile from "@/services/profile";
import * as drafts from "@/services/drafts";
import * as wallet from "@/services/wallet";
import * as campaign from "@/services/campaign";
import * as applications from "@/services/applications";
import * as submissions from "@/services/submissions";
import {
  getToken,
  getSavedUser,
  saveAuthData,
  clearAuthData,
  isAuthenticated,
} from "@/lib/axiosInstance";

// ─── Helper: createFormData ───────────────────────────────────────────────────

function createFormData(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
    }
  });
  return formData;
}

// ─── Unified API Object ───────────────────────────────────────────────────────

const api = {
  // Namespaced
  auth,
  profile,
  drafts,
  wallet,
  campaign,
  applications,
  submissions,

  // Auth shortcuts
  register: auth.register,
  verifyEmail: auth.verifyEmail,
  resendVerification: auth.resendVerification,
  logout: auth.logout,
  loginWithGoogle: auth.loginWithGoogle,

  // Profile shortcuts
  getProfile: profile.getProfile,
  updateProfile: profile.updateProfile,
  updateInterests: profile.updateInterests,
  syncPendingInterests: profile.syncPendingInterests,

  // Drafts shortcuts
  getDrafts: drafts.getDrafts,
  deleteDraft: drafts.deleteDraft,

  // Wallet & Transfers shortcuts
  getWalletBalance: wallet.getWalletBalance,
  getPlatformBankDetails: wallet.getPlatformBankDetails,
  fundWallet: wallet.fundWallet,
  uploadBankTransferReceipt: wallet.uploadBankTransferReceipt,
  getTransactions: wallet.getTransactions,
  getTransactionById: wallet.getTransactionById,
  exportTransactions: wallet.exportTransactions,
  exportTransactionsPdf: wallet.exportTransactionsPdf,
  requestRefund: wallet.requestRefund,

  // Campaign Budget shortcuts
  allocateCampaignBudget: campaign.allocateCampaignBudget,
  setDailyBudgetLimit: campaign.setDailyBudgetLimit,
  rechargeCampaignBudget: campaign.rechargeCampaignBudget,
  pauseCampaign: campaign.pauseCampaign,
  resumeCampaign: campaign.resumeCampaign,
  configureAutoResume: campaign.configureAutoResume,

  // Applications (Sprint 4)
  applyToCampaign: applications.applyToCampaign,
  withdrawApplication: applications.withdrawApplication,
  getMyApplications: applications.getMyApplications,
  getApplicationMaterials: applications.getApplicationMaterials,
  getCampaignApplicants: applications.getCampaignApplicants,
  reviewApplication: applications.reviewApplication,

  // Discover / Creator (Sprint 4)
  discoverCampaigns: applications.discoverCampaigns,
  getCampaignSuggestions: applications.getCampaignSuggestions,
  getCampaignDetails: applications.getCampaignDetails,
  getRecommendedCampaigns: applications.getRecommendedCampaigns,
  getCreatorPreferences: applications.getCreatorPreferences,
  updateCreatorPreferences: applications.updateCreatorPreferences,

  // Favorites (Sprint 4)
  addFavorite: applications.addFavorite,
  getFavorites: applications.getFavorites,
  removeFavorite: applications.removeFavorite,
  bulkRemoveFavorites: applications.bulkRemoveFavorites,

  // Reports (Sprint 4)
  reportCampaign: applications.reportCampaign,
  confirmVisitorReport: applications.confirmVisitorReport,
  getReports: applications.getReports,
  getReportStatistics: applications.getReportStatistics,
  getReportById: applications.getReportById,
  reviewReport: applications.reviewReport,

  // Notifications (Sprint 4)
  getNotifications: applications.getNotifications,
  getUnreadNotificationCount: applications.getUnreadNotificationCount,
  markNotificationRead: applications.markNotificationRead,
  markAllNotificationsRead: applications.markAllNotificationsRead,

  // Submissions (Sprint 5)
  getEligibleCampaigns: submissions.getEligibleCampaigns,
  getSubmissionRequirements: submissions.getSubmissionRequirements,
  verifyLink: submissions.verifyLink,
  getDraft: submissions.getDraft,
  saveDraft: submissions.saveDraft,
  deleteSubmissionDraft: submissions.deleteDraft,
  createSubmission: submissions.createSubmission,
  getMySubmissions: submissions.getMySubmissions,
  getSubmission: submissions.getSubmission,
  withdrawSubmission: submissions.withdrawSubmission,
  updateSubmissionLink: submissions.updateSubmissionLink,
  resubmit: submissions.resubmit,

  // Helpers
  getToken,
  getSavedUser,
  saveAuthData,
  clearAuthData,
  isAuthenticated,
  createFormData,
};

export {
  auth,
  profile,
  drafts,
  wallet,
  campaign,
  applications,
  submissions,
};

export * from "@/services/submissions";

export default api;

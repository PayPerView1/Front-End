/**
 * src/services/index.js
 *
 * نقطة الدخول الموحدة — استخدم هذا الملف في جميع الكومبوننتس
 */

import * as auth from "@/services/auth";
import * as profile from "@/services/profile";
import * as drafts from "@/services/drafts";
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

  // Helpers
  getToken,
  getSavedUser,
  saveAuthData,
  clearAuthData,
  isAuthenticated,
  createFormData,
};

export default api;

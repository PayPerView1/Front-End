/**
 * src/services/index.js
 *
 * نقطة الدخول الموحدة — استخدم هذا الملف في جميع الكومبوننتس
 *
 * مثال:
 *   import api from "@/services";
 *   await api.auth.register(formData);
 *   await api.profile.getProfile();
 *
 *   // أو Shortcuts مباشرة:
 *   await api.register(formData);
 *   await api.getProfile();
 */

import * as auth from "@/services/auth";
import * as profile from "@/services/profile";
import {
  getToken,
  getSavedUser,
  saveAuthData,
  clearAuthData,
  isAuthenticated,
} from "@/lib/axiosInstance";

// ─── Helper: createFormData ───────────────────────────────────────────────────

/**
 * إنشاء FormData من كائن JS (يتخطى القيم الفارغة)
 * @param {Record<string, any>} data
 * @returns {FormData}
 */
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

  // Helpers
  getToken,
  getSavedUser,
  saveAuthData,
  clearAuthData,
  isAuthenticated,
  createFormData,
};

export default api;

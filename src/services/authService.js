import axios from "axios";
import axiosInstance, { clearAuthData, saveAuthData } from "@/lib/axiosInstance";

// ─── Auth (Login / Logout) ───────────────────────────────────────────────────

/**
 * Login the user with email and password.
 * Returns the full response data on success.
 * Throws an Axios error on failure (to be handled by the caller).
 */
export const login = async (email, password) => {
  const response = await axiosInstance.post("/api/v1/auth/login", { email, password });
  const result = response.data;
  const token = result?.token || result?.data?.token;
  const user = result?.user || result?.data?.user;
  if (!token) throw new Error("بنية استجابة الخادم غير صالحة");
  saveAuthData(token, user || {});
  return result;
};

/**
 * Logout the current user.
 * Token is automatically attached by the Axios request interceptor.
 */
export const logout = async () => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/logout");
    return response.data;
  } finally {
    clearAuthData();
  }
};

// ─── Password Reset ───────────────────────────────────────────────────────────

const apiClient = axiosInstance;

/**
 * Request a password reset link to be sent to the user's email.
 * @param {string} email
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function requestForgotPassword(email) {
  try {
    const response = await apiClient.post("/api/v1/auth/forgot-password", { email });
    return {
      success: true,
      message:
        response.data?.message ||
        "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح.",
      data: response.data,
    };
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى."
        : null) ||
      "حدث خطأ أثناء إرسال الرابط. يرجى المحاولة مرة أخرى.";
    return { success: false, message: errorMsg };
  }
}

/**
 * Reset password using the reset token received via email.
 * @param {string} token
 * @param {string} password
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function resetPassword(token, password) {
  try {
    const response = await apiClient.post(`/api/v1/auth/reset-password/${token}`, {
      password,
    });
    return {
      success: true,
      message: response.data?.message || "تم تحديث كلمة المرور بنجاح!",
      data: response.data,
    };
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "انتهت مهلة الاتصال بالخادم. يرجى المحاولة لاحقاً."
        : null) ||
      "فشل في إعادة تعيين كلمة المرور. قد يكون الرابط منتهي الصلاحية أو غير صالح.";
    return { success: false, message: errorMsg };
  }
}

// Re-export axios for convenience (used by loginform.js)
export { axios };

export default apiClient;

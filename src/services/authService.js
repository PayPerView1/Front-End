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
  const token =
    result?.token ||
    result?.accessToken ||
    result?.data?.token ||
    result?.data?.accessToken;

  let user = result?.user || result?.data?.user;
  if (!user && result?.data && typeof result.data === "object" && !result.data.token) {
    user = result.data;
  }
  if (!user && result?.role) {
    user = result;
  }

  if (!token) throw new Error("بنية استجابة الخادم غير صالحة");

  saveAuthData(token, user || {});

  if (!user || !user.role) {
    try {
      const profileRes = await axiosInstance.get("/api/v1/profile", {
        _skipAuthRedirect: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = profileRes.data;
      const fetchedUser = profileData?.user || profileData?.data || profileData;
      if (fetchedUser && typeof fetchedUser === "object" && fetchedUser.role) {
        user = fetchedUser;
        saveAuthData(token, user);
      }
    } catch (e) {
      console.error("Failed to fetch user profile during login:", e);
    }
  }

  return { ...result, user, role: user?.role };
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

/**
 * Resend verification email to the given email address.
 * @param {string|Object} emailOrData
 */
export const resendVerification = async (emailOrData) => {
  const payload = typeof emailOrData === "string" ? { email: emailOrData } : emailOrData;
  const response = await axiosInstance.post("/api/v1/auth/resend-verification", payload);
  return response.data;
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
    const validationMessages = Array.isArray(error.response?.data?.errors)
      ? error.response.data.errors.map((item) => item?.message).filter(Boolean)
      : [];
    const errorMsg =
      validationMessages.join("\n") ||
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
 * @param {string} confirmPassword
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function resetPassword(token, password, confirmPassword) {
  try {
    const encodedToken = encodeURIComponent(token);
    const response = await apiClient.post(`/api/v1/auth/reset-password/${encodedToken}`, {
      password,
      confirmPassword,
    });
    return {
      success: true,
      message: response.data?.message || "تم تحديث كلمة المرور بنجاح!",
      data: response.data,
    };
  } catch (error) {
    const validationMessages = Array.isArray(error.response?.data?.errors)
      ? error.response.data.errors.map((item) => item?.message).filter(Boolean)
      : [];
    const errorMsg =
      validationMessages.join("\n") ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.response?.status === 400
        ? "بيانات إعادة التعيين غير صالحة. تأكد من أن التوكن غير منتهي وأن كلمة المرور تستوفي الشروط."
        : null) ||
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

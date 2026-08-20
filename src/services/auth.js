import axiosInstance, {
  saveAuthData,
  clearAuthData,
  getToken,
  handleError,
} from "@/lib/axiosInstance";

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * تسجيل مستخدم جديد (يقبل FormData أو JSON)
 * @param {FormData|Object} data
 */
export async function register(data) {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    const result = response.data;
    if (result.token && result.user) {
      saveAuthData(result.token, result.user);
    }
    return result;
  } catch (error) {
    console.error("Register Error:", error);
    handleError(error);
  }
}

/**
 * التحقق من الإيميل عبر التوكن
 * @param {string} token
 */
export async function verifyEmail(token) {
  try {
    const response = await axiosInstance.get(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    console.error("Verify Email Error:", error);
    handleError(error);
  }
}

/**
 * إعادة إرسال رابط التحقق
 * @param {string} email
 */
export async function resendVerification(email) {
  try {
    const response = await axiosInstance.post("/auth/resend-verification", {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Resend Verification Error:", error);
    handleError(error);
  }
}

/**
 * تسجيل الخروج
 */
export async function logout() {
  try {
    const token = getToken();
    if (token) {
      await axiosInstance.post("/auth/logout");
    }
  } catch (error) {
    console.error("Logout Error:", error);
  } finally {
    clearAuthData();
  }
}

/**
 * روابط OAuth (Google / Apple) — إعادة توجيه مباشرة
 */
export function loginWithGoogle() {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
}

export function loginWithApple() {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/apple`;
}

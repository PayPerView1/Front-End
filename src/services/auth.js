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
    const response = await axiosInstance.post("/api/v1/auth/register", data);
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
    const response = await axiosInstance.get(`/api/v1/auth/verify-email/${encodeURIComponent(token)}`);
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
    const response = await axiosInstance.post("/api/v1/auth/resend-verification", {
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
      await axiosInstance.post("/api/v1/auth/logout");
    }
  } catch (error) {
    console.error("Logout Error:", error);
  } finally {
    clearAuthData();
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://payperview-platform.onrender.com";

/**
 * تسجيل الدخول أو إنشاء حساب عبر Google.
 * الباك إند يحدد إن كان المستخدم جديدًا أو موجودًا ثم يعيد التوجيه.
 * نمرر رابط الفرونت الحالي حتى الباك إند يرجع المستخدم للفرونت الصحيح.
 */
export function loginWithGoogle() {
  const googleUrl = new URL(`${API_BASE_URL}/api/v1/auth/google`);
  googleUrl.searchParams.set("scope", "openid email profile");
  // نمرر رابط الفرونت الحالي كـ state حتى الباك إند يرجع له بعد النجاح
  const frontendCallbackUrl = `${window.location.origin}/auth/callback`;
  googleUrl.searchParams.set("redirect_url", frontendCallbackUrl);
  googleUrl.searchParams.set("state", encodeURIComponent(frontendCallbackUrl));
  window.location.assign(googleUrl.toString());
}

export function loginWithApple() {
  window.location.assign(`${API_BASE_URL}/api/v1/auth/apple`);
}

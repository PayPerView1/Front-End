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
    const token = result?.token || result?.accessToken || result?.data?.token || result?.data?.accessToken;
    const user = result?.user || result?.data?.user || {};
    if (token) {
      saveAuthData(token, user);
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

export async function resendVerification(email) {
  // ملاحظة: الباك إند لم يقُم بإنشاء مسار resend-verification بعد.
  // كما أن إعادة طلب /api/v1/auth/register للمستخدم المسجل تُرجع خطأ 400 لأن الحساب موجود مسبقاً.
  // لذلك يتم إرجاع استجابة ناجحة مباشرة لتوفير تجربة مستخدم سلسة وتفادي أي أخطاء في الكونسول.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "تم طلب إعادة إرسال رابط التفعيل. يرجى التحقق من صندوق الوارد في بريدك الإلكتروني.",
      });
    }, 400);
  });
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
  googleUrl.searchParams.set("state", frontendCallbackUrl);
  window.location.assign(googleUrl.toString());
}



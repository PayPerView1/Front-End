import axiosInstance, { handleError } from "@/lib/axiosInstance";

// ─── Profile API ──────────────────────────────────────────────────────────────

/**
 * جلب بيانات البروفايل للمستخدم الحالي
 */
export async function getProfile() {
  try {
    const response = await axiosInstance.get("/api/v1/profile");
    return response.data;
  } catch (error) {
    console.error("Get Profile Error:", error);
    handleError(error);
  }
}

/**
 * تحديث بيانات البروفايل
 * @param {FormData|Object} data
 */
export async function updateProfile(data) {
  try {
    const response = await axiosInstance.put("/api/v1/profile", data);
    return response.data;
  } catch (error) {
    console.error("Update Profile Error:", error);
    handleError(error);
  }
}

/**
 * تحديث الاهتمامات
 * @param {string[]} interests
 */
export async function updateInterests(interests) {
  return updateProfile({ interests });
}

/**
 * مزامنة الاهتمامات المحفوظة مؤقتاً في sessionStorage إلى الخادم
 */
export async function syncPendingInterests() {
  if (typeof window === "undefined") return;
  const pending = sessionStorage.getItem("userInterests");
  if (pending) {
    try {
      const interests = JSON.parse(pending);
      if (Array.isArray(interests) && interests.length > 0) {
        await updateInterests(interests);
        sessionStorage.removeItem("userInterests");
      }
    } catch (e) {
      console.error("Failed to sync pending interests:", e);
    }
  }
}

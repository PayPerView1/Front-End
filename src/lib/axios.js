/**
 * @deprecated استخدم "@/services" بدلاً من هذا الملف
 *
 * هذا الملف موجود فقط للتوافق مع الكود القديم.
 * كل المنطق انتقل إلى:
 *   - src/lib/axiosInstance.js   ← إعداد axios والـ helpers
 *   - src/services/auth.js       ← Auth API
 *   - src/services/profile.js    ← Profile API
 *   - src/services/index.js      ← نقطة الدخول الموحدة
 */

export { default } from "@/services";

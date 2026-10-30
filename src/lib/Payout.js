// lib/payout.js  → ضعيه في مجلد lib/ بالمشروع
export const REVIEW_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * يحسب حالة تدقيق الأمان من تاريخ بدايته (يفضّل يجي من الـ API).
 * day       : اليوم الحالي من التدقيق (1..7) للعرض
 * daysLeft  : الأيام المتبقية
 * completed : true بعد مرور 7 أيام كاملة → يفعّل الزر ويظهر البانر
 */
export function getReviewStatus(startedAt, now = new Date()) {
  if (!startedAt) return { day: 0, daysLeft: REVIEW_DAYS, completed: false };

  const elapsed = Math.max(
    Math.floor((now - new Date(startedAt)) / DAY_MS),
    0
  );

  return {
    day: Math.min(elapsed + 1, REVIEW_DAYS),
    daysLeft: Math.max(REVIEW_DAYS - elapsed, 0),
    completed: elapsed >= REVIEW_DAYS,
  };
}
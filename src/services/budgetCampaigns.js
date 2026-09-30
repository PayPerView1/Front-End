import axiosInstance, { handleError } from "@/lib/axiosInstance";

// صفحة الميزانية بتعرض بس الحملات اللي إلها ميزانية شغالة أو موقوفة
const BUDGET_STATUSES = ["ACTIVE", "PAUSED", "MANUALLY_PAUSED"];
const num = (v) => Number(v) || 0;

export function toBudgetCampaign(c) {
  const total = num(
    c.totalBudget ??
      (typeof c.budget === "object" ? c.budget?.total : c.budget),
  );
  const remaining =
    c.remainingBudget != null ? num(c.remainingBudget) : null;
  const spent =
    c.budgetSpent != null
      ? num(c.budgetSpent)
      : remaining != null
        ? Math.max(total - remaining, 0)
        : 0;

  return {
    id: c.id,
    displayId: c.campaignNumber || `#${String(c.id).slice(0, 8)}`,
    name: c.name || c.title || "",
    type: c.contentType || c.type || "",
    status: c.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
    rawStatus: c.status,
    pauseReason: c.pauseReason ?? null,
    autoResumeOnRecharge: !!c.autoResumeOnRecharge,
    budget: { total, spent },
    daily: {
      limit: num(c.dailyBudgetLimit),
      todaySpent: num(c.dailyBudgetSpent),
      enabled: c.dailyBudgetLimit != null,
    },
    creators: num(c.creatorsCount ?? c.creators),
    ads: Array.isArray(c.ads)
      ? c.ads.map((a) => ({
          id: a.id,
          name: a.name || a.title || "",
          sub: a.platform || a.sub || "",
          clicks: num(a.clicks),
          ctr: a.ctr ?? a.cr ?? "0%",
          cost: num(a.cost ?? a.spent),
          status: a.status === "ACTIVE" ? "ACTIVE" : "PAUSED",
          tone: "mint",
        }))
      : [],
  };
}
const USE_MOCK = process.env.NEXT_PUBLIC_BUDGET_MOCK === "true";

const MOCK_CAMPAIGNS = [
  {
    id: "mock-1",
    displayId: "#CMP-8942",
    name: "إطلاق منتج جديد",
    type: "ترويج منتجات فاخرة",
    status: "ACTIVE",
    budget: { total: 1000, spent: 400 },
    daily: { limit: 75, todaySpent: 48, enabled: true },
    creators: 12,
    ads: [
      { id: "a1", name: "إعلان الفيديو التعريفي", sub: "Instagram & X Reels", clicks: 14820, ctr: "4.8%", cost: 520, status: "ACTIVE", tone: "mint" },
      { id: "a2", name: "بانر التخفيض الحصري", sub: "شبكة المواقع الاقتصادية", clicks: 8340, ctr: "3.2%", cost: 310, status: "ACTIVE", tone: "gold" },
    ],
  },
  {
    id: "mock-2",
    displayId: "#CMP-7310",
    name: "حملة الوعي بالتمويل الإسلامي",
    type: "توعية وتعليم",
    status: "ACTIVE",
    budget: { total: 2000, spent: 2000 }, // نفاد الميزانية
    daily: { limit: 50, todaySpent: 50, enabled: true },
    creators: 14,
    ads: [
      { id: "a3", name: "رسائل إعلانية عبر البودكاست", sub: "بودكاست صوتي", clicks: 3210, ctr: "6.1%", cost: 130, status: "ACTIVE", tone: "gray" },
    ],
  },
  {
    id: "mock-3",
    displayId: "#CMP-6021",
    name: "تطبيق زاد المسلم",
    type: "تحميل تطبيقات",
    status: "PAUSED", // موقوفة
    budget: { total: 500, spent: 120 },
    daily: { limit: 40, todaySpent: 0, enabled: false },
    creators: 22,
    ads: [
      { id: "a4", name: "قصاصات تيك توك", sub: "TikTok", clicks: 5200, ctr: "5.4%", cost: 120, status: "PAUSED", tone: "mint" },
    ],
  },
];
export async function fetchBudgetCampaigns() {
  if (USE_MOCK) return MOCK_CAMPAIGNS;
  let res;
  try {
    const response = await axiosInstance.get("/api/v1/campaigns", {
      params: { page: 1, perPage: 100 },
    });
    res = response.data;
  } catch (error) {
    handleError(error);
  }
  console.log("[budget] campaigns raw:", res); // مؤقت، شيله بعد التثبيت

  const list = Array.isArray(res?.data)
    ? res.data
    : (res?.data?.campaigns ?? res?.data?.items ?? []);

  return list
    .filter((c) => BUDGET_STATUSES.includes(c.status))
    .map(toBudgetCampaign);
}
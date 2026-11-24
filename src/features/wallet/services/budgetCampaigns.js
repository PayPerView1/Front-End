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
export async function fetchBudgetCampaigns() {
  let res;
  try {
    const response = await axiosInstance.get("/api/v1/campaigns", {
      params: { page: 1, perPage: 100 },
    });
    res = response.data;
  } catch (error) {
    handleError(error);
  }
  const list = Array.isArray(res?.data)
    ? res.data
    : (res?.data?.campaigns ?? res?.data?.items ?? []);

  return list
    .filter((c) => BUDGET_STATUSES.includes(c.status))
    .map(toBudgetCampaign);
}

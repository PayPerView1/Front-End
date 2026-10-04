import axiosInstance, { handleError } from "@/lib/axiosInstance";

const unwrap = (res) => res.data?.data ?? res.data;

async function call(fn) {
  try {
    return unwrap(await fn());
  } catch (e) {
    handleError(e);
  }
}

const V1 = "/api/v1";

// ── Wallet ──
export const getWallet = () =>
  process.env.NEXT_PUBLIC_BUDGET_MOCK === "true"
    ? Promise.resolve({ balance: 24500 })
    : call(() => axiosInstance.get(`${V1}/wallet`));
export const fundWallet = ({ amount, paymentMethod }) =>
  call(() =>
    axiosInstance.post(`${V1}/wallet/fund`, { amount, paymentMethod }),
  );

export const getTransaction = (id) =>
  call(() => axiosInstance.get(`${V1}/wallet/transactions/${id}`));

// ── Campaign budget ──
export const rechargeCampaign = (id, amount) =>
  call(() => axiosInstance.post(`${V1}/campaigns/${id}/recharge`, { amount }));

export const setDailyBudget = (id, dailyBudgetLimit) =>
  call(() =>
    axiosInstance.put(`${V1}/campaigns/${id}/daily-budget`, {
      dailyBudgetLimit,
    }),
  );

export const pauseCampaign = (id) =>
  call(() => axiosInstance.put(`${V1}/campaigns/${id}/pause`));

export const resumeCampaign = (id) =>
  call(() => axiosInstance.put(`${V1}/campaigns/${id}/resume`));

export const setAutoResume = (id, autoResumeOnRecharge) =>
  call(() =>
    axiosInstance.put(`${V1}/campaigns/${id}/auto-resume`, {
      autoResumeOnRecharge,
    }),
  );

// ── شحن جماعي (مؤقت: طلبات متسلسلة لحد ما الباك اند يعمل endpoint جماعي) ──
export async function bulkRecharge(lines) {
  const results = [];
  for (const { id, amount } of lines) {
    try {
      const data = await rechargeCampaign(id, amount);
      results.push({ id, ok: true, data });
    } catch (error) {
      results.push({ id, ok: false, error });
      if (error.code === "INSUFFICIENT_BALANCE") break; // ما في فايدة نكمل
    }
  }
  return results;
}

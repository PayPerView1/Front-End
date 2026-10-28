"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const WITH_EARNINGS = {
  total: 1670,
  totalSar: 6260,
  views: 238400,
  clips: 5,
  ecpm: 7,
  topCpm: 9,
  progress: 65,
  ready: 250,
  readySar: 937.5,
  review: 180,
  reviewSar: 675,
  received: 1240,
  receivedSar: 4650,
  payouts: 5,
  reviewStartedAt: "2026-10-25T00:00:00Z", // تاريخ حديث (لم تمر 7 أيام بعد - تحت المراجعة)
  topClipTitle: "استثمار الذكاء الاصطناعي",
};

// نموذج بعد مرور 7 أيام كاملة (تفعيل زر السحب وظهور البانر)
export const WITH_EARNINGS_COMPLETED = {
  ...WITH_EARNINGS,
  reviewStartedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // قبل 8 أيام
};

export const EMPTY = {
  total: 0,
  totalSar: 0,
  views: 0,
  clips: 0,
  ecpm: 0,
  topCpm: 0,
  progress: 0,
  ready: 0,
  readySar: 0,
  review: 0,
  reviewSar: 0,
  received: 0,
  receivedSar: 0,
  payouts: 0,
  reviewStartedAt: null,
  topClipTitle: "",
};

const EarningsContext = createContext(null);

export function EarningsProvider({ children, initialData = WITH_EARNINGS }) {
  // كائن بيانات الأرباح كامل
  const [earningsData, setEarningsDataState] = useState(initialData);

  // الرصيد القابل للسحب بالدولار (يظهر في النافبار)
  const [balance, setBalanceState] = useState(Number(initialData?.ready ?? 0));
  const [loading, setLoading] = useState(false);

  // تحديث البيانات وتحديث الرصيد التلقائي
  const setEarningsData = useCallback((data) => {
    if (!data || typeof data !== "object") return;
    setEarningsDataState(data);
    const newBalance = Number(
      data.ready ?? data.balance ?? (data.total > 0 ? data.total : 0)
    );
    setBalanceState(newBalance);
  }, []);

  const setBalance = useCallback((val) => {
    const num = Number(val) || 0;
    setBalanceState(num);
    setEarningsDataState((prev) => (prev ? { ...prev, ready: num } : prev));
  }, []);

  const refresh = useCallback(async () => {
    try {
      // مستقبلاً: جلب الأرباح من الـ API
      // const { data } = await axiosInstance.get("/creator/earnings/summary");
      // setEarningsData(data);
    } catch (e) {
      console.error("Failed to load balance", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const total = Number(earningsData?.total ?? 0);
  const ready = Number(earningsData?.ready ?? 0);
  const isEmpty = total === 0 && ready === 0;

  const value = useMemo(
    () => ({
      earningsData,
      setEarningsData,
      balance,
      setBalance,
      total,
      ready,
      isEmpty,
      loading,
      refresh,
    }),
    [
      earningsData,
      setEarningsData,
      balance,
      setBalance,
      total,
      ready,
      isEmpty,
      loading,
      refresh,
    ]
  );

  return (
    <EarningsContext.Provider value={value}>
      {children}
    </EarningsContext.Provider>
  );
}

export function useEarnings() {
  const ctx = useContext(EarningsContext);
  return (
    ctx || {
      earningsData: WITH_EARNINGS,
      setEarningsData: () => { },
      balance: 0,
      setBalance: () => { },
      total: 0,
      ready: 0,
      isEmpty: true,
      loading: false,
      refresh: () => { },
    }
  );
}

/**
 * تنسيق المبلغ للنافبار:
 * إذا كانت فاضية / 0 -> يرجع "0"
 * إذا كان هناك مبلغ -> يرجع المبلغ بالدولار (مثل $250 أو $1,670 أو بالكسور إذا وجدت)
 */
export const formatUsd = (n, options = {}) => {
  const num = Number(n);
  if (!num || isNaN(num) || num === 0) {
    return "0";
  }
  const minDecimals =
    options.fixedDecimals !== undefined
      ? options.fixedDecimals
        ? 2
        : 0
      : num % 1 === 0
        ? 0
        : 2;

  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: 2,
  })}`;
};

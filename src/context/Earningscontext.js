"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { getCreatorEarnings } from "@/services/wallet";

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

export function EarningsProvider({ children, initialData = EMPTY }) {
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
    setLoading(true);
    try {
      const wallet = await getCreatorEarnings();
      setEarningsData({
        total: Number(wallet?.totalEarnings) || 0,
        ready: Number(wallet?.availableBalance) || 0,
      });
    } catch {
      // The page that initiated refresh owns user-facing error reporting.
    } finally {
      setLoading(false);
    }
  }, [setEarningsData]);

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
      earningsData: EMPTY,
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

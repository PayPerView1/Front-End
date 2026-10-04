// ============================================================
// ملف: app/[locale]/advertiser/analytics/page.js
// ============================================================

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { useWallet } from "@/features/wallet/WalletProvider";

// Services
import {
  getTransactions,
  getTransactionById,
  exportTransactions,
} from "@/features/wallet/services/walletService";

// Components
import StatsCards from "../components/transactions/StatsCards";
import TransactionDetail from "../components/transactions/TransactionDetail";
import ExportModal from "../components/transactions/ExportModal";
import TransactionList from "../components/transactions/TransactionList";

export default function AnalyticsPage() {
  const locale = useLocale();
  const router = useRouter();
  const { isDark } = useTheme();
  const t = useTranslations("Analytics");
  const detailT = useTranslations("Analytics.detail");
  const isRtl = locale === "ar";
  const dark = isDark;
  const { balance: walletBalance, refresh: refreshWallet } = useWallet();

  // ─── State ──────────────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ type: "", status: "", page: 1, perPage: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [view, setView] = useState("list"); // "list" | "detail"
  const [showExport, setShowExport] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [exportFilters, setExportFilters] = useState({});

  // ─── Fetch transactions ──────────────────────────────────────────────────────
  const fetchTransactions = useCallback(async (params = {}) => {
    setIsLoading(true);
    setTransactionsError("");
    try {
      const res = await getTransactions({ ...filters, ...params });
      if (res?.success) {
        setTransactions(Array.isArray(res.data) ? res.data : []);
        if (res.pagination) setPagination(res.pagination);
      } else {
        throw new Error(res?.message || "Unable to load transactions.");
      }
    } catch (cause) {
      setTransactionsError(cause?.message || "Unable to load transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const timer = window.setTimeout(() => fetchTransactions(), 0);
    return () => window.clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── View detail for a transaction ──────────────────────────────────────────
  const handleViewDetail = useCallback(async (tx) => {
    // إذا كان لدينا id حقيقي نجلب التفاصيل الكاملة من الـ API
    if (tx?.id) {
      setIsLoadingDetail(true);
      setView("detail");
      const res = await getTransactionById(tx.id);
      if (res?.success) {
        setSelectedTx(res.data);
      } else {
        // في حال الفشل نعرض البيانات الموجودة مسبقاً
        setSelectedTx(tx);
      }
      setIsLoadingDetail(false);
    } else {
      setSelectedTx(tx);
      setView("detail");
    }
  }, []);

  // ─── Handle filter change from TransactionList ───────────────────────────────
  const handleFilterChange = useCallback((newFilters) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    fetchTransactions(updated);
    setExportFilters(updated);
  }, [filters, fetchTransactions]);

  // ─── Handle page change ──────────────────────────────────────────────────────
  const handlePageChange = useCallback((page) => {
    const updated = { ...filters, page };
    setFilters(updated);
    fetchTransactions(updated);
  }, [filters, fetchTransactions]);

  // ─── Export ──────────────────────────────────────────────────────────────────
  const handleExport = useCallback(async (params = {}) => {
    await exportTransactions({ ...exportFilters, ...params });
  }, [exportFilters]);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen p-6 ${dark ? "bg-[#0A0A0A]" : "bg-[#F4F5F7]"}`}
      style={{ fontFamily: "var(--font-tajawal,inherit)" }}
    >

      {/* العرض الحالي: TransactionList تعرض تلقائياً EmptyState إذا كانت البيانات فارغة */}
      {view === "list" && (
        <>
          <StatsCards
            isEmpty={transactions.length === 0}
            walletBalance={walletBalance}
            t={t}
            dark={dark}
            isRtl={isRtl}
          />
          {transactionsError ? (
            <div role="alert" className={`rounded-2xl border p-6 ${dark ? "border-red-900/50 bg-[#121212] text-red-200" : "border-red-200 bg-white text-red-700"}`}>
              <p>{transactionsError}</p>
              <button onClick={() => fetchTransactions()} className="mt-3 underline">{locale === "ar" ? "إعادة المحاولة" : "Retry"}</button>
            </div>
          ) : <TransactionList
            transactions={transactions}
            pagination={pagination}
            isLoading={isLoading}
            t={t}
            dark={dark}
            isRtl={isRtl}
            onViewDetail={handleViewDetail}
            onExport={() => setShowExport(true)}
            onCharge={() => router.push(`/${locale}/advertiser/wallet/top-up`)}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onRefresh={() => {
              refreshWallet().catch(() => {});
              fetchTransactions();
            }}
          />}
        </>
      )}

      {view === "detail" && (
        <TransactionDetail
          t={detailT}
          dark={dark}
          isRtl={isRtl}
          tx={selectedTx}
          isLoading={isLoadingDetail}
          onBack={() => setView("list")}
        />
      )}

      {/* Modal التصدير */}
      {showExport && (
        <ExportModal
          t={t}
          dark={dark}
          isRtl={isRtl}
          onClose={() => setShowExport(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
}

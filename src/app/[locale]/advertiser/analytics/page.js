// ============================================================
// ملف: app/[locale]/advertiser/analytics/page.js
// ============================================================

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";

// Services
import {
  getWalletBalance,
  getTransactions,
  getTransactionById,
  exportTransactions,
} from "@/services/walletService";

// Components
import StatsCards from "./components/StatsCards";
import TransactionDetail from "./components/TransactionDetail";
import ExportModal from "./components/ExportModal";
import TransactionList from "./components/TransactionList";

export default function AnalyticsPage() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const t = useTranslations("Analytics");
  const detailT = useTranslations("Analytics.detail");
  const isRtl = locale === "ar";
  const dark = isDark;

  // ─── State ──────────────────────────────────────────────────────────────────
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ type: "", status: "", page: 1, perPage: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [view, setView] = useState("list"); // "list" | "detail"
  const [showExport, setShowExport] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [exportFilters, setExportFilters] = useState({});

  // ─── Fetch wallet balance ────────────────────────────────────────────────────
  const fetchWalletBalance = useCallback(async () => {
    const res = await getWalletBalance();
    if (res?.success) {
      setWalletBalance(res.data);
    }
  }, []);

  // ─── Fetch transactions ──────────────────────────────────────────────────────
  const fetchTransactions = useCallback(async (params = {}) => {
    setIsLoading(true);
    const res = await getTransactions({ ...filters, ...params });
    if (res?.success) {
      setTransactions(res.data);
      if (res.pagination) setPagination(res.pagination);
    }
    setIsLoading(false);
  }, [filters]);

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
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
          <TransactionList
            transactions={transactions}
            pagination={pagination}
            isLoading={isLoading}
            t={t}
            dark={dark}
            isRtl={isRtl}
            onViewDetail={handleViewDetail}
            onExport={() => setShowExport(true)}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onRefresh={() => {
              fetchWalletBalance();
              fetchTransactions();
            }}
          />
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
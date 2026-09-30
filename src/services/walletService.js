// ============================================================
// ملف: src/services/walletService.js
// API Contract — Sprint 3: Budget & Payments (Analytics Page)
// ============================================================

import axiosInstance, { handleError } from "@/lib/axiosInstance";

// ─── 1. جلب رصيد المحفظة ─────────────────────────────────────────────────────
// GET /api/v1/wallet
// يُستخدم في: StatsCards (بطاقة الرصيد المتاح)
export const getWalletBalance = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 2. جلب قائمة المعاملات (مع pagination وfiltering) ───────────────────────
// GET /api/v1/wallet/transactions
// يُستخدم في: TransactionList
// params: { type, status, page, perPage, paymentMethod, dateFrom, dateTo, search }
export const getTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/transactions", {
      params,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 3. جلب تفاصيل معاملة واحدة ─────────────────────────────────────────────
// GET /api/v1/wallet/transactions/:id
// يُستخدم في: TransactionDetail
export const getTransactionById = async (transactionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/wallet/transactions/${transactionId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 4. تصدير المعاملات (Excel) ──────────────────────────────────────────────
// GET /api/v1/wallet/transactions/export
// يُستخدم في: ExportModal — يُرجع Blob (ملف xlsx)
// params: نفس params قائمة المعاملات (type, status, dateFrom, dateTo, search)
export const exportTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/wallet/transactions/export",
      {
        params,
        responseType: "blob",
      }
    );

    // استخراج اسم الملف من header إن وُجد، وإلا نستخدم اسماً افتراضياً
    const contentDisposition = response.headers["content-disposition"] || "";
    const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
    const fileName = fileNameMatch
      ? fileNameMatch[1]
      : `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // تحميل الملف تلقائياً
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, fileName };
  } catch (error) {
    handleError(error);
  }
};

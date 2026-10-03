// ============================================================
// ملف: src/services/walletService.js
// API Contract — Sprint 3: Budget & Payments (Analytics Page)
// ============================================================

import axiosInstance, { handleError } from "@/lib/axiosInstance";
import { normalizeTransaction } from "../utils/normalizeTransaction";

const toApiFilters = (params) => ({
  ...params,
  type: params.type === "all" ? "" : { deposit: "CREDIT", adSpend: "DEBIT", refund: "REFUND" }[params.type] || params.type,
  status: { verified: "COMPLETED", pending: "PENDING" }[params.status] || params.status,
});

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

// POST /api/v1/wallet/fund — backend accepts PAYPAL or BANK_TRANSFER.
export const fundWallet = async ({ amount, paymentMethod }) => {
  try {
    const response = await axiosInstance.post("/api/v1/wallet/fund", { amount, paymentMethod });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// POST /api/v1/wallet/refund — the backend validates free balance and holds funds.
export const requestRefund = async ({ amount }) => {
  try {
    const response = await axiosInstance.post("/api/v1/wallet/refund", { amount });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const cancelRefund = async (refundRequestId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/wallet/refund/${encodeURIComponent(refundRequestId)}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRefundRequests = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/refunds", { params });
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
      params: toApiFilters(params),
    });
    const body = response.data;
    return Array.isArray(body?.data) ? { ...body, data: body.data.map(normalizeTransaction) } : body;
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
    const body = response.data;
    return body?.data ? { ...body, data: normalizeTransaction(body.data) } : body;
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
        params: toApiFilters(params),
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

// ============================================================
// ملف: src/features/wallet/services/walletService.js
// API Contract — Wallet, Funding (PayPal, Bank Transfer, Moyasar), Transactions & Refunds
// ============================================================

import axiosInstance, { handleError } from "@/lib/axiosInstance";
import { normalizeTransaction } from "../utils/normalizeTransaction";

/**
 * تحويل الفلاتر من واجهة المستخدم لفرمز الـ API
 */
const toApiFilters = (params = {}) => {
  const filterMap = { ...params };
  if (filterMap.type === "all") {
    filterMap.type = "";
  } else if (filterMap.type) {
    const typeMapping = { deposit: "CREDIT", adSpend: "DEBIT", refund: "REFUND" };
    filterMap.type = typeMapping[filterMap.type] || filterMap.type;
  }

  if (filterMap.status) {
    const statusMapping = { verified: "COMPLETED", pending: "PENDING", failed: "FAILED", cancelled: "CANCELLED" };
    filterMap.status = statusMapping[filterMap.status] || filterMap.status;
  }

  return filterMap;
};

// ─── 1. Wallet Balance & Bank Details ────────────────────────────────────────

/**
 * 1.1 جلب رصيد المحفظة
 * GET /api/v1/wallet
 */
export const getWalletBalance = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 1.2 جلب تفاصيل الحساب المصرفي للمنصة
 * GET /api/v1/wallet/bank-details
 */
export const getPlatformBankDetails = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/bank-details");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 2. Wallet Funding & Bank Transfers ──────────────────────────────────────

/**
 * 2.1 بدء عملية شحن المحفظة
 * POST /api/v1/wallet/fund
 * @param {{ amount: number, paymentMethod: "PAYPAL" | "BANK_TRANSFER" | "MOYASAR" }} data
 */
export const fundWallet = async (data) => {
  try {
    const response = await axiosInstance.post("/api/v1/wallet/fund", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const initiateWalletFunding = fundWallet;

/**
 * 2.2 رفع إيصال التحويل البنكي
 * POST /api/v1/wallet/bank-transfer/upload
 * @param {{ transactionId: string, receipt: File }} data
 */
export const uploadBankTransferReceipt = async (data) => {
  try {
    const formData = new FormData();
    if (data?.transactionId) formData.append("transactionId", data.transactionId);
    if (data?.receipt) formData.append("receipt", data.receipt);

    const response = await axiosInstance.post("/api/v1/wallet/bank-transfer/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 2.3 مراجعة التحويل البنكي (مسؤول النظام)
 * PUT /api/v1/admin/wallet/bank-transfer/:id
 * @param {string} id
 * @param {{ action: "APPROVE" | "REJECT", note?: string }} data
 */
export const adminReviewBankTransfer = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/admin/wallet/bank-transfer/${encodeURIComponent(id)}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 3. Transactions ─────────────────────────────────────────────────────────

/**
 * 3.1 جلب قائمة المعاملات مع التصفية والصفحات
 * GET /api/v1/wallet/transactions
 * @param {{ type?: string, status?: string, page?: number, perPage?: number, paymentMethod?: string, dateFrom?: string, dateTo?: string, search?: string }} params
 */
export const getTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/transactions", {
      params: toApiFilters(params),
    });
    const body = response.data;
    if (Array.isArray(body?.data)) {
      return { ...body, data: body.data.map(normalizeTransaction) };
    } else if (Array.isArray(body)) {
      return { success: true, data: body.map(normalizeTransaction) };
    }
    return body;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 3.2 جلب تفاصيل معاملة واحدة
 * GET /api/v1/wallet/transactions/:id
 * @param {string} transactionId
 */
export const getTransactionById = async (transactionId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/wallet/transactions/${encodeURIComponent(transactionId)}`);
    const body = response.data;
    if (body?.data) {
      return { ...body, data: normalizeTransaction(body.data) };
    } else if (body && typeof body === "object") {
      return { success: true, data: normalizeTransaction(body) };
    }
    return body;
  } catch (error) {
    handleError(error);
  }
};

export const getTransactionDetail = getTransactionById;

/**
 * 3.3 تصدير المعاملات (Excel Blob)
 * GET /api/v1/wallet/transactions/export
 * @param {object} params
 */
export const exportTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/transactions/export", {
      params: toApiFilters(params),
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"] || "";
    const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
    const fileName = fileNameMatch
      ? fileNameMatch[1]
      : `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`;

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

/**
 * 3.4 تصدير المعاملات (PDF Blob)
 * GET /api/v1/wallet/transactions/export/pdf
 * @param {object} params
 */
export const exportTransactionsPdf = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/transactions/export/pdf", {
      params: toApiFilters(params),
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"] || "";
    const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
    const fileName = fileNameMatch
      ? fileNameMatch[1]
      : `transactions_${new Date().toISOString().slice(0, 10)}.pdf`;

    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
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

// ─── 4. Refunds ──────────────────────────────────────────────────────────────

/**
 * 4.1 إرسال طلب استرداد رصيد
 * POST /api/v1/wallet/refund
 * @param {{ amount: number }} data
 */
export const requestRefund = async (data) => {
  try {
    const response = await axiosInstance.post("/api/v1/wallet/refund", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const submitRefundRequest = requestRefund;

/**
 * 4.2 إلغاء طلب استرداد
 * DELETE /api/v1/wallet/refund/:id
 * @param {string} refundRequestId
 */
export const cancelRefund = async (refundRequestId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/wallet/refund/${encodeURIComponent(refundRequestId)}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const cancelRefundRequest = cancelRefund;

/**
 * 4.3 جلب طلبات الاسترداد
 * GET /api/v1/wallet/refunds
 * @param {object} params
 */
export const getRefundRequests = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/refunds", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

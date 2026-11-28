// ============================================================
// ملف: src/features/wallet/services/walletService.js
// API Contract — Wallet, Funding (PayPal, Bank Transfer, Moyasar), Transactions & Refunds
// ============================================================

import axiosInstance, {
  AI_REQUEST_TIMEOUT_MS,
  handleError,
} from "@/lib/axiosInstance";
import { normalizeTransaction } from "../utils/normalizeTransaction";

const unwrapCreatorData = (response) => {
  const payload = response?.data;
  if (payload?.success !== true) {
    throw new Error(payload?.message || "The creator finance API returned an unsuccessful response.");
  }
  return payload.data;
};

// ─── Creator earnings & withdrawals ─────────────────────────────────────────

export const getCreatorEarnings = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/creator/earnings");
    const summary = unwrapCreatorData(response);
    const numericFields = [
      "availableBalance", "pendingBalance", "reservedBalance", "totalEarnings",
      "totalWithdrawn", "totalViews", "earningRecords", "earningSubmissions",
    ];
    if (!summary || typeof summary !== "object" || numericFields.some((field) =>
      typeof summary[field] !== "number" || !Number.isFinite(summary[field])
    )) {
      throw new Error("The creator earnings summary is invalid.");
    }
    return summary;
  } catch (error) {
    handleError(error);
  }
};

export const getCreatorEarningsPrediction = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/creator/earnings/prediction", {
      timeout: AI_REQUEST_TIMEOUT_MS,
    });
    const data = unwrapCreatorData(response);
    const validStatus = ["ESTIMATED", "INSUFFICIENT_DATA"].includes(data?.status);
    const validEstimate = data?.status === "INSUFFICIENT_DATA" || (
      Number.isFinite(data?.estimatedCreatorNetAmountCents) &&
      data.estimatedCreatorNetAmountCents >= 0 &&
      Number.isFinite(data?.predictedNext7DaysViews) &&
      data.predictedNext7DaysViews >= 0
    );
    if (!validStatus || !validEstimate || !Array.isArray(data?.campaigns)) {
      throw new Error("The creator earnings prediction response is invalid.");
    }
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getCreatorEarningsTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/creator/earnings/transactions", { params });
    const payload = response?.data;
    if (payload?.success !== true || !Array.isArray(payload.data)) {
      throw new Error(payload?.message || "The creator earnings response is invalid.");
    }
    return { data: payload.data, pagination: payload.pagination || null };
  } catch (error) {
    handleError(error);
  }
};

export const getCreatorPaymentMethods = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/creator/payment-methods");
    const data = unwrapCreatorData(response);
    if (!Array.isArray(data)) throw new Error("The payment methods response is invalid.");
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const addCreatorPaymentMethod = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/v1/creator/payment-methods", payload);
    return unwrapCreatorData(response);
  } catch (error) {
    handleError(error);
  }
};

export const requestCreatorWithdrawal = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/v1/creator/withdrawals", payload);
    return unwrapCreatorData(response);
  } catch (error) {
    handleError(error);
  }
};

export const getCreatorWithdrawalIntelligence = async (payload = {}) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/creator/withdrawals/intelligence",
      payload,
      { timeout: AI_REQUEST_TIMEOUT_MS }
    );
    const data = unwrapCreatorData(response);
    if (!data || !["ASSESSED", "INSUFFICIENT_DATA"].includes(data.status) || !Array.isArray(data.signals)) {
      throw new Error("The withdrawal intelligence response is invalid.");
    }
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getAdvertiserWalletIntelligence = async (payload = {}) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/ai/wallet/intelligence",
      payload,
      { timeout: AI_REQUEST_TIMEOUT_MS }
    );
    const data = unwrapCreatorData(response);
    const statusesValid = data && [
      data.paymentFraud?.status,
      data.paymentMethodRecommendation?.status,
      data.depositAmountPrediction?.status,
      data.dailyBudgetRecommendation?.status,
      data.budgetExhaustionPrediction?.status,
      data.spendingAnomaly?.status,
      data.refundFraud?.status,
      data.refundMethodRecommendation?.status,
      data.refundLikelihoodPrediction?.status,
    ].every((status) => typeof status === "string");
    if (!statusesValid) throw new Error("The advertiser wallet intelligence response is invalid.");
    return data;
  } catch (error) {
    handleError(error);
  }
};

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
 * @param {{ amount: number, paymentMethod: "PAYPAL" | "BANK_TRANSFER" | "MOYASAR" | "SPACEREMIT" }} data
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
 * التحقق من دفعة Spaceremit عبر الخادم
 * POST /api/v1/wallet/spaceremit/verify (أو verifyUrl المرجع من الخادم)
 * @param {{ paymentCode: string, transactionId: string, verifyUrl?: string }} data
 */
export const verifySpaceremitPayment = async ({ paymentCode, transactionId, verifyUrl } = {}) => {
  try {
    const rawUrl = typeof verifyUrl === "string" ? verifyUrl.trim() : "";
    const endpoint = rawUrl || "/api/v1/wallet/spaceremit/verify";
    const response = await axiosInstance.post(endpoint, {
      paymentCode,
      transactionId,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * تأكيد طلب PayPal بعد عودة المستخدم من صفحة الموافقة
 * POST /api/v1/wallet/paypal/capture
 * @param {string} orderId قيمة token التي يعيدها PayPal
 */
export const capturePayPalOrder = async (orderId) => {
  try {
    const response = await axiosInstance.post("/api/v1/wallet/paypal/capture", { orderId });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

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

/**
 * 2.4 مراجعة طلب استرداد (مسؤول النظام)
 * PUT /api/v1/admin/wallet/refund/:id
 * @param {string} id
 * @param {{ action: "APPROVE" | "REJECT", note?: string }} data
 */
export const adminReviewRefund = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/admin/wallet/refund/${encodeURIComponent(id)}`, data);
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

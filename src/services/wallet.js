import axiosInstance, { handleError } from "@/lib/axiosInstance";

// ─── 1. Wallet ────────────────────────────────────────────────────────────────

/**
 * 1.1 Get Wallet Balance
 * @returns {Promise<{ id: string, balance: number, currency: string, updatedAt: string }>}
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
 * 1.2 Get Platform Bank Details
 * @returns {Promise<{ bankName: string, beneficiaryName: string, iban: string, swiftCode: string, currency: string, note: string }>}
 */
export const getPlatformBankDetails = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/bank-details");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 1.3 Initiate Wallet Funding
 * @param {{ amount: number, paymentMethod: "PAYPAL" | "BANK_TRANSFER" }} data 
 */
export const initiateWalletFunding = async (data) => {
  try {
    const response = await axiosInstance.post("/api/v1/wallet/fund", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 1.5 Upload Bank Transfer Receipt
 * @param {{ transactionId: string, receipt: File }} data 
 */
export const uploadBankTransferReceipt = async (data) => {
  try {
    const formData = new FormData();
    formData.append("transactionId", data.transactionId);
    formData.append("receipt", data.receipt);

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
 * 1.6 Admin: Review Bank Transfer
 * @param {string} id - bank transfer id
 * @param {{ action: "APPROVE" | "REJECT", note?: string }} data 
 */
export const adminReviewBankTransfer = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/v1/admin/wallet/bank-transfer/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ─── 2. Transaction History ───────────────────────────────────────────────────

/**
 * 2.1 List Transactions
 * @param {{ type?: string, status?: string, page?: number, perPage?: number, paymentMethod?: string, dateFrom?: string, dateTo?: string, search?: string }} params 
 */
export const getTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/transactions", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 2.2 Get Transaction Detail
 * @param {string} id 
 */
export const getTransactionDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/wallet/transactions/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 2.3 Export Transactions (Excel)
 * @param {object} params 
 */
export const exportTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/v1/wallet/transactions/export", {
      params,
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    handleError(error);
  }
};

// ─── 4. Refund ────────────────────────────────────────────────────────────────

/**
 * 4.1 Submit Refund Request
 * @param {{ amount: number }} data 
 */
export const submitRefundRequest = async (data) => {
  try {
    const response = await axiosInstance.post("/api/v1/wallet/refund", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * 4.2 Cancel Refund Request
 * @param {string} id 
 */
export const cancelRefundRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/wallet/refund/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

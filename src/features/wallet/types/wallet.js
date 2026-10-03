/** @typedef {{ id: string, balance: number, currency?: string, updatedAt?: string }} Wallet */

/** @typedef {{
 * refundRequestId?: string,
 * transactionId?: string,
 * amount: number,
 * netAmount?: number,
 * refundMethod?: string,
 * status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED',
 * walletBalanceAfter?: number,
 * createdAt?: string
 * }} RefundRequest */

export const REFUND_STATUSES = Object.freeze({
  pending: "PENDING",
  underReview: "UNDER_REVIEW",
  approved: "APPROVED",
  completed: "COMPLETED",
  rejected: "REJECTED",
  cancelled: "CANCELLED",
});

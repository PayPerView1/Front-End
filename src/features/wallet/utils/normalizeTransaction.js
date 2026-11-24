const typeMap = { CREDIT: "deposit", DEBIT: "adSpend", REFUND: "refund" };

export function normalizeTransaction(transaction = {}) {
  const rawType = String(transaction.type || "").toUpperCase();
  const type = typeMap[rawType] || "unknown";
  const rawStatus = String(transaction.status || "").toUpperCase();
  const status = ["COMPLETED", "VERIFIED"].includes(rawStatus)
    ? "verified"
    : ["FAILED", "DECLINED", "REJECTED", "PAYMENT_FAILED", "ERROR"].includes(rawStatus)
      ? "failed"
      : ["CANCELLED", "CANCELED", "PAYMENT_CANCELLED"].includes(rawStatus)
        ? "cancelled"
        : ["PENDING", "PROCESSING", "UNDER_REVIEW", "SUBMITTED"].includes(rawStatus)
          ? "pending"
          : "unknown";
  const amount = Number(transaction.netAmount ?? transaction.grossAmount ?? transaction.amount);
  const sign = type === "adSpend" ? "-" : type === "deposit" || type === "refund" ? "+" : "";
  const createdAt = transaction.createdAt ? new Date(transaction.createdAt) : null;
  const validDate = createdAt && !Number.isNaN(createdAt.valueOf());
  const currency = transaction.currency || "";
  const formattedAmount = Number.isFinite(amount)
    ? Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";
  const signedAmount = `${sign}${currency ? `${currency === "USD" ? "$" : `${currency} `}` : ""}${formattedAmount}`;

  return {
    ...transaction,
    id: String(transaction.id || transaction.transactionId || ""),
    rawType,
    rawStatus,
    type,
    amountValue: Number.isFinite(amount) ? amount : null,
    dateISO: validDate ? createdAt.toISOString().slice(0, 10) : "",
    time: validDate ? createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—",
    typeLabel: type,
    description: transaction.description || transaction.campaignName || "—",
    ref: transaction.transactionId || transaction.campaignId || transaction.id || "—",
    paymentMethod: transaction.paymentMethod || "—",
    paymentSub: "",
    paymentIcon: transaction.paymentMethod === "BANK_TRANSFER" ? "bank" : transaction.paymentMethod ? "card" : "wallet",
    amount: Number.isFinite(amount) ? signedAmount : "—",
    amountSar: transaction.amountSar || "",
    amountUp: type === "deposit" || type === "refund",
    status,
  };
}

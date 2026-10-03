const typeMap = { CREDIT: "deposit", DEBIT: "adSpend", REFUND: "refund" };

export function normalizeTransaction(transaction = {}) {
  const type = typeMap[String(transaction.type || "").toUpperCase()] || "deposit";
  const rawStatus = String(transaction.status || "").toUpperCase();
  const status = ["COMPLETED", "VERIFIED"].includes(rawStatus)
    ? "verified"
    : ["FAILED", "DECLINED", "REJECTED", "PAYMENT_FAILED", "ERROR"].includes(rawStatus)
      ? "failed"
      : ["CANCELLED", "CANCELED", "PAYMENT_CANCELLED"].includes(rawStatus)
        ? "cancelled"
        : "pending";
  const amount = Number(transaction.netAmount ?? transaction.grossAmount ?? 0);
  const positive = type !== "adSpend";
  const createdAt = transaction.createdAt ? new Date(transaction.createdAt) : null;
  const validDate = createdAt && !Number.isNaN(createdAt.valueOf());
  const currency = transaction.currency || "USD";
  const signedAmount = `${positive ? "+" : "-"}${currency === "USD" ? "$" : `${currency} `}${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return {
    ...transaction,
    id: String(transaction.id || transaction.transactionId || ""),
    type,
    dateISO: validDate ? createdAt.toISOString().slice(0, 10) : "",
    time: validDate ? createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—",
    typeLabel: type,
    description: transaction.description || transaction.campaignName || "—",
    ref: transaction.transactionId || transaction.campaignId || transaction.id || "—",
    paymentMethod: transaction.paymentMethod || "—",
    paymentSub: "",
    paymentIcon: transaction.paymentMethod === "BANK_TRANSFER" ? "bank" : transaction.paymentMethod ? "card" : "wallet",
    amount: signedAmount,
    amountSar: `${positive ? "+" : "-"}${(Math.abs(amount) * 3.75).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`,
    amountUp: positive,
    status,
  };
}

"use client";

import React from "react";
import { MdOutlineArrowBack, MdOutlineArrowForward } from "react-icons/md";
import { FiDownload } from "react-icons/fi";

const display = (value) =>
  value === undefined || value === null || value === "" ? "—" : String(value);

function formatMoney(value, currency, locale) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  if (!currency) return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount);
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount)} ${currency}`;
  }
}

function Field({ label, value, dark = true }) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 border-b py-3 last:border-0 ${dark ? "border-gray-800/70" : "border-gray-200"}`}>
      <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
      <span className={`max-w-[70%] break-words text-end text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>{display(value)}</span>
    </div>
  );
}

export default function TransactionDetail({ t, dark = true, isRtl = true, tx = null, onBack, isLoading = false }) {
  const locale = isRtl ? "ar" : "en";
  const labels = isRtl
    ? { back: "العودة للمعاملات", title: "تفاصيل المعاملة", amount: "المبلغ", id: "رقم المعاملة", status: "الحالة", date: "التاريخ", type: "النوع", payment: "وسيلة الدفع", campaign: "الحملة", campaignId: "رقم الحملة", description: "الوصف", fee: "الرسوم", gross: "المبلغ الإجمالي", net: "الصافي", balanceBefore: "الرصيد قبل المعاملة", balanceAfter: "الرصيد بعدها", receipt: "تنزيل تفاصيل المعاملة CSV", loading: "جارٍ تحميل التفاصيل…", unavailable: "تفاصيل المعاملة غير متاحة." }
    : { back: "Back to transactions", title: "Transaction details", amount: "Amount", id: "Transaction ID", status: "Status", date: "Date", type: "Type", payment: "Payment method", campaign: "Campaign", campaignId: "Campaign ID", description: "Description", fee: "Fee", gross: "Gross amount", net: "Net amount", balanceBefore: "Balance before", balanceAfter: "Balance after", receipt: "Download transaction details CSV", loading: "Loading details…", unavailable: "Transaction details are unavailable." };
  const rawAmount = tx?.amountValue ?? tx?.netAmount ?? tx?.grossAmount ?? (typeof tx?.amount === "number" ? tx.amount : null);
  const rawType = String(tx?.rawType ?? tx?.type ?? "").toUpperCase();
  const signedAmount = rawAmount == null || !Number.isFinite(Number(rawAmount))
    ? null
    : rawType === "DEBIT" || rawType === "ADSPEND"
      ? -Math.abs(Number(rawAmount))
      : Number(rawAmount);
  const currency = tx?.currency;
  const createdAt = tx?.createdAt ? new Date(tx.createdAt) : null;
  const date = createdAt && !Number.isNaN(createdAt.valueOf()) ? createdAt.toLocaleString(locale) : "—";
  const transactionId = tx?.transactionId ?? tx?.id;

  const downloadCsv = () => {
    if (!tx) return;
    const rows = [
      ["transactionId", transactionId ?? ""],
      ["status", tx.rawStatus ?? tx.status ?? ""],
      ["type", tx.rawType ?? tx.type ?? ""],
      ["amount", rawAmount ?? ""],
      ["currency", currency ?? ""],
      ["createdAt", tx.createdAt ?? ""],
      ["paymentMethod", tx.paymentMethod ?? ""],
      ["campaignId", tx.campaignId ?? ""],
      ["description", tx.description ?? ""],
    ];
    const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const content = "\uFEFF" + rows.map((row) => row.map(escape).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `transaction-${transactionId || "details"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const surface = dark ? "bg-[#14181B] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900";

  if (isLoading) {
    return <div role="status" className={`rounded-2xl border p-10 text-center ${surface}`}>{labels.loading}</div>;
  }
  if (!tx) {
    return <div role="status" className={`rounded-2xl border p-10 text-center ${surface}`}>{labels.unavailable}</div>;
  }

  const optionalFields = [
    [labels.fee, tx.fee],
    [labels.gross, tx.grossAmount],
    [labels.net, tx.netAmount],
    [labels.balanceBefore, tx.balanceBefore],
    [labels.balanceAfter, tx.balanceAfter],
  ].filter(([, value]) => value !== undefined && value !== null);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="w-full space-y-4 font-sans">
      {onBack && (
        <button onClick={onBack} className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm ${surface}`}>
          {isRtl ? <MdOutlineArrowForward size={16} /> : <MdOutlineArrowBack size={16} />}
          {labels.back}
        </button>
      )}
      <section className={`rounded-2xl border p-5 shadow-xl lg:p-6 ${surface}`}>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="mb-2 text-xl font-bold">{labels.title}</h1>
            <p className={`m-0 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{labels.id}: {display(transactionId)}</p>
          </div>
          <button onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-xl bg-[#155D4B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1C6B58]">
            <FiDownload size={15} />{labels.receipt}
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field dark={dark} label={labels.amount} value={formatMoney(signedAmount, currency, locale)} />
          <Field dark={dark} label={labels.status} value={tx.rawStatus ?? tx.status} />
          <Field dark={dark} label={labels.date} value={date} />
          <Field dark={dark} label={labels.type} value={tx.rawType ?? tx.type} />
          <Field dark={dark} label={labels.payment} value={tx.paymentMethod} />
          <Field dark={dark} label={labels.campaign} value={tx.campaignName} />
          <Field dark={dark} label={labels.campaignId} value={tx.campaignId} />
          <Field dark={dark} label={labels.description} value={tx.description} />
          {optionalFields.map(([label, value]) => (
            <Field key={label} dark={dark} label={label} value={formatMoney(value, currency, locale)} />
          ))}
        </div>
        {t && <span className="sr-only">{t("transactions.viewDetails")}</span>}
      </section>
    </div>
  );
}

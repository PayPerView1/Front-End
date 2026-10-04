"use client";

import { useEffect, useState } from "react";
import PaymentSuccessPage from "@/features/wallet/components/payment/success/PaymentSuccessPage";

export default function BankTransferPage() {
  const [transfer, setTransfer] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = sessionStorage.getItem("wallet:bank-transfer");
        if (saved) setTransfer(JSON.parse(saved));
      } catch {
        setTransfer(null);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const copyIban = async () => {
    if (!transfer?.bankDetails?.iban) return;
    await navigator.clipboard.writeText(transfer.bankDetails.iban);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      {transfer?.bankDetails && (
        <section dir="rtl" className="mx-auto mt-6 max-w-4xl rounded-2xl border border-white/10 bg-[#151819] p-5 text-white sm:p-7">
          <h1 className="mb-2 text-xl font-bold">بيانات التحويل البنكي</h1>
          <p className="mb-5 text-sm text-gray-400">حوّل المبلغ الموضح إلى حساب المنصة، وأرفق رقم العملية في وصف التحويل.</p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {[["البنك", transfer.bankDetails.bankName], ["المستفيد", transfer.bankDetails.beneficiaryName], ["IBAN", transfer.bankDetails.iban], ["SWIFT", transfer.bankDetails.swiftCode], ["المبلغ", `${transfer.grossAmount ?? transfer.amount ?? "—"} ${transfer.currency || "USD"}`]].filter(([, value]) => value).map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4"><dt className="mb-1 text-xs text-gray-400">{label}</dt><dd className="break-all font-medium" dir="auto">{value}</dd></div>
            ))}
          </dl>
          {transfer.bankDetails.iban && <button onClick={copyIban} className="mt-4 rounded-lg border border-[#94D3C1]/30 px-4 py-2 text-sm text-[#94D3C1]">{copied ? "تم نسخ IBAN" : "نسخ IBAN"}</button>}
          {transfer.bankDetails.note && <p className="mt-4 text-sm text-gray-400">{transfer.bankDetails.note}</p>}
        </section>
      )}
      <PaymentSuccessPage />
    </>
  );
}

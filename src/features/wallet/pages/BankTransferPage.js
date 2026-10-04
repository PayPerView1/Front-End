"use client";

import { useEffect, useState } from "react";
import PaymentSuccessPage from "@/features/wallet/components/payment/success/PaymentSuccessPage";
import { getPlatformBankDetails, uploadBankTransferReceipt } from "@/features/wallet/services/walletService";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function BankTransferPage() {
  const [transfer, setTransfer] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);

  // حالة رفع الإيصال
  const [receiptFile, setReceiptFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDetails = async () => {
      try {
        const saved = sessionStorage.getItem("wallet:bank-transfer");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (active) setTransfer(parsed);
        } else {
          setLoadingBankDetails(true);
          const res = await getPlatformBankDetails();
          if (!active) return;
          const bankData = res?.data ?? res;
          if (bankData && typeof bankData === "object") {
            setTransfer({ bankDetails: bankData });
          }
        }
      } catch {
        if (active) setTransfer(null);
      } finally {
        if (active) setLoadingBankDetails(false);
      }
    };

    const timer = window.setTimeout(loadDetails, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  const copyIban = async () => {
    if (!transfer?.bankDetails?.iban) return;
    await navigator.clipboard.writeText(transfer.bankDetails.iban);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleUploadReceipt = async (e) => {
    e.preventDefault();
    if (!receiptFile) return;

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const transactionId = transfer?.transactionId || transfer?.id || "";
      const res = await uploadBankTransferReceipt({
        transactionId,
        receipt: receiptFile,
      });

      if (res?.success !== false) {
        setUploadSuccess(true);
        setReceiptFile(null);
      } else {
        throw new Error(res?.message || "تعذر رفع إيصال التحويل.");
      }
    } catch (err) {
      setUploadError(err?.message || "حدث خطأ أثناء رفع إيصال التحويل.");
    } finally {
      setIsUploading(false);
    }
  };

  const bankDetails = transfer?.bankDetails;

  return (
    <>
      <section dir="rtl" className="mx-auto mt-6 max-w-4xl rounded-2xl border border-white/10 bg-[#151819] p-5 text-white sm:p-7">
        <h1 className="mb-2 text-xl font-bold">بيانات التحويل البنكي</h1>
        <p className="mb-5 text-sm text-gray-400">
          حوّل المبلغ الموضح إلى حساب المنصة، وأرفق رقم العملية في وصف التحويل.
        </p>

        {loadingBankDetails ? (
          <p className="text-sm text-gray-400">جارٍ تحميل بيانات الحساب المصرفي...</p>
        ) : bankDetails ? (
          <>
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["البنك", bankDetails.bankName],
                ["المستفيد", bankDetails.beneficiaryName],
                ["IBAN", bankDetails.iban],
                ["SWIFT", bankDetails.swiftCode],
                ["المبلغ", transfer.amount || transfer.grossAmount ? `${transfer.grossAmount ?? transfer.amount} ${transfer.currency || "USD"}` : null],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <dt className="mb-1 text-xs text-gray-400">{label}</dt>
                    <dd className="break-all font-medium" dir="auto">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>

            {bankDetails.iban && (
              <button
                onClick={copyIban}
                className="mt-4 rounded-lg border border-[#94D3C1]/30 px-4 py-2 text-sm text-[#94D3C1] hover:bg-[#94D3C1]/10 transition"
              >
                {copied ? "تم نسخ IBAN" : "نسخ IBAN"}
              </button>
            )}

            {bankDetails.note && <p className="mt-4 text-sm text-gray-400">{bankDetails.note}</p>}
          </>
        ) : (
          <p className="text-sm text-gray-400">لا تتوفر تفاصيل البنك حالياً.</p>
        )}

        {/* ── نموذج رفع إيصال التحويل ── */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <h2 className="mb-2 text-base font-bold text-white flex items-center gap-2">
            <FiUploadCloud className="text-[#94D3C1]" />
            إرفاق إيصال التحويل البنكي
          </h2>
          <p className="mb-4 text-xs text-gray-400">
            يمكنك رفع صورة أو ملف PDF لإيصال التحويل لتسريع عملية التحقق وتأكيد الشحن.
          </p>

          <form onSubmit={handleUploadReceipt} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#94D3C1]/10 file:text-[#94D3C1] hover:file:bg-[#94D3C1]/20 cursor-pointer"
              />
              <button
                type="submit"
                disabled={!receiptFile || isUploading}
                className="w-full sm:w-auto shrink-0 rounded-lg bg-[#94D3C1] px-5 py-2.5 text-xs font-bold text-black disabled:opacity-40 hover:bg-[#83c2b0] transition"
              >
                {isUploading ? "جارٍ الرفع..." : "رفع الإيصال"}
              </button>
            </div>

            {uploadSuccess && (
              <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <FiCheckCircle size={16} />
                <span>تم رفع إيصال التحويل بنجاح! سيتم مراجعته من قبل الإدارة.</span>
              </div>
            )}

            {uploadError && (
              <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <FiAlertCircle size={16} />
                <span>{uploadError}</span>
              </div>
            )}
          </form>
        </div>
      </section>

      <PaymentSuccessPage />
    </>
  );
}

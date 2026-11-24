'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCircle, Clock, FileText } from 'lucide-react';

const formatMoney = (value, currency, locale) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  if (!currency) return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount);
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount)} ${currency}`;
  }
};

export default function RefundSuccessState({ onCancel, refund, cancelling = false }) {
  const router = useRouter();
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const status = String(refund?.status || '').toUpperCase();
  const approved = ['APPROVED', 'COMPLETED'].includes(status);
  const canCancel = ['PENDING', 'UNDER_REVIEW'].includes(status) && Boolean(refund?.refundRequestId);
  const labels = isArabic
    ? { title: approved ? 'تم تحديث حالة طلب الاسترداد' : 'حالة طلب الاسترداد', status: 'حالة الطلب من الخادم:', request: 'تفاصيل الطلب', id: 'رقم الطلب', date: 'تاريخ الإنشاء', method: 'طريقة الاسترداد', amount: 'المبلغ المطلوب', fee: 'الرسوم', net: 'صافي الاسترداد', wallet: 'العودة إلى المحفظة', cancel: cancelling ? 'جارٍ إلغاء الطلب…' : 'إلغاء طلب الاسترداد' }
    : { title: approved ? 'Refund request status updated' : 'Refund request status', status: 'Backend status:', request: 'Request details', id: 'Request ID', date: 'Created at', method: 'Refund method', amount: 'Requested amount', fee: 'Fee', net: 'Net refund', wallet: 'Return to wallet', cancel: cancelling ? 'Cancelling request…' : 'Cancel refund request' };
  const currency = refund?.currency;
  const amount = refund?.amount ?? refund?.grossAmount;
  const fields = [
    [labels.amount, amount],
    [labels.fee, refund?.fee],
    [labels.net, refund?.netAmount],
  ].filter(([, value]) => value !== undefined && value !== null);
  const createdAt = refund?.createdAt ? new Date(refund.createdAt) : null;
  const formattedDate = createdAt && !Number.isNaN(createdAt.valueOf())
    ? createdAt.toLocaleString(locale)
    : '—';

  return (
    <section className="rounded-2xl border border-white/[.08] bg-[#151819] p-6 lg:p-8">
      <div className="mb-7 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[.08]">
          {approved ? <CheckCircle className="h-6 w-6 text-[#94D3C1]" /> : <Clock className="h-6 w-6 text-[#E9C349]" />}
        </span>
        <div>
          <h2 className="mb-2 text-xl font-bold text-white">
            {labels.title}
          </h2>
          <p className="m-0 text-sm text-[#9AA39F]">
            {labels.status} {refund?.status || '—'}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-white/[.08] bg-[#101213] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <FileText className="h-4 w-4 text-[#94D3C1]" />
          {labels.request}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="text-sm text-[#9AA39F]">{labels.id}: <span className="break-all text-white">{refund?.refundRequestId || refund?.id || '—'}</span></div>
          <div className="text-sm text-[#9AA39F]">{labels.date}: <span className="text-white">{formattedDate}</span></div>
          {refund?.refundMethod && <div className="text-sm text-[#9AA39F]">{labels.method}: <span className="text-white">{refund.refundMethod}</span></div>}
          {fields.map(([label, value]) => (
            <div key={label} className="text-sm text-[#9AA39F]">{label}: <span className="text-white">{formatMoney(value, currency, locale)}</span></div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={() => router.push(`/${locale}/advertiser/wallet`)} className="flex-1 rounded-xl border border-[#94D3C1]/30 bg-[#94D3C1]/10 px-5 py-3 text-sm font-semibold text-[#94D3C1] hover:bg-[#94D3C1]/20">
          {labels.wallet}
        </button>
        {canCancel && (
          <button onClick={onCancel} disabled={cancelling} className="flex-1 rounded-xl bg-[#B45309] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            {labels.cancel}
          </button>
        )}
      </div>
    </section>
  );
}

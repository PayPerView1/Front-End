'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const formatAmount = (value, currency, locale) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  if (!currency) return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount);
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount); }
  catch { return `${amount} ${currency}`; }
};

export default function RefundRejectedState({ onSwitchState, refund }) {
  const locale = useLocale();
  const router = useRouter();
  const reason = refund?.rejectionReason ?? refund?.reason ?? refund?.note;
  const amount = refund?.amount ?? refund?.grossAmount;
  return (
    <section className="rounded-2xl border border-red-500/30 bg-[#151819] p-6 lg:p-8">
      <h2 className="mb-2 text-xl font-bold text-white">{locale === 'ar' ? 'تم رفض طلب الاسترداد' : 'Refund request rejected'}</h2>
      <p className="mb-6 text-sm text-[#9AA39F]">
        {locale === 'ar' ? 'حالة الطلب كما وردت من الخادم. راجع سبب الرفض إن كان متاحاً.' : 'The request status was returned by the backend. Review the reason if one was provided.'}
      </p>
      <div className="grid gap-3 rounded-xl border border-white/[.08] bg-[#101213] p-4 sm:grid-cols-2">
        <div className="text-sm text-[#9AA39F]">{locale === 'ar' ? 'رقم الطلب' : 'Request ID'}: <span className="text-white">{refund?.refundRequestId || refund?.id || '—'}</span></div>
        <div className="text-sm text-[#9AA39F]">{locale === 'ar' ? 'المبلغ' : 'Amount'}: <span className="text-white">{formatAmount(amount, refund?.currency, locale)}</span></div>
        <div className="text-sm text-[#9AA39F]">{locale === 'ar' ? 'الحالة' : 'Status'}: <span className="text-white">{refund?.status || 'REJECTED'}</span></div>
        {reason && <div className="text-sm text-[#9AA39F] sm:col-span-2">{locale === 'ar' ? 'السبب' : 'Reason'}: <span className="text-white">{reason}</span></div>}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button onClick={() => onSwitchState('initial')} className="flex-1 rounded-xl bg-[#155D4B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1C6B58]">
          {locale === 'ar' ? 'طلب استرداد جديد' : 'Start a new refund request'}
        </button>
        <button onClick={() => router.push(`/${locale}/advertiser/wallet`)} className="flex-1 rounded-xl border border-white/[.12] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[.05]">
          {locale === 'ar' ? 'العودة إلى المحفظة' : 'Return to wallet'}
        </button>
      </div>
    </section>
  );
}

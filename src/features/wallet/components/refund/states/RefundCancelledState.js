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

export default function RefundCancelledState({ onSwitchState, refund }) {
  const locale = useLocale();
  const router = useRouter();
  const amount = refund?.amount ?? refund?.grossAmount;
  const requestId = refund?.refundRequestId || refund?.id || '—';
  return (
    <section className="rounded-2xl border border-white/[.08] bg-[#151819] p-6 lg:p-8">
      <h2 className="mb-2 text-xl font-bold text-white">{locale === 'ar' ? 'تم إلغاء طلب الاسترداد' : 'Refund request cancelled'}</h2>
      <p className="mb-6 text-sm text-[#9AA39F]">
        {locale === 'ar' ? 'تم تأكيد الإلغاء من الخادم. لا تعرض هذه الشاشة أي تغيير في الرصيد ما لم يرد ضمن بيانات المحفظة.' : 'The backend confirmed the cancellation. This screen does not infer a balance change.'}
      </p>
      <div className="grid gap-3 rounded-xl border border-white/[.08] bg-[#101213] p-4 sm:grid-cols-2">
        <div className="text-sm text-[#9AA39F]">{locale === 'ar' ? 'رقم الطلب' : 'Request ID'}: <span className="text-white">{requestId}</span></div>
        <div className="text-sm text-[#9AA39F]">{locale === 'ar' ? 'المبلغ' : 'Amount'}: <span className="text-white">{formatAmount(amount, refund?.currency, locale)}</span></div>
        <div className="text-sm text-[#9AA39F]">{locale === 'ar' ? 'الحالة' : 'Status'}: <span className="text-white">{refund?.status || 'CANCELLED'}</span></div>
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

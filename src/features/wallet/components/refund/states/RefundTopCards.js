'use client';

import { useLocale } from 'next-intl';
import { Wallet, CreditCard, Shield } from 'lucide-react';

const format = (amount, locale) => {
  const value = Number(amount);
  return amount === null || amount === undefined || !Number.isFinite(value)
    ? '—'
    : value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function RefundTopCards({ walletBalance = null, reservedBalance = null, availableBalance = null }) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const wallet = Number(walletBalance);
  const available = Number(availableBalance);
  const liquidity = Number.isFinite(wallet) && wallet > 0 && Number.isFinite(available)
    ? Math.min(100, Math.max(0, Math.round((available / wallet) * 100)))
    : null;
  const cards = [
    { icon: Wallet, title: isArabic ? 'الرصيد المتاح للطلب' : 'Balance available for a request', value: availableBalance, color: 'text-[#94D3C1]' },
    { icon: CreditCard, title: isArabic ? 'الرصيد المحجوز للحملات النشطة' : 'Reserved by active campaigns', value: reservedBalance, color: 'text-[#E9C349]' },
    { icon: Shield, title: isArabic ? 'رصيد المحفظة' : 'Wallet balance', value: walletBalance, color: 'text-white' },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map(({ icon: Icon, title, value, color }, index) => (
        <section key={title} className="rounded-2xl border border-white/[.08] bg-[#151819] p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-lg bg-white/[.08] p-2"><Icon className="h-5 w-5 text-white" /></span>
            <h3 className="m-0 text-sm font-medium text-white">{title}</h3>
          </div>
          <div className={`text-end text-3xl font-bold ${color}`}>{value == null ? '—' : `$${format(value, locale)}`}</div>
          {index === 0 && <p className="mt-2 text-end text-[11px] text-[#8A9490]">{isArabic ? 'تقدير من رصيد المحفظة وميزانيات الحملات؛ يظل قرار الخادم نهائياً.' : 'Estimated from wallet and campaign budgets; the backend makes the final eligibility decision.'}</p>}
          {index === 2 && (
            <div className="mt-4">
              <div className="h-1.5 w-full rounded-full bg-white/[.08]">
                <div className="h-1.5 rounded-full bg-teal-400" style={{ width: `${liquidity ?? 0}%` }} />
              </div>
              <p className="mt-2 text-center text-[11px] text-[#8A9490]">{liquidity == null ? '—' : `${liquidity}%`}</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

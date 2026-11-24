'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ArrowRight, Info, Receipt } from 'lucide-react';

export default function RefundInitialState({ onSubmit, submitting = false, balance = null }) {
  const router = useRouter();
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState('');
  const available = Number(balance);
  const hasAvailable = balance !== null && balance !== undefined && Number.isFinite(available);
  const value = Number(String(amount).replace(/,/g, ''));
  const validAmount = Number.isFinite(value) && value > 0;
  const copy = isArabic
    ? { title: 'طلب استرداد الرصيد', intro: 'أدخل المبلغ الذي تريد طلب استرداده. سيتحقق الخادم من الأهلية والرسوم قبل تأكيد الطلب.', amount: 'المبلغ المطلوب (USD)', available: 'الرصيد المتاح حسب بيانات المحفظة', max: 'الحد الأقصى', suggestions: 'مبالغ مقترحة', feeTitle: 'الرسوم وصافي الاسترداد', feeText: 'ستظهر الرسوم وصافي المبلغ بعد رد الخادم، إذا كانت متاحة.', request: 'إرسال طلب الاسترداد', submitting: 'جارٍ إرسال الطلب…', back: 'العودة إلى المحفظة', invalid: 'أدخل مبلغاً أكبر من صفر.', missing: 'تعذر التحقق من الرصيد المتاح. حدّث المحفظة ثم أعد المحاولة.', excess: 'المبلغ يتجاوز الرصيد المتاح المعروض.' }
    : { title: 'Request a refund', intro: 'Enter the amount to request. The backend will verify eligibility and fees before confirming the request.', amount: 'Requested amount (USD)', available: 'Available balance from wallet data', max: 'Maximum', suggestions: 'Suggested amounts', feeTitle: 'Fees and net refund', feeText: 'Fees and the net amount will appear in the backend response when available.', request: 'Submit refund request', submitting: 'Submitting request…', back: 'Return to wallet', invalid: 'Enter an amount greater than zero.', missing: 'The available balance could not be verified. Refresh the wallet and try again.', excess: 'The amount exceeds the displayed available balance.' };

  const submit = () => {
    setValidationError('');
    if (!validAmount) return setValidationError(copy.invalid);
    if (!hasAvailable) return setValidationError(copy.missing);
    if (value > available) return setValidationError(copy.excess);
    onSubmit?.(value);
  };
  const setSuggestedAmount = (suggestion) => {
    setAmount(String(suggestion));
    setValidationError('');
  };
  const suggestions = [200, 500, 1000].filter((suggestion) => !hasAvailable || suggestion <= available);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="space-y-5 rounded-2xl border border-white/[.08] bg-[#151819] p-6 lg:col-span-2">
        <div className="flex items-center gap-3">
          <Receipt className="h-5 w-5 text-[#94D3C1]" />
          <h2 className="text-lg font-bold text-white">{copy.title}</h2>
        </div>
        <p className="m-0 text-sm text-[#9AA39F]">{copy.intro}</p>

        <div>
          <label htmlFor="refund-amount" className="mb-2 block text-sm font-medium text-white">{copy.amount}</label>
          <div className="flex items-center gap-3">
            <input id="refund-amount" type="number" inputMode="decimal" min="0" step="0.01" value={amount} onChange={(event) => { setAmount(event.target.value); setValidationError(''); }} className="min-w-0 flex-1 rounded-xl border border-white/[.08] bg-[#101213] px-4 py-3 text-lg font-semibold text-white outline-none focus:border-[#94D3C1]" />
            <button type="button" onClick={() => setSuggestedAmount(available)} disabled={!hasAvailable || available <= 0} className="rounded-lg bg-[#94D3C1]/10 px-3 py-2 text-xs font-semibold text-[#94D3C1] disabled:opacity-40">{copy.max}</button>
          </div>
          <p className="mt-2 text-xs text-[#8A9490]">{copy.available}: {hasAvailable ? `$${available.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}</p>
        </div>

        {suggestions.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-[#8A9490]">{copy.suggestions}</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => setSuggestedAmount(suggestion)} className={`rounded-lg border px-3 py-2 text-sm ${Number(amount) === suggestion ? 'border-[#94D3C1] bg-[#94D3C1]/10 text-[#94D3C1]' : 'border-white/[.08] bg-[#101213] text-white'}`}>
                  ${suggestion.toLocaleString(locale)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 rounded-xl border border-white/[.08] bg-[#101213] p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#E9C349]" />
          <div>
            <h3 className="mb-1 text-sm font-semibold text-white">{copy.feeTitle}</h3>
            <p className="m-0 text-xs leading-5 text-[#9AA39F]">{copy.feeText}</p>
          </div>
        </div>

        {validationError && <p role="alert" className="m-0 text-sm text-red-300">{validationError}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={submit} disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FDA100] to-[#FE5403] px-5 py-3.5 font-bold text-[#1D1D1D] disabled:cursor-wait disabled:opacity-60">
            {submitting ? copy.submitting : copy.request}<ArrowRight className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => router.push(`/${locale}/advertiser/wallet`)} className="rounded-xl border border-white/[.08] bg-[#101213] px-5 py-3.5 font-semibold text-white hover:bg-white/[.06]">{copy.back}</button>
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-white/[.08] bg-[#151819] p-5">
        <h3 className="mb-2 text-sm font-semibold text-white">{copy.feeTitle}</h3>
        <p className="m-0 text-sm leading-6 text-[#9AA39F]">{copy.feeText}</p>
      </aside>
    </div>
  );
}

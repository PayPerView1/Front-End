'use client';

import { useState } from 'react';
import RefundTopCards from '../components/RefundTopCards';
import RefundInitialState from '../components/RefundInitialState';
import RefundSuccessState from '../components/RefundSuccessState';
import RefundErrorMinState from '../components/RefundErrorMinState';
import RefundErrorMaxState from '../components/RefundErrorMaxState';
import RefundRejectedState from '../components/RefundRejectedState';
import RefundCancelledState from '../components/RefundCancelledState';

export default function RefundPage() {
  const [state, setState] = useState('initial');

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[rgba(17,20,21,1)] text-white p-6 md:p-8"
      style={{ fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif" }}
    >
      {state !== 'cancelled' && state !== 'rejected' && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            استرداد الرصيد المالي غير المستخدم
          </h1>
          <p className="text-[#9A9A9A] text-sm">
            يمكنك استرداد المبالغ غير المستهلكة في ميزانيتك الإعلانية لحسابك المصرفي أو بطاقتك الأصلية بكل أمان وشفافية ودون تعقيد.
          </p>
        </div>
      )}

      <RefundTopCards />

      {state === 'initial'   && <RefundInitialState   onSwitchState={setState} />}
      {state === 'success'   && <RefundSuccessState   onSwitchState={setState} />}
      {state === 'error_min' && <RefundErrorMinState  onSwitchState={setState} />}
      {state === 'error_max' && <RefundErrorMaxState  onSwitchState={setState} />}
      {state === 'rejected'  && <RefundRejectedState  onSwitchState={setState} />}
      {state === 'cancelled' && <RefundCancelledState onSwitchState={setState} />}
    </div>
  );
}

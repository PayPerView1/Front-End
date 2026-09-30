'use client';
import React, { useState } from 'react';
import TopCards from './components/TopCards';
import InitialState from './components/InitialState';
import SuccessState from './components/SuccessState';
import ErrorMinState from './components/ErrorMinState';
import ErrorMaxState from './components/ErrorMaxState';
import RejectedState from './components/RejectedState';
import CancelledState from './components/CancelledState';

export default function RefundPage() {
  const [currentState, setCurrentState] = useState('initial'); // 'initial', 'success', 'error_min', 'error_max', 'rejected', 'cancelled'

  return (
    <div className="min-h-screen bg-[rgba(17,20,21,1)] text-white p-6 md:p-8" dir="rtl" style={{ fontFamily: 'var(--font-cairo), sans-serif' }}>
      
      {/* Dev Tools: State Switcher (For testing/reviewing designs) */}
      <div className="mb-6 bg-[rgba(17,20,21,1)] border border-[rgba(63,73,69,1)] p-3 rounded-lg flex flex-wrap items-center gap-3">
        <span className="text-xs text-[#9A9A9A] font-bold">أداة المطور (اختبار الحالات):</span>
        <button onClick={() => setCurrentState('initial')} className={`text-xs px-3 py-1.5 rounded transition-colors ${currentState === 'initial' ? 'bg-[rgba(148,211,193,1)] text-black font-bold' : 'bg-[rgba(63,73,69,1)] hover:bg-[rgba(63,73,69,1)] text-white'}`}>الافتراضية</button>
        <button onClick={() => setCurrentState('success')} className={`text-xs px-3 py-1.5 rounded transition-colors ${currentState === 'success' ? 'bg-[rgba(148,211,193,1)] text-black font-bold' : 'bg-[rgba(63,73,69,1)] hover:bg-[rgba(63,73,69,1)] text-white'}`}>نجاح الطلب</button>
        <button onClick={() => setCurrentState('error_min')} className={`text-xs px-3 py-1.5 rounded transition-colors ${currentState === 'error_min' ? 'bg-[#E53535] text-white font-bold' : 'bg-[rgba(63,73,69,1)] hover:bg-[rgba(63,73,69,1)] text-white'}`}>خطأ (أقل من الحد)</button>
        <button onClick={() => setCurrentState('error_max')} className={`text-xs px-3 py-1.5 rounded transition-colors ${currentState === 'error_max' ? 'bg-[#E53535] text-white font-bold' : 'bg-[rgba(63,73,69,1)] hover:bg-[rgba(63,73,69,1)] text-white'}`}>خطأ (يتجاوز الرصيد)</button>
        <button onClick={() => setCurrentState('rejected')} className={`text-xs px-3 py-1.5 rounded transition-colors ${currentState === 'rejected' ? 'bg-[#E53535] text-white font-bold' : 'bg-[rgba(63,73,69,1)] hover:bg-[rgba(63,73,69,1)] text-white'}`}>مرفوض</button>
        <button onClick={() => setCurrentState('cancelled')} className={`text-xs px-3 py-1.5 rounded transition-colors ${currentState === 'cancelled' ? 'bg-[rgba(148,211,193,1)] text-black font-bold' : 'bg-[rgba(63,73,69,1)] hover:bg-[rgba(63,73,69,1)] text-white'}`}>تم الإلغاء</button>
      </div>

      {/* Header */}
      {currentState !== 'cancelled' && currentState !== 'rejected' && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">استرداد الرصيد المالي غير المستخدم</h1>
          <p className="text-[#9A9A9A] text-sm">
            يمكنك استرداد المبالغ غير المستهلكة في ميزانيتك الإعلانية لحسابك المصرفي أو بطاقتك الأصلية بكل أمان وشفافية ودون تعقيد.
          </p>
        </div>
      )}

      {/* Top Cards (Visible in most states except maybe rejected/cancelled, but usually they stay. The designs for rejected/cancelled don't show the main header, but they do show TopCards) */}
      <TopCards />

      {/* Main Content State Switcher */}
      {currentState === 'initial' && <InitialState onSwitchState={setCurrentState} />}
      {currentState === 'success' && <SuccessState onSwitchState={setCurrentState} />}
      {currentState === 'error_min' && <ErrorMinState onSwitchState={setCurrentState} />}
      {currentState === 'error_max' && <ErrorMaxState onSwitchState={setCurrentState} />}
      {currentState === 'rejected' && <RejectedState onSwitchState={setCurrentState} />}
      {currentState === 'cancelled' && <CancelledState onSwitchState={setCurrentState} />}
      
    </div>
  );
}

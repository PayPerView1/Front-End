'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/services/authService';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const strengthCount = Object.values(rules).filter(Boolean).length;

  const getStrengthText = () => {
    if (strengthCount === 0) return 'ضعيفة جداً';
    if (strengthCount === 1) return 'ضعيفة';
    if (strengthCount === 2) return 'متوسطة';
    if (strengthCount === 3) return 'جيدة';
    if (strengthCount === 4) return 'قوية';
  };

  const getStrengthTextColor = () => {
    if (strengthCount <= 1) return 'text-[#FF2200]';
    if (strengthCount === 2) return 'text-[#FF6200]';
    if (strengthCount === 3) return 'text-[#E9C349]';
    if (strengthCount === 4) return 'text-[#00B353]';
    return 'text-[#BFC9C4]';
  };

  const CheckIcon = ({ active }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}
    >
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
      {active && (
        <path
          d="M5 8.5L7 10.5L11 5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BFC9C4]">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BFC9C4]">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordMismatch) return;

    if (!token) {
      setErrorMessage('رمز التوثيق (Token) غير متوفر في الرابط. يرجى استخدام الرابط المرسل إلى بريدك الإلكتروني.');
      return;
    }

    if (strengthCount < 4) {
      setErrorMessage('يرجى التأكد من استيفاء جميع شروط كلمة المرور.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      router.push('/done');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col w-full max-w-[480px] rounded-[16px] p-8 gap-[38px] bg-white/[0.02] border border-white/10 shadow-[0_32px_64px_0px_rgba(0,0,0,0.5)] backdrop-blur-[4px]"
    >
      {/* Header Icon */}
      <div className="flex justify-center w-full">
        <div className="relative w-[81.75px] h-[88.59px]">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Header Titles */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-white text-[24px] font-medium leading-[28.8px] font-tajawal">
          تعيين كلمة مرور جديدة
        </h1>
        <p className="text-[#BFC9C4] text-[16px] font-normal leading-[25.6px] text-center font-tajawal">
          الرجاء إدخال كلمة المرور الجديدة الخاصة بك.
        </p>
      </div>

      {/* Server Error Message */}
      {errorMessage && (
        <div className="w-full p-3 rounded-lg border border-[#FF4B04]/60 bg-[#FF4B04]/10 text-white text-sm flex items-center gap-2 animate-in fade-in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFA600" strokeWidth="2" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span className="font-tajawal text-[13px]">{errorMessage}</span>
        </div>
      )}

      {/* Inputs and Validation */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] w-full">

        {/* ── Error Alert Banner (Figma spec) ── */}
        {passwordMismatch && (
          <div
            dir="rtl"
            role="alert"
            aria-live="polite"
            className="
              flex flex-row items-center
              w-full max-w-[583px]
              h-[38px]
              rounded-lg
              py-4 px-[29px] gap-2
              border border-[#FFA600]
              animate-in fade-in slide-in-from-top-1 duration-200
            "
            style={{
              boxShadow: 'inset 0px 1px 0px 0px rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Danger triangle icon — 18.51×16.69px */}
            <svg
              width="18.51"
              height="16.69"
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M9.14 2.07L1.53 15.5C1.19 16.1 1.63 16.86 2.39 16.86H19.61C20.37 16.86 20.81 16.1 20.47 15.5L12.86 2.07C12.5 1.43 11.5 1.43 11.14 2.07H9.14Z"
                stroke="#FFA600"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 7.86V10.86"
                stroke="#FFA600"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="11" cy="13.36" r="0.75" fill="#FFA600" />
            </svg>

            {/* Error text — Tajawal 400 12px uppercase 0.6px tracking */}
            <span
              className="
                font-tajawal font-normal
                text-[12px] leading-[12px] tracking-[0.6px]
                uppercase text-[#FFA600]
                flex-1 text-right
              "
            >
              كلمات المرور غير متطابقة
            </span>
          </div>
        )}

        {/* New Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[#BFC9C4] text-[12px] font-medium leading-[12px] tracking-[0.6px] uppercase text-right">
            كلمة المرور الجديدة
          </label>
          <div className="flex flex-row items-center w-full h-[35px] rounded-lg px-4 border border-white/10 bg-transparent">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/20 text-right disabled:opacity-50"
              dir="rtl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-3 flex-shrink-0 focus:outline-none flex items-center justify-center text-[#BFC9C4] hover:text-white transition-colors"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row items-center justify-between">
            <span className="text-[#BFC9C4] text-[12px] font-medium leading-[12px]">
              قوة كلمة المرور:
            </span>
            <span className={`text-[12px] font-medium leading-[12px] ${getStrengthTextColor()}`}>
              {getStrengthText()}
            </span>
          </div>

          {/* Strength Bars */}
          <div className="flex flex-row items-center gap-[4px] w-full h-[4px]">
            <div className={`flex-1 h-full rounded-full transition-colors duration-300 ${strengthCount >= 1 ? 'bg-[#FF2200]' : 'bg-[#E5E2E1]'}`}></div>
            <div className={`flex-1 h-full rounded-full transition-colors duration-300 ${strengthCount >= 2 ? 'bg-[#FF6200]' : 'bg-[#E5E2E1]'}`}></div>
            <div className={`flex-1 h-full rounded-full transition-colors duration-300 ${strengthCount >= 3 ? 'bg-[#FFC14E]' : 'bg-[#E5E2E1]'}`}></div>
            <div className={`flex-1 h-full rounded-full transition-colors duration-300 ${strengthCount >= 4 ? 'bg-[#00B353]' : 'bg-[#E5E2E1]'}`}></div>
          </div>

          {/* Validation Checklist */}
          <div className="flex flex-col gap-3 mt-2">
            <div className={`flex flex-row items-center gap-2 text-[12px] font-medium leading-[12px] ${rules.length ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}`}>
              <CheckIcon active={rules.length} />
              <span>8 أحرف على الأقل</span>
            </div>
            <div className={`flex flex-row items-center gap-2 text-[12px] font-medium leading-[12px] ${rules.uppercase ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}`}>
              <CheckIcon active={rules.uppercase} />
              <span>حرف كبير واحد على الأقل</span>
            </div>
            <div className={`flex flex-row items-center gap-2 text-[12px] font-medium leading-[12px] ${rules.number ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}`}>
              <CheckIcon active={rules.number} />
              <span>رقم واحد على الأقل</span>
            </div>
            <div className={`flex flex-row items-center gap-2 text-[12px] font-medium leading-[12px] ${rules.special ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}`}>
              <CheckIcon active={rules.special} />
              <span>رمز خاص واحد على الأقل (!@#$%^&*)</span>
            </div>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[#BFC9C4] text-[12px] font-medium leading-[12px] uppercase text-right">
            تأكيد كلمة المرور
          </label>
          <div className={`flex flex-row items-center w-full h-[35px] rounded-lg px-4 border bg-transparent transition-colors duration-200 ${
            passwordMismatch ? 'border-[#FFA600]/70' : 'border-white/10'
          }`}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/20 text-right disabled:opacity-50"
              dir="rtl"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-3 flex-shrink-0 focus:outline-none flex items-center justify-center text-[#BFC9C4] hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || passwordMismatch}
          className="w-full h-[35px] rounded-lg bg-gradient-to-l from-[#FFA600] to-[#FF4B04] text-white text-base font-bold flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التحديث...
            </span>
          ) : (
            'تحديث كلمة المرور'
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordCard() {
  return (
    <Suspense fallback={<div className="text-white">جاري التحميل...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

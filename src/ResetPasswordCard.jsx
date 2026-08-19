'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import walletIcon from './wallet-icon.png';

export default function ResetPasswordCard() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  return (
    <div
      dir="rtl"
      className="flex flex-col w-full max-w-[480px] rounded-[16px] p-8 gap-[38px] bg-white/[0.02] border border-white/10 shadow-[0_32px_64px_0px_rgba(0,0,0,0.5)] backdrop-blur-[4px]"
      style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
    >
      {/* Header Icon / Illustration */}
      <div className="flex justify-center w-full">
        <div className="w-[81.75px] h-[88.59px] flex items-center justify-center">
          <Image
            src={walletIcon}
            alt="Security Wallet"
            width={82}
            height={89}
            className="object-contain"
          />
        </div>
      </div>

      {/* Header Titles */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-white text-[24px] font-medium leading-[28.8px] font-['Tajawal']">
          تعيين كلمة مرور جديدة
        </h1>
        <p className="text-[#BFC9C4] text-[16px] font-normal leading-[25.6px] font-['Tajawal']">
          الرجاء إدخال كلمة المرور الجديدة الخاصة بك.
        </p>
      </div>

      {/* Inputs and Validation Container */}
      <div className="flex flex-col gap-[24px] w-full">

        {/* New Password Input Section */}
        <div className="flex flex-col gap-2">
          <label className="text-[#BFC9C4] text-[12px] font-medium leading-[12px] tracking-[0.6px] uppercase font-['Cairo'] text-right">
            كلمة المرور الجديدة
          </label>
          <div className="flex flex-row items-center w-full h-[35px] rounded-lg px-4 border border-white/10 bg-transparent">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full bg-transparent text-white outline-none font-['Cairo'] text-sm placeholder:text-white/20 text-right"
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

        {/* Password Strength Indicator Section */}
        <div className="flex flex-col gap-4 w-full">
          {/* Header Row */}
          <div className="flex flex-row items-center justify-between">
            <span className="text-[#BFC9C4] text-[12px] font-medium leading-[12px] font-['Cairo']">
              قوة كلمة المرور:
            </span>
            <span className={`text-[12px] font-medium leading-[12px] font-['Cairo'] ${getStrengthTextColor()}`}>
              {getStrengthText()}
            </span>
          </div>

          {/* Strength Bars Container */}
          <div className="flex flex-row items-center gap-[4px] w-full h-[4px]">
            <div className={`flex-1 h-full rounded-full transition-colors duration-300 ${strengthCount >= 1 ? 'bg-[#FF2200]' : 'bg-[#E5E2E1]'}`}></div>
            <div className={`flex-1 h-full rounded-full transition-colors duration-300 ${strengthCount >= 2 ? 'bg-[#FF6200]' : 'bg-[#E5E2E1]'}`}></div>
            <div className={`flex-1 h-full rounded-full transition-colors duration-300 ${strengthCount >= 3 ? 'bg-[#FFC14E]' : 'bg-[#E5E2E1]'}`}></div>
            <div className={`flex-1 h-full rounded-full transition-colors duration-300 ${strengthCount >= 4 ? 'bg-[#00B353]' : 'bg-[#E5E2E1]'}`}></div>
          </div>

          {/* Validation Checklist Requirements */}
          <div className="flex flex-col gap-3 mt-2">
            <div className={`flex flex-row items-center gap-2 text-[12px] font-medium leading-[12px] font-['Cairo'] ${rules.length ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}`}>
              <CheckIcon active={rules.length} />
              <span>8 أحرف على الأقل</span>
            </div>
            <div className={`flex flex-row items-center gap-2 text-[12px] font-medium leading-[12px] font-['Cairo'] ${rules.uppercase ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}`}>
              <CheckIcon active={rules.uppercase} />
              <span>حرف كبير واحد على الأقل</span>
            </div>
            <div className={`flex flex-row items-center gap-2 text-[12px] font-medium leading-[12px] font-['Cairo'] ${rules.number ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}`}>
              <CheckIcon active={rules.number} />
              <span>رقم واحد على الأقل</span>
            </div>
            <div className={`flex flex-row items-center gap-2 text-[12px] font-medium leading-[12px] font-['Cairo'] ${rules.special ? 'text-[#94D3C1]' : 'text-[#BFC9C4]'}`}>
              <CheckIcon active={rules.special} />
              <span>رمز خاص واحد على الأقل (!@#$%^&*)</span>
            </div>
          </div>
        </div>

        {/* Confirm Password Input Section */}
        <div className="flex flex-col gap-2">
          <label className="text-[#BFC9C4] text-[12px] font-medium leading-[12px] uppercase font-['Cairo'] text-right">
            تأكيد كلمة المرور
          </label>
          <div className="flex flex-row items-center w-full h-[35px] rounded-lg px-4 border border-white/10 bg-transparent">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="w-full bg-transparent text-white outline-none font-['Cairo'] text-sm placeholder:text-white/20 text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Submit Action Button */}
      <button
        type="button"
        className="w-full h-[35px] rounded-lg bg-gradient-to-l from-[#FFA600] to-[#FF4B04] text-white text-base font-bold leading-[25.6px] font-['Tajawal'] flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-100"
      >
        تحديث كلمة المرور
      </button>

    </div>
  );
}

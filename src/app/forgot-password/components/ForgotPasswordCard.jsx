'use client';

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { requestForgotPassword } from "@/services/authService";

export default function ForgotPasswordCard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setSuccess('');
    setLoading(true);

    const result = await requestForgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white/[0.02] border border-white/10 rounded-[16px] backdrop-blur-[4px] shadow-[0_32px_64px_0_rgba(0,0,0,0.5)] p-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
      {/* Gap container to maintain exact 38px spacing */}
      <div className="w-full flex flex-col items-center gap-[38px]">

        <div className="relative w-[81.75px] h-[88.59px]">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="rounded-[104px] object-cover"
          />
        </div>

        <h1 className="w-full max-w-[264px] text-center font-bold text-[28px] sm:text-[32px] leading-[38.4px] tracking-[-0.32px] text-white font-tajawal">
          نسيت كلمة المرور؟
        </h1>

        <p className="w-full max-w-[450px] text-center font-normal text-[15px] sm:text-[16px] leading-[26px] text-white font-tajawal">
          أدخل بريدك الإلكتروني المسجل، وسنرسل لك رابطاً لإعادة تعيين كلمة المرور خلال ساعة واحدة.
        </p>

        {/* Feedback messages */}
        {error && (
          <div className="w-full p-3 rounded-lg border border-[#FF4B04]/60 bg-[#FF4B04]/10 text-white text-sm flex items-center gap-2 animate-in fade-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFA600" strokeWidth="2" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full p-3 rounded-lg border border-[#00B353]/60 bg-[#00B353]/10 text-[#94D3C1] text-sm flex items-center gap-2 animate-in fade-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B353" strokeWidth="2" className="flex-shrink-0">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-[583px] flex flex-col items-center gap-[38px]">
          <div className="w-full flex flex-col gap-[10px]">
            <label htmlFor="email" className="text-start font-normal text-[14px] leading-[12px] tracking-[0.6px] uppercase text-[#E1E3E4]">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={loading}
              className="w-full h-[35px] bg-white/[0.05] border border-white/10 rounded-lg px-4 text-white text-sm outline-none focus:border-[#FFA600] transition-colors placeholder:text-white/30 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[35px] rounded-lg bg-gradient-to-r from-[#FFA600] to-[#FF4B04] text-white font-bold text-base flex items-center justify-center gap-2 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(255,75,4,0.4)] transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الإرسال...
              </span>
            ) : (
              'إرسال رابط التعيين'
            )}
          </button>
        </form>

        <Link href="/login" className="flex items-center gap-2 text-[14px] text-[#E1E3E4] hover:text-white transition-colors mt-[-10px]">
          العودة إلى تسجيل الدخول
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>

      </div>
    </div>
  );
}

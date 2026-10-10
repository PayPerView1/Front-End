'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, ArrowRight, FlagOff, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const getContentArea = (anchorEl, locale) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const full = { left: 0, top: 0, width: vw, height: vh };

  const el = anchorEl || document.querySelector('main');
  if (!el) return full;

  const r = el.getBoundingClientRect();
  const left = Math.max(r.left, 0);
  const top = Math.max(r.top, 0);
  let right = Math.min(r.right, vw);
  let contentLeft = left;
  const bottom = Math.min(r.bottom, vh);

  if (vw >= 1280) {
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      const sidebarRect = sidebar.getBoundingClientRect();
      if (locale === 'ar' && sidebarRect.left >= 0 && sidebarRect.left <= vw) {
        right = sidebarRect.left;
      } else if (locale !== 'ar' && sidebarRect.right >= 0 && sidebarRect.right <= vw) {
        contentLeft = sidebarRect.right;
      }
    }
  }

  if (right - contentLeft < 320 || bottom - top < 320) return full;
  return { left: contentLeft, top, width: right - contentLeft, height: bottom - top };
};

const REASONS = [
  { value: 'time_busy', labelKey: 'timeBusy' },
  { value: 'personal_reasons', labelKey: 'personalReasons' },
];

const fmtDateTime = (d, locale) => {
  if (!d) return '';
  const date = new Date(d);
  const formatLocale = locale === 'ar' ? 'ar-u-nu-latn' : locale;
  const day = date.toLocaleDateString(formatLocale, { day: 'numeric', month: 'long', year: 'numeric' });
  const time = date.toLocaleTimeString(formatLocale, { hour: '2-digit', minute: '2-digit', hour12: locale === 'ar' });
  return `${day} (${time})`;
};

export function WithdrawModal({ isOpen, order, onClose, onConfirm, anchorRef }) {
  const [selectedReason, setSelectedReason] = useState(null);
  const [area, setArea] = useState(null);
  const { isDark } = useTheme();
  const locale = useLocale();
  const t = useTranslations('creatorOrders');

  
  useIsoLayoutEffect(() => {
    if (!isOpen) return;
    const measure = () => setArea(getContentArea(anchorRef?.current, locale));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isOpen, anchorRef, locale]);

  // قفل سكرول الصفحة + إغلاق بزر Escape
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order || typeof document === 'undefined') return null;

  const themeText = {
    modal: isDark ? 'bg-[#191c1d] border-[#2b3031] text-white' : 'bg-white border-[#dce3df] text-[#191c1d]',
    inner: isDark ? 'bg-[#1d2122] border-[#2b3031]' : 'bg-[#f4f6f5] border-[#e1e7e4]',
    divider: isDark ? 'border-[#2b3031]' : 'border-[#dce3df]',
    title: isDark ? 'text-white' : 'text-[#191c1d]',
    muted: isDark ? 'text-gray-400' : 'text-[#5f6a66]',
    faint: isDark ? 'text-gray-500' : 'text-[#74817b]',
  };

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      <div
        className={`pointer-events-auto absolute backdrop-blur-sm ${isDark ? 'bg-black/80' : 'bg-black/40'}`}
        style={area ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }}
        onClick={onClose}
      />
      <div
        className="pointer-events-none absolute flex items-center justify-center overflow-hidden p-4 sm:p-8"
        style={area ?? { left: 0, top: 0, width: '100%', height: '100%' }}
      >
      <div
        role="dialog"
        aria-modal="true"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className={`pointer-events-auto relative w-full max-w-[500px] rounded-xl border px-3 pt-8 pb-6 sm:px-5 sm:pt-10 sm:pb-7 ${locale === 'ar' ? 'text-right' : 'text-left'} shadow-2xl ${themeText.modal}`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className={`p-2.5 border rounded-lg shrink-0 ${isDark ? 'bg-[#1d2223] border-[#2b3031]' : 'bg-red-50 border-red-100'}`}>
            <FlagOff size={22} className="text-red-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold mb-1 ${themeText.title}`}>
              {t('withdrawModal.title')}
            </h3>
            <p className={`text-xs leading-relaxed ${themeText.muted}`}>
              {t('withdrawModal.description')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('withdrawModal.close')}
            className={`p-2 rounded-lg border shrink-0 transition-colors ${
              isDark
                ? 'bg-[#1d2223] border-[#2b3031] text-gray-400 hover:text-white hover:bg-[#1f2330]'
                : 'bg-[#f3f6f5] border-[#dce3df] text-[#66736d] hover:text-[#191c1d] hover:bg-[#eef2f0]'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Order summary */}
        <div className={`rounded-lg border p-3 mb-3 ${themeText.inner}`}>
          <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] ${themeText.faint}`}>{t('withdrawModal.applicationId')}</span>
                <span className={`rounded border px-2 py-0.5 font-mono text-[10px] font-bold ${isDark ? 'bg-[#2c2b1e] text-[#E9C349] border-[#4a4220]' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                  {order.code}
                </span>
              </div>
              <span className={`text-xs font-bold ${themeText.title}`}>{order.title}</span>
            </div>

            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] whitespace-nowrap shrink-0 ${isDark ? 'border-amber-500/30 bg-amber-500/10 text-[#e9c349]' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#e9c349]" />
              {t('withdrawModal.pending')}
            </span>
          </div>

          <div className={`mt-2 grid grid-cols-1 gap-3 border-t pt-2 text-[10px] sm:grid-cols-2 ${themeText.muted} ${themeText.divider}`}>
            <div>
              <span className={`block mb-0.5 ${themeText.faint}`}>{t('withdrawModal.submittedAt')}</span>
              <strong className={isDark ? 'text-gray-200' : 'text-[#303a35]'} suppressHydrationWarning>
                {fmtDateTime(order.submittedAt, locale)}
              </strong>
            </div>
            <div>
              <span className={`block mb-0.5 ${themeText.faint}`}>{t('withdrawModal.cpm')}</span>
              <strong className={isDark ? 'text-[#94D3C1]' : 'text-[#1c6b58]'}>
                ${order.cpm} {t('withdrawModal.perThousandViews')}
              </strong>
            </div>
          </div>
        </div>

        {/* Fair policy */}
        <div className={`rounded-lg border p-3 mb-4 flex items-start gap-2.5 ${isDark ? 'bg-[#102420] border-[#1c4b40]' : 'bg-[#eaf5f1] border-[#cce5dc]'}`}>
          <span className={`p-1.5 rounded-md border shrink-0 ${isDark ? 'bg-[#16322c] border-[#1f4a40]' : 'bg-white border-[#cce5dc]'}`}>
            <ShieldCheck size={18} className="text-[#94D3C1]" />
          </span>
          <div className="text-xs leading-relaxed">
            <h4 className={`font-bold mb-1 ${isDark ? 'text-[#94D3C1]' : 'text-[#1c6b58]'}`}>{t('withdrawModal.fairPolicyTitle')}</h4>
            <p className={isDark ? 'text-emerald-100/70' : 'text-[#315d50]'}>
              {t('withdrawModal.policyBeforeApproval')}{' '}
              <strong className={isDark ? 'text-white' : 'text-[#191c1d]'}>{t('withdrawModal.policyNoImpact')}</strong>{' '}
              {t('withdrawModal.policyAfterNoImpact')}
            </p>
          </div>
        </div>

        {/* Reason (optional, no default) */}
        <div className="mb-4">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`text-[11px] font-bold ${themeText.title}`}>{t('withdrawModal.reasonTitle')}</span>
            <span className={`text-[10px] ${themeText.faint}`}>{t('withdrawModal.reasonOptional')}</span>
          </div>

          <div role="radiogroup" aria-label={t('withdrawModal.reasonGroupLabel')} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REASONS.map((r) => {
              const active = selectedReason === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedReason(active ? null : r.value)}
                  className={`flex items-center p-2.5 rounded-lg border text-right text-[11px] gap-2 transition-colors ${
                    active
                      ? isDark ? 'bg-[#122824] border-[#367769] text-white' : 'bg-[#eaf5f1] border-[#78b6a3] text-[#191c1d]'
                      : isDark ? 'bg-[#1d2122] border-[#2b3031] text-gray-300 hover:border-[#3a4244]' : 'bg-white border-[#dce3df] text-[#404945] hover:border-[#bcc8c2]'
                  }`}
                >
                  <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-[#94D3C1]' : isDark ? 'border-[#4a5254]' : 'border-[#b5c0bb]'}`}>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-[#94D3C1]" />}
                  </span>
                  <span>{t(`withdrawModal.reasons.${r.labelKey}`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={`mb-3 flex flex-col gap-2 border-t pt-4 sm:mb-4 sm:flex-row sm:items-center sm:gap-3 ${themeText.divider}`}>
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-2.5 border text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors sm:flex-1 ${
              isDark
                ? 'bg-[#222728] text-gray-300 border-[#303637]'
                : 'bg-[#f3f6f5] text-[#404945] border-[#dce3df]'
            }`}
          >
           <ArrowRight size={16} /> {t('withdrawModal.cancel')}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(order.id, selectedReason)}
            className="w-full py-2.5 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all sm:flex-1"
            style={{ background: 'linear-gradient(90deg, #FC9002 0%, #FB6303 100%)' }}
          >
            <Trash2 size={15} /> {t('withdrawModal.confirm')}
          </button>
        </div>
      </div>
      </div>
    </div>,
    document.body
  );
}
'use client';
import React, { useEffect, useState, useCallback, createContext, useContext, useRef } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

// ─── Toast Context ─────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

let _addToast = null;

/**
 * Global imperative API — usable outside React components.
 * Usage: toast.success("تم الحفظ") / toast.error("حدث خطأ")
 */
export const toast = {
  success: (msg, opts) => _addToast?.({ type: 'success', message: msg, ...opts }),
  error:   (msg, opts) => _addToast?.({ type: 'error',   message: msg, ...opts }),
  warning: (msg, opts) => _addToast?.({ type: 'warning', message: msg, ...opts }),
  info:    (msg, opts) => _addToast?.({ type: 'info',    message: msg, ...opts }),
};

// ─── Config ───────────────────────────────────────────────────────────────────
const VARIANTS = {
  success: {
    icon: FiCheckCircle,
    border: 'border-[#94D3C1]/40',
    iconColor: 'text-[#94D3C1]',
    bar: 'bg-[#94D3C1]',
  },
  error: {
    icon: FiXCircle,
    border: 'border-[#DC2626]/40',
    iconColor: 'text-[#DC2626]',
    bar: 'bg-[#DC2626]',
  },
  warning: {
    icon: FiAlertTriangle,
    border: 'border-[#E9C349]/40',
    iconColor: 'text-[#E9C349]',
    bar: 'bg-[#E9C349]',
  },
  info: {
    icon: FiInfo,
    border: 'border-white/20',
    iconColor: 'text-white/70',
    bar: 'bg-white/40',
  },
};

// ─── Single Toast Item ─────────────────────────────────────────────────────────
function ToastItem({ id, type = 'success', message, duration = 4000, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);
  const v = VARIANTS[type] || VARIANTS.success;
  const Icon = v.icon;

  useEffect(() => {
    // Enter animation
    requestAnimationFrame(() => setVisible(true));

    // Progress bar countdown
    const step = 100 / (duration / 50);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return p - step;
      });
    }, 50);

    // Auto-remove
    const timer = setTimeout(() => handleClose(), duration);
    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(id), 350);
  };

  return (
    <div
      dir="rtl"
      className={`
        relative overflow-hidden flex items-center gap-3
        bg-[#151819] border ${v.border}
        text-white px-4 py-3.5 rounded-2xl shadow-2xl
        min-w-[280px] max-w-[420px] w-full
        transition-all duration-350 ease-out
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
      `}
      style={{ fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif" }}
    >
      {/* Icon */}
      <div className={`shrink-0 ${v.iconColor}`}>
        <Icon size={18} />
      </div>

      {/* Message */}
      <p className="text-sm font-medium flex-1 leading-snug">{message}</p>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="shrink-0 text-white/40 hover:text-white/80 transition-colors ml-1"
      >
        <FiX size={15} />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full">
        <div
          className={`h-full ${v.bar} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── Toast Provider ────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((opts) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, ...opts }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Register global imperative API
  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999999] flex flex-col gap-2 items-center pointer-events-none"
        aria-live="polite"
      >
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── useToast hook ─────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx.addToast;
}

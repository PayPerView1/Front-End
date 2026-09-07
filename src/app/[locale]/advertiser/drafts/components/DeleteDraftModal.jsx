"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { FiTrash2 } from "react-icons/fi";
import DeletingState from "./DeletingState";
import DeleteSuccessModal from "./DeleteSuccessModal";

/**
 * DeleteDraftModal — Flow كامل بـ 3 مراحل:
 *   "confirm"  → تأكيد الحذف (الـ Modal الأصلي)
 *   "deleting" → جاري الحذف  (DeletingState)
 *   "success"  → تم الحذف    (DeleteSuccessModal)
 *
 * Props:
 *   isOpen     – boolean
 *   onClose    – () => void   (يُغلق كل شيء)
 *   onConfirm  – () => void   (يُطلق الحذف الفعلي في الـ state الخارجي)
 *   draftTitle – string (optional)
 */
export default function DeleteDraftModal({ isOpen, onClose, onConfirm, draftId, draftTitle }) {
  // "confirm" | "deleting" | "success"
  const [phase, setPhase]       = useState("confirm");
  const [deleteError, setDeleteError] = useState(null);

  /* ---- إغلاق بـ Escape فقط في مرحلة confirm ---- */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && phase === "confirm") onClose();
    },
    [onClose, phase]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  /* إعادة الـ phase عند فتح الـ Modal من جديد */
  useEffect(() => {
    if (isOpen) {
      setPhase("confirm");
      setDeleteError(null);
    }
  }, [isOpen]);

  /* ---- Confirm: confirm → deleting → (success | error) ---- */
  const handleConfirm = async () => {
    setPhase("deleting");
    setDeleteError(null);
    try {
      // API call حقيقي — يحذف من الـ server ويُحدث الـ state
      await onConfirm(draftId);
      setPhase("success");
    } catch (err) {
      setDeleteError(err.message || "فشل حذف المسودة، يرجى المحاولة مجدداً");
      setPhase("confirm");
    }
  };

  /* ---- Back: أغلق الـ modal بعد مرحلة النجاح ---- */
  const handleBack = () => {
    onClose();
  };

  if (!isOpen) return null;

  /* ---- حسب الـ phase: يُحدد هل الـ Backdrop قابل للإغلاق ---- */
  const backdropClickable = phase === "confirm";

  const modal = (
    <div
      id="delete-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-heading"
      dir="rtl"
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (backdropClickable && e.target === e.currentTarget) onClose();
      }}
    >
      {/* ========================= Modal Box ========================= */}
      <div
        id="delete-modal-box"
        className="flex flex-col items-center text-center"
        style={{
          width: "448px",
          maxWidth: "calc(100vw - 32px)",
          /* padding يتغير حسب الـ phase لإعطاء المساحة الصحيحة */
          padding:
            phase === "confirm"
              ? "40px 32px 32px"
              : "52px 32px",
          gap: phase === "confirm" ? "24px" : "0px",
          background: "rgba(17, 20, 21, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
          borderRight: "none",
          borderBottom: "none",
          boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.4)",
          animation: "modalIn 0.2s ease",
          minHeight: "220px",
          justifyContent: "center",
          transition: "padding 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ============ Phase: confirm ============ */}
        {phase === "confirm" && (
          <>
            {/* Warning Icon */}
            <div
              aria-hidden="true"
              style={{
                width: "47px",
                height: "47px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="47" height="47" viewBox="0 0 47 47"
                fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="23.5" cy="23.5" r="23.5" fill="rgba(255,59,48,0.10)" />
                <circle cx="23.5" cy="23.5" r="17"   fill="rgba(255,59,48,0.14)" />
                <path
                  d="M23.5 15L35.5 35H11.5L23.5 15Z"
                  fill="rgba(255,59,48,0.15)"
                  stroke="#FF3B30"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <rect x="22.5" y="22" width="2" height="7" rx="1" fill="#FF3B30" />
                <circle cx="23.5" cy="31.5" r="1.2" fill="#FF3B30" />
              </svg>
            </div>

            {/* Heading */}
            <h2
              id="delete-modal-heading"
              style={{
                fontFamily: "var(--font-tajawal)",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "28.8px",
                letterSpacing: "0px",
                color: "#E1E3E4",
                margin: 0,
                maxWidth: "281px",
              }}
            >
              هل أنت متأكد من حذف هذه المسودة؟
            </h2>

            {/* Sub-description */}
            <p
              style={{
                fontFamily: "var(--font-tajawal)",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "25.6px",
                color: "#BFC9C4",
                margin: 0,
              }}
            >
              لا يمكن التراجع عن هذا الإجراء
            </p>

            {/* Error Message */}
            {deleteError && (
              <p
                style={{
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "14px",
                  color: "#f87171",
                  margin: 0,
                  padding: "10px 14px",
                  background: "rgba(248,113,113,0.08)",
                  borderRadius: "8px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {deleteError}
              </p>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full" style={{ marginTop: "8px" }}>
              {/* Cancel */}
              <button
                id="delete-modal-cancel"
                type="button"
                onClick={onClose}
                className="flex items-center justify-center transition-all duration-200 cursor-pointer"
                style={{
                  flex: 1,
                  height: "46px",
                  padding: "13px 24px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "transparent",
                  fontFamily: "var(--font-tajawal)",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#E1E3E4",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background  = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background  = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                }}
              >
                إلغاء
              </button>

              {/* Confirm Delete */}
              <button
                id="delete-modal-confirm"
                type="button"
                onClick={handleConfirm}
                className="flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                style={{
                  flex: 1,
                  height: "46px",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#FF0000",
                  boxShadow: "inset 0px 1px 0px rgba(255,255,255,0.2)",
                  fontFamily: "var(--font-tajawal)",
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E60000";
                  e.currentTarget.style.boxShadow  =
                    "inset 0px 1px 0px rgba(255,255,255,0.2), 0 4px 16px rgba(255,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FF0000";
                  e.currentTarget.style.boxShadow  =
                    "inset 0px 1px 0px rgba(255,255,255,0.2)";
                }}
              >
                <FiTrash2 size={16} strokeWidth={2.2} />
                حذف نهائي
              </button>
            </div>
          </>
        )}

        {/* ============ Phase: deleting ============ */}
        {phase === "deleting" && <DeletingState />}

        {/* ============ Phase: success ============ */}
        {phase === "success" && <DeleteSuccessModal onBack={handleBack} />}

      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}

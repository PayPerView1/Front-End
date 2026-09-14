"use client";

import { FiCheckCircle } from "react-icons/fi";

/**
 * DeleteSuccessModal
 * يُعرض بعد اكتمال الحذف — آخر مرحلة في الـ flow
 * Props:
 *   onBack – () => void  (إغلاق الـ Modal والرجوع)
 */
export default function DeleteSuccessModal({ onBack }) {
  return (
    <div
      id="delete-success-content"
      dir="rtl"
      className="flex flex-col items-center justify-center gap-6"
      style={{ animation: "successIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      {/* ---- Success Icon Container ---- */}
      <div
        aria-hidden="true"
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "9999px",
          background: "rgba(15, 188, 95, 0.09)",
          border: "1px solid rgba(15, 188, 95, 0.20)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <FiCheckCircle
          size={30}
          color="#0FBC5F"
          strokeWidth={2}
        />
      </div>

      {/* ---- Heading ---- */}
      <h2
        style={{
          fontFamily: "var(--font-tajawal)",
          fontWeight: 700,
          fontSize: "24px",
          lineHeight: "28.8px",
          letterSpacing: "0px",
          color: "#E1E3E4",
          margin: 0,
          textAlign: "center",
          maxWidth: "245px",
        }}
      >
        تم حذف المسودة بنجاح
      </h2>

      {/* ---- Back Button ---- */}
      <button
        id="delete-success-back-btn"
        type="button"
        onClick={onBack}
        className="flex items-center justify-center transition-all duration-200 cursor-pointer"
        style={{
          width: "100%",
          maxWidth: "383px",
          height: "46px",
          padding: "12px 24px 8px",
          gap: "8px",
          borderRadius: "8px",
          border: "none",
          background: "#FE6B02",
          boxShadow: "inset 0px 1px 0px rgba(255, 255, 255, 0.2)",
          fontFamily: "var(--font-tajawal)",
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0px",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background  = "#e56002";
          e.currentTarget.style.boxShadow   =
            "inset 0px 1px 0px rgba(255,255,255,0.2), 0 4px 16px rgba(254,107,2,0.40)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background  = "#FE6B02";
          e.currentTarget.style.boxShadow   =
            "inset 0px 1px 0px rgba(255, 255, 255, 0.2)";
        }}
      >
        الرجوع للمسودات
      </button>

      {/* ---- Entry animation ---- */}
      <style>{`
        @keyframes successIn {
          from { opacity: 0; transform: scale(0.80); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>
    </div>
  );
}

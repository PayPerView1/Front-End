"use client";

/**
 * DeletingState
 * يُعرض داخل الـ Modal عند الضغط على "حذف نهائي"
 * — 3 أعمدة برتقالية متحركة + نص "جاري الحذف..."
 */
export default function DeletingState() {
  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center gap-6"
      style={{ padding: "8px 0" }}
    >
      {/* ---- Animated Bars ---- */}
      <div
        className="flex items-end justify-center"
        style={{ gap: "8px", height: "48px" }}
        aria-label="جاري الحذف"
        role="status"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "48px",
              borderRadius: "999px",
              background: "#FE6B02",
              animation: `deletingBar 1s ease-in-out ${i * 0.12}s infinite`,
              transformOrigin: "center bottom",
            }}
          />
        ))}
      </div>

      {/* ---- Status Text ---- */}
      <p
        style={{
          fontFamily: "var(--font-tajawal)",
          fontWeight: 700,
          fontSize: "24px",
          lineHeight: "28.8px",
          letterSpacing: "0px",
          color: "#FFFFFF",
          margin: 0,
          textAlign: "center",
          width: "180px",
        }}
      >
        جاري الحذف...
      </p>

      {/* ---- Keyframes ---- */}
      <style>{`
        @keyframes deletingBar {
          0%, 100% {
            transform: scaleY(0.35);
            opacity: 0.45;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

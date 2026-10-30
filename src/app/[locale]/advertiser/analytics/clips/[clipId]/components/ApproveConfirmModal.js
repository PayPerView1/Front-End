"use client";
import { useEffect } from "react";
import {
  MdOutlineClose,
  MdOutlineInfo,
  MdOutlineVerified,
  MdOutlineToggleOn,
  MdOutlineQueryStats,
  MdOutlineNotificationsActive,
  MdOutlineTaskAlt,
} from "react-icons/md";

const MINT = "#94D3C1";
const GOLD = "#E9C349";
const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";

export default function ApproveConfirmModal({
  t, // نفس كائن الثيم المستخدم في الصفحة (card, border, field, text, subText)
  tr, // useTranslations("clipDetail")
  amount, // نص جاهز مثل "78.10"
  campaignName, // اسم الحملة حسب اللغة
  campaignCode, // مثال: "CAM-2026-88"
  clipCode, // مثال: "SUB-8812"
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  return (
    // lg:start-[260px] = عرض السايدبار، عدّله حسب السايدبار عندكم
    <div
      className="fixed inset-y-0 end-0 start-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm lg:start-[260px]"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-modal-title"
        className={`max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-6 ${t.card} ${t.border}`}
      >
        {/* الرأس */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${t.field}`}
              >
                <MdOutlineVerified size={24} color={MINT} />
              </span>
              <span
  className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
  style={{ background: GOLD }}
/>
            </div>
            <div className="min-w-0">
              <h3
                id="approve-modal-title"
                className={`text-base font-extrabold sm:text-lg ${t.text}`}
              >
                {tr("approveModal.title")}
              </h3>
              {/* الفقرة تتبع اتجاه الصفحة، والأكواد لحالها LTR عشان ما ينقلب الترتيب */}
              <p className={`mt-0.5 text-[11px] leading-5 ${t.subText}`}>
                {tr("approveModal.campaign")}: {campaignName}{" "}
                <span dir="ltr">(#{campaignCode})</span> ·{" "}
                {tr("approveModal.clip")}: <span dir="ltr">#{clipCode}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label={tr("confirm.cancel")}
            onClick={onCancel}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors hover:border-[#94D3C1] ${t.field} ${t.text}`}
          >
            <MdOutlineClose size={16} />
          </button>
        </div>

        {/* رسالة التأكيد */}
        <div
          className="mt-5 flex items-start gap-3 rounded-xl border p-3.5"
          style={{
            background: "rgba(148,211,193,0.08)",
            borderColor: "rgba(148,211,193,0.35)",
          }}
        >
          <MdOutlineInfo size={18} color={MINT} className="mt-0.5 shrink-0" />
          <p className={`text-xs leading-6 ${t.subText}`}>
            {tr("approveModal.question")}
          </p>
        </div>

        {/* الإجراءات التلقائية */}
        <p className={`mt-5 text-[11px] font-bold ${t.subText}`}>
          {tr("approveModal.autoTitle")}
        </p>

        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div
            className={`flex items-center gap-3 rounded-xl border p-3.5 ${t.field}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${t.border}`}
            >
              <MdOutlineToggleOn size={20} color={MINT} />
            </span>
            <div className="min-w-0">
              <p className={`text-[10px] ${t.subText}`}>
                {tr("approveModal.statusLabel")}
              </p>
              <p
                className={`mt-0.5 flex items-center gap-1.5 text-xs font-bold ${t.text}`}
              >
                {tr("approveModal.statusValue")}
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: MINT }}
                />
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border p-3.5 ${t.field}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${t.border}`}
            >
              <MdOutlineQueryStats size={18} color={MINT} />
            </span>
            <div className="min-w-0">
              <p className={`text-[10px] ${t.subText}`}>
                {tr("approveModal.trackLabel")}
              </p>
              <p className={`mt-0.5 text-xs font-bold ${t.text}`}>
                {tr("approveModal.trackValue")}
              </p>
            </div>
          </div>
        </div>

        {/* إشعار صانع المحتوى */}
        <div className={`mt-3 rounded-xl border p-3.5 ${t.field}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${t.border}`}
              >
                <MdOutlineNotificationsActive size={18} color={MINT} />
              </span>
              <p className={`text-xs font-bold ${t.text}`}>
                {tr("approveModal.notifyTitle")}
              </p>
            </div>
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-bold"
              style={{ background: `${MINT}26`, color: MINT }}
            >
              {tr("approveModal.notifyBadge")}
            </span>
          </div>
          <p
            className={`mt-3 rounded-lg border px-3 py-2 text-[11px] leading-5 ${t.border} ${t.subText}`}
          >
            {tr("approveModal.notifyMsg")}
          </p>
        </div>

        {/* الأزرار */}
        <div className="mt-6 grid gap-3 sm:grid-cols-[1.6fr_1fr]">
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: ORANGE }}
          >
            <MdOutlineTaskAlt size={17} />
            {tr("approveModal.confirmBtn", { amount })}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-bold transition-colors hover:border-[#94D3C1] ${t.field} ${t.text}`}
          >
            <MdOutlineClose size={15} />
            {tr("approveModal.cancelBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
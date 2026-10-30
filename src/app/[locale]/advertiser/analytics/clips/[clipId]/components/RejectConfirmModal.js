"use client";
import { useEffect, useState } from "react";
import {
  MdOutlineClose,
  MdOutlineCancel,
  MdOutlineInfo,
  MdOutlineCheckCircleOutline,
  MdOutlineEdit,
  MdOutlineSend,
} from "react-icons/md";

const MINT = "#94D3C1";
const GOLD = "#E9C349";
const RED = "#DC2626";
const ORANGE = "#FF6A1A";
const MAX_NOTE = 500;

const REASONS = ["01", "02", "03", "04", "99"];

export default function RejectConfirmModal({
  t, // ثيم الصفحة
  tr, // useTranslations("clipDetail")
  clipCode, // مثال: "SUB-8812"
  creatorName,
  refundAmount, // نص جاهز مثل "750"
  onConfirm, // ({ reason, note }) => void
  onCancel,
}) {
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState("");

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

  // السبب "آخر" لازم يكتب توضيح
  const canSubmit = !!reason && (reason !== "99" || note.trim().length > 0);

  const submit = () => {
    if (!canSubmit) return;
    onConfirm({ reason, note: note.trim() });
  };

  return (
    <div
      className="fixed inset-y-0 end-0 start-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm lg:start-[260px]"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-modal-title"
        className={`max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl ${t.card} ${t.border}`}
      >
        {/* الرأس */}
        <div
          className={`flex items-start justify-between gap-3 border-b p-3 sm:p-4 ${t.border}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
              style={{
                background: "rgba(220,38,38,0.12)",
                borderColor: "rgba(220,38,38,0.4)",
              }}
            >
              <MdOutlineCancel size={22} color="#F2554D" />
            </span>
            <div className="min-w-0">
              <h3
                id="reject-modal-title"
                className={`text-base font-extrabold sm:text-lg ${t.text}`}
              >
                {tr("rejectModal.title")}
              </h3>
              <p className={`mt-0.5 text-[11px] ${t.subText}`}>
                {tr("rejectModal.clip")} <span dir="ltr">#{clipCode}</span> ·{" "}
                {tr("rejectModal.creator")}: {creatorName}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label={tr("rejectModal.cancelBtn")}
            onClick={onCancel}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 ${t.text}`}
          >
            <MdOutlineClose size={16} />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {/* تنبيه الرفض */}
          <div
            className="flex items-start gap-2.5 rounded-xl border p-3 text-[11px] leading-5"
            style={{
              background: "rgba(220,38,38,0.1)",
              borderColor: "rgba(220,38,38,0.35)",
            }}
          >
            <MdOutlineInfo
              size={16}
              color="#F2554D"
              className="mt-0.5 shrink-0"
            />
            <p className={t.subText}>
              <b className={t.text}>{tr("rejectModal.warnLead")}</b>{" "}
              {tr("rejectModal.warnPrefix")}{" "}
              <b style={{ color: GOLD }}>
                ({refundAmount} {tr("finance.sar")})
              </b>{" "}
              {tr("rejectModal.warnSuffix")}
            </p>
          </div>

          {/* الأسباب */}
          <p
            className={`mt-3 flex items-center gap-2 text-xs font-extrabold ${t.text}`}
          >
            <MdOutlineCheckCircleOutline size={16} color={MINT} />
            {tr("rejectModal.reasonTitle")}
          </p>

          <div
            role="radiogroup"
            aria-label={tr("rejectModal.reasonTitle")}
            className="mt-2 grid gap-2 sm:grid-cols-2"
          >
            {REASONS.map((code) => {
              const selected = reason === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setReason(code)}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-start transition-colors ${
                    selected ? "" : "hover:border-[#94D3C1]/50"
                  } ${t.field}`}
                  style={
                    selected
                      ? {
                          borderColor: "rgba(255,106,26,0.6)",
                          background: "rgba(255,106,26,0.08)",
                        }
                      : undefined
                  }
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: selected ? ORANGE : "#4B5563",
                    }}
                  >
                    {selected && (
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: ORANGE }}
                      />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-xs font-bold ${selected ? "" : t.text}`}
                      style={selected ? { color: ORANGE } : undefined}
                    >
                      {tr(`rejectModal.reasons.r${code}.title`)}
                    </span>
                    <span className={`mt-0.5 block text-[11px] ${t.subText}`}>
                      {tr(`rejectModal.reasons.r${code}.desc`)}
                    </span>
                  </span>

                  <span
                    dir="ltr"
                    className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${t.border} ${t.subText}`}
                  >
                    {tr("rejectModal.code")} {code}
                  </span>
                </button>
              );
            })}
          </div>

          {/* التوضيح */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <label
              htmlFor="reject-note"
              className={`flex items-center gap-2 text-xs font-bold ${t.text}`}
            >
              <MdOutlineEdit size={15} color={MINT} />
              {tr("rejectModal.noteLabel")}
            </label>
            <span dir="ltr" className={`text-[10px] ${t.subText}`}>
              {note.length} / {MAX_NOTE} {tr("rejectModal.chars")}
            </span>
          </div>

          <textarea
            id="reject-note"
            value={note}
            maxLength={MAX_NOTE}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder={tr("rejectModal.notePlaceholder")}
            className={`mt-1.5 w-full resize-none rounded-xl border p-2 text-xs leading-5 outline-none transition-colors focus:border-[#94D3C1] ${t.field} ${t.text}`}
          />

          <p
            className={`mt-1 flex items-center gap-1.5 text-[10px] ${t.subText}`}
          >
            <MdOutlineSend size={12} className={isRtlFlip()} />
            {tr("rejectModal.noteHint")}
          </p>

          {/* الأزرار */}
          <div className="mt-3 grid gap-2 sm:grid-cols-[1.6fr_1fr]">
            <button
              type="button"
              disabled={!canSubmit}
              onClick={submit}
              className="flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: RED }}
            >
              {tr("rejectModal.confirmBtn")}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`flex h-10 items-center justify-center rounded-xl border text-xs font-bold transition-colors hover:border-[#94D3C1] ${t.field} ${t.text}`}
            >
              {tr("rejectModal.cancelBtn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// أيقونة الإرسال تنعكس في الـ RTL
function isRtlFlip() {
  return "rtl:-scale-x-100";
}

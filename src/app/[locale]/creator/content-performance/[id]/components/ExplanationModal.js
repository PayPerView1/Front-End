"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { FiX, FiCheckCircle, FiPaperclip } from "react-icons/fi";

const darkTheme = {
  overlay: "bg-black/70",
  box: "border-white/10 bg-[#191C1D]",
  title: "text-white",
  muted: "text-gray-400",
  input: "border-white/10 bg-[#232729] text-white placeholder:text-gray-500 focus:border-[#8FE3C8]/50",
  close: "text-gray-400 hover:bg-white/10",
  file: "border-white/10 text-gray-300 hover:bg-white/5",
  cancel: "bg-white/10 text-white hover:bg-white/20",
  success: "bg-[#8FE3C8]/10 text-[#8FE3C8]",
  error: "text-[#F87171]",
};

const lightTheme = {
  overlay: "bg-black/40",
  box: "border-[#E5E7E7] bg-white",
  title: "text-[#1A1A1A]",
  muted: "text-[#666666]",
  input: "border-[#E5E7E7] bg-[#EEF3F2] text-[#1A1A1A] placeholder:text-[#8A8A8A] focus:border-[#2F9E83]/50",
  close: "text-[#666666] hover:bg-black/5",
  file: "border-[#E5E7E7] text-[#666666] hover:bg-black/5",
  cancel: "bg-black/5 text-[#1A1A1A] hover:bg-black/10",
  success: "bg-[#2F9E83]/10 text-[#2F9E83]",
  error: "text-[#DC2626]",
};

const MAX_FILE_MB = 5;

export default function ExplanationModal({ clip, onClose }) {
  const tr = useTranslations("contentPerformance.details.explain");
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(tr("fileTooBig", { size: MAX_FILE_MB }));
      return;
    }
    setError("");
    setFile(f);
  };

  const submit = async () => {
    if (text.trim().length < 10) {
      setError(tr("tooShort"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const body = new FormData();
      body.append("clipId", clip.id);
      body.append("message", text.trim());
      if (file) body.append("file", file);

      // غيّري الرابط لـ API الحقيقي عندك
      const res = await fetch("/api/clips/explanation", {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setError(tr("failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${sidebarPad} ${t.overlay}`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg space-y-4 rounded-2xl border p-6 ${t.box}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={`text-lg font-extrabold ${t.title}`}>
              {tr("title")}
            </h3>
            <p className={`mt-1 text-xs leading-6 ${t.muted}`}>{tr("desc")}</p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 transition ${t.close}`}
            aria-label={tr("close")}
          >
            <FiX size={18} />
          </button>
        </div>

        {done ? (
          <div
            className={`flex items-center gap-3 rounded-xl p-4 text-sm ${t.success}`}
          >
            <FiCheckCircle size={20} />
            {tr("success")}
          </div>
        ) : (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder={tr("placeholder")}
              className={`w-full resize-none rounded-xl border p-3 text-sm outline-none transition ${t.input}`}
            />

            <label
              className={`flex w-fit cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${t.file}`}
            >
              <FiPaperclip size={14} />
              {file ? file.name : tr("attach")}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={onFile}
                className="hidden"
              />
            </label>

            {error && <p className={`text-xs ${t.error}`}>{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className={`rounded-xl px-4 py-2 text-sm transition ${t.cancel}`}
              >
                {tr("cancel")}
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="rounded-xl bg-[linear-gradient(90deg,#FB8B03_0%,#FA6203_100%)] px-5 py-2 text-sm font-bold text-white transition disabled:opacity-60"
              >
                {loading ? tr("sending") : tr("send")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
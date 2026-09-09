"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { BsStars } from "react-icons/bs";
import { FiUsers, FiMic, FiSend, FiPlus, FiX } from "react-icons/fi";
import { MdCampaign, MdLiveTv, MdReceiptLong } from "react-icons/md";
import { useAssistant } from "@/context/AssistantContext";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";

const ACTION_ITEMS = [
  { id: "messageMembers", icon: FiUsers },
  { id: "createAd", icon: MdCampaign },
  { id: "startLive", icon: MdLiveTv },
  { id: "sendInvoice", icon: MdReceiptLong },
];

export default function AIAssistantPanel({ side = "left" }) {
  const { isAssistantOpen, closeAssistant } = useAssistant();
  const { isDark } = useTheme();
  const locale = useLocale();
  const t = useTranslations("assistant");
  const isAr = locale === "ar";
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!selectedFile?.type.startsWith("image/")) {
      return undefined;
    }

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(String(reader.result));
    reader.readAsDataURL(selectedFile);

    return () => reader.abort();
  }, [selectedFile]);

  if (!isAssistantOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage("");
  };

  const sideClass =
    side === "left"
      ? "left-0 right-0 xl:right-auto xl:border-r"
      : "right-0 left-0 xl:left-auto xl:border-l";

  return (
    <aside
      className={`ai-panel fixed top-14 h-[calc(100vh-56px)] w-full xl:max-w-[380px] z-40 flex flex-col justify-between overflow-y-auto px-4 sm:px-8 md:px-12 xl:px-4 py-6 border ${
        isDark ? "border-white/10" : "border-[#E5E5E5]"
      } ${sideClass}`}
      data-side={side}
      style={{
        backgroundColor: isDark ? "#0A0812" : "#FFFFFF",
        boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
        backgroundImage:
          isDark
            ? "linear-gradient(180deg, rgba(142, 3, 255, 0.18) 0%, rgba(0, 0, 0, 0.18) 86.54%)"
            : "linear-gradient(180deg, rgba(148, 211, 193, 0.18) 0%, rgba(255, 255, 255, 0.96) 86.54%)",
      }}
    >
      {/* زر الإغلاق */}
      <button
        type="button"
        onClick={closeAssistant}
        className={`absolute top-6 ${isAr ? "left-4 sm:left-6 md:left-8 xl:left-3" : "right-4 sm:right-6 md:right-8 xl:right-3"} w-8 h-8 xl:w-7 xl:h-7 flex items-center justify-center rounded-full transition-colors z-50 ${
          isDark
            ? "bg-white/10 text-gray-300 hover:bg-white/20"
            : "bg-black/5 text-gray-600 hover:bg-black/10"
        }`}
        aria-label={t("close")}
      >
        <FiX className="w-4 h-4" />
      </button>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl md:max-w-2xl xl:max-w-xl mx-auto my-auto py-4">
        {/* أيقونة النجمة */}
        <div className={`w-12 h-12 md:w-16 md:h-16 xl:w-12 xl:h-12 rounded-2xl flex items-center justify-center mb-4 md:mb-6 xl:mb-4 border ${
          isDark
            ? "bg-white/10 border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.35)]"
            : "bg-[#94D3C1]/20 border-[#94D3C1]/40 shadow-[0_0_30px_rgba(148,211,193,0.25)]"
        }`}>
          <BsStars className={`w-5 h-5 md:w-7 md:h-7 xl:w-5 xl:h-5 ${isDark ? "text-white" : "text-[#2A9D8F]"}`} />
        </div>

        {/* العنوان */}
        <h1 className={`text-base sm:text-lg md:text-2xl xl:text-lg font-bold text-center mb-2 px-2 ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
          {t("title")}
        </h1>
        <p className={`text-xs md:text-sm xl:text-xs text-center leading-relaxed mb-6 md:mb-8 xl:mb-6 max-w-lg px-2 ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
          {t("description")}
        </p>

        {/* بطاقات الإجراءات السريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 xl:gap-2.5 w-full">
          {ACTION_ITEMS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`flex flex-col items-start text-right gap-1.5 rounded-xl md:rounded-2xl border p-3.5 md:p-4 xl:p-3 transition-colors ${
                isDark
                  ? "bg-white/4 border-white/10 hover:bg-white/7"
                  : "bg-white/70 border-[#E5E5E5] hover:bg-[#F5F5F5]"
              }`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 xl:w-4 xl:h-4 text-orange-400 shrink-0" />
              <span className={`text-[11px] sm:text-xs md:text-sm xl:text-[11px] font-bold leading-snug ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                {t(`actions.${id}.title`)}
              </span>
              <span className={`text-[10px] sm:text-[11px] md:text-xs xl:text-[10px] leading-snug ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
                {t(`actions.${id}.desc`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* شريط الإدخال السفلي */}
      <div className="relative z-10 w-full max-w-xl md:max-w-2xl xl:max-w-xl mx-auto mt-4 md:mt-6">
        <form
          onSubmit={handleSend}
          className={`flex flex-col rounded-2xl border px-3 py-2.5 md:p-3 xl:py-2 backdrop-blur-sm gap-2 ${
            isDark ? "bg-white/6 border-white/10" : "bg-white/80 border-[#E5E5E5]"
          }`}
        >
          {/* معاينة الملف */}
          {selectedFile && (
            <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${
              isDark ? "bg-white/10 border-white/10" : "bg-[#F5F5F5] border-[#E5E5E5]"
            }`}>
              {selectedFile.type.startsWith("image/") && previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={t("preview")}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                  <FiPlus className={`w-3.5 h-3.5 rotate-45 ${isDark ? "text-gray-300" : "text-gray-500"}`} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-medium truncate ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>{selectedFile.name}</p>
                <p className={`text-[9px] ${isDark ? "text-gray-400" : "text-[#666666]"}`}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className={`transition-colors shrink-0 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* شريط الإدخال والتحكم */}
          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="w-8 h-8 md:w-9 md:h-9 xl:w-7 xl:h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FFA600] to-[#FF4B04] text-white shrink-0 border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              <FiSend className="w-4 h-4 md:w-4 md:h-4 xl:w-3.5 xl:h-3.5 -rotate-25 translate-y-[1.5px]" />
            </button>

            <button
              type="button"
              className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${
                isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FiMic className="w-4 h-4 md:w-5 md:h-5 xl:w-4 xl:h-4" />
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("placeholder")}
              className={`flex-1 min-w-0 bg-transparent text-xs sm:text-sm md:text-base xl:text-xs outline-none text-right ${
                isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
              }`}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${
                isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FiPlus className="w-4 h-4 md:w-5 md:h-5 xl:w-4 xl:h-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
                e.target.value = "";
              }}
            />
          </div>
        </form>

        <p className={`text-center text-[9px] sm:text-[10px] md:text-xs xl:text-[9px] mt-2 px-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
          {t("disclaimer")}
        </p>
      </div>
    </aside>
  );
}
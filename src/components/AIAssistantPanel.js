"use client";

import { useState, useRef } from "react";
import { BsStars } from "react-icons/bs";
import { FiUsers, FiMic, FiSend, FiPlus, FiX } from "react-icons/fi";
import { MdCampaign, MdLiveTv, MdReceiptLong } from "react-icons/md";
import { useAssistant } from "@/context/AssistantContext";
import { useTheme } from "@/context/ThemeContext";

const actions = [
  {
    icon: FiUsers,
    title: "مراسلة أحدث الأعضاء",
    desc: "صياغة رسالة ترحيب للمشتركين الجدد",
  },
  {
    icon: MdCampaign,
    title: "إنشاء إعلان إبداعي",
    desc: "توليد نصوص إعلانية جذابة لحملتك القادمة",
  },
  {
    icon: MdLiveTv,
    title: "البدء ببث مباشر",
    desc: "إعداد جلسة بث مباشر للتواصل مع جمهورك",
  },
  {
    icon: MdReceiptLong,
    title: "إرسال فاتورة لعميل",
    desc: "إنشاء وإرسال فاتورة احترافية بسرعة",
  },
];

export default function AIAssistantPanel({ side = "left" }) {
  const { isAssistantOpen, closeAssistant } = useAssistant();
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isAssistantOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // هون بتحطي منطق إرسال الرسالة الفعلي
    setMessage("");
  };

  const sideClass = side === "left" ? "left-0 border-l" : "right-0 border-r";

  return (
    <aside
      className={`fixed top-[64px] h-[calc(100vh-64px)] w-full max-w-full sm:w-[380px] z-40 flex flex-col justify-between overflow-y-auto px-4 py-6 border ${
        isDark ? "border-white/10" : "border-[#E5E5E5]"
      } ${sideClass}`}
      style={{
        backgroundColor: isDark ? "#0A0812" : "#FFFFFF",
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
        className={`absolute top-6 left-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors z-50 ${
          isDark
            ? "bg-white/10 text-gray-300 hover:bg-white/20"
            : "bg-black/5 text-gray-600 hover:bg-black/10"
        }`}
        aria-label="إغلاق المساعد"
      >
        <FiX className="w-4 h-4" />
      </button>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center w-full mt-20">
        {/* أيقونة النجمة */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${
          isDark
            ? "bg-white/10 border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.35)]"
            : "bg-[#94D3C1]/20 border-[#94D3C1]/40 shadow-[0_0_30px_rgba(148,211,193,0.25)]"
        }`}>
          <BsStars className={`w-5 h-5 ${isDark ? "text-white" : "text-[#2A9D8F]"}`} />
        </div>

        {/* العنوان */}
        <h1 className={`text-lg font-bold text-center mb-2 px-2 ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
          كيف يمكنني مساعدتك اليوم؟
        </h1>
        <p className={`text-xs text-center leading-relaxed mb-6 px-2 ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
          أنا المساعد الذكي الخاص بك، يمكنني مساعدتك في إنشاء المحتوى، إدارة
          حسابك، أو الإجابة على أي استفسارات.
        </p>

        {/* بطاقات الإجراءات السريعة */}
        <div className="grid grid-cols-2 gap-2.5 w-full">
          {actions.map(({ icon: Icon, title, desc }) => (
            <button
              key={title}
              type="button"
              className={`flex flex-col items-start text-right gap-1.5 rounded-xl border p-3 transition-colors ${
                isDark
                  ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.07]"
                  : "bg-white/70 border-[#E5E5E5] hover:bg-[#F5F5F5]"
              }`}
            >
              <Icon className="w-4 h-4 text-orange-400" />
              <span className={`text-[11px] font-bold leading-snug ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                {title}
              </span>
              <span className={`text-[10px] leading-snug ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
                {desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* شريط الإدخال السفلي */}
      <div className="relative z-10 w-full mt-6">
        <form
          onSubmit={handleSend}
          className={`flex flex-col rounded-2xl border px-2.5 py-2 backdrop-blur-sm gap-2 ${
            isDark ? "bg-white/[0.06] border-white/10" : "bg-white/80 border-[#E5E5E5]"
          }`}
        >
          {/* معاينة الملف جوا الإنبوت */}
          {selectedFile && (
            <div className={`flex items-center gap-2 px-1 py-1 rounded-lg border ${
              isDark ? "bg-white/10 border-white/10" : "bg-[#F5F5F5] border-[#E5E5E5]"
            }`}>
              {selectedFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="معاينة"
                  className="w-8 h-8 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                  <FiPlus className="w-3.5 h-3.5 text-gray-300 rotate-45" />
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

          {/* شريط الكتابة والأزرار */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSend}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FFA600] to-[#FF4B04] text-white shrink-0"
            >
              <FiSend className="w-3.5 h-3.5 -rotate-27 translate-y-[1.5px]" />
            </button>

            <button
              type="button"
              className={`w-7 h-7 flex items-center justify-center shrink-0 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              <FiMic className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className={`flex-1 min-w-0 bg-transparent text-xs outline-none text-right ${isDark ? "text-white placeholder-gray-400" : "text-[#1A1A1A] placeholder-gray-500"}`}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-7 h-7 flex items-center justify-center shrink-0 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
              }}
            />
          </div>
        </form>

        <p className={`text-center text-[9px] mt-2 px-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
          قد يرتكب المساعد بعض الأخطاء أحياناً، يرجى التحقق من المعلومات المهمة.
        </p>
      </div>
    </aside>
  );
}
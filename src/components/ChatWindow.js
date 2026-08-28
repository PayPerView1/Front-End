"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { IoClose, IoExpand, IoArrowForward, IoContract } from "react-icons/io5";
import { FiMic, FiSend, FiPlus, FiX } from "react-icons/fi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { useMessages } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

// دالة تحويل الروابط في النصوص إلى روابط قابلة للنقر تلقائياً
function renderFormattedText(text) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 underline hover:text-amber-300 break-all"
          style={{ direction: "ltr", display: "inline-block" }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default function ChatWindow({ conversation, onClose }) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { toggleMaximize, isMaximized } = useMessages();
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 1. تحديث قائمة الرسائل عند تغيير المحادثة المحددة
  useEffect(() => {
    setMessages(conversation.messages || []);
    setSelectedFile(null);
    setMessage("");
  }, [conversation.id]);

  // 2. النزول التلقائي لأسفل الشاشة (Auto Scroll) عند تغير الرسائل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. إدارة معاينة الصور مع التخلص الصحيح من الذاكرة (Memory Cleanup)
  useEffect(() => {
    if (!selectedFile) {
      setFilePreviewUrl(null);
      return;
    }

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreviewUrl(null);
    }
  }, [selectedFile]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    const newMsg = {
      id: Date.now(),
      sender: isArabic ? "أنا" : "Me",
      text: message,
      time: new Date().toLocaleTimeString(isArabic ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      file: selectedFile,
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
    setSelectedFile(null);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: isDark ? "rgba(12, 15, 16, 1)" : "#ffffff" }}
    >
      {/* الهيدر */}
      <div
        className={`flex items-center justify-between px-3 pt-5 pb-3 border-b ${
          isDark ? "border-white/10" : "border-[#E5E5E5]"
        } ${
          isArabic ? "" : "flex-row-reverse"
        }`}
        dir="ltr"
      >
        <div className="flex items-center gap-2" dir="ltr">
          <button
            type="button"
            onClick={onClose}
            aria-label={isArabic ? "إغلاق المحادثة" : "Close conversation"}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            <IoClose size={16} />
          </button>
          <button
            type="button"
            onClick={toggleMaximize}
            aria-label={isMaximized ? (isArabic ? "تصغير لوحة الرسائل" : "Minimize messages panel") : (isArabic ? "تكبير لوحة الرسائل" : "Maximize messages panel")}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {isMaximized ? <IoContract size={14} /> : <IoExpand size={14} />}
          </button>
        </div>

        <div
          className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
          dir="ltr"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={isArabic ? "العودة إلى قائمة المحادثات" : "Back to conversations list"}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <IoArrowForward
              size={14}
              className={isArabic ? "" : "rotate-180"}
            />
          </button>
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
            style={{ background: conversation.color }}
          >
            {conversation.initials}
          </div>
          <h2 className={`text-xs font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{conversation.name}</h2>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {messages[0]?.time && (
          <p className="text-center text-gray-500 text-[11px] mb-5">
            {messages[0].time}
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`relative flex flex-col ${
              isArabic ? "items-start" : msg.isMe ? "items-end" : "items-start"
            } ${
              isArabic
                ? "mr-7"
                : msg.isMe
                  ? "mr-7"
                  : "ml-7"
            }`}
          >
            <div className="relative max-w-[87%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-6 whitespace-pre-line ${
                    msg.isMe
                      ? `${
                          isDark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900"
                        } ${
                          msg.isMe === isArabic
                            ? "rounded-bl-none"
                            : "rounded-br-none"
                        }`
                      : `${
                          isDark ? "bg-white/[0.06] text-white" : "bg-gray-100 text-gray-900 border border-gray-200"
                        } ${
                          msg.isMe !== isArabic
                            ? "rounded-br-none"
                            : "rounded-bl-none"
                        }`
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
                <div
                  className={`absolute bottom-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 ${
                    isDark ? "border-[rgba(12,15,16,1)]" : "border-white shadow-sm"
                  } ${
                    msg.isMe
                      ? isArabic
                        ? "-left-9"
                        : "-right-9"
                      : isArabic
                        ? "-right-9"
                        : "-left-9"
                  }`}
                  style={{ background: msg.color || conversation.color }}
                >
                  {msg.initials || conversation.initials}
                  </div>
            </div>
          </div>
        ))}
        {/* المرجع للتمرير التلقائي */}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط الإدخال */}
      <div className={`px-2 py-2 border-t ${isDark ? "border-white/10" : "border-[#E5E5E5]"}`}>
        <form
          onSubmit={handleSend}
          className={`flex flex-col rounded-2xl px-3 py-2 gap-2 border ${
            isDark ? "bg-white/[0.06] border-white/10" : "bg-gray-50 border-gray-200"
          }`}
        >
          {/* معاينة الملف قبل الإرسال */}
          {selectedFile && (
            <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${
              isDark ? "bg-white/10 border-white/10" : "bg-gray-100 border-gray-200"
            }`}>
              {filePreviewUrl ? (
                <img
                  src={filePreviewUrl}
                  alt="معاينة المرفق"
                  className="w-8 h-8 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                  <FiPlus className={`w-3.5 h-3.5 rotate-45 ${isDark ? "text-gray-300" : "text-gray-500"}`} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                  {selectedFile.name}
                </p>
                <p className={`text-[9px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className={`border-none cursor-pointer bg-transparent transition-colors ${
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* إرسال */}
            <button
              type="submit"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FFA600] to-[#FF4B04] text-white shrink-0 border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              <FiSend className="w-3.5 h-3.5 -rotate-45 translate-y-[2px]" />
            </button>

            {/* إيموجي */}
            <button
              type="button"
              className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${
                isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <HiOutlineEmojiHappy size={16} />
            </button>

            {/* حقل الكتابة */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isArabic ? "اكتب رسالة..." : "Type a message..."}
              className={`flex-1 min-w-0 bg-transparent text-xs outline-none text-right ${
                isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
              }`}
            />

            {/* مايكروفون */}
            <button
              type="button"
              className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${
                isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FiMic size={15} />
            </button>

            {/* إضافة ملف */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${
                isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FiPlus size={16} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
                e.target.value = ""; // لإتاحة اختيار نفس الملف مجدداً
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
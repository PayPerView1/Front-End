"use client";

import { useState, useRef, useEffect } from "react";
import { IoClose, IoExpand, IoArrowForward } from "react-icons/io5";
import { FiMic, FiSend, FiPlus, FiX } from "react-icons/fi";
import { HiOutlineEmojiHappy } from "react-icons/hi";

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
      sender: "أنا",
      text: message,
      time: new Date().toLocaleTimeString("ar-EG", {
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
    <div className="flex flex-col h-full" style={{ backgroundColor: "#0A0812" }}>
      {/* الهيدر */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white transition-colors border-none cursor-pointer"
          >
            <IoArrowForward size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <h2 className="text-white text-sm font-bold">{conversation.name}</h2>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: conversation.color }}
          >
            {conversation.initials}
          </div>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? "items-start" : "items-end"}`}
          >
            {!msg.isMe && (
              <p className="text-gray-400 text-[10px] mb-1">{msg.sender}</p>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                msg.isMe
                  ? "bg-white/10 text-white rounded-tl-none"
                  : "bg-white/[0.06] text-white rounded-tr-none"
              }`}
            >
              {renderFormattedText(msg.text)}
            </div>
            <p className="text-gray-500 text-[9px] mt-1">{msg.time}</p>
          </div>
        ))}
        {/* المرجع للتمرير التلقائي */}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط الإدخال */}
      <div className="px-4 py-3 border-t border-white/10">
        <form
          onSubmit={handleSend}
          className="flex flex-col rounded-2xl bg-white/[0.06] border border-white/10 px-3 py-2 gap-2"
        >
          {/* معاينة الملف قبل الإرسال */}
          {selectedFile && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/10 border border-white/10">
              {filePreviewUrl ? (
                <img
                  src={filePreviewUrl}
                  alt="معاينة المرفق"
                  className="w-8 h-8 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                  <FiPlus className="w-3.5 h-3.5 text-gray-300 rotate-45" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] truncate">
                  {selectedFile.name}
                </p>
                <p className="text-gray-400 text-[9px]">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white border-none cursor-pointer bg-transparent"
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
              className="text-gray-400 hover:text-white transition-colors border-none cursor-pointer bg-transparent shrink-0"
            >
              <HiOutlineEmojiHappy size={16} />
            </button>

            {/* حقل الكتابة */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالة..."
              className="flex-1 min-w-0 bg-transparent text-white text-xs placeholder-gray-500 outline-none text-right"
            />

            {/* مايكروفون */}
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors border-none cursor-pointer bg-transparent shrink-0"
            >
              <FiMic size={15} />
            </button>

            {/* إضافة ملف */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-white transition-colors border-none cursor-pointer bg-transparent shrink-0"
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
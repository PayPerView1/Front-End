"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import {
  IoClose,
  IoExpand,
  IoArrowForward,
  IoContract,
} from "react-icons/io5";
import {
  FiMic,
  FiSend,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { useMessages } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

// تحميل Emoji Picker فقط على Client
const EmojiPicker = dynamic(
  () => import("emoji-picker-react"),
  { ssr: false }
);

// تحويل الروابط إلى روابط قابلة للنقر
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
          style={{
            direction: "ltr",
            display: "inline-block",
          }}
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

// دالة تجلب أول حرف من الاسم
function getFirstLetter(name) {
  if (!name || typeof name !== "string") return "؟";

  const cleanName = name.trim();

  if (!cleanName) return "؟";

  return cleanName.charAt(0).toUpperCase();
}

export default function ChatWindow({
  conversation,
  onClose,
  currentUser,
}) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const { toggleMaximize, isMaximized } = useMessages();
  const { isDark } = useTheme();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  // حالة ظهور الإيموجي
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // تحديث المحادثة
  useEffect(() => {
    setMessages(conversation?.messages || []);
    setSelectedFile(null);
    setMessage("");
    setShowEmojiPicker(false);
  }, [conversation?.id]);

  // النزول لآخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // معاينة الملفات
  useEffect(() => {
    if (!selectedFile) {
      setFilePreviewUrl(null);
      return;
    }

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }

    setFilePreviewUrl(null);
  }, [selectedFile]);

  // إغلاق Emoji Picker عند الضغط خارجه
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // صورة المستخدم الحالي
  const myAvatarUrl =
    currentUser?.avatar ||
    currentUser?.image ||
    currentUser?.photoURL ||
    currentUser?.profileImage ||
    null;

  // اسم المستخدم الحالي
  const myDisplayName =
    currentUser?.name ||
    currentUser?.displayName ||
    currentUser?.username ||
    "";

  // اختيار Emoji
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // إرسال رسالة
  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim() && !selectedFile) {
      return;
    }

    const newMsg = {
      id: Date.now(),
      sender: myDisplayName,
      text: message,
      isMe: true,
      avatar: myAvatarUrl,
      time: new Date().toLocaleTimeString(
        isArabic ? "ar-EG" : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      file: selectedFile,
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
    setSelectedFile(null);
    setShowEmojiPicker(false);
  };

  const conversationAvatar = conversation?.avatar || null;
  const conversationName = conversation?.name || "؟";

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: isDark
          ? "rgba(12, 15, 16, 1)"
          : "#ffffff",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        className={`flex items-center justify-between px-3 pt-5 pb-3 border-b ${
          isDark
            ? "border-white/10"
            : "border-[#E5E5E5]"
        } ${isArabic ? "" : "flex-row-reverse"}`}
        dir="ltr"
      >
        <div
          className="flex items-center gap-2"
          dir="ltr"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={
              isArabic
                ? "إغلاق المحادثة"
                : "Close conversation"
            }
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark
                ? "text-gray-500 hover:text-white"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            <IoClose size={16} />
          </button>

          <button
            type="button"
            onClick={toggleMaximize}
            aria-label={
              isMaximized
                ? isArabic
                  ? "تصغير لوحة الرسائل"
                  : "Minimize messages panel"
                : isArabic
                ? "تكبير لوحة الرسائل"
                : "Maximize messages panel"
            }
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark
                ? "text-gray-500 hover:text-white"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {isMaximized ? (
              <IoContract size={14} />
            ) : (
              <IoExpand size={14} />
            )}
          </button>
        </div>

        <div
          className={`flex items-center gap-2 ${
            isArabic ? "flex-row-reverse" : ""
          }`}
          dir="ltr"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={
              isArabic
                ? "العودة إلى قائمة المحادثات"
                : "Back to conversations list"
            }
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <IoArrowForward
              size={14}
              className={
                isArabic ? "" : "rotate-180"
              }
            />
          </button>

          <div
            className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{
              background: conversationAvatar
                ? "transparent"
                : conversation?.color || "#005D3B",
            }}
          >
            {conversationAvatar ? (
              <img
                src={conversationAvatar}
                alt={conversationName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {getFirstLetter(conversationName)}
              </span>
            )}
          </div>

          <h2
            className={`text-xs font-bold ${
              isDark
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {conversationName}
          </h2>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {messages.map((msg) => {
          const messageAvatar = msg.isMe
            ? msg.avatar || myAvatarUrl
            : msg.avatar || conversationAvatar;

          const messageName = msg.isMe
            ? myDisplayName || msg.sender
            : msg.sender || conversationName;

          // في الإنجليزية تظهر الرسائل على اليسار، وفي العربية تظهر على اليمين
          const isLeft = !isArabic;

          const avatarComponent = (
            <div
              className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-white text-[10px] font-bold shrink-0 border ${
                isDark
                  ? "border-white/10"
                  : "border-gray-200 shadow-sm"
              }`}
              style={{
                background: messageAvatar
                  ? "transparent"
                  : msg.color ||
                    (msg.isMe
                      ? "#FF4B04"
                      : conversation?.color) ||
                    "#005D3B",
              }}
            >
              {messageAvatar ? (
                <img
                  src={messageAvatar}
                  alt={messageName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {getFirstLetter(messageName)}
                </span>
              )}
            </div>
          );

          return (
            <div
              key={msg.id}
              dir="ltr"
              className={`flex items-end gap-2.5 w-full ${
                isLeft ? "justify-start" : "justify-end"
              }`}
            >
              {isLeft && avatarComponent}

              <div
                dir={isArabic ? "rtl" : "ltr"}
                className={`rounded-2xl px-4 py-3 text-xs leading-6 whitespace-pre-line max-w-[75%] ${
                  isArabic ? "text-right" : "text-left"
                } ${
                  msg.isMe
                    ? isDark
                      ? "bg-white/10 text-white"
                      : "bg-gray-200 text-gray-900"
                    : isDark
                    ? "bg-white/[0.06] text-white"
                    : "bg-gray-100 text-gray-900 border border-gray-200"
                }`}
              >
                {renderFormattedText(msg.text)}
              </div>

              {!isLeft && avatarComponent}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= INPUT ================= */}

      <div
        className={`px-2 py-2 border-t ${
          isDark
            ? "border-white/10"
            : "border-[#E5E5E5]"
        }`}
      >
        <form
          onSubmit={handleSend}
          className={`flex flex-col rounded-2xl px-3 py-2 gap-2 border ${
            isDark
              ? "bg-white/[0.06] border-white/10"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          {/* FILE PREVIEW */}

          {selectedFile && (
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${
                isDark
                  ? "bg-white/10 border-white/10"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              {filePreviewUrl ? (
                <img
                  src={filePreviewUrl}
                  alt="معاينة المرفق"
                  className="w-8 h-8 rounded-md object-cover shrink-0"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                    isDark
                      ? "bg-white/10"
                      : "bg-gray-200"
                  }`}
                >
                  <FiPlus
                    className={`w-3.5 h-3.5 rotate-45 ${
                      isDark
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p
                  className={`text-[11px] truncate ${
                    isDark
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {selectedFile.name}
                </p>

                <p
                  className={`text-[9px] ${
                    isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className={`border-none cursor-pointer bg-transparent transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* INPUT ROW */}

          <div className="flex items-center gap-2 relative">
            <button
              type="submit"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FFA600] to-[#FF4B04] text-white shrink-0 border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              <FiSend className="w-4 h-4 md:w-4 md:h-4 xl:w-3.5 xl:h-3.5 -rotate-25 translate-y-[1.5px]" />
            </button>

            {/* EMOJI BUTTON */}

            <div
              ref={emojiPickerRef}
              className="relative shrink-0"
            >
              <button
                type="button"
                onClick={() =>
                  setShowEmojiPicker((prev) => !prev)
                }
                aria-label={
                  isArabic
                    ? "اختيار إيموجي"
                    : "Choose emoji"
                }
                className={`transition-colors border-none cursor-pointer bg-transparent ${
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <HiOutlineEmojiHappy size={16} className="translate-y-[3px]"/>
              </button>

              {showEmojiPicker && (
                <div
                  className={`absolute bottom-9 z-50 ${
                    isArabic
                      ? "right-0"
                      : "left-0"
                  }`}
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={
                      isDark
                        ? "dark"
                        : "light"
                    }
                    width={300}
                    height={350}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    previewConfig={{
                      showPreview: false,
                    }}
                  />
                </div>
              )}
            </div>

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder={
                isArabic
                  ? "اكتب رسالة..."
                  : "Type a message..."
              }
              className={`flex-1 min-w-0 bg-transparent text-xs outline-none ${
                isArabic ? "text-right" : "text-left"
              } ${
                isDark
                  ? "text-white placeholder-gray-500"
                  : "text-gray-900 placeholder-gray-400"
              }`}
            />

            <button
              type="button"
              className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FiMic size={15} />
            </button>

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
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

                if (file) {
                  setSelectedFile(file);
                }

                e.target.value = "";
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
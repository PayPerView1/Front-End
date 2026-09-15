"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { BsStars } from "react-icons/bs";
import { FiUsers, FiMic, FiSend, FiPlus, FiX, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { MdCampaign, MdLiveTv, MdReceiptLong } from "react-icons/md";
import { useAssistant } from "@/context/AssistantContext";
import { useTheme } from "@/context/ThemeContext";
import { useLocale, useTranslations } from "next-intl";
import {
  createThread,
  getThreads,
  getMessages,
  sendMessage,
  deleteThread,
} from "@/services/Chatservice";

const ACTION_ITEMS = [
  { id: "messageMembers", icon: FiUsers },
  { id: "createAd", icon: MdCampaign },
  { id: "startLive", icon: MdLiveTv },
  { id: "sendInvoice", icon: MdReceiptLong },
];

// ─── Views ───────────────────────────────────────────────────────────────────
const VIEW = { HOME: "home", THREADS: "threads", CHAT: "chat" };

export default function AIAssistantPanel({ side = "left" }) {
  const { isAssistantOpen, closeAssistant } = useAssistant();
  const { isDark } = useTheme();
  const locale = useLocale();
  const t = useTranslations("assistant");
  const isAr = locale === "ar";

  // ── UI state ──
  const [view, setView] = useState(VIEW.HOME);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Threads ──
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);

  // ── Messages ──
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // ── File upload ──
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const messagesEndRef = useRef(null);

  // ─── Core API Callbacks ───────────────────────────────────────────────────

  // 1. جلب المحادثات
  const fetchThreads = useCallback(async () => {
    try {
      const data = await getThreads();
      setThreads(data);
    } catch {
      // non-blocking
    }
  }, []);

  // 2. إرسال الرسالة
  const dispatchMessage = useCallback(async (threadId, content) => {
    const userMsg = { _id: Date.now().toString(), role: "user", content, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);
    try {
      const aiMsg = await sendMessage(threadId, content);
      setMessages((prev) => [
        ...prev,
        { _id: aiMsg.id, role: "assistant", content: aiMsg.content, created_at: aiMsg.createdAt },
      ]);
    } catch {
      setError(t("errors.sendMessage"));
    } finally {
      setIsSending(false);
    }
  }, [t]);

  // 3. فتح محادثة قديمة
  const openThread = useCallback(async (thread) => {
    setError("");
    setIsLoading(true);
    setActiveThread(thread);
    setView(VIEW.CHAT);
    try {
      const msgs = await getMessages(thread.id);
      setMessages(msgs);
    } catch {
      setError(t("errors.loadMessages"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // 4. بدء محادثة جديدة
  const startNewChat = useCallback(async (initialMessage = "") => {
    setError("");
    setIsLoading(true);
    let createdThread = null;

    try {
      createdThread = await createThread();
      setActiveThread(createdThread);
      setMessages([]);
      setView(VIEW.CHAT);
      await fetchThreads();
    } catch {
      setError(t("errors.createThread"));
    } finally {
      setIsLoading(false);
    }

    if (createdThread && initialMessage.trim()) {
      await dispatchMessage(createdThread.id, initialMessage.trim());
    }
  }, [t, dispatchMessage, fetchThreads]);

  // ─── Effects ─────────────────────────────────────────────────────────────

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (view === VIEW.CHAT) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages, view]);

  useEffect(() => {
    if (!selectedFile?.type.startsWith("image/")) return undefined;
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(String(reader.result));
    reader.readAsDataURL(selectedFile);
    return () => reader.abort();
  }, [selectedFile]);

  useEffect(() => {
    if (!isAssistantOpen) return;
    fetchThreads();
  }, [isAssistantOpen, fetchThreads]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSend = async (e) => {
    e.preventDefault();
    const content = message.trim();
    if ((!content && !selectedFile) || isSending) return;
    setMessage("");
    setError("");

    if (!activeThread) {
      await startNewChat(content);
    } else {
      await dispatchMessage(activeThread.id, content);
    }
  };

  const handleDeleteThread = async (threadId, e) => {
    e.stopPropagation();
    try {
      await deleteThread(threadId);
      setThreads((prev) => prev.filter((th) => th.id !== threadId));
      if (activeThread?.id === threadId) {
        setActiveThread(null);
        setMessages([]);
        setView(VIEW.HOME);
      }
    } catch {
      setError(t("errors.deleteThread"));
    }
  };

  // ─── Layout helpers ───────────────────────────────────────────────────────

  if (!isAssistantOpen) return null;

  const sideClass =
    side === "left"
      ? "left-0 right-0 xl:right-auto xl:border-r"
      : "right-0 left-0 xl:left-auto xl:border-l";

  const panelBg = isDark
    ? "linear-gradient(180deg, rgba(142, 3, 255, 0.18) 0%, rgba(0, 0, 0, 0.18) 86.54%)"
    : "linear-gradient(180deg, rgba(148, 211, 193, 0.18) 0%, rgba(255, 255, 255, 0.96) 86.54%)";

  // ─── Sub-views ────────────────────────────────────────────────────────────

  const renderHome = () => (
    <div className="relative z-10 flex flex-col items-center w-full max-w-xl md:max-w-2xl xl:max-w-xl mx-auto my-auto py-4">
      <div className={`w-12 h-12 md:w-16 md:h-16 xl:w-12 xl:h-12 rounded-2xl flex items-center justify-center mb-4 md:mb-6 xl:mb-4 border ${
        isDark
          ? "bg-white/10 border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.35)]"
          : "bg-[#94D3C1]/20 border-[#94D3C1]/40 shadow-[0_0_30px_rgba(148,211,193,0.25)]"
      }`}>
        <BsStars className={`w-5 h-5 md:w-7 md:h-7 xl:w-5 xl:h-5 ${isDark ? "text-white" : "text-[#2A9D8F]"}`} />
      </div>

      <h1 className={`text-base sm:text-lg md:text-2xl xl:text-lg font-bold text-center mb-2 px-2 ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
        {t("title")}
      </h1>
      <p className={`text-xs md:text-sm xl:text-xs text-center leading-relaxed mb-4 md:mb-6 xl:mb-4 max-w-lg px-2 ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
        {t("description")}
      </p>

      {/* زر عرض المحادثات */}
      {threads.length > 0 && (
        <button
          type="button"
          onClick={() => setView(VIEW.THREADS)}
          className={`mb-4 text-xs font-medium underline underline-offset-2 transition-colors ${isDark ? "text-purple-400 hover:text-purple-300" : "text-[#2A9D8F] hover:text-[#1e7a68]"}`}
        >
          {t("viewConversations")} ({threads.length})
        </button>
      )}

      {/* بطاقات الإجراءات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 xl:gap-2.5 w-full">
        {ACTION_ITEMS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => startNewChat(t(`actions.${id}.prompt`))}
            className={`flex flex-col items-start ${isAr ? "text-right" : "text-left"} gap-1.5 rounded-xl md:rounded-2xl border p-3.5 md:p-4 xl:p-3 transition-colors ${
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
  );

  const renderThreads = () => (
    <div className="relative z-10 flex flex-col w-full max-w-xl md:max-w-2xl xl:max-w-xl mx-auto my-auto py-4 gap-2">
      <div className="flex items-center gap-2 mb-2">
        <button type="button" onClick={() => setView(VIEW.HOME)} className={`p-1 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-300" : "hover:bg-black/5 text-gray-600"}`}>
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>{t("conversations")}</h2>
      </div>

      {threads.map((thread) => (
        <div
          key={thread.id}
          onClick={() => openThread(thread)}
          className={`flex items-center justify-between gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${
            isDark ? "bg-white/4 border-white/10 hover:bg-white/8" : "bg-white/70 border-[#E5E5E5] hover:bg-[#F5F5F5]"
          }`}
        >
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>{thread.title}</p>
            {thread.lastMessage && (
              <p className={`text-[10px] truncate mt-0.5 ${isDark ? "text-gray-400" : "text-[#666666]"}`}>{thread.lastMessage}</p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => handleDeleteThread(thread.id, e)}
            className={`shrink-0 p-1 rounded-md transition-colors ${isDark ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"}`}
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => startNewChat()}
        className="mt-2 w-full rounded-xl border border-dashed py-2.5 text-xs font-medium transition-colors text-orange-400 border-orange-400/40 hover:bg-orange-400/5"
      >
        + {t("newConversation")}
      </button>
    </div>
  );

  const renderChat = () => (
    <div className="relative z-10 flex flex-col flex-1 w-full max-w-xl md:max-w-2xl xl:max-w-xl mx-auto overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <button type="button" onClick={() => { setView(VIEW.HOME); fetchThreads(); }} className={`p-1 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-300" : "hover:bg-black/5 text-gray-600"}`}>
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <h2 className={`text-xs font-bold truncate flex-1 ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>{activeThread?.title || t("newConversation")}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-2 pr-1">
        {isLoading && (
          <p className={`text-xs text-center mt-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("loading")}</p>
        )}

        {messages.map((msg) => (
          <div key={msg._id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5 ${isDark ? "bg-white/10" : "bg-[#94D3C1]/30"}`}>
                <BsStars className={`w-3 h-3 ${isDark ? "text-purple-400" : "text-[#2A9D8F]"}`} />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-gradient-to-r from-[#FFA600] to-[#FF4B04] text-white rounded-tr-sm"
                : isDark
                  ? "bg-white/8 text-gray-200 rounded-tl-sm"
                  : "bg-[#F5F5F5] text-[#1A1A1A] rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5 ${isDark ? "bg-white/10" : "bg-[#94D3C1]/30"}`}>
              <BsStars className={`w-3 h-3 ${isDark ? "text-purple-400" : "text-[#2A9D8F]"}`} />
            </div>
            <div className={`rounded-2xl rounded-tl-sm px-4 py-2.5 ${isDark ? "bg-white/8" : "bg-[#F5F5F5]"}`}>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? "bg-gray-400" : "bg-gray-400"}`} style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <aside
      className={`ai-panel fixed top-14 h-[calc(100vh-56px)] w-full xl:max-w-[380px] z-40 flex flex-col justify-between overflow-y-auto px-4 sm:px-8 md:px-12 xl:px-4 py-6 border ${
        isDark ? "border-white/10" : "border-[#E5E5E5]"
      } ${sideClass}`}
      data-side={side}
      style={{
        backgroundColor: isDark ? "#0A0812" : "#FFFFFF",
        boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
        backgroundImage: panelBg,
      }}
    >
      {/* زر الإغلاق */}
      <button
        type="button"
        onClick={closeAssistant}
        className={`absolute top-6 ${isAr ? "left-4 sm:left-6 md:left-8 xl:left-3" : "right-4 sm:right-6 md:right-8 xl:right-3"} w-8 h-8 xl:w-7 xl:h-7 flex items-center justify-center rounded-full transition-colors z-50 ${
          isDark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-black/5 text-gray-600 hover:bg-black/10"
        }`}
        aria-label={t("close")}
      >
        <FiX className="w-4 h-4" />
      </button>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {error && (
          <p className="text-[10px] text-red-400 text-center mb-2 px-2">{error}</p>
        )}
        {view === VIEW.HOME && renderHome()}
        {view === VIEW.THREADS && renderThreads()}
        {view === VIEW.CHAT && renderChat()}
      </div>

      {/* ── Input bar (shown in HOME and CHAT) ── */}
      {view !== VIEW.THREADS && (
        <div className="relative z-10 w-full max-w-xl md:max-w-2xl xl:max-w-xl mx-auto mt-4 md:mt-6 shrink-0">
          <form
            onSubmit={handleSend}
            className={`flex flex-col rounded-2xl border px-3 py-2.5 md:p-3 xl:py-2 backdrop-blur-sm gap-2 ${
              isDark ? "bg-white/6 border-white/10" : "bg-white/80 border-[#E5E5E5]"
            }`}
          >
            {/* معاينة الملف المرفق قبل الإرسال */}
            {selectedFile && (
              <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${isDark ? "bg-white/10 border-white/10" : "bg-[#F5F5F5] border-[#E5E5E5]"}`}>
                {selectedFile.type.startsWith("image/") && previewUrl ? (
                  <Image src={previewUrl} alt={t("preview")} width={32} height={32} unoptimized className="w-8 h-8 rounded-md object-cover shrink-0" />
                ) : (
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                    <FiPlus className={`w-3.5 h-3.5 rotate-45 ${isDark ? "text-gray-300" : "text-gray-500"}`} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-medium truncate ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>{selectedFile.name}</p>
                  <p className={`text-[9px] ${isDark ? "text-gray-400" : "text-[#666666]"}`}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button type="button" onClick={() => setSelectedFile(null)} className={`transition-colors shrink-0 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              {/* زر الإرسال مع ضبط محاذاة الأيقونة */}
              <button
                type="submit"
                disabled={isSending || isLoading || (!message.trim() && !selectedFile)}
                className="w-8 h-8 md:w-9 md:h-9 xl:w-7 xl:h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FFA600] to-[#FF4B04] text-white shrink-0 border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiSend className="w-4 h-4 md:w-4 md:h-4 xl:w-3.5 xl:h-3.5 -rotate-25 translate-y-[1.5px]" />
              </button>

              {/* زر المايك */}
              <button
                type="button"
                onClick={() => {
                  alert("ميزة التسجيل الصوتي قيد التطوير حالياً");
                }}
                className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                <FiMic className="w-4 h-4 md:w-5 md:h-5 xl:w-4 xl:h-4" />
              </button>

              {/* حقل إدخال النص */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("placeholder")}
                className={`flex-1 min-w-0 bg-transparent text-xs sm:text-sm md:text-base xl:text-xs outline-none ${
                  isAr ? "text-right" : "text-left"
                } ${isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
              />

              {/* زر الرفع المفعّل */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`transition-colors border-none cursor-pointer bg-transparent shrink-0 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                <FiPlus className="w-4 h-4 md:w-5 md:h-5 xl:w-4 xl:h-4" />
              </button>

              {/* مدخل الملفات الخفي */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 20 * 1024 * 1024) {
                      alert("حجم الملف يتجاوز الحد الأقصى المسموح به وهو 20 ميجابايت.");
                      e.target.value = "";
                      return;
                    }
                    setSelectedFile(file);
                  }
                  e.target.value = "";
                }}
              />
            </div>
          </form>

          <p className={`text-center text-[9px] sm:text-[10px] md:text-xs xl:text-[9px] mt-2 px-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
            {t("disclaimer")}
          </p>
        </div>
      )}
    </aside>
  );
}
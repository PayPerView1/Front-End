"use client";

import { useState } from "react";
import { FiSearch, FiEdit } from "react-icons/fi";
import { IoClose, IoExpand, IoContract } from "react-icons/io5";
import { useLocale } from "next-intl";
import { useMessages } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

export const mockConversations = [
  {
    id: 1,
    name: "دعم مجتمع كليبات كوبي",
    avatar: null,
    lastMessage: "أحمد محمد: مرحباً بك في دعم المشتركين...",
    unread: true,
    isOrder: false,
    color: "#8B5CF6",
    messages: [
      {
        id: 1,
        sender: "Niko Lamberson",
        text: "مرحباً بك في مجتمع Copy Clips",
        isMe: false,
        color: "#8B5CF6",
      },
    ],
  },
  {
    id: 2,
    name: "دعم قصاصات عربي",
    avatar: null,
    lastMessage: "🍪 الخطوة الأولى التي يجب أن تقوم بها تجدها هنا...",
    unread: true,
    isOrder: true,
    color: "#F59E0B",
    messages: [
      {
        id: 1,
        sender: "دعم قصاصات عربي",
        text: "🍪 الخطوة الأولى التي يجب أن تقوم بها تجدها هنا...",
        isMe: false,
        color: "#F59E0B",
      },
    ],
  },
];

export default function ConversationList({
  onSelectConversation,
  selectedId,
  onClose,
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const locale = useLocale();
  const { toggleMaximize, isMaximized, conversations, readIds, markAsRead } = useMessages();
  const { isDark } = useTheme();

  const isAr = locale === "ar";

  const getFirstLetter = (name) => {
    if (!name) return "؟";
    return name.trim().charAt(0).toUpperCase();
  };

  const filtered = conversations.filter((conversation) => {
    const name = conversation.name || "";
    const lastMessage = conversation.lastMessage || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      lastMessage.toLowerCase().includes(search.toLowerCase());

    if (activeFilter === "unread") {
      return matchesSearch && conversation.unread;
    }

    if (activeFilter === "orders") {
      return matchesSearch && conversation.isOrder;
    }

    return matchesSearch;
  });

  return (
    <div
      className={`flex flex-col h-full border-l ${
        isDark ? "border-white/10" : "border-[#E5E5E5]"
      }`}
      style={{
        backgroundColor: isDark ? "rgba(12, 15, 16, 1)" : "#ffffff",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        className={`w-full h-14 min-h-[56px] flex flex-row justify-between items-center px-4 py-2 border-b ${
          isDark ? "border-[#373A3B]" : "border-[#E5E5E5]"
        }`}
      >
        <h2
          className={`font-normal text-xl tracking-[-0.6px] select-none ${
            isDark ? "text-[#E1E3E4]" : "text-[#1A1A1A]"
          }`}
          style={{ fontFamily: "Tajawal, sans-serif" }}
        >
          {isAr ? "الرسائل" : "Messages"}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMaximize}
            aria-label={
              isMaximized
                ? isAr ? "تصغير لوحة الرسائل" : "Minimize messages panel"
                : isAr ? "تكبير لوحة الرسائل" : "Maximize messages panel"
            }
            className={`w-[26px] h-[26px] flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark
                ? "bg-white/10 text-gray-400 hover:text-white"
                : "bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            {isMaximized ? <IoContract size={14} /> : <IoExpand size={14} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`w-[18px] h-[18px] flex items-center justify-center hover:opacity-85 transition-opacity cursor-pointer border-none bg-transparent ${
              isDark ? "text-[#E1E3E4]" : "text-[#1A1A1A]"
            }`}
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <IoClose size={18} />
          </button>
        </div>
      </div>

      {/* ================= SEARCH & FILTERS ================= */}

      <div
        className={`px-3 py-2.5 border-b ${
          isDark ? "border-white/10" : "border-[#E5E5E5]"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`flex-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 border ${
              isDark
                ? "bg-white/6 border-white/10"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <FiSearch
              className={isDark ? "text-gray-400 shrink-0" : "text-gray-500 shrink-0"}
              size={13}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? "البحث في الرسائل..." : "Search messages..."}
              className={`flex-1 bg-transparent text-xs outline-none text-right ${
                isDark
                  ? "text-white placeholder-gray-500"
                  : "text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>

          <button
            type="button"
            className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors cursor-pointer shrink-0 ${
              isDark
                ? "bg-white/6 border-white/10 text-gray-400 hover:text-white"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900"
            }`}
          >
            <FiEdit size={13} />
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2">
          {[
            { key: "all", label: isAr ? "الكل" : "All" },
            { key: "unread", label: isAr ? "غير مقروءة" : "Unread" },
            { key: "orders", label: isAr ? "الطلبات" : "Orders" },
          ].map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border-none cursor-pointer ${
                activeFilter === filter.key
                  ? isDark ? "bg-white text-black" : "bg-gray-900 text-white"
                  : isDark
                  ? "bg-white/6 text-gray-400 hover:text-white border border-white/10"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= CONVERSATIONS LIST ================= */}

      <div className="flex-1 overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((conversation) => {
            const isUnread =
              conversation.unread && !readIds.includes(conversation.id);

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => {
                  onSelectConversation(conversation);
                  markAsRead(conversation.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-right transition-colors border-none cursor-pointer border-b ${
                  isDark ? "border-white/5" : "border-gray-100"
                } ${
                  selectedId === conversation.id
                    ? isDark ? "bg-white/[0.07]" : "bg-gray-100"
                    : isDark
                    ? "bg-transparent hover:bg-white/4"
                    : "bg-transparent hover:bg-gray-50"
                }`}
              >
                {/* AVATAR */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden"
                  style={{
                    background: conversation.avatar
                      ? "transparent"
                      : conversation.color || "#005D3B",
                  }}
                >
                  {conversation.avatar ? (
                    <img
                      src={conversation.avatar}
                      alt={conversation.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getFirstLetter(conversation.name)}</span>
                  )}
                </div>

                {/* TEXT */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold truncate text-right ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {conversation.name}
                  </p>

                  <p
                    className={`text-[11px] truncate text-right ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* UNREAD DOT */}
                {isUnread && (
                  <div
                    className="w-2 h-2 rounded-full bg-[#94D3C1] shrink-0"
                    aria-label={isAr ? "رسالة جديدة" : "New message"}
                  />
                )}
              </button>
            );
          })
        ) : (
          <div
            className={`p-4 text-center text-xs ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {isAr ? "لا توجد محادثات تطابق البحث" : "No conversations match search"}
          </div>
        )}
      </div>
    </div>
  );
}
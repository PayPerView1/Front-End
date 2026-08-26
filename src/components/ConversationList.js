"use client";

import { useState } from "react";
import { FiSearch, FiEdit } from "react-icons/fi";
import { IoClose, IoExpand, IoContract } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMessages } from "@/context/MessagesContext";
import { useTheme } from "@/context/ThemeContext";

// بيانات وهمية معدلة تشمل خاصية isOrder للفلترة
export const mockConversations = [
  {
    id: 1,
    name: "دعم مجتمع كليبات كوبي",
    lastMessage: "أحمد محمد: مرحباً بك في دعم المشتركين...",
    time: "7/23",
    unread: false,
    isOrder: false,
    avatar: null,
    color: "#8B5CF6",
    initials: "د",
    messages: [
      {
        id: 1,
        sender: "Niko Lamberson",
        text: "مرحباً إسلام أبو منصور! نحن متحمسون جداً لانضمامك إلى مجتمع Copy Clips\n\nإذا كنت تبحث عن المزيد من الفرص، انضم إلى خادمنا على ديسكورد:\nhttps://discord.gg/qYv64zFYu5\n\nانضم هنا للحصول على دورات حصرية وفرص النقاط مقاطع (clipping) مستمرة\nhttps://whop.com/copy-clips?a=nikolam1\n\nإذا كان لديك في أي وقت أي أسئلة حول حملاتنا أو حرفياً أي شيء، لا تتردد في مراسلتي هنا وسأكون سعيداً بالمساعدة! متحمس لرؤيتك :)",
        time: "23 يونيو 2026 م، 2:19 م",
        isMe: false,
        color: "#8B5CF6",
        initials: "N",
      },
    ],
  },
  {
    id: 2,
    name: "دعم قصاصات عربي",
    lastMessage: "🍪 الخطوة الأولى التي يجب أن تقوم بها تجدها هنا...",
    time: "7/12",
    unread: true,
    isOrder: true,
    avatar: null,
    color: "#F59E0B",
    initials: "ع",
    messages: [
      {
        id: 1,
        sender: "دعم قصاصات عربي",
        text: "🍪 الخطوة الأولى التي يجب أن تقوم بها تجدها هنا...",
        time: "12 يوليو 2026",
        isMe: false,
        color: "#F59E0B",
        initials: "ع",
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
  const router = useRouter();
  const locale = useLocale();
  const { toggleMaximize, isMaximized } = useMessages();
  const { isDark } = useTheme();

  // منطق التصفية حسب البحث وحسب الفلتر النشط
  const filtered = mockConversations.filter((c) => {
    const matchesSearch =
      c.name.includes(search) || c.lastMessage.includes(search);

    if (activeFilter === "unread") return matchesSearch && c.unread;
    if (activeFilter === "orders") return matchesSearch && c.isOrder;

    return matchesSearch;
  });

  return (
    <div className={`flex flex-col h-full border-l ${isDark ? "border-white/10" : "border-[#E5E5E5]"}`} style={{ backgroundColor: isDark ? "rgba(12, 15, 16, 1)" : "#ffffff" }}>
      {/* الهيدر */}
      <div className={`flex items-center justify-between px-4 pt-5 pb-3 border-b ${isDark ? "border-white/10" : "border-[#E5E5E5]"}`}>
        <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>الرسائل</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMaximize}
            aria-label={isMaximized ? "تصغير لوحة الرسائل" : "تكبير لوحة الرسائل"}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark 
                ? "bg-white/10 text-gray-400 hover:text-white" 
                : "bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            {isMaximized ? <IoContract size={13} /> : <IoExpand size={13} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors border-none cursor-pointer ${
              isDark 
                ? "bg-white/10 text-gray-400 hover:text-white" 
                : "bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <IoClose size={15} />
          </button>
        </div>
      </div>

      {/* شريط البحث والأزرار */}
      <div className={`px-4 py-3 border-b ${isDark ? "border-white/10" : "border-[#E5E5E5]"}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border ${
            isDark 
              ? "bg-white/[0.06] border-white/10" 
              : "bg-gray-50 border-gray-200"
          }`}>
            <FiSearch className={`${isDark ? "text-gray-400" : "text-gray-500"} shrink-0`} size={13} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث في الرسائل..."
              className={`flex-1 bg-transparent text-xs outline-none text-right ${
                isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>
          <button
            type="button"
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              isDark 
                ? "bg-white/[0.06] border-white/10 text-gray-400 hover:text-white" 
                : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900"
            }`}
          >
            <FiEdit size={13} />
          </button>
        </div>

        {/* الفلاتر */}
        <div className="flex gap-2 justify-right">
          {[
            { key: "all", label: "الكل" },
            { key: "unread", label: "غير مقروءة" },
            { key: "orders", label: "الطلبات" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border-none cursor-pointer ${
                activeFilter === f.key
                  ? (isDark ? "bg-white text-black" : "bg-gray-900 text-white")
                  : (isDark 
                      ? "bg-white/[0.06] text-gray-400 hover:text-white border border-white/10" 
                      : "bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200")
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* عناصر القائمة */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => onSelectConversation(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors border-none cursor-pointer border-b ${
                isDark ? "border-white/5" : "border-gray-100"
              } ${
                selectedId === conv.id
                  ? (isDark ? "bg-white/[0.07]" : "bg-gray-100")
                  : (isDark ? "bg-transparent hover:bg-white/[0.04]" : "bg-transparent hover:bg-gray-50")
              }`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: conv.color }}
              >
                {conv.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{conv.time}</span>
                  <p className={`text-xs font-bold truncate text-right ${isDark ? "text-white" : "text-gray-900"}`}>
                    {conv.name}
                  </p>
                </div>
                <p className={`text-[11px] truncate text-right ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread && (
                <div className="w-2 h-2 rounded-full bg-[#94D3C1] shrink-0" />
              )}
            </button>
          ))
        ) : (
          <div className={`p-4 text-center text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            لا توجد محادثات تطابق البحث
          </div>
        )}
      </div>
    </div>
  );
}
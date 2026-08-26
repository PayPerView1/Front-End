"use client";

import { useState } from "react";
import { FiSearch, FiEdit } from "react-icons/fi";
import { IoClose, IoExpand } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMessages } from "@/context/MessagesContext";

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
  const { toggleMaximize } = useMessages();

  // منطق التصفية حسب البحث وحسب الفلتر النشط
  const filtered = mockConversations.filter((c) => {
    const matchesSearch =
      c.name.includes(search) || c.lastMessage.includes(search);

    if (activeFilter === "unread") return matchesSearch && c.unread;
    if (activeFilter === "orders") return matchesSearch && c.isOrder;

    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-full border-l border-white/10" style={{ backgroundColor: "#0A0812" }}>
      {/* الهيدر */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-white text-sm font-bold">الرسائل</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMaximize}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white transition-colors border-none cursor-pointer"
          >
            <IoExpand size={13} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white transition-colors border-none cursor-pointer"
          >
            <IoClose size={15} />
          </button>
        </div>
      </div>

      {/* شريط البحث والأزرار */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white/[0.06] rounded-lg px-3 py-2 border border-white/10">
            <FiSearch size={13} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث في الرسائل..."
              className="flex-1 bg-transparent text-white text-xs placeholder-gray-500 outline-none text-right"
            />
          </div>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
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
                  ? "bg-white text-black"
                  : "bg-white/[0.06] text-gray-400 hover:text-white border border-white/10"
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
              className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors border-none cursor-pointer border-b border-white/5 ${
                selectedId === conv.id
                  ? "bg-white/[0.07]"
                  : "bg-transparent hover:bg-white/[0.04]"
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
                  <span className="text-gray-500 text-[10px]">{conv.time}</span>
                  <p className="text-white text-xs font-bold truncate text-right">
                    {conv.name}
                  </p>
                </div>
                <p className="text-gray-400 text-[11px] truncate text-right">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread && (
                <div className="w-2 h-2 rounded-full bg-[#94D3C1] shrink-0" />
              )}
            </button>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-xs">
            لا توجد محادثات تطابق البحث
          </div>
        )}
      </div>
    </div>
  );
}
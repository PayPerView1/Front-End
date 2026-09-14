"use client";

import { useState } from "react";
import { useNotifications } from "@/context/NotificationsContext";
import { useLocale } from "next-intl";
import { useTheme } from "@/context/ThemeContext";

export default function NotificationsPanel({ side = "left" }) {
  const {
    isNotificationsOpen,
    notifications,
    closeNotifications,
    markAsRead,
  } = useNotifications();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState("mentions");
  const locale = useLocale();
  const isAr = locale === "ar";

  // Theme mapping colors
  const t = {
    border: isDark ? "border-[#373A3B]" : "border-[#E5E5E5]",
    text: isDark ? "text-[#E1E3E4]" : "text-[#1A1A1A]",
    headerBg: isDark ? "bg-[#0C0F10]" : "bg-white",
    tabsBg: isDark ? "bg-[#0A0C0D]" : "bg-[#F9FAFB]",
    toggleBg: isDark ? "bg-[#131618]" : "bg-[#F3F4F6]",
    toggleBorder: isDark ? "border-white/[0.05]" : "border-gray-200",
    tabActive: isDark ? "bg-[#202528] text-white border-white/[0.05]" : "bg-white text-black border-gray-200 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]",
    tabInactive: isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black",
    listDivide: isDark ? "divide-[#373A3B]" : "divide-[#E5E5E5]",
    dateDividerLine: isDark ? "border-[#373A3B]/40" : "border-[#E5E5E5]",
    dateDividerText: isDark ? "bg-[#0C0F10] border-[#373A3B]/30" : "bg-white border-[#E5E5E5]",
    itemUnread: isDark ? "bg-white/[0.02]" : "bg-[#94D3C1]/10",
    itemHover: isDark ? "hover:bg-white/[0.04]" : "hover:bg-gray-50",
    itemBorder: isDark ? "border-[#373A3B]" : "border-[#E5E5E5]",
    itemUnreadDot: isDark ? "bg-white" : "bg-[#94D3C1]",
    avatarBorder: isDark ? "border-[#373A3B]" : "border-gray-200",
    senderText: isDark ? "text-white" : "text-black",
    msgText: isDark ? "text-gray-300" : "text-gray-700",
    closeBtn: isDark ? "text-[#E1E3E4]" : "text-[#1A1A1A]"
  };

  if (!isNotificationsOpen) return null;

  // Filter notifications based on chosen tab
  const filteredNotifications =
    activeTab === "mentions"
      ? notifications.filter((n) => n.type === "mention")
      : notifications; // All Activity

  // Calculate unread count for mentions tab badge
  const mentionsCount = notifications.filter((n) => n.type === "mention" && n.unread).length;

  // Format message text to highlight @everyone
  const formatMessage = (msg) => {
    const parts = msg.split(/(@everyone)/g);
    return parts.map((part, i) => {
      if (part === "@everyone") {
        return (
          <span key={i} className="text-[#FF8A00] font-bold">
            @everyone
          </span>
        );
      }
      return part;
    });
  };

  // Group notifications by date (Today / Yesterday)
  const groupedNotifications = filteredNotifications.reduce((groups, item) => {
    const groupKey = isAr ? item.dateGroupAr : item.dateGroupEn;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});

  // Determine sliding side classes
  const sideClass = side === "left" 
    ? "left-0 xl:border-r border-y-0 border-l-0" 
    : "right-0 xl:border-l border-y-0 border-r-0";

  return (
    <>
      {/* Backdrop for mobile and iPad */}
      <div 
        onClick={closeNotifications}
        className="fixed inset-0 top-[64px] bg-black/50 z-30 xl:hidden transition-opacity duration-300"
      />

      <aside
        className={`notifications-panel fixed top-14 h-[calc(100vh-56px)] w-full max-w-full xl:w-[380px] xl:max-w-[380px] z-40 flex flex-col overflow-y-auto border transition-all duration-300 ${sideClass} ${t.border}`}
        data-side={side}
        style={{
          backgroundColor: isDark ? "#0C0F10" : "#FFFFFF",
          boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* 2. Header Section */}
        <div className={`w-full h-[73px] flex flex-row justify-between items-center px-5 py-5 border-b ${t.border}`}>
          {/* Title */}
          <h2 
            className={`font-normal text-xl leading-[32px] tracking-[-0.6px] select-none ${t.text}`}
            style={{ fontFamily: "Tajawal, sans-serif" }}
          >
            {isAr ? "الإشعارات" : "Notifications"}
          </h2>

          {/* Close Icon / Button (18px x 18px) */}
          <button
            type="button"
            onClick={closeNotifications}
            className={`w-[18px] h-[18px] flex items-center justify-center hover:opacity-85 transition-opacity cursor-pointer border-none bg-transparent ${t.closeBtn}`}
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 3. Tabs Navigation Section */}
        <div className={`px-5 py-4 border-b ${t.border} ${t.tabsBg}`}>
          <div className={`flex gap-2 p-1 rounded-xl border ${t.toggleBg} ${t.toggleBorder}`}>
            {/* Active / Toggle Tab Button ("الإشعارات") */}
            <button
              type="button"
              onClick={() => setActiveTab("mentions")}
              className={`flex-1 h-[36px] flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-[8px] text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "mentions"
                  ? t.tabActive
                  : t.tabInactive
              }`}
            >
              <span>{isAr ? "الإشعارات" : "Notifications"}</span>
              {mentionsCount > 0 && (
                <span className="flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-[#EF4444] text-white rounded-full min-w-[20px]">
                  {mentionsCount}
                </span>
              )}
            </button>

            {/* Inactive Tab Button ("كل النشاط") */}
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex-1 h-[36px] flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-[8px] text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? t.tabActive
                  : t.tabInactive
              }`}
            >
              {isAr ? "كل النشاط" : "All Activity"}
            </button>
          </div>
        </div>

        {/* 4. Notification Items List Area */}
        <div className={`flex-1 overflow-y-auto divide-y ${t.listDivide}`}>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm">
              <p>{isAr ? "لا توجد إشعارات جديدة" : "No new notifications"}</p>
            </div>
          ) : (
            Object.keys(groupedNotifications).map((groupName) => (
              <div key={groupName} className="flex flex-col">
                {/* Date divider */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${t.dateDividerLine}`}></div>
                  </div>
                  <span className={`relative px-3 py-0.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider rounded-full border select-none ${t.dateDividerText}`}>
                    {groupName}
                  </span>
                </div>

                {/* Notification items */}
                {groupedNotifications[groupName].map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`w-full min-h-[83.5px] flex flex-row items-start p-4 gap-4 border-b ${t.itemBorder} transition-colors duration-200 cursor-pointer ${
                      notif.unread ? t.itemUnread : "opacity-60"
                    } ${t.itemHover}`}
                  >
                    {/* Unread indicator dot */}
                    <div className="w-1.5 shrink-0 flex items-center justify-center self-stretch">
                      {notif.unread && (
                        <span className={`w-1.5 h-1.5 rounded-full ${t.itemUnreadDot}`} />
                      )}
                    </div>

                    {/* Sender Avatar */}
                    <div className={`relative shrink-0 w-10 h-10 rounded-full overflow-hidden border bg-white/5 ${t.avatarBorder}`}>
                      <img
                        src={notif.avatar}
                        alt={notif.sender}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80";
                        }}
                      />
                    </div>

                    {/* Text details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex flex-row items-baseline justify-between gap-2 mb-1">
                        <h4 className={`text-xs font-bold truncate ${t.senderText}`}>
                          {notif.sender}
                        </h4>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                          {isAr ? notif.timeAr : notif.timeEn}
                        </span>
                      </div>

                      <p className={`text-[11px] leading-relaxed break-words ${isAr ? "text-right" : "text-left"} ${t.msgText}`}>
                        {formatMessage(notif.message)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
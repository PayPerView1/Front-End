"use client";

import { createContext, useContext, useState } from "react";

const NotificationsContext = createContext(null);

const initialNotifications = [
  {
    id: 1,
    type: "mention",
    sender: "The Frame Of Time",
    username: "everyone",
    message: "@everyone صبااااح الخير للجميع 🌻",
    timeAr: "اليوم 05:41 ص",
    timeEn: "Today 05:41 AM",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80",
    unread: true,
    dateGroupAr: "اليوم",
    dateGroupEn: "Today",
  },
  {
    id: 2,
    type: "mention",
    sender: "Niko Lamberson",
    username: "everyone",
    message: "@everyone سيتم إرسال المدفوعات في أسرع وقت ممكن. نواجه مشكلة في المدفوعات ولكنني على تواصل مع الدعم الفني لحل المشكلة في أقرب وقت.",
    timeAr: "اليوم 01:29 ص",
    timeEn: "Today 01:29 AM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    unread: true,
    dateGroupAr: "اليوم",
    dateGroupEn: "Today",
  },
  {
    id: 3,
    type: "mention",
    sender: "The Frame Of Time",
    username: "everyone",
    message: "@everyone يووووا من قام بالفعل بنشر 3 مقاطع اليوم لحملة تيك توك التجريبية؟ اترك 'أنا' أدناه حتى نعرف من...",
    timeAr: "أمس 03:29 م",
    timeEn: "Yesterday 03:29 PM",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80",
    unread: true,
    dateGroupAr: "أمس",
    dateGroupEn: "Yesterday",
  },
  {
    id: 4,
    type: "mention",
    sender: "The Frame Of Time",
    username: "everyone",
    message: "@everyone بالمناسبة، ما زلنا نبحث عن صفحات الذكاء الاصطناعي / التكنولوجيا / الأعمال وصناع المحتوى على فيسبوك لـ Squibb's...",
    timeAr: "أمس 06:20 ص",
    timeEn: "Yesterday 06:20 AM",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80",
    unread: true,
    dateGroupAr: "أمس",
    dateGroupEn: "Yesterday",
  },
];

export function NotificationsProvider({ children }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const closeNotifications = () => {
    setIsNotificationsOpen(false);
  };

  const toggleExpandNotifications = () => {
    setIsNotificationsExpanded((prev) => !prev);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <NotificationsContext.Provider
      value={{
        isNotificationsOpen,
        isNotificationsExpanded,
        notifications,
        unreadCount,
        toggleNotifications,
        closeNotifications,
        toggleExpandNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications لازم يستخدم جوا NotificationsProvider");
  }
  return context;
}

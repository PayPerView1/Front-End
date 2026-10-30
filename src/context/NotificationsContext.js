"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { buildNotification } from "@/components/notificationKinds";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notifications";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState(null);

  const refreshNotifications = useCallback(async () => {
    setIsNotificationsLoading(true);
    setNotificationsError(null);
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      setNotificationsError(error.message);
    } finally {
      setIsNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getNotifications()
      .then((data) => {
        if (isMounted) setNotifications(data || []);
      })
      .catch((error) => {
        if (isMounted) setNotificationsError(error.message);
      })
      .finally(() => {
        if (isMounted) setIsNotificationsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const closeNotifications = () => {
    setIsNotificationsOpen(false);
  };

  const toggleExpandNotifications = () => {
    setIsNotificationsExpanded((prev) => !prev);
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        String(notif.id) === String(id) ? { ...notif, unread: false } : notif
      )
    );
    try {
      await markNotificationRead(id);
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, unread: false })));
    try {
      await markAllNotificationsRead();
    } catch (e) {
      console.error(e);
    }
  };

  // يضيف إشعاراً جديداً بأعلى القائمة
  const addNotification = useCallback((kindOrNotif, params = {}) => {
    if (typeof kindOrNotif === "object" && kindOrNotif !== null) {
      setNotifications((prev) => [
        {
          id: kindOrNotif.id || `notif-${Date.now()}`,
          unread: true,
          createdAt: new Date().toISOString(),
          dateGroupAr: "اليوم",
          dateGroupEn: "Today",
          ...kindOrNotif,
        },
        ...prev,
      ]);
      return;
    }
    setNotifications((prev) => [buildNotification(kindOrNotif, params), ...prev]);
  }, []);

  // إشعار اكتمال فترة الأمان للأرباح (مرور 7 أيام) كما في التصميم
  const addEarningsNotification = useCallback(
    ({
      name = "صهيب",
      amount = "2,753.80",
      days = 7,
      clipTitle = "استثمار الذكاء الاصطناعي في ريادة الأعمال",
      clipTitleEn = "AI Investing in Entrepreneurship",
      isAr = true,
      timeAr = "اليوم 11:34 ص",
      timeEn = "Today 11:34 AM",
    } = {}) => {
      const id = "earnings-7days-completed";
      const title = isAr
        ? `تم تحديث أرباحك بنجاح! + ${amount} ر.س`
        : `Earnings updated successfully! + ${amount} SAR`;
      const message = isAr
        ? `مبارك يا ${name}! اكتملت فترة الأمان (${days} أيام) لمقطع «${clipTitle}». تم تحويل مبلغ ${amount} ر.س تلقائياً إلى رصيدك المتاح للسحب الآن.`
        : `Congratulations ${name}! The safety period (${days} days) for "${clipTitleEn}" has completed. An amount of ${amount} SAR was automatically transferred to your withdrawable balance now.`;

      const avatar =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><circle cx='20' cy='20' r='20' fill='%23191C1D'/><circle cx='20' cy='20' r='18' fill='%23242A29' stroke='%230FBC5F' stroke-width='1.5'/><circle cx='20' cy='20' r='13' fill='%2310B981' fill-opacity='0.2'/><path d='M20 11v18M15 15h6.5a3.5 3.5 0 0 1 0 7H17a3.5 3.5 0 0 0 0 7H24' stroke='%2310B981' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>";

      setNotifications((prev) => {
        const notifItem = {
          id,
          type: "mention",
          unread: true,
          sender: title,
          message,
          avatar,
          createdAt: new Date().toISOString(),
          dateGroupAr: "اليوم",
          dateGroupEn: "Today",
          timeAr,
          timeEn,
        };

        const index = prev.findIndex((n) => n.id === id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...notifItem };
          return updated;
        }
        return [notifItem, ...prev];
      });
    },
    []
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <NotificationsContext.Provider
      value={{
        isNotificationsOpen,
        isNotificationsExpanded,
        notifications,
        unreadCount,
        isNotificationsLoading,
        notificationsError,
        refreshNotifications,
        toggleNotifications,
        closeNotifications,
        toggleExpandNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        addEarningsNotification,
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

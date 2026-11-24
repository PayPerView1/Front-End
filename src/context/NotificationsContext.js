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
    setNotificationsError(null);
    try {
      await markNotificationRead(id);
    } catch (e) {
      setNotificationsError(e.message);
      return;
    }
    setNotifications((prev) =>
      prev.map((notif) =>
        String(notif.id) === String(id) ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = async () => {
    setNotificationsError(null);
    try {
      await markAllNotificationsRead();
    } catch (e) {
      setNotificationsError(e.message);
      return;
    }
    setNotifications((prev) => prev.map((notif) => ({ ...notif, unread: false })));
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

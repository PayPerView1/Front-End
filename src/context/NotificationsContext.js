"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { buildNotification } from "@/components/notificationKinds";
import { getNotifications } from "@/services/notifications";
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
      setNotifications(await getNotifications());
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
        if (isMounted) setNotifications(data);
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

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        String(notif.id) === String(id) ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, unread: false })));
  };

  // يضيف إشعاراً جديداً بأعلى القائمة
  // addNotification("APPLICATION_ACCEPTED", { campaign: "عطور الأصالة" })
  const addNotification = useCallback((kind, params = {}) => {
    setNotifications((prev) => [buildNotification(kind, params), ...prev]);
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
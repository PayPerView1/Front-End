import { KIND_META } from "@/components/notificationKinds";
import axiosInstance, { handleError } from "@/lib/axiosInstance";

function getNotificationList(payload) {
  if (payload?.success === false) {
    throw new Error(payload.message || "تعذر جلب الإشعارات");
  }

  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.notifications)
        ? payload.notifications
        : Array.isArray(payload?.data?.notifications)
          ? payload.data.notifications
          : null;

  if (!list) {
    throw new Error("استجابة الإشعارات من الخادم غير صالحة");
  }

  return list.map((notification) => {
    if (!notification || typeof notification !== "object") {
      throw new Error("بيانات أحد الإشعارات من الخادم غير صالحة");
    }

    const id = notification.id ?? notification._id ?? notification.notificationId;
    if (id === undefined || id === null) {
      throw new Error("أحد الإشعارات لا يحتوي على معرّف");
    }

    const kind =
      notification.kind ??
      (KIND_META[notification.type] ? notification.type : undefined);
    const unread =
      typeof notification.unread === "boolean"
        ? notification.unread
        : typeof notification.isRead === "boolean"
          ? !notification.isRead
          : typeof notification.read === "boolean"
            ? !notification.read
            : false;

    return {
      ...notification,
      id,
      kind,
      type: notification.type ?? "activity",
      params: notification.params ?? notification.metadata ?? {},
      unread,
      sender:
        notification.sender ??
        notification.actor?.name ??
        notification.user?.name ??
        notification.title ??
        "",
      avatar:
        notification.avatar ??
        notification.actor?.avatar ??
        notification.user?.avatar ??
        "",
      message:
        notification.message ??
        notification.body ??
        notification.content ??
        notification.title ??
        "",
    };
  });
}

export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/notifications");
    return getNotificationList(response.data);
  } catch (error) {
    handleError(error);
  }
};

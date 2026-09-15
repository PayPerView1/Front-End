import axiosInstance from "@/lib/axiosInstance";

const BASE = "/api/v1/chat/threads";

// ── Threads ──────────────────────────────────────────────────────────────────

/** إنشاء محادثة جديدة */
export const createThread = async (title = "") => {
  const body = title.trim() ? { title: title.trim() } : {};
  const { data } = await axiosInstance.post(BASE, body);
  
  return {
    ...data.data,
    id: data.data.threadId || data.data.id,
  };
};

/** جلب قائمة المحادثات */
export const getThreads = async () => {
  const { data } = await axiosInstance.get(BASE);
  return data.data; // [{ id, title, updatedAt, lastMessage }]
};

/** حذف محادثة */
export const deleteThread = async (threadId) => {
  const { data } = await axiosInstance.delete(`${BASE}/${threadId}`);
  return data; // { success, message }
};

// ── Messages ─────────────────────────────────────────────────────────────────

/** جلب رسائل محادثة */
export const getMessages = async (threadId) => {
  const { data } = await axiosInstance.get(`${BASE}/${threadId}/messages`);
  return data.data; // [{ _id, role, content, created_at }]
};

/** إرسال رسالة والحصول على رد الـ AI */
export const sendMessage = async (threadId, content) => {
  const { data } = await axiosInstance.post(
    `${BASE}/${threadId}/messages`,
    { content }
  );
  return data.data.message; // { id, role, content, createdAt }
};
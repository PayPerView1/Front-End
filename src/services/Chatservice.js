import axiosInstance, { AI_REQUEST_TIMEOUT_MS } from "@/lib/axiosInstance";

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
  if (data?.success !== true || !Array.isArray(data.data)) {
    throw new Error(data?.message || "The conversation list response is invalid.");
  }
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
  return (data.data || []).map((message) => ({
    ...message,
    _id: message.id || message._id,
    created_at: message.createdAt || message.created_at,
  }));
};

/** إرسال رسالة والحصول على رد الـ AI */
export const sendMessage = async (threadId, content) => {
  const { data } = await axiosInstance.post(
    `${BASE}/${threadId}/messages`,
    { content },
    { timeout: AI_REQUEST_TIMEOUT_MS }
  );
  return data.data.message; // { id, role, content, createdAt, language, suggestedActions }
};

export const submitMessageFeedback = async (threadId, messageId, rating) => {
  const { data } = await axiosInstance.patch(
    `${BASE}/${threadId}/messages/${messageId}/feedback`,
    { rating }
  );
  return data.data;
};

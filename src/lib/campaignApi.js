const BASE = "/api/v1";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// حفظ مسودة جديدة
export async function saveDraft(data) {
  const res = await fetch(`${BASE}/campaigns/drafts`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// auto-save مسودة موجودة
export async function autoSaveDraft(draftId, data) {
  const res = await fetch(`${BASE}/campaigns/drafts/${draftId}/auto-save`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// تحويل مسودة لحملة
export async function submitDraft(draftId) {
  const res = await fetch(`${BASE}/campaigns/drafts/${draftId}/submit`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  return res.json();
}

// إنشاء حملة مباشرة
export async function createCampaign(formData) {
  const res = await fetch(`${BASE}/campaigns`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return res.json();
}
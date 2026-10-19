import axiosInstance from "@/lib/axiosInstance";

// true = بيانات تجريبية. خليها false لما يجهز الـ API
const USE_MOCK = true;

const STORE_KEY = "mock-submission";

const unwrap = (res) => res?.data?.data || res?.data;

const apiError = (code, details = {}) => {
  const error = new Error(code);
  error.response = { data: { code, details } };
  return error;
};

const mockBase = {
  id: "mock-1",
  reference: "SUB-2026-8842",
  campaignId: "wafi",
  platform: "tiktok",
  link: "https://www.tiktok.com/@creator/video/73928192849",
  aiScore: 96,
  checks: [],
  requiredFixes: [],
  rewardAmount: 800,
  review: { etaMinHours: 4, etaMaxHours: 8 },
};

export async function createSubmission({ campaignId, platform, link }) {
  if (USE_MOCK) {
    // للتجربة: أي رابط فيه كلمة missing أو duplicate بيرجع خطأ
    if (link.includes("missing")) {
      throw apiError("MISSING_HASHTAGS", { missingHashtags: ["#التمويل_إسلامي"] });
    }
    if (link.includes("duplicate")) {
      throw apiError("DUPLICATE_LINK", {
        previous: {
          reference: "SUB-2024-8119",
          rewardAmount: 800,
          rewardStatus: "paid",
          campaignId,
          submittedAt: "2026-08-14T04:30:00",
        },
      });
    }

    // نحفظ الرابط عشان صفحة النتيجة تعرضه
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ campaignId, platform, link }));
    } catch {
      // ignore
    }
    return { ...mockBase, campaignId, platform, link, status: "PROCESSING" };
  }

  const res = await axiosInstance.post("/api/v1/submissions", {
    campaignId,
    platform,
    link,
  });
  return unwrap(res);
}

export async function getSubmission(id, mockStatus) {
  if (USE_MOCK) {
    let saved = {};
    try {
      saved = JSON.parse(sessionStorage.getItem(STORE_KEY)) || {};
    } catch {
      // ignore
    }

    const map = {
      approved: "APPROVED",
      rejected: "REJECTED",
      review: "MANUAL_REVIEW",
    };
    const status = map[mockStatus] || "PROCESSING";

    return {
      ...mockBase,
      ...saved,
      status,
      requiredFixes:
        status === "REJECTED" ? [{ key: "audio" }, { key: "hashtag" }] : [],
    };
  }

  const res = await axiosInstance.get(`/api/v1/submissions/${id}`);
  return unwrap(res);
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "@/i18n/navigation";
import { getSubmission, getSubmissionViews, withdrawSubmission } from "@/services/submissions";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import ClipHeader from "./ClipHeader";
import StatusBanner from "./StatusBanner";
import DailyViewsChart from "./DailyViewsChart";
import InsightsRow from "./InsightsRow";

// ─── ألوان الثيمين ───────────────────────────────────────────
const darkTheme = {
  page: "bg-[#000000F2]",
  card: "border-black bg-[#191C1D]",
  sub: "bg-[#232729]",
  title: "text-white",
  muted: "text-gray-400",
  faint: "text-gray-500",
  mint: "text-[#94D3C1]",
  pill: "border-white/10 bg-[#191C1D] text-gray-200",
  chip: "bg-white/5 text-gray-300",
  num: "bg-white/10 text-white",
  gold: "text-[#E9C349] bg-[#E9C349]/10",
  green: "text-[#94D3C1] bg-[#94D3C1]/10",
  neutral: "text-gray-300 bg-white/5",
  stepActive: "border-[#E9C349]/40 bg-[#E9C349]/5",
  stepIdle: "border-black bg-[#232729]",
  stepDoneBox: "border-[#94D3C1]/30 bg-[#94D3C1]/5",
  stepDone: "bg-[#94D3C1] text-black",
  stepNow: "bg-[#E9C349]/20 text-[#E9C349]",
  stepPending: "bg-white/5 text-gray-500",
  btnGhost: "bg-white/10 text-white ",
  btnLink: "border-white/10 text-gray-300 ",
  handshake: "border-[#E9C349]/30 bg-[#E9C349]/10 text-[#E9C349]",
};

const lightTheme = {
  page: "bg-[#F4F6F6]",
  card: "border-[#E5E7E7] bg-white shadow-sm",
  sub: "bg-[#EEF3F2]",
  title: "text-[#1A1A1A]",
  muted: "text-[#666666]",
  faint: "text-[#8A8A8A]",
  mint: "text-[#2F9E83]",
  pill: "border-[#E5E7E7] bg-white text-[#333333]",
  chip: "bg-black/5 text-[#666666]",
  num: "bg-black/10 text-[#1A1A1A]",
  gold: "text-[#B7860B] bg-[#D9A400]/10",
  green: "text-[#2F9E83] bg-[#2F9E83]/10",
  neutral: "text-[#666666] bg-black/5",
  stepActive: "border-[#D9A400]/40 bg-[#D9A400]/5",
  stepIdle: "border-[#E5E7E7] bg-[#EEF3F2]",
  stepDoneBox: "border-[#2F9E83]/30 bg-[#2F9E83]/5",
  stepDone: "bg-[#2F9E83] text-white",
  stepNow: "bg-[#D9A400]/20 text-[#B7860B]",
  stepPending: "bg-black/5 text-[#8A8A8A]",
  btnGhost: "bg-black/5 text-[#1A1A1A] hover:bg-black/10",
  btnLink: "border-[#E5E7E7] text-[#666666] hover:bg-black/5",
  handshake: "border-[#D9A400]/40 bg-[#D9A400]/10 text-[#B7860B]",
};

// ─── تحويل SubmissionDetail → شكل clip المحلي ─────────────────────────────────
const PLATFORM_MAP = {
  TIKTOK: "tiktok",
  INSTAGRAM: "reels",
  YOUTUBE: "shorts",
};

function mapDisplayStatus(ds) {
  if (["PROCESSING", "MANUAL_REVIEW", "AWAITING_ADVERTISER"].includes(ds)) return "waiting";
  if (["AI_REJECTED", "REJECTED", "CHANGES_REQUESTED"].includes(ds)) return "error";
  if (ds === "WITHDRAWN") return "withdrawn";
  if (ds === "APPROVED") return "normal";
  return "unknown";
}

function formatDuration(sec) {
  if (!sec) return "00:00";
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function mapToClip(sub) {
  return {
    id: sub.id,
    code: sub.code,
    displayStatus: sub.displayStatus,
    status: mapDisplayStatus(sub.displayStatus),
    platform: PLATFORM_MAP[sub.platform] || "unknown",
    title: sub.campaign?.name || "—",
    campaign: sub.campaign?.brand?.name || "—",
    publishedAgo: sub.submittedAt
      ? new Date(sub.submittedAt).toLocaleDateString("ar-SA")
      : "",
    publishedLabel: sub.submittedAt
      ? new Date(sub.submittedAt).toLocaleString("ar-SA")
      : "",
    completion: null,
    earnings: sub.reward ?? null,
    rate: null,
    views: sub.preview?.stats?.viewCount ?? null,
    duration: formatDuration(sub.preview?.durationSec),
    seconds: sub.preview?.durationSec ?? null,
    thumbnail: sub.preview?.thumbnailUrl || null,
    url: sub.postUrl || sub.canonicalUrl || null,
    daily: null,
    aiScore: sub.aiScore ?? null,
    checks: sub.checks || [],
    rejectionReasons: Array.isArray(sub.rejectionReasons) ? sub.rejectionReasons : [],
    rejectedBy: sub.rejectedBy || null,
    reviewNote: sub.reviewNote || null,
    canWithdraw: sub.canWithdraw ?? false,
    canUpdateLink: sub.canUpdateLink ?? false,
    canResubmit: sub.canResubmit ?? false,
    steps: sub.steps || [],
    manualReview: sub.manualReview || null,
    campaignId: sub.campaign?.id || sub.campaignId || sub.campaign?._id || "",
  };
}

/* ---------- الصفحة الرئيسية ---------- */
export default function ClipDetailsView() {
  const { id } = useParams();
  const locale = useLocale();
  const tr = useTranslations("contentPerformance.details");
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  const [clip, setClip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);
  const [viewsError, setViewsError] = useState(null);

  const handleWithdraw = async () => {
    if (!window.confirm("هل أنت متأكد من سحب هذا التسليم لتحرير الرابط وتعديله؟")) return;
    setWithdrawing(true);
    try {
      await withdrawSubmission(id);
      setActionAlert({ type: "success", text: "تم سحب المقطع بنجاح، يمكنك الآن تعديله وإعادة تقديمه." });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setActionAlert({ type: "error", text: err?.response?.data?.message || "فشلت عملية السحب" });
    } finally {
      setWithdrawing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fetchSubmission = async () => {
      setLoading(true);
      setError(null);
      setViewsError(null);
      try {
        const [data, viewsResponse] = await Promise.all([
          getSubmission(id),
          getSubmissionViews(id, { page: 1, perPage: 100 }).catch((viewError) => {
            if (!cancelled) setViewsError(viewError?.response?.data?.message || viewError?.message || "View analytics are unavailable.");
            return null;
          }),
        ]);
        if (!cancelled && data) {
          const mapped = mapToClip(data);
          let snapshots = viewsResponse?.data || [];
          const totalPages = Number(viewsResponse?.pagination?.totalPages) || 1;
          if (totalPages > 1) {
            const remainingPages = await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) =>
              getSubmissionViews(id, { page: index + 2, perPage: 100 })
            ));
            snapshots = [...snapshots, ...remainingPages.flatMap((page) => page.data || [])];
          }
          if (snapshots.length) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const firstDay = new Date(today);
            firstDay.setDate(firstDay.getDate() - 6);
            const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const dailyTotals = new Map();
            snapshots.forEach((snapshot) => {
              const capturedAt = new Date(snapshot.capturedAt);
              if (Number.isNaN(capturedAt.getTime()) || capturedAt < firstDay || capturedAt > new Date()) return;
              const key = dayKey(capturedAt);
              const day = dailyTotals.get(key) || { date: capturedAt, views: 0 };
              day.views += Number(snapshot.deltaViews) || 0;
              dailyTotals.set(key, day);
            });
            mapped.daily = [...dailyTotals.values()].sort((a, b) => new Date(a.date) - new Date(b.date));
            const latestSnapshot = [...snapshots].sort((a, b) => new Date(b.capturedAt) - new Date(a.capturedAt))[0];
            const latestViews = Number(latestSnapshot.views);
            mapped.views = Number.isFinite(latestViews) ? latestViews : mapped.views;
          }
          setClip(mapped);
        } else if (!cancelled) {
          setError("لم يُعثر على التسليم");
        }
      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.message || "تعذّر تحميل التفاصيل");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSubmission();
    return () => { cancelled = true; };
  }, [id]);

  const status = clip?.status || "unknown";
  const showAnalytics = status === "normal" || status === "anomaly";
  const BackIcon = locale === "ar" ? FiArrowRight : FiArrowLeft;

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${t.page}`}>
        <Loader2 size={32} className="animate-spin text-[#FB8F00]" />
      </div>
    );
  }

  if (error || !clip) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center gap-4 p-8 ${t.page}`}>
        <p className={`text-sm ${t.muted}`}>{error || "لم يُعثر على التسليم"}</p>
        <Link
          href="/creator/content-performance"
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${t.pill}`}
        >
          <BackIcon size={16} />
          {tr("back")}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`font-tajawal space-y-3 p-2 md:p-4 ${t.page}`}
      style={{ fontFamily: "var(--font-tajawal)" }}
    >
      <div className="flex justify-start">
        <Link
          href="/creator/content-performance"
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${t.pill}`}
        >
          <BackIcon size={16} color={isDark ? "#94D3C1" : "#2F9E83"}/>
          {status === "anomaly" ? tr("backToList") : tr("back")}
        </Link>
      </div>

      {actionAlert && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold ${
            actionAlert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {actionAlert.text}
        </div>
      )}

      {(clip.canWithdraw || clip.canResubmit) && (
        <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${t.card}`}>
          <div>
            <p className={`text-sm font-bold ${t.title}`}>
              {clip.canResubmit ? "المقطع بحاجة لتعديل وإعادة تسليم" : "متاح سحب المقطع لتعديل المنشور"}
            </p>
            <p className={`text-xs ${t.muted}`}>
              {clip.canResubmit
                ? "يمكنك تعديل الفيديو على المنصة ثم الضغط على زر إعادة التسليم لتحديث الرابط."
                : "طالما أن المقطع لم يتم اعتماده نهائياً، يمكنك سحبه لتحرير الرابط ونشره مجدداً."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {clip.canWithdraw && (
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
              >
                {withdrawing ? "جاري السحب..." : "سحب المقطع للتعديل"}
              </button>
            )}
            {clip.canResubmit && (
              <Link
                href={clip.campaignId ? `/creator/start-project/${clip.campaignId}` : "/creator/start-project"}
                className="flex items-center gap-1.5 rounded-xl bg-[linear-gradient(90deg,#FB8B03_0%,#FA6203_100%)] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition"
              >
                إعادة التسليم
              </Link>
            )}
          </div>
        </div>
      )}

      <StatusBanner status={status} clip={clip} />
      {status === "withdrawn" && <div role="status" className={`rounded-xl border p-4 text-sm ${t.card}`}>{locale === "ar" ? "تم سحب هذا التسليم ولم يعد ضمن المحتوى النشط." : "This submission was withdrawn and is no longer active."}</div>}
      <ClipHeader clip={clip} status={status} />

      {viewsError && <p role="status" className={`text-xs ${t.muted}`}>{locale === "ar" ? "بيانات المشاهدات غير متاحة حالياً." : "View analytics are currently unavailable."}</p>}

      {showAnalytics && (
        <>
          <DailyViewsChart daily={clip.daily} />
          <InsightsRow clip={clip} />
        </>
      )}

      {(clip.reviewNote || clip.rejectionReasons.length > 0) && (
        <section className={`space-y-3 rounded-2xl border p-5 ${t.card}`}>
          <h2 className={`text-base font-bold ${t.title}`}>
            {locale === "ar" ? "ملاحظات المراجعة" : "Review details"}
          </h2>
          {clip.reviewNote && <p className={`text-sm leading-7 ${t.muted}`}>{clip.reviewNote}</p>}
          {clip.rejectionReasons.length > 0 && (
            <ul className={`list-inside list-disc space-y-1 text-sm ${t.muted}`}>
              {clip.rejectionReasons.map((reason, index) => (
                <li key={`${index}-${reason}`}>{typeof reason === "string" ? reason : reason.message || reason.reason || JSON.stringify(reason)}</li>
              ))}
            </ul>
          )}
        </section>
      )}
      {status === "unknown" && (
        <p role="status" className={`rounded-xl border p-4 text-sm ${t.card} ${t.muted}`}>
          {locale === "ar" ? "حالة التسليم غير متاحة حالياً." : "Submission status is currently unavailable."}
        </p>
      )}
    </div>
  );
}

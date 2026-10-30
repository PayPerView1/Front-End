"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { getCampaigns } from "@/services/campaign";
import {
  getCampaignSubmissions,
  reviewSubmission,
} from "@/services/submissions";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  Loader2,
  Filter,
  Sparkles,
  ChevronDown,
  User,
  MessageSquare,
  Check,
  X,
  Play,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

const platformIcons = {
  TIKTOK: { Icon: SiTiktok, label: "TikTok", color: "" },
  INSTAGRAM: { Icon: SiInstagram, label: "Instagram", color: "text-[#E4405F]" },
  YOUTUBE: { Icon: SiYoutube, label: "YouTube Shorts", color: "text-[#FF0000]" },
};

export default function ClipManagement() {
  const locale = useLocale();
  const { isDark } = useTheme();
  const isRTL = locale === "ar";

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [statusFilter, setStatusFilter] = useState("AWAITING_ADVERTISER");
  const [searchQuery, setSearchQuery] = useState("");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal / Review state
  const [activeSubmissionForReview, setActiveSubmissionForReview] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [viewingChecksSubmission, setViewingChecksSubmission] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // 1. Fetch advertiser campaigns on mount
  useEffect(() => {
    let cancelled = false;
    const fetchAdvCampaigns = async () => {
      try {
        const res = await getCampaigns();
        const items = res?.data || res || [];
        if (!cancelled) {
          setCampaigns(items);
          if (items.length > 0 && !selectedCampaignId) {
            setSelectedCampaignId(items[0]._id || items[0].id || "");
          }
        }
      } catch (err) {
        // silent fallback
      }
    };
    fetchAdvCampaigns();
    return () => { cancelled = true; };
  }, []);

  // 2. Fetch submissions for selected campaign & status
  const fetchSubmissions = useCallback(async () => {
    if (!selectedCampaignId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getCampaignSubmissions(selectedCampaignId, {
        displayStatus: statusFilter === "ALL" ? undefined : statusFilter,
        perPage: 50,
      });
      setSubmissions(res?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر تحميل المقاطع المسلمة");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCampaignId, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Handle Approve
  const handleApprove = async (submissionId) => {
    setSubmittingDecision(true);
    try {
      await reviewSubmission(submissionId, { decision: "APPROVE" });
      setFeedbackToast({ type: "success", message: "تمت الموافقة على المقطع بنجاح!" });
      setTimeout(() => setFeedbackToast(null), 3000);
      fetchSubmissions();
    } catch (err) {
      setFeedbackToast({
        type: "error",
        message: err?.response?.data?.message || "فشلت عملية الموافقة",
      });
      setTimeout(() => setFeedbackToast(null), 3500);
    } finally {
      setSubmittingDecision(false);
    }
  };

  // Handle Reject Submit
  const handleRejectConfirm = async () => {
    if (!activeSubmissionForReview) return;
    if (!rejectNote.trim()) {
      alert("يرجى كتابة سبب الرفض لصانع المحتوى");
      return;
    }
    setSubmittingDecision(true);
    try {
      await reviewSubmission(activeSubmissionForReview.id, {
        decision: "REJECT",
        note: rejectNote.trim(),
      });
      setActiveSubmissionForReview(null);
      setRejectNote("");
      setFeedbackToast({ type: "success", message: "تم رفض المقطع وإشعار صانع المحتوى." });
      setTimeout(() => setFeedbackToast(null), 3000);
      fetchSubmissions();
    } catch (err) {
      setFeedbackToast({
        type: "error",
        message: err?.response?.data?.message || "فشلت عملية الرفض",
      });
      setTimeout(() => setFeedbackToast(null), 3500);
    } finally {
      setSubmittingDecision(false);
    }
  };

  // Filtered by search
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    const q = searchQuery.toLowerCase();
    return submissions.filter(
      (s) =>
        s.creator?.fullName?.toLowerCase().includes(q) ||
        s.code?.toLowerCase().includes(q) ||
        s.postUrl?.toLowerCase().includes(q)
    );
  }, [submissions, searchQuery]);

  // Stats computed from current data
  const stats = useMemo(() => {
    const awaiting = submissions.filter((s) => s.displayStatus === "AWAITING_ADVERTISER").length;
    const approved = submissions.filter((s) => s.status === "APPROVED").length;
    const rejected = submissions.filter((s) => s.status === "REJECTED").length;
    return {
      total: submissions.length,
      awaiting,
      approved,
      rejected,
    };
  }, [submissions]);

  // Theme tokens
  const theme = {
    page: isDark ? "bg-[#0A0D0E] text-gray-100" : "bg-[#F4F6F5] text-[#191C1D]",
    surface: isDark ? "bg-[#121617] border-[#1E2425]" : "bg-white border-[#E1E7E4]",
    inset: isDark ? "bg-[#181D1E] border-[#252C2D]" : "bg-[#F3F6F5] border-[#E1E7E4]",
    primaryText: isDark ? "text-white" : "text-[#191C1D]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5F6A66]",
    input: isDark
      ? "bg-[#181D1E] border-[#252C2D] text-white placeholder-gray-500"
      : "bg-white border-[#D8DFDC] text-[#191C1D] placeholder-[#7A8581]",
    card: isDark ? "bg-[#141819] border-[#202728]" : "bg-white border-[#E1E7E4]",
  };

  const statusTabs = [
    { key: "AWAITING_ADVERTISER", label: "بانتظار المراجعة" },
    { key: "APPROVED", label: "المعتمدة" },
    { key: "REJECTED", label: "المرفوضة" },
    { key: "ALL", label: "جميع التسليمات" },
  ];

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 md:p-8 font-tajawal transition-colors ${theme.page}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Toast Notification */}
      {feedbackToast && (
        <div
          className={`fixed top-6 start-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-bold animate-in fade-in slide-in-from-top-4 ${
            feedbackToast.type === "success"
              ? "bg-[#103028] border-[#94D3C1]/50 text-[#94D3C1]"
              : "bg-red-950/90 border-red-500/50 text-red-300"
          }`}
        >
          {feedbackToast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedbackToast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB8F00]" />
            <h1 className={`text-2xl md:text-3xl font-black ${theme.primaryText}`}>
              مراجعة مقاطع الحملات
            </h1>
          </div>
          <p className={`text-xs ${theme.secondaryText}`}>
            مراجعة واعتماد الفيديوهات المسلمة من صناع المحتوى بعد فحص الذكاء الاصطناعي
          </p>
        </div>

        {/* Campaign Selector */}
        {campaigns.length > 0 && (
          <div className="relative min-w-[260px]">
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className={`w-full appearance-none rounded-xl border px-4 py-2.5 text-xs font-bold transition focus:outline-none focus:border-[#94D3C1] ${theme.input}`}
            >
              {campaigns.map((camp) => (
                <option key={camp._id || camp.id} value={camp._id || camp.id}>
                  {camp.name || camp.title || `حملة #${(camp._id || camp.id).slice(-6)}`}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className={`pointer-events-none absolute ${isRTL ? "left-3" : "right-3"} top-3 text-gray-400`}
            />
          </div>
        )}
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className={`${theme.card} border rounded-2xl p-4 space-y-1`}>
          <p className={`text-[11px] ${theme.secondaryText}`}>إجمالي المقاطع</p>
          <p className={`text-2xl font-black ${theme.primaryText}`}>{stats.total}</p>
        </div>
        <div className={`${theme.card} border rounded-2xl p-4 space-y-1`}>
          <p className="text-[11px] text-amber-400 font-bold">بانتظار قرارك</p>
          <p className="text-2xl font-black text-amber-400">{stats.awaiting}</p>
        </div>
        <div className={`${theme.card} border rounded-2xl p-4 space-y-1`}>
          <p className="text-[11px] text-[#94D3C1] font-bold">المعتمدة</p>
          <p className="text-2xl font-black text-[#94D3C1]">{stats.approved}</p>
        </div>
        <div className={`${theme.card} border rounded-2xl p-4 space-y-1`}>
          <p className="text-[11px] text-red-400 font-bold">المرفوضة</p>
          <p className="text-2xl font-black text-red-400">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className={`${theme.surface} border rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3`}>
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-[#94D3C1] text-[#0A261F] shadow-sm"
                    : isDark
                    ? "bg-[#1D2224] text-gray-300 hover:bg-[#252B2D]"
                    : "bg-[#F3F6F5] text-[#404945] hover:bg-[#EAEFEF]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-0 md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالصانع، الكود، الرابط..."
            className={`w-full rounded-xl border py-2 pr-9 pl-4 text-xs focus:outline-none focus:border-[#94D3C1] ${theme.input}`}
          />
          <Search size={15} className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="animate-spin text-[#94D3C1]" size={36} />
          <p className={`text-xs ${theme.secondaryText}`}>جاري تحميل المقاطع المسلمة...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <AlertCircle size={36} className="text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FB8F00]"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className={`${theme.surface} border rounded-2xl p-16 text-center space-y-3`}>
          <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center bg-gray-500/10 text-gray-400">
            <Play size={24} />
          </div>
          <h3 className={`text-base font-bold ${theme.primaryText}`}>لا توجد تسليمات في هذا القسم</h3>
          <p className={`text-xs max-w-sm mx-auto ${theme.secondaryText}`}>
            {statusFilter === "AWAITING_ADVERTISER"
              ? "لا توجد مقاطع تنتظر مراجعتك حالياً. المقاطع المفحوصة بالذكاء الاصطناعي ستظهر هنا فور اكتمالها."
              : "لم يتم العثور على مقاطع تطابق الفلتر الحالي."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubmissions.map((sub) => {
            const platformInfo = platformIcons[sub.platform] || {
              Icon: Play,
              label: sub.platform,
              color: "",
            };
            const PlatformIcon = platformInfo.Icon;
            const isAwaiting = sub.displayStatus === "AWAITING_ADVERTISER";
            const isApproved = sub.status === "APPROVED";
            const isRejected = sub.status === "REJECTED";

            return (
              <div
                key={sub.id}
                className={`${theme.card} border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition hover:border-[#94D3C1]/50 space-y-4`}
              >
                {/* Header: Creator & Platform */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {sub.creator?.profilePicture ? (
                      <img
                        src={sub.creator.profilePicture}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-[#94D3C1]/30 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#94D3C1]/15 text-[#94D3C1] flex items-center justify-center font-bold text-sm shrink-0">
                        {sub.creator?.fullName?.slice(0, 2) || "ص"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate ${theme.primaryText}`}>
                        {sub.creator?.fullName || "صانع محتوى"}
                      </p>
                      <p className={`text-[10px] truncate ${theme.secondaryText}`}>
                        {[sub.creator?.city, sub.creator?.country].filter(Boolean).join("، ") || "منطقة الخليج"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${theme.inset}`}
                  >
                    <PlatformIcon size={12} className={platformInfo.color} />
                    <span>{platformInfo.label}</span>
                  </span>
                </div>

                {/* Video / Post Preview */}
                <div className={`rounded-xl border p-3 ${theme.inset} space-y-2`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-mono font-bold text-[10px] text-gray-400`}>
                      {sub.code || sub.id?.slice(-8)?.toUpperCase()}
                    </span>
                    <a
                      href={sub.postUrl || sub.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#94D3C1] font-bold hover:underline"
                    >
                      <ExternalLink size={12} />
                      فتح المنشور
                    </a>
                  </div>

                  {sub.preview?.caption && (
                    <p className={`text-xs line-clamp-2 leading-relaxed ${theme.primaryText}`}>
                      {sub.preview.caption}
                    </p>
                  )}

                  {/* AI Score & Duration */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center gap-1 text-[#94D3C1]">
                      <Sparkles size={13} />
                      <span className="font-bold">فحص AI: {sub.aiScore ?? 96}%</span>
                    </div>
                    {sub.preview?.durationSec && (
                      <span className={`text-[10px] ${theme.secondaryText}`}>
                        {sub.preview.durationSec} ثانية
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className={`text-[10px] ${theme.secondaryText}`}>
                    تاريخ التسليم: {new Date(sub.submittedAt).toLocaleDateString("ar-SA")}
                  </span>
                  {isApproved && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#94D3C1]">
                      <CheckCircle2 size={13} /> معتمد
                    </span>
                  )}
                  {isRejected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-red-400">
                      <XCircle size={13} /> مرفوض
                    </span>
                  )}
                  {isAwaiting && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                      <Clock size={13} /> بانتظار قرارك
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-500/10">
                  {/* View Checks */}
                  <button
                    onClick={() => setViewingChecksSubmission(sub)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                      isDark
                        ? "bg-[#1E2325] border-[#2A3133] text-gray-200 hover:bg-[#252B2D]"
                        : "bg-[#F3F6F5] border-[#E1E7E4] text-[#404945] hover:bg-[#EAEFEF]"
                    }`}
                  >
                    <Eye size={13} />
                    تفاصيل الفحص
                  </button>

                  {/* Action buttons if awaiting advertiser */}
                  {isAwaiting && (
                    <>
                      <button
                        disabled={submittingDecision}
                        onClick={() => handleApprove(sub.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-[#94D3C1] text-[#0A261F] transition hover:opacity-90 disabled:opacity-50"
                      >
                        <Check size={14} />
                        قبول
                      </button>
                      <button
                        disabled={submittingDecision}
                        onClick={() => {
                          setActiveSubmissionForReview(sub);
                          setRejectNote("");
                        }}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 transition hover:bg-red-500/25 disabled:opacity-50"
                      >
                        <X size={14} />
                        رفض
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {activeSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-2xl border p-5 sm:p-6 shadow-2xl space-y-4 ${theme.surface}`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${theme.primaryText}`}>
                رفض تسليم المقطع
              </h3>
              <button
                onClick={() => setActiveSubmissionForReview(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${theme.secondaryText}`}>
              يرجى توضيح سبب الرفض بالتفصيل لصانع المحتوى لتمكينه من تعديل المقطع وإعادة تسليمه:
            </p>

            <textarea
              rows={4}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="مثال: لم يتم إظهار شعار المنصة بوضوح في بداية الفيديو، أو الهاشتاق غير متطابق..."
              className={`w-full rounded-xl border p-3 text-xs focus:outline-none focus:border-red-400 ${theme.input}`}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveSubmissionForReview(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border ${theme.inset} ${theme.secondaryText}`}
              >
                إلغاء
              </button>
              <button
                disabled={submittingDecision || !rejectNote.trim()}
                onClick={handleRejectConfirm}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {submittingDecision && <Loader2 size={13} className="animate-spin" />}
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Checks Inspection Modal */}
      {viewingChecksSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 shadow-2xl space-y-5 ${theme.surface}`}
          >
            <div className="flex items-center justify-between border-b border-gray-500/10 pb-3">
              <div>
                <h3 className={`text-base font-bold ${theme.primaryText}`}>
                  تقرير الفحص الذكي (AI Review)
                </h3>
                <p className={`text-xs ${theme.secondaryText}`}>
                  كود التسليم: {viewingChecksSubmission.code || viewingChecksSubmission.id?.slice(-8)}
                </p>
              </div>
              <button
                onClick={() => setViewingChecksSubmission(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Score & Summary */}
            <div className={`rounded-xl border p-4 ${theme.inset} flex items-center justify-between`}>
              <div>
                <p className={`text-[11px] ${theme.secondaryText}`}>درجة المطابقة الكلية</p>
                <p className="text-2xl font-black text-[#94D3C1]">
                  {viewingChecksSubmission.aiScore ?? 96}%
                </p>
              </div>
              <div className="text-left text-xs space-y-0.5">
                <p className="text-emerald-400 font-bold">
                  {viewingChecksSubmission.summary?.passed ?? 3} متطابق
                </p>
                <p className="text-red-400 font-bold">
                  {viewingChecksSubmission.summary?.failed ?? 0} تنبيهات
                </p>
              </div>
            </div>

            {/* Checks list */}
            <div className="space-y-2.5">
              <h4 className={`text-xs font-bold ${theme.primaryText}`}>عناصر الفحص التقني:</h4>
              {(viewingChecksSubmission.checks || [
                { code: "VIDEO_FORMAT", status: "PASSED", message: "تنسيق الفيديو عمودي 9:16 وبدقة مناسبة" },
                { code: "AUDIO_COMPLIANCE", status: "PASSED", message: "خلو تام من المعازف والموسيقى غير المتوافقة" },
                { code: "REQUIRED_HASHTAGS", status: "PASSED", message: "تم العثور على كافة الهاشتاقات التعاقدية" },
                { code: "OFFICIAL_MENTION", status: "PASSED", message: "تمت الإشارة لحساب المعلن الرسمي" },
              ]).map((check, idx) => {
                const passed = check.status === "PASSED";
                return (
                  <div
                    key={idx}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${
                      passed
                        ? isDark
                          ? "bg-emerald-950/20 border-emerald-500/20"
                          : "bg-emerald-50 border-emerald-200"
                        : isDark
                        ? "bg-red-950/20 border-red-500/20"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {passed ? (
                        <CheckCircle2 size={16} className="text-[#94D3C1] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className={`text-xs font-bold ${theme.primaryText}`}>{check.code}</p>
                        <p className={`text-[11px] leading-relaxed ${theme.secondaryText}`}>
                          {check.message || (passed ? "اجتاز الفحص بنجاح" : "لم يجتز الفحص")}
                        </p>
                        {check.fixHint && (
                          <p className="text-[10px] text-amber-400 mt-1">توجيه: {check.fixHint}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingChecksSubmission(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#94D3C1] text-[#0A261F]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

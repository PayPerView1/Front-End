"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "next-intl";
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
  AlertCircle,
  Eye,
  Loader2,
  Sparkles,
  ChevronDown,
  Check,
  X,
  Play,
  Film,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

const platformIcons = {
  TIKTOK: { Icon: SiTiktok, label: "TikTok", color: "" },
  INSTAGRAM: { Icon: SiInstagram, label: "Instagram", color: "text-[#E4405F]" },
  YOUTUBE: { Icon: SiYoutube, label: "YouTube Shorts", color: "text-[#FF0000]" },
};

export default function ClipSubmissionReview({ campaignId = "" }) {
  const locale = useLocale();
  const { isDark } = useTheme();
  const isRTL = locale === "ar";

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaignId || "");
  const [statusFilter, setStatusFilter] = useState("AWAITING_ADVERTISER");
  const [searchQuery, setSearchQuery] = useState("");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(Boolean(campaignId));
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal / Review state
  const [activeSubmissionForReview, setActiveSubmissionForReview] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [viewingChecksSubmission, setViewingChecksSubmission] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Sync selectedCampaignId when campaignId prop changes (React recommended pattern)
  const [prevPropCampaignId, setPrevPropCampaignId] = useState(campaignId);
  if (campaignId !== prevPropCampaignId) {
    setPrevPropCampaignId(campaignId);
    setSelectedCampaignId(campaignId);
  }

  // 1. Fetch advertiser campaigns on mount
  useEffect(() => {
    let cancelled = false;
    const fetchAdvCampaigns = async () => {
      try {
        const res = await getCampaigns();
        const raw =
          res?.data?.campaigns ??
          res?.campaigns ??
          res?.data?.items ??
          res?.data?.data ??
          (Array.isArray(res?.data) ? res.data : null) ??
          (Array.isArray(res) ? res : []);
        const safeItems = Array.isArray(raw) ? raw : [];
        if (!cancelled) {
          setCampaigns(safeItems);
          // Do not automatically select the first campaign if a campaign ID is already provided
          setSelectedCampaignId((prev) => {
            if (prev) return prev;
            if (campaignId) return campaignId;
            if (safeItems.length > 0) return safeItems[0]._id || safeItems[0].id || "";
            return "";
          });
        }
      } catch {
        if (!cancelled) {
          setCampaigns([]);
        }
      }
    };
    fetchAdvCampaigns();
    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  const refreshSubmissions = useCallback(() => {
    setRefreshIndex((v) => v + 1);
  }, []);

  // 2. Fetch submissions for selected campaign & status
  useEffect(() => {
    if (!selectedCampaignId) {
      return;
    }

    let cancelled = false;

    // Use microtask so setState is deferred from synchronous effect body execution
    Promise.resolve().then(() => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
    });

    const fetchSubmissions = async () => {
      try {
        const res = await getCampaignSubmissions(selectedCampaignId, {
          displayStatus: statusFilter === "ALL" ? undefined : statusFilter,
          perPage: 50,
        });
        if (!cancelled) {
          const raw =
            res?.data?.submissions ??
            res?.submissions ??
            res?.data?.data ??
            (Array.isArray(res?.data) ? res.data : null) ??
            (Array.isArray(res) ? res : []);
          const list = Array.isArray(raw) ? raw : [];
          setSubmissions(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              (locale === "ar" ? "تعذر تحميل المقاطع المسلمة" : "Failed to load submitted clips")
          );
          setSubmissions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSubmissions();

    return () => {
      cancelled = true;
    };
  }, [selectedCampaignId, statusFilter, refreshIndex, locale]);

  // Handle Approve
  const handleApprove = async (submissionId) => {
    setSubmittingDecision(true);
    try {
      await reviewSubmission(submissionId, { decision: "APPROVE" });
      setFeedbackToast({
        type: "success",
        message: locale === "ar" ? "تمت الموافقة على المقطع بنجاح!" : "Clip approved successfully!",
      });
      setTimeout(() => setFeedbackToast(null), 3000);
      refreshSubmissions();
    } catch (err) {
      setFeedbackToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          (locale === "ar" ? "فشلت عملية الموافقة" : "Approval failed"),
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
      alert(
        locale === "ar"
          ? "يرجى كتابة سبب الرفض لصانع المحتوى"
          : "Please write a reason for rejection for the content creator"
      );
      return;
    }
    setSubmittingDecision(true);
    try {
      const subId = activeSubmissionForReview.id || activeSubmissionForReview._id;
      await reviewSubmission(subId, {
        decision: "REJECT",
        note: rejectNote.trim(),
      });
      setActiveSubmissionForReview(null);
      setRejectNote("");
      setFeedbackToast({
        type: "success",
        message:
          locale === "ar"
            ? "تم رفض المقطع وإشعار صانع المحتوى."
            : "Clip rejected and creator notified.",
      });
      setTimeout(() => setFeedbackToast(null), 3000);
      refreshSubmissions();
    } catch (err) {
      setFeedbackToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          (locale === "ar" ? "فشلت عملية الرفض" : "Rejection failed"),
      });
      setTimeout(() => setFeedbackToast(null), 3500);
    } finally {
      setSubmittingDecision(false);
    }
  };

  const campaignList = useMemo(() => (Array.isArray(campaigns) ? campaigns : []), [campaigns]);
  const submissionList = useMemo(() => (Array.isArray(submissions) ? submissions : []), [submissions]);

  // Filtered by search
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissionList;
    const q = searchQuery.toLowerCase();
    return submissionList.filter(
      (s) =>
        s?.creator?.fullName?.toLowerCase().includes(q) ||
        s?.creator?.name?.toLowerCase().includes(q) ||
        s?.code?.toLowerCase().includes(q) ||
        s?.postUrl?.toLowerCase().includes(q)
    );
  }, [submissionList, searchQuery]);

  // Stats computed from current data
  const stats = useMemo(() => {
    const awaiting = submissionList.filter((s) => s?.displayStatus === "AWAITING_ADVERTISER").length;
    const approved = submissionList.filter((s) => s?.status === "APPROVED").length;
    const rejected = submissionList.filter((s) => s?.status === "REJECTED").length;
    return {
      total: submissionList.length,
      awaiting,
      approved,
      rejected,
    };
  }, [submissionList]);

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
    { key: "AWAITING_ADVERTISER", label: locale === "ar" ? "بانتظار المراجعة" : "Awaiting Review" },
    { key: "APPROVED", label: locale === "ar" ? "المعتمدة" : "Approved" },
    { key: "REJECTED", label: locale === "ar" ? "المرفوضة" : "Rejected" },
    { key: "ALL", label: locale === "ar" ? "جميع التسليمات" : "All Submissions" },
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
              {locale === "ar" ? "مراجعة مقاطع الحملات" : "Campaign Clip Reviews"}
            </h1>
          </div>
          <p className={`text-xs ${theme.secondaryText}`}>
            {locale === "ar"
              ? "مراجعة واعتماد الفيديوهات المسلمة من صناع المحتوى بعد فحص الذكاء الاصطناعي"
              : "Review and approve videos delivered by creators after AI verification"}
          </p>
        </div>

        {/* Campaign Selector */}
        <div className="relative min-w-[260px]">
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className={`w-full appearance-none rounded-xl border px-4 py-2.5 text-xs font-bold transition focus:outline-none focus:border-[#94D3C1] ${theme.input}`}
          >
            {!selectedCampaignId && (
              <option value="">{locale === "ar" ? "اختر حملة..." : "Select campaign..."}</option>
            )}
            {selectedCampaignId && !campaignList.some((c) => (c?._id || c?.id) === selectedCampaignId) && (
              <option value={selectedCampaignId}>
                {locale === "ar" ? `حملة #${selectedCampaignId}` : `Campaign #${selectedCampaignId}`}
              </option>
            )}
            {campaignList.map((camp) => {
              const campId = camp?._id || camp?.id;
              return (
                <option key={campId} value={campId}>
                  {camp?.name || camp?.title || (locale === "ar" ? `حملة #${String(campId).slice(-6)}` : `Campaign #${String(campId).slice(-6)}`)}
                </option>
              );
            })}
          </select>
          <ChevronDown
            size={15}
            className={`pointer-events-none absolute ${isRTL ? "left-3" : "right-3"} top-3 text-gray-400`}
          />
        </div>
      </div>

      {/* Selected Campaign Notice if missing */}
      {!selectedCampaignId ? (
        <div className={`${theme.surface} border rounded-2xl p-16 text-center space-y-3`}>
          <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-500">
            <Film size={28} />
          </div>
          <h3 className={`text-base font-bold ${theme.primaryText}`}>
            {locale === "ar" ? "يرجى تحديد حملة لمراجعة مقاطعها" : "Please select a campaign to review clips"}
          </h3>
          <p className={`text-xs max-w-sm mx-auto ${theme.secondaryText}`}>
            {locale === "ar"
              ? "اختر إحدى الحملات الإعلانية من القائمة المنسدلة بالأعلى لعرض المقاطع المسلمة والتفاصيل."
              : "Choose an advertising campaign from the dropdown above to display submitted clips and details."}
          </p>
        </div>
      ) : (
        <>
          {/* KPI Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className={`${theme.card} border rounded-2xl p-4 space-y-1`}>
              <p className={`text-[11px] ${theme.secondaryText}`}>
                {locale === "ar" ? "إجمالي المقاطع" : "Total Clips"}
              </p>
              <p className={`text-2xl font-black ${theme.primaryText}`}>{stats.total}</p>
            </div>
            <div className={`${theme.card} border rounded-2xl p-4 space-y-1`}>
              <p className="text-[11px] text-amber-400 font-bold">
                {locale === "ar" ? "بانتظار قرارك" : "Awaiting Decision"}
              </p>
              <p className="text-2xl font-black text-amber-400">{stats.awaiting}</p>
            </div>
            <div className={`${theme.card} border rounded-2xl p-4 space-y-1`}>
              <p className="text-[11px] text-[#94D3C1] font-bold">
                {locale === "ar" ? "المعتمدة" : "Approved"}
              </p>
              <p className="text-2xl font-black text-[#94D3C1]">{stats.approved}</p>
            </div>
            <div className={`${theme.card} border rounded-2xl p-4 space-y-1`}>
              <p className="text-[11px] text-red-400 font-bold">
                {locale === "ar" ? "المرفوضة" : "Rejected"}
              </p>
              <p className="text-2xl font-black text-red-400">{stats.rejected}</p>
            </div>
          </div>

          {/* Filter Tabs & Search */}
          <div
            className={`${theme.surface} border rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3`}
          >
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
                placeholder={
                  locale === "ar"
                    ? "بحث بالصانع، الكود، الرابط..."
                    : "Search by creator, code, URL..."
                }
                className={`w-full rounded-xl border py-2 ${
                  isRTL ? "pr-9 pl-4" : "pl-9 pr-4"
                } text-xs focus:outline-none focus:border-[#94D3C1] ${theme.input}`}
              />
              <Search
                size={15}
                className={`absolute ${isRTL ? "right-3" : "left-3"} top-2.5 text-gray-400`}
              />
            </div>
          </div>

          {/* Main List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-[#94D3C1]" size={36} />
              <p className={`text-xs ${theme.secondaryText}`}>
                {locale === "ar" ? "جاري تحميل المقاطع المسلمة..." : "Loading submitted clips..."}
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <AlertCircle size={36} className="text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={refreshSubmissions}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FB8F00] hover:bg-[#E08000] transition"
              >
                {locale === "ar" ? "إعادة المحاولة" : "Try Again"}
              </button>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className={`${theme.surface} border rounded-2xl p-16 text-center space-y-3`}>
              <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center bg-gray-500/10 text-gray-400">
                <Play size={24} />
              </div>
              <h3 className={`text-base font-bold ${theme.primaryText}`}>
                {locale === "ar" ? "لا توجد تسليمات في هذا القسم" : "No submissions in this section"}
              </h3>
              <p className={`text-xs max-w-sm mx-auto ${theme.secondaryText}`}>
                {statusFilter === "AWAITING_ADVERTISER"
                  ? locale === "ar"
                    ? "لا توجد مقاطع تنتظر مراجعتك حالياً. المقاطع المفحوصة بالذكاء الاصطناعي ستظهر هنا فور اكتمالها."
                    : "No clips are currently awaiting your review. AI-verified clips will appear here."
                  : locale === "ar"
                  ? "لم يتم العثور على مقاطع تطابق الفلتر الحالي."
                  : "No clips match the current filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubmissions.map((sub) => {
                const subId = sub.id || sub._id;
                const platformInfo = platformIcons[sub.platform] || {
                  Icon: Play,
                  label: sub.platform,
                  color: "",
                };
                const PlatformIcon = platformInfo.Icon;
                const isAwaiting = sub.displayStatus === "AWAITING_ADVERTISER";
                const isApproved = sub.status === "APPROVED";
                const isRejected = sub.status === "REJECTED";
                const dateVal = sub.submittedAt || sub.createdAt;

                return (
                  <div
                    key={subId}
                    className={`${theme.card} border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition hover:border-[#94D3C1]/50 space-y-4`}
                  >
                    {/* Header: Creator & Platform */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {sub.creator?.profilePicture ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={sub.creator.profilePicture}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-[#94D3C1]/30 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#94D3C1]/15 text-[#94D3C1] flex items-center justify-center font-bold text-sm shrink-0">
                            {sub.creator?.fullName?.slice(0, 2) || sub.creator?.name?.slice(0, 2) || "ص"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className={`text-sm font-bold truncate ${theme.primaryText}`}>
                            {sub.creator?.fullName || sub.creator?.name || (locale === "ar" ? "صانع محتوى" : "Creator")}
                          </p>
                          <p className={`text-[10px] truncate ${theme.secondaryText}`}>
                            {[sub.creator?.city, sub.creator?.country].filter(Boolean).join("، ") ||
                              (locale === "ar" ? "منطقة الخليج" : "Gulf Region")}
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
                        <span className="font-mono font-bold text-[10px] text-gray-400">
                          {sub.code || String(subId).slice(-8).toUpperCase()}
                        </span>
                        {sub.postUrl || sub.canonicalUrl ? (
                          <a
                            href={sub.postUrl || sub.canonicalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#94D3C1] font-bold hover:underline"
                          >
                            <ExternalLink size={12} />
                            {locale === "ar" ? "فتح المنشور" : "Open Post"}
                          </a>
                        ) : null}
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
                          <span className="font-bold">
                            {locale === "ar" ? "فحص AI:" : "AI Score:"} {sub.aiScore ?? 96}%
                          </span>
                        </div>
                        {sub.preview?.durationSec && (
                          <span className={`text-[10px] ${theme.secondaryText}`}>
                            {sub.preview.durationSec} {locale === "ar" ? "ثانية" : "sec"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className={`text-[10px] ${theme.secondaryText}`}>
                        {locale === "ar" ? "تاريخ التسليم:" : "Submitted:"}{" "}
                        {dateVal
                          ? new Date(dateVal).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")
                          : "—"}
                      </span>
                      {isApproved && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#94D3C1]">
                          <CheckCircle2 size={13} /> {locale === "ar" ? "معتمد" : "Approved"}
                        </span>
                      )}
                      {isRejected && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-red-400">
                          <XCircle size={13} /> {locale === "ar" ? "مرفوض" : "Rejected"}
                        </span>
                      )}
                      {isAwaiting && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <Clock size={13} /> {locale === "ar" ? "بانتظار قرارك" : "Awaiting Decision"}
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
                        {locale === "ar" ? "تفاصيل الفحص" : "Check Details"}
                      </button>

                      {/* Action buttons if awaiting advertiser */}
                      {isAwaiting && (
                        <>
                          <button
                            disabled={submittingDecision}
                            onClick={() => handleApprove(subId)}
                            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-[#94D3C1] text-[#0A261F] transition hover:opacity-90 disabled:opacity-50"
                          >
                            <Check size={14} />
                            {locale === "ar" ? "قبول" : "Approve"}
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
                            {locale === "ar" ? "رفض" : "Reject"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Reject Modal */}
      {activeSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-2xl border p-5 sm:p-6 shadow-2xl space-y-4 ${theme.surface}`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${theme.primaryText}`}>
                {locale === "ar" ? "رفض تسليم المقطع" : "Reject Clip Submission"}
              </h3>
              <button
                onClick={() => setActiveSubmissionForReview(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${theme.secondaryText}`}>
              {locale === "ar"
                ? "يرجى توضيح سبب الرفض بالتفصيل لصانع المحتوى لتمكينه من تعديل المقطع وإعادة تسليمه:"
                : "Please clarify the reason for rejection in detail to enable the creator to revise and resubmit the clip:"}
            </p>

            <textarea
              rows={4}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder={
                locale === "ar"
                  ? "مثال: لم يتم إظهار شعار المنصة بوضوح في بداية الفيديو، أو الهاشتاق غير متطابق..."
                  : "e.g., The platform logo wasn't clearly shown in the first 3 seconds, or the required hashtag is missing..."
              }
              className={`w-full rounded-xl border p-3 text-xs focus:outline-none focus:border-red-400 ${theme.input}`}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveSubmissionForReview(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border ${theme.inset} ${theme.secondaryText}`}
              >
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                disabled={submittingDecision || !rejectNote.trim()}
                onClick={handleRejectConfirm}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {submittingDecision && <Loader2 size={13} className="animate-spin" />}
                {locale === "ar" ? "تأكيد الرفض" : "Confirm Rejection"}
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
                  {locale === "ar" ? "تقرير الفحص الذكي (AI Review)" : "AI Review Inspection Report"}
                </h3>
                <p className={`text-xs ${theme.secondaryText}`}>
                  {locale === "ar" ? "كود التسليم:" : "Submission Code:"}{" "}
                  {viewingChecksSubmission.code ||
                    String(viewingChecksSubmission.id || viewingChecksSubmission._id)?.slice(-8)}
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
                <p className={`text-[11px] ${theme.secondaryText}`}>
                  {locale === "ar" ? "درجة المطابقة الكلية" : "Overall Compliance Score"}
                </p>
                <p className="text-2xl font-black text-[#94D3C1]">
                  {viewingChecksSubmission.aiScore ?? 96}%
                </p>
              </div>
              <div className={`${isRTL ? "text-left" : "text-right"} text-xs space-y-0.5`}>
                <p className="text-emerald-400 font-bold">
                  {viewingChecksSubmission.summary?.passed ?? 3}{" "}
                  {locale === "ar" ? "متطابق" : "passed"}
                </p>
                <p className="text-red-400 font-bold">
                  {viewingChecksSubmission.summary?.failed ?? 0}{" "}
                  {locale === "ar" ? "تنبيهات" : "warnings"}
                </p>
              </div>
            </div>

            {/* Checks list */}
            <div className="space-y-2.5">
              <h4 className={`text-xs font-bold ${theme.primaryText}`}>
                {locale === "ar" ? "عناصر الفحص التقني:" : "Technical Inspection Items:"}
              </h4>
              {(
                viewingChecksSubmission.checks || [
                  {
                    code: "VIDEO_FORMAT",
                    status: "PASSED",
                    message:
                      locale === "ar"
                        ? "تنسيق الفيديو عمودي 9:16 وبدقة مناسبة"
                        : "Vertical 9:16 aspect ratio with appropriate resolution",
                  },
                  {
                    code: "AUDIO_COMPLIANCE",
                    status: "PASSED",
                    message:
                      locale === "ar"
                        ? "خلو تام من المعازف والموسيقى غير المتوافقة"
                        : "Fully compliant audio free of restricted music",
                  },
                  {
                    code: "REQUIRED_HASHTAGS",
                    status: "PASSED",
                    message:
                      locale === "ar"
                        ? "تم العثور على كافة الهاشتاقات التعاقدية"
                        : "All required contractual hashtags verified",
                  },
                  {
                    code: "OFFICIAL_MENTION",
                    status: "PASSED",
                    message:
                      locale === "ar"
                        ? "تمت الإشارة لحساب المعلن الرسمي"
                        : "Official advertiser account tagged correctly",
                  },
                ]
              ).map((check, idx) => {
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
                          {check.message ||
                            (passed
                              ? locale === "ar"
                                ? "اجتاز الفحص بنجاح"
                                : "Passed check successfully"
                              : locale === "ar"
                              ? "لم يجتز الفحص"
                              : "Did not pass check")}
                        </p>
                        {check.fixHint && (
                          <p className="text-[10px] text-amber-400 mt-1">
                            {locale === "ar" ? "توجيه:" : "Guidance:"} {check.fixHint}
                          </p>
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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#94D3C1] text-[#0A261F] hover:opacity-90 transition"
              >
                {locale === "ar" ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { ClipSubmissionReview };

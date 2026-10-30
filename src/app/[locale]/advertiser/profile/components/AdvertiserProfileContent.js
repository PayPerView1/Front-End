"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import PageLoader from "@/components/PageLoader";
import { getProfile, updateProfile } from "@/services/profile";
import { getCampaigns, getCampaignStatistics } from "@/services/campaign";
import { getSavedUser, getToken, saveAuthData } from "@/lib/axiosInstance";
import {
    FiEdit2, FiCopy, FiShare2, FiSettings,
    FiTarget, FiMapPin, FiCalendar, FiGlobe, FiPlus,
} from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineBarChart, MdVerified } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

/* ── helpers ─────────────────────────────────────────── */
function getUserName(user, fallback) {
    return (
        user?.companyName ||
        user?.fullName ||
        user?.name ||
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        user?.username ||
        fallback
    );
}

function getProfileImageUrl(pic) {
    if (!pic) return null;
    if (pic.startsWith("http")) return pic;
    const base = process.env.NEXT_PUBLIC_API_URL || "https://platform.apps.taqat.academy";
    return `${base.replace(/\/$/, "")}/${pic.replace(/^\//, "")}`;
}

function formatDate(value, locale, options) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat(locale, options).format(date);
}

const STATUS_LABELS = {
    ACTIVE: "active",
    COMPLETED: "completed",
    PENDING_REVIEW: "pendingReview",
    CANCELLED: "cancelled",
    DRAFT: "draft",
    REJECTED: "rejected",
    ARCHIVED: "archived",
};

function getStatusStyle(status, isDark) {
    const key = String(status || "").toUpperCase();

    const styles = {
        ACTIVE: isDark
            ? "bg-[#94D3C1]/15 text-[#94D3C1] border border-[#94D3C1]/30"
            : "bg-[#AFEFDD]/40 text-[#176B56] border border-[#287B67]/30",
        PENDING_REVIEW: isDark
            ? "bg-[#FB6103]/15 text-[#FFA600] border border-[#FFA600]/30"
            : "bg-[#FFA600]/15 text-[#FB6103] border border-[#FB6103]/30",
        COMPLETED: isDark
            ? "bg-[#94D3C1]/10 text-[#94D3C1] border border-[#94D3C1]/20"
            : "bg-[#94D3C1]/15 text-[#287B67] border border-[#94D3C1]/30",
        CANCELLED: "bg-red-500/15 text-red-400 border border-red-500/30",
        REJECTED: "bg-red-500/15 text-red-400 border border-red-500/30",
        DRAFT: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        ARCHIVED: "bg-[#89938F]/15 text-[#89938F] border border-[#89938F]/30",
    };

    return {
        known: Boolean(STATUS_LABELS[key]),
        labelKey: STATUS_LABELS[key],
        className: styles[key] || "bg-[#89938F]/15 text-[#89938F] border border-[#89938F]/30",
    };
}

/* ════════════════════════════════════════════════════ */
export default function AdvertiserProfileContent() {
    const { isDark } = useTheme();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("advertiserProfile");
    const isRTL = locale === "ar";

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("campaigns");
    const [campaigns, setCampaigns] = useState([]);
    const [apiStats, setApiStats] = useState({
        totalCampaigns: null,
        activeCampaigns: null,
        completedCampaigns: null,
        totalBudgetSpent: null,
    });
    const [coverMenuOpen, setCoverMenuOpen] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileUploading, setProfileUploading] = useState(false);
    const [profileUploadError, setProfileUploadError] = useState("");
    const [campaignFilter, setCampaignFilter] = useState("all");

    const coverInputRef = useRef(null);
    const profileInputRef = useRef(null);

    const tk = {
        bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F5F5F5]",
        cardBg: isDark ? "bg-[#191C1D]" : "bg-white",
        cardBorder: isDark ? "border-[#2D3132]" : "border-[#E5E5E5]",
        coverBg: isDark ? "bg-[#191C1D]" : "bg-[#EAEAEA]", // رمادي فاتح موحد وصافي
        avatarBg: isDark ? "bg-[#2D3132]" : "bg-[#D0D0D0]",
        avatarBorder: isDark ? "border-[#0D0D0D]" : "border-white",
        text: isDark ? "text-white" : "text-black",
        subText: isDark ? "text-[#9A9A9A]" : "text-[#666]",
        menuBg: isDark ? "bg-[#181818]" : "bg-white",
        menuBorder: isDark ? "border-white/10" : "border-[#E5E5E5]",
        menuText: isDark ? "text-[#E1E3E3]" : "text-[#333]",
        tabBorder: isDark ? "border-[#2D3132]" : "border-[#E5E5E5]",
        innerBg: isDark ? "bg-[#141618]" : "bg-[#F8F8F8]",
        trackBg: isDark ? "bg-[#2D3132]" : "bg-[#E5E5E5]",
    };

    useEffect(() => {
        function handleOutside(e) {
            if (!e.target.closest("[data-covermenu]")) setCoverMenuOpen(false);
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    useEffect(() => {
        async function load() {
            const saved = getSavedUser();
            if (saved) setUser(saved);

            try {
                const [profileResult, campaignsResult, statsResult] = await Promise.allSettled([
                    getProfile(),
                    getCampaigns({ page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" }),
                    getCampaignStatistics(),
                ]);

                if (profileResult.status === "fulfilled") {
                    const response = profileResult.value;
                    const profileUser = response?.user || response?.data?.user || response?.data || response;
                    if (profileUser && typeof profileUser === "object") {
                        setUser(profileUser);
                        if (getToken()) saveAuthData(getToken(), { ...saved, ...profileUser });
                    }
                } else {
                    console.error("Failed to load advertiser profile:", profileResult.reason);
                }

                if (campaignsResult.status === "fulfilled") {
                    const response = campaignsResult.value;
                    const items = response?.data?.campaigns || response?.campaigns || [];
                    setCampaigns(Array.isArray(items) ? items : []);
                } else {
                    console.error("Failed to load advertiser campaigns:", campaignsResult.reason);
                }

                if (statsResult.status === "fulfilled") {
                    const response = statsResult.value;
                    const stats = response?.data?.statistics || response?.statistics;
                    if (stats && typeof stats === "object") setApiStats((current) => ({ ...current, ...stats }));
                } else {
                    console.error("Failed to load advertiser campaign statistics:", statsResult.reason);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <PageLoader />;

    const tabs = [
        { key: "campaigns", label: t("tabs.campaigns") },
        { key: "stats", label: t("tabs.stats") },
    ];

    const campaignFilters = [
        { key: "all", label: t("filters.all"), status: null },
        { key: "active", label: t("filters.active"), status: "ACTIVE" },
        { key: "completed", label: t("filters.completed"), status: "COMPLETED" },
        { key: "pendingReview", label: t("filters.pendingReview"), status: "PENDING_REVIEW" },
    ];
    const selectedFilter = campaignFilters.find((filter) => filter.key === campaignFilter);
    const filteredCampaigns = selectedFilter?.status
        ? campaigns.filter((campaign) => campaign.status === selectedFilter.status)
        : campaigns;
    const summaryStats = [
        { label: t("stats.totalCampaigns"), value: Number(apiStats.totalCampaigns ?? campaigns.length).toLocaleString(locale), icon: FiTarget, color: "#FFA600" },
        { label: t("stats.activeCampaigns"), value: Number(apiStats.activeCampaigns ?? campaigns.filter((campaign) => campaign.status === "ACTIVE").length).toLocaleString(locale), icon: FiTarget, color: "#94D3C1" },
        { label: t("stats.completedCampaigns"), value: Number(apiStats.completedCampaigns ?? campaigns.filter((campaign) => campaign.status === "COMPLETED").length).toLocaleString(locale), icon: FiTarget, color: "#287B67" },
        { label: t("stats.totalSpend"), value: `$${Number(apiStats.totalBudgetSpent ?? 0).toLocaleString(locale)}`, icon: FiTarget, color: "#FFA600" },
    ];

    async function handleProfileImageChange(event) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
        setProfileUploadError("");
        setProfileUploading(true);

        try {
            const formData = new FormData();
            formData.append("profilePicture", file);
            let response = await updateProfile(formData);
            let updatedUser = response?.user || response?.data?.user || response?.data;

            if (!updatedUser?.profilePicture) {
                response = await getProfile();
                updatedUser = response?.user || response?.data?.user || response?.data || response;
            }

            if (updatedUser && typeof updatedUser === "object") {
                const saved = getSavedUser() || {};
                const nextUser = { ...saved, ...updatedUser };
                setUser(nextUser);
                if (getToken()) saveAuthData(getToken(), nextUser);
            }
        } catch (error) {
            setProfileUploadError(error.message || t("uploadError"));
        } finally {
            URL.revokeObjectURL(previewUrl);
            setProfileImage(null);
            setProfileUploading(false);
        }
    }

    return (
        <div className={`flex flex-col flex-1 min-h-screen ${tk.bg} font-tajawal`} dir={isRTL ? "rtl" : "ltr"}>

            {/* ══ الغلاف ═════════════════════════════════ */}
            <div className="relative mx-2 sm:mx-4 mt-3 sm:mt-4">
                <div
                    className={`relative h-[190px] sm:h-[230px] w-full rounded-2xl overflow-hidden cursor-pointer ${tk.coverBg}`}
                    onClick={() => coverInputRef.current?.click()}
                >
                    {coverImage && (
                        <img src={coverImage} alt={t("coverImage")} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                    )}

                    {/* ثلاث نقاط */}
                    <div className="absolute top-3 right-3 z-20" data-covermenu="true">
                        <button
                            type="button"
                            data-covermenu="true"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCoverMenuOpen(p => !p); }}
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center border-none cursor-pointer transition-colors"
                        >
                            <BsThreeDots size={15} color="#FFF" />
                        </button>
                        {coverMenuOpen && (
                            <div
                                data-covermenu="true"
                                className={`absolute top-10 right-0 z-30 w-44 p-1 rounded-xl shadow-2xl border ${tk.menuBg} ${tk.menuBorder}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {[
                                    { label: t("shareProfile"), icon: FiShare2, action: async () => { try { navigator.share && await navigator.share({ title: t("shareTitle"), url: window.location.href }); } catch { } setCoverMenuOpen(false); } },
                                    { label: t("copyLink"), icon: FiCopy, action: async () => { try { await navigator.clipboard.writeText(window.location.href); } catch { } setCoverMenuOpen(false); } },
                                    { label: t("editProfile"), icon: FiEdit2, action: () => { router.push(`/${locale}/advertiser/edit-profile`); setCoverMenuOpen(false); } },
                                ].map(({ label, icon: Icon, action }) => (
                                    <button
                                        key={label}
                                        type="button"
                                        data-covermenu="true"
                                        onClick={action}
                                        className="group w-full flex items-center gap-3 px-3 py-2.5 text-[11px] rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#AFEFDD]/10 transition-all"
                                    >
                                        <Icon size={13} className={`${tk.subText} group-hover:text-[#AFEFDD] transition-colors`} />
                                        <span className={tk.menuText}>{label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* بادج موثّق */}
                    {(user?.isVerified || user?.verified) && (
                        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                            <MdVerified size={13} className="text-[#AFEFDD]" />
                            <span className="text-white text-[10px] font-semibold">{t("verifiedBadge")}</span>
                        </div>
                    )}

                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverImage(URL.createObjectURL(f)); }} />
                </div>

                {/* أفاتار الشركة */}
                <div
                    className={`absolute -bottom-8 z-20 cursor-pointer ${isRTL ? "right-5" : "left-5"}`}
                    onClick={(e) => { e.stopPropagation(); profileInputRef.current?.click(); }}
                >
                    <div className={`relative w-[68px] h-[68px] rounded-2xl border-[3px] flex items-center justify-center overflow-hidden ${tk.avatarBg} ${tk.avatarBorder}`}>
                        {profileImage ? (
                            <img src={profileImage} alt={t("companyLogo")} className="w-full h-full object-cover" />
                        ) : user?.profilePicture && user.profilePicture !== "default-avatar.png" ? (
                            <img src={getProfileImageUrl(user.profilePicture)} alt={t("companyLogo")} className="w-full h-full object-cover" />
                        ) : (
                            <HiOutlineBuildingOffice2 size={30} className={isDark ? "text-[#AFEFDD]" : "text-[#287B67]"} />
                        )}
                        <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <FiEdit2 size={14} className="text-white" />
                        </div>
                    </div>
                    <input ref={profileInputRef} type="file" accept="image/*" className="hidden"
                        onChange={handleProfileImageChange}
                    />
                    {profileUploading && <span className={`absolute top-[74px] whitespace-nowrap text-[10px] ${tk.subText}`}>{t("uploading")}</span>}
                    {profileUploadError && <span className="absolute top-[74px] max-w-40 text-[10px] text-red-400">{profileUploadError}</span>}
                </div>
            </div>

            {/* ══ معلومات المعلن ══════════════════════════ */}
            <div className={`relative z-10 px-5 sm:px-6 pt-12 pb-4 ${isRTL ? "text-right" : "text-left"}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* يسار: الاسم والمعلومات */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className={`text-xl sm:text-2xl font-bold ${tk.text}`}>{getUserName(user, t("companyName"))}</h1>
                            {(user?.isVerified || user?.verified) && <MdVerified size={18} className={isDark ? "text-[#AFEFDD]" : "text-[#287B67]"} />}
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isDark ? "bg-[#AFEFDD]/15 text-[#AFEFDD] border border-[#AFEFDD]/30" : "bg-[#AFEFDD]/50 text-[#287B67] border border-[#287B67]/30"}`}>
                                {t("advertiser")}
                            </span>
                        </div>
                        <p className={`text-sm ${tk.subText}`}>{user?.email}</p>
                        {user?.bio && <p className={`max-w-2xl text-xs leading-6 ${tk.subText}`}>{user.bio}</p>}
                        <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${tk.subText}`}>
                            {(user?.city || user?.country) && (
                                <span className="flex items-center gap-1.5">
                                    <FiMapPin size={11} />
                                    {[user?.city, user?.country].filter(Boolean).join(t("listSeparator"))}
                                </span>
                            )}
                            {(user?.createdAt || user?.created_at) && (
                                <span className="flex items-center gap-1.5">
                                    <FiCalendar size={11} />
                                    {formatDate(user.createdAt || user.created_at, locale, { year: "numeric", month: "long" })}
                                </span>
                            )}
                            {(user?.website || user?.websiteUrl) && (
                                <span className="flex items-center gap-1.5">
                                    <FiGlobe size={11} />
                                    {user.website || user.websiteUrl}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* يمين: الأزرار */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        <button
                            onClick={() => router.push(`/${locale}/advertiser/edit-profile`)}
                            className={`flex items-center gap-1.5 h-9 px-4 rounded-xl border text-xs font-bold cursor-pointer transition-all  ${tk.cardBg} ${tk.cardBorder} ${tk.text}`}
                        >
                            <FiEdit2 size={13} />
                            {t("editProfile")}
                        </button>
                        <button
                            onClick={() => router.push(`/${locale}/advertiser/create-campaign`)}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-white text-xs font-bold cursor-pointer border-none transition-all"
                            style={{ background: "linear-gradient(to left, #FF4B04, #FFA600)" }}
                        >
                            <FiPlus size={14} />
                            {t("createCampaign")}
                        </button>
                        <button
                            onClick={() => router.push(`/${locale}/advertiser/dashboard`)}
                            className={`h-9 w-9 flex items-center justify-center rounded-xl border cursor-pointer transition-all  ${tk.cardBg} ${tk.cardBorder}`}
                            title={t("dashboard")}
                        >
                            <FiSettings size={15} className={tk.subText} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ══ إحصائيات سريعة ══════════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 sm:px-6 pb-5">
                {summaryStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={`rounded-2xl p-4 flex flex-col gap-2 border ${tk.cardBg} ${tk.cardBorder}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] leading-tight ${tk.subText}`}>{stat.label}</span>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${stat.color}20` }}>
                                    <Icon size={14} style={{ color: stat.color }} />
                                </div>
                            </div>
                            <p className={`text-xl font-bold ${tk.text}`}>{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* ══ التابز ══════════════════════════════════ */}
            <div className={`flex w-full border-b px-5 sm:px-6 ${tk.tabBorder}`}>
                {tabs.map((tab) => (
                    <div key={tab.key} className="flex flex-col">
                        <button
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-3 text-sm font-bold transition-all cursor-pointer bg-transparent border-none whitespace-nowrap
                                ${activeTab === tab.key ? tk.text : tk.subText}`}
                        >
                            {tab.label}
                        </button>
                        {activeTab === tab.key && (
                            <div className="h-[2px] rounded-full w-3/4 mx-auto" style={{ background: "linear-gradient(90deg, #FFA600 0%, #94D3C1 100%)" }} />
                        )}
                    </div>
                ))}
            </div>

            {/* ══ محتوى التابز ════════════════════════════ */}
            <div className="flex-1 px-5 sm:px-6 py-5">

                {/* ═══ الحملات ═══════════════════════════ */}
                {activeTab === "campaigns" && (
                    <div className="space-y-4">
                        {/* فلاتر */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {campaignFilters.map((filter) => (
                                <button
                                    key={filter.key}
                                    type="button"
                                    onClick={() => setCampaignFilter(filter.key)}
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer 
                                        ${campaignFilter === filter.key
                                            ? "bg-[linear-gradient(90deg,#FD9501_0%,#FD5903_100%)] text-white"
                                            : `${tk.cardBg} ${tk.cardBorder} ${tk.subText} `
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                            <span className={`mr-auto text-xs ${tk.subText}`}>{t("campaignCount", { count: filteredCampaigns.length })}</span>
                        </div>

                        {/* شبكة الحملات */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredCampaigns.map((campaign) => {
                                const si = getStatusStyle(campaign.status, isDark);
                                const campaignId = campaign._id || campaign.id;
                                return (
                                    <div
                                        key={campaignId || campaign.name}
                                        onClick={() => campaignId && router.push(`/${locale}/advertiser/campaigns/${campaignId}`)}
                                        className={`rounded-2xl border p-4 cursor-pointer transition-all
                                            ${tk.cardBg} ${tk.cardBorder}`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#FFA600]/15">
                                                    <FiTarget size={16} className="text-[#FFA600]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className={`text-xs font-bold leading-tight truncate ${tk.text}`}>{campaign.name || t("campaignWithoutName")}</h3>
                                                    <p className={`text-[10px] mt-0.5 ${tk.subText}`}>
                                                        {typeof campaign.category === "string" ? campaign.category : campaign.category?.name || campaign.contentType || t("campaignCategory")}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${si.className}`}>
                                                {si.known ? t(`statuses.${si.labelKey}`) : campaign.status || "—"}
                                            </span>
                                        </div>

                                        {(campaign.createdAt || campaign.startDate) && (
                                            <p className={`text-[10px] ${tk.subText}`}>
                                                {formatDate(campaign.createdAt || campaign.startDate, locale, { dateStyle: "medium" })}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {filteredCampaigns.length === 0 && (
                            <div className={`rounded-2xl border p-8 text-center text-sm ${tk.cardBg} ${tk.cardBorder} ${tk.subText}`}>
                                {t("noCampaigns")}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ الإحصائيات ═══════════════════════ */}
                {activeTab === "stats" && (
                    <div className="space-y-4">
                        <div className={`rounded-2xl border p-5 ${tk.cardBg} ${tk.cardBorder}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-[#FFA600]/15 flex items-center justify-center">
                                    <MdOutlineBarChart size={18} className="text-[#FFA600]" />
                                </div>
                                <div>
                                    <h3 className={`text-sm font-bold ${tk.text}`}>{t("campaignStatistics")}</h3>
                                    <p className={`text-[11px] ${tk.subText}`}>{t("accountData")}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {summaryStats.map((stat) => (
                                    <div key={stat.label} className={`rounded-xl p-3 ${tk.innerBg}`}>
                                        <p className={`text-[10px] mb-1 ${tk.subText}`}>{stat.label}</p>
                                        <p className={`text-lg font-bold ${tk.text}`}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`rounded-2xl border p-5 ${tk.cardBg} ${tk.cardBorder}`}>
                            <h3 className={`text-sm font-bold mb-4 ${tk.text}`}>{t("recentCampaigns")}</h3>
                            <div className="space-y-3">
                                {campaigns.slice(0, 5).map((campaign) => {
                                const status = getStatusStyle(campaign.status, isDark);
                                return (
                                    <div
                                        key={campaign._id || campaign.id || campaign.name}
                                        className={`flex items-center justify-between gap-3 p-3 rounded-xl ${tk.innerBg}`}
                                    >
                                        <span className={`text-xs font-bold truncate ${tk.text}`}>
                                            {campaign.name || t("campaignWithoutName")}
                                        </span>

                                        <span
                                            className={`text-[9px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${status.className}`}
                                        >
                                            {status.known ? t(`statuses.${status.labelKey}`) : campaign.status || "—"}
                                        </span>
                                    </div>
                                );
                                })}
                                {campaigns.length === 0 && (
                                    <p className={`text-xs text-center py-4 ${tk.subText}`}>{t("noCampaigns")}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
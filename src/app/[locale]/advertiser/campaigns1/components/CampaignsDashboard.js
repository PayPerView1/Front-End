"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Discovery, TickSquare } from "react-iconly";
import {
  MdOutlineAnalytics,
  MdOutlineCalendarToday,
  MdOutlineFilterList,
  MdSearch,
  MdOutlineMoreVert,
  MdRocketLaunch,
} from "react-icons/md";
import {
  MdOutlineVideoLibrary,
  MdOutlinePeopleAlt,
  MdOutlineSlideshow,
  MdOutlineAudiotrack,
  MdOutlineBadge,
  MdOutlineGridView,
} from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { HiOutlineLink } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { BsWallet2 } from "react-icons/bs";
import { useLocale, useTranslations } from "next-intl";
import { getCampaigns, getCampaignStatistics } from "@/services/campaign";
import EmptyState from "./EmptyState";

const contentTypeConfig = {
  CLIPPING: {
    icon: MdOutlineVideoLibrary,
    color: "#94D3C1",
    bg: "#94D3C120",
    border: "#94D3C133",
  },
  UGC: {
    icon: MdOutlinePeopleAlt,
    color: "#E9C349",
    bg: "#E9C34920",
    border: "#E9C34933",
  },
  SLIDESHOW: {
    icon: MdOutlineSlideshow,
    color: "#A78BFA",
    bg: "#A78BFA20",
    border: "#A78BFA33",
  },
  AUDIO: {
    icon: MdOutlineAudiotrack,
    color: "#F97316",
    bg: "#F9731620",
    border: "#F9731633",
  },
  LOGO: {
    icon: MdOutlineBadge,
    color: "#38BDF8",
    bg: "#38BDF820",
    border: "#38BDF833",
  },
  MIXED: {
    icon: MdOutlineGridView,
    color: "#94D3C1",
    bg: "#94D3C120",
    border: "#94D3C133",
  },
};

const MOCK_CAMPAIGNS = [
  {
    _id: "1",
    name: "حملة الربع الرابع - ألفا",
    contentType: "CLIPPING",
    status: "ACTIVE",
    totalBudget: 100000,
    createdAt: "2024-10-01T00:00:00.000Z",
  },
  {
    _id: "2",
    name: "حملة الصيف 2024",
    contentType: "UGC",
    status: "DRAFT",
    totalBudget: 50000,
    createdAt: "2024-06-01T00:00:00.000Z",
  },
  {
    _id: "3",
    name: "حملة رمضان",
    contentType: "MIXED",
    status: "COMPLETED",
    totalBudget: 75000,
    createdAt: "2024-03-01T00:00:00.000Z",
  },
];

export default function CampaignsDashboard() {
  const router = useRouter();
  const { isDark } = useTheme();
  const locale = useLocale();
  const tc = useTranslations("campaigns");
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [campaigns, setCampaigns] = useState([]);
  const [apiStats, setApiStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    totalBudgetSpent: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCampaigns: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ← ALL مش "الكل"
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const t = {
    bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F0F2F5]",
    cardBg: isDark ? "bg-[#111111]" : "bg-white",
    cardBorder: isDark ? "border-[#1E2D3D]" : "border-[#E2E8F0]",
    text: isDark ? "text-white" : "text-[#0F172A]",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#64748B]",
    tableBorder: isDark ? "border-[#1E2D3D]" : "border-[#E2E8F0]",
    rowHover: isDark ? "hover:bg-white/[0.02]" : "hover:bg-[#F8FAFC]",
    theadBg: isDark ? "bg-[#1A1A1A]" : "bg-[#F1F5F9]",
  };
  const statusStyles = {
    ACTIVE: {
      bg: isDark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.12)",
      text: isDark ? "rgba(34,197,94,0.7)" : "#15803D",
      dot: isDark ? "rgba(34,197,94,0.7)" : "#16A34A",
    },
    DRAFT: {
      bg: isDark ? "rgba(96,165,250,0.08)" : "rgba(96,165,250,0.12)",
      text: isDark ? "rgba(96,165,250,0.7)" : "#1D4ED8",
      dot: isDark ? "rgba(96,165,250,0.7)" : "#2563EB",
    },
    COMPLETED: {
      bg: isDark ? "rgba(156,163,175,0.08)" : "rgba(100,116,139,0.12)",
      text: isDark ? "rgba(156,163,175,0.7)" : "#475569",
      dot: isDark ? "rgba(156,163,175,0.7)" : "#64748B",
    },
    PENDING_REVIEW: {
      bg: isDark ? "rgba(234,179,8,0.08)" : "rgba(234,179,8,0.12)",
      text: isDark ? "rgba(234,179,8,0.7)" : "#A16207",
      dot: isDark ? "rgba(234,179,8,0.7)" : "#CA8A04",
    },
    REJECTED: {
      bg: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.12)",
      text: isDark ? "rgba(239,68,68,0.7)" : "#B91C1C",
      dot: isDark ? "rgba(239,68,68,0.7)" : "#DC2626",
    },
    MANUAL_REVIEW: {
      bg: isDark ? "rgba(249,115,22,0.08)" : "rgba(249,115,22,0.12)",
      text: isDark ? "rgba(249,115,22,0.7)" : "#C2410C",
      dot: isDark ? "rgba(249,115,22,0.7)" : "#EA580C",
    },
    CANCELLED: {
      bg: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.12)",
      text: isDark ? "rgba(239,68,68,0.7)" : "#B91C1C",
      dot: isDark ? "rgba(239,68,68,0.7)" : "#DC2626",
    },
    ARCHIVED: {
      bg: isDark ? "rgba(156,163,175,0.08)" : "rgba(100,116,139,0.12)",
      text: isDark ? "rgba(156,163,175,0.7)" : "#475569",
      dot: isDark ? "rgba(156,163,175,0.7)" : "#64748B",
    },
    EXPIRED: {
      bg: isDark ? "rgba(156,163,175,0.08)" : "rgba(100,116,139,0.12)",
      text: isDark ? "rgba(156,163,175,0.7)" : "#475569",
      dot: isDark ? "rgba(156,163,175,0.7)" : "#64748B",
    },
  };
  const statusLabel = {
    ACTIVE: tc("statusActive"),
    DRAFT: tc("statusDraft"),
    COMPLETED: tc("statusCompleted"),
    PENDING_REVIEW: tc("statusPendingReview"),
    REJECTED: tc("statusRejected"),
    MANUAL_REVIEW: tc("statusManualReview"),
    CANCELLED: tc("statusCancelled"),
    ARCHIVED: tc("statusArchived"),
    EXPIRED: tc("statusExpired"),
  };

  // ← Stats من الـ API
  const statsData = [
    {
      labelKey: "totalCampaigns",
      value: apiStats.totalCampaigns?.toLocaleString() || "0",
      change: "+12%",
      positive: true,
      icon: MdOutlineAnalytics,
      color: "#94D3C1",
    },
    {
      labelKey: "activeCampaigns",
      value: apiStats.activeCampaigns?.toLocaleString() || "0",
      change: "+5%",
      positive: true,
      icon: Discovery,
      color: "#E9C349",
    },
    {
      labelKey: "completed",
      value: apiStats.completedCampaigns?.toLocaleString() || "0",
      change: tc("stable"),
      positive: null,
      icon: TickSquare,
      color: "#AACEC6",
    },
    {
      labelKey: "totalBudget",
      value: `$${Number(apiStats.totalBudgetSpent || 0).toLocaleString()}`,
      change: "+2.4%",
      positive: true,
      icon: BsWallet2,
      color: "#94D3C1",
    },
  ];

  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "desc",
          ...(statusFilter !== "ALL" && { status: statusFilter }),
          ...(search.trim() && { search: search.trim() }),
        };

        const [campaignsRes, statsRes] = await Promise.all([
          getCampaigns(params),
          getCampaignStatistics(),
        ]);

        // campaigns
        if (campaignsRes?.data?.campaigns) {
          setCampaigns(campaignsRes.data.campaigns);
          setPagination(
            campaignsRes.data.pagination || {
              currentPage: 1,
              totalPages: 1,
              totalCampaigns: 0,
            },
          );
        }

        // stats cards
        if (statsRes?.data?.statistics) {
          setApiStats(statsRes.data.statistics);
        }
      } catch (error) {
        console.error("❌ Error:", error.message);

        // ← فلتري الـ mock بنفس الفلاتر
        const filteredMock = MOCK_CAMPAIGNS.filter(
          (c) => statusFilter === "ALL" || c.status === statusFilter,
        ).filter(
          (c) =>
            !search.trim() ||
            c.name.toLowerCase().includes(search.toLowerCase()),
        );

        setCampaigns(filteredMock);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCampaigns: filteredMock.length,
        });
      } finally {
        setLoading(false);
      }
    }

    // debounce 400ms للبحث بس
    const delay = setTimeout(loadCampaigns, search ? 400 : 0);
    return () => clearTimeout(delay);
  }, [currentPage, statusFilter, search]);

  if (loading)
    return (
      <div className={`flex items-center justify-center min-h-screen ${t.bg}`}>
        <div className="w-8 h-8 border-2 border-[#94D3C1] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!loading && campaigns.length === 0 && statusFilter === "ALL" && !search) {
    return (
      <div dir={dir} className={`flex flex-col flex-1 min-h-screen ${t.bg}`}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={`flex flex-col flex-1 min-h-screen p-4 sm:p-6 gap-6 ${t.bg}`}
    >
      {/* الهيدر + الإحصائيات */}
      <div className="flex flex-col gap-5">
        <div className={locale === "ar" ? "text-right" : "text-left"}>
          <h1 className={`text-2xl sm:text-3xl font-bold ${t.text}`}>
            {tc("title")}
          </h1>
          <p className={`text-sm mt-1 ${t.subText}`}>{tc("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 flex flex-col gap-3 ${t.cardBg} ${t.cardBorder}`}
                style={{
                  backgroundImage: `radial-gradient(circle at 85% 20%, ${stat.color}15 0%, transparent 35%)`,
                  boxShadow: isDark
                    ? "none"
                    : "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stat.color + "20" }}
                  >
                    <Icon size={18} color={stat.color} />
                  </div>
                  {stat.positive !== null ? (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isDark
                          ? `${stat.color}20`
                          : `${stat.color}30`,
                        color: isDark
                          ? "#AACEC6"
                          : stat.positive
                            ? "#16a34a"
                            : "#6b7280",
                      }}
                    >
                      {stat.change}
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-[#BFC9C4]">
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className={locale === "ar" ? "text-right" : "text-left"}>
                  <p className={`text-xs ${t.subText}`}>{tc(stat.labelKey)}</p>
                  <p className={`text-2xl font-bold mt-0.5 ${t.text}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* الفلاتر والبحث */}
      <div className="py-3 flex items-center justify-between gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border
  ${
    isDark
      ? "bg-[#1A1A1A] border-[#2D2D2D]"
      : "bg-white border-[#E2E8F0] shadow-sm"
  }
  hover:border-[#94D3C1] transition-all`}
        >
          <MdSearch size={16} color="#9A9A9A" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={tc("search")}
            className={`bg-transparent outline-none text-sm ${locale === "ar" ? "text-right" : "text-left"} w-48 ${t.text} placeholder-[#9A9A9A]`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* فلتر الحالة */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdown(!statusDropdown)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer hover:border-[#94D3C1]
                ${
                  statusFilter !== "ALL"
                    ? "border-[#94D3C1] bg-[#94D3C1]/10 text-[#94D3C1]"
                    : isDark
                      ? "bg-[#1A1A1A] border-[#2D2D2D] text-[#E1E3E4]"
                      : "bg-white border-[#E2E8F0] text-[#374151] shadow-sm"
                }`}
            >
              <MdOutlineFilterList
                size={14}
                color={statusFilter !== "ALL" ? "#94D3C1" : "#E1E3E4"}
              />
              {/* ← عرض الـ label الصح */}
              {tc("statusLabel")}:{" "}
              {statusFilter === "ALL" ? tc("all") : statusLabel[statusFilter]}
            </button>

            {statusDropdown && (
              <div
                className={`absolute top-9 ${locale === "ar" ? "left-0" : "right-0"} z-20 w-40 rounded-xl border shadow-2xl p-1 ${t.cardBg} ${t.cardBorder}`}
              >
                {[
                  "ALL",
                  "ACTIVE",
                  "DRAFT",
                  "COMPLETED",
                  "PENDING_REVIEW",
                  "REJECTED",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setCurrentPage(1);
                      setStatusDropdown(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-xs rounded-lg bg-transparent border-none cursor-pointer
                      ${locale === "ar" ? "text-right" : "text-left"} transition-all
                      ${statusFilter === s ? "text-[#94D3C1]" : `${t.subText} hover:bg-[#94D3C1]/10`}`}
                  >
                    {s === "ALL" ? tc("all") : statusLabel[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer hover:border-[#94D3C1]
            ${isDark ? "bg-[#1A1A1A] border-[#2D2D2D] text-[#E1E3E4]" : "bg-white border-[#E2E8F0] text-[#374151] shadow-sm"}`}
          >
            <MdOutlineCalendarToday size={14} />
            {tc("dateFilter")}
          </button>
        </div>
      </div>

      {/* الجدول */}
      <div
        className={`rounded-xl border overflow-hidden ${t.cardBg} ${t.cardBorder}`}
        style={{
          boxShadow: isDark
            ? "none"
            : "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${t.tableBorder} ${t.theadBg}`}>
                {[
                  tc("campaignName"),
                  tc("status"),
                  tc("budget"),
                  tc("startDate"),
                  tc("action"),
                ].map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-xs font-medium ${locale === "ar" ? "text-right" : "text-left"}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MdRocketLaunch size={32} color="#F97316" />
                      <p className={`text-sm font-bold ${t.text}`}>
                        {tc("noCampaigns")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                  const status = statusStyles[campaign.status];
                  const config = contentTypeConfig[campaign.contentType] || {
                    icon: MdRocketLaunch,
                    color: "#94D3C1",
                    bg: "#94D3C120",
                    border: "#94D3C133",
                  };
                  const Icon = config.icon;
                  return (
                    <tr
                      key={campaign._id}
                      className={`border-b ${t.tableBorder} ${t.rowHover} transition-colors`}
                    >
                      {/* اسم الحملة */}
                      <td className="px-4 py-3.5">
                        <div
                          className={`flex items-center gap-3 ${locale === "ar" ?  "flex-row-reverse justify-end" : "flex-row-reverse justify-end"}`}
                        >
                          <div>
                            <p
                              className={`text-sm font-bold ${locale === "ar" ? "text-right" : "text-left"} ${t.text}`}
                            >
                              {campaign.name}
                            </p>
                            <p
                              className={`text-xs ${locale === "ar" ? "text-right" : "text-left"} ${t.subText}`}
                            >
                              {campaign.contentType || "-"}
                            </p>
                          </div>
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: config.bg,
                              border: `1px solid ${config.border}`,
                            }}
                          >
                            <Icon size={20} color={config.color} />
                          </div>
                        </div>
                      </td>

                      {/* الحالة */}
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor:
                              status?.bg || "rgba(156,163,175,0.08)",
                            color: status?.text || "#9A9A9A",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: status?.dot || "#9A9A9A",
                            }}
                          />
                          {statusLabel[campaign.status] || campaign.status}
                        </span>
                      </td>

                      {/* الميزانية */}
                      <td
                        className={`px-4 py-3.5 text-sm font-bold ${locale === "ar" ? "text-right" : "text-left"} ${t.text}`}
                      >
                        ${Number(campaign.totalBudget || 0).toLocaleString()}
                      </td>

                      {/* تاريخ البدء */}
                      <td
                        className={`px-4 py-3.5 text-sm ${locale === "ar" ? "text-right" : "text-left"}`}
                        style={{ color: isDark ? "#BFC9C4" : "#475569" }}
                      >
                        {campaign.createdAt
                          ? new Date(campaign.createdAt).toLocaleDateString(
                              locale === "ar" ? "ar-SA" : "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              },
                            )
                          : "-"}
                      </td>

                      {/* إجراء */}
                      <td className="px-4 py-3.5">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === campaign._id ? null : campaign._id,
                              )
                            }
                            className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all hover:bg-[#94D3C1]/10"
                          >
                            <MdOutlineMoreVert size={18} color="#9A9A9A" />
                          </button>

                          {openMenu === campaign._id && (
                            <div
                              className={`absolute ${locale === "ar" ? "left-0" : "right-0"} top-9 z-20 w-40 rounded-xl shadow-2xl p-1 border
                              ${isDark ? "bg-[#1A1A1A] border-white/20" : "bg-white border-black/10"}`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null);
                                  router.push(
                                    `/${locale}/advertiser/campaigns/${campaign._id}`,
                                  );
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-transparent border-none cursor-pointer transition-all hover:bg-[#94D3C1]/10 ${t.text}`}
                              >
                                <FiExternalLink size={14} color="#9A9A9A" />
                                <span>{tc("view")}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null);
                                  router.push(
                                    `/${locale}/advertiser/campaigns/${campaign._id}/stats`,
                                  );
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-transparent border-none cursor-pointer transition-all hover:bg-[#94D3C1]/10 ${t.text}`}
                              >
                                <HiOutlineLink size={14} color="#9A9A9A" />
                                <span>{tc("campaignStats")}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-t ${t.tableBorder}`}
        >
          <p className={`text-xs ${t.subText}`}>
            {tc("showing", {
              from: Math.min(
                (currentPage - 1) * 20 + 1,
                pagination.totalCampaigns,
              ),
              to: Math.min(currentPage * 20, pagination.totalCampaigns),
              total: pagination.totalCampaigns,
            })}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              onMouseEnter={() => setHoveredBtn("prev")}
              onMouseLeave={() => setHoveredBtn(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border disabled:opacity-40"
              style={{
                backgroundColor: "#111415",
                borderColor: hoveredBtn === "prev" ? "#94D3C1" : "#3F4945",
                color: "#E1E3E4",
              }}
            >
              {tc("prev")}
            </button>

            <button
              disabled={currentPage >= pagination.totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              onMouseEnter={() => setHoveredBtn("next")}
              onMouseLeave={() => setHoveredBtn(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border disabled:opacity-40"
              style={{
                backgroundColor: "#111415",
                borderColor: hoveredBtn === "next" ? "#94D3C1" : "#3F4945",
                color: "#E1E3E4",
              }}
            >
              {tc("next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

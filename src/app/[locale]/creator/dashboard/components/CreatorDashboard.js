"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getCreatorRecommendations, getMyCampaignApplications } from "@/services/campaign";
import { getProfile } from "@/services/profile";
import { getWalletBalance } from "@/services/wallet";
import {
  FiCompass,
  FiUser,
  FiSliders,
  FiRefreshCw,
  FiChevronLeft,
  FiClock,
  FiEye,
  FiHeart,
  FiInfo,
  FiUpload,
  FiZap,
  FiShare2,
  FiTrendingUp,
  FiArrowLeft,
  FiFileText,
  FiBell,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdOutlineAccountBalanceWallet, MdOutlineCampaign } from "react-icons/md";

const CONTENT_TYPE_KEYS = {
  CLIPPING: "contentTypes.clipping",
  UGC: "contentTypes.ugc",
  SLIDESHOW: "contentTypes.slideshow",
  AUDIO: "contentTypes.audio",
  LOGO: "contentTypes.logo",
  MIXED: "contentTypes.mixed",
};

const COUNTRY_KEYS = {
  SAU: "countries.saudiArabia",
  ARE: "countries.uae",
  KWT: "countries.kuwait",
  QAT: "countries.qatar",
  BHR: "countries.bahrain",
  OMN: "countries.oman",
  EGY: "countries.egypt",
  JOR: "countries.jordan",
  IRQ: "countries.iraq",
  LBN: "countries.lebanon",
  MAR: "countries.morocco",
  TUR: "countries.turkey",
  USA: "countries.unitedStates",
  GBR: "countries.unitedKingdom",
};

function getRecommendationReason(reason, t) {
  if (reason?.code === "COUNTRY_MATCH") {
    const countryKey = COUNTRY_KEYS[reason.value];
    return t("reasons.countryMatch", {
      country: countryKey ? t(countryKey) : reason.value,
    });
  }
  if (reason?.code === "CONTENT_TYPE_MATCH") {
    const contentTypeKey = CONTENT_TYPE_KEYS[reason.value];
    return t("reasons.contentTypeMatch", {
      contentType: contentTypeKey ? t(contentTypeKey) : reason.value,
    });
  }
  if (reason?.code === "CPM_MATCH") return t("reasons.cpmMatch");
  if (reason?.code === "PREVIOUS_PARTICIPATION") {
    const contentTypeKey = CONTENT_TYPE_KEYS[reason.value];
    return reason.value
      ? t("reasons.previousParticipationWithType", {
        contentType: contentTypeKey ? t(contentTypeKey) : reason.value,
      })
      : t("reasons.previousParticipation");
  }
  return reason?.value || t("reasons.recommended");
}

function getResponseData(response, fallbackMessage) {
  if (response?.success === false) {
    throw new Error(response.message || fallbackMessage);
  }
  return response?.data ?? response;
}

function getApplicationsResponse(response) {
  const items = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.data?.data)
      ? response.data.data
      : Array.isArray(response)
        ? response
        : [];
  const pagination = response?.pagination || response?.data?.pagination || {};
  const total =
    pagination.total !== null &&
      pagination.total !== undefined &&
      Number.isFinite(Number(pagination.total))
      ? Number(pagination.total)
      : null;
  return { items, total };
}

function getProfileUser(response, fallbackMessage) {
  const data = getResponseData(response, fallbackMessage);
  return data?.user ?? data?.profile ?? data;
}

function getApplicationName(application, t) {
  return application?.campaign?.name || application?.campaignName || t("campaignWithoutName");
}

function getApplicationStatusLabel(status, t) {
  return {
    PENDING: t("statuses.pending"),
    ACCEPTED: t("statuses.accepted"),
    REJECTED: t("statuses.rejected"),
    WITHDRAWN: t("statuses.withdrawn"),
  }[String(status || "").toUpperCase()] || status || t("statuses.unknown");
}

function formatCurrency(amount, currency, locale) {
  if (amount === null || amount === undefined || !Number.isFinite(Number(amount))) return "—";
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : locale, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${Number(amount).toLocaleString()} ${currency || "USD"}`;
  }
}

function formatCompact(value, locale) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "—";
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value));
}

function formatDate(value, locale) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : locale, {
    dateStyle: "medium",
  }).format(date);
}

function getProfileImageUrl(profilePicture) {
  if (
    typeof profilePicture !== "string" ||
    !profilePicture ||
    profilePicture === "default-avatar.png"
  ) {
    return null;
  }
  if (profilePicture.startsWith("http")) return profilePicture;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://payperview-platform.onrender.com";
  return `${baseUrl.replace(/\/$/, "")}/${profilePicture.replace(/^\//, "")}`;
}

export default function CreatorDashboard({ locale: localeOverride }) {
  const currentLocale = useLocale();
  const t = useTranslations("creatorDashboard");
  const locale = localeOverride || currentLocale;
  const L = (key) => t(`overview.${key}`);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [hasPreferences, setHasPreferences] = useState(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [recommendationError, setRecommendationError] = useState("");
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [walletError, setWalletError] = useState("");
  const [applications, setApplications] = useState([]);
  const [applicationsError, setApplicationsError] = useState("");
  const [totalApplications, setTotalApplications] = useState(null);
  const [pendingApplications, setPendingApplications] = useState(null);
  const [acceptedApplications, setAcceptedApplications] = useState(null);
  const [isLoadingHomeData, setIsLoadingHomeData] = useState(true);
  const [instantAlerts, setInstantAlerts] = useState(true);

  const loadRecommendations = useCallback(async () => {
    setRecommendationError("");
    setIsLoadingRecommendations(true);
    try {
      const response = await getCreatorRecommendations(10);
      setRecommendations(Array.isArray(response?.data) ? response.data : []);

      setHasPreferences(response?.meta?.hasPreferences ?? null);
    } catch (error) {
      setRecommendations([]);
      setRecommendationError(error?.message || t("errors.recommendationsLoadFailed"));
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [t]);

  const loadHomeData = useCallback(async () => {
    setIsLoadingHomeData(true);
    setApplicationsError("");
    setWalletError("");

    const [profileResult, walletResult, applicationsResult, pendingResult, acceptedResult] =
      await Promise.allSettled([
        getProfile(),
        getWalletBalance(),
        getMyCampaignApplications({ page: 1, perPage: 5 }),
        getMyCampaignApplications({ status: "PENDING", page: 1, perPage: 1 }),
        getMyCampaignApplications({ status: "ACCEPTED", page: 1, perPage: 1 }),
      ]);

    if (profileResult.status === "fulfilled") {
      try {
        setProfile(getProfileUser(profileResult.value, t("errors.fetchData")));
      } catch {
        setProfile(null);
      }
    } else {
      setProfile(null);
    }

    if (walletResult.status === "fulfilled") {
      try {
        const walletData = getResponseData(walletResult.value, t("errors.fetchData"));
        const hasBalance =
          walletData?.balance !== null &&
          walletData?.balance !== undefined &&
          Number.isFinite(Number(walletData.balance));
        setWallet(hasBalance ? walletData : null);
        if (!hasBalance) {
          setWalletError(t("errors.invalidWalletBalance"));
        }
      } catch (error) {
        setWallet(null);
        setWalletError(error?.message || t("errors.walletLoadFailed"));
      }
    } else {
      setWallet(null);
      setWalletError(walletResult.reason?.message || t("errors.walletLoadFailed"));
    }

    if (applicationsResult.status === "fulfilled") {
      const result = getApplicationsResponse(applicationsResult.value);
      setApplications(result.items);
      setTotalApplications(result.total);
    } else {
      setApplications([]);
      setTotalApplications(null);
      setApplicationsError(applicationsResult.reason?.message || t("errors.applicationsLoadFailed"));
    }

    const getCount = (result) => {
      if (result.status !== "fulfilled") return null;
      return getApplicationsResponse(result.value).total;
    };
    setPendingApplications(getCount(pendingResult));
    setAcceptedApplications(getCount(acceptedResult));
    setIsLoadingHomeData(false);
  }, [t]);

  useEffect(() => {
    let isCurrent = true;
    Promise.resolve().then(() => {
      if (isCurrent) loadRecommendations();
    });
    return () => {
      isCurrent = false;
    };
  }, [loadRecommendations]);

  useEffect(() => {
    let isCurrent = true;
    Promise.resolve().then(() => {
      if (isCurrent) loadHomeData();
    });
    return () => {
      isCurrent = false;
    };
  }, [loadHomeData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadRecommendations();
    } finally {
      setIsRefreshing(false);
    }
  };

  // ─── قيم مشتقة من الـ API ─────────────────────────────────────
  const displayName =
    profile?.fullName ||
    profile?.displayName ||
    profile?.name ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    t("creator");
  const displayInitial = Array.from(displayName.trim())[0] || "؟";
  const profileImageUrl = getProfileImageUrl(profile?.profilePicture);

  // أسماء حقول الأرباح والمشاهدات تخمين: عدّليها حسب رد الـ API
  const totalEarnings = wallet?.totalEarnings ?? wallet?.lifetimeEarnings ?? wallet?.balance;
  const withdrawableAmount = wallet?.availableBalance ?? wallet?.withdrawable ?? wallet?.balance;
  const viewsRaw = profile?.stats?.totalViews ?? profile?.totalViews ?? profile?.approvedViews;

  const earningsText = formatCurrency(totalEarnings, wallet?.currency, locale);
  const withdrawableText = formatCurrency(withdrawableAmount, wallet?.currency, locale);
  const viewsText = formatCompact(viewsRaw, locale);

  const acceptedPercent =
    totalApplications > 0 && acceptedApplications != null
      ? Math.min(100, Math.round((acceptedApplications / totalApplications) * 100))
      : 0;

  const loadingDash = (value) => (isLoadingHomeData ? "…" : value ?? "—");

  // ─── ثوابت التصميم ───────────────────────────────────────────
  const gradient = { background: "linear-gradient(90deg, #FC9102 0%, #FB6103 100%)" };
  const card =
    "rounded-2xl border border-[#E2E8E5] bg-white shadow-sm dark:border-[#1E2425] dark:bg-[#121617] dark:shadow-none";
  const inner =
    "rounded-xl border border-[#E5EBE8] bg-[#F7FAF9] dark:border-[#252c2d] dark:bg-[#181d1e]";
  const darkBtn =
    "flex items-center justify-center gap-2 rounded-xl border border-[#D6DDD9] bg-[#EBF0EE] text-[#374441] hover:bg-[#E2E9E6] hover:text-[#111817] dark:border-[#252c2d] dark:bg-[#181d1e] dark:text-gray-200 dark:hover:text-white transition";
  const iconBox =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E5F5F0] text-[#1D7762] dark:bg-[#212f2c] dark:text-[#94D3C1]";

  const flowChips = [
    { value: pendingApplications, label: L("chipPending"), dot: "bg-[#E9C349]" },
    { value: acceptedApplications, label: L("chipActive"), dot: "bg-[#1D7762] dark:bg-[#94D3C1]" },
    { value: totalApplications, label: L("chipTotal"), dot: "bg-[#1D7762] dark:bg-[#94D3C1]" },
  ];

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="creator-dashboard-page creator-responsive-page min-h-screen w-full bg-[#F4F7F6] p-4 font-tajawal text-gray-900 antialiased selection:bg-[#94D3C1] selection:text-[#101513] transition-colors duration-200 dark:bg-[#050505] dark:text-white md:p-6 lg:p-7"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {/* ─── بطاقة الترحيب ─────────────────────────── */}
        <div
          className={`creator-dashboard-welcome-card ${card} mb-5 flex flex-col gap-5 p-4 md:px-7 md:py-5 lg:flex-row lg:items-center lg:justify-between`}
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 text-2xl font-bold text-gray-700 dark:border-white/10 dark:bg-[#252A2B] dark:text-white">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt={displayName}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  displayInitial
                )}
              </div>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#121617] dark:bg-[#94D3C1]"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold tracking-wide text-gray-900 dark:text-white md:text-2xl">
                  {t("welcome", { name: displayName })}
                </h1>
                <HiOutlineSparkles className="shrink-0 text-[#E9C349]" size={20} />
              </div>
              <p className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] leading-5 text-emerald-800 dark:border-[#94D3C1]/25 dark:bg-[#94D3C1]/10 dark:text-[#94D3C1]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-[#94D3C1]" />
                {isLoadingHomeData ? t("loadingAccount") : t("activitySummary")}
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 lg:w-auto">
            <Link
              href={`/${locale}/creator/discover`}
              style={gradient}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(252,145,2,0.25)] md:text-sm lg:flex-none"
            >
              <FiCompass size={17} />
              <span>{t("exploreCampaigns")}</span>
            </Link>
            <Link
              href={`/${locale}/creator/profile`}
              className={`${darkBtn} flex-1 px-4 py-2.5 text-xs font-medium md:text-sm lg:flex-none`}
            >
              <FiUser size={16} className="text-[#1D7762] dark:text-[#94D3C1]" />
              <span>{t("nav.profile")}</span>
            </Link>
          </div>
        </div>

        {/* ─── بطاقات الإحصائيات ─────────────────────── */}
        <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* إجمالي الأرباح */}
          <article className={`${card} flex flex-col p-5`}>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#62706D] dark:text-[#9CA3AF]">{L("earningsTotal")}</span>
              <span className={iconBox}>
                <MdOutlineAccountBalanceWallet size={19} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-gray-900 dark:text-white">{loadingDash(earningsText)}</p>
            {walletError && <p className="mt-2 text-xs text-[#A87800] dark:text-[#E9C349]">{walletError}</p>}
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#E2E8E5] dark:border-[#1E2425] pt-3">
              <div>
                <span className="block text-[10px] text-[#62706D] dark:text-[#9CA3AF]">{L("withdrawable")}</span>
                <span className="text-sm font-bold text-[#A87800] dark:text-[#E9C349]">
                  {loadingDash(withdrawableText)}
                </span>
              </div>
              <Link
                href={`/${locale}/wallet`}
                className="flex items-center gap-1.5 rounded-lg border border-[#E9C349]/50 bg-[#E9C349]/15 px-3 py-1.5 text-[11px] font-bold text-[#946200] transition dark:border-[#E9C349]/30 dark:bg-[#E9C349]/10 dark:text-[#E9C349]"
              >
                <FiZap size={12} />
                {L("instantWithdraw")}
              </Link>
            </div>
          </article>

          {/* الحملات النشطة والمكتملة */}
          <article className={`${card} flex flex-col p-5`}>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#62706D] dark:text-[#9CA3AF]">{L("activeCompleted")}</span>
              <span className={iconBox}>
                <MdOutlineCampaign size={20} />
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-3xl font-black text-gray-900 dark:text-white">{loadingDash(acceptedApplications)}</p>
              <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">{L("activeNow")}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-[#62706D] dark:text-[#9CA3AF]">
              <span>
                {loadingDash(totalApplications)} {L("appliedSuffix")}
              </span>
              <span>
                {acceptedPercent}% {L("acceptRate")}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E5EBE8] dark:bg-[#1c2223]">
              <div
                className="h-full rounded-full bg-[#1D7762] dark:bg-[#94D3C1] transition-all"
                style={{ width: `${acceptedPercent}%` }}
              />
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-[#E2E8E5] dark:border-[#1E2425] pt-3 text-[10px] text-[#62706D] dark:text-[#9CA3AF]">
              <span>{L("avgDelivery")}</span>
              <span className="font-bold text-gray-900 dark:text-white">—</span>
            </div>
          </article>

          {/* المشاهدات المعتمدة */}
          <article className={`${card} flex flex-col p-5`}>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#62706D] dark:text-[#9CA3AF]">{L("approvedViews")}</span>
              <span className={iconBox}>
                <FiEye size={18} />
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-3xl font-black text-gray-900 dark:text-white">{loadingDash(viewsText)}</p>
              <svg viewBox="0 0 90 36" className="h-9 w-24 text-[#1D7762] dark:text-[#94D3C1]" fill="none" aria-hidden="true">
                <path
                  d="M2 32 C 14 30, 18 20, 28 23 S 44 29, 54 18 S 72 6, 88 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="mt-1 text-[11px] text-[#62706D] dark:text-[#9CA3AF]">{L("verifiedClips")}</p>

            <div className="mt-auto flex items-center justify-end gap-1.5 border-t border-[#E2E8E5] dark:border-[#1E2425] pt-3 text-[10px] font-semibold text-[#1D7762] dark:text-[#94D3C1]">
              <FiTrendingUp size={12} />
              <span>{L("approvedViews")}</span>
            </div>
          </article>
        </section>

        {/* ─── شريط مسار وسير العمل ──────────────────── */}
        <section
          className={`${card} mb-7 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between`}
        >
          <div className="flex items-center gap-3">
            <span className={iconBox}>
              <FiShare2 size={17} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">{L("workflow")}</h2>
              <p className="text-[11px] text-[#62706D] dark:text-[#9CA3AF]">{L("workflowSub")}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {flowChips.map((chip) => (
              <div
                key={chip.label}
                className="flex items-center gap-2 rounded-full border border-[#DCE4E1] bg-[#F7FAF9] px-3.5 py-2 dark:border-[#252c2d] dark:bg-[#181d1e]"
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${chip.dot}`} />
                <div className="leading-tight">
                  <span className="block text-[11px] font-bold text-gray-900 dark:text-white">{loadingDash(chip.value)}</span>
                  <span className="text-[10px] text-[#62706D] dark:text-[#9CA3AF]">{chip.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── الحملات المقترحة من API ───────────────── */}
        <section className="mb-7">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">{t("recommendations.title")}</h2>
              <p className="mt-1 text-xs text-[#62706D] dark:text-[#9CA3AF] md:text-sm">
                {t("recommendations.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isLoadingRecommendations || isRefreshing}
                className={`${darkBtn} px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <FiRefreshCw
                  size={13}
                  className={isRefreshing ? "animate-spin text-[#1D7762] dark:text-[#94D3C1]" : "text-[#1D7762] dark:text-[#94D3C1]"}
                />
                <span>{t("recommendations.refresh")}</span>
              </button>
              <Link
                href={`/${locale}/creator/discover`}
                className={`${darkBtn} px-3.5 py-2 text-xs`}
              >
                <span>
                  {L("viewAll")}
                  {recommendations.length > 0 ? ` (${recommendations.length})` : ""}
                </span>
                <FiChevronLeft size={14} className="text-[#1D7762] dark:text-[#94D3C1]" />
              </Link>
            </div>
          </div>

          {isLoadingRecommendations ? (
            <div
              className={`${card} p-8 text-center text-sm text-[#62706D] dark:text-[#9CA3AF]`}
              aria-live="polite"
            >
              {t("recommendations.loading")}
            </div>
          ) : recommendationError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center dark:bg-[#121617]">
              <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">
                {recommendationError}
              </p>
              <button
                type="button"
                onClick={loadRecommendations}
                style={gradient}
                className="rounded-xl px-4 py-2 text-xs font-bold text-white"
              >
                {t("retry")}
              </button>
            </div>
          ) : recommendations.length === 0 ? (
            <div
              className={`relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#DCE4E1] bg-white px-5 py-12 text-center shadow-sm md:px-12 md:py-16 dark:border-[#1E2425] dark:bg-[#0E1314] dark:shadow-[0_10px_35px_rgba(0,0,0,0.5)]`}
            >
              {/* Radial gradient backdrop for glowing emerald ambience */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,211,193,0.18)_0%,rgba(240,247,244,0.6)_55%,#ffffff_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(20,55,45,0.4)_0%,rgba(14,19,20,0.85)_55%,#0E1314_100%)]"
              />

              <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Radar / Target Badge with Sparkle */}
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-50/80 shadow-[0_0_25px_rgba(20,184,166,0.15)] dark:border-[#1f4e42] dark:bg-[#122822] dark:shadow-[0_0_35px_rgba(20,184,166,0.2)]">
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        stroke="#1D7762"
                        className="dark:stroke-[#94D3C1]"
                        strokeWidth="1.8"
                        strokeOpacity="0.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="9"
                        stroke="#E9C349"
                        strokeWidth="2"
                        strokeOpacity="0.9"
                      />
                      <circle cx="18" cy="18" r="4" fill="#E9C349" />
                    </svg>
                    {/* Small sparkle badge at bottom-right */}
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#DCE4E1] bg-white text-[#1D7762] shadow-sm dark:border-[#252C2D] dark:bg-[#0E1314] dark:text-[#94D3C1]">
                      <HiOutlineSparkles size={13} />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 max-w-2xl text-xl font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  {t("recommendations.emptyTitle")}
                </h3>

                {/* Description */}
                <p className="mb-8 max-w-2xl text-xs leading-relaxed text-[#62706D] md:text-sm dark:text-[#9CA3AF]">
                  {t("recommendations.emptyDescription")}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  <Link
                    href={`/${locale}/creator/discover`}
                    style={gradient}
                    className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold text-white shadow-[0_4px_20px_rgba(251,97,3,0.35)] transition active:scale-[0.98] md:text-sm"
                  >
                    <FiCompass size={17} />
                    <span>{t("recommendations.browseCampaigns")}</span>
                  </Link>

                  <Link
                    href={`/${locale}/creator/edit-profile/interests`}
                    className={`${darkBtn} px-5 py-3 text-xs font-medium transition md:text-sm`}
                  >
                    <FiSliders size={16} className="text-[#1D7762] dark:text-[#94D3C1]" />
                    <span>{t("recommendations.editPreferences")}</span>
                  </Link>
                </div>

                {/* Instant Notifications Toggle Bar */}
                <div className="mt-8 flex w-full max-w-xl items-center justify-between gap-3.5 rounded-2xl border border-[#DCE4E1] bg-[#F7FAF9] p-3.5 backdrop-blur-sm md:p-4 dark:border-[#1E2425] dark:bg-[#101415]/90">
                  {/* Bell icon and info text */}
                  <div className="flex items-center gap-3 text-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/40 bg-amber-50 text-[#946200] dark:border-[#273031] dark:bg-[#161B1C] dark:text-[#E9C349]">
                      <FiBell size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 md:text-sm dark:text-white">
                        {t("recommendations.instantAlertsTitle")}
                      </div>
                      <div className="mt-0.5 text-[10px] text-[#62706D] md:text-xs dark:text-[#9CA3AF]">
                        {t("recommendations.instantAlertsDesc")}
                      </div>
                    </div>
                  </div>

                  {/* Switch toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={instantAlerts}
                    aria-label={t("recommendations.instantAlertsTitle")}
                    onClick={() => setInstantAlerts((prev) => !prev)}
                    dir="ltr"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${instantAlerts ? "bg-[#10B981]" : "bg-gray-300 dark:bg-[#252C2D]"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${instantAlerts
                        ? locale === "ar"
                          ? "translate-x-0"
                          : "translate-x-5"
                        : locale === "ar"
                          ? "translate-x-5"
                          : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((camp) => {
                const countryNames = Array.isArray(camp.targetCountries)
                  ? camp.targetCountries
                    .map((code) => (COUNTRY_KEYS[code] ? t(COUNTRY_KEYS[code]) : code))
                    .join(t("listSeparator"))
                  : "";
                const matchReasons = Array.isArray(camp.reasons) ? camp.reasons : [];
                const reasonText = matchReasons
                  .map((reason) => getRecommendationReason(reason, t))
                  .join(" · ");
                const contentTypeLabel =
                  (CONTENT_TYPE_KEYS[camp.contentType] && t(CONTENT_TYPE_KEYS[camp.contentType])) ||
                  camp.contentType ||
                  t("contentTypes.mixed");
                const image = camp.coverImage || camp.thumbnail || camp.image || camp.imageUrl;
                const description = camp.description || camp.shortDescription || "";
                const availabilityText =
                  camp.availability === "AVAILABLE"
                    ? t("availability.available")
                    : camp.availability
                      ? t("availability.status", { status: camp.availability })
                      : "—";

                return (
                  <article
                    key={camp.id}
                    className={`${card} flex flex-col overflow-hidden transition`}
                  >
                    {/* صورة الحملة */}
                    <div className="relative h-36 w-full bg-gradient-to-br from-[#E2EFEA] to-[#F1F6F4] dark:from-[#1c2a27] dark:to-[#0b0e0f]">
                      {image && (
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      )}
                      <span className="absolute right-3 top-3 rounded-md border border-[#E9C349]/50 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#946200] shadow-sm dark:border-[#E9C349]/30 dark:bg-black/60 dark:text-[#E9C349]">
                        {contentTypeLabel}
                      </span>
                      <span
                        aria-label={camp.isFavorited ? t("favorited") : L("addFav")}
                        className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm dark:bg-black/50 ${camp.isFavorited ? "text-pink-600 dark:text-pink-300" : "text-gray-700 dark:text-white"
                          }`}
                      >
                        <FiHeart size={15} fill={camp.isFavorited ? "currentColor" : "none"} />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      {/* سبب الترشيح */}
                      {reasonText && (
                        <div className={`${inner} flex items-center justify-between gap-2 p-3`}>
                          <p className="text-[11px] leading-relaxed text-[#213832] dark:text-gray-300">{reasonText}</p>
                          <HiOutlineSparkles size={16} className="shrink-0 text-[#1D7762] dark:text-[#94D3C1]" />
                        </div>
                      )}

                      <div>
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] text-[#62706D] dark:text-[#9CA3AF]">
                            {camp.brand?.name || t("brand")}
                          </span>
                          {camp.isHalalVerified && (
                            <span className="rounded-full border border-emerald-600/30 bg-emerald-600/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:border-[#94D3C1]/25 dark:bg-[#94D3C1]/10 dark:text-[#94D3C1]">
                              {t("halalVerified")}
                            </span>
                          )}
                          {camp.matchScore != null && (
                            <span className="rounded-full border border-emerald-600/30 bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:border-[#94D3C1]/25 dark:bg-[#94D3C1]/10 dark:text-white">
                              {t("recommendations.matchScore")} {camp.matchScore}
                            </span>
                          )}
                        </div>
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 dark:text-white">
                          {camp.name || t("campaign")}
                        </h3>
                        {description && (
                          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-[#62706D] dark:text-[#9CA3AF]">
                            {description}
                          </p>
                        )}
                      </div>

                      {/* الأرقام */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-3 border-t border-[#E2E8E5] dark:border-[#1E2425] pt-3">
                        <div>
                          <span className="block text-[10px] text-[#62706D] dark:text-[#9CA3AF]">{L("budget")}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(camp.remainingBudget, "USD", locale)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#62706D] dark:text-[#9CA3AF]">{L("cpmReturn")}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(camp.cpm, "USD", locale)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#62706D] dark:text-[#9CA3AF]">
                            {t("campaignDetails.targetCountries")}
                          </span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {countryNames || t("campaignDetails.unspecified")}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#62706D] dark:text-[#9CA3AF]">{L("seats")}</span>
                          <span className="text-xs font-bold text-[#A87800] dark:text-[#E9C349]">
                            {availabilityText}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center gap-2">
                        <Link
                          href={`/${locale}/creator/discover/${camp.id}`}
                          style={gradient}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(252,145,2,0.25)]"
                        >
                          <FiArrowLeft size={14} />
                          {L("applyNow")}
                        </Link>
                        <Link
                          href={`/${locale}/creator/discover/${camp.id}`}
                          aria-label={L("campaignInfo")}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition dark:text-[#9CA3AF] dark:hover:text-white dark:hover:bg-transparent"
                        >
                          <FiInfo size={17} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── حملاتي النشطة (من طلبات الخادم) ───────── */}
        <section className={`${card} mb-4 p-5 md:p-6`}>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className={iconBox}>
                <FiClock size={18} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white md:text-base">{L("myCampaigns")}</h2>
                <p className="text-xs text-[#62706D] dark:text-[#9CA3AF]">{L("myCampaignsSub")}</p>
              </div>
            </div>
            <Link
              href={`/${locale}/creator/orders`}
              className="flex items-center gap-1 self-start text-xs font-semibold text-[#A87800] hover:underline sm:self-auto dark:text-[#E9C349]"
            >
              <span>{L("goOrders")}</span>
              <FiArrowLeft size={13} />
            </Link>
          </div>

          {isLoadingHomeData ? (
            <div className={`${inner} p-6 text-center text-sm text-[#62706D] dark:text-[#9CA3AF]`}>
              {t("recentApplications.loading")}
            </div>
          ) : applicationsError ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5 text-center">
              <p className="text-sm text-red-700 dark:text-red-300">{applicationsError}</p>
              <button
                type="button"
                onClick={loadHomeData}
                style={gradient}
                className="mt-3 rounded-lg px-4 py-2 text-xs font-bold text-white"
              >
                {t("retry")}
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className={`${inner} p-6 text-center`}>
              <p className="text-sm text-[#62706D] dark:text-[#9CA3AF]">{t("recentApplications.empty")}</p>
              <Link
                href={`/${locale}/creator/discover`}
                style={gradient}
                className="mt-3 inline-flex min-w-[140px] justify-center rounded-lg px-4 py-2 text-xs font-bold text-white"
              >
                {t("nav.discover")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((application) => {
                const campaign = application?.campaign || {};
                const campaignId = campaign.id || application?.campaignId;
                const status = String(application?.status || "").toUpperCase();
                const isAccepted = status === "ACCEPTED";

                const statusClass = isAccepted
                  ? "text-[#1D7762] dark:text-[#94D3C1]"
                  : status === "PENDING"
                    ? "text-[#A87800] dark:text-[#E9C349]"
                    : status === "REJECTED"
                      ? "text-red-600 dark:text-red-300"
                      : "text-[#62706D] dark:text-[#9CA3AF]";

                // حقول اختيارية: بتظهر فقط إذا رجّعها الـ API
                const progress = Number(application?.progress);
                const hasProgress = application?.progress != null && Number.isFinite(progress);
                const estimated =
                  application?.estimatedEarnings ?? application?.earnings ?? campaign?.estimatedEarnings;
                const barColor = isAccepted ? "bg-[#1D7762] dark:bg-[#94D3C1]" : "bg-[#E9C349]";

                return (
                  <article
                    key={application.id}
                    className={`${inner} flex flex-col gap-4 p-4 lg:flex-row lg:items-center`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E9C349]/40 bg-[#E9C349]/15 text-[#946200] dark:border-[#E9C349]/20 dark:bg-[#E9C349]/10 dark:text-[#E9C349]">
                        <FiFileText size={19} />
                      </span>
                      <div className="min-w-0">
                        {campaignId ? (
                          <Link
                            href={`/${locale}/creator/discover/${campaignId}`}
                            className="text-sm font-bold text-gray-900 hover:text-[#1D7762] transition-colors dark:text-white dark:hover:text-[#94D3C1]"
                          >
                            {getApplicationName(application, t)}
                          </Link>
                        ) : (
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{getApplicationName(application, t)}</h3>
                        )}
                        <p className="mt-1 text-[11px] text-[#62706D] dark:text-[#9CA3AF]">
                          {campaign?.brand?.name ? `${campaign.brand.name} · ` : ""}
                          {L("startedAt")} {formatDate(application?.appliedAt, locale)} ·{" "}
                          <span className={`font-semibold ${statusClass}`}>
                            {getApplicationStatusLabel(status, t)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {hasProgress && (
                      <div className="w-full lg:w-52">
                        <div className="mb-1.5 flex items-center justify-between text-[10px] text-[#62706D] dark:text-[#9CA3AF]">
                          <span>{L("progress")}</span>
                          <span className="font-bold text-gray-900 dark:text-white">{progress}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#E5EBE8] dark:bg-[#1c2223]">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-5 lg:justify-end">
                      {(estimated != null || campaign?.cpm != null) && (
                        <div>
                          <span className="block text-[10px] text-[#62706D] dark:text-[#9CA3AF]">
                            {estimated != null ? L("estEarnings") : L("cpmReturn")}
                          </span>
                          <span className="text-sm font-black text-gray-900 dark:text-white">
                            {formatCurrency(estimated ?? campaign?.cpm, "USD", locale)}
                          </span>
                        </div>
                      )}

                      {campaignId &&
                        (isAccepted ? (
                          <Link
                            href={`/${locale}/creator/start-project/${campaignId}`}
                            className="flex items-center gap-1.5 rounded-xl border border-emerald-600/40 bg-emerald-600/10 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-600/20 transition dark:border-[#94D3C1]/30 dark:bg-[#94D3C1]/10 dark:text-[#94D3C1]"
                          >
                            <FiUpload size={13} />
                            {L("uploadClip")}
                          </Link>
                        ) : (
                          <Link
                            href={`/${locale}/creator/discover/${campaignId}`}
                            className={`${darkBtn} px-4 py-2.5 text-xs font-bold`}
                          >
                            {L("details")}
                          </Link>
                        ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
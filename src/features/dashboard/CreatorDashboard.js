"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { getCreatorRecommendations, getMyCampaignApplications } from "@/services/campaign";
import { getProfile } from "@/services/profile";
import { getWalletBalance } from "@/services/wallet";
import {
  FiCompass,
  FiSliders,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronDown,
  FiFileText,
  FiHelpCircle,
  FiUser,
  FiPlusSquare,
  FiShoppingBag,
  FiHome,
  FiBell,
  FiMessageSquare,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

const CONTENT_TYPE_LABELS = {
  CLIPPING: "مقاطع قصيرة",
  UGC: "محتوى من إنشاء المستخدم",
  SLIDESHOW: "عرض شرائح",
  AUDIO: "محتوى صوتي",
  LOGO: "تصميم شعارات",
  MIXED: "محتوى متنوع",
};

const COUNTRY_LABELS = {
  SAU: "السعودية",
  ARE: "الإمارات",
  KWT: "الكويت",
  QAT: "قطر",
  BHR: "البحرين",
  OMN: "عُمان",
  EGY: "مصر",
  JOR: "الأردن",
  IRQ: "العراق",
  LBN: "لبنان",
  MAR: "المغرب",
  TUR: "تركيا",
  USA: "الولايات المتحدة",
  GBR: "المملكة المتحدة",
};

function getRecommendationReason(reason) {
  if (reason?.code === "COUNTRY_MATCH") {
    return `جمهورك في ${COUNTRY_LABELS[reason.value] || reason.value}`;
  }
  if (reason?.code === "CONTENT_TYPE_MATCH") {
    return `يناسب محتوى ${CONTENT_TYPE_LABELS[reason.value] || reason.value}`;
  }
  if (reason?.code === "CPM_MATCH") return "يلبي الحد الأدنى لعائد CPM";
  if (reason?.code === "PREVIOUS_PARTICIPATION") {
    return `مشابه لحملات شاركت بها${reason.value ? ` (${CONTENT_TYPE_LABELS[reason.value] || reason.value})` : ""}`;
  }
  return reason?.value || "مقترحة لك";
}

function getResponseData(response) {
  if (response?.success === false) {
    throw new Error(response.message || "تعذر تحميل البيانات من الخادم.");
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

function getProfileUser(response) {
  const data = getResponseData(response);
  return data?.user ?? data?.profile ?? data;
}

function getApplicationName(application) {
  return application?.campaign?.name || application?.campaignName || "حملة بدون اسم";
}

function getApplicationStatusLabel(status) {
  return {
    PENDING: "بانتظار المراجعة",
    ACCEPTED: "مقبول",
    REJECTED: "مرفوض",
    WITHDRAWN: "منسحب",
  }[String(status || "").toUpperCase()] || status || "غير محدد";
}

function formatCurrency(amount, currency, locale) {
  if (!Number.isFinite(Number(amount))) return "—";
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

function formatDate(value, locale) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : locale, {
    dateStyle: "medium",
  }).format(date);
}

export default function CreatorDashboard({
  locale: localeOverride,
  standalone = true,
}) {
  const currentLocale = useLocale();
  const locale = localeOverride || currentLocale;
  const [activeNav, setActiveNav] = useState("home");
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

  const loadRecommendations = useCallback(async () => {
    setRecommendationError("");
    setIsLoadingRecommendations(true);
    try {
      const response = await getCreatorRecommendations(10);
      setRecommendations(Array.isArray(response?.data) ? response.data : []);
      setHasPreferences(response?.meta?.hasPreferences ?? null);
    } catch (error) {
      setRecommendations([]);
      setRecommendationError(error?.message || "تعذر تحميل الحملات المقترحة حالياً.");
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, []);

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
        setProfile(getProfileUser(profileResult.value));
      } catch {
        setProfile(null);
      }
    } else {
      setProfile(null);
    }

    if (walletResult.status === "fulfilled") {
      try {
        const walletData = getResponseData(walletResult.value);
        const hasBalance =
          walletData?.balance !== null &&
          walletData?.balance !== undefined &&
          Number.isFinite(Number(walletData.balance));
        setWallet(hasBalance ? walletData : null);
        if (!hasBalance) {
          setWalletError("لم يصل رصيد صالح من الخادم.");
        }
      } catch (error) {
        setWallet(null);
        setWalletError(error?.message || "تعذر تحميل رصيد المحفظة.");
      }
    } else {
      setWallet(null);
      setWalletError(walletResult.reason?.message || "تعذر تحميل رصيد المحفظة.");
    }

    if (applicationsResult.status === "fulfilled") {
      const result = getApplicationsResponse(applicationsResult.value);
      setApplications(result.items);
      setTotalApplications(result.total);
    } else {
      setApplications([]);
      setTotalApplications(null);
      setApplicationsError(applicationsResult.reason?.message || "تعذر تحميل طلبات الحملات.");
    }

    const getCount = (result) => {
      if (result.status !== "fulfilled") return null;
      return getApplicationsResponse(result.value).total;
    };
    setPendingApplications(getCount(pendingResult));
    setAcceptedApplications(getCount(acceptedResult));
    setIsLoadingHomeData(false);
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadRecommendations();
    } finally {
      setIsRefreshing(false);
    }
  };

  const displayName =
    profile?.fullName ||
    profile?.displayName ||
    profile?.name ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "صانع المحتوى";
  const displayInitial = Array.from(displayName.trim())[0] || "؟";
  const walletBalance = formatCurrency(wallet?.balance, wallet?.currency, locale);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#050505] text-white flex flex-col xl:flex-row font-tajawal antialiased selection:bg-[#94D3C1] selection:text-[#101513]"
    >
      {/* ─── القائمة الجانبية (Right Sidebar) ───────────────────────── */}
      {standalone && (
        <aside className="w-full xl:w-[250px] bg-[#050505] border-b xl:border-b-0 xl:border-l border-[#1E2425] p-5 flex flex-col justify-between flex-shrink-0">
          <div>
            {/* الشعار واسم المنصة */}
            <div className="flex items-center gap-3 px-2 py-3 mb-6">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src="/images/logo6.png"
                  alt="Pay Per View"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <span className="font-bold text-lg text-white tracking-wide">Pay Per View</span>
            </div>

            {/* روابط التنقل الرئيسية */}
            <nav className="space-y-1.5">
              {/* 1. الرئيسية (نشط) */}
              <button
                type="button"
                onClick={() => setActiveNav("home")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "home"
                    ? "bg-[#121617] text-white border border-[#1E2425]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#222728]"
                }`}
              >
                <FiHome
                  size={18}
                  className={activeNav === "home" ? "text-[#94D3C1]" : "text-[#9CA3AF]"}
                />
                <span>الرئيسية</span>
              </button>

              {/* 2. طلباتي */}
              <button
                type="button"
                onClick={() => setActiveNav("orders")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "orders"
                    ? "bg-[#121617] text-white border border-[#1E2425]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#222728]"
                }`}
              >
                <FiShoppingBag
                  size={18}
                  className={activeNav === "orders" ? "text-[#94D3C1]" : "text-[#9CA3AF]"}
                />
                <span>طلباتي</span>
              </button>

              {/* 3. اكتشف */}
              <button
                type="button"
                onClick={() => setActiveNav("discover")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "discover"
                    ? "bg-[#121617] text-white border border-[#1E2425]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#222728]"
                }`}
              >
                <FiCompass
                  size={18}
                  className={activeNav === "discover" ? "text-[#94D3C1]" : "text-[#9CA3AF]"}
                />
                <span>اكتشف</span>
              </button>

              {/* 4. ابدأ مشروعاً */}
              <button
                type="button"
                onClick={() => setActiveNav("new")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "new"
                    ? "bg-[#121617] text-white border border-[#1E2425]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#222728]"
                }`}
              >
                <FiPlusSquare
                  size={18}
                  className={activeNav === "new" ? "text-[#94D3C1]" : "text-[#9CA3AF]"}
                />
                <span>ابدأ مشروعاً</span>
              </button>

              {/* عنوان قسم: موارد */}
              <div className="pt-4 pb-1 px-3">
                <span className="text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase">
                  موارد
                </span>
              </div>

              {/* 5. الملف الشخصي */}
              <button
                type="button"
                onClick={() => setActiveNav("profile")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "profile"
                    ? "bg-[#121617] text-white border border-[#1E2425]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#222728]"
                }`}
              >
                <FiUser
                  size={18}
                  className={activeNav === "profile" ? "text-[#94D3C1]" : "text-[#9CA3AF]"}
                />
                <span>الملف الشخصي</span>
              </button>

              {/* 6. يساعد */}
              <button
                type="button"
                onClick={() => setActiveNav("help")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "help"
                    ? "bg-[#121617] text-white border border-[#1E2425]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#222728]"
                }`}
              >
                <FiHelpCircle
                  size={18}
                  className={activeNav === "help" ? "text-[#94D3C1]" : "text-[#9CA3AF]"}
                />
                <span>يساعد</span>
              </button>

              {/* 7. مدونة */}
              <button
                type="button"
                onClick={() => setActiveNav("blog")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "blog"
                    ? "bg-[#121617] text-white border border-[#1E2425]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#222728]"
                }`}
              >
                <FiFileText
                  size={18}
                  className={activeNav === "blog" ? "text-[#94D3C1]" : "text-[#9CA3AF]"}
                />
                <span>مدونة</span>
              </button>
            </nav>
          </div>

          {/* تذييل السايدبار */}
          <div className="pt-4 border-t border-[#1E2425] text-[11px] text-[#6B7280] text-center">
            © Pay Per View 2026
          </div>
        </aside>
      )}

      {/* ─── المحتوى الرئيسي (Main Content) ────────────────────────── */}
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-7 max-w-[1440px] w-full min-w-0">
        {/* الشريط العلوي المصغر (Top Utility Bar) */}
        {standalone && (
          <header className="flex items-center justify-between mb-5 pb-1">
            {/* الأيقونات في أقصى اليسار في RTL */}
            <div className="flex items-center gap-2.5 mr-auto">
              {/* الرصيد */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#121617] border border-[#1E2425] text-white text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 hover:border-[#303638] transition-colors cursor-pointer">
                <span>{isLoadingHomeData ? "…" : walletBalance}</span>
              </div>

              {/* المساعد الذكي */}
              <button
                type="button"
                aria-label="المساعد الذكي"
                className="w-8 h-8 rounded-full bg-[#121617] border border-[#1E2425] text-[#9CA3AF] hover:text-[#94D3C1] hover:border-[#94D3C1]/50 flex items-center justify-center transition-all cursor-pointer"
              >
                <HiOutlineSparkles size={16} />
              </button>

              {/* الرسائل */}
              <button
                type="button"
                aria-label="الرسائل"
                className="w-8 h-8 rounded-full bg-[#121617] border border-[#1E2425] text-[#9CA3AF] hover:text-white hover:border-[#303638] flex items-center justify-center transition-all cursor-pointer"
              >
                <FiMessageSquare size={15} />
              </button>

              {/* الإشعارات */}
              <button
                type="button"
                aria-label="الإشعارات"
                className="w-8 h-8 rounded-full bg-[#121617] border border-[#1E2425] text-[#9CA3AF] hover:text-white hover:border-[#303638] flex items-center justify-center relative transition-all cursor-pointer"
              >
                <FiBell size={15} />
              </button>

              {/* القائمة المصغرة للحساب */}
              <button
                type="button"
                className="h-8 px-2.5 rounded-full bg-[#121617] border border-[#1E2425] text-white text-xs font-medium flex items-center gap-1.5 hover:border-[#303638] transition-all cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full bg-[#333333] text-[#9CA3AF] text-[11px] font-bold flex items-center justify-center">
                  {displayInitial}
                </span>
                <FiChevronDown size={13} className="text-[#9CA3AF]" />
              </button>
            </div>
          </header>
        )}

        {/* ─── بطاقة الترحيب (Welcome Card) ────────────────────────── */}
        <div className="bg-[#121617] border border-[#1E2425] rounded-2xl p-5 md:p-6 mb-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-sm">
          {/* معلومات المستخدم */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border border-[#94D3C1]/30 bg-[#122625] text-[#94D3C1] flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {displayInitial}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                  أهلاً بك، {displayName}
                </h1>
                <span className="text-[#E9C349] text-lg">✨</span>
              </div>
              <p className="mt-1.5 text-xs text-[#9CA3AF]">
                {isLoadingHomeData ? "جارٍ تحميل بيانات حسابك…" : "هذه نظرة سريعة على نشاطك في المنصة."}
              </p>
            </div>
          </div>

          {/* أزرار الإجراء السريع */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* زر استكشاف حملات جديدة */}
            <Link
              href={`/${locale}/creator/discover`}
              className="flex-1 lg:flex-none px-5 py-2.5 bg-[#94D3C1] hover:bg-[#83C2B0] text-[#101513] font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <FiCompass size={17} />
              <span>استكشاف حملات جديدة</span>
            </Link>

            {/* زر الملف الشخصي */}
            <Link
              href={`/${locale}/creator/profile`}
              className="px-4 py-2.5 bg-[#121617] hover:bg-[#1E2425] border border-[#1E2425] text-white font-medium text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiUser size={16} className="text-[#9CA3AF]" />
              <span>الملف الشخصي</span>
            </Link>
          </div>
        </div>

        {/* ─── ملخص الحساب من بيانات الخادم ───────────────────────── */}
        <section className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <article className="bg-[#121617] border border-[#1E2425] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">رصيد المحفظة</span>
                <MdOutlineAccountBalanceWallet size={20} className="text-[#94D3C1]" />
              </div>
              <p className="mt-4 text-2xl font-bold text-white">
                {isLoadingHomeData ? "…" : walletBalance}
              </p>
              {walletError && <p className="mt-2 text-xs text-amber-300">{walletError}</p>}
            </article>

            <article className="bg-[#121617] border border-[#1E2425] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">إجمالي طلبات الحملات</span>
                <FiFileText size={19} className="text-[#94D3C1]" />
              </div>
              <p className="mt-4 text-2xl font-bold text-white">
                {isLoadingHomeData ? "…" : totalApplications ?? "—"}
              </p>
            </article>

            <article className="bg-[#121617] border border-[#1E2425] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">بانتظار المراجعة</span>
                <FiClock size={19} className="text-amber-300" />
              </div>
              <p className="mt-4 text-2xl font-bold text-white">
                {isLoadingHomeData ? "…" : pendingApplications ?? "—"}
              </p>
            </article>

            <article className="bg-[#121617] border border-[#1E2425] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">الطلبات المقبولة</span>
                <FiCheckCircle size={19} className="text-[#94D3C1]" />
              </div>
              <p className="mt-4 text-2xl font-bold text-white">
                {isLoadingHomeData ? "…" : acceptedApplications ?? "—"}
              </p>
            </article>
          </div>
        </section>
        {/* ─── الحملات المقترحة من API ───────────────────────────────────── */}
        <section className="mb-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white md:text-2xl">الحملات المقترحة لك</h2>
              <p className="mt-1 text-xs text-[#9CA3AF] md:text-sm">
                اقتراحات مبنية على أنواع المحتوى والدول والحد الأدنى لعائد CPM في تفضيلاتك.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isLoadingRecommendations || isRefreshing}
                className="flex items-center gap-2 rounded-xl border border-[#1E2425] bg-[#121617] px-3 py-2 text-xs text-white transition-all hover:bg-[#1E2425] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiRefreshCw
                  size={13}
                  className={"text-[#9CA3AF] " + (isRefreshing ? "animate-spin text-[#94D3C1]" : "")}
                />
                <span>تحديث التوصيات</span>
              </button>
              <Link
                href={"/" + locale + "/creator/discover"}
                className="flex items-center gap-1.5 rounded-xl border border-[#1E2425] bg-[#121617] px-3.5 py-2 text-xs text-white transition-all hover:bg-[#1E2425]"
              >
                <span>عرض كل الحملات</span>
                <FiChevronLeft size={14} className="text-[#9CA3AF]" />
              </Link>
            </div>
          </div>

          {isLoadingRecommendations ? (
            <div className="rounded-2xl border border-[#1E2425] bg-[#121617] p-8 text-center text-sm text-[#9CA3AF]" aria-live="polite">
              جارٍ تحميل الحملات المقترحة...
            </div>
          ) : recommendationError ? (
            <div className="rounded-2xl border border-red-500/30 bg-[#171D1C] p-8 text-center">
              <p role="alert" className="mb-4 text-sm text-red-200">{recommendationError}</p>
              <button
                type="button"
                onClick={loadRecommendations}
                className="rounded-xl border border-[#353A3B] px-4 py-2 text-xs font-semibold text-white hover:border-[#94D3C1]"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : recommendations.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border border-[#282E2C] bg-[#171D1C] p-7 text-center shadow-lg md:p-10"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 8% 12%, rgba(80, 140, 122, 0.14), transparent 34%), radial-gradient(ellipse at 94% 90%, rgba(255, 112, 0, 0.10), transparent 36%)",
              }}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#94D3C1]/10 text-[#94D3C1]">
                <HiOutlineSparkles size={30} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white md:text-xl">
                {hasPreferences === false ? "خصص تفضيلاتك لعرض حملات مناسبة" : "لا توجد توصيات حالياً"}
              </h3>
              <p className="mb-6 max-w-xl text-xs leading-6 text-[#A4AAA8] md:text-sm">
                {hasPreferences === false
                  ? "اختر أنواع المحتوى والدول والحد الأدنى لعائد CPM، ثم سنبحث عن الحملات التي تطابقها."
                  : "استكشف الحملات المتاحة أو عدّل تفضيلاتك لتوسيع نطاق التوصيات."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href={"/" + locale + "/creator/discover"}
                  className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5600] px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_22px_rgba(255,112,0,0.22)] transition hover:brightness-110"
                >
                  تصفح كافة الحملات
                </Link>
                <Link
                  href={"/" + locale + "/creator/edit-profile/interests"}
                  className="flex items-center gap-2 rounded-xl border border-[#2D3331] bg-[#242827] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#2B302F]"
                >
                  <FiSliders size={15} className="text-[#94D3C1]" />
                  <span>تعديل التفضيلات</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((camp) => {
                const countryNames = Array.isArray(camp.targetCountries)
                  ? camp.targetCountries.map((code) => COUNTRY_LABELS[code] || code).join("، ")
                  : "";
                const matchReasons = Array.isArray(camp.reasons) ? camp.reasons : [];
                return (
                  <article
                    key={camp.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#1E2425] bg-[#121617] shadow-md transition hover:border-[#3C504A]"
                  >
                    <div className="flex items-center gap-3 border-b border-[#1E2425] bg-[#101313] p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#242827] text-lg font-bold text-[#94D3C1]">
                        {camp.brand?.name?.trim()?.charAt(0) || "P"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-[#9CA3AF]">{camp.brand?.name || "علامة تجارية"}</p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-white">
                          {camp.name || "حملة إعلانية"}
                        </h3>
                      </div>
                      <div className="shrink-0 rounded-lg bg-[#94D3C1]/10 px-2 py-1 text-center">
                        <span className="block text-[10px] text-[#94D3C1]">التوافق</span>
                        <span className="text-xs font-bold text-white">{camp.matchScore ?? "—"}</span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-[#E9C349]/25 bg-[#E9C349]/10 px-2.5 py-1 text-[10px] font-semibold text-[#E9C349]">
                          {CONTENT_TYPE_LABELS[camp.contentType] || camp.contentType || "نوع محتوى متنوع"}
                        </span>
                        {camp.isHalalVerified && (
                          <span className="rounded-full border border-[#94D3C1]/25 bg-[#94D3C1]/10 px-2.5 py-1 text-[10px] font-semibold text-[#94D3C1]">
                            معتمدة شرعياً
                          </span>
                        )}
                        {camp.isFavorited && (
                          <span className="rounded-full border border-pink-400/25 bg-pink-400/10 px-2.5 py-1 text-[10px] text-pink-200">
                            في المفضلة
                          </span>
                        )}
                        {camp.availability && (
                          <span className="rounded-full border border-[#94D3C1]/25 bg-[#94D3C1]/10 px-2.5 py-1 text-[10px] text-[#94D3C1]">
                            {camp.availability === "AVAILABLE" ? "متاحة" : "حالتها: " + camp.availability}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#1E2425] bg-[#101313] p-3">
                        <div>
                          <span className="block text-[10px] text-[#6B7280]">عائد CPM</span>
                          <span className="text-sm font-bold text-white">
                            {camp.cpm == null
                              ? "—"
                              : Number(camp.cpm).toLocaleString(locale, { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#6B7280]">الميزانية المتبقية</span>
                          <span className="text-sm font-bold text-white">
                            {camp.remainingBudget == null
                              ? "—"
                              : Number(camp.remainingBudget).toLocaleString(locale, { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] text-[#6B7280]">الدول المستهدفة</span>
                          <span className="text-xs font-medium text-white">{countryNames || "غير محددة"}</span>
                        </div>
                      </div>

                      {matchReasons.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {matchReasons.map((reason, index) => (
                            <span
                              key={reason.code + "-" + String(reason.value) + "-" + index}
                              className="rounded-full bg-[#122625] px-2.5 py-1 text-[10px] text-[#94D3C1]"
                            >
                              {getRecommendationReason(reason)}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href={"/" + locale + "/creator/discover/" + camp.id}
                        className="mt-auto flex items-center justify-center rounded-xl bg-[#94D3C1] px-4 py-2.5 text-xs font-bold text-[#101513] transition hover:bg-[#83C2B0]"
                      >
                        عرض تفاصيل الحملة
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        {/* ─── أحدث طلبات الحملات من الخادم ───────────────────────── */}
        <section className="bg-[#121617] border border-[#1E2425] rounded-2xl p-5 md:p-6 mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#122625] text-[#94D3C1] flex items-center justify-center flex-shrink-0">
                <FiClock size={18} />
              </div>
              <div>
                <h2 className="text-sm md:text-base font-bold text-white">أحدث طلبات الحملات</h2>
                <p className="text-xs text-[#6B7280]">الطلبات المسجلة على حسابك</p>
              </div>
            </div>
            <Link
              href={`/${locale}/creator/orders`}
              className="text-xs font-semibold text-[#94D3C1] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>عرض كل الطلبات</span>
              <span>←</span>
            </Link>
          </div>

          {isLoadingHomeData ? (
            <div className="rounded-xl border border-[#1E2425] p-6 text-center text-sm text-[#9CA3AF]">
              جارٍ تحميل طلباتك…
            </div>
          ) : applicationsError ? (
            <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-5 text-center">
              <p className="text-sm text-red-200">{applicationsError}</p>
              <button
                type="button"
                onClick={loadHomeData}
                className="mt-3 rounded-lg border border-[#303638] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E2425]"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-[#1E2425] p-6 text-center">
              <p className="text-sm text-[#9CA3AF]">لا توجد طلبات حملات حتى الآن.</p>
              <Link
                href={`/${locale}/creator/discover`}
                className="mt-3 inline-flex rounded-lg bg-[#94D3C1] px-4 py-2 text-xs font-bold text-[#101513] hover:bg-[#83C2B0]"
              >
                اكتشف الحملات
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((application) => {
                const campaign = application?.campaign || {};
                const campaignId = campaign.id || application?.campaignId;
                const status = String(application?.status || "").toUpperCase();
                const statusClass = status === "ACCEPTED"
                  ? "border-[#94D3C1]/30 bg-[#122625] text-[#94D3C1]"
                  : status === "PENDING"
                    ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
                    : "border-[#303638] bg-[#1E2425] text-[#9CA3AF]";

                return (
                  <article
                    key={application.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#1E2425] bg-[#0B0F10] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      {campaignId ? (
                        <Link
                          href={`/${locale}/creator/discover/${campaignId}`}
                          className="text-sm font-bold text-white transition-colors hover:text-[#94D3C1]"
                        >
                          {getApplicationName(application)}
                        </Link>
                      ) : (
                        <h3 className="text-sm font-bold text-white">{getApplicationName(application)}</h3>
                      )}
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        {campaign?.brand?.name || ""}
                        {campaign?.brand?.name && application?.appliedAt ? " · " : ""}
                        {formatDate(application?.appliedAt, locale)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      {campaign?.cpm != null && (
                        <span className="text-xs font-semibold text-white">
                          {formatCurrency(campaign.cpm, "USD", locale)} CPM
                        </span>
                      )}
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusClass}`}>
                        {getApplicationStatusLabel(status)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

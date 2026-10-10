"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCompass,
  FiSliders,
  FiHeart,
  FiRefreshCw,
  FiSend,
  FiInfo,
  FiUpload,
  FiClock,
  FiCheckCircle,
  FiEye,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronDown,
  FiFileText,
  FiHelpCircle,
  FiUser,
  FiPlusSquare,
  FiShoppingBag,
  FiHome,
  FiBarChart2,
  FiBell,
  FiMessageSquare,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoDiamondOutline } from "react-icons/io5";
import { MdOutlineAccountBalanceWallet, MdCampaign } from "react-icons/md";
import { BiGitBranch } from "react-icons/bi";

export default function CreatorDashboard({
  locale = "ar",
  standalone = true,
  defaultHasRecommendations = false, // false = تصميم 192 (Empty State)، true = تصميم 190 (بطاقات الحملات)
}) {
  const [activeNav, setActiveNav] = useState("home");
  const [favorites, setFavorites] = useState({});
  const [appliedCampaigns, setAppliedCampaigns] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState(null);
  const [hasRecommendations, setHasRecommendations] = useState(defaultHasRecommendations);
  const [instantNotifications, setInstantNotifications] = useState(true);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApply = (id) => {
    setAppliedCampaigns((prev) => ({ ...prev, [id]: true }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // تبديل تفاعلي لطيف بين حالة التوصيات وحالة الـ Empty State
      setHasRecommendations((prev) => !prev);
    }, 600);
  };

  // بيانات الحملات المقترحة (لتصميم 190)
  const recommendedCampaigns = [
    {
      id: "gold-campaign",
      image: "/assets/dashboard/gold-card.png",
      tag: "استثمار شرعي",
      relevanceText: "مناسب لجمهورك في السعودية (74% من متابعيك مهتمين بالاستثمار الموثوق)",
      title: "منصة الاستثمار والذهب الذكي – حملة إطلاق محفظة السبائك",
      description: "صناعة كليبات تعليمية سريعة حول شراء وتخزين الذهب الحقيقي بدون شبهات مالية أو فوائد مخفية.",
      cpm: "$5.20",
      budget: "$25,000",
      platforms: "TikTok, Reels",
      slots: "6 مقاعد فقط",
      slotsColor: "text-[#F5B833]",
    },
    {
      id: "fashion-campaign",
      image: "/assets/dashboard/fashion-card.png",
      tag: "موضة وأزياء محتشمة",
      relevanceText: "بسبب نوع المحتوى الخاص بك (Clipping عالي التفاعل بنسبة 8.6% مع الأزياء)",
      title: "مجموعة العيد للموضة المحتشمة – قصص وتنسيقات ملهمة",
      description: "تغطية وتجهيز شورتات جذابة تلهم العائلات بمظهر راقٍ يتناسب مع روح المناسبات الإسلامية والتقاليد.",
      cpm: "$4.80",
      budget: "$18,500",
      platforms: "Instagram, TikTok",
      slots: "9 مقاعد متبقية",
      slotsColor: "text-[#F5B833]",
    },
    {
      id: "fintech-campaign",
      image: "/assets/dashboard/fintech-card.png",
      tag: "تكنولوجيا مالية إسلامية",
      relevanceText: "خبرتك في تبسيط التطبيقات المالية",
      title: "تطبيق إدارة الثروات والزكاة الذكية – الاستثمار الأخلاقي",
      description: "مقاطع قصيرة تشرح حساب زكاة الأسهم والعوائد بضغطة زر مع الالتزام بالشفافية المطلقة.",
      cpm: "$6.10",
      budget: "$40,000",
      platforms: "Shorts, TikTok",
      slots: "3 مقاعد فقط",
      slotsColor: "text-[#F5B833]",
    },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#090A0F] text-white flex flex-col xl:flex-row font-tajawal antialiased selection:bg-[#FF6B00] selection:text-white"
    >
      {/* ─── القائمة الجانبية (Right Sidebar) ───────────────────────── */}
      {standalone && (
        <aside className="w-full xl:w-[250px] bg-[#0C0E14] border-b xl:border-b-0 xl:border-l border-[#1A1F2B] p-5 flex flex-col justify-between flex-shrink-0">
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
                    ? "bg-[#18202B] text-white border border-[#232D3D]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#141822]"
                }`}
              >
                <FiHome
                  size={18}
                  className={activeNav === "home" ? "text-[#2DD4BF]" : "text-[#94A3B8]"}
                />
                <span>الرئيسية</span>
              </button>

              {/* 2. طلباتي */}
              <button
                type="button"
                onClick={() => setActiveNav("orders")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "orders"
                    ? "bg-[#18202B] text-white border border-[#232D3D]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#141822]"
                }`}
              >
                <FiShoppingBag
                  size={18}
                  className={activeNav === "orders" ? "text-[#2DD4BF]" : "text-[#94A3B8]"}
                />
                <span>طلباتي</span>
              </button>

              {/* 3. اكتشف */}
              <button
                type="button"
                onClick={() => setActiveNav("discover")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "discover"
                    ? "bg-[#18202B] text-white border border-[#232D3D]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#141822]"
                }`}
              >
                <FiCompass
                  size={18}
                  className={activeNav === "discover" ? "text-[#2DD4BF]" : "text-[#94A3B8]"}
                />
                <span>اكتشف</span>
              </button>

              {/* 4. ابدأ مشروعاً */}
              <button
                type="button"
                onClick={() => setActiveNav("new")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "new"
                    ? "bg-[#18202B] text-white border border-[#232D3D]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#141822]"
                }`}
              >
                <FiPlusSquare
                  size={18}
                  className={activeNav === "new" ? "text-[#2DD4BF]" : "text-[#94A3B8]"}
                />
                <span>ابدأ مشروعاً</span>
              </button>

              {/* عنوان قسم: موارد */}
              <div className="pt-4 pb-1 px-3">
                <span className="text-[11px] font-semibold text-[#475569] tracking-wider uppercase">
                  موارد
                </span>
              </div>

              {/* 5. الملف الشخصي */}
              <button
                type="button"
                onClick={() => setActiveNav("profile")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "profile"
                    ? "bg-[#18202B] text-white border border-[#232D3D]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#141822]"
                }`}
              >
                <FiUser
                  size={18}
                  className={activeNav === "profile" ? "text-[#2DD4BF]" : "text-[#94A3B8]"}
                />
                <span>الملف الشخصي</span>
              </button>

              {/* 6. يساعد */}
              <button
                type="button"
                onClick={() => setActiveNav("help")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "help"
                    ? "bg-[#18202B] text-white border border-[#232D3D]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#141822]"
                }`}
              >
                <FiHelpCircle
                  size={18}
                  className={activeNav === "help" ? "text-[#2DD4BF]" : "text-[#94A3B8]"}
                />
                <span>يساعد</span>
              </button>

              {/* 7. مدونة */}
              <button
                type="button"
                onClick={() => setActiveNav("blog")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "blog"
                    ? "bg-[#18202B] text-white border border-[#232D3D]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#141822]"
                }`}
              >
                <FiFileText
                  size={18}
                  className={activeNav === "blog" ? "text-[#2DD4BF]" : "text-[#94A3B8]"}
                />
                <span>مدونة</span>
              </button>
            </nav>
          </div>

          {/* تذييل السايدبار */}
          <div className="pt-4 border-t border-[#1A1F2B] text-[11px] text-[#475569] text-center">
            © Pay Per View 2026
          </div>
        </aside>
      )}

      {/* ─── المحتوى الرئيسي (Main Content) ────────────────────────── */}
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-7 max-w-[1440px] w-full min-w-0">
        {/* الشريط العلوي المصغر (Top Utility Bar) */}
        {standalone && (
          <header className="flex items-center justify-between mb-5 pb-1">
            {/* مؤشر الحالة / وضع العرض الحالي */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHasRecommendations(!hasRecommendations)}
                className="text-[11px] text-[#64748B] hover:text-[#2DD4BF] bg-[#12151C] border border-[#1E2430] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="اضغط للتبديل بين تصميم 190 (مع حملات) وتصميم 192 (بدون توصيات)"
              >
                {hasRecommendations ? "نمط: حملات مقترحة (190)" : "نمط: لا توجد توصيات (192)"} ⮂
              </button>
            </div>

            {/* الأيقونات في أقصى اليسار في RTL */}
            <div className="flex items-center gap-2.5 mr-auto">
              {/* الرصيد */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#13161F] border border-[#232A38] text-white text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 hover:border-[#343E52] transition-colors cursor-pointer">
                <span>$1,420</span>
              </div>

              {/* المساعد الذكي */}
              <button
                type="button"
                aria-label="المساعد الذكي"
                className="w-8 h-8 rounded-full bg-[#13161F] border border-[#232A38] text-[#94A3B8] hover:text-[#2DD4BF] hover:border-[#2DD4BF]/50 flex items-center justify-center transition-all cursor-pointer"
              >
                <HiOutlineSparkles size={16} />
              </button>

              {/* الرسائل */}
              <button
                type="button"
                aria-label="الرسائل"
                className="w-8 h-8 rounded-full bg-[#13161F] border border-[#232A38] text-[#94A3B8] hover:text-white hover:border-[#343E52] flex items-center justify-center transition-all cursor-pointer"
              >
                <FiMessageSquare size={15} />
              </button>

              {/* الإشعارات مع النقطة الحمراء */}
              <button
                type="button"
                aria-label="الإشعارات"
                className="w-8 h-8 rounded-full bg-[#13161F] border border-[#232A38] text-[#94A3B8] hover:text-white hover:border-[#343E52] flex items-center justify-center relative transition-all cursor-pointer"
              >
                <FiBell size={15} />
                <span className="w-2 h-2 rounded-full bg-[#EF4444] absolute top-1.5 right-1.5 ring-2 ring-[#13161F]" />
              </button>

              {/* القائمة المصغرة للحساب */}
              <button
                type="button"
                className="h-8 px-2.5 rounded-full bg-[#13161F] border border-[#232A38] text-white text-xs font-medium flex items-center gap-1.5 hover:border-[#343E52] transition-all cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full bg-[#1F2736] text-[#94A3B8] text-[11px] font-bold flex items-center justify-center">
                  م
                </span>
                <FiChevronDown size={13} className="text-[#94A3B8]" />
              </button>
            </div>
          </header>
        )}

        {/* ─── بطاقة الترحيب (Welcome Card) ────────────────────────── */}
        <div className="bg-[#12151C] border border-[#1E2430] rounded-2xl p-5 md:p-6 mb-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-sm">
          {/* معلومات المستخدم */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#2DD4BF]/30 bg-[#161C26] flex-shrink-0">
              <Image
                src="/assets/dashboard/avatar.png"
                alt="إسلام سليم"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
              {/* شارة التوثيق الخضراء */}
              <div
                title="حساب موثق"
                className="absolute bottom-1 left-1 w-4 h-4 rounded-full bg-[#2DD4BF] text-black flex items-center justify-center text-[10px] font-bold border-2 border-[#12151C]"
              >
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                  أهلاً بك مجدداً، إسلام سليم
                </h1>
                <span className="text-[#F5B833] text-lg">✨</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-[#94A3B8] mt-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse" />
                  <span className="text-[#94A3B8]">الحساب نشط ومتوافق مع الضوابط الشرعية 100%</span>
                </div>
                <span className="text-[#475569]">•</span>
                <span className="text-[#64748B]">آخر مزامنة قبل 6 دقائق</span>
              </div>
            </div>
          </div>

          {/* أزرار الإجراء السريع */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* زر استكشاف حملات جديدة */}
            <button
              type="button"
              className="flex-1 lg:flex-none px-5 py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#FF5500] hover:from-[#ff8514] hover:to-[#ff610d] text-white font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <FiCompass size={17} />
              <span>استكشاف حملات جديدة</span>
            </button>

            {/* زر الملف الشخصي */}
            <button
              type="button"
              className="px-4 py-2.5 bg-[#171B24] hover:bg-[#1E2430] border border-[#252D3D] text-white font-medium text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiSliders size={16} className="text-[#94A3B8]" />
              <span>الملف الشخصي</span>
            </button>
          </div>
        </div>

        {/* ─── صف الإحصائيات (Metrics / KPI Row) ────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-5">
          {/* البطاقة 1: إجمالي الأرباح المكتسبة */}
          <div className="bg-[#12151C] border border-[#1E2430] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2A3342] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-[#94A3B8] font-medium">
                إجمالي الأرباح المكتسبة
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#0F2D2A] text-[#2DD4BF] flex items-center justify-center">
                <MdOutlineAccountBalanceWallet size={18} />
              </div>
            </div>

            <div className="my-3">
              <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                $14,850.00
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C222E] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#64748B] block">جاهز للسحب الفوري</span>
                <span className="text-sm md:text-base font-bold text-[#F5B833]">
                  $3,420.00
                </span>
              </div>
              <button
                type="button"
                className="bg-[#F5B833] hover:bg-[#e2a829] active:scale-95 text-black px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>سحب فوري</span>
                <FiArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* البطاقة 2: الحملات النشطة والمكتملة */}
          <div className="bg-[#12151C] border border-[#1E2430] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2A3342] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-[#94A3B8] font-medium">
                الحملات النشطة والمكتملة
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#1C1F2E] text-[#818CF8] flex items-center justify-center">
                <MdCampaign size={20} />
              </div>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold text-white">4</span>
                <span className="text-xs text-[#94A3B8]">قيد التنفيذ حالياً</span>
              </div>

              {/* شريط التقدم */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#64748B] text-[11px]">28 حملة معتمدة بالكامل</span>
                  <span className="text-white font-medium text-[11px]">85% إنجاز</span>
                </div>
                <div className="h-1.5 w-full bg-[#1A222C] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-[#10B981] to-[#2DD4BF] rounded-full transition-all duration-500"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C222E] flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">متوسط التسليم لكل مقطع</span>
              <span className="font-semibold text-white">3.2 أيام / كليب</span>
            </div>
          </div>

          {/* البطاقة 3: المشاهدات المعتمدة */}
          <div className="bg-[#12151C] border border-[#1E2430] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2A3342] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-[#94A3B8] font-medium">
                المشاهدات المعتمدة
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#0F2D2A] text-[#2DD4BF] flex items-center justify-center">
                <FiEye size={18} />
              </div>
            </div>

            <div className="my-2">
              <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                3.4M
              </div>
              <span className="text-xs text-[#94A3B8] block mt-0.5">
                مقاطع موثقة بالكامل
              </span>
            </div>

            <div className="pt-2 border-t border-[#1C222E] flex items-center justify-between">
              <span className="text-xs text-[#94A3B8] flex items-center gap-1 font-medium">
                <span className="text-[#2DD4BF]">↑</span> أعلى بـ 2.1x من المنصة
              </span>

              {/* رسم بياني مائل نيون (Sparkline Wave) */}
              <svg
                width="84"
                height="22"
                viewBox="0 0 84 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-90"
              >
                <path
                  d="M2 18C12 18 16 12 28 14C40 16 46 8 58 10C70 12 76 4 82 3"
                  stroke="#2DD4BF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ─── مسار وسير العمل المباشر (Live Workflow Strip) ───────── */}
        <div className="bg-[#12151C] border border-[#1E2430] rounded-2xl px-5 py-3.5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          {/* الجانب الأيمن: العنوان والأيقونة */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F2D2A] text-[#2DD4BF] flex items-center justify-center flex-shrink-0">
              <BiGitBranch size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">مسار وسير العمل المباشر</h2>
              <p className="text-xs text-[#64748B]">متابعة فورية للطلبات والإنتاج</p>
            </div>
          </div>

          {/* الجانب الأيسر: شارات الحالات */}
          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
            {/* 1. بانتظار المراجعة */}
            <div
              onClick={() => setActiveWorkflowTab("review")}
              className={`bg-[#181D26] hover:bg-[#1E2430] border border-[#242C3B] rounded-xl px-3 py-2 text-xs flex items-center gap-2 transition-all cursor-pointer ${activeWorkflowTab === "review" ? "border-[#EAB308]/60 bg-[#1E2430]" : ""}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              <span className="font-bold text-white">2 طلبات</span>
              <span className="text-[#94A3B8]">بانتظار المراجعة</span>
            </div>

            {/* 2. لرفع المقاطع */}
            <div
              onClick={() => setActiveWorkflowTab("upload")}
              className={`bg-[#181D26] hover:bg-[#1E2430] border border-[#242C3B] rounded-xl px-3 py-2 text-xs flex items-center gap-2 transition-all cursor-pointer ${activeWorkflowTab === "upload" ? "border-[#3B82F6]/60 bg-[#1E2430]" : ""}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <span className="font-bold text-white">3 حملات</span>
              <span className="text-[#94A3B8]">لرفع المقاطع</span>
            </div>

            {/* 3. بالفحص الضامن */}
            <div
              onClick={() => setActiveWorkflowTab("escrow")}
              className={`bg-[#181D26] hover:bg-[#1E2430] border border-[#242C3B] rounded-xl px-3 py-2 text-xs flex items-center gap-2 transition-all cursor-pointer ${activeWorkflowTab === "escrow" ? "border-[#06B6D4]/60 bg-[#1E2430]" : ""}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
              <span className="font-bold text-white">1 دفعة</span>
              <span className="text-[#94A3B8]">بالفحص الضامن</span>
            </div>

            {/* 4. معتمد ومنشور */}
            <div
              onClick={() => setActiveWorkflowTab("published")}
              className={`bg-[#181D26] hover:bg-[#1E2430] border border-[#242C3B] rounded-xl px-3 py-2 text-xs flex items-center gap-2 transition-all cursor-pointer ${activeWorkflowTab === "published" ? "border-[#10B981]/60 bg-[#1E2430]" : ""}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="font-bold text-white">42 مقطعاً</span>
              <span className="text-[#94A3B8]">معتمد ومنشور</span>
            </div>
          </div>
        </div>

        {/* ─── قسم: الحملات المقترحة لك (Recommended Campaigns / Empty State 192) ───── */}
        <section className="mb-6">
          {/* ترويسة القسم */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                الحملات المقترحة لك
              </h2>
              <p className="text-xs md:text-sm text-[#94A3B8] mt-1">
                تم انتقاؤها بناءً على تركيبة جمهورك، أعلى نسب المشاهدة لمقاطعك، والمعايير الأخلاقية المعتمدة.
              </p>
            </div>

            {/* أزرار التفاعل بالترويسة */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-[#151922] hover:bg-[#1C212E] border border-[#242B38] text-xs text-white px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                title="اضغط لتحديث التوصيات والتبديل بين النمطين"
              >
                <FiRefreshCw
                  size={13}
                  className={`text-[#94A3B8] ${isRefreshing ? "animate-spin text-[#2DD4BF]" : ""}`}
                />
                <span>تحديث التوصيات</span>
              </button>

              <button
                type="button"
                className="bg-[#151922] hover:bg-[#1C212E] border border-[#242B38] text-xs text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>عرض الكل (6)</span>
                <FiChevronLeft size={14} className="text-[#94A3B8]" />
              </button>
            </div>
          </div>

          {/* محتوى القسم: حسب الحالة (192: Empty State | 190: بطاقات الحملات) */}
          {!hasRecommendations ? (
            /* ─── تصميم MacBook Pro 16_ - 192 (حالة عدم وجود توصيات) ─── */
            <div className="bg-[#12151C] border border-[#1E2430] rounded-2xl p-6 md:p-10 lg:p-12 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-lg">
              {/* الرسم والأيقونة المركزية مع الحلقات المشعة وشارة النجوم */}
              <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                <Image
                  src="/assets/dashboard/empty-radar-icon.png"
                  alt="لا توجد توصيات"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>

              {/* العنوان الرئيسي */}
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-2.5">
                لا توجد توصيات حالياً. تصفح كافة الحملات
              </h3>

              {/* النص التوضيحي لمحرك Halal AI */}
              <p className="text-xs md:text-sm text-[#94A3B8] max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
                يقوم محرك Halal AI بفحص وتدقيق مئات الحملات يومياً، ولا توجد حالياً فرص تطابق معايير الفلترة الحالية بنسبة 100% مع الضوابط الشرعية أو تخصصك الدقيق. يمكنك استكشاف كافة الحملات العامة المتاحة فوراً أو إعادة ضبط تفضيلاتك الذكية.
              </p>

              {/* أزرار الإجراء السريع */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-6">
                {/* زر تصفح كافة الحملات المتاحة */}
                <button
                  type="button"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#FF5500] hover:from-[#ff8514] hover:to-[#ff610d] active:scale-[0.98] text-white font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <FiCompass size={16} />
                  <span>تصفح كافة الحملات المتاحة</span>
                </button>

                {/* زر تعديل تفضيلات التوصيات */}
                <button
                  type="button"
                  onClick={() => setHasRecommendations(true)}
                  className="px-5 py-2.5 bg-[#171B24] hover:bg-[#1E2430] border border-[#252D3D] text-white font-medium text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FiSliders size={16} className="text-[#94A3B8]" />
                  <span>تعديل تفضيلات التوصيات</span>
                </button>
              </div>

              {/* كبسولة تفعيل التنبيهات اللحظية في الأسفل */}
              <div className="w-full max-w-lg mx-auto bg-[#151922] border border-[#1E2533] rounded-2xl p-3 px-4 flex items-center justify-between gap-4 text-right">
                {/* الجانب الأيمن: الأيقونة والنصوص */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#201F1A] text-[#F5B833] flex items-center justify-center flex-shrink-0">
                    <FiBell size={17} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">
                      تفعيل التنبيهات اللحظية عند توفر توصيات جديدة
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      إشعار فوري عبر الحساب والبريد المعتمد عند توفر مطابقة مناسبة
                    </p>
                  </div>
                </div>

                {/* الجانب الأيسر: زر التبديل (Toggle Switch) */}
                <button
                  type="button"
                  onClick={() => setInstantNotifications(!instantNotifications)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer flex-shrink-0 ${
                    instantNotifications ? "bg-[#0D9488]" : "bg-[#252D3D]"
                  }`}
                  aria-label="تبديل التنبيهات"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                      instantNotifications ? "translate-x-0" : "-translate-x-5"
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            /* ─── شبكة بطاقات الحملات (تصميم 190) ─── */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recommendedCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-[#12151C] border border-[#1E2430] hover:border-[#2C3646] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-md"
                >
                  {/* الجزء العلوي: الصورة + الشارات */}
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-[#181D26]">
                      <Image
                        src={camp.image}
                        alt={camp.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />

                      {/* زر المفضلة */}
                      <button
                        type="button"
                        aria-label="إضافة للمفضلة"
                        onClick={() => toggleFavorite(camp.id)}
                        className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
                      >
                        <FiHeart
                          size={15}
                          className={favorites[camp.id] ? "fill-[#EF4444] text-[#EF4444]" : ""}
                        />
                      </button>

                      {/* وسم التصنيف */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[11px] font-semibold text-[#F5B833] flex items-center gap-1.5">
                        <span>{camp.tag}</span>
                        <IoDiamondOutline size={12} className="text-[#F5B833]" />
                      </div>
                    </div>

                    {/* شريط سبب التوصية */}
                    <div className="bg-[#132225] border-y border-[#1B353A] px-3.5 py-2 text-xs text-[#2DD4BF] flex items-center gap-2 font-medium">
                      <HiOutlineSparkles size={14} className="flex-shrink-0 text-[#2DD4BF]" />
                      <span className="truncate">{camp.relevanceText}</span>
                    </div>

                    {/* تفاصيل الحملة */}
                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm md:text-base leading-snug line-clamp-2 hover:text-[#FF7A00] transition-colors cursor-pointer">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2 mt-2 mb-3">
                        {camp.description}
                      </p>

                      {/* شبكة الإحصائيات (2x2 Grid) */}
                      <div className="grid grid-cols-2 gap-2.5 bg-[#161922] p-3 rounded-xl border border-[#1E2330]">
                        <div>
                          <span className="text-[10px] text-[#64748B] block">عائد CPM</span>
                          <span className="text-sm font-bold text-white">{camp.cpm}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">الميزانية المرصودة</span>
                          <span className="text-sm font-bold text-white">{camp.budget}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">المنصات المستهدفة</span>
                          <span className="text-xs font-medium text-white">{camp.platforms}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">المقاعد المتاحة</span>
                          <span className={`text-xs font-bold ${camp.slotsColor}`}>
                            {camp.slots}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* أزرار الإجراء السفلي */}
                  <div className="p-4 pt-0 flex items-center gap-2.5">
                    <button
                      type="button"
                      title="تفاصيل الحملة"
                      className="w-10 h-10 rounded-xl bg-[#171B24] border border-[#252D3D] text-[#94A3B8] hover:text-white hover:border-[#384357] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer"
                    >
                      <FiInfo size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApply(camp.id)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#FF5500] hover:from-[#ff8514] hover:to-[#ff610d] active:scale-[0.98] text-white font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                    >
                      <span>{appliedCampaigns[camp.id] ? "تم إرسال الطلب ✓" : "التقدم للحملة الآن"}</span>
                      <FiSend size={13} className="rotate-180" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── قسم: حملاتي النشطة الحالية والمواعيد القادمة ───────── */}
        <section className="bg-[#12151C] border border-[#1E2430] rounded-2xl p-5 md:p-6 mb-4 shadow-sm">
          {/* الترويسة */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0F2D2A] text-[#2DD4BF] flex items-center justify-center flex-shrink-0">
                <FiClock size={18} />
              </div>
              <div>
                <h2 className="text-sm md:text-base font-bold text-white">
                  حملاتي النشطة الحالية والمواعيد القادمة
                </h2>
                <p className="text-xs text-[#64748B]">
                  متابعة دقيقة لحالة تسليم المقاطع والمراجعة النهائية
                </p>
              </div>
            </div>

            <Link
              href="/creator/orders"
              className="text-xs font-semibold text-[#F5B833] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>الانتقال إلى لوحة طلباتي وحملاتي</span>
              <span>←</span>
            </Link>
          </div>

          {/* صفوف الحملات الحالية */}
          <div className="space-y-3">
            {/* الصف الأول: عطور النخبة الشرقية */}
            <div className="bg-[#151821] border border-[#1E2330] hover:border-[#283242] rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-all">
              {/* تفاصيل الحملة */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1D212B] flex-shrink-0 border border-[#2A3140] relative">
                  <Image
                    src="/assets/dashboard/perfume-icon.png"
                    alt="عطور النخبة الشرقية"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white hover:text-[#FF7A00] transition-colors cursor-pointer">
                    عطور النخبة الشرقية – إطلاق تشكيلة المسك الملكي
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-1">
                    <span>تاريخ البدء: 10 أبريل</span>
                    <span className="text-[#475569]">•</span>
                    <span className="text-[#F5B833] font-medium flex items-center gap-1">
                      <FiClock size={12} />
                      تسليم المقاطع: متبقي يومين
                    </span>
                  </div>
                </div>
              </div>

              {/* التقدم والأرباح والزر */}
              <div className="flex items-center justify-between lg:justify-end gap-5 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1E2330]">
                {/* شريط التقدم */}
                <div className="min-w-[140px]">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#94A3B8]">التقدم</span>
                    <span className="text-white font-medium">60%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1A222C] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-[#10B981] to-[#2DD4BF] rounded-full"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>

                {/* الأرباح المقدرة */}
                <div className="text-left">
                  <span className="text-[10px] text-[#64748B] block">الأرباح المقدرة</span>
                  <span className="text-sm font-bold text-white">$1,200.00</span>
                </div>

                {/* زر رفع كليب */}
                <button
                  type="button"
                  className="bg-[#0D3B36] hover:bg-[#124B45] text-[#2DD4BF] border border-[#16554D] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                >
                  <FiUpload size={14} />
                  <span>رفع كليب</span>
                </button>
              </div>
            </div>

            {/* الصف الثاني: تطبيق الخدمات البنكية الإسلامية */}
            <div className="bg-[#151821] border border-[#1E2330] hover:border-[#283242] rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-all">
              {/* تفاصيل الحملة */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1D212B] flex-shrink-0 border border-[#2A3140] relative">
                  <Image
                    src="/assets/dashboard/bank-icon.png"
                    alt="الخدمات البنكية الإسلامية"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white hover:text-[#FF7A00] transition-colors cursor-pointer">
                    تطبيق الخدمات البنكية الإسلامية – حساب التوفير المبرور
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-1">
                    <span>تاريخ البدء: 28 مارس</span>
                    <span className="text-[#475569]">•</span>
                    <span className="text-[#2DD4BF] font-medium flex items-center gap-1">
                      <FiCheckCircle size={12} />
                      قيد تدقيق المشاهدات والتفاعل
                    </span>
                  </div>
                </div>
              </div>

              {/* التقدم والأرباح والزر */}
              <div className="flex items-center justify-between lg:justify-end gap-5 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1E2330]">
                {/* شريط التقدم */}
                <div className="min-w-[140px]">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#94A3B8]">التقدم</span>
                    <span className="text-white font-medium">90%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1A222C] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-[#EAB308] to-[#F59E0B] rounded-full"
                      style={{ width: "90%" }}
                    />
                  </div>
                </div>

                {/* الأرباح المقدرة */}
                <div className="text-left">
                  <span className="text-[10px] text-[#64748B] block">الأرباح المقدرة</span>
                  <span className="text-sm font-bold text-white">$2,100.00</span>
                </div>

                {/* زر الإحصائيات */}
                <button
                  type="button"
                  className="bg-[#171B24] hover:bg-[#1E2430] border border-[#252D3D] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                >
                  <FiBarChart2 size={14} className="text-[#94A3B8]" />
                  <span>الإحصائيات</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

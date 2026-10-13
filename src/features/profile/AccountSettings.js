"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiCompass,
  FiSliders,
  FiChevronDown,
  FiFileText,
  FiUser,
  FiPlusSquare,
  FiShoppingBag,
  FiHome,
  FiBell,
  FiMessageSquare,
  FiTarget,
  FiHeart,
  FiLink,
  FiCreditCard,
  FiAlertTriangle,
  FiDollarSign,
  FiMapPin,
  FiUsers,
  FiCheck,
  FiPlus,
  FiRotateCcw,
  FiGlobe,
  FiSmartphone,
  FiTrendingUp,
  FiShield,
  FiEdit3,
} from "react-icons/fi";
import { MdOutlineSecurity } from "react-icons/md";
import { RiBuilding4Line } from "react-icons/ri";
import { HiOutlineSparkles } from "react-icons/hi2";
import { SiTiktok, SiInstagram, SiYoutube, SiX } from "react-icons/si";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { BiPodcast } from "react-icons/bi";
import {
  TbMicrophone,
  TbChartCandle,
  TbCpu,
  TbMoonStars,
  TbHanger,
  TbBook,
  TbLeaf,
  TbCar,
  TbRefresh,
} from "react-icons/tb";

export default function AccountSettings({
  locale = "ar",
  initialTab = "profile",
  standalone = true,
}) {
  const searchParams = useSearchParams();
  const tabFromQuery = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromQuery || initialTab);
  const [activeNav, setActiveNav] = useState("profile");

  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  /* ─────────────────────────────────────────────────────────────
     حالات صفحة تعديل الملف الشخصي (189)
  ───────────────────────────────────────────────────────────── */
  const [name, setName] = useState("إسلام سليم أبو منصور 3");
  const [username, setUsername] = useState("salloma");
  const [email, setEmail] = useState("name@company.com");
  const [bio, setBio] = useState("نبذة شخصية: لا يوجد سيرة ذاتية");
  const [phoneCountry, setPhoneCountry] = useState("(US) +1");
  const [phoneNumber, setPhoneNumber] = useState("أدخل رقم الهاتف");
  const [selectedCountry, setSelectedCountry] = useState("اختر الدولة");
  const [city, setCity] = useState("مثال: دبي");
  const [interestsText, setInterestsText] = useState("");
  const [birthYear, setBirthYear] = useState("yyyy");
  const [birthDay, setBirthDay] = useState("dd");
  const [birthMonth, setBirthMonth] = useState("mm");

  const [toggles, setToggles] = useState({
    totalEarnings: true,
    location: true,
    ownedCommunities: true,
    joinedCommunities: true,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ─────────────────────────────────────────────────────────────
     حالات صفحة الاهتمامات والتوصيات (191) - مطابقة تامة للصورة 191
  ───────────────────────────────────────────────────────────── */
  const [niches, setNiches] = useState([
    {
      id: "podcasts",
      title: "كليبينج البودكاست واللقاءات",
      status: "أولوية استهداف قصوى",
      statusColor: "text-[#F5B833]",
      weight: 98,
      active: true,
      priority: true,
      icon: TbMicrophone,
      iconBg: "bg-[#F5B833]/15 text-[#F5B833]",
    },
    {
      id: "fintech",
      title: "فنتك واستثمار حلال",
      status: "أولوية استهداف قصوى",
      statusColor: "text-[#F5B833]",
      weight: 95,
      active: true,
      priority: true,
      icon: TbChartCandle,
      iconBg: "bg-[#F5B833]/15 text-[#F5B833]",
    },
    {
      id: "ai",
      title: "ذكاء اصطناعي وأدوات تقنية",
      status: "مفعل - عائد مرتفع",
      statusColor: "text-[#2DD4BF]",
      weight: 92,
      active: true,
      priority: false,
      icon: TbCpu,
      iconBg: "bg-[#2DD4BF]/15 text-[#2DD4BF]",
    },
    {
      id: "faith",
      title: "محتوى إيماني وخواطر قيمية",
      status: "مفعل - توافق شرعي نقي",
      statusColor: "text-[#2DD4BF]",
      weight: 90,
      active: true,
      priority: false,
      icon: TbMoonStars,
      iconBg: "bg-[#10B981]/15 text-[#10B981]",
    },
    {
      id: "fashion",
      title: "أزياء وموضة محتشمة",
      status: "مفعل - شراكات معتمدة",
      statusColor: "text-[#2DD4BF]",
      weight: 85,
      active: true,
      priority: false,
      icon: TbHanger,
      iconBg: "bg-[#2DD4BF]/15 text-[#2DD4BF]",
    },
    {
      id: "history",
      title: "وثائقيات وتاريخ وحضارة",
      status: "مفعل - رواج معرفي",
      statusColor: "text-[#2DD4BF]",
      weight: 80,
      active: true,
      priority: false,
      icon: RiBuilding4Line,
      iconBg: "bg-[#38BDF8]/15 text-[#38BDF8]",
    },
    {
      id: "books",
      title: "تلخيص كتب وتطوير ذات",
      status: "مفعل - جمهور قارئ",
      statusColor: "text-[#2DD4BF]",
      weight: 78,
      active: true,
      priority: false,
      icon: TbBook,
      iconBg: "bg-[#2DD4BF]/15 text-[#2DD4BF]",
    },
    {
      id: "wellness",
      title: "تغذية وطب شمولي ونمط حياة",
      status: "غير مفعل - انقر للإضافة",
      statusColor: "text-[#64748B]",
      weight: 55,
      active: false,
      priority: false,
      icon: TbLeaf,
      iconBg: "bg-[#1E2532] text-[#64748B]",
    },
    {
      id: "cars",
      title: "سيارات وميكانيكا ذكية",
      status: "غير مفعل - انقر للإضافة",
      statusColor: "text-[#64748B]",
      weight: 50,
      active: false,
      priority: false,
      icon: TbCar,
      iconBg: "bg-[#1E2532] text-[#64748B]",
    },
  ]);

  const toggleNiche = (id) => {
    setNiches((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              active: !n.active,
              status: !n.active ? "مفعل - اختيار مخصص" : "غير مفعل - انقر للإضافة",
              statusColor: !n.active ? "text-[#2DD4BF]" : "text-[#64748B]",
              iconBg: !n.active ? "bg-[#2DD4BF]/15 text-[#2DD4BF]" : "bg-[#1E2532] text-[#64748B]",
            }
          : n
      )
    );
  };

  const [customNicheInput, setCustomNicheInput] = useState("");
  const [selectedBudgetPill, setSelectedBudgetPill] = useState("large"); // small, medium, large

  const [geoActive, setGeoActive] = useState({
    sa: true,
    ae: true,
    kw: true,
  });

  const [platforms, setPlatforms] = useState({
    instagram: true,
    tiktok: true,
    youtube: true,
    x: true,
  });

  const subMenuItems = [
    { id: "profile", label: "تعديل الملف الشخصي", icon: FiUser },
    { id: "interests", label: "الاهتمامات", icon: FiTarget },
    { id: "favorites", label: "المفضلة", icon: FiHeart },
    { id: "linked-accounts", label: "الحسابات المرتبطة", icon: FiLink },
    { id: "security", label: "أمان الحساب", icon: MdOutlineSecurity },
    { id: "notifications", label: "الإشعارات", icon: FiBell },
    { id: "payment-methods", label: "طرق الدفع", icon: FiCreditCard },
    { id: "disputes", label: "مركز حل النزاعات", icon: FiAlertTriangle },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#07080B] text-white flex flex-col xl:flex-row font-tajawal antialiased selection:bg-[#FF6B00] selection:text-white"
    >
      {/* ─── القائمة الجانبية الرئيسية (Right Main Sidebar) ─────────────── */}
      {standalone && (
        <aside className="w-full xl:w-[220px] bg-[#0A0C10] border-b xl:border-b-0 xl:border-l border-[#161A22] p-4 flex flex-col justify-between flex-shrink-0">
          <div>
            {/* الشعار */}
            <Link
              href={`/${locale}/creator-home`}
              className="flex items-center justify-between px-2 py-3 mb-6 group cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-wide group-hover:text-[#FF6B00] transition-colors">
                  Pay Per View
                </span>
              </div>
              <div className="w-9 h-9 relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FFA800] flex items-center justify-center font-bold text-white shadow-lg shadow-[#FF6B00]/20 text-xs">
                  PPV
                </div>
              </div>
            </Link>

            {/* عناصر القائمة الجانبية */}
            <nav className="space-y-1">
              <Link
                href={`/${locale}/creator-home`}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-[#94A3B8] hover:text-white hover:bg-[#121620]"
              >
                <FiHome size={17} className="text-[#94A3B8]" />
                <span>الرئيسية</span>
              </Link>

              <button
                type="button"
                onClick={() => setActiveNav("orders")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "orders"
                    ? "bg-[#161D27] text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#121620]"
                }`}
              >
                <FiShoppingBag size={17} className="text-[#94A3B8]" />
                <span>طلباتي</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav("archive")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "archive"
                    ? "bg-[#161D27] text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#121620]"
                }`}
              >
                <FiCompass size={17} className="text-[#94A3B8]" />
                <span>الأرشيف</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav("start-project")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "start-project"
                    ? "bg-[#161D27] text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#121620]"
                }`}
              >
                <FiPlusSquare size={17} className="text-[#94A3B8]" />
                <span>ابدأ مشروعاً</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav("earnings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "earnings"
                    ? "bg-[#161D27] text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#121620]"
                }`}
              >
                <FiTrendingUp size={17} className="text-[#94A3B8]" />
                <span>عوائد</span>
              </button>

              {/* الملف الشخصي (نشط) */}
              <button
                type="button"
                onClick={() => setActiveNav("profile")}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer bg-[#18212D] text-white border border-[#243042]"
              >
                <FiUser size={17} className="text-[#2DD4BF]" />
                <span>الملف الشخصي</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "settings"
                    ? "bg-[#161D27] text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#121620]"
                }`}
              >
                <FiSliders size={17} className="text-[#94A3B8]" />
                <span>إعدادات</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav("blog")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "blog"
                    ? "bg-[#161D27] text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#121620]"
                }`}
              >
                <FiFileText size={17} className="text-[#94A3B8]" />
                <span>مدونة</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-[#161A22] text-[10px] text-[#475569] text-center">
            © Pay Per View 2026
          </div>
        </aside>
      )}

      {/* ─── الحاوية الرئيسية (Main Content Container) ─────────────────── */}
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-7 max-w-[1400px] w-full min-w-0">
        {/* الشريط العلوي */}
        {standalone && (
          <header className="flex items-center justify-between mb-6 pb-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              إعدادات الحساب
            </h1>

            {/* الأيقونات في أقصى اليسار */}
            <div className="flex items-center gap-2 mr-auto">
              <div className="px-3.5 py-1.5 rounded-full bg-[#11141A] border border-[#202531] text-white text-xs font-semibold tracking-wide">
                $0.00
              </div>

              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#11141A] border border-[#202531] text-[#94A3B8] hover:text-[#2DD4BF] flex items-center justify-center transition-all cursor-pointer"
              >
                <HiOutlineSparkles size={15} />
              </button>

              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#11141A] border border-[#202531] text-[#94A3B8] hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <FiMessageSquare size={14} />
              </button>

              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#11141A] border border-[#202531] text-[#94A3B8] hover:text-white flex items-center justify-center relative transition-all cursor-pointer"
              >
                <FiBell size={14} />
                <span className="w-2 h-2 rounded-full bg-[#EF4444] absolute top-1.5 right-1.5 ring-2 ring-[#11141A]" />
              </button>

              <button
                type="button"
                className="h-8 px-2 rounded-full bg-[#11141A] border border-[#202531] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <FiChevronDown size={12} className="text-[#94A3B8]" />
                <span>salloma</span>
                <div className="w-5 h-5 rounded-full bg-[#202531] flex items-center justify-center text-[10px] text-[#94A3B8]">
                  <FiUser size={12} />
                </div>
              </button>
            </div>
          </header>
        )}

        {/* تقسيم الشاشة: القائمة الفرعية (يمين) + المحتوى المختار (يسار) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* القائمة الفرعية لإعدادات الحساب */}
          <div className="lg:col-span-3 bg-[#0B0D12] border border-[#171B24] rounded-2xl p-2.5 space-y-1">
            {subMenuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1E2532] text-white font-semibold"
                      : "text-[#8E95A2] hover:text-white hover:bg-[#121620]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={isSelected ? "text-white" : "text-[#64748B]"}
                    />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              المحتوى المختار (189 - الملف الشخصي أو 191 - الاهتمامات)
             ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-9 min-w-0">
            {/* ─────────────────────────────────────────────────────────────
                189: تعديل الملف الشخصي
               ───────────────────────────────────────────────────────────── */}
            {activeTab === "profile" && (
              <div className="space-y-5">
                {/* 1. الغلاف مع الأفاتار على الزاوية */}
                <div className="relative mb-8">
                  <div className="w-full h-44 sm:h-52 bg-[#1C2028] border border-[#262C37] rounded-2xl" />
                  <div className="absolute -bottom-6 right-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#181C24] border-4 border-[#07080B] flex items-center justify-center text-[#8E95A2] shadow-xl hover:border-[#FF6B00] transition-colors cursor-pointer group">
                      <FiUser
                        size={28}
                        className="text-[#94A3B8] group-hover:text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. حقول الإدخال الرأسية */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#8E95A2] text-right">
                      الاسم
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#11141B] border border-[#1E232E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors text-right"
                    />
                    <div className="text-left text-[11px] text-[#555E6D] px-1 font-mono">
                      22/100
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#8E95A2] text-right">
                      اسم المستخدم
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#11141B] border border-[#1E232E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors text-right font-mono"
                    />
                    <div className="text-left text-[11px] text-[#555E6D] px-1 font-mono">
                      7/40
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#8E95A2] text-right">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#11141B] border border-[#1E232E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors text-right"
                    />
                    <div className="text-left text-[11px] text-[#555E6D] px-1 font-mono">
                      17/50
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#8E95A2] text-right">
                      نبذة شخصية
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-[#11141B] border border-[#1E232E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors text-right resize-none"
                    />
                    <div className="text-left text-[11px] text-[#555E6D] px-1 font-mono">
                      0/150
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#8E95A2] text-right">
                      رقم الهاتف
                    </label>
                    <div className="flex gap-2.5">
                      <div className="w-32 bg-[#11141B] border border-[#1E232E] rounded-xl px-3 py-3 text-xs text-[#8E95A2] flex items-center justify-between cursor-pointer">
                        <FiChevronDown size={14} className="text-[#64748B]" />
                        <span className="font-mono">{phoneCountry}</span>
                      </div>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 bg-[#11141B] border border-[#1E232E] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#8E95A2] focus:outline-none focus:border-[#FF6B00] transition-colors text-right"
                      />
                    </div>
                    <div className="text-left text-[11px] text-[#555E6D] px-1 font-mono">
                      0/40
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#8E95A2] text-right">
                      الموقع
                    </label>
                    <div className="flex gap-2.5">
                      <div className="w-44 bg-[#11141B] border border-[#1E232E] rounded-xl px-3 py-3 text-xs text-[#8E95A2] flex items-center justify-between cursor-pointer">
                        <FiChevronDown size={14} className="text-[#64748B]" />
                        <span>{selectedCountry}</span>
                      </div>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="flex-1 bg-[#11141B] border border-[#1E232E] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#8E95A2] focus:outline-none focus:border-[#FF6B00] transition-colors text-right"
                      />
                    </div>
                    <div className="text-left text-[11px] text-[#555E6D] px-1 font-mono">
                      0/40
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#8E95A2] text-right">
                      الاهتمامات
                    </label>
                    <input
                      type="text"
                      placeholder="أدخل اهتماماتك..."
                      value={interestsText}
                      onChange={(e) => setInterestsText(e.target.value)}
                      className="w-full bg-[#11141B] border border-[#1E232E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors text-right"
                    />
                    <div className="text-left text-[11px] text-[#555E6D] px-1 font-mono">
                      0/40
                    </div>
                  </div>

                  <div className="border-t border-[#161A22] my-4" />

                  {/* تاريخ الميلاد */}
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#8E95A2]">
                      تاريخ الميلاد
                    </label>
                    <div className="flex items-center gap-1.5 bg-[#11141B] border border-[#1E232E] rounded-xl p-1.5 text-xs text-[#8E95A2]">
                      <input
                        type="text"
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        className="w-10 bg-transparent text-center focus:outline-none text-white font-mono"
                      />
                      <span className="text-[#475569]">/</span>
                      <input
                        type="text"
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        className="w-10 bg-transparent text-center focus:outline-none text-white font-mono"
                      />
                      <span className="text-[#475569]">/</span>
                      <input
                        type="text"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        className="w-14 bg-transparent text-center focus:outline-none text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#161A22] my-4" />

                  {/* تفاصيل إضافية */}
                  <div className="space-y-4">
                    <div className="text-right">
                      <h3 className="text-sm font-bold text-white">تفاصيل إضافية</h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        اختر ما يظهر في ملفك الشخصي واستطلع اهتمامات أخرى
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggle("totalEarnings")}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            toggles.totalEarnings ? "bg-[#FF6B00]" : "bg-[#252B38]"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                              toggles.totalEarnings ? "right-6" : "right-1"
                            }`}
                          />
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm font-medium text-white">
                            إجمالي الأرباح
                          </span>
                          <div className="w-8 h-8 rounded-full bg-[#141822] border border-[#202634] text-[#8E95A2] flex items-center justify-center">
                            <FiDollarSign size={15} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggle("location")}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            toggles.location ? "bg-[#FF6B00]" : "bg-[#252B38]"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                              toggles.location ? "right-6" : "right-1"
                            }`}
                          />
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm font-medium text-white">
                            الموقع
                          </span>
                          <div className="w-8 h-8 rounded-full bg-[#141822] border border-[#202634] text-[#8E95A2] flex items-center justify-center">
                            <FiMapPin size={15} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggle("ownedCommunities")}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            toggles.ownedCommunities ? "bg-[#FF6B00]" : "bg-[#252B38]"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                              toggles.ownedCommunities ? "right-6" : "right-1"
                            }`}
                          />
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm font-medium text-white">
                            المجتمعات المملوكة
                          </span>
                          <div className="w-8 h-8 rounded-full bg-[#141822] border border-[#202634] text-[#8E95A2] flex items-center justify-center">
                            <RiBuilding4Line size={15} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggle("joinedCommunities")}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            toggles.joinedCommunities ? "bg-[#FF6B00]" : "bg-[#252B38]"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                              toggles.joinedCommunities ? "right-6" : "right-1"
                            }`}
                          />
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm font-medium text-white">
                            المجتمعات المنضم إليها
                          </span>
                          <div className="w-8 h-8 rounded-full bg-[#141822] border border-[#202634] text-[#8E95A2] flex items-center justify-center">
                            <FiUsers size={15} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* أزرار الحفظ والإلغاء */}
                  <div className="pt-8 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      className="w-40 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FFA800] text-sm font-bold text-white shadow-lg shadow-[#FF6B00]/25 hover:shadow-[#FF6B00]/40 transition-all cursor-pointer text-center"
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      className="w-32 py-3 rounded-xl bg-transparent border border-[#262C38] text-sm font-semibold text-[#8E95A2] hover:text-white hover:bg-[#121620] transition-all cursor-pointer text-center"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                191: التوصيات والاهتمامات - مطابقة 100% للتصميم المطلوب
               ───────────────────────────────────────────────────────────── */}
            {activeTab === "interests" && (
              <div className="space-y-6">
                {/* 1. بانر التوصيات والاهتمامات الرئيسي */}
                <div className="bg-[#121620] border border-[#1F2634] rounded-2xl p-6 relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="space-y-1.5 flex-1">
                      <h2 className="text-xl font-bold text-white tracking-wide">
                        التوصيات والاهتمامات
                      </h2>
                      <p className="text-xs text-[#8E95A2] leading-relaxed max-w-2xl">
                        خصص مجالات اهتمامك وجمهورك المستهدف لنقدم لك حملات إعلانية مجزية ومرجحة شرعياً متوافقة تماماً مع أسلوب صناعة المحتوى الخاص بك، وحقق أقصى عائد لكل ألف مشاهدة مؤهلة.
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        type="button"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FFA800] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#FF6B00]/20 hover:shadow-[#FF6B00]/35 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <TbRefresh size={15} />
                        <span>إضافة وإدارة التوصيات</span>
                      </button>
                      <button
                        type="button"
                        className="text-xs text-[#8E95A2] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer px-1"
                      >
                        <FiRotateCcw size={12} />
                        <span>إعادة الضبط</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. عنوان ووصف نظام الإدارة والتخصيص */}
                <div className="space-y-1 pr-1">
                  <h3 className="text-base font-bold text-white">
                    نظام إدارة وتخصيص الاهتمامات والتوصيات
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    حدد بدقة معايير خوارزمية المطابقة التلقائية لتصفية الحملات الإعلانية المتوافقة شرعياً وضبط عوائد المشاهدات المقبولة ونطاق جمهورك المستهدف بأعلى ربحية ممكنة.
                  </p>
                </div>

                {/* 3. تصنيفات المحتوى الإبداعي (Section 1) */}
                <div className="bg-[#0E1118] border border-[#191F2B] rounded-2xl p-5 space-y-4">
                  {/* رأس القسم */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#181E2A]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/15 text-[#2DD4BF] flex items-center justify-center">
                        <FiCompass size={17} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          1. تصنيفات المحتوى الإبداعي
                        </h4>
                        <p className="text-[11px] text-[#64748B]">
                          حدد أولويات اهتماماتك وضبط وزن كل تصنيف في تغذية الخوارزمية لجلب العوائد الأعلى
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F5B833]/15 text-[#F5B833] border border-[#F5B833]/30 font-semibold">
                        أولوية كاملة (X2)
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 font-semibold">
                        • 7 تصنيفات مفعلة
                      </span>
                    </div>
                  </div>

                  {/* شبكة البطاقات 3x3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {niches.map((niche) => {
                      const Icon = niche.icon;
                      return (
                        <div
                          key={niche.id}
                          onClick={() => toggleNiche(niche.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[105px] relative ${
                            niche.active
                              ? niche.priority
                                ? "bg-[#141822] border-[#F5B833] shadow-md shadow-[#F5B833]/5"
                                : "bg-[#121620] border-[#2A3446]"
                              : "bg-[#0C0E14] border-[#161B24] opacity-50 hover:opacity-80"
                          }`}
                        >
                          {/* الصف العلوي للبطاقة */}
                          <div className="flex items-start justify-between gap-2">
                            {/* أيقونة التصنيف والعنوان */}
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${niche.iconBg}`}
                              >
                                <Icon size={18} />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-white leading-tight">
                                  {niche.title}
                                </h5>
                                <span className={`text-[10px] block mt-0.5 ${niche.statusColor}`}>
                                  {niche.status}
                                </span>
                              </div>
                            </div>

                            {/* دائرة التحقق أو الإضافة */}
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                                niche.active
                                  ? niche.priority
                                    ? "bg-[#F5B833] text-black font-bold"
                                    : "bg-[#2DD4BF] text-black font-bold"
                                  : "border border-[#333E52] text-transparent"
                              }`}
                            >
                              {niche.active ? (
                                <FiCheck size={11} className="stroke-[3]" />
                              ) : (
                                <FiPlus size={10} className="text-[#64748B]" />
                              )}
                            </div>
                          </div>

                          {/* الصف السفلي: وزن التوصية ومؤشر النسبة */}
                          <div className="mt-3 pt-2 border-t border-[#1B212D] flex items-center justify-between text-[10px]">
                            <span className="text-[#8E95A2] font-medium">وزن التوصية</span>
                            <div className="flex-1 mx-2.5 h-1.5 rounded-full bg-[#1A202C] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  niche.priority ? "bg-[#F5B833]" : "bg-[#FF6B00]"
                                }`}
                                style={{ width: `${niche.weight}%` }}
                              />
                            </div>
                            <span className="font-mono text-white font-bold">
                              {niche.weight}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* بطاقة إضافة تخصص إبداعي مخصص */}
                  <div className="border border-dashed border-[#232B3A] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0B0D12]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF] flex items-center justify-center flex-shrink-0">
                        <FiEdit3 size={16} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">
                          إضافة تخصص إبداعي مخصص
                        </h5>
                        <p className="text-[11px] text-[#64748B]">
                          اكتب تخصصاً جديداً أو مجالات صناعية تريد عروض رعاية محددة لها
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="مثال: تطبيقات إنتاجية، عتاد"
                        value={customNicheInput}
                        onChange={(e) => setCustomNicheInput(e.target.value)}
                        className="bg-[#121620] border border-[#1E2532] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#2DD4BF] flex-1 sm:w-56"
                      />
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-[#2DD4BF] text-black font-bold text-xs hover:bg-[#25BFA8] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        + إضافة التصنيف
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. ركائز التوصيات الذكية الدقيقة (Section 2 - 3 أعمدة) */}
                <div className="bg-[#0E1118] border border-[#191F2B] rounded-2xl p-5 space-y-4">
                  {/* رأس القسم */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#181E2A]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/15 text-[#2DD4BF] flex items-center justify-center">
                        <FiSliders size={17} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          2. ركائز التوصيات الذكية الدقيقة
                        </h4>
                        <p className="text-[11px] text-[#64748B]">
                          ضبط حساسية الفلترة العالية، الحجم التعاقدي، وشروط التوافق الشرعي
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* الأعمدة الثلاثة المتجاورة */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* 1. التوافق الشرعي (يمين) */}
                    <div className="bg-[#121620] border border-[#1E2532] rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IoShieldCheckmarkOutline size={17} className="text-[#2DD4BF]" />
                          <span className="text-xs font-bold text-white">التوافق الشرعي</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 font-semibold">
                          100% صارم
                        </span>
                      </div>

                      <p className="text-[11px] text-[#8E95A2] leading-relaxed">
                        استبعاد تلقائي لأي حملة تتضمن محاذير شرعية أو شبهات تسويقية دون أي تنازل.
                      </p>

                      <div className="pt-2 border-t border-[#1B212D]">
                        <span className="text-[10px] text-[#2DD4BF] font-medium block mb-1">
                          الترشيح المعتمد: تدقيق شرعي مسبق
                        </span>
                        <div className="h-1.5 w-full bg-[#1A202C] rounded-full overflow-hidden">
                          <div className="h-full bg-[#2DD4BF] rounded-full w-full" />
                        </div>
                      </div>
                    </div>

                    {/* 2. الحد الأدنى لـ CPM (وسط) */}
                    <div className="bg-[#121620] border border-[#1E2532] rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiDollarSign size={17} className="text-[#F5B833]" />
                          <span className="text-xs font-bold text-white">الحد الأدنى لـ CPM</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F5B833]/15 text-[#F5B833] border border-[#F5B833]/30 font-semibold font-mono">
                          $1.20 / 1k
                        </span>
                      </div>

                      <p className="text-[11px] text-[#8E95A2] leading-relaxed">
                        حجب عروض الترويج التي تقل عوائدها عن 1,000 مشاهدة عينية عن الحد المفضل لديك.
                      </p>

                      <div className="pt-2 border-t border-[#1B212D]">
                        <div className="flex justify-between text-[10px] font-mono text-[#8E95A2] mb-1">
                          <span>$1.20 (اقتصادي)</span>
                          <span className="text-[#F5B833]">$2.50 (استراتيجي)</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1A202C] rounded-full overflow-hidden">
                          <div className="h-full bg-[#F5B833] rounded-full w-2/3" />
                        </div>
                      </div>
                    </div>

                    {/* 3. ميزانية الحملات (يسار) */}
                    <div className="bg-[#121620] border border-[#1E2532] rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiCreditCard size={17} className="text-[#2DD4BF]" />
                          <span className="text-xs font-bold text-white">ميزانية الحملات</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => setSelectedBudgetPill("small")}
                          className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            selectedBudgetPill === "small"
                              ? "bg-[#2DD4BF] text-black font-bold"
                              : "bg-[#181D26] text-[#8E95A2]"
                          }`}
                        >
                          صغيرة $50
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBudgetPill("medium")}
                          className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            selectedBudgetPill === "medium"
                              ? "bg-[#2DD4BF] text-black font-bold"
                              : "bg-[#181D26] text-[#8E95A2]"
                          }`}
                        >
                          متوسطة $50-250
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBudgetPill("large")}
                          className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                            selectedBudgetPill === "large"
                              ? "bg-[#FF6B00] text-white font-bold shadow-md shadow-[#FF6B00]/20"
                              : "bg-[#181D26] text-[#8E95A2]"
                          }`}
                        >
                          كبيرة $250+
                        </button>
                      </div>

                      <div className="pt-2 border-t border-[#1B212D]">
                        <p className="text-[10px] text-[#64748B] leading-tight">
                          التركيز على الحملات ذات الميزانيات العالية لضمان استقرار العائد.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. العمودان السفليان: التوزيع الجغرافي (يمين) + منصات النشر وصيغ الكليبينج (يسار) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* العمود الأيمن: التوزيع الجغرافي والجمهور المستهدف (7 أعمدة) */}
                  <div className="lg:col-span-7 bg-[#0E1118] border border-[#191F2B] rounded-2xl p-5 space-y-3.5">
                    <div className="flex items-center gap-3 pb-2 border-b border-[#181E2A]">
                      <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/15 text-[#2DD4BF] flex items-center justify-center">
                        <FiGlobe size={17} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          3. التوزيع الجغرافي والجمهور المستهدف
                        </h4>
                        <p className="text-[11px] text-[#64748B]">
                          التركيز الجغرافي لقوة وصول المقاطع والمتابعين
                        </p>
                      </div>
                    </div>

                    {/* الصفوف الأربعة للدول */}
                    <div className="space-y-2.5">
                      {/* السعودية */}
                      <div
                        onClick={() => setGeoActive({ ...geoActive, sa: !geoActive.sa })}
                        className="p-3 rounded-xl bg-[#121620] border border-[#1F2634] flex items-center justify-between cursor-pointer hover:border-[#2DD4BF]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#18202C] border border-[#242E3D] text-[11px] font-bold text-white flex items-center justify-center font-mono">
                            SA
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">
                              المملكة العربية السعودية
                            </h5>
                            <p className="text-[10px] text-[#64748B]">
                              الرياض، جدة، المنطقة الشرقية، القصيم
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-[#1A202C] overflow-hidden">
                            <div className="h-full bg-[#2DD4BF] rounded-full w-[55%]" />
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 font-semibold font-mono">
                            55% نشط
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              geoActive.sa ? "bg-[#2DD4BF] text-black font-bold" : "border border-[#333E52]"
                            }`}
                          >
                            {geoActive.sa && <FiCheck size={11} className="stroke-[3]" />}
                          </div>
                        </div>
                      </div>

                      {/* الإمارات */}
                      <div
                        onClick={() => setGeoActive({ ...geoActive, ae: !geoActive.ae })}
                        className="p-3 rounded-xl bg-[#121620] border border-[#F5B833]/40 flex items-center justify-between cursor-pointer shadow-sm shadow-[#F5B833]/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#18202C] border border-[#242E3D] text-[11px] font-bold text-white flex items-center justify-center font-mono">
                            AE
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">
                              الإمارات العربية المتحدة
                            </h5>
                            <p className="text-[10px] text-[#64748B]">
                              دبي، أبوظبي، الشارقة
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-[#1A202C] overflow-hidden">
                            <div className="h-full bg-[#F5B833] rounded-full w-[35%]" />
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F5B833]/15 text-[#F5B833] border border-[#F5B833]/30 font-semibold font-mono">
                            35% نشط
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              geoActive.ae ? "bg-[#F5B833] text-black font-bold" : "border border-[#333E52]"
                            }`}
                          >
                            {geoActive.ae && <FiCheck size={11} className="stroke-[3]" />}
                          </div>
                        </div>
                      </div>

                      {/* الكويت وقطر والبحرين */}
                      <div
                        onClick={() => setGeoActive({ ...geoActive, kw: !geoActive.kw })}
                        className="p-3 rounded-xl bg-[#121620] border border-[#1F2634] flex items-center justify-between cursor-pointer hover:border-[#2A3546] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#18202C] border border-[#242E3D] text-[11px] font-bold text-white flex items-center justify-center font-mono">
                            KW
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">
                              الكويت وقطر والبحرين
                            </h5>
                            <p className="text-[10px] text-[#64748B]">
                              عواصم الخليج والمجتمعات المصرفية
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-[#1A202C] overflow-hidden">
                            <div className="h-full bg-[#2DD4BF] rounded-full w-[10%]" />
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#1E2532] text-[#8E95A2] font-semibold font-mono">
                            10% نشط
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              geoActive.kw ? "bg-[#2DD4BF] text-black font-bold" : "border border-[#333E52]"
                            }`}
                          >
                            {geoActive.kw && <FiCheck size={11} className="stroke-[3]" />}
                          </div>
                        </div>
                      </div>

                      {/* مصر وباقي دول العالم العربي */}
                      <div className="p-3 rounded-xl bg-[#0F121A] border border-[#19202C] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#18202C] text-lg flex items-center justify-center">
                            🌍
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">
                              مصر وباقي دول العالم العربي
                            </h5>
                            <p className="text-[10px] text-[#64748B]">
                              جمهور متوسع للمحتوى الفيروسي
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-[#161D27] border border-[#263140] text-xs font-medium text-[#8E95A2] hover:text-white transition-colors cursor-pointer"
                        >
                          + تفعيل الإقليم
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* العمود الأيسر: منصات النشر وصيغ الكليبينج (5 أعمدة) */}
                  <div className="lg:col-span-5 bg-[#0E1118] border border-[#191F2B] rounded-2xl p-5 space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[#181E2A]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/15 text-[#2DD4BF] flex items-center justify-center">
                          <FiSmartphone size={17} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            4. منصات النشر وضع الكليبيتنك
                          </h4>
                          <p className="text-[11px] text-[#64748B]">
                            القنوات المعتمدة التي تنشر مقاطعك من خلالها
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#2DD4BF]/15 text-[#2DD4BF] font-semibold">
                        4 صيغ فعالة
                      </span>
                    </div>

                    {/* شبكة المنصات 2x2 */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Instagram Reels */}
                      <div
                        onClick={() => setPlatforms({ ...platforms, instagram: !platforms.instagram })}
                        className="p-3 rounded-xl bg-[#121620] border border-[#1E2532] flex items-center justify-between cursor-pointer hover:border-[#2DD4BF]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white flex items-center justify-center">
                            <SiInstagram size={14} />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">Instagram Reels</h5>
                            <p className="text-[10px] text-[#64748B]">أعلى عائد تفاعلي مباشر</p>
                          </div>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#2DD4BF] text-black flex items-center justify-center text-[9px] font-bold">
                          <FiCheck size={10} className="stroke-[3]" />
                        </div>
                      </div>

                      {/* TikTok Shorts */}
                      <div
                        onClick={() => setPlatforms({ ...platforms, tiktok: !platforms.tiktok })}
                        className="p-3 rounded-xl bg-[#121620] border border-[#1E2532] flex items-center justify-between cursor-pointer hover:border-[#2DD4BF]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                            <SiTiktok size={14} />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">TikTok Shorts</h5>
                            <p className="text-[10px] text-[#64748B]">انتشار فيروسي سريع</p>
                          </div>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#2DD4BF] text-black flex items-center justify-center text-[9px] font-bold">
                          <FiCheck size={10} className="stroke-[3]" />
                        </div>
                      </div>

                      {/* YouTube Shorts */}
                      <div
                        onClick={() => setPlatforms({ ...platforms, youtube: !platforms.youtube })}
                        className="p-3 rounded-xl bg-[#121620] border border-[#1E2532] flex items-center justify-between cursor-pointer hover:border-[#2DD4BF]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#FF0000]/15 text-[#FF0000] flex items-center justify-center">
                            <SiYoutube size={15} />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">YouTube Shorts</h5>
                            <p className="text-[10px] text-[#64748B]">ثبات مشاهدات طويل المدى</p>
                          </div>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#2DD4BF] text-black flex items-center justify-center text-[9px] font-bold">
                          <FiCheck size={10} className="stroke-[3]" />
                        </div>
                      </div>

                      {/* X (Twitter) */}
                      <div
                        onClick={() => setPlatforms({ ...platforms, x: !platforms.x })}
                        className="p-3 rounded-xl bg-[#121620] border border-[#1E2532] flex items-center justify-between cursor-pointer hover:border-[#2DD4BF]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center">
                            <SiX size={13} />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">X</h5>
                            <p className="text-[10px] text-[#64748B]">ستوريات ومجتمعات مركزة</p>
                          </div>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-[#2DD4BF] text-black flex items-center justify-center text-[9px] font-bold">
                          <FiCheck size={10} className="stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    {/* خيار حلقات بودكاست كاملة في الأسفل */}
                    <div className="pt-2 border-t border-[#181E2A] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#8E95A2]">
                        <BiPodcast size={16} className="text-[#64748B]" />
                        <span>حلقات بودكاست كاملة مع القصص</span>
                      </div>
                      <span className="text-[10px] text-[#475569]">اختياري</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

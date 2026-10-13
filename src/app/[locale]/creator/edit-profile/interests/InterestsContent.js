"use client";

import { useState } from "react";
import {
  FiCompass,
  FiSliders,
  FiGlobe,
  FiSmartphone,
  FiRotateCcw,
  FiCheck,
  FiPlus,
  FiEdit3,
  FiDollarSign,
  FiCreditCard,
} from "react-icons/fi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { SiInstagram, SiTiktok, SiYoutube, SiX } from "react-icons/si";
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

export default function InterestsContent() {
  const [niches, setNiches] = useState([
    {
      id: "podcasts",
      title: "تسجيل البودكاست واللقاءات",
      status: "أولوية استهداف قصوى",
      statusColor: "text-[#F5B833]",
      weight: 98,
      active: true,
      priority: true,
      icon: TbMicrophone,
      iconBg: "bg-[#F5B833]/15 text-[#F5B833]",
    },
    {
      id: "finance",
      title: "فلك واستثمار مالي",
      status: "أولوية استهداف قصوى",
      statusColor: "text-[#F5B833]",
      weight: 92,
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
      weight: 87,
      active: true,
      priority: false,
      icon: TbCpu,
      iconBg: "bg-[#2DD4BF]/15 text-[#2DD4BF]",
    },
    {
      id: "faith",
      title: "محتوى إيماني وخواطر قيمية",
      status: "مفعل - تدفق شعبي عالي",
      statusColor: "text-[#2DD4BF]",
      weight: 99,
      active: true,
      priority: false,
      icon: TbMoonStars,
      iconBg: "bg-[#2DD4BF]/15 text-[#2DD4BF]",
    },
    {
      id: "fashion",
      title: "أزياء وموضة محتشمة",
      status: "مفعل - شركات معتمدة",
      statusColor: "text-[#2DD4BF]",
      weight: 85,
      active: true,
      priority: false,
      icon: TbHanger,
      iconBg: "bg-[#2DD4BF]/15 text-[#2DD4BF]",
    },
    {
      id: "documentary",
      title: "وثائقيات وتاريخ وحضارة",
      status: "مفعل - نجاح مضي",
      statusColor: "text-[#2DD4BF]",
      weight: 90,
      active: true,
      priority: false,
      icon: TbBook,
      iconBg: "bg-[#2DD4BF]/15 text-[#2DD4BF]",
    },
    {
      id: "health",
      title: "تلخيص كتب وتطوير ذات",
      status: "مفعل - جمهورية 25",
      statusColor: "text-[#2DD4BF]",
      weight: 78,
      active: true,
      priority: false,
      icon: TbLeaf,
      iconBg: "bg-[#2DD4BF]/15 text-[#2DD4BF]",
    },
    {
      id: "nutrition",
      title: "تغذية وطب شمولي ونمط حياة",
      status: "غير مفعل - انقر للإضافة",
      statusColor: "text-[#64748B]",
      weight: 65,
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
  const [selectedBudgetPill, setSelectedBudgetPill] = useState("large");

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

  const activeCount = niches.filter((n) => n.active).length;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-3 py-6 sm:px-5 sm:py-8 lg:px-8 text-white font-tajawal">
      {/* 1. بانر التوصيات والاهتمامات الرئيسي */}
      <div className="bg-[#121620] border border-[#1F2634] rounded-2xl p-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1.5 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              التوصيات والاهتمامات
            </h1>
            <p className="text-xs sm:text-sm text-[#8E95A2] leading-relaxed max-w-2xl">
              خصص مجالات اهتمامك وجمهورك المستهدف لنقدم لك حملات إعلانية مجزية ومرجحة شرعياً متوافقة تماماً مع أسلوب صناعة المحتوى الخاص بك، وحقق أقصى عائد لكل ألف مشاهدة مؤهلة.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FFA800] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#FF6B00]/20 hover:shadow-[#FF6B00]/35 transition-all cursor-pointer whitespace-nowrap"
            >
              <TbRefresh size={15} />
              <span>حفظ ومزامنة التوصيات</span>
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
        <h2 className="text-base sm:text-lg font-bold text-white">
          نظام إدارة وتخصيص الاهتمامات والتوصيات
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
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
              <h3 className="text-sm font-bold text-white">
                1. تصنيفات المحتوى الإبداعي
              </h3>
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
              • {activeCount} تصنيفات مفعلة
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
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${niche.iconBg}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {niche.title}
                      </h4>
                      <span className={`text-[10px] block mt-0.5 ${niche.statusColor}`}>
                        {niche.status}
                      </span>
                    </div>
                  </div>

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
              <h4 className="text-xs font-bold text-white">
                إضافة تخصص إبداعي مخصص
              </h4>
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
              <h3 className="text-sm font-bold text-white">
                2. ركائز التوصيات الذكية الدقيقة
              </h3>
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
              <h3 className="text-sm font-bold text-white">
                3. التوزيع الجغرافي والجمهور المستهدف
              </h3>
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
                  <h4 className="text-xs font-bold text-white">
                    المملكة العربية السعودية
                  </h4>
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
                  <h4 className="text-xs font-bold text-white">
                    الإمارات العربية المتحدة
                  </h4>
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
                  <h4 className="text-xs font-bold text-white">
                    الكويت وقطر والبحرين
                  </h4>
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
                  <h4 className="text-xs font-bold text-white">
                    مصر وباقي دول العالم العربي
                  </h4>
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
                <h3 className="text-sm font-bold text-white">
                  4. منصات النشر وصيغ الكليبينج
                </h3>
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
                  <h4 className="text-xs font-bold text-white">Instagram Reels</h4>
                  <p className="text-[10px] text-[#64748B]">أعلى عائد تفاعلي</p>
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
                  <h4 className="text-xs font-bold text-white">TikTok Shorts</h4>
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
                  <h4 className="text-xs font-bold text-white">YouTube Shorts</h4>
                  <p className="text-[10px] text-[#64748B]">ثبات مشاهدات طويل</p>
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
                  <h4 className="text-xs font-bold text-white">X</h4>
                  <p className="text-[10px] text-[#64748B]">مجتمعات مركزة</p>
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
  );
}

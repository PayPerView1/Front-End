"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  X,
  Info,
  Bell,
  TrendingUp,
  Shield,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Check,
} from "lucide-react";
import {
  MdOutlineDashboard,
  MdBarChart,
  MdVideoLibrary,
  MdAddBox,
  MdOutlineDrafts,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";
import { SiTiktok } from "react-icons/si";
import { BsStars } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";

export default function ClipApprovalView({ locale = "ar" }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  const handleConfirmApproval = () => {
    setIsApproved(true);
    setIsModalOpen(false);
    toast.success("تم اعتماد المقطع بنجاح! بدأ احتساب المشاهدات وخصم 78.10 ر.س", {
      duration: 5000,
      position: "top-center",
      style: {
        background: "#161B19",
        color: "#94D3C1",
        border: "1px solid #232B28",
        fontSize: "13px",
      },
    });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0A0D0C] text-[#F3F6F5] font-sans flex flex-row relative overflow-x-hidden selection:bg-[#94D3C1]/20 selection:text-[#94D3C1]"
    >
      <Toaster />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-[#0D1110]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">حملة:</span>
            <span className="text-xs font-semibold text-white px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">
              CAM-2026-88 • العطور الشرقية الملكية
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sparkle */}
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#94D3C1] transition-colors">
              <BsStars size={16} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Bell size={16} />
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#0A0D0C]">
                12
              </span>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 pr-2 border-r border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FE6B00] to-[#E9C349] p-0.5">
                <div className="w-full h-full bg-[#121615] rounded-full flex items-center justify-center text-xs font-bold text-white">
                  م
                </div>
              </div>
              <span className="text-xs font-medium text-gray-300 hidden sm:inline">شركة الأصالة</span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumb & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#94D3C1] mb-1">
                <span>إدارة المقاطع</span>
                <span>/</span>
                <span className="text-gray-400">مراجعة وتدقيق المقطع #SUB-8812</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                مراجعة وتدقيق تفاصيل المقطع المبتكر
              </h1>
              <p className="text-xs text-[#8A9892] mt-1">
                الحملة 88-CAM-2026 • المقطع SUB-8812# • صانع المحتوى: أحمد الشمري
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FA6200] hover:bg-[#E55700] text-white shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={15} />
                تأكيد واعتماد المقطع
              </button>
            </div>
          </div>

          {/* Grid Layout: Video Preview + Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Details Panel (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Creator Card */}
              <div className="bg-[#121615] border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
                      أش
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white">أحمد الشمري</h3>
                        <BadgeCheck size={16} className="text-[#94D3C1]" />
                      </div>
                      <p className="text-xs text-gray-400">@ahmed_creator • منشئ موثق</p>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-[#94D3C1]/10 text-[#94D3C1] border border-[#94D3C1]/20 font-medium">
                    معدل الأداء: 98%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 block mb-1">المتابعون</span>
                    <strong className="text-sm font-bold text-white">142K</strong>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 block mb-1">متوسط المشاهدات</span>
                    <strong className="text-sm font-bold text-[#94D3C1]">28.5K</strong>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 block mb-1">نسبة التفاعل</span>
                    <strong className="text-sm font-bold text-[#E9C349]">7.4%</strong>
                  </div>
                </div>
              </div>

              {/* Compliance Verification Card */}
              <div className="bg-[#121615] border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} className="text-[#94D3C1]" />
                  نتائج الفحص والتدقيق الآلي (AI Compliance)
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-gray-300">مطابقة الهوية البصرية وإرشادات الحملة</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check size={14} /> 100% متطابق
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-gray-300">حقوق الصوت والموسيقى المستخدمة</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check size={14} /> مرخصة تجارياً
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-gray-300">رمز التتبع ورابط الحملة المعتمد</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check size={14} /> مدمج وموثق (SUB-8812)
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Budget Summary */}
              <div className="bg-[#121615] border border-white/5 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">عائد المشاهدات (CPM) المخصص</span>
                  <span className="text-xs font-bold text-white">$4.80 لكل 1,000 مشاهدة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">رصيد البداية والاعتماد الفوري</span>
                  <span className="text-xs font-bold text-[#E9C349]">78.10 ر.س</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-xs font-bold text-white">حالة المقطع الحالية</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      isApproved
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-[#E9C349]/15 text-[#E9C349] border border-[#E9C349]/25"
                    }`}
                  >
                    {isApproved ? "معتمد ونشط (Accepted - Live)" : "بانتظار قرار المعلن"}
                  </span>
                </div>
              </div>
            </div>

            {/* Video Player Mockup (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] aspect-[9/16] rounded-3xl bg-[#161B19] border-2 border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#10241E] via-[#0D1815] to-[#080D0B] z-0" />
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_40%,#94D3C1_0%,transparent_65%)]" />

                {/* Top overlay bar */}
                <div className="relative z-10 flex items-center justify-between text-white/80">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1">
                    <SiTiktok size={11} /> TikTok UGC
                  </span>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>

                {/* Center play/pause trigger */}
                <div className="relative z-10 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-105 transition-all shadow-xl"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5 text-[#94D3C1]" />}
                  </button>
                </div>

                {/* Bottom info & controls */}
                <div className="relative z-10 space-y-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent -mx-4 -mb-4 p-4 pt-8">
                  <div>
                    <h4 className="text-xs font-bold text-white">تجربة العطر الشرقي الفاخر ✨</h4>
                    <p className="text-[11px] text-gray-300 mt-1 line-clamp-2">
                      مقطع إعلاني ترويجي يستعرض ثبات العطر وتصميمه الراقي لجمهور الحملة.
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[#94D3C1] w-2/5 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>00:18</span>
                      <span>00:45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar (Right side in RTL) */}
      <aside className="w-64 border-l border-white/5 bg-[#0C100F] hidden md:flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FE6B00] to-[#E9C349] p-0.5 flex items-center justify-center shadow-md shadow-orange-500/20">
              <span className="text-black font-extrabold text-sm">▶</span>
            </div>
            <span className="font-bold text-base tracking-tight text-white">Pay Per View</span>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <Link
              href="/ar/advertiser/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors"
            >
              <MdOutlineDashboard size={18} />
              لوحة التحكم الرئيسية
            </Link>

            <Link
              href="/ar/advertiser/analytics"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white/[0.06] text-white border border-white/10"
            >
              <MdBarChart size={18} className="text-[#94D3C1]" />
              التقارير والتحليلات
            </Link>

            <Link
              href="/ar/advertiser/clips"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors"
            >
              <MdVideoLibrary size={18} />
              إدارة المقاطع
            </Link>

            <Link
              href="/ar/advertiser/create-campaign"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors"
            >
              <MdAddBox size={18} />
              إنشاء حملة جديدة
            </Link>

            <Link
              href="/ar/advertiser/drafts"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors"
            >
              <MdOutlineDrafts size={18} />
              المسودات
            </Link>

            <Link
              href="/ar/advertiser/wallet"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors"
            >
              <MdOutlineAccountBalanceWallet size={18} />
              الميزانية والمدفوعات
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5 text-[11px] text-gray-500 text-center">
          PayPerView v2.4 • إصدار الاعتماد
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* EXACT PIXEL-PERFECT MODAL: تأكيد اعتماد وقبول المقطع الإعلاني (MacBook Pro 214) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div
            dir="rtl"
            className="w-full max-w-[620px] bg-[#161B19] border border-[#27322F] rounded-[22px] shadow-2xl p-6 sm:p-7 relative text-right animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header: Title + Badge Icon on the Right, Close button on the Left */}
            <div className="flex items-start justify-between mb-5">
              {/* Right: Badge Icon & Title */}
              <div className="flex items-center gap-3.5">
                {/* 12-lobed BadgeCheck icon in squircle with yellow dot */}
                <div className="relative shrink-0">
                  <div className="w-[52px] h-[52px] rounded-[18px] bg-[#202725] border border-[#2D3633] flex items-center justify-center shadow-lg shadow-black/40">
                    <BadgeCheck size={28} className="text-[#94D3C1]" strokeWidth={1.8} />
                  </div>
                  {/* Yellow status dot */}
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F5C242] border-2 border-[#161B19] shadow-sm" />
                </div>

                {/* Text */}
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                    تأكيد اعتماد وقبول المقطع الإعلاني
                  </h2>
                  <p className="text-xs text-[#8E9B96] mt-0.5 font-medium tracking-wide">
                    الحملة #CAM-2026-88 • المقطع #SUB-8812
                  </p>
                </div>
              </div>

              {/* Left: Close button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-[#202624] hover:bg-[#28302D] border border-[#2C3532] text-gray-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            {/* Info Notice Box */}
            <div className="bg-[#0E211C] border border-[#183B32] rounded-xl p-3.5 flex items-center gap-3 mb-4">
              <p className="flex-1 text-xs text-[#B7DCD2] leading-relaxed font-normal text-right">
                هل أنت متأكد من رغبتك في اعتماد هذا المقطع؟ سيبدأ احتساب المشاهدات الموثقة فوراً وتفعيل الرابط في نظام الحملة النشطة.
              </p>
              <Info size={19} className="text-[#94D3C1] shrink-0" strokeWidth={1.8} />
            </div>

            {/* Subheading */}
            <div className="text-[11px] font-medium text-[#7A8983] mb-2.5">
              الإجراءات التلقائية المترتبة على الاعتماد:
            </div>

            {/* Two-card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Card 1 (Right): حالة المقطع بعد التأكيد */}
              <div className="bg-[#171D1B] border border-[#242C2A] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-[#7A8983] mb-1">
                    حالة المقطع بعد التأكيد
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#94D3C1]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                    <span>مقبول (Accepted) - نشط</span>
                  </div>
                </div>

                {/* Switch indicator */}
                <div className="w-9 h-5 bg-[#252E2B] border border-[#34403C] rounded-full p-0.5 flex items-center justify-end">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                </div>
              </div>

              {/* Card 2 (Left): تتبع المشاهدات تلقائياً */}
              <div className="bg-[#171D1B] border border-[#242C2A] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-[#7A8983] mb-1">
                    تتبع المشاهدات تلقائياً
                  </span>
                  <strong className="text-xs font-semibold text-white block">
                    بدء عداد المشاهدات الموثقة
                  </strong>
                </div>

                <div className="w-9 h-9 rounded-xl bg-[#202725] border border-[#2B3532] flex items-center justify-center text-[#94D3C1] shrink-0">
                  <TrendingUp size={16} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Card 3: إشعار صانع المحتوى الفوري */}
            <div className="bg-[#171D1B] border border-[#242C2A] rounded-xl p-3.5 mb-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#202725] border border-[#2B3532] flex items-center justify-center text-[#94D3C1]">
                    <Bell size={15} strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-white">
                    إشعار صانع المحتوى الفوري
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-[#112C23] border border-[#1B4436] text-[#94D3C1] text-[10px] font-semibold">
                  تطبيق + بريد
                </span>
              </div>

              {/* Quote block */}
              <div className="bg-[#111614] border border-[#1D2321] rounded-lg py-2.5 px-4 text-center text-xs text-[#B5C2BE] font-medium">
                « تم قبول مقطعك الإعلاني بنجاح! بدأ احتساب المشاهدات »
              </div>
            </div>

            {/* Footer Buttons: Orange Confirm on Left, Dark Cancel on Right */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
              {/* Confirm Button (Orange, Left in RTL) */}
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="flex-1 py-3 px-5 rounded-xl text-xs font-bold text-white bg-[#FA6200] hover:bg-[#E55700] shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} strokeWidth={2.2} />
                <span>تأكيد الاعتماد وبدء احتساب المشاهدات (صرف 78.10 ر.س)</span>
              </button>

              {/* Cancel Button (Dark Grey, Right in RTL) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-3 px-5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-[#252C2A] hover:bg-[#2C3432] border border-[#333C3A] transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <span>إلغاء التراجع والعودة للمعاينة</span>
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

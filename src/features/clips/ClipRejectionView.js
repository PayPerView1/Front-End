"use client";

import { useState } from "react";
import Link from "next/link";
import {
  XCircle,
  CheckCircle2,
  X,
  Info,
  FileText,
  Send,
  Shield,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Check,
  Bell,
  BadgeCheck,
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

const REJECTION_REASONS = [
  {
    id: "01",
    code: "كود 01",
    title: "مخالف لشروط الحملة أو الفكرة المطلوبة",
    desc: "المحتوى لم يلتزم بالفكرة الأساسية المحددة للحملة",
  },
  {
    id: "02",
    code: "كود 02",
    title: "جودة التصوير أو الصوت ضعيفة",
    desc: "صوت غير واضح أو تشويش أو دقة الفيديو منخفضة",
  },
  {
    id: "03",
    code: "كود 03",
    title: "يحتوي على محتوى غير مناسب أو مخالف للضوابط",
    desc: "مخالفة لسياسات المنصة الإعلانية أو الضوابط العامة",
  },
  {
    id: "04",
    code: "كود 04",
    title: "نسيان كود الخصم أو الهاشتاقات المطلوبة",
    desc: "كود الخصم غير ظاهر أو غير مقروء في الفيديو",
  },
  {
    id: "99",
    code: "كود 99",
    title: "سبب آخر (تكتبه بنفسك)",
    desc: "تحديد سبب مخصص غير مذكور في القائمة",
  },
];

export default function ClipRejectionView({ locale = "ar" }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedReason, setSelectedReason] = useState("02");
  const [noteText, setNoteText] = useState(
    "جودة تصوير القهوة ممتازة ولكن دقة الصوت منخفضة ويوجد تشويش واضح، كما يتعذر قراءة كود الخصم في الثواني الأخيرة."
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isRejected, setIsRejected] = useState(false);

  const handleConfirmRejection = () => {
    setIsRejected(true);
    setIsModalOpen(false);
    toast.error("تم رفض المقطع وإعادة مبلغ الضمان (750 ر.س) إلى رصيدك المتاح", {
      duration: 5000,
      position: "top-center",
      style: {
        background: "#161B19",
        color: "#F87171",
        border: "1px solid #3E181E",
        fontSize: "13px",
      },
    });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0A0D0C] text-[#F3F6F5] font-sans flex flex-row relative overflow-x-hidden selection:bg-[#E0262C]/20 selection:text-[#E0262C]"
    >
      <Toaster />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-[#0D1110]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">حملة:</span>
            <span className="text-xs font-semibold text-white px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">
              CAM-2026-88 • تجربة القهوة المختصة
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#94D3C1] transition-colors">
              <BsStars size={16} />
            </button>

            <div className="relative">
              <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Bell size={16} />
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#0A0D0C]">
                12
              </span>
            </div>

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
                المقطع SUB-8812# • صانع المحتوى: سعود بن ناصر
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E0262C] hover:bg-[#C01E24] text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
              >
                <XCircle size={15} />
                رفض المقطع وتحديد السبب
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
                      سن
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white">سعود بن ناصر</h3>
                        <BadgeCheck size={16} className="text-[#94D3C1]" />
                      </div>
                      <p className="text-xs text-gray-400">@saud_nasser • منشئ محتوى معتمد</p>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-[#E0262C]/10 text-[#F87171] border border-[#E0262C]/20 font-medium">
                    {isRejected ? "تم الرفض" : "بانتظار التدقيق"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 block mb-1">المتابعون</span>
                    <strong className="text-sm font-bold text-white">89K</strong>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 block mb-1">مبلغ الضمان</span>
                    <strong className="text-sm font-bold text-[#E9C349]">750 ر.س</strong>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 block mb-1">نسبة الإنجاز</span>
                    <strong className="text-sm font-bold text-[#94D3C1]">92%</strong>
                  </div>
                </div>
              </div>

              {/* Compliance Verification Card */}
              <div className="bg-[#121615] border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} className="text-[#94D3C1]" />
                  ملاحظات الفحص والتدقيق
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-gray-300">وضوح الصوت والموسيقى</span>
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <X size={14} /> تشويش ودقة منخفضة
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-gray-300">ظهور كود الخصم في الثواني الأخيرة</span>
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <X size={14} /> غير مقروء بوضوح
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player Mockup (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] aspect-[9/16] rounded-3xl bg-[#161B19] border-2 border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#241014] via-[#180D10] to-[#0D080A] z-0" />
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_40%,#E0262C_0%,transparent_65%)]" />

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
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5 text-white" />}
                  </button>
                </div>

                {/* Bottom info & controls */}
                <div className="relative z-10 space-y-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent -mx-4 -mb-4 p-4 pt-8">
                  <div>
                    <h4 className="text-xs font-bold text-white">تجربة القهوة المختصة ☕</h4>
                    <p className="text-[11px] text-gray-300 mt-1 line-clamp-2">
                      مراجعة منتج القهوة - بحاجة لإعادة تسجيل الصوت وتوضيح كود الخصم.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E0262C] w-1/3 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>00:12</span>
                      <span>00:38</span>
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
          <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FE6B00] to-[#E9C349] p-0.5 flex items-center justify-center shadow-md shadow-orange-500/20">
              <span className="text-black font-extrabold text-sm">▶</span>
            </div>
            <span className="font-bold text-base tracking-tight text-white">Pay Per View</span>
          </div>

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
          PayPerView v2.4 • إصدار الرفض
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* EXACT PIXEL-PERFECT MODAL: رفض المقطع وتحديد السبب (MacBook Pro 16_ - 215) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div
            dir="rtl"
            className="w-full max-w-[620px] bg-[#161B19] border border-[#27322F] rounded-[22px] shadow-2xl p-6 sm:p-7 relative text-right animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] overflow-y-auto"
          >
            {/* Header: Title + Red Icon on Right, Close button on Left */}
            <div className="flex items-start justify-between mb-5">
              {/* Right: Red Icon & Title */}
              <div className="flex items-center gap-3.5">
                <div className="w-[50px] h-[50px] rounded-[16px] bg-[#2A1418] border border-[#431B22] flex items-center justify-center text-[#E03137] shadow-lg shadow-black/40 shrink-0">
                  <XCircle size={26} strokeWidth={2} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                    رفض المقطع وتحديد السبب
                  </h2>
                  <p className="text-xs text-[#8E9B96] mt-0.5 font-medium tracking-wide">
                    المقطع #SUB-8812 • صانع المحتوى: سعود بن ناصر
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

            {/* Red-tinted Notice Banner */}
            <div className="bg-[#231215] border border-[#3E181E] rounded-xl p-3.5 flex items-center gap-3 mb-4">
              <p className="flex-1 text-xs text-[#D8B8BC] leading-relaxed font-normal text-right">
                عند الرفض: لن تُحتسب مشاهدات المقطع، ويُعاد مبلغ الضمان{" "}
                <span className="text-[#E9C349] font-bold">(750 ر.س)</span> فوراً لرصيدك المتاح.
              </p>
              <Info size={19} className="text-[#E03137] shrink-0" strokeWidth={1.8} />
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-[#94D3C1]" />
              <span className="text-xs font-semibold text-white">ما هو سبب رفض المقطع؟</span>
            </div>

            {/* Rejection Reasons List */}
            <div className="space-y-2.5 mb-4">
              {REJECTION_REASONS.map((reason) => {
                const isSelected = selectedReason === reason.id;
                return (
                  <div
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#1B1E1C] border border-[#5A381E] shadow-[0_0_12px_rgba(254,138,0,0.06)]"
                        : "bg-[#171D1B] border border-[#242C2A] hover:border-[#333E3A]"
                    }`}
                  >
                    {/* Right side: Radio button + Text */}
                    <div className="flex items-center gap-3">
                      {/* Radio Dot */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "border-[#FE8A00]" : "border-gray-500"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#FE8A00]" />
                        )}
                      </div>

                      {/* Text */}
                      <div>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isSelected ? "text-[#FE8A00]" : "text-white"
                          }`}
                        >
                          {reason.title}
                        </h4>
                        <p className="text-[11px] text-[#7A8983] mt-0.5">{reason.desc}</p>
                      </div>
                    </div>

                    {/* Left side: Code Badge */}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                        isSelected
                          ? "bg-[#2A1E14] border-[#4A321A] text-[#FE8A00]"
                          : "bg-[#202624] border-[#2D3633] text-gray-400"
                      }`}
                    >
                      {reason.code}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Note to Creator Textarea */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#8E9B96]">
                  <FileText size={15} className="text-[#94D3C1]" />
                  <span>توضيح لصانع المحتوى (اختياري ومفيد):</span>
                </div>
                <span className="text-[11px] font-mono text-[#7A8983]">
                  {noteText.length} / 500 حرف
                </span>
              </div>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="اكتب توضيحاً إضافياً للمنشئ لمساعدته على تحسين عمله القادم..."
                className="w-full bg-[#111614] border border-[#202724] focus:border-[#94D3C1]/50 rounded-xl p-3.5 text-xs text-gray-200 leading-relaxed outline-none resize-none transition-colors"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-[#7A8983]">
                <Send size={13} className="text-[#94D3C1] shrink-0" />
                <span>سيتم إرسال هذا التوضيح لصانع المحتوى ولن يتم احتساب أي مشاهدات للمقطع.</span>
              </div>
            </div>

            {/* Footer Action Buttons: Red Button on Right, Dark Cancel on Left */}
            <div className="flex items-center gap-3 pt-2">
              {/* Red Confirm Button */}
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="flex-1 py-3 px-6 rounded-xl text-xs font-bold text-white bg-[#E0262C] hover:bg-[#C01E24] shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                تأكيد رفض المقطع
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-3 px-6 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-[#202624] hover:bg-[#28302D] border border-[#2D3633] transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                إلغاء والعودة للمعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

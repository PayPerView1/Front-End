"use client";

import { useParams, useSearchParams, notFound } from "next/navigation";
import { getClipById } from "../../data";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "@/i18n/navigation";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiRefreshCw,
  FiZap,
  FiAlertTriangle,
  FiShield,
  FiRepeat,
  FiInfo,
  FiActivity,
  FiFileText,
} from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import { MdOutlineLightbulb } from "react-icons/md";
import ClipHeader from "./ClipHeader";
import StatusBanner from "./StatusBanner";
import DailyViewsChart from "./DailyViewsChart";
import InsightsRow from "./InsightsRow";
import PulseRings from "./PulseRings";

// ─── ألوان الثيمين ───────────────────────────────────────────
const darkTheme = {
  page: "bg-[#000000F2]",
  card: "border-black bg-[#191C1D]",
  sub: "bg-[#232729]",
  title: "text-white",
  muted: "text-gray-400",
  faint: "text-gray-500",
  mint: "text-[#94D3C1]",
  pill: "border-white/10 bg-[#191C1D] text-gray-200",
  chip: "bg-white/5 text-gray-300",
  num: "bg-white/10 text-white",
  gold: "text-[#E9C349] bg-[#E9C349]/10",
  green: "text-[#94D3C1] bg-[#94D3C1]/10",
  neutral: "text-gray-300 bg-white/5",
  stepActive: "border-[#E9C349]/40 bg-[#E9C349]/5",
  stepIdle: "border-black bg-[#232729]",
  stepDoneBox: "border-[#94D3C1]/30 bg-[#94D3C1]/5",
  stepDone: "bg-[#94D3C1] text-black",
  stepNow: "bg-[#E9C349]/20 text-[#E9C349]",
  stepPending: "bg-white/5 text-gray-500",
  btnGhost: "bg-white/10 text-white ",
  btnLink: "border-white/10 text-gray-300 ",
  handshake: "border-[#E9C349]/30 bg-[#E9C349]/10 text-[#E9C349]",
};

const lightTheme = {
  page: "bg-[#F4F6F6]",
  card: "border-[#E5E7E7] bg-white shadow-sm",
  sub: "bg-[#EEF3F2]",
  title: "text-[#1A1A1A]",
  muted: "text-[#666666]",
  faint: "text-[#8A8A8A]",
  mint: "text-[#2F9E83]",
  pill: "border-[#E5E7E7] bg-white text-[#333333]",
  chip: "bg-black/5 text-[#666666]",
  num: "bg-black/10 text-[#1A1A1A]",
  gold: "text-[#B7860B] bg-[#D9A400]/10",
  green: "text-[#2F9E83] bg-[#2F9E83]/10",
  neutral: "text-[#666666] bg-black/5",
  stepActive: "border-[#D9A400]/40 bg-[#D9A400]/5",
  stepIdle: "border-[#E5E7E7] bg-[#EEF3F2]",
  stepDoneBox: "border-[#2F9E83]/30 bg-[#2F9E83]/5",
  stepDone: "bg-[#2F9E83] text-white",
  stepNow: "bg-[#D9A400]/20 text-[#B7860B]",
  stepPending: "bg-black/5 text-[#8A8A8A]",
  btnGhost: "bg-black/5 text-[#1A1A1A] hover:bg-black/10",
  btnLink: "border-[#E5E7E7] text-[#666666] hover:bg-black/5",
  handshake: "border-[#D9A400]/40 bg-[#D9A400]/10 text-[#B7860B]",
};

const cta =
  "bg-[linear-gradient(90deg,#FB8B03_0%,#FA6203_100%)] text-white font-bold";

/* ---------- حالة الانتظار ---------- */
function WaitingSection({ t, tr, isDark }) {
  const steps = tr.raw("waiting.steps");
  const stateOf = (i) => (i === 0 ? "done" : i === 1 ? "active" : "pending");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div
          className={`flex flex-col items-center justify-center gap-5 rounded-2xl border p-8 text-center lg:col-span-2 ${t.card}`}
          style={{
            backgroundImage: isDark
              ? "radial-gradient(ellipse 45% 55% at 50% 30%, rgba(143,227,200,0.10) 0%, rgba(143,227,200,0.04) 50%, transparent 75%)"
              : "radial-gradient(ellipse 45% 55% at 50% 30%, rgba(47,158,131,0.12) 0%, rgba(47,158,131,0.04) 50%, transparent 75%)",
          }}
        >
        <PulseRings color="#FF7A00">
          <FiZap size={22} />
        </PulseRings>
        <h3 className={`text-lg font-extrabold ${t.title}`}>
          {tr("waiting.title")}
        </h3>
        <p className={`max-w-lg text-sm leading-7 ${t.muted}`}>
          {tr("waiting.desc")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm ${cta}`}
        >
          <FiRefreshCw size={16} />
          {tr("waiting.cta")}
        </button>
      </div>

      <div className={`space-y-4 rounded-2xl border p-5 ${t.card}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-extrabold ${t.title}`}>
            {tr("waiting.stepsTitle")}
          </h3>
          <span className={`rounded-md px-2 py-1 text-[11px] ${t.chip}`}>
            {tr("waiting.stepOf", { current: 2, total: steps.length })}
          </span>
        </div>

        {steps.map((s, i) => {
          const state = stateOf(i);
          return (
            <div
              key={s.title}
              className={`flex items-start gap-3 rounded-xl border p-3 ${
                state === "active"
                  ? t.stepActive
                  : state === "done"
                  ? t.stepDoneBox
                  : t.stepIdle
              }`}
            >
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                  state === "done"
                    ? t.stepDone
                    : state === "active"
                    ? t.stepNow
                    : t.stepPending
                }`}
              >
                {state === "done" ? (
                  <FiCheck size={14} />
                ) : state === "active" ? (
                  <FiRefreshCw size={13} />
                ) : (
                  i + 1
                )}
              </span>
              <div>
                <p
                  className={`text-sm font-bold ${
                    state === "pending" ? t.faint : t.title
                  }`}
                >
                  {s.title}
                </p>
                <p className={`text-xs ${t.faint}`}>{s.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ---------- حالة الخطأ ---------- */
function ErrorSection({ t, tr, clip }) {
  const rows = [
    { key: "tiktok", Icon: FiAlertTriangle, tone: t.gold, amount: null },
    { key: "funds", Icon: FiShield, tone: t.green, amount: clip.earnings },
    { key: "retry", Icon: FiRepeat, tone: t.neutral, amount: null },
  ];

  return (
    <div className={`grid grid-cols-1 gap-4 rounded-2xl border p-5 lg:grid-cols-5 ${t.card}`}>
    {/*  البطاقة المرئية المطابقة تماماً للتصميم الجديد */}
      <div
        className={`flex flex-col items-center justify-center gap-4 rounded-xl p-6 text-center lg:col-span-2 ${t.sub}`}
      >
        <PulseRings color="#94D3C1" size={190}>
          <div className="flex items-center gap-2">
            {/* الدائرة الأولى (منجز) */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F3830] text-[#94D3C1] border border-[#94D3C1]/50">
              <FiCheck size={16} />
            </div>

            {/* خط منقط فاصل */}
            <div className="w-5 border-t border-dashed border-[#94D3C1]/40" />

            {/* الدائرة الثانية (نشط/قيد المعالجة) */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FA6203]/20 text-[#FA6203] border-2 border-[#FA6203]">
              <FiRefreshCw size={18} className="animate-spin" />
            </div>

            {/* خط منقط فاصل */}
            <div className="w-5 border-t border-dashed border-[#94D3C1]/40" />

            {/* الدائرة الثالثة (TikTok) */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1C1D] text-[#E9C349] border border-[#E9C349]/50">
              <FaTiktok size={14} />
            </div>
          </div>
        </PulseRings>

        {/* شريط حالة Handshake */}
        <span
          className={`flex items-center gap-2 rounded-full border border-[#E9C349]/30 bg-[#1A1C1D] px-4 py-1.5 text-xs font-medium text-[#E9C349]`}
        >
          Handshake pending... <span className="h-2 w-2 rounded-full bg-[#AF8D11]" />
        </span>

        {/* النصوص السفلية */}
        <div className="space-y-1">
          <p className={`text-sm font-bold ${t.title}`}>
            خوادم الزمرد تعمل بكفاءة 100%
          </p>
          <p className={`text-xs leading-6 ${t.muted}`}>
            العطل محصور في استجابة نقطة اتصال TikTok الخارجية
          </p>
        </div>
      </div>
      {/* الصفوف الثلاثة + الأزرار */}
      <div className="space-y-4 lg:col-span-3">
        <h3 className={`text-lg font-extrabold ${t.title}`}>
          {tr("error.title")}
        </h3>

        {rows.map(({ key, Icon, tone, amount }) => (
          <div
            key={key}
            className={`flex flex-col gap-3 rounded-xl p-4 md:flex-row md:items-center md:justify-between ${t.sub}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone}`}
              >
                <Icon size={16} />
              </span>
              <div>
                <p className={`text-sm font-bold ${t.title}`}>
                  {tr(`error.${key}.title`)}
                </p>
                <p className={`text-xs ${t.muted}`}>
                  {tr(`error.${key}.desc`, { amount: amount ?? "" })}
                </p>
              </div>
            </div>
            <span
              className={`w-fit shrink-0 rounded-md px-2 py-1 text-[11px] ${tone}`}
            >
              {tr(`error.${key}.badge`)}
            </span>
          </div>
        ))}

        <div className="flex w-full items-center justify-between gap-2">
          <button
            onClick={() => window.location.reload()}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs transition ${t.btnGhost}`}
          >
            <FiRefreshCw size={14} />
            {tr("error.recheck")}
          </button>
          <a
            href="#"
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs transition ${t.btnLink}`}
          >
            <FiFileText size={14} />
            {tr("error.statusPage")}
          </a>
        </div>
      </div>

      
    </div>
  );
}

/* ---------- النصائح ---------- */
function Tips({ t, tr, type }) {
  const items = tr.raw(`tips.${type}.items`);
  const TitleIcon = type === "error" ? FiInfo : MdOutlineLightbulb;

  return (
    <div className={`space-y-4 rounded-2xl border p-5 ${t.card}`}>
      <h3
        className={`flex items-center gap-2 text-base font-extrabold ${t.title}`}
      >
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${t.sub} ${t.mint}`}
        >
          <TitleIcon size={18} />
        </span>
        {tr(`tips.${type}.title`)}
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.title} className={`space-y-2 rounded-xl p-4 ${t.sub}`}>
            <p
              className={`flex items-center gap-2 text-sm font-bold ${t.title}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${t.num}`}
              >
                {i + 1}
              </span>
              {item.title}
            </p>
            <p className={`text-xs leading-6 ${t.muted}`}>{item.text}</p>
            {item.footer && (
              <p className={`flex items-center gap-1.5 pt-2 text-[11px] ${t.mint}`}>
                <FiCheck size={12} />
                {item.footer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- الصفحة ---------- */
export default function ClipDetailsView() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const tr = useTranslations("contentPerformance.details");
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  const clip = getClipById(id);
  if (!clip) notFound();
  // ?status=anomaly | waiting | error للتجربة، احذفيها عند الربط بالـ API
  const status = searchParams.get("status") || clip.status;
  const showAnalytics = status === "normal" || status === "anomaly";
  const BackIcon = locale === "ar" ? FiArrowRight : FiArrowLeft;

  return (
    <div
      className={`font-tajawal space-y-3 p-2 md:p-4 ${t.page}`}
      style={{ fontFamily: "var(--font-tajawal)" }}
    >
      <div className="flex justify-start">
        <Link
          href="/creator/content-performance"
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${t.pill}`}
        >
          <BackIcon size={16} color={isDark ? "#94D3C1" : "#2F9E83"}/>
          {status === "anomaly" ? tr("backToList") : tr("back")}
        </Link>
      </div>

      <StatusBanner status={status} clip={clip} />
      <ClipHeader clip={clip} status={status} />

      {showAnalytics && (
        <>
          <DailyViewsChart anomaly={status === "anomaly"} daily={clip.daily} />
          <InsightsRow clip={clip} />
        </>
      )}

      {status === "waiting" && (
        <>
          <WaitingSection t={t} tr={tr} isDark={isDark} />
          <Tips t={t} tr={tr} type="waiting" />
        </>
      )}

      {status === "error" && (
        <>
          <ErrorSection t={t} tr={tr} clip={clip} />
          <Tips t={t} tr={tr} type="error" />
        </>
      )}
    </div>
  );
}
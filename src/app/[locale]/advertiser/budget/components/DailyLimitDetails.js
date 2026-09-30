"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Tajawal } from "next/font/google";
import { useTheme } from "@/context/ThemeContext";
import {
  MdOutlineArrowBack,
  MdOutlineArrowForward,
  MdOutlineTrendingUp,
  MdOutlineAttachMoney,
  MdOutlineTimer,
  MdOutlineAccountBalance,
  MdOutlineBarChart,
  MdOutlineMail,
  MdOutlineFlag,
  MdOutlineBolt,
  MdOutlineAccountBalanceWallet,
  MdOutlineVerified,
  MdOutlineMoreVert,
} from "react-icons/md";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

// ── Fallback Mock (يُستخدم فقط للقيم اللي ما إلها بيانات بعد) ───────────────
const MOCK = {
  limit: 75,
  todaySpent: 75,
  capHour: 16.6,
  resetTime: "12:00 AM",
  campaignBudget: { total: 1500, remaining: 920, spent: 580 },
  reach: { views: 41320, cpm: 1.21 },
  wallet: {
    balance: 24500,
    sarRate: 3.75,
    otherCampaigns: 3,
    platformDaily: 142.3,
  },
  stats: { saved: 0, precision: 100, clicks: 1984, ctr: "4.80" },
  publishers: { count: 14, docId: "#EMR-SHR-2025" },
  ads: [],
};

// شكل منحنى الإنفاق: [نسبة الوقت حتى بلوغ الحد، نسبة المبلغ]
const CURVE_SHAPE = [
  [0.2, 0.02],
  [0.3, 0.04],
  [0.42, 0.11],
  [0.54, 0.23],
  [0.66, 0.39],
  [0.78, 0.59],
  [0.9, 0.8],
  [1, 1],
];

const MAX_EXTENDED_LIMIT = 200;
const ORANGE = "linear-gradient(90deg, #FFA600, #FF4B04)";
const ORANGE_SOLID = "#FF6A00";

const fmt = (n) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// 16.6 → { label: "04:36", period: "PM" }
function formatHour(h) {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  const period = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 || 12;
  return {
    label: `${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")}`,
    period,
  };
}

// ── Theme tokens ───────────────────────────────────────────────────────────
function getTokens(isDark) {
  return {
    page: isDark ? "#0A0B0B" : "#F1F4F3",
    card: isDark ? "#141616" : "#FFFFFF",
    inner: isDark ? "#1B1E1E" : "#F3F6F5",
    innerStrong: isDark ? "#252929" : "#E6ECEA",
    chartBg: isDark ? "#0D0F0F" : "#F3F6F5",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(25,28,29,0.09)",
    heading: isDark ? "#FFFFFF" : "#0F1213",
    text: isDark ? "#E1E3E4" : "#191C1D",
    soft: isDark ? "#BFC9C4" : "#404945",
    sub: isDark ? "#89938F" : "#5F6A66",
    mint: "#94D3C1",
    accent: isDark ? "#94D3C1" : "#1C6B58",
    accentBg: isDark ? "rgba(148,211,193,0.12)" : "rgba(148,211,193,0.30)",
    accentBorder: isDark ? "rgba(148,211,193,0.22)" : "rgba(28,107,88,0.25)",
    gold: "#E9C349",
    goldText: isDark ? "#E9C349" : "#8A6A00",
    track: isDark ? "rgba(255,255,255,0.08)" : "rgba(25,28,29,0.08)",
    onMint: "#0B1F19",
    shadow: isDark ? "none" : "0 1px 3px rgba(16,24,20,0.06)",
  };
}

// ── Small building blocks ──────────────────────────────────────────────────
function Card({ t, className = "", children }) {
  return (
    <section
      className={`rounded-2xl ${className}`}
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
      }}
    >
      {children}
    </section>
  );
}

function IconBox({ t, icon: Icon, color, size = 20, box = 40 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{
        width: box,
        height: box,
        background: t.inner,
        border: `1px solid ${t.border}`,
      }}
    >
      <Icon size={size} color={color || t.accent} />
    </div>
  );
}

function Pill({ bg, color, dot, children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold"
      style={{ background: bg, color }}
    >
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
        />
      )}
      {children}
    </span>
  );
}

function Bar({ t, pct, background, h = 6 }) {
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height: h, background: t.track }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, background }}
      />
    </div>
  );
}

function TopStat({
  t,
  title,
  icon: Icon,
  iconColor,
  big,
  bigColor,
  small,
  footer,
  bar,
}) {
  return (
    <Card t={t} className="flex flex-col gap-4 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-bold" style={{ color: t.soft }}>
          {title}
        </span>
        <Icon size={22} color={iconColor} />
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          dir="ltr"
          className="text-[28px] font-extrabold leading-none tracking-tight"
          style={{ color: bigColor || t.heading }}
        >
          {big}
        </span>
        <span className="text-[12px]" style={{ color: t.sub }}>
          {small}
        </span>
      </div>

      <div className="text-[11px]">{footer}</div>
      {bar}
    </Card>
  );
}

// ── مخطط توزيع الإنفاق ─────────────────────────────────────────────────────
const VB_W = 1000;
const VB_H = 260;
const PAD_TOP = 30;
const PAD_BOTTOM = 10;

function smoothPath(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

function SpendChart({
  t,
  tr,
  isRTL,
  curve,
  limit,
  capValue,
  capHour,
  capTime,
  capPeriod,
}) {
  const yMax = Math.max(limit, capValue, 1);
  const toX = (h) => (h / 24) * VB_W;
  const toY = (v) =>
    VB_H - PAD_BOTTOM - (v / yMax) * (VB_H - PAD_TOP - PAD_BOTTOM);

  const pts = curve.map(([h, v]) => [toX(h), toY(v)]);
  const line = smoothPath(pts);
  const area = `${line} L${pts[pts.length - 1][0]},${VB_H} L${pts[0][0]},${VB_H} Z`;

  const capX = toX(capHour);
  const capY = toY(capValue);
  const capXPct = (capX / VB_W) * 100;
  const capYPct = (capY / VB_H) * 100;

  // التلميح ما يطلع برا الكرت لو العلامة قريبة من الأطراف
  const tipShift = capXPct < 20 ? "-10%" : capXPct > 85 ? "-100%" : "-90%";

  // علامات الوقت الثابتة، نخفي أي واحدة قريبة من علامة بلوغ الحد
  const fixedTicks = [
    { h: 0, label: "12:00 AM" },
    { h: 4, label: "04:00 AM" },
    { h: 8, label: "08:00 AM" },
    { h: 12, label: "12:00 PM" },
    { h: 20, label: "08:00 PM" },
    { h: 24, label: "11:59 PM" },
  ].filter((tk) => tk.h === 0 || tk.h === 24 || Math.abs(tk.h - capHour) >= 2);

  const ticks = [
    ...fixedTicks,
    {
      h: capHour,
      label: `${capTime} ${capPeriod} ${tr("chart.capped")}`,
      cap: true,
    },
  ].sort((a, b) => a.h - b.h);

  return (
    <div
      dir="ltr"
      className="rounded-2xl p-3 sm:p-4"
      style={{ background: t.chartBg, border: `1px solid ${t.border}` }}
    >
      <div className="relative h-[220px] w-full sm:h-[240px]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="dl-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={t.mint} stopOpacity="0.32" />
              <stop offset="100%" stopColor={t.mint} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#dl-area)" />
          <line
            x1="0"
            x2={capX}
            y1={capY}
            y2={capY}
            stroke={t.gold}
            strokeWidth="1.5"
            strokeDasharray="5 5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={line}
            fill="none"
            stroke={t.mint}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* نقطة بلوغ الحد */}
        <span
          className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${capXPct}%`,
            top: `${capYPct}%`,
            background: t.gold,
            boxShadow: `0 0 0 5px rgba(233,195,73,0.25)`,
          }}
        />

        {/* التلميح */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="absolute inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-bold"
          style={{
            left: `${capXPct}%`,
            top: `calc(${capYPct}% - 34px)`,
            transform: `translateX(${tipShift})`,
            background: t.card,
            border: `1px solid ${t.border}`,
            color: t.goldText,
          }}
        >
          <MdOutlineFlag size={13} />
          {tr("chart.tooltip", { time: `${capTime} ${capPeriod}` })}
        </div>
      </div>

      {/* محور الزمن */}
      <div className="relative mt-3 h-4 text-[10px]" style={{ color: t.sub }}>
        {ticks.map((tk, i) => {
          const pct = (tk.h / 24) * 100;
          const shift =
            i === 0 ? "0%" : i === ticks.length - 1 ? "-100%" : "-50%";
          return (
            <span
              key={tk.label}
              className="absolute top-0 hidden whitespace-nowrap sm:block"
              style={{
                left: `${pct}%`,
                transform: `translateX(${shift})`,
                color: tk.cap ? t.goldText : t.sub,
              }}
            >
              {tk.label}
            </span>
          );
        })}
        {/* موبايل: أول وآخر علامة فقط */}
        <span className="absolute left-0 top-0 sm:hidden">12:00 AM</span>
        <span className="absolute right-0 top-0 sm:hidden">11:59 PM</span>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function DailyLimitDetails({
  campaign,
  limit: limitProp,
  walletBalance,
  onBack,
  onResume,
}) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = getTokens(isDark);
  const tr = useTranslations("dailyLimitDetails");

  // ── بيانات الحملة المختارة ──
  const limit = limitProp ?? campaign?.daily?.limit ?? MOCK.limit;
  const todaySpent = campaign?.daily?.todaySpent ?? MOCK.todaySpent;
  const budgetTotal = campaign?.budget?.total ?? MOCK.campaignBudget.total;
  const budgetSpent = Math.min(
    campaign?.budget?.spent ?? MOCK.campaignBudget.spent,
    budgetTotal,
  );
  const budgetRemaining = Math.max(budgetTotal - budgetSpent, 0);
  const ads = campaign?.ads ?? MOCK.ads;
  const balance = walletBalance ?? MOCK.wallet.balance;

  // ساعة بلوغ الحد (من الحملة إذا موجودة)
  const capHour = campaign?.daily?.capHour ?? MOCK.capHour;
  const cap = formatHour(capHour);
  const reached = todaySpent >= limit;

  // ── المنحنى: بيتولد من الحد + المصروف + ساعة البلوغ ──
  const spendCurve = [
    [0, 0],
    ...CURVE_SHAPE.map(([p, f]) => [
      Number((p * capHour).toFixed(2)),
      f * todaySpent,
    ]),
    ...(reached ? [[24, todaySpent]] : []),
  ];

  const stats = {
    ...MOCK.stats,
    hours: Number(capHour.toFixed(1)),
    hourlyRate: capHour > 0 ? todaySpent / capHour : 0,
  };

  // ── السلايدر ──
  const maxLimit = Math.min(
    Math.max(MAX_EXTENDED_LIMIT, limit * 2),
    limit + budgetRemaining,
  );
  const canExtend = maxLimit > limit;
  const [newLimit, setNewLimit] = useState(limit);

  const spentPct =
    budgetTotal > 0 ? Math.floor((budgetSpent / budgetTotal) * 1000) / 10 : 0;
  const remainingPct = Math.round((100 - spentPct) * 10) / 10;
  const todayPct = limit > 0 ? Math.round((todaySpent / limit) * 100) : 0;
  const sliderPct = canExtend
    ? ((newLimit - limit) / (maxLimit - limit)) * 100
    : 0;

  const handleBack = () => (onBack ? onBack() : window.history.back());
  const handleResume = () => {
    if (newLimit <= limit || newLimit - limit > budgetRemaining) return;
    onResume?.(newLimit);
  };

  const BackIcon = isRTL ? MdOutlineArrowForward : MdOutlineArrowBack;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`${tajawal.className} min-h-screen`}
      style={{ background: t.page, color: t.text }}
    >
      {/* تنسيق السلايدر */}
      <style>{`
        .dl-range{-webkit-appearance:none;appearance:none;height:6px;border-radius:9999px;outline:none;width:100%;cursor:pointer}
        .dl-range:disabled{cursor:not-allowed;opacity:.5}
        .dl-range::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:9999px;background:${t.mint};border:4px solid ${t.card};box-shadow:0 0 0 3px rgba(148,211,193,.35)}
        .dl-range::-moz-range-thumb{width:12px;height:12px;border-radius:9999px;background:${t.mint};border:4px solid ${t.card};box-shadow:0 0 0 3px rgba(148,211,193,.35)}
      `}</style>

      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 p-3 sm:p-5 lg:p-6">
        {/* رجوع */}
        <div>
          <button
            type="button"
            aria-label={tr("back")}
            onClick={handleBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-opacity hover:opacity-70"
            style={{ color: t.heading }}
          >
            <BackIcon size={22} />
          </button>
        </div>

        {/* 1) بلوغ الحد */}
        <Card t={t} className="flex items-start gap-4 p-3 sm:p-4">
          <IconBox t={t} icon={MdOutlineTrendingUp} box={44} />
          <div className="min-w-0 flex-1">
            <h1
              className="text-[15px] font-extrabold leading-tight sm:text-[18px]"
              style={{ color: t.heading }}
            >
              {tr("banner.title", { amount: fmt(limit) })}
            </h1>
            <p className="mt-2 text-[12px] leading-6" style={{ color: t.soft }}>
              {tr("banner.message")}
            </p>
            <p
              className="mt-3 inline-flex items-start gap-2 text-[11px] leading-5"
              style={{ color: t.sub }}
            >
              <MdOutlineMail
                size={14}
                color={t.accent}
                className="mt-0.5 shrink-0"
              />
              {tr("banner.notice", { amount: fmt(limit) })}
            </p>
          </div>
        </Card>

        {/* 2) ثلاثة كروت علوية */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TopStat
            t={t}
            title={tr("cards.todaySpend.title")}
            icon={MdOutlineAttachMoney}
            iconColor={ORANGE_SOLID}
            big={`$${fmt(todaySpent)}`}
            small={<span dir="ltr">/ ${fmt(limit)}</span>}
            footer={
              <span
                className="inline-flex items-center gap-1.5 font-bold"
                style={{ color: t.goldText }}
              >
                <MdOutlineTimer size={14} />
                {tr("cards.todaySpend.reached", { percent: todayPct })}
              </span>
            }
            bar={<Bar t={t} pct={todayPct} background={ORANGE} h={6} />}
          />

          <TopStat
            t={t}
            title={tr("cards.balance.title")}
            icon={MdOutlineAccountBalance}
            iconColor={t.accent}
            big={`$${fmt(budgetRemaining)}`}
            bigColor={t.accent}
            small={tr("cards.balance.of", {
              total: budgetTotal.toLocaleString("en-US"),
            })}
            footer={
              <span className="font-bold" style={{ color: t.soft }}>
                {tr("cards.balance.spent", {
                  spent: fmt(budgetSpent),
                  percent: spentPct,
                })}
              </span>
            }
            bar={<Bar t={t} pct={remainingPct} background={t.mint} h={6} />}
          />

          <TopStat
            t={t}
            title={tr("cards.reach.title")}
            icon={MdOutlineBarChart}
            iconColor={t.accent}
            big={MOCK.reach.views.toLocaleString("en-US")}
            small={tr("cards.reach.views")}
            footer={
              <span
                className="flex items-center justify-between gap-1.5"
                style={{ color: t.sub }}
              >
                {tr("cards.reach.cpm")}
                <b dir="ltr" style={{ color: ORANGE_SOLID }}>
                  ${fmt(MOCK.reach.cpm)}
                </b>
              </span>
            }
            bar={<Bar t={t} pct={90} background={t.mint} h={6} />}
          />
        </div>

        {/* 3) الشبكة الرئيسية */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* العمود الأول: المخطط */}
          <Card t={t} className="flex min-w-0 flex-col gap-4 p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2
                  className="text-[16px] font-extrabold leading-tight"
                  style={{ color: t.heading }}
                >
                  {tr("chart.title", { limit: fmt(limit) })}
                </h2>
                <p
                  className="mt-1 text-[11px] leading-5"
                  style={{ color: t.sub }}
                >
                  {tr("chart.subtitle", { time: cap.label })}
                </p>
              </div>
              <div
                className="flex shrink-0 items-center gap-4 text-[10px]"
                style={{ color: t.soft }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: t.mint }}
                  />
                  {tr("chart.legend.actual")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: t.gold }}
                  />
                  {tr("chart.legend.cap", { limit })}
                </span>
              </div>
            </div>

            <SpendChart
              t={t}
              tr={tr}
              isRTL={isRTL}
              curve={spendCurve}
              limit={limit}
              capValue={todaySpent}
              capHour={capHour}
              capTime={cap.label}
              capPeriod={cap.period}
            />

            {/* ثلاث خانات صغيرة */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  title: tr("stats.clicks.title"),
                  value: tr("stats.clicks.value", {
                    count: stats.clicks.toLocaleString("en-US"),
                  }),
                  note: tr("stats.clicks.note", { ctr: stats.ctr }),
                  color: t.heading,
                },
                {
                  title: tr("stats.hours.title"),
                  value: tr("stats.hours.value", { hours: stats.hours }),
                  note: tr("stats.hours.note", {
                    rate: fmt(stats.hourlyRate),
                  }),
                  color: t.heading,
                },
                {
                  title: tr("stats.saved.title"),
                  value: `$${fmt(stats.saved)} ${tr("stats.saved.value")}`,
                  note: tr("stats.saved.note", { percent: stats.precision }),
                  color: t.goldText,
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className="flex flex-col gap-1.5 rounded-xl p-3.5"
                  style={{
                    background: t.inner,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <span className="text-[11px]" style={{ color: t.sub }}>
                    {s.title}
                  </span>
                  <span
                    className="text-[20px] font-extrabold"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: t.accent }}
                  >
                    {s.note}
                  </span>
                </div>
              ))}
            </div>

            {/* الناشرون المعتمدون */}
            <div
              className="flex items-center justify-between gap-3 rounded-xl p-3.5"
              style={{ background: t.inner, border: `1px solid ${t.border}` }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <IconBox t={t} icon={MdOutlineVerified} box={38} />
                <div className="min-w-0">
                  <p
                    className="text-[13px] font-extrabold"
                    style={{ color: t.heading }}
                  >
                    {tr("publishers.title")}
                  </p>
                  <p
                    className="mt-0.5 text-[11px] leading-5"
                    style={{ color: t.sub }}
                  >
                    {tr("publishers.desc", {
                      count: MOCK.publishers.count,
                      docId: MOCK.publishers.docId,
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 text-[11px] font-bold transition-opacity hover:opacity-80"
                style={{ color: t.soft }}
              >
                <span className="hidden sm:inline" style={{ color: t.accent }}>
                  {tr("publishers.action")}
                </span>
                <MdOutlineArrowBack
                  size={14}
                  className="rtl:rotate-0 ltr:rotate-180"
                  style={{ color: t.accent }}
                />
              </button>
            </div>
          </Card>

          {/* العمود الثاني: الاستئناف + المحفظة */}
          <div className="flex min-w-0 flex-col gap-4">
            <Card t={t} className="flex flex-col gap-4 p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <IconBox t={t} icon={MdOutlineTrendingUp} box={38} />
                <div className="min-w-0">
                  <h2
                    className="text-[15px] font-extrabold leading-tight"
                    style={{ color: t.heading }}
                  >
                    {tr("resume.title")}
                  </h2>
                  <p className="mt-1 text-[11px]" style={{ color: t.sub }}>
                    {tr("resume.subtitle")}
                  </p>
                </div>
              </div>

              <p className="text-[12px] leading-6" style={{ color: t.soft }}>
                {tr("resume.description", { balance: fmt(budgetRemaining) })}
              </p>

              <div
                className="rounded-xl p-3"
                style={{
                  background: t.chartBg,
                  border: `1px solid ${t.border}`,
                }}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="text-[11px]" style={{ color: t.soft }}>
                    {tr("resume.newLimit")}
                  </span>
                  <span
                    dir="ltr"
                    className="text-[15px] font-extrabold"
                    style={{ color: ORANGE_SOLID }}
                  >
                    ${fmt(newLimit)}
                  </span>
                </div>

                <input
                  type="range"
                  className="dl-range"
                  min={limit}
                  max={canExtend ? maxLimit : limit + 5}
                  step={5}
                  value={newLimit}
                  disabled={!canExtend}
                  onChange={(e) => setNewLimit(Number(e.target.value))}
                  aria-label={tr("resume.newLimit")}
                  style={{
                    background: `linear-gradient(to ${isRTL ? "left" : "right"}, ${t.mint} ${sliderPct}%, ${t.track} ${sliderPct}%)`,
                  }}
                />

                <div
                  dir="ltr"
                  className="mt-3 flex items-center justify-between text-[10px]"
                  style={{ color: t.sub }}
                >
                  {isRTL ? (
                    <>
                      <span>${maxLimit}</span>
                      <span>${Math.round((limit + maxLimit) / 2)}</span>
                      <span>
                        ${limit} {tr("resume.current")}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        ${limit} {tr("resume.current")}
                      </span>
                      <span>${Math.round((limit + maxLimit) / 2)}</span>
                      <span>${maxLimit}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleResume}
                disabled={newLimit <= limit}
                className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: ORANGE }}
              >
                <MdOutlineBolt size={16} />
                {tr("resume.action")}
              </button>

              <p
                className="text-center text-[10px] leading-5"
                style={{ color: t.sub }}
              >
                {tr("resume.note")}
              </p>
            </Card>

            <Card t={t} className="flex flex-col gap-4 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <h2
                  className="text-[15px] font-extrabold"
                  style={{ color: t.heading }}
                >
                  {tr("wallet.title")}
                </h2>
                <MdOutlineAccountBalanceWallet size={20} color={t.goldText} />
              </div>

              <div
                className="rounded-xl p-4"
                style={{
                  background: t.chartBg,
                  border: `1px solid ${t.border}`,
                }}
              >
                <p className="text-[11px]" style={{ color: t.soft }}>
                  {tr("wallet.available")}
                </p>
                <p
                  className="mt-2 text-[26px] font-extrabold leading-none"
                  style={{ color: t.goldText }}
                >
                  ${fmt(balance)}
                </p>
                <p className="mt-2 text-[10px]" style={{ color: t.sub }}>
                  {tr("wallet.sar", {
                    amount: fmt(balance * MOCK.wallet.sarRate),
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-3 text-[11px]">
                <div className="flex items-center justify-between gap-2">
                  <span style={{ color: t.sub }}>
                    {tr("wallet.otherCampaigns")}
                  </span>
                  <b style={{ color: t.heading }}>
                    {tr("wallet.campaignsCount", {
                      count: MOCK.wallet.otherCampaigns,
                    })}
                  </b>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span style={{ color: t.sub }}>
                    {tr("wallet.platformSpend")}
                  </span>
                  <b dir="ltr" style={{ color: t.heading }}>
                    ${fmt(MOCK.wallet.platformDaily)}
                  </b>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span style={{ color: t.sub }}>{tr("wallet.autoReset")}</span>
                  <b style={{ color: t.accent }}>
                    {tr("wallet.enabled", { time: MOCK.resetTime })}
                  </b>
                </div>
              </div>

              <button
                type="button"
                className="rounded-xl py-3 text-[12px] font-bold transition-opacity hover:opacity-80"
                style={{
                  background: t.innerStrong,
                  color: t.soft,
                  border: `1px solid ${t.border}`,
                }}
              >
                {tr("wallet.auditLog")}
              </button>
            </Card>
          </div>
        </div>

        {/* 4) جدول الإعلانات */}
        <Card t={t}>
          <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h3
              className="text-[15px] font-extrabold"
              style={{ color: t.heading }}
            >
              {tr("ads.title")}
            </h3>
            <span className="text-[11px]" style={{ color: t.sub }}>
              {tr("ads.subtitle", { count: ads.length })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr
                  style={{
                    borderTop: `1px solid ${t.border}`,
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  {["ad", "status", "clicks", "cr", "cost"].map((k) => (
                    <th
                      key={k}
                      className="px-5 py-3 text-start text-[11px] font-medium"
                      style={{ color: t.sub }}
                    >
                      {tr(`ads.columns.${k}`)}
                    </th>
                  ))}
                  <th
                    className="px-5 py-3 text-center text-[11px] font-medium"
                    style={{ color: t.sub }}
                  >
                    {tr("ads.columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad, i) => {
                  const Icon = ad.icon;
                  const toneColor =
                    ad.tone === "mint"
                      ? t.accent
                      : ad.tone === "gold"
                        ? t.goldText
                        : t.sub;
                  return (
                    <tr
                      key={ad.id}
                      style={{
                        borderBottom:
                          i === ads.length - 1
                            ? "none"
                            : `1px solid ${t.border}`,
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <IconBox
                            t={t}
                            icon={Icon}
                            color={toneColor}
                            size={18}
                            box={36}
                          />
                          <div className="min-w-0">
                            <p
                              className="text-[13px] font-bold"
                              style={{ color: t.heading }}
                            >
                              {ad.name}
                            </p>
                            <p
                              className="mt-0.5 text-[11px]"
                              style={{ color: t.sub }}
                            >
                              {ad.sub}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Pill dot bg={t.accentBg} color={t.accent}>
                          {tr("ads.statusResumed")}
                        </Pill>
                      </td>
                      <td
                        className="px-5 py-4 text-[13px] font-medium"
                        style={{ color: t.text }}
                      >
                        {ad.clicks.toLocaleString("en-US")}
                      </td>
                      <td
                        className="px-5 py-4 text-[13px] font-bold"
                        style={{ color: t.goldText }}
                      >
                        {ad.cr ?? ad.ctr}
                      </td>
                      <td
                        className="px-5 py-4 text-[13px] font-medium"
                        style={{ color: t.text }}
                      >
                        ${fmt(ad.cost)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          aria-label={tr("ads.columns.actions")}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition-opacity hover:opacity-70"
                        >
                          <MdOutlineMoreVert size={18} color={t.sub} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

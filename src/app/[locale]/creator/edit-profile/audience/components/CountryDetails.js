"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import {
  FiArrowLeft,
  FiArrowRight,
  FiClock,
  FiEye,
  FiDollarSign,
  FiPieChart,
  FiHeart,
  FiMapPin,
  FiShield,
  FiUsers,
  FiShare2,
  FiGlobe,
} from "react-icons/fi";
import { FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa";

const nf = new Intl.NumberFormat("en-US");

const PLATFORM_ICONS = { tiktok: FaTiktok, instagram: FaInstagram, youtube: FaYoutube };

// ألوان أيقونات المنصات (تيك توك يتحدد حسب الثيم داخل الكومبوننت)
const PLATFORM_COLORS = {
  instagram: "#E4405F",
  youtube: "#FF0000",
};

function Flag({ code, size = 22 }) {
  if (code === "other") return <FiGlobe size={size} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt=""
      className="h-4 w-6 shrink-0 rounded-[3px] object-cover"
    />
  );
}

export default function CountryDetails({ country, countries, details, onSelect, onBack }) {
  const { isDark } = useTheme();
  const locale = useLocale();
  const translate = useTranslations("Audience");

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    mutedText: isDark ? "text-[#8A8A8A]" : "text-[#707070]",
    card: isDark ? "bg-[#181818] border-[#2D2D2D]" : "bg-white border-[#D6D6D6]",
    inner: isDark ? "bg-[#111] border-[#2D2D2D]" : "bg-[#F7F8F8] border-[#E3E3E3]",
    chip: isDark ? "bg-white/5 text-[#B0B0B0]" : "bg-black/5 text-[#555555]",
    iconBox: isDark ? "bg-white/5" : "bg-black/5",
    iconColor: isDark ? "#94D3C1" : "#0F766E",
    track: isDark ? "bg-[#2D2D2D]" : "bg-[#E5E5E5]",
    tab: isDark
      ? "bg-[#181818] border-[#2D2D2D] text-[#B0B0B0] hover:bg-white/5"
      : "bg-white border-[#D6D6D6] text-[#555555] hover:bg-black/5",
    positive: isDark ? "text-[#94D3C1]" : "text-[#0B625A]",
    mint: isDark ? "#94D3C1" : "#0F766E",
    yellow: isDark ? "#FACC15" : "#CA8A04",
    accent: isDark ? "#94D3C1" : "#0B625A",
    mapBg: isDark ? "bg-[#0B0B0B] border-[#2D2D2D]" : "bg-[#EEF2F2] border-[#D6D6D6]",
    dots: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    label: isDark ? "bg-black/70 text-white" : "bg-white/90 text-[#171717]",
    divider: isDark ? "border-[#2D2D2D]" : "border-[#D6D6D6]",
    gradient: "bg-gradient-to-r from-[#FDA301] to-[#F96604]",
    // صفوف المدن
    rowBg: isDark ? "bg-white/[0.04]" : "bg-[#F7F8F8]",
    rowTrack: isDark ? "bg-[#0B0B0B]" : "bg-[#E5E5E5]",
    cityPctHigh: isDark ? "#94D3C1" : "#0F766E",
    cityPctLow: isDark ? "#FACC15" : "#CA8A04",
  };

  // ألوان النسب تحت أيقونات المنصات: مينت / أصفر / أبيض-أسود
  const platformTextColors = {
    tiktok: t.mint,
    instagram: t.yellow,
    youtube: isDark ? "#E5E5E5" : "#171717",
  };

  const BackIcon = locale === "ar" ? FiArrowRight : FiArrowLeft;
  const shortName = translate(`countriesShort.${country.code}`);
  const longName = translate(`countries.${country.code}`);

  const cardCls = `rounded-2xl border ${t.card}`;

  const Title = ({ icon: Icon, title, subtitle, extra }) => (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <Icon size={20} color={t.accent} className="mt-1 shrink-0" />
        <div>
          <h3 className={`m-0 text-base font-bold sm:text-lg ${t.text}`}>{title}</h3>
          {subtitle && <p className={`m-0 mt-0.5 text-xs ${t.subText}`}>{subtitle}</p>}
        </div>
      </div>
      {extra}
    </div>
  );

  const Bar = ({ percent, color }) => (
    <div className={`h-1.5 w-full overflow-hidden rounded-full ${t.track}`}>
      <div
        className="h-full rounded-full"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  );

  const orange = "linear-gradient(90deg,#FDA001,#F76702)";
  const ageColors = [t.mint, t.mint, t.yellow];
  const youngShare = details.ages[0].percent + details.ages[1].percent;

  const stats = [
    {
      key: "views",
      icon: FiEye,
      label: translate("countryViews", { country: shortName }),
      value: nf.format(details.views),
      unit: translate("viewsUnit"),
      foot: [translate("totalShare"), translate("ofAll", { percent: country.percent })],
    },
    {
      key: "earnings",
      icon: FiDollarSign,
      label: translate("countryEarnings", { country: shortName }),
      value: details.earnings.amount,
      unit: details.earnings.currency,
      foot: [translate("cpm"), `${details.earnings.cpm} ${details.earnings.currency}`],
    },
    {
      key: "completion",
      icon: FiPieChart,
      label: translate("completionRate"),
      value: `${details.completion}%`,
      badge: translate("excellent"),
      bar: details.completion,
    },
    {
      key: "engagement",
      icon: FiHeart,
      label: translate("regionalEngagement"),
      value: `${details.engagement.rate}%`,
      badge: translate("aboveBenchmark", { delta: details.engagement.delta }),
      bar: details.engagement.rate * 5,
    },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <button
        type="button"
        onClick={onBack}
        className={`flex h-9 w-fit cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-bold ${t.tab}`}
      >
        <BackIcon size={14} />
        {translate("back")}
      </button>

      {/* بانر الدولة */}
      <div
        className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between ${cardCls}`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Flag code={country.code} />
            <h2 className={`m-0 text-lg font-bold sm:text-xl ${t.text}`}>
              {translate("selectedCountry")}: {longName}
            </h2>
            <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${t.chip}`}>
              {translate("ofTotal", { percent: country.percent })}
            </span>
          </div>
          <p className={`m-0 flex items-center gap-2 text-xs ${t.subText}`}>
            <FiClock size={14} color={t.accent} />
            {translate("peakHours", { hours: details.peakHours })}
          </p>
        </div>
      </div>

      {/* تبويبات الدول */}
      <div className="flex flex-wrap items-center gap-2">
        {countries.map((c) => {
          const active = c.code === country.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelect(c.code)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                active ? `${t.gradient} border-transparent text-white` : t.tab
              }`}
            >
              <Flag code={c.code} size={14} />
              {translate(`countriesShort.${c.code}`)}
              <span className="opacity-80">{c.percent}%</span>
            </button>
          );
        })}
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @5xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className={`flex flex-col gap-3 p-5 ${cardCls}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs ${t.subText}`}>{s.label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.iconBox}`}>
                  <Icon size={18} color={t.iconColor} />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold sm:text-3xl ${t.text}`}>
                  <bdi dir="ltr">{s.value}</bdi>
                </span>
                {s.unit && <span className={`text-xs ${t.subText}`}>{s.unit}</span>}
                {s.badge && (
                  <span className={`text-[11px] font-bold ${t.positive}`}>
                    <bdi dir="ltr">{s.badge}</bdi>
                  </span>
                )}
              </div>

              {s.bar != null && (
                <div className="mt-auto pb-1 pt-3">
                  <Bar percent={Math.min(100, s.bar)} color={t.mint} />
                </div>
              )}

              {s.foot && (
                <div
                  className={`mt-auto flex items-center justify-between gap-2 border-t pt-3 text-[11px] ${t.divider}`}
                >
                  <span className={t.mutedText}>{s.foot[0]}</span>
                  <span className={`font-bold ${t.subText}`}>{s.foot[1]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* المدن + الخريطة */}
      <div className="grid grid-cols-1 items-stretch gap-5 @4xl:grid-cols-5">
        <section className={`flex flex-col p-5 @4xl:col-span-3 ${cardCls}`}>
          <Title
            icon={FiMapPin}
            title={translate("citiesTitle")}
            subtitle={translate("citiesSubtitle", { country: longName })}
            extra={
              <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] ${t.chip}`}>
                {translate("citiesCount", { count: details.cities.length })}
              </span>
            }
          />

          <div className="flex flex-1 flex-col gap-3">
            {details.cities.map((city) => (
              <div
                key={city.name}
                className={`flex flex-1 flex-col justify-center gap-3 rounded-xl px-4 py-3 ${t.rowBg}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-base font-bold ${t.text}`}>{city.name}</span>
                    <span className={`text-[11px] ${t.mutedText}`}>{city.desc}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-bold ${t.text}`}>{nf.format(city.views)}</span>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: city.percent >= 8 ? t.cityPctHigh : t.cityPctLow }}
                    >
                      <bdi dir="ltr">({city.percent}%)</bdi>
                    </span>
                  </div>
                </div>

                <div className={`h-1.5 w-full overflow-hidden rounded-full ${t.rowTrack}`}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${city.percent}%`, background: orange }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`flex flex-col p-5 @4xl:col-span-2 ${cardCls}`}>
          <Title
            icon={FiGlobe}
            title={translate("interactiveMap")}
            subtitle={translate("interactiveMapSubtitle")}
            extra={
              <span className={`flex shrink-0 items-center gap-1.5 text-[11px] ${t.subText}`}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.mint }} />
                {translate("liveUpdate")}
              </span>
            }
          />
          <div
            className={`relative mb-4 min-h-[200px] w-full flex-1 overflow-hidden rounded-xl border ${t.mapBg}`}
            style={{
              backgroundImage: `radial-gradient(circle, ${t.dots} 1px, transparent 1px)`,
              backgroundSize: "18px 18px",
            }}
          >
            {details.mapPoints.map((p) => (
              <div
                key={p.label}
                className="absolute flex items-center gap-2"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{ background: p.color, boxShadow: `0 0 14px 4px ${p.color}66` }}
                />
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${t.label}`}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`mt-auto flex items-center justify-between gap-3 rounded-xl border p-3 ${t.inner}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.iconBox}`}>
                <FiShield size={18} color={t.accent} />
              </div>
              <div>
                <p className={`m-0 text-xs font-bold ${t.text}`}>{translate("reliability")}</p>
                <p className={`m-0 text-[11px] ${t.mutedText}`}>{translate("reliabilityNote")}</p>
              </div>
            </div>
            <span className={`text-sm font-bold ${t.positive}`}>
              <bdi dir="ltr">{details.reliability}%</bdi>
            </span>
          </div>
        </section>
      </div>

      {/* العمر + المنصات */}
      <div className="grid grid-cols-1 items-start gap-5 @4xl:grid-cols-2">
        <section className={`p-5 ${cardCls}`}>
          <Title
            icon={FiUsers}
            title={translate("ageTitle")}
            subtitle={translate("ageSubtitle", { country: shortName })}
          />
          <div className="flex flex-col gap-4">
            {details.ages.map((a, i) => (
              <div key={a.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-bold ${t.text}`}>{translate(`ages.${a.key}`)}</span>
                  <span className="text-xs font-bold" style={{ color: ageColors[i] }}>
                    <bdi dir="ltr">{a.percent}%</bdi>
                  </span>
                </div>
                <Bar percent={a.percent} color={ageColors[i]} />
              </div>
            ))}
          </div>
          <p className={`m-0 mt-4 border-t pt-3 text-[11px] ${t.divider} ${t.mutedText}`}>
            {translate("ageNote", { percent: youngShare })}
          </p>
        </section>

        <section className={`p-5 ${cardCls}`}>
          <Title
            icon={FiShare2}
            title={translate("platformsTitle", { country: shortName })}
            subtitle={translate("platformsSubtitle")}
          />
          <div className="grid grid-cols-3 gap-3">
            {/* الأيقونات بألوان البراند، والنسب بألوان الباليت */}
            {details.platforms.map((p) => {
              const Icon = PLATFORM_ICONS[p.key];
              const iconColor =
                p.key === "tiktok"
                  ? isDark
                    ? "#FFFFFF"
                    : "#000000"
                  : PLATFORM_COLORS[p.key];
              const textColor = platformTextColors[p.key];

              return (
                <div
                  key={p.key}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center ${t.inner}`}
                >
                  <Icon size={20} color={iconColor} />
                  <span className={`text-xs ${t.subText}`}>{translate(`platforms.${p.key}`)}</span>
                  <span className="text-xl font-bold" style={{ color: textColor }}>
                    <bdi dir="ltr">{p.percent}%</bdi>
                  </span>
                  <span className={`text-[10px] ${t.mutedText}`}>
                    {nf.format(p.views)} {translate("viewsUnit")}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className={`mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-[11px] ${t.inner}`}
          >
            <span className={t.mutedText}>{translate("bestPlatformLabel")}</span>
            <span className="font-bold" style={{ color: t.yellow }}>
              {translate("bestPlatformValue", {
                platform: translate(`platforms.${details.bestPlatform.key}`),
                cpm: details.bestPlatform.cpm,
                currency: details.earnings.currency,
              })}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

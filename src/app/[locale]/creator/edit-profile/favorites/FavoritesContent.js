"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import FavoritesEmptyState from "./Favoritesemptystate";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiTrash2,
  FiHeart,
  FiInfo,
  FiSend,
  FiMapPin,
  FiFolder,
  FiGrid,
  FiMusic,
  FiPlay,
  FiBell,
  FiSliders,
  FiCheckCircle,
  FiRepeat,
} from "react-icons/fi";
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

/* ───────────── Data ───────────── */

const platformIcons = {
  youtube: { Icon: FaYoutube, color: "#FF0000" },
  tiktok: { Icon: FaTiktok, color: "white" },
  facebook: { Icon: FaFacebookF, color: "#1877F2" },
  instagram: { Icon: FaInstagram, color: "#E1306C" },
  x: { Icon: FaXTwitter, color: "currentColor" },
};

const countryFlags = {
  sa: "sa",
  ae: "ae",
  eg: "eg",
  kw: "kw",
  qa: "qa",
};

const initialCampaigns = [
  {
    id: 3,
    brand: "الزمرد للتمويل والاستثمار",
    category: "finance",
    translationKey: "emerald",
    countries: ["sa", "ae"],
    materialCount: 14,
    platforms: ["youtube", "tiktok", "facebook", "instagram", "x"],
    rate: 12,
    remaining: 4800,
    total: 10000,
    image: "/images/fashion.jpg",
    addedAt: 3,
  },
  {
    id: 2,
    brand: "الفروج للأزياء المحتشمة",
    category: "lifestyle",
    translationKey: "modestFashion",
    countries: ["sa", "ae"],
    materialCount: 14,
    platforms: ["instagram", "facebook", "tiktok"],
    rate: 1,
    remaining: 4800,
    total: 10000,
    image: "/images/fashion.jpg",
    addedAt: 2,
  },
  {
    id: 1,
    brand: "منصة وافر للادخار بالذهب",
    category: "technology",
    translationKey: "wafer",
    countries: ["sa", "ae"],
    materialCount: 14,
    platforms: ["instagram", "facebook", "tiktok"],
    rate: 1,
    remaining: 4800,
    total: 10000,
    image: "/images/fashion.jpg",
    addedAt: 1,
  },
];

const formatMoney = (n) => `$${n.toLocaleString("en-US")}`;
const formatRate = (n) => `$${n.toFixed(2)} / 1K`;

/* ───────────── Dropdown صغير ───────────── */

function Dropdown({
  value,
  options,
  onChange,
  icon,
  className = "",
  isDark,
  locale,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-xl border px-3 text-xs sm:text-sm cursor-pointer ${
          isDark
            ? "border-[#383838] bg-[#161616] text-[#E9C349]"
            : "border-[#D6D6D6] bg-white text-[#805500]"
        }`}
      >
        <span className="flex items-center gap-2 truncate whitespace-nowrap">
          {icon}
          <span className="truncate">{current.label}</span>
        </span>
        <FiChevronDown
          size={14}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          className={`absolute ${
            locale === "ar" ? "right-0" : "left-0"
          } top-full z-30 mt-1.5 min-w-full overflow-hidden rounded-xl border py-1 shadow-xl ${
            isDark
              ? "border-[#383838] bg-[#1A1A1A]"
              : "border-[#D6D6D6] bg-white"
          }`}
        >
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full whitespace-nowrap px-3 py-2 text-xs hover:bg-black/5 ${
                  locale === "ar" ? "text-right" : "text-left"
                } ${
                  o.value === value
                    ? isDark
                      ? "text-[#FFA600] font-bold"
                      : "text-[#805500] font-bold"
                    : isDark
                      ? "text-white"
                      : "text-[#333333]"
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────────── الصفحة ───────────── */

export default function FavoritesContent() {
  const { isDark } = useTheme();
  const translate = useTranslations("profile");
  const locale = useLocale();

  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const sortOptions = [
    { value: "newest", label: translate("favorites.sort.newest") },
    { value: "cpm_high", label: translate("favorites.sort.cpmHigh") },
    { value: "ending_soon", label: translate("favorites.sort.endingSoon") },
    {
      value: "ai_recommended",
      label: translate("favorites.sort.aiRecommended"),
    },
  ];
  const categoryOptions = [
    { value: "all", label: translate("favorites.categories.all") },
    { value: "lifestyle", label: translate("favorites.categories.lifestyle") },
    {
      value: "technology",
      label: translate("favorites.categories.technology"),
    },
    { value: "education", label: translate("favorites.categories.education") },
    {
      value: "entertainment",
      label: translate("favorites.categories.entertainment"),
    },
    { value: "finance", label: translate("favorites.categories.finance") },
    { value: "health", label: translate("favorites.categories.health") },
  ];

  const t = {
    text: isDark ? "text-white" : "text-[#171717]",
    subText: isDark ? "text-[#B0B0B0]" : "text-[#555555]",
    muted: isDark ? "text-[#A0A0A0]" : "text-[#595959]",
    cardBg: isDark ? "bg-[#141414]" : "bg-white",
    cardBorder: isDark ? "border-[#333333]" : "border-[#D6D6D6]",
    innerBg: isDark ? "bg-[#1C1C1C]" : "bg-[#F5F5F5]",
    toolbarBg: isDark ? "bg-[#111]" : "bg-white",
    inputBg: isDark ? "bg-[#161616]" : "bg-[#F5F5F5]",
    track: isDark ? "bg-[#2A2A2A]" : "bg-[#E5E5E5]",
    accent: isDark ? "text-[#E9C349]" : "text-[#805500]",
    accentIcon: isDark ? "text-[#94D3C1]" : "text-[#0B625A]",
    brand: isDark ? "text-[#FFA600]" : "text-[#8A4B00]",
    danger: isDark ? "text-[#FF6B3D]" : "text-[#B42318]",
    iconBtn: isDark
      ? "bg-[#1C1C1C] border-[#2D2D2D] text-[#9A9A9A] hover:text-white"
      : "bg-white border-[#D6D6D6] text-[#555555] hover:text-black",
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = campaigns.filter((campaign) => {
      const campaignTitle = translate(
        `favorites.campaigns.${campaign.translationKey}.title`,
      );
      const campaignDescription = translate(
        `favorites.campaigns.${campaign.translationKey}.description`,
      );

      return (
        (category === "all" || campaign.category === category) &&
        (!q ||
          campaign.brand.toLowerCase().includes(q) ||
          campaignTitle.toLowerCase().includes(q) ||
          campaignDescription.toLowerCase().includes(q))
      );
    });

    // تحديث الفرز بناءً على القيم الجديدة
    list = [...list].sort((a, b) => {
      if (sort === "cpm_high") {
        return b.rate - a.rate; // الأعلى عائداً / CPM
      }
      if (sort === "ending_soon") {
        return a.remaining - b.remaining; // الحملات التي نفذ ميزانيتها أو تقترب من النهاية أولاً
      }
      if (sort === "ai_recommended") {
        return b.id - a.id; // معيار افتراضي لترتيب الذكاء الاصطناعي
      }
      if (sort === "oldest") {
        return a.addedAt - b.addedAt; // الأقدم إضافة
      }
      return b.addedAt - a.addedAt; // الافتراضي: الأحدث إضافة (newest)
    });

    return list;
  }, [campaigns, query, category, sort, translate]);
  const allSelected =
    visible.length > 0 && visible.every((c) => selected.includes(c.id));

  function toggleSelect(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    setSelected(allSelected ? [] : visible.map((c) => c.id));
  }

  function removeOne(id) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    setSelected((prev) => prev.filter((i) => i !== id));
  }

  function removeSelected() {
    setCampaigns((prev) => prev.filter((c) => !selected.includes(c.id)));
    setSelected([]);
  }

  // القائمة فاضية تماماً → الصفحة التانية
  if (campaigns.length === 0) {
    return <FavoritesEmptyState />;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-3 py-6 sm:px-5 sm:py-8 lg:px-8">
      {/* العنوان */}
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className={`text-xl sm:text-2xl font-bold ${t.text}`}>
          {translate("favorites.title")}
        </h1>
        <p className={`text-xs sm:text-sm leading-6 max-w-[620px] ${t.subText}`}>
          {translate("favorites.description")}
        </p>
      </div>

     {/* شريط الأدوات */}
      <div
        className={`grid min-w-0 grid-cols-1 gap-2 rounded-2xl border p-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_160px_220px_auto_auto] xl:items-center ${t.toolbarBg} ${t.cardBorder}`}
      >
        {/* حقل البحث */}
        <div
          className={`col-span-1 flex h-9 min-w-0 items-center gap-1.5 rounded-xl border px-3 sm:col-span-2 xl:col-span-1 ${t.inputBg} ${t.cardBorder}`}
        >
          <FiSearch size={16} className={`shrink-0 ${t.subText}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={translate("favorites.searchPlaceholder")}
            className={`min-w-0 flex-1 border-none bg-transparent text-xs outline-none placeholder:text-[#707070] sm:text-sm ${t.text}`}
          />
        </div>

        {/* قائمة التصنيفات */}
        <Dropdown
          value={category}
          options={categoryOptions}
          onChange={setCategory}
          icon={<FiFilter size={14} />}
          className="w-full min-w-0"
          isDark={isDark}
          locale={locale}
        />

        {/* قائمة الترتيب */}
        <Dropdown
          value={sort}
          options={sortOptions}
          onChange={setSort}
          icon={<FiRepeat size={14} className="rotate-90" />}
          className="w-full min-w-0"
          isDark={isDark}
          locale={locale}
        />

        {/* تحديد الكل */}
          <label
            className={`flex min-h-9 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold sm:text-sm xl:whitespace-nowrap ${t.inputBg} ${t.cardBorder} ${t.text}`}
          >
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-3 w-3 shrink-0 accent-[#FE6B02] pointer-events-auto"
            />
            {translate("favorites.selectAll", { count: visible.length })}
          </label>

        {/* زر حذف المحدد */}
        <button
          type="button"
          onClick={removeSelected}
          disabled={selected.length === 0}
          className={`flex min-h-9 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors sm:text-sm ${
            isDark
              ? "border-[#FF4B04]/30 bg-[#FF4B04]/15 hover:bg-[#FF4B04]/25 disabled:hover:bg-[#FF4B04]/15"
              : "border-[#B42318]/25 bg-[#B42318]/5 hover:bg-[#B42318]/10 disabled:hover:bg-[#B42318]/5"
          } ${t.danger} cursor-pointer disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <FiTrash2 size={14} />
          {translate("favorites.removeSelected")}
        </button>
      </div>

      {/* الكروت */}
      {visible.length === 0 ? (
        <div
          className={`rounded-2xl border ${t.cardBg} ${t.cardBorder} px-6 py-12 text-center`}
        >
          <p className={`text-base font-bold ${t.text}`}>
            {translate("favorites.noResults")}
          </p>
          <p className={`mt-2 text-sm ${t.subText}`}>
            {translate("favorites.changeFilters")}
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {visible.map((campaign) => {
            const percent = Math.round(
              (campaign.remaining / campaign.total) * 100,
            );
            const isSelected = selected.includes(campaign.id);

            return (
              <article
                key={campaign.id}
                className={`flex flex-col overflow-hidden rounded-2xl border transition-colors ${t.cardBg} ${
                  isSelected
                    ? isDark
                      ? "border-[#FE6B02]"
                      : "border-[#B9480B]"
                    : t.cardBorder
                }`}
              >
                {/* الصورة */}
                <div className="relative h-[195px] shrink-0">
                  {campaign.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={campaign.image}
                      alt={translate(`favorites.campaigns.${campaign.translationKey}.title`)}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* القلب (إزالة من المفضلة) – أعلى يسار الصورة */}
                  <button
                    type="button"
                    aria-label={translate("favorites.removeFromFavorites")}
                    onClick={() => removeOne(campaign.id)}
                    className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-[#FF8A00] backdrop-blur-sm transition "
                  >
                    <FiHeart size={13} className="fill-current" />
                  </button>

                  {/* تحديد – أعلى يمين الصورة */}
                  <label className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/60 backdrop-blur-sm">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(campaign.id)}
                      className="sr-only"
                    />
                    <FiCheckCircle
                      size={14}
                      className={isSelected ? "text-[#FF4B04]" : "text-white/60"}
                    />
                  </label>
                </div>

                {/* المحتوى */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex flex-col gap-1.5">
                    <p className={`flex items-center gap-1.5 text-[11px] font-bold ${t.brand}`}>
                      <FiCheckCircle
                        size={12}
                        className={isDark ? "text-[#3B9EFF]" : "text-[#1D4ED8]"}
                      />
                      {campaign.brand}
                    </p>
                    <h2
                      className={`text-sm sm:text-[15px] font-bold leading-6 line-clamp-1 ${t.text}`}
                    >
                      {translate(`favorites.campaigns.${campaign.translationKey}.title`)}
                    </h2>
                    <p
                      className={`text-[11px] sm:text-xs leading-5 line-clamp-2 ${t.subText}`}
                    >
                      {translate(`favorites.campaigns.${campaign.translationKey}.description`)}
                    </p>
                  </div>

                  {/* صندوق التفاصيل */}
                  <div
                    className={`flex flex-col gap-2.5 rounded-xl p-3 text-[11px] ${t.innerBg}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex items-center gap-1.5 ${t.muted}`}>
                        <FiMapPin size={12} className={t.accentIcon}/>
                        {translate("favorites.countries.label")}
                      </span>
                      <span className={`flex min-w-0 flex-wrap items-center justify-end gap-2 ${t.text}`}>
                        {campaign.countries.map((country) => (
                          <span key={country} className="flex items-center gap-1">
                            {countryFlags[country] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={`https://flagcdn.com/w20/${countryFlags[country]}.png`}
                                alt=""
                                width={14}
                                height={10}
                                className="rounded-[2px]"
                              />
                            )}
                            {translate(`favorites.countries.${country}`)}
                          </span>
                        ))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex items-center gap-1.5 ${t.muted}`}>
                        <FiFolder size={12} className={t.accentIcon}/>
                        {translate("favorites.materials")}
                      </span>
                      <span className={`flex min-w-0 flex-wrap items-center justify-end gap-2 ${t.text}`}>
                        <span className="flex items-center gap-1">
                          <FiGrid size={12} className={t.accentIcon} />
                          {translate("favorites.rawClips", {
                            count: campaign.materialCount,
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMusic size={12} className={t.accentIcon} />
                          {translate("favorites.halalAudio")}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex items-center gap-1.5 ${t.muted}`}>
                        <FiPlay size={12} className={t.accentIcon}/>
                        {translate("favorites.platforms")}
                      </span>
                      <span className={`flex min-w-0 flex-wrap items-center justify-end gap-2 ${t.text}`}>
                        {campaign.platforms.map((p) => {
                          const cfg = platformIcons[p];
                          if (!cfg) return <FiBell key={p} size={12} />;
                          const { Icon, color } = cfg;
                          return (
                            <Icon
                              key={p}
                              size={12}
                              title={p}
                              style={
                                color === "currentColor"
                                  ? undefined
                                  : {
                                      color:
                                        color === "white" && !isDark
                                          ? "#171717"
                                          : color,
                                    }
                              }
                            />
                          );
                        })}
                      </span>
                    </div>
                  </div>

                  {/* العائد + التقدم */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className={t.muted}>
                        {translate("favorites.rateLabel")}
                      </span>
                      <span className={`text-sm font-extrabold ${t.accent}`} dir="ltr">
                        {formatRate(campaign.rate)}
                      </span>
                    </div>

                    <div className={`h-1.5 w-full overflow-hidden rounded-full ${t.track}`}>
                      <div
                        className={`h-full rounded-full ${
                          isDark ? "bg-[#94D3C1]" : "bg-[#0F766E]"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className={`flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[10px] ${t.muted}`}>
                      <span>
                        {translate("favorites.remaining")}:{" "}
                        <b className={t.text}>{formatMoney(campaign.remaining)}</b>
                      </span>
                      <span>
                        {translate("favorites.total")}:{" "}
                        <b className={t.text}>{formatMoney(campaign.total)}</b>
                      </span>
                    </div>
                  </div>

                  {/* الأزرار */}
                  <div className="mt-auto flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      className={`flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-bold text-white shadow-[0_6px_18px_-6px_rgba(255,90,0,0.6)] transition sm:text-sm cursor-pointer ${
                        isDark
                          ? "bg-gradient-to-l from-[#FE5703] to-[#FE9A01]"
                          : "bg-gradient-to-l from-[#FE5703] to-[#FE9A01]"
                      }`}
                    >
                      <FiSend size={14} className="rotate-45" />
                      {translate("favorites.applyNow")}
                    </button>
                    <button
                      type="button"
                      aria-label={translate("favorites.campaignDetails")}
                      className={`flex h-9 w-10 shrink-0 items-center justify-center rounded-xl border transition cursor-pointer ${t.iconBtn}`}
                    >
                      <FiInfo size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* بانر المراقبة والتنبيه */}
      <div
        className={`mt-2 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${t.toolbarBg} ${t.cardBorder}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#004D40] text-[#94D3C1]">
            <FiBell size={20} />
          </div>
          <div className="flex flex-col gap-1">
            <p className={`text-sm font-bold ${t.text}`}>
              {translate("favorites.alerts.title")}
            </p>
            <p className={`text-[11px] sm:text-xs leading-5 ${t.subText}`}>
              {translate("favorites.alerts.description")}
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition cursor-pointer ${t.iconBtn}`}
        >
          <FiSliders size={14} className={isDark ? "text-[#E9C349]" : "text-[#805500]"} />
          {translate("favorites.alerts.customize")}
        </button>
      </div>
    </div>
  );
}
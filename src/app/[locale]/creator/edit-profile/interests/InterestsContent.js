"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FaTiktok, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import {
  FiBookOpen,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiCpu,
  FiDollarSign,
  FiGlobe,
  FiGrid,
  FiHeart,
  FiLayers,
  FiPlayCircle,
  FiPlus,
  FiPlusCircle,
  FiRadio,
  FiRotateCcw,
  FiSave,
  FiShield,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiTruck,
  FiVideo,
} from "react-icons/fi";
import {
  getCreatorPreferences,
  updateCreatorPreferences,
} from "@/services/campaign";

/* ------------------------------------------------------------------ */
/* API-backed state: preferredContentTypes / preferredCountries / minCpm */
/* ------------------------------------------------------------------ */

const DEFAULT_PREFERENCES = {
  preferredContentTypes: [],
  preferredCountries: [],
  minCpm: 0,
};

const MAX_COUNTRIES = 30;
const MAX_CPM = 10;

function normalizePreferences(data = {}) {
  return {
    preferredContentTypes: Array.isArray(data.preferredContentTypes)
      ? data.preferredContentTypes
      : [],
    preferredCountries: Array.isArray(data.preferredCountries)
      ? data.preferredCountries
      : [],
    minCpm: Math.max(0, Number(data.minCpm) || 0),
  };
}

/* Each region card controls a group of ISO alpha-3 codes sent to the API */
const REGIONS = [
  {
    key: "SA",
    code: "SA",
    pct: 65,
    color: "#94D3C1",
    codes: ["SAU"],
  },
  {
    key: "AE",
    code: "AE",
    pct: 25,
    color: "#F5C451",
    codes: ["ARE"],
  },
  {
    key: "GULF",
    code: "KW",
    pct: 10,
    color: "#A1A1AA",
    bar: "#94D3C1",
    codes: ["KWT", "QAT", "BHR"],
  },
];

const REST_REGION = {
  key: "REST",
  codes: ["EGY", "JOR", "IRQ", "LBN", "MAR", "OMN"],
};

/* ------------------------------------------------------------------ */
/* UI-only data (no backend field yet)                                  */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: 1, titleKey: "categories.clipping", subKey: "categories.clippingHint", weight: 58, icon: FiVideo, on: false },
  { id: 2, titleKey: "categories.fintech", subKey: "categories.fintechHint", weight: 95, icon: FiTrendingUp, on: false },
  { id: 3, titleKey: "categories.ai", subKey: "categories.aiHint", weight: 92, icon: FiCpu, on: false },
  { id: 4, titleKey: "categories.faith", subKey: "categories.faithHint", weight: 96, icon: FiStar, on: false },
  { id: 5, titleKey: "categories.health", subKey: "categories.healthHint", weight: 85, icon: FiBriefcase, on: false },
  { id: 6, titleKey: "categories.documentaries", subKey: "categories.documentariesHint", weight: 80, icon: FiBookOpen, on: false },
  { id: 7, titleKey: "categories.books", subKey: "categories.booksHint", weight: 78, icon: FiLayers, on: false },
  { id: 8, titleKey: "categories.lifestyle", subKey: "categories.lifestyleHint", weight: 85, icon: FiHeart, on: false },
  { id: 9, titleKey: "categories.automotive", subKey: "categories.automotiveHint", weight: 60, icon: FiTruck, on: false },
];

const PLATFORMS = [
  { name: "Instagram Reels", noteKey: "platforms.instagram", icon: FaInstagram, color: "#E1306C" },
  { name: "TikTok Shorts", noteKey: "platforms.tiktok", icon: FaTiktok, color: "#FFFFFF" },
  { name: "YouTube Shorts", noteKey: "platforms.youtube", icon: FaYoutube, color: "#FF2D2D" },
  { name: "X", noteKey: "platforms.x", icon: FaXTwitter, color: "#A1A1AA" },
];

const BUDGETS = [
  { value: "high", labelKey: "budgets.high" },
  { value: "mid", labelKey: "budgets.medium" },
  { value: "low", labelKey: "budgets.economical" },
];

const card =
  "rounded-2xl border border-[#DCE5E1] bg-white shadow-sm dark:border-[#2D3132] dark:bg-[#191C1D] dark:shadow-none";

function SectionTitle({ icon: Icon, children, tint = "#94D3C1" }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: `${tint}22`, color: tint }}
      >
        <Icon size={17} />
      </span>
      <h2 className="text-base font-bold text-gray-900 dark:text-white">{children}</h2>
    </div>
  );
}

export default function InterestsContent() {
  const locale = useLocale();
  const t = useTranslations("creatorDashboard.creatorInterests");
  /* API state */
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  /* UI-only state */
  const [cats, setCats] = useState(CATEGORIES);
  const [custom, setCustom] = useState("");
  const [budget, setBudget] = useState("high");

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getCreatorPreferences();
      setPreferences(normalizePreferences(response?.data));
    } catch (loadError) {
      setError(loadError?.message || t("errors.load"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const savePreferences = async (next = preferences) => {
    setIsSaving(true);
    setError("");
    setNotice("");
    const payload = {
      preferredContentTypes: next.preferredContentTypes,
      preferredCountries: next.preferredCountries,
      minCpm: Math.max(0, Number(next.minCpm) || 0),
    };

    try {
      const response = await updateCreatorPreferences(payload);
      setPreferences(normalizePreferences(response?.data ?? payload));
      setNotice(t("saveSuccess"));
    } catch (saveError) {
      setError(saveError?.message || t("errors.save"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCats(CATEGORIES);
    setCustom("");
    setBudget("high");
    savePreferences(DEFAULT_PREFERENCES);
  };

  /* Regions <-> preferredCountries */
  const isRegionOn = (region) =>
    region.codes.some((code) => preferences.preferredCountries.includes(code));

  const toggleRegion = (region) => {
    setNotice("");
    setError("");
    setPreferences((current) => {
      const on = region.codes.some((c) => current.preferredCountries.includes(c));
      if (on) {
        return {
          ...current,
          preferredCountries: current.preferredCountries.filter(
            (c) => !region.codes.includes(c)
          ),
        };
      }
      const merged = [
        ...current.preferredCountries,
        ...region.codes.filter((c) => !current.preferredCountries.includes(c)),
      ];
      if (merged.length > MAX_COUNTRIES) {
        setError(t("errors.countryLimit", { count: MAX_COUNTRIES }));
        return current;
      }
      return { ...current, preferredCountries: merged };
    });
  };

  /* minCpm */
  const setMinCpm = (value) => {
    setNotice("");
    setPreferences((current) => ({ ...current, minCpm: value }));
  };
  const cpmNumber = Math.max(0, Number(preferences.minCpm) || 0);
  const cpmProgress = Math.min(100, (cpmNumber / MAX_CPM) * 100);

  /* UI-only categories */
  const toggleCat = (id) =>
    setCats((list) => list.map((x) => (x.id === id ? { ...x, on: !x.on } : x)));

  const addCustomCategory = () => {
    const title = custom.trim();
    if (!title) return;
    setCats((list) => [
      ...list,
      { id: Date.now(), title, sub: t("categories.customTag"), weight: 50, icon: FiStar, on: true },
    ]);
    setCustom("");
  };

  const enabled = cats.filter((c) => c.on).length;
  const busy = isLoading || isSaving;

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-full w-full bg-[#EFF4F2] px-3 py-6 font-tajawal text-gray-900 transition-colors duration-200 dark:bg-[#0D0F10] dark:text-white sm:px-5 sm:py-8 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* Header */}
        <header className={`${card} flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{t("title")}</h1>
            <p className="max-w-2xl text-xs leading-6 text-gray-500 dark:text-[#A1A1AA] sm:text-sm">
              {t("description")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-52">
            <button
              type="button"
              onClick={() => savePreferences()}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#FEA639] to-[#FB6505] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FE6B02]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSave size={14} />
              <span>{isSaving ? t("saving") : t("save")}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={busy}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-xs text-gray-600 transition hover:bg-gray-200 hover:text-gray-900 dark:border-[#2D3132] dark:bg-[#141718] dark:text-[#A1A1AA] dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRotateCcw size={12} />
              <span>{t("reset")}</span>
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200"
          >
            <span>{error}</span>
            <button type="button" onClick={loadPreferences} className="font-semibold underline underline-offset-4">
              {t("retry")}
            </button>
          </div>
        )}
        {notice && (
          <p
            role="status"
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:border-[#94D3C1]/30 dark:bg-[#94D3C1]/10 dark:text-[#B9E9DB]"
          >
            {notice}
          </p>
        )}

        {isLoading ? (
          <div className={`${card} p-6 text-sm text-gray-500 dark:text-[#A1A1AA]`} aria-live="polite">
            {t("loading")}
          </div>
        ) : (
          <>
            {/* System intro */}
            <div className="space-y-2 px-1">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">{t("system.title")}</h2>
              <p className="max-w-3xl text-xs leading-6 text-gray-500 dark:text-[#A1A1AA] sm:text-sm">
                {t("system.description")}
              </p>
            </div>

            {/* 1. Categories */}
            <section className={`${card} p-5 sm:p-6`}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#94D3C1]/20 text-[#1F7A5C] dark:bg-[#94D3C1]/15 dark:text-[#94D3C1]">
                    <FiGrid size={17} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">{t("categories.title")}</h2>
                    <p className="mt-0.5 text-[11px] text-gray-500 dark:text-[#89938F]">{t("categories.description")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="rounded-md border border-[#94D3C1]/40 bg-[#94D3C1]/15 px-2.5 py-1 font-semibold text-[#146350] dark:border-[#94D3C1]/30 dark:bg-[#94D3C1]/10 dark:text-[#94D3C1]">
                    {t("categories.enabled", { count: enabled })}
                  </span>
                  <span className="rounded-md border border-[#F5C451]/40 bg-[#F5C451]/15 px-2.5 py-1 font-semibold text-[#926000] dark:border-[#F5C451]/30 dark:bg-[#F5C451]/10 dark:text-[#F5C451]">
                    {t("categories.priority")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cats.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleCat(c.id)}
                      aria-pressed={c.on}
                      className={`flex flex-col gap-3 rounded-2xl border p-3.5 text-right transition ${c.on
                          ? "border-r-[5px] border-[#E9D3B5] border-r-[#E68A12] bg-[#FFF8EF] shadow-sm dark:border-[#FFA600]/50 dark:border-r-[#FFA600] dark:bg-[#181C1D] dark:shadow-none"
                          : "border-dashed border-[#D5DFDA] bg-[#F6F9F7] hover:border-[#AEBEB6] dark:border-[#3A3F40] dark:bg-[#131617] dark:opacity-70 dark:hover:border-[#5A6162] dark:hover:opacity-100"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.on
                              ? "bg-[#FFA600]/20 text-[#D97706] dark:text-[#FFA600]"
                              : "bg-gray-200 text-gray-500 dark:bg-[#222728] dark:text-[#68716F]"
                            }`}
                        >
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-gray-900 dark:text-[#E4E4E7]">{c.titleKey ? t(c.titleKey) : c.title}</p>
                          <p className={`mt-1 truncate text-[11px] ${c.on ? "text-[#D97706] dark:text-[#FFA600]" : "text-gray-500 dark:text-[#89938F]"}`}>
                            {c.subKey ? t(c.subKey) : c.sub}
                          </p>
                        </div>
                        {c.on ? (
                          <FiCheckCircle size={20} className="text-[#D97706] dark:text-[#FFA600]" />
                        ) : (
                          <FiPlusCircle size={20} className="text-gray-400 dark:text-[#6B7374]" />
                        )}
                      </div>
                      <div className="border-t border-gray-200 dark:border-[#262B2C] pt-3">
                        <div className="flex items-center gap-2.5 text-[10px] text-gray-500 dark:text-[#A1A1AA]">
                          <span className="shrink-0">{t("categories.weight")}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-[#2A2F30]">
                            <div
                              className={`h-full rounded-full ${c.on ? "bg-[#FFA600]" : "bg-gray-400 dark:bg-[#4A5051]"}`}
                              style={{ width: `${c.weight}%` }}
                            />
                          </div>
                          <span className={`shrink-0 text-xs font-bold ${c.on ? "text-[#D97706] dark:text-[#FFA600]" : "text-gray-500 dark:text-[#68716F]"}`}>
                            {c.weight}%
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-[#353A3B] dark:bg-[#101313] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#94D3C1]/20 text-[#1F7A5C] dark:bg-[#94D3C1]/15 dark:text-[#94D3C1]">
                    <FiPlus size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t("categories.customTitle")}</p>
                    <p className="text-[10px] text-gray-500 dark:text-[#89938F]">{t("categories.customDescription")}</p>
                  </div>
                </div>
                <div className="flex flex-1 items-center gap-2 sm:max-w-md">
                  <input
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomCategory();
                      }
                    }}
                    placeholder={t("categories.customPlaceholder")}
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#1F7A5C] dark:border-[#353A3B] dark:bg-[#191C1D] dark:text-white dark:focus:border-[#94D3C1]"
                  />
                  <button
                    type="button"
                    onClick={addCustomCategory}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1F7A5C] px-3.5 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                  >
                    <FiPlus size={12} />
                    {t("categories.add")}
                  </button>
                </div>
              </div>
            </section>

            {/* Pillars */}
            <section className={`${card} p-5 sm:p-6`}>
              <div className="mb-1">
                <SectionTitle icon={FiTarget} tint="#A1A1AA">{t("pillars.title")}</SectionTitle>
              </div>
              <p className="mb-5 text-[11px] text-gray-500 dark:text-[#89938F]">{t("pillars.description")}</p>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-[#2D3132] dark:bg-[#101313]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                      <FiShield className="text-[#1F7A5C] dark:text-[#94D3C1]" size={14} /> {t("pillars.sharia")}
                    </span>
                    <span className="rounded bg-[#94D3C1]/20 px-2 py-0.5 text-[10px] font-semibold text-[#146350] dark:bg-[#94D3C1]/15 dark:text-[#94D3C1]">{t("pillars.strict")}</span>
                  </div>
                  <p className="mb-3 text-[11px] leading-5 text-gray-500 dark:text-[#89938F]">
                    {t("pillars.shariaDescription")}
                  </p>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-[#2A2F30]">
                    <div className="h-full w-full rounded-full bg-[#1F7A5C] dark:bg-[#94D3C1]" />
                  </div>
                  <p className="mt-2 text-[10px] font-medium text-[#146350] dark:text-[#94D3C1]">{t("pillars.filterEnabled")}</p>
                </div>

                {/* minCpm -> API */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-[#2D3132] dark:bg-[#101313]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                      <FiDollarSign className="text-[#B45309] dark:text-[#F5C451]" size={14} /> {t("pillars.minimumCpm")}
                    </span>
                    <span className="rounded bg-[#F5C451]/20 px-2 py-0.5 text-[10px] font-semibold text-[#926000] dark:bg-[#F5C451]/15 dark:text-[#F5C451]">
                      ${cpmNumber.toFixed(2)} / 1K
                    </span>
                  </div>
                  <p className="mb-3 text-[11px] leading-5 text-gray-500 dark:text-[#89938F]">
                    {t("pillars.cpmDescription")}
                  </p>
                  <input
                    type="range"
                    min="0"
                    max={MAX_CPM}
                    step="0.5"
                    value={Math.min(cpmNumber, MAX_CPM)}
                    onChange={(e) => setMinCpm(e.target.value)}
                    aria-label={t("pillars.minimumCpm")}
                    className="h-1.5 w-full cursor-pointer accent-[#D97706] dark:accent-[#F5C451]"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-gray-500 dark:text-[#89938F]">
                    <span>$0.00</span>
                    <span>${MAX_CPM.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      id="minimum-cpm"
                      type="number"
                      min="0"
                      step="0.01"
                      value={preferences.minCpm}
                      onChange={(e) => setMinCpm(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-[#D97706] dark:border-[#353A3B] dark:bg-[#191C1D] dark:text-white dark:focus:border-[#F5C451]"
                    />
                    <span className="text-[10px] font-semibold text-[#B45309] dark:text-[#F5C451]">CPM</span>
                  </div>
                  <span className="sr-only">{cpmProgress}%</span>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-[#2D3132] dark:bg-[#101313]">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                    <FiBriefcase className="text-[#1F7A5C] dark:text-[#94D3C1]" size={14} /> {t("pillars.budget")}
                  </div>
                  <p className="mb-3 text-[11px] leading-5 text-gray-500 dark:text-[#89938F]">
                    {t("pillars.budgetDescription")}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                    {BUDGETS.map((b) => (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => setBudget(b.value)}
                        aria-pressed={budget === b.value}
                        className={`rounded-md py-1.5 transition ${budget === b.value
                            ? "bg-gradient-to-r from-[#FEA639] to-[#FB6505] text-white"
                            : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-[#353A3B] dark:bg-transparent dark:text-[#A1A1AA] dark:hover:text-white"
                          }`}
                      >
                        {t(b.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom two columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Geo -> preferredCountries */}
              <section className={`${card} p-5 sm:p-6`}>
                <div className="mb-1">
                  <SectionTitle icon={FiGlobe} tint="#A1A1AA">{t("regions.title")}</SectionTitle>
                </div>
                  <p className="mb-5 text-[11px] text-gray-500 dark:text-[#89938F]">{t("regions.description")}</p>

                <div className="flex flex-col gap-3">
                  {REGIONS.map((r) => {
                    const on = isRegionOn(r);
                    return (
                      <div
                        key={r.key}
                      className={`rounded-xl border p-3.5 transition dark:border-[#2D3132] dark:bg-[#101313] ${on
                          ? "border-[#C9DED5] bg-[#F0F8F4]"
                          : "border-[#E1E8E4] bg-[#F8FAF9]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleRegion(r)}
                            aria-pressed={on}
                            aria-label={t(`regions.${r.key}.name`)}
                            className="shrink-0"
                          >
                            <FiCheckCircle size={16} className={on ? "text-[#1F7A5C] dark:text-[#94D3C1]" : "text-gray-300 dark:text-[#3A3F40]"} />
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{t(`regions.${r.key}.name`)}</p>
                            <p className="truncate text-[10px] text-gray-500 dark:text-[#89938F]">{t(`regions.${r.key}.note`)}</p>
                          </div>
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${r.key === "AE"
                                ? "text-[#926000] dark:text-[#F5C451]"
                                : r.key === "GULF"
                                  ? "text-gray-700 dark:text-[#A1A1AA]"
                                  : "text-[#146350] dark:text-[#94D3C1]"
                              }`}
                            style={{ background: `${r.color}22` }}
                          >
                            {t("regions.active", { percent: r.pct })}
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-[10px] font-bold text-gray-700 dark:bg-[#222728] dark:text-[#A1A1AA]">
                            {r.code}
                          </span>
                        </div>
                        <div className="mt-3 h-1.5 rounded-full bg-gray-200 dark:bg-[#2A2F30]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${r.pct}%`, background: r.bar || r.color }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-3.5 dark:border-[#353A3B] dark:bg-[#101313]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-200 text-gray-600 dark:bg-[#222728] dark:text-[#A1A1AA]">
                      <FiGlobe size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{t("regions.REST.name")}</p>
                      <p className="text-[10px] text-gray-500 dark:text-[#89938F]">{t("regions.REST.note")}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleRegion(REST_REGION)}
                      aria-pressed={isRegionOn(REST_REGION)}
                      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition ${isRegionOn(REST_REGION)
                          ? "border-[#1F7A5C]/40 bg-[#1F7A5C]/10 text-[#1F7A5C] dark:border-[#94D3C1]/50 dark:bg-[#94D3C1]/10 dark:text-[#94D3C1]"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-[#353A3B] dark:bg-[#191C1D] dark:text-[#A1A1AA] dark:hover:text-white"
                        }`}
                    >
                      {isRegionOn(REST_REGION) ? <FiCheck size={10} /> : <FiPlus size={10} />}
                      {isRegionOn(REST_REGION) ? t("regions.enabled") : t("regions.enable")}
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-[11px] text-gray-500 dark:text-[#68716F]">
                  {t("regions.selectedCountries", {
                    selected: preferences.preferredCountries.length,
                    max: MAX_COUNTRIES,
                  })}
                </p>
              </section>

              {/* Platforms */}
              <section className={`${card} p-5 sm:p-6`}>
                <div className="mb-1">
                  <SectionTitle icon={FiPlayCircle}>{t("platforms.title")}</SectionTitle>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[11px] text-gray-500 dark:text-[#89938F]">{t("platforms.description")}</p>
                  <span className="rounded bg-[#94D3C1]/20 px-2 py-0.5 text-[10px] font-semibold text-[#146350] dark:bg-[#94D3C1]/15 dark:text-[#94D3C1]">{t("platforms.activeCount", { count: PLATFORMS.length })}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {PLATFORMS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.name}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-3 dark:border-[#2D3132] dark:bg-[#101313]"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-200/80 dark:bg-[#222728]"
                          style={{ color: p.color }}
                        >
                          <Icon size={20} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-gray-900 dark:text-white">{p.name}</p>
                          <p className="truncate text-[10px] text-gray-500 dark:text-[#89938F]">{t(p.noteKey)}</p>
                        </div>
                        <FiCheckCircle className="shrink-0 text-[#1F7A5C] dark:text-[#94D3C1]" size={16} />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-[#2D3132] pt-3 text-[11px] text-gray-500 dark:text-[#89938F]">
                  <span className="flex items-center gap-2">
                    <FiRadio size={14} /> {t("platforms.podcast")}
                  </span>
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-[#222728] dark:text-[#A1A1AA]">{t("platforms.optional")}</span>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
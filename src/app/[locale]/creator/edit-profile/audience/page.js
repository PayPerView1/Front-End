"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AudienceHeader from "./components/AudienceHeader";
import AudienceStats from "./components/AudienceStats";
import CountriesRanking from "./components/CountriesRanking";
import LiveMap from "./components/LiveMap";
import GrowthTips from "./components/GrowthTips";
import CountryDetails from "./components/CountryDetails";
import InsufficientData from "./components/InsufficientData";

// الحد الأدنى للمشاهدات الموثقة لتفعيل التوزيع الجغرافي
const MIN_VERIFIED_VIEWS = 500;

// ===== بيانات تجريبية — استبدليها ببيانات الـ API =====
// لتجربة حالة "البيانات غير كافية": اجعلي totalVerifiedViews = 120
const MOCK_STATS = {
  totalVerifiedViews: 517482,
  verifiedRate: 100,
  arabAudienceRate: 99.4,
  topCities: ["الرياض", "جدة", "القاهرة"],
  weeklyGrowth: 18.4,
};

const MOCK_COUNTRIES = [
  { code: "sa", views: 310489, percent: 60, growth: 14.2, tag: "biggest",
    topCities: [{ name: "الرياض", percent: 34 }, { name: "جدة", percent: 18 }] },
  { code: "eg", views: 103496, percent: 20, growth: 28.5, tag: "fastestGrowth",
    topCities: [{ name: "القاهرة", percent: 12 }, { name: "الإسكندرية", percent: 5 }] },
  { code: "ae", views: 51748, percent: 10, growth: 4.1, tag: "steady",
    topCities: [{ name: "دبي", percent: 7 }, { name: "أبوظبي", percent: 3 }] },
  { code: "kw", views: 25874, percent: 5, growth: 1.8, tag: "positive",
    topCities: [{ name: "مدينة الكويت", percent: 4 }] },
  { code: "other", views: 25875, percent: 5, growth: null, tag: "global",
    names: ["قطر", "سلطنة عمان", "البحرين", "بريطانيا"] },
];

const MOCK_TIPS = {
  bestTime: { country: "sa", percent: 60, from: "7:00 مساءً", to: "11:00 مساءً", zone: "مكة المكرمة" },
  growth: { country: "eg", rate: 72 },
};

// تفاصيل دولة — نفس الشكل لكل الدول مؤقتاً حتى يجهز الـ API
function buildMockDetails(country) {
  return {
    views: country.views,
    peakHours: "08:00 م - 11:30 م",
    earnings: { amount: "4,502.09", currency: "ر.س", cpm: "14.50" },
    completion: 84.2,
    engagement: { rate: 9.6, delta: "+2.1" },
    reliability: 99.8,
    cities: [
      { name: "الرياض", desc: "العاصمة والمركز الأكبر", views: 105566, percent: 34 },
      { name: "جدة", desc: "المنطقة الغربية", views: 55888, percent: 18 },
      { name: "المنطقة الشرقية / الدمام", desc: "عاصمة الدمام والخبر", views: 24839, percent: 8 },
      { name: "مكة المكرمة", desc: "العاصمة المقدسة", views: 12419, percent: 4 },
      { name: "المدينة المنورة", desc: "طيبة الطيبة", views: 6210, percent: 2 },
    ],
    mapPoints: [
      { label: "الرياض: 105.5K", x: 62, y: 38, color: "#94D3C1" },
      { label: "الغربية: 74.5K", x: 30, y: 68, color: "#FACC15" },
    ],
    ages: [
      { key: "young", percent: 42 },
      { key: "mid", percent: 38 },
      { key: "senior", percent: 20 },
    ],
    platforms: [
      { key: "tiktok", percent: 52, views: 161454 },
      { key: "instagram", percent: 32, views: 99355 },
      { key: "youtube", percent: 16, views: 49670 },
    ],
    bestPlatform: { key: "tiktok", cpm: "15.80" },
  };
}

// تنزيل ملف CSV (مع BOM ليفتح العربي صح في Excel)
function downloadCsv(filename, rows) {
  const esc = (v) => {
    const str = String(v ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const csv = rows.map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AudiencePage() {
  const [period, setPeriod] = useState("30d"); // "full" | "7d" | "30d"
  const [selectedCode, setSelectedCode] = useState(null);
  const translate = useTranslations("Audience");

  const stats = MOCK_STATS;
  const countries = MOCK_COUNTRIES;
  const hasEnoughData = stats.totalVerifiedViews >= MIN_VERIFIED_VIEWS;
  const selected = countries.find((c) => c.code === selectedCode);

  const handleExport = () => {
    const periodKey = { full: "periodFull", "7d": "period7", "30d": "period30" }[period];

    const rows = [
      [translate("title")],
      [translate(periodKey)],
      [],
      [translate("totalViews"), stats.totalVerifiedViews],
      [translate("arabRate"), `${stats.arabAudienceRate}%`],
      [translate("topCities"), stats.topCities.join(" / ")],
      [translate("weeklyGrowth"), `${stats.weeklyGrowth}%`],
      [],
      [translate("rankingTitle")],
      ...countries.map((c) => [
        translate(`countriesShort.${c.code}`),
        c.views,
        `${c.percent}%`,
        c.growth != null ? `+${c.growth}%` : "",
      ]),
    ];

    // لو في دولة محددة نضيف تفاصيلها
    if (selected) {
      const d = buildMockDetails(selected);
      rows.push(
        [],
        [translate("selectedCountry"), translate(`countries.${selected.code}`)],
        [translate("citiesTitle")],
        ...d.cities.map((c) => [c.name, c.views, `${c.percent}%`]),
        [],
        [translate("platformsTitle", { country: translate(`countriesShort.${selected.code}`) })],
        ...d.platforms.map((p) => [translate(`platforms.${p.key}`), p.views, `${p.percent}%`])
      );
    }

    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`audience-report-${period}-${date}.csv`, rows);
  };

  // شاشة تفاصيل الدولة
    if (hasEnoughData && selected) {
    return (
      <div className="@container w-full min-w-0">
        <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <CountryDetails
            country={selected}
            countries={countries}
            details={buildMockDetails(selected)}
            onSelect={setSelectedCode}
            onBack={() => setSelectedCode(null)}
          />
        </div>
      </div>
    );
  }

    return (
    <div className="@container w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <AudienceHeader
          period={period}
          onPeriodChange={setPeriod}
          onExport={handleExport}
          disabled={!hasEnoughData}
        />

        <AudienceStats stats={stats} />

        {hasEnoughData ? (
          <div className="grid grid-cols-1 items-start gap-5 @4xl:grid-cols-12">
            <div className="@4xl:col-span-5">
              <CountriesRanking countries={countries} onSelect={setSelectedCode} />
            </div>
            <div className="flex flex-col gap-5 @4xl:col-span-7">
              <LiveMap countries={countries} coverage={stats.verifiedRate} />
              <GrowthTips tips={MOCK_TIPS} />
            </div>
          </div>
        ) : (
          <InsufficientData
            current={stats.totalVerifiedViews}
            required={MIN_VERIFIED_VIEWS}
            onRefresh={() => {}}
            onViewReport={() => {}}
            onTips={() => {}}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { FiCheck, FiGlobe, FiRotateCcw, FiSliders } from "react-icons/fi";
import {
  getCreatorPreferences,
  updateCreatorPreferences,
} from "@/services/campaign";

const DEFAULT_PREFERENCES = {
  preferredContentTypes: [],
  preferredCountries: [],
  minCpm: 0,
};

const CONTENT_TYPES = [
  { value: "CLIPPING", label: "مقاطع قصيرة" },
  { value: "UGC", label: "محتوى من إنشاء المستخدم" },
  { value: "SLIDESHOW", label: "عرض شرائح" },
  { value: "AUDIO", label: "محتوى صوتي" },
  { value: "LOGO", label: "تصميم شعارات" },
  { value: "MIXED", label: "محتوى متنوع" },
];

const COUNTRIES = [
  { value: "SAU", label: "السعودية" },
  { value: "ARE", label: "الإمارات" },
  { value: "KWT", label: "الكويت" },
  { value: "QAT", label: "قطر" },
  { value: "BHR", label: "البحرين" },
  { value: "OMN", label: "عُمان" },
  { value: "EGY", label: "مصر" },
  { value: "JOR", label: "الأردن" },
  { value: "IRQ", label: "العراق" },
  { value: "LBN", label: "لبنان" },
  { value: "MAR", label: "المغرب" },
  { value: "TUR", label: "تركيا" },
  { value: "USA", label: "الولايات المتحدة" },
  { value: "GBR", label: "المملكة المتحدة" },
];

const COUNTRY_ALPHA2_TO_ALPHA3 = {
  SA: "SAU",
  AE: "ARE",
  KW: "KWT",
  QA: "QAT",
  BH: "BHR",
  OM: "OMN",
  EG: "EGY",
  JO: "JOR",
  IQ: "IRQ",
  LB: "LBN",
  MA: "MAR",
  TR: "TUR",
  US: "USA",
  GB: "GBR",
};

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

function toggleSelection(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function InterestsContent() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [countryCodeInput, setCountryCodeInput] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getCreatorPreferences();
      setPreferences(normalizePreferences(response?.data));
    } catch (loadError) {
      setError(loadError?.message || "تعذر تحميل تفضيلاتك حالياً.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const savePreferences = async (nextPreferences = preferences) => {
    setIsSaving(true);
    setError("");
    setNotice("");
    const payload = {
      preferredContentTypes: nextPreferences.preferredContentTypes,
      preferredCountries: nextPreferences.preferredCountries,
      minCpm: Math.max(0, Number(nextPreferences.minCpm) || 0),
    };

    try {
      const response = await updateCreatorPreferences(payload);
      setPreferences(normalizePreferences(response?.data ?? payload));
      setNotice("تم حفظ تفضيلاتك وتحديث معايير التوصيات.");
    } catch (saveError) {
      setError(saveError?.message || "تعذر حفظ التفضيلات. حاول مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleContentType = (value) => {
    setNotice("");
    setPreferences((current) => ({
      ...current,
      preferredContentTypes: toggleSelection(current.preferredContentTypes, value),
    }));
  };

  const toggleCountry = (value) => {
    const isSelected = preferences.preferredCountries.includes(value);
    if (!isSelected && preferences.preferredCountries.length >= 30) {
      setCountryCodeError("يمكن اختيار 30 دولة كحد أقصى.");
      return;
    }

    setNotice("");
    setCountryCodeError("");
    setPreferences((current) => ({
      ...current,
      preferredCountries: toggleSelection(current.preferredCountries, value),
    }));
  };

  const addCountryCode = () => {
    const inputCode = countryCodeInput.trim().toUpperCase();
    if (!/^[A-Z]{2,3}$/.test(inputCode)) {
      setCountryCodeError("أدخل رمز دولة من حرفين أو ثلاثة أحرف، مثل SA أو SAU.");
      return;
    }

    const countryCode = COUNTRY_ALPHA2_TO_ALPHA3[inputCode] || inputCode;
    if (preferences.preferredCountries.includes(countryCode)) {
      setCountryCodeError("هذه الدولة موجودة بالفعل ضمن اختياراتك.");
      return;
    }
    if (preferences.preferredCountries.length >= 30) {
      setCountryCodeError("يمكن اختيار 30 دولة كحد أقصى.");
      return;
    }

    setCountryCodeError("");
    setCountryCodeInput("");
    toggleCountry(countryCode);
  };

  const handleReset = () => savePreferences(DEFAULT_PREFERENCES);

  return (
    <main dir="rtl" className="min-h-full w-full px-3 py-6 font-tajawal text-white sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-2xl border border-[#2D3132] bg-[#191C1D] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold sm:text-2xl">التوصيات والاهتمامات</h1>
            <p className="max-w-2xl text-xs leading-6 text-[#A1A1AA] sm:text-sm">
              اختر أنواع المحتوى والدول التي تهمك، وحدد أقل عائد CPM تقبله لتخصيص الحملات المقترحة لك.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => savePreferences()}
              disabled={isLoading || isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FEA639] to-[#FB6505] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FE6B02]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiCheck size={15} />
              <span>{isSaving ? "جارٍ الحفظ..." : "حفظ التفضيلات"}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading || isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#353A3B] px-3 py-2.5 text-xs text-[#A1A1AA] transition hover:border-[#94D3C1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRotateCcw size={13} />
              <span>إعادة الضبط</span>
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <span>{error}</span>
            <button type="button" onClick={loadPreferences} className="font-semibold underline underline-offset-4">
              إعادة المحاولة
            </button>
          </div>
        )}
        {notice && (
          <p role="status" className="rounded-xl border border-[#94D3C1]/30 bg-[#94D3C1]/10 px-4 py-3 text-sm text-[#B9E9DB]">
            {notice}
          </p>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-[#2D3132] bg-[#191C1D] p-6 text-sm text-[#A1A1AA]" aria-live="polite">
            جارٍ تحميل تفضيلاتك...
          </div>
        ) : (
          <>
            <section className="rounded-2xl border border-[#2D3132] bg-[#191C1D] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[#2D3132] pb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#94D3C1]/15 text-[#94D3C1]">
                  <FiSliders size={17} />
                </span>
                <div>
                  <h2 className="text-sm font-bold sm:text-base">أنواع المحتوى</h2>
                  <p className="mt-1 text-xs text-[#89938F]">حدد نوع المحتوى الذي ترغب باستلام حملات له.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CONTENT_TYPES.map((type) => {
                  const checked = preferences.preferredContentTypes.includes(type.value);
                  return (
                    <label
                      key={type.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                        checked ? "border-[#94D3C1]/70 bg-[#94D3C1]/10" : "border-[#303637] bg-[#101313] hover:border-[#58605E]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleContentType(type.value)}
                        className="h-4 w-4 accent-[#94D3C1]"
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                      <span className="mr-auto text-[10px] text-[#68716F]">{type.value}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-[#2D3132] bg-[#191C1D] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[#2D3132] pb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#94D3C1]/15 text-[#94D3C1]">
                  <FiGlobe size={17} />
                </span>
                <div>
                  <h2 className="text-sm font-bold sm:text-base">الدول المستهدفة</h2>
                  <p className="mt-1 text-xs text-[#89938F]">اختر الدول التي يوجد فيها جمهورك (يمكن اختيار حتى 30 دولة).</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {COUNTRIES.map((country) => {
                  const checked = preferences.preferredCountries.includes(country.value);
                  return (
                    <label
                      key={country.value}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 transition ${
                        checked ? "border-[#94D3C1]/70 bg-[#94D3C1]/10" : "border-[#303637] bg-[#101313] hover:border-[#58605E]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCountry(country.value)}
                        className="h-4 w-4 accent-[#94D3C1]"
                      />
                      <span className="text-sm">{country.label}</span>
                    </label>
                  );
                })}
              </div>
              {preferences.preferredCountries.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2" aria-label="الدول المختارة">
                  {preferences.preferredCountries.map((code) => {
                    const country = COUNTRIES.find((item) => item.value === code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleCountry(code)}
                        className="rounded-full border border-[#94D3C1]/30 bg-[#94D3C1]/10 px-3 py-1.5 text-xs text-[#B9E9DB] transition hover:border-red-400/50 hover:text-red-200"
                        aria-label={`إزالة ${country?.label || code}`}
                      >
                        {country?.label || code} <span aria-hidden="true">×</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 flex max-w-md flex-wrap gap-2">
                <input
                  type="text"
                  value={countryCodeInput}
                  maxLength={3}
                  onChange={(event) => setCountryCodeInput(event.target.value.toUpperCase())}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCountryCode();
                    }
                  }}
                  placeholder="رمز ISO مثل SAU"
                  aria-label="رمز الدولة"
                  className="min-w-0 flex-1 rounded-xl border border-[#353A3B] bg-[#101313] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#94D3C1]"
                />
                <button
                  type="button"
                  onClick={addCountryCode}
                  disabled={preferences.preferredCountries.length >= 30}
                  className="rounded-xl border border-[#353A3B] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#94D3C1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  إضافة رمز
                </button>
              </div>
              {countryCodeError && <p role="alert" className="mt-2 text-xs text-red-300">{countryCodeError}</p>}
              <p className="mt-3 text-[11px] text-[#68716F]">
                الدول المختارة: {preferences.preferredCountries.length} / 30
              </p>
            </section>

            <section className="rounded-2xl border border-[#2D3132] bg-[#191C1D] p-5 sm:p-6">
              <label htmlFor="minimum-cpm" className="mb-4 block">
                <span className="block text-sm font-bold sm:text-base">أقل عائد CPM</span>
                <span className="mt-1 block text-xs text-[#89938F]">لن تظهر لك الحملات التي يقل عائدها عن القيمة المحددة.</span>
              </label>
              <div className="flex max-w-sm items-center gap-3">
                <input
                  id="minimum-cpm"
                  type="number"
                  min="0"
                  step="0.01"
                  value={preferences.minCpm}
                  onChange={(event) => {
                    setNotice("");
                    setPreferences((current) => ({
                      ...current,
                      minCpm: event.target.value,
                    }));
                  }}
                  className="w-full rounded-xl border border-[#353A3B] bg-[#101313] px-4 py-3 text-sm text-white outline-none transition focus:border-[#94D3C1]"
                />
                <span className="text-sm font-semibold text-[#94D3C1]">CPM</span>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

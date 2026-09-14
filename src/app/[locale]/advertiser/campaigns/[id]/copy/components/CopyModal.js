"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { HiOutlineDocumentDuplicate, HiOutlineXMark, HiOutlinePencil } from "react-icons/hi2";
import { useTheme } from "@/context/ThemeContext";
import { copyCampaign } from "@/services/campaign";

export default function CopyModal({ campaign }) {
  const router = useRouter();
  const locale = useLocale();
  const { isDark } = useTheme();
  const t = useTranslations("campaigns");

  const [copyName, setCopyName] = useState(
    `${campaign?.name || "الحملة"} - ${t("copy")}`
  );
  const [copyMedia, setCopyMedia] = useState(false);
  const [copyTargeting, setCopyTargeting] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCopy() {
  setLoading(true);
  try {
    const res = await copyCampaign(campaign._id, {
      newName: copyName,
      includeMaterials: copyMedia,
      includeTargeting: copyTargeting,
    });

    // الـ API بيرجع draft جديد ← نروح لصفحة الحملات
    // res = { success, message, data: { draft: { _id, name, status } } }
    console.log("Copied draft:", res?.data?.draft);
    router.push(`/${locale}/advertiser/campaigns`);

  } catch (err) {
    console.error("Copy failed:", err);
    setLoading(false); // ← بس في الـ catch لأن success رح تنتقل للصفحة
  }
}

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="w-full max-w-md mx-auto rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: isDark ? "rgba(25, 28, 29, 0.85)" : "rgba(255,255,255,0.95)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.12)",
      }}
    >
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${locale === "ar" ? "" : "flex-row-reverse"}`}>
          <HiOutlineDocumentDuplicate size={20} color="rgba(254, 107, 2, 1)" />
          <div className={`flex flex-col ${locale === "ar" ? "text-right" : "text-left"}`}>
            <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("copyTitle")}
            </h3>
            <p className={`text-xs ${isDark ? "text-[#9A9A9A]" : "text-gray-500"}`}>
              {campaign?.name}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className={`w-7 h-7 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all ${
            isDark
              ? "text-[#89938F] hover:text-white hover:bg-white/10"
              : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
          }`}
        >
          <HiOutlineXMark size={18} />
        </button>
      </div>

      {/* اسم الحملة الجديدة */}
      <div className="flex flex-col gap-2">
        <label className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"} ${locale === "ar" ? "text-right" : "text-left"}`}>
          {t("newCampaignName")}
        </label>
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all"
          style={{
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.12)",
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
          }}
        >
          {locale !== "ar" && <HiOutlinePencil size={18} color={isDark ? "#9A9A9A" : "#aaaaaa"} />}
          <input
            type="text"
            value={copyName}
            onChange={(e) => setCopyName(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${
              locale === "ar" ? "text-right" : "text-left"
            } ${isDark ? "text-white placeholder-[#9A9A9A]" : "text-gray-900 placeholder-gray-400"}`}
            placeholder={t("newCampaignName")}
          />
          {locale === "ar" && <HiOutlinePencil size={18} color={isDark ? "#9A9A9A" : "#aaaaaa"} />}
        </div>
      </div>

      {/* خيارات النسخ */}
      <div className="flex flex-col gap-3">
        <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"} ${locale === "ar" ? "text-right" : "text-left"}`}>
          {t("copyOptions")}
        </p>

        {/* نسخ الوسائط */}
        <div
          className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
          style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)",
          }}
          onClick={() => setCopyMedia(!copyMedia)}
        >
          {locale !== "ar" && (
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all"
              style={{
                backgroundColor: copyMedia ? "#94D3C1" : "transparent",
                borderColor: copyMedia ? "#94D3C1" : isDark ? "#3D3D3D" : "#cccccc",
              }}
            >
              {copyMedia && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )}
          <div className={`flex flex-col gap-0.5 flex-1 ${locale === "ar" ? "text-right" : "text-left"}`}>
            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("copyMedia")}
            </p>
            <p className={`text-xs ${isDark ? "text-[#9A9A9A]" : "text-gray-500"}`}>
              {t("copyMediaDesc")}
            </p>
          </div>
          {locale === "ar" && (
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all"
              style={{
                backgroundColor: copyMedia ? "#94D3C1" : "transparent",
                borderColor: copyMedia ? "#94D3C1" : isDark ? "#3D3D3D" : "#cccccc",
              }}
            >
              {copyMedia && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* نسخ الاستهداف */}
        <div
          className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
          style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)",
          }}
          onClick={() => setCopyTargeting(!copyTargeting)}
        >
          {locale !== "ar" && (
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all"
              style={{
                backgroundColor: copyTargeting ? "#94D3C1" : "transparent",
                borderColor: copyTargeting ? "#94D3C1" : isDark ? "#3D3D3D" : "#cccccc",
              }}
            >
              {copyTargeting && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )}
          <div className={`flex flex-col gap-0.5 flex-1 ${locale === "ar" ? "text-right" : "text-left"}`}>
            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("copyTargeting")}
            </p>
            <p className={`text-xs ${isDark ? "text-[#9A9A9A]" : "text-gray-500"}`}>
              {t("copyTargetingDesc")}
            </p>
          </div>
          {locale === "ar" && (
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all"
              style={{
                backgroundColor: copyTargeting ? "#94D3C1" : "transparent",
                borderColor: copyTargeting ? "#94D3C1" : isDark ? "#3D3D3D" : "#cccccc",
              }}
            >
              {copyTargeting && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* الأزرار */}
      <div className={`flex items-center gap-3 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
        <button
          type="button"
          onClick={handleCopy}
          disabled={loading || !copyName.trim()}
          className="h-10 px-6 rounded-lg text-sm font-bold cursor-pointer border-none text-white disabled:opacity-60 transition-all"
          style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
        >
          {loading ? t("copying") : t("startCopy")}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className={`h-10 px-6 rounded-lg text-sm font-bold cursor-pointer bg-transparent transition-all ${
            isDark
              ? "border border-white/10 text-[#9A9A9A] hover:text-white"
              : "border border-black/10 text-gray-500 hover:text-gray-900"
          }`}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
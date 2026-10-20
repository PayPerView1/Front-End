"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Link2,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Search,
  Bookmark,
  ShieldCheck,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { useTheme } from "@/context/ThemeContext";
import { validateLink } from "./validateLink";
import { createSubmission } from "./submissionsApi";
import PreviousSubmission from "./PreviousSubmission";

// كود الخطأ اللي بيرجع من الـ API ← اسم الحالة عندنا
const serverReasons = {
  MISSING_HASHTAGS: "missingHashtags",
  DUPLICATE_LINK: "duplicateLink",
};

const platforms = [
  { key: "tiktok", Icon: SiTiktok, color: null },
  { key: "instagram", Icon: SiInstagram, color: "text-[#E4405F]" },
  { key: "youtube", Icon: SiYoutube, color: "text-[#FF0000]" },
];
const platformFormats = {
  tiktok: ["https://www.tiktok.com/@.../video/...", "https://vm.tiktok.com/..."],
  instagram: ["https://www.instagram.com/reel/...", "https://www.instagram.com/p/..."],
  youtube: ["https://www.youtube.com/shorts/...", "https://youtu.be/..."],
};

export default function SubmitForm({ campaign, campaignId, onChange, onError }) {
  const t = useTranslations("startProject.submit");
  const tc = useTranslations("startProject");
  const { isDark } = useTheme();
  const router = useRouter();
  const locale = useLocale();

  const hashtags = campaign?.hashtags || (campaign ? [campaign.hashtag] : []);

  const [platform, setPlatform] = useState(null);
  const [platformError, setPlatformError] = useState(false);
  const [link, setLink] = useState("");
  const [linkState, setLinkState] = useState(null); // null | "ok" | سبب الخطأ
  const [detectedPlatform, setDetectedPlatform] = useState("");
  const [serverError, setServerError] = useState(null); // { reason, details }
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // نبلغ الصفحة الأم بالرابط والمنصة (لمعاينة الفيديو)
  useEffect(() => {
    onChange?.({ link, platform });
  }, [link, platform]); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = {
    surface: isDark ? "bg-[#121617] border-[#1e2425]" : "bg-white border-[#e1e7e4]",
    inset: isDark ? "bg-[#181d1e] border-[#252c2d]" : "bg-[#f3f6f5] border-[#e1e7e4]",
    input: isDark
      ? "bg-[#161a22] border-[#252c3d] text-white placeholder-gray-500"
      : "bg-white border-[#d8dfdc] text-[#191c1d] placeholder-[#7a8581]",
    tab: isDark
      ? "bg-[#1c2223] border-transparent text-gray-300"
      : "bg-[#f3f6f5] border-[#e1e7e4] text-[#404945]",
    chip: isDark ? "border-[#2d3436]" : "border-[#d8dfdc]",
    badge: isDark ? "bg-[#22282a] text-gray-300" : "bg-[#e6ecea] text-[#404945]",
    checkOn: isDark
      ? "bg-[#26362f] border-[#94D3C1]/40 text-[#94D3C1]"
      : "bg-emerald-50 border-#94D3C1 text-emerald-700",
    primaryText: isDark ? "text-white" : "text-[#191c1d]",
    secondaryText: isDark ? "text-gray-400" : "text-[#5f6a66]",
  };

  const gradient = { background: "linear-gradient(90deg, #FC9102 0%, #FB6103 100%)" };

  const isDuplicate = serverError?.reason === "duplicateLink";
  const missing =
    serverError?.reason === "missingHashtags"
      ? serverError.details?.missingHashtags || []
      : [];

  const hasError = (Boolean(linkState) && linkState !== "ok") || isDuplicate;
  // نوع الخطأ الحالي (محلي من فحص الرابط، أو جاي من الـ API)
const errorKey = isDuplicate
  ? "duplicate"
  : serverError?.reason === "missingHashtags"
    ? "missingHashtags"
    : linkState && linkState !== "ok"
      ? linkState
      : null;
  const canSubmit = link.trim() && checked && !submitting && !hasError;

  const errorInput = isDark
    ? "bg-[#161a22] border-red-500/70 text-white placeholder-gray-500"
    : "bg-white border-red-400 text-[#191c1d] placeholder-[#7a8581]";
  const missingChip = isDark
    ? "border-red-500/70 bg-red-500/5"
    : "border-red-400 bg-red-50";

  const copyHashtags = async () => {
    try {
      await navigator.clipboard.writeText(hashtags.join(" "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const reportError = (reason, details = {}) =>
    onError?.(reason && reason !== "empty" ? reason : null, details);

  const clearErrors = () => {
    setLinkState(null);
    setServerError(null);
    setPlatformError(false);
    setDetectedPlatform("");
    reportError(null);
  };
  const placeholders = {
    tiktok: "https://www.tiktok.com/@your_account/video/73918234...",
    instagram: "https://www.instagram.com/reel/...",
    youtube: "https://www.youtube.com/shorts/...",
  };
  const checkLink = () => {
    if (!platform) {
      setPlatformError(true);
      return false;
    }
    const result = validateLink(link, platform, locale);
    setLinkState(result.valid ? "ok" : result.reason);
    setDetectedPlatform(result.platformName || "");
    reportError(
      result.valid ? null : result.reason,
      result.platformName ? { platformName: ` (${result.platformName})` } : { platformName: "" }
    );
    return result.valid;
  };

  const handleSubmit = async () => {
    if (!checkLink()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const submission = await createSubmission({
        campaignId,
        platform,
        link: link.trim(),
      });
      router.push(
        `/creator/start-project/${campaignId}/result?submissionId=${submission.id}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const data = error.response?.data;
      const reason = serverReasons[data?.code];

      if (reason) {
        const details = data.details || {};
        setServerError({ reason, details });
        onError?.(reason, details);
      } else {
        setSubmitError(data?.message || "تعذر إرسال المقطع");
      }
      setSubmitting(false);
    }
  };

  return (
    <div className={`${theme.surface} min-w-0 border rounded-2xl p-3 sm:p-5 space-y-5`}>
      <div>
        <h2 className={`text-lg font-bold ${theme.primaryText}`}>{t("formTitle")}</h2>
        <p className={`text-xs ${theme.secondaryText}`}>{t("formSubtitle")}</p>
      </div>

            {/* 1) Platform */}
      <section className="space-y-2">
        <Label n="1" text={t("choosePlatform")} theme={theme} />
        <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2">
          {platforms.map(({ key, Icon, color }) => {
            const active = platform === key;
            const iconColor = active
              ? "text-white"
              : color || (isDark ? "text-white" : "text-black");
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPlatform(key);
                  clearErrors();
                }}
                className={`flex min-w-0 items-center justify-center gap-2 px-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                  active
                    ? "text-white border-transparent"
                    : platformError
                      ? `${theme.tab} !border-red-500/70`
                      : theme.tab
                }`}
                style={active ? gradient : {}}
              >
                <Icon size={14} className={iconColor} />
                {t(`platforms.${key}`)}
              </button>
            );
          })}
        </div>
        {platformError && (
          <p className="text-[11px] text-red-400">{t("errors.noPlatform")}</p>
        )}
      </section>

      {/* 2) Link */}
      <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
          <Label n="2" text={t("pasteLink")} theme={theme} />
          {errorKey ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-md border border-red-500/40 bg-red-500/10 text-red-300 px-2.5 py-1">
              {errorKey === "unsupportedPlatform" && detectedPlatform
                ? (locale === "ar"
                    ? `منصة ${detectedPlatform} غير مدعومة`
                    : `${detectedPlatform} is not supported`)
                : t(`badges.${errorKey}`)}
            </span>
          ) : (
            <span className={`flex items-center gap-1 text-[10px] ${theme.secondaryText}`}>
              {t("verifiedLink")}
              <ShieldCheck size={12} className="text-[#94D3C1]" />
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type="url"
            dir="rtl"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              clearErrors();
            }}
            placeholder={placeholders[platform] || "https://..."}
            className={`w-full h-12 border rounded-xl pl-28 pr-10 text-xs outline-none focus:border-[#94D3C1] ${
              hasError ? errorInput : theme.input
            } ${isDuplicate ? "!text-red-400" : ""}`}
          />
          <button
            type="button"
            onClick={checkLink}
            className={`absolute left-2 top-1/2 -translate-y-1/2 h-8 px-3 flex items-center gap-1.5 border rounded-lg text-[10px] font-bold ${theme.inset} ${theme.secondaryText}`}
          >
            <Search size={12} />
            {t("checkLink")}
          </button>
          <Link2
            size={15}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.secondaryText}`}
          />
        </div>

        {isDuplicate ? (
          <p className="text-[11px] text-red-400">{t("duplicateNote")}</p>
        ) : linkState === "ok" ? (
          <p className="text-[11px] text-[#94D3C1]">{t("linkOk")}</p>
        ) : linkState === "unsupportedPlatform" && detectedPlatform ? (
          <p className="text-[11px] text-red-400">
            {locale === "ar"
              ? `منصة ${detectedPlatform} غير مدعومة، استخدم تيك توك أو إنستغرام أو يوتيوب`
              : `${detectedPlatform} is not supported. Use TikTok, Instagram or YouTube`}
          </p>
        ) : linkState ? (
          <p className="text-[11px] text-red-400">{t(`errors.${linkState}`)}</p>
        ) : (
          <p className={`text-[10px] ${theme.secondaryText}`}>{t("publicNote")}</p>
        )}

          {(linkState === "invalidUrl" || linkState === "platformMismatch") && (
          <div className={`rounded-xl border p-3 space-y-2 ${theme.inset}`}>
            <p className={`flex items-center gap-1.5 text-[11px] font-bold ${theme.primaryText}`}>
              <CheckCircle2 size={13} className="text-[#94D3C1]" />
              {t("formats.title", { platform: t(`platforms.${platform}`) })}
            </p>
            <div dir="rtl" className="flex flex-wrap gap-2">
              {(platformFormats[platform] || []).map((f) => (
                <span
                  key={f}
                  className={`text-[10px] font-mono rounded-md border px-2.5 py-1 ${theme.chip} ${theme.secondaryText}`}
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-red-400">{t(`formats.notes.${platform}`)}</p>
          </div>
        )}

        {linkState === "unsupportedPlatform" && (
          <p className={`text-[10px] ${theme.secondaryText}`}>
            {t("formats.supportedOnly")}{" "}
            <span dir="ltr" className="font-mono">
              tiktok.com, instagram.com/reel, youtube.com/shorts
            </span>
          </p>
        )}
      </section>

      {/* 3) Hashtags */}
      <section className={`rounded-xl border p-3 sm:p-4 space-y-3 ${theme.inset}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label
            n="3"
            text={t("requiredHashtags", { count: hashtags.length })}
            theme={theme}
          />
          <button
            type="button"
            onClick={copyHashtags}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[10px] font-bold ${theme.surface} ${theme.secondaryText}`}
          >
            {copied ? <Check size={12} className="text-[#94D3C1]" /> : <Copy size={12} />}
            {copied ? t("copied") : t("copyAll")}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {hashtags.map((tag) => {
            const isMissing = missing.includes(tag);
            return (
              <div
                key={tag}
                className={`flex min-w-0 flex-col items-center justify-center gap-1.5 break-all px-2 py-3 rounded-lg border text-xs font-bold ${
                  isMissing ? missingChip : theme.chip
                } ${theme.primaryText}`}
              >
                {isMissing ? (
                  <XCircle size={14} className="text-red-400" />
                ) : (
                  <CheckCircle2 size={14} className="text-[#94D3C1]" />
                )}
                {tag}
              </div>
            );
          })}
        </div>
      </section>

      {/* Terms */}
      <label
        className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer ${theme.inset}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only"
        />
        <span
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
            checked ? theme.checkOn : theme.surface
          }`}
        >
          {checked && <Check size={13} />}
        </span>
        <span className={`text-xs leading-relaxed ${theme.secondaryText}`}>
          <strong className="text-[#E9C349]">{t("pledgeLabel")}</strong> {t("pledge")}
        </span>
      </label>

      {submitError && <p className="text-[11px] text-red-400">{submitError}</p>}

      {/* Actions */}
      <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex h-11 min-h-11 w-full flex-none items-center justify-center rounded-xl px-4 text-center text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(252,145,2,0.25)] sm:flex-1"
          style={gradient}
        >
          {submitting
            ? t("submitting")
            : serverError?.reason === "missingHashtags"
              ? t("recheck")
              : t("submit")}
        </button>
        <button
          type="button"
          className={`flex h-11 min-h-11 w-full flex-none items-center justify-center gap-2 rounded-xl border px-5 text-xs font-bold sm:w-auto ${theme.inset} ${theme.secondaryText}`}
        >
          <Bookmark size={14} />
          {t("saveLater")}
        </button>
      </div>

      {/* بيانات التسليم السابق (رابط مكرر) */}
      {isDuplicate && (
        <PreviousSubmission
          previous={serverError.details?.previous}
          campaignName={campaign ? tc(`campaigns.${campaign.title}`) : campaignId}
        />
      )}
    </div>
  );
}

function Label({ n, text, theme }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${theme.badge}`}
      >
        {n}
      </span>
      <span className={`text-xs font-bold ${theme.primaryText}`}>{text}</span>
    </div>
  );
}
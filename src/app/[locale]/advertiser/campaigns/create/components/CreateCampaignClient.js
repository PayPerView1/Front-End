"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { createCampaign, saveDraft } from "@/services/campaign";
import {
  MdArrowBack,
  MdOutlineVideocam,
  MdOutlinePeopleAlt,
  MdOutlineSlideshow,
  MdOutlineAudiotrack,
  MdOutlineBadge,
  MdOutlineGridView,
  MdOutlineAttachMoney,
  MdOutlineCalendarToday,
  MdOutlineRocketLaunch,
  MdCheckCircle,
  MdOutlineSave,
} from "react-icons/md";

const CONTENT_TYPES = [
  {
    key: "CLIPPING",
    icon: MdOutlineVideocam,
    color: "#94D3C1",
    bg: "#94D3C115",
    border: "#94D3C133",
    label: "Video Clipping",
    desc: "Short-form clips from long content",
  },
  {
    key: "UGC",
    icon: MdOutlinePeopleAlt,
    color: "#E9C349",
    bg: "#E9C34915",
    border: "#E9C34933",
    label: "User Generated (UGC)",
    desc: "Authentic creator-made content",
  },
  {
    key: "SLIDESHOW",
    icon: MdOutlineSlideshow,
    color: "#A78BFA",
    bg: "#A78BFA15",
    border: "#A78BFA33",
    label: "Slideshow",
    desc: "Image-based visual storytelling",
  },
  {
    key: "AUDIO",
    icon: MdOutlineAudiotrack,
    color: "#F97316",
    bg: "#F9731615",
    border: "#F9731633",
    label: "Audio Content",
    desc: "Podcast mentions & audio ads",
  },
  {
    key: "LOGO",
    icon: MdOutlineBadge,
    color: "#38BDF8",
    bg: "#38BDF815",
    border: "#38BDF833",
    label: "Logo & Branding",
    desc: "Brand overlays and logo placement",
  },
  {
    key: "MIXED",
    icon: MdOutlineGridView,
    color: "#FF6B00",
    bg: "#FF6B0015",
    border: "#FF6B0033",
    label: "Mixed Formats",
    desc: "Combine multiple content types",
  },
];

const STEPS = ["Type", "Details", "Budget", "Review"];

export default function CreateCampaignClient() {
  const { isDark } = useTheme();
  const router = useRouter();
  const locale = useLocale();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    contentType: "",
    name: "",
    description: "",
    targetUrl: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
    currency: "USD",
    rewardPerView: "",
    minFollowers: "",
    targetPlatforms: [],
  });

  const platforms = ["YouTube", "TikTok", "Instagram", "Twitter/X", "Facebook", "Snapchat"];

  const togglePlatform = (p) => {
    setForm((prev) => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(p)
        ? prev.targetPlatforms.filter((x) => x !== p)
        : [...prev.targetPlatforms, p],
    }));
  };

  const canNext = () => {
    if (step === 0) return !!form.contentType;
    if (step === 1) return form.name.trim().length >= 3 && form.startDate && form.endDate;
    if (step === 2) return Number(form.totalBudget) > 0 && Number(form.rewardPerView) > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach((item) => fd.append(k, item));
        else fd.append(k, v);
      });
      await createCampaign(fd);
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/advertiser/campaigns`), 2200);
    } catch (e) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!form.name.trim() && !form.contentType) return;
    setDraftLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        targetPlatforms: form.targetPlatforms,
      };
      console.log("💾 Saving draft with payload:", payload);
      
      let success = false;
      try {
        const res = await saveDraft(payload);
        console.log("✅ saveDraft response:", res);
        success = true;
      } catch (err) {
        console.warn("⚠️ API saveDraft failed, falling back to localStorage", err);
      }

      // Fallback: Save to localStorage so it always appears in the UI
      try {
        const existing = JSON.parse(localStorage.getItem("ppv_drafts") || "[]");
        const newDraft = {
          _id: "local_" + Date.now().toString(),
          ...payload,
          status: "DRAFT",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem("ppv_drafts", JSON.stringify([newDraft, ...existing]));
        success = true;
      } catch (e) {
        console.error("Local storage error:", e);
      }

      if (success) {
        setDraftSuccess(true);
        setTimeout(() => router.push(`/${locale}/advertiser/drafts`), 1600);
      } else {
        throw new Error("Failed to save draft locally and remotely.");
      }
    } catch (e) {
      console.error("❌ saveDraft error:", e);
      setError(e?.message || "Failed to save draft. Please try again.");
    } finally {
      setDraftLoading(false);
    }
  };

  const bg = isDark ? "#0f0f0f" : "#f8f8f8";
  const card = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const text = isDark ? "#fff" : "#111";
  const muted = isDark ? "#888" : "#666";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "#f4f4f4";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";

  if (success) {
    return (
      <div
        style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#FFA600,#FF4B04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "popIn 0.4s ease",
            }}
          >
            <MdCheckCircle size={44} color="#fff" />
          </div>
          <h2 style={{ color: text, fontSize: 24, fontWeight: 700, margin: 0 }}>Campaign Created!</h2>
          <p style={{ color: muted, margin: 0 }}>Redirecting you to your campaigns...</p>
        </div>
        <style>{`@keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "32px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: `1px solid ${border}`,
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
              color: text,
              display: "flex",
              alignItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "#eee")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 style={{ color: text, fontSize: 22, fontWeight: 700, margin: 0 }}>Create New Campaign</h1>
            <p style={{ color: muted, fontSize: 13, margin: "4px 0 0" }}>Fill in the details to launch your campaign</p>
          </div>
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40 }}>
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14,
                      transition: "all 0.3s",
                      background: done
                        ? "linear-gradient(135deg,#FFA600,#FF4B04)"
                        : active
                        ? "linear-gradient(135deg,#FFA600,#FF4B04)"
                        : isDark
                        ? "rgba(255,255,255,0.06)"
                        : "#e5e5e5",
                      color: done || active ? "#fff" : muted,
                      boxShadow: active ? "0 0 0 4px rgba(255,106,0,0.2)" : "none",
                    }}
                  >
                    {done ? <MdCheckCircle size={18} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 11, color: active ? "#FF6B00" : muted, fontWeight: active ? 600 : 400 }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      margin: "0 8px",
                      marginBottom: 20,
                      background: done
                        ? "linear-gradient(90deg,#FFA600,#FF4B04)"
                        : isDark
                        ? "rgba(255,255,255,0.08)"
                        : "#e0e0e0",
                      borderRadius: 2,
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Card */}
        <div
          style={{
            background: card,
            border: `1px solid ${border}`,
            borderRadius: 20,
            padding: "32px",
            marginBottom: 24,
          }}
        >
          {/* STEP 0 — Content Type */}
          {step === 0 && (
            <div>
              <h2 style={{ color: text, fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 6 }}>
                Choose Content Type
              </h2>
              <p style={{ color: muted, fontSize: 13, margin: "0 0 24px" }}>
                What kind of content do you want creators to make?
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 14 }}>
                {CONTENT_TYPES.map((ct) => {
                  const Icon = ct.icon;
                  const selected = form.contentType === ct.key;
                  return (
                    <button
                      key={ct.key}
                      onClick={() => setForm((p) => ({ ...p, contentType: ct.key }))}
                      style={{
                        background: selected ? ct.bg : isDark ? "rgba(255,255,255,0.03)" : "#fafafa",
                        border: `1.5px solid ${selected ? ct.color : border}`,
                        borderRadius: 14,
                        padding: "18px 16px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s",
                        transform: selected ? "scale(1.02)" : "scale(1)",
                        boxShadow: selected ? `0 4px 20px ${ct.color}30` : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: ct.bg,
                          border: `1px solid ${ct.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 12,
                        }}
                      >
                        <Icon size={22} color={ct.color} />
                      </div>
                      <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{ct.label}</div>
                      <div style={{ color: muted, fontSize: 12 }}>{ct.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1 — Campaign Details */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ color: text, fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 6 }}>
                  Campaign Details
                </h2>
                <p style={{ color: muted, fontSize: 13, margin: 0 }}>Give your campaign a name and set its timeframe</p>
              </div>

              {/* Name */}
              <div>
                <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  CAMPAIGN NAME *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Brand Boost 2025"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  style={{
                    width: "100%",
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: 12,
                    padding: "12px 16px",
                    color: text,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
                  onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  DESCRIPTION
                </label>
                <textarea
                  placeholder="Describe what this campaign is about, your brand story, or key messaging..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  style={{
                    width: "100%",
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: 12,
                    padding: "12px 16px",
                    color: text,
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
                  onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                />
              </div>

              {/* Target URL */}
              <div>
                <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  TARGET URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={form.targetUrl}
                  onChange={(e) => setForm((p) => ({ ...p, targetUrl: e.target.value }))}
                  style={{
                    width: "100%",
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: 12,
                    padding: "12px 16px",
                    color: text,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
                  onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                />
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    START DATE *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    style={{
                      width: "100%",
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: 12,
                      padding: "12px 16px",
                      color: text,
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      colorScheme: isDark ? "dark" : "light",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
                    onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                  />
                </div>
                <div>
                  <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    END DATE *
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    style={{
                      width: "100%",
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: 12,
                      padding: "12px 16px",
                      color: text,
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      colorScheme: isDark ? "dark" : "light",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
                    onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                  />
                </div>
              </div>

              {/* Platforms */}
              <div>
                <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 12 }}>
                  TARGET PLATFORMS
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {platforms.map((p) => {
                    const sel = form.targetPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => togglePlatform(p)}
                        style={{
                          padding: "7px 16px",
                          borderRadius: 100,
                          border: `1px solid ${sel ? "#FF6B00" : inputBorder}`,
                          background: sel ? "rgba(255,107,0,0.12)" : inputBg,
                          color: sel ? "#FF6B00" : muted,
                          fontSize: 13,
                          fontWeight: sel ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Budget */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ color: text, fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 6 }}>
                  Budget & Rewards
                </h2>
                <p style={{ color: muted, fontSize: 13, margin: 0 }}>
                  Set your total campaign budget and how much creators earn per view
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* Total Budget */}
                <div>
                  <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    TOTAL BUDGET *
                  </label>
                  <div style={{ position: "relative" }}>
                    <MdOutlineAttachMoney
                      size={18}
                      color={muted}
                      style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="5000"
                      value={form.totalBudget}
                      onChange={(e) => setForm((p) => ({ ...p, totalBudget: e.target.value }))}
                      style={{
                        width: "100%",
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: 12,
                        padding: "12px 16px 12px 40px",
                        color: text,
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
                      onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                    />
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    CURRENCY
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                    style={{
                      width: "100%",
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: 12,
                      padding: "12px 16px",
                      color: text,
                      fontSize: 14,
                      outline: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="USD">USD — US Dollar</option>
                    <option value="SAR">SAR — Saudi Riyal</option>
                    <option value="AED">AED — UAE Dirham</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </div>
              </div>

              {/* Reward Per View */}
              <div>
                <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  REWARD PER VIEW *
                </label>
                <div style={{ position: "relative" }}>
                  <MdOutlineAttachMoney
                    size={18}
                    color={muted}
                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.001}
                    placeholder="0.01"
                    value={form.rewardPerView}
                    onChange={(e) => setForm((p) => ({ ...p, rewardPerView: e.target.value }))}
                    style={{
                      width: "100%",
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: 12,
                      padding: "12px 16px 12px 40px",
                      color: text,
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
                    onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                  />
                </div>
                <p style={{ color: muted, fontSize: 12, marginTop: 6 }}>
                  Creators earn this amount for each view on their campaign content
                </p>
              </div>

              {/* Min Followers */}
              <div>
                <label style={{ color: muted, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  MINIMUM CREATOR FOLLOWERS
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="1000"
                  value={form.minFollowers}
                  onChange={(e) => setForm((p) => ({ ...p, minFollowers: e.target.value }))}
                  style={{
                    width: "100%",
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: 12,
                    padding: "12px 16px",
                    color: text,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
                  onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                />
              </div>

              {/* Budget Summary */}
              {form.totalBudget && form.rewardPerView && (
                <div
                  style={{
                    background: "rgba(255,107,0,0.08)",
                    border: "1px solid rgba(255,107,0,0.2)",
                    borderRadius: 14,
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ color: muted, fontSize: 12 }}>Estimated Max Views</div>
                    <div style={{ color: "#FF6B00", fontSize: 20, fontWeight: 700, marginTop: 2 }}>
                      {Math.floor(form.totalBudget / form.rewardPerView).toLocaleString()}
                    </div>
                  </div>
                  <MdOutlineRocketLaunch size={32} color="#FF6B00" style={{ opacity: 0.6 }} />
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ color: text, fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 6 }}>
                  Review & Launch
                </h2>
                <p style={{ color: muted, fontSize: 13, margin: 0 }}>
                  Double-check everything before submitting your campaign
                </p>
              </div>

              {[
                {
                  label: "Content Type",
                  value: CONTENT_TYPES.find((ct) => ct.key === form.contentType)?.label || "-",
                },
                { label: "Campaign Name", value: form.name || "-" },
                { label: "Description", value: form.description || "-" },
                { label: "Target URL", value: form.targetUrl || "-" },
                { label: "Start Date", value: form.startDate || "-" },
                { label: "End Date", value: form.endDate || "-" },
                { label: "Platforms", value: form.targetPlatforms.join(", ") || "All platforms" },
                {
                  label: "Total Budget",
                  value: form.totalBudget ? `${Number(form.totalBudget).toLocaleString()} ${form.currency}` : "-",
                },
                { label: "Reward / View", value: form.rewardPerView ? `${form.rewardPerView} ${form.currency}` : "-" },
                { label: "Min. Followers", value: form.minFollowers ? Number(form.minFollowers).toLocaleString() : "None" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: `1px solid ${border}`,
                  }}
                >
                  <span style={{ color: muted, fontSize: 13 }}>{label}</span>
                  <span style={{ color: text, fontSize: 13, fontWeight: 600, maxWidth: "60%", textAlign: "right" }}>
                    {value}
                  </span>
                </div>
              ))}

              {error && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 10,
                    padding: "12px 16px",
                    color: "#ef4444",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => (step === 0 ? router.back() : setStep((s) => s - 1))}
            style={{
              background: "none",
              border: `1px solid ${border}`,
              borderRadius: 12,
              padding: "12px 24px",
              color: text,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#eee")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Save as Draft — show from step 1 onwards when name exists */}
            {step >= 1 && (
              <button
                onClick={handleSaveDraft}
                disabled={draftLoading || !form.name.trim()}
                title={!form.name.trim() ? "Add a campaign name first" : "Save as draft"}
                style={{
                  background: draftSuccess
                    ? "rgba(74,222,128,0.15)"
                    : isDark
                    ? "rgba(255,255,255,0.05)"
                    : "#f0f0f0",
                  border: `1px solid ${
                    draftSuccess ? "rgba(74,222,128,0.4)" : inputBorder
                  }`,
                  borderRadius: 12,
                  padding: "12px 20px",
                  color: draftSuccess ? "#4ade80" : !form.name.trim() ? muted : text,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: draftLoading || !form.name.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "all 0.2s",
                  opacity: !form.name.trim() ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!draftLoading && form.name.trim())
                    e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.1)" : "#e5e5e5";
                }}
                onMouseLeave={(e) => {
                  if (!draftSuccess)
                    e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0";
                }}
              >
                {draftLoading ? (
                  <span
                    style={{
                      width: 15,
                      height: 15,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: text,
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                ) : draftSuccess ? (
                  <MdCheckCircle size={16} color="#4ade80" />
                ) : (
                  <MdOutlineSave size={16} />
                )}
                {draftSuccess ? "Saved!" : draftLoading ? "Saving..." : "Save as Draft"}
              </button>
            )}

            <button
              onClick={step === 3 ? handleSubmit : () => setStep((s) => s + 1)}
              disabled={!canNext() || loading}
              style={{
                background: canNext() && !loading ? "linear-gradient(90deg,#FFA600,#FF4B04)" : isDark ? "#333" : "#ddd",
                border: "none",
                borderRadius: 12,
                padding: "12px 28px",
                color: canNext() && !loading ? "#fff" : muted,
                fontSize: 14,
                fontWeight: 700,
                cursor: canNext() && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (canNext() && !loading) e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Launching...
                </>
              ) : step === 3 ? (
                <>
                  <MdOutlineRocketLaunch size={18} />
                  Launch Campaign
                </>
              ) : (
                <>Next →</>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

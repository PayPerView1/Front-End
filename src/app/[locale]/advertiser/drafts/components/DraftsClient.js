"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { getDrafts, getCampaigns, deleteDraft, submitDraft } from "@/services/campaign";
import {
  MdOutlineDrafts,
  MdOutlineRocketLaunch,
  MdOutlineDelete,
  MdOutlineEdit,
  MdArrowBack,
  MdOutlineMoreVert,
  MdOutlineCalendarToday,
  MdOutlineAttachMoney,
  MdOutlineVideocam,
  MdOutlinePeopleAlt,
  MdOutlineSlideshow,
  MdOutlineAudiotrack,
  MdOutlineBadge,
  MdOutlineGridView,
  MdSearch,
  MdAdd,
} from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

const CONTENT_TYPE_META = {
  CLIPPING: { icon: MdOutlineVideocam, color: "#94D3C1", label: "Clipping" },
  UGC: { icon: MdOutlinePeopleAlt, color: "#E9C349", label: "UGC" },
  SLIDESHOW: { icon: MdOutlineSlideshow, color: "#A78BFA", label: "Slideshow" },
  AUDIO: { icon: MdOutlineAudiotrack, color: "#F97316", label: "Audio" },
  LOGO: { icon: MdOutlineBadge, color: "#38BDF8", label: "Logo" },
  MIXED: { icon: MdOutlineGridView, color: "#FF6B00", label: "Mixed" },
};

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function DraftsClient() {
  const { isDark } = useTheme();
  const router = useRouter();
  const locale = useLocale();

  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [launchingId, setLaunchingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const parseList = (res) => {
    if (!res) return null;
    const list =
      res?.data?.drafts ??
      res?.data?.campaigns ??
      res?.data?.data ??
      res?.drafts ??
      res?.campaigns ??
      (Array.isArray(res?.data) ? res.data : null) ??
      (Array.isArray(res) ? res : null);
    return Array.isArray(list) ? list : null;
  };

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    let lastError = null;
    let apiDrafts = [];

    // Try 1: /api/v1/campaigns/drafts
    try {
      const res = await getDrafts();
      console.log("[Drafts] /drafts response:", res);
      const list = parseList(res);
      if (list !== null) {
        apiDrafts = list;
      }
    } catch (err) {
      console.warn("[Drafts] /drafts endpoint failed:", err.message);
      lastError = err;
    }

    // Try 2 if Try 1 failed: /api/v1/campaigns?status=DRAFT
    if (apiDrafts.length === 0) {
      try {
        const res = await getCampaigns({ status: "DRAFT" });
        console.log("[Drafts] /campaigns?status=DRAFT response:", res);
        const list = parseList(res);
        if (list !== null) {
          apiDrafts = list;
        }
      } catch (err) {
        console.error("[Drafts] Both endpoints failed:", err.message);
        lastError = lastError || err;
      }
    }

    // Fallback: Load from localStorage
    let localDrafts = [];
    try {
      localDrafts = JSON.parse(localStorage.getItem("ppv_drafts") || "[]");
    } catch (e) {
      console.error("Failed to load local drafts", e);
    }

    // Merge and deduplicate by _id
    const merged = [...localDrafts, ...apiDrafts];
    const unique = [];
    const seen = new Set();
    for (const d of merged) {
      if (!seen.has(d._id)) {
        seen.add(d._id);
        unique.push(d);
      }
    }

    setDrafts(unique);

    if (unique.length === 0 && lastError) {
      setFetchError(lastError?.message || "Failed to load drafts");
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  // Close menu on outside click
  useEffect(() => {
    const handler = () => setOpenMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      if (id.toString().startsWith("local_")) {
        // Delete from local storage
        const existing = JSON.parse(localStorage.getItem("ppv_drafts") || "[]");
        const updated = existing.filter(d => d._id !== id);
        localStorage.setItem("ppv_drafts", JSON.stringify(updated));
      } else {
        // Delete from API
        await deleteDraft(id);
      }
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Failed to delete draft:", err);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleLaunch = async (id) => {
    if (id.toString().startsWith("local_")) {
      // Local drafts must be edited and launched through the normal create flow
      router.push(`/${locale}/advertiser/campaigns/create?draftId=${id}`);
      return;
    }

    setLaunchingId(id);
    try {
      await submitDraft(id);
      await fetchDrafts();
      router.push(`/${locale}/advertiser/campaigns`);
    } finally {
      setLaunchingId(null);
    }
  };

  const filtered = drafts.filter((d) =>
    (d.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const bg = isDark ? "#0f0f0f" : "#f8f8f8";
  const card = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const text = isDark ? "#fff" : "#111";
  const muted = isDark ? "#888" : "#666";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "#f4f4f4";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "32px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => router.push(`/${locale}/advertiser/campaigns`)}
              style={{
                background: "none", border: `1px solid ${border}`, borderRadius: 10,
                padding: "8px 10px", cursor: "pointer", color: text,
                display: "flex", alignItems: "center", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "#eee")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <MdArrowBack size={20} />
            </button>
            <div>
              <h1 style={{ color: text, fontSize: 22, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                <MdOutlineDrafts size={24} color="#FF6B00" />
                Drafts
              </h1>
              <p style={{ color: muted, fontSize: 13, margin: "4px 0 0" }}>
                {drafts.length} draft{drafts.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/${locale}/advertiser/campaigns/create`)}
            style={{
              background: "linear-gradient(90deg,#FFA600,#FF4B04)", border: "none",
              borderRadius: 12, padding: "10px 20px", color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "transform 0.2s", transform: "scale(1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <MdAdd size={18} />
            New Campaign
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <MdSearch
            size={18} color={muted}
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
          <input
            type="text"
            placeholder="Search drafts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", background: inputBg, border: `1px solid ${inputBorder}`,
              borderRadius: 12, padding: "11px 16px 11px 42px", color: text,
              fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#FF6B00")}
            onBlur={(e) => (e.target.style.borderColor = inputBorder)}
          />
        </div>

        {/* Content */}
        {fetchError ? (
          <div
            style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 16, padding: "24px", marginBottom: 16,
              display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center",
            }}
          >
            <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 16 }}>⚠️ Failed to load drafts</div>
            <div style={{ color: muted, fontSize: 13, maxWidth: 400 }}>{fetchError}</div>
            <button
              onClick={fetchDrafts}
              style={{
                background: "#ef4444", border: "none", borderRadius: 10,
                padding: "9px 20px", color: "#fff", fontSize: 13,
                fontWeight: 700, cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: card, border: `1px solid ${border}`, borderRadius: 16,
                  height: 100, animation: "pulse 1.4s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 16, padding: "80px 20px", textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80, height: 80, borderRadius: 20,
                background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <MdOutlineDrafts size={36} color="#FF6B00" />
            </div>
            <h3 style={{ color: text, fontSize: 18, fontWeight: 700, margin: 0 }}>
              {search ? "No drafts match your search" : "No drafts yet"}
            </h3>
            <p style={{ color: muted, fontSize: 14, margin: 0, maxWidth: 320 }}>
              {search
                ? "Try a different search term"
                : "When you save a campaign as a draft, it will appear here."}
            </p>
            {!search && (
              <button
                onClick={() => router.push(`/${locale}/advertiser/campaigns/create`)}
                style={{
                  background: "linear-gradient(90deg,#FFA600,#FF4B04)", border: "none",
                  borderRadius: 12, padding: "11px 24px", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, marginTop: 8,
                }}
              >
                <IoAddCircleOutline size={18} />
                Create New Campaign
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((draft) => {
              const ct = CONTENT_TYPE_META[draft.contentType] || CONTENT_TYPE_META.MIXED;
              const Icon = ct.icon;
              const isDeleting = deletingId === draft._id;
              const isLaunching = launchingId === draft._id;
              const menuOpen = openMenu === draft._id;

              return (
                <div
                  key={draft._id}
                  style={{
                    background: card,
                    border: `1px solid ${border}`,
                    borderRadius: 16,
                    padding: "20px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transition: "border-color 0.2s, transform 0.15s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,107,0,0.3)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: `${ct.color}15`, border: `1px solid ${ct.color}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon size={22} color={ct.color} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {draft.name || "Untitled Draft"}
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 10px",
                          borderRadius: 100, background: `${ct.color}15`,
                          color: ct.color, border: `1px solid ${ct.color}30`,
                        }}
                      >
                        {ct.label}
                      </span>
                      {draft.totalBudget && (
                        <span style={{ color: muted, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                          <MdOutlineAttachMoney size={14} />
                          {Number(draft.totalBudget).toLocaleString()} {draft.currency || "USD"}
                        </span>
                      )}
                      {draft.startDate && (
                        <span style={{ color: muted, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                          <MdOutlineCalendarToday size={13} />
                          {new Date(draft.startDate).toLocaleDateString()}
                        </span>
                      )}
                      <span style={{ color: muted, fontSize: 12 }}>
                        {timeAgo(draft.updatedAt || draft.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    {/* Launch */}
                    <button
                      onClick={() => handleLaunch(draft._id)}
                      disabled={isLaunching || isDeleting}
                      title="Launch campaign"
                      style={{
                        background: "linear-gradient(90deg,#FFA600,#FF4B04)", border: "none",
                        borderRadius: 10, padding: "8px 16px", color: "#fff",
                        fontSize: 13, fontWeight: 700, cursor: isLaunching ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.2s",
                        opacity: isLaunching ? 0.7 : 1,
                      }}
                    >
                      {isLaunching ? (
                        <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      ) : (
                        <MdOutlineRocketLaunch size={15} />
                      )}
                      {isLaunching ? "Launching..." : "Launch"}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => router.push(`/${locale}/advertiser/campaigns/create?draftId=${draft._id}`)}
                      title="Edit draft"
                      style={{
                        background: inputBg, border: `1px solid ${inputBorder}`,
                        borderRadius: 10, padding: "8px 10px", color: muted,
                        cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = "#FF6B00"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = inputBorder; }}
                    >
                      <MdOutlineEdit size={17} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(draft._id); }}
                      title="Delete draft"
                      disabled={isDeleting}
                      style={{
                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: 10, padding: "8px 10px", color: "#ef4444",
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", transition: "all 0.2s",
                        opacity: isDeleting ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                    >
                      {isDeleting ? (
                        <span style={{ width: 15, height: 15, border: "2px solid rgba(239,68,68,0.3)", borderTopColor: "#ef4444", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      ) : (
                        <MdOutlineDelete size={17} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, backdropFilter: "blur(4px)",
          }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            style={{
              background: isDark ? "#1a1a1a" : "#fff",
              border: `1px solid ${border}`, borderRadius: 20,
              padding: "32px", maxWidth: 380, width: "90%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <MdOutlineDelete size={26} color="#ef4444" />
            </div>
            <h3 style={{ color: text, fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Delete Draft?</h3>
            <p style={{ color: muted, fontSize: 14, margin: "0 0 24px" }}>
              This action cannot be undone. The draft will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1, background: "none", border: `1px solid ${border}`,
                  borderRadius: 12, padding: "11px", color: text, fontSize: 14,
                  fontWeight: 600, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                style={{
                  flex: 1, background: "#ef4444", border: "none",
                  borderRadius: 12, padding: "11px", color: "#fff", fontSize: 14,
                  fontWeight: 700, cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

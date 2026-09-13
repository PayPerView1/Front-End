"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/PageLoader";
import {
  Notification,
  Chat,
  InfoSquare,
  Logout,
  Location,
  Calendar,
  TickSquare,
} from "react-iconly";
import { BsStars, BsThreeDots } from "react-icons/bs";
import { FiShare2, FiCopy, FiEdit2, FiUserPlus } from "react-icons/fi";
import { MdOutlineMonitor, MdRocketLaunch } from "react-icons/md";
import LanguageSelector from "@/components/LanguageSelector";
import { useTheme } from "@/context/ThemeContext";
import { createPortal } from "react-dom";
import { AiOutlineStar } from "react-icons/ai";
import { useLocale, useMessages } from "next-intl";
import { getProfile, updateProfile } from "@/services/profile";
import { getSavedUser } from "@/lib/axiosInstance";
import api from "@/lib/axios";
import { useAssistant } from "@/context/AssistantContext";
import { useNotifications } from "@/context/NotificationsContext";
import { useMessages as useChatMessages } from "@/context/MessagesContext";

const profileFallbacks = {
  "campaigns.arabClips": "Arabic Clips Community", "campaigns.creators": "Creators Platform", "campaigns.academy": "Content Academy", "campaigns.followers": "{count} followers",
  "user.joined": "Joined Jul 2026", "user.followers": "Followers", "user.following": "Following",
  "buttons.editProfile": "Edit Profile", "buttons.manageRequests": "Manage Requests", "buttons.createWork": "Create New Work", "buttons.exploreCampaigns": "Explore Campaigns",
  "tabs.creator": "Creator", "tabs.joined": "Joined", "tabs.reviews": "Reviews",
  "coverMenu.share": "Share", "coverMenu.copyLink": "Copy link", "coverMenu.edit": "Edit profile",
  "empty.noCreatedWorks": "No created works yet", "empty.noJoinedCampaigns": "No joined campaigns yet",
  "cardMenu.markRead": "Mark as read", "cardMenu.invite": "Invite people", "cardMenu.copyLink": "Copy link", "cardMenu.writeReview": "Write a review", "cardMenu.leave": "Leave",
  "reviews.noReviews": "No reviews yet", "reviews.noUserReviews": "This user has no reviews yet", "reviews.beFirst": "Be the first to write a review!", "reviews.leaveReview": "Leave a review",
};

function getUserName(user) {
  return (
    user?.fullName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "اسم المستخدم"
  );
}

function getProfileImageUrl(profilePicture) {
  if (!profilePicture) return null;
  if (profilePicture.startsWith("http")) return profilePicture;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://payperview-platform.onrender.com";
  return `${baseUrl.replace(/\/$/, "")}/${profilePicture.replace(/^\//, "")}`;
}

export default function ProfileContent() {
  const [activeTab, setActiveTab] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [coverMenuOpen, setCoverMenuOpen] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const menuRef = useRef(null);
  const coverMenuRef = useRef(null);
  const router = useRouter();
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const { isDark, toggleTheme, setSystemTheme, isSystem } = useTheme();
  const menuDropdownRef = useRef(null);
  const [openCardMenu, setOpenCardMenu] = useState(null);
  const { isAssistantOpen } = useAssistant();
  const { isNotificationsOpen } = useNotifications();
  const { isMessagesOpen } = useChatMessages();
  const messages = useMessages();
  const text = (key, values = {}) => {
    const translated = key.split(".").reduce((value, part) => value && value[part], messages.profile);
    return String(translated || profileFallbacks[key] || key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  };
  const locale = useLocale();
  const isUtilityPanelOpen = isAssistantOpen || isNotificationsOpen || isMessagesOpen;
  const tabs = ["creator", "joined", "reviews"];
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ألوان مركزية حسب الثيم
  const t = {
    bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F5F5F5]",
    navBg: isDark ? "bg-[#0D0D0D]" : "bg-white",
    navBorder: isDark ? "border-[#2D2D2D]" : "border-[#E5E5E5]",
    cardBg: isDark ? "bg-[#1A1A1A]" : "bg-white",
    cardBorder: isDark ? "border-[#2D2D2D]" : "border-[#E5E5E5]",
    coverBg: isDark ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]",
    avatarBg: isDark ? "bg-[#333333]" : "bg-[#D0D0D0]",
    avatarBorder: isDark ? "border-[#0D0D0D]" : "border-white",
    text: isDark ? "text-white" : "text-black",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#666666]",
    tabBorder: isDark ? "border-[#2D2D2D]" : "border-[#E5E5E5]",
    emptyBg: isDark ? "bg-[#1A1A1A]" : "bg-[#F0F0F0]",
    gridBg: isDark ? "bg-[#111]" : "bg-[#E8E8E8]",
    menuBg: isDark ? "bg-[#181818]" : "bg-white",
    menuBorder: isDark ? "border-white/10" : "border-[#E5E5E5]",
    menuText: isDark ? "text-[#E1E3E3]" : "text-[#333]",
    menuFooter: isDark ? "bg-[#111]" : "bg-[#F5F5F5]",
    followers: isDark ? "text-white" : "text-black",
  };
  useEffect(() => {
    function handleClickOutside(e) {
      if (e.target.closest("[data-menu]")) return;
      if (e.target.closest("[data-card-menu]")) return;
      if (e.target.closest(".lang-scroll")) return;

      setMenuOpen(false);
      setCoverMenuOpen(false);
      setOpenCardMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    async function loadProfile() {
      try {
        const savedUser = getSavedUser();
        if (savedUser) setUser(savedUser);
        const result = await getProfile();
        const userData = result?.user || result?.data?.user || result?.data || result;
        if (userData && typeof userData === "object") setUser(userData);
      } catch (error) {
        console.error("خطأ في جلب البروفايل:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  /* بيانات وهمية مؤقتة للانضمامات */

  const joinedCampaigns = [
    {
      id: 1,
      title: text("campaigns.arabClips"),
      category: text("campaigns.followers", { count: "1.2k" }),
      rating: 4.9,
      image: null,
    },
    {
      id: 2,
      title: text("campaigns.creators"),
      category: text("campaigns.followers", { count: "850" }),
      rating: 4.3,
      image: null,
    },
    {
      id: 3,
      title: text("campaigns.academy"),
      category: text("campaigns.followers", { count: "2.4k" }),
      rating: 5.0,
      image: null,
    },
  ];
  if (loading) return <PageLoader />;

  return (
    <div className={`flex flex-col flex-1 ${t.bg}`} dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* الغلاف */}
      <div className="relative mx-2 sm:mx-4 mt-3 sm:mt-4">
        <div
          className={`relative h-[220px] w-full rounded-xl overflow-hidden cursor-pointer ${t.coverBg}`}
          onClick={() => coverInputRef.current?.click()}
        >
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* زر النقاط */}
{!isUtilityPanelOpen && (
  <div ref={coverMenuRef} className="absolute top-3 right-3 z-[100]">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCoverMenuOpen((p) => !p);
              }}
              className="relative z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center border-none cursor-pointer hover:bg-black/80"
            >
              <BsThreeDots size={15} color="#FFFFFF" />
            </button>

            {coverMenuOpen && (
              <div
                data-menu="true"
                className={`absolute top-10 right-0 z-20 w-[160px] p-1 rounded-lg shadow-2xl overflow-hidden border ${t.menuBg} ${t.menuBorder}`}
                onClick={(e) => e.stopPropagation()}
              >
                {[
                  {
                    label: text("coverMenu.share"),
                    icon: FiShare2,
                    action: async () => {
                      try {
                        navigator.share &&
                          (await navigator.share({
                            title: "الملف الشخصي",
                            url: window.location.href,
                          }));
                      } catch {}
                      setCoverMenuOpen(false);
                    },
                  },
                  {
                    label: text("coverMenu.copyLink"),
                    icon: FiCopy,
                    action: async () => {
                      try {
                        await navigator.clipboard.writeText(
                          window.location.href,
                        );
                      } catch {}
                      setCoverMenuOpen(false);
                    },
                  },
                  {
                    label: text("coverMenu.edit"),
                    icon: FiEdit2,
                    href: "/creator/edit-profile",
                  },
                ].map(({ label, icon: Icon, action, href }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={(e) => {
                      if (href) {
                        router.push(href);
                        setCoverMenuOpen(false);
                      } else {
                        action?.();
                      }
                    }}
                    className={`group w-full flex items-center px-3 py-2.5 text-[10px] bg-transparent border-none rounded-[16px] hover:bg-[#94D3C142] transition-all duration-150 cursor-pointer`}
                  >
                    <Icon
                      size={14}
                      className="group-hover:text-[#94D3C1] transition-colors duration-150"
                      color={isDark ? "white" : "#555"}
                    />
                    <span className={`mr-3 ${t.menuText}`}>{label}</span>
                  </button>
                ))}
              </div>
            )}
            </div>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setCoverImage(URL.createObjectURL(f));
            }}
          />
        </div>

        {/* صورة البروفايل */}
        <div
          className={`absolute -bottom-7 z-20 cursor-pointer ${locale === "ar" ? "right-5" : "left-5"}`}
          onClick={(e) => {
            e.stopPropagation();
            profileInputRef.current?.click();
          }}
        >
          <div
            className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center ${t.avatarBg} ${t.avatarBorder}`}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : user?.profilePicture &&
              user.profilePicture !== "default-avatar.png" ? (
              <img
                src={getProfileImageUrl(user.profilePicture)}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className={`text-xl font-bold ${t.text}`}>
                {getUserName(user)[0] || "؟"}
              </span>
            )}
          </div>
          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
              ];
              if (!allowedTypes.includes(f.type) || f.size > 5 * 1024 * 1024) return;

              setProfileImage(URL.createObjectURL(f));
              updateProfile(api.createFormData({ profilePicture: f }))
                .then((result) => {
                  const updatedUser = result?.user || result?.data?.user || result?.data;
                  if (updatedUser && typeof updatedUser === "object") setUser(updatedUser);
                })
                .catch((error) => {
                  console.error("خطأ في تحديث صورة البروفايل:", error);
                });
            }}
          />
        </div>
      </div>

      {/* معلومات البروفايل */}
      <div
        className={`relative z-30 px-6 pt-10 pb-4 ${locale === "ar" ? "text-right" : "text-left"}`}
      >
        <h1 className={`text-xl font-bold ${t.text}`}>
          {getUserName(user)}
        </h1>
        <p className={`text-sm mt-1 ${t.subText}`}>{user?.email}</p>
        <div className={`flex items-center gap-3 mt-3 text-xs ${t.subText}`}>
          <span className="flex items-center gap-1">
            <Location set="light" size={12} primaryColor="#9A9A9A" />
            {user?.city}, {user?.country}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar set="light" size={12} primaryColor="#9A9A9A" />
            {text("user.joined")}
          </span>
        </div>
        <div className={`flex gap-4 mt-2 text-xs ${t.subText}`}>
          <span>
            {text("user.followers")} <span className={`font-bold ${t.followers}`}>0</span>
          </span>
          <span>
            {text("user.following")} <span className={`font-bold ${t.followers}`}>0</span>
          </span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex gap-3 px-6 pb-4">
        {[
          { label: text("buttons.editProfile"), href: "/creator/edit-profile" },
          { label: text("buttons.manageRequests"), href: "/orders" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className={`flex-1 h-10 rounded-lg border text-sm font-bold cursor-pointer transition-all hover:opacity-80 ${t.cardBg} ${t.cardBorder} ${t.text}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* التابز */}
      <div className={`flex w-full border-b px-6 mt-4 ${t.tabBorder}`}>
        {tabs.map((tab) => (
          <div key={tab} className="flex-1 flex flex-col">
            <button
              onClick={() => setActiveTab(tab)}
              className={`w-full text-center py-3 text-sm font-bold transition-all cursor-pointer bg-transparent border-none
                ${activeTab === tab ? t.text : t.subText}`}
            >
              {text(`tabs.${tab}`)}
            </button>
            {activeTab === tab && (
              <div
                className="h-[2px] w-1/2 mx-auto"
                style={{ background: "#FE6B02" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* المحتوى */}
      {activeTab === "" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 sm:p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`aspect-video rounded-xl ${t.gridBg}`} />
          ))}
        </div>
      )}

      {activeTab === "creator" && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${t.emptyBg}`}
          >
            <MdRocketLaunch size={28} color="#F97316" />
          </div>
          <p className={`text-sm font-bold ${t.text}`}>
            {text("empty.noCreatedWorks")}
          </p>
          <button
            className="text-white text-sm font-bold px-10 py-2.5 rounded-lg cursor-pointer border-none transition"
            style={{
              background: "linear-gradient(to right, #FFA600, #FF4B04)",
            }}
          >
            {text("buttons.createWork")}
          </button>
        </div>
      )}
      {activeTab === "joined" && (
        <>
          {joinedCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${t.emptyBg}`}
              >
                <MdRocketLaunch size={28} color="#F97316" />
              </div>
              <p className={`text-sm font-bold ${t.text}`}>
                {text("empty.noJoinedCampaigns")}
              </p>
              <button
                className="text-white text-sm font-bold px-10 py-2.5 rounded-lg cursor-pointer border-none"
                style={{
                  background: "linear-gradient(to right, #FFA600, #FF4B04)",
                }}
              >
                {text("buttons.exploreCampaigns")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3  p-6">
              {joinedCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={`relative rounded-xl border cursor-pointer hover:opacity-90 transition-all ${t.cardBg} ${t.cardBorder}`}
                >
                  {/* قائمة الخيارات */}
                  {openCardMenu === campaign.id && (
                    <div
                      data-card-menu="true"
                      className={`absolute top-9 left-2 z-20 w-44 rounded-xl border shadow-2xl p-1 ${t.menuBg} ${t.menuBorder}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[
                        {
                          label: text("cardMenu.markRead"),
                          icon: (
                            <TickSquare
                              set="light"
                              size={15}
                              primaryColor={isDark ? "#BFC9C4" : "#555"}
                            />
                          ),
                        },
                        {
                          label: text("cardMenu.invite"),
                          icon: (
                            <FiUserPlus
                              size={15}
                              color={isDark ? "#BFC9C4" : "#555"}
                            />
                          ),
                        },
                        {
                          label: text("cardMenu.copyLink"),
                          icon: (
                            <FiCopy
                              size={15}
                              color={isDark ? "#BFC9C4" : "#555"}
                            />
                          ),
                        },
                        {
                          label: text("cardMenu.writeReview"),
                          icon: (
                            <AiOutlineStar
                              size={15}
                              color={isDark ? "#BFC9C4" : "#555"}
                            />
                          ),
                        },
                        {
                          label: text("cardMenu.leave"),
                          icon: (
                            <Logout
                              set="light"
                              size={15}
                              primaryColor="#EF4444"
                            />
                          ),
                          red: true,
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#94D3C142] transition-all
      ${item.red ? "text-red-400" : t.menuText}`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* صورة الكارد */}
                  <div
                    className={`relative w-full aspect-video ${t.gridBg} rounded-t-xl overflow-hidden`}
                  >
                    {campaign.image && (
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCardMenu(
                          openCardMenu === campaign.id ? null : campaign.id,
                        );
                      }}
                      className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center border-none cursor-pointer hover:bg-black/80"
                    >
                      <BsThreeDots size={13} color="white" />
                    </button>
                  </div>

                  {/* معلومات الكارد */}
                  <div className="p-2 text-right">
                    <p className={`text-xs font-bold ${t.text}`}>
                      {campaign.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-[10px]">⭐</span>
                        <span className="text-yellow-400 text-[10px] font-bold">
                          {campaign.rating}
                        </span>
                      </div>
                      <p className={`text-[10px] ${t.subText}`}>
                        {campaign.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "reviews" && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${t.emptyBg}`}
          >
            <MdRocketLaunch size={28} color="#F97316" />
          </div>
          <p className={`text-sm font-bold ${t.text}`}>
            {text("reviews.noReviews")}
          </p>
          <div className="flex flex-col items-center gap-1">
            <p className={`text-xs ${t.subText}`}>
              {text("reviews.noUserReviews")}
            </p>
            <p className={`text-xs ${t.subText}`}>{text("reviews.beFirst")}</p>
          </div>
          <button
            className="relative text-white text-sm font-bold px-14 py-2.5 rounded-lg cursor-pointer border-none overflow-hidden"
            style={{
              background: "linear-gradient(to right, #FFA600, #FF4B04)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "#004D40", opacity: 0.3 }}
            />
            <span className="relative z-10">{text("reviews.leaveReview")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

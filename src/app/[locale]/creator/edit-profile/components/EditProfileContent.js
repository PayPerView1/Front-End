"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  Wallet,
  Bag,
  Document,
  Location,
  People,
  Category,
} from "react-iconly";
import { MdOutlineGavel, MdOutlineSecurity } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";
import { useRouter, usePathname } from "next/navigation";
import api, { getSavedUser } from "@/lib/axiosInstance";
import { useLocale, useTranslations } from "next-intl";
import worldCountries from "world-countries";
import Select from "react-select";
import PageLoader from "@/components/PageLoader";

const menuItems = [
  { key: "profile", icon: RiUserLine },
  { key: "payments", icon: Wallet },
  { key: "services", icon: Bag },
  { key: "security", icon: MdOutlineSecurity },
  { key: "subscriptions", icon: Document },
  { key: "disputes", icon: MdOutlineGavel },
];

const interests = [
  { id: "LIFESTYLE", label: "نمط الحياة" },
  { id: "TECHNOLOGY", label: "التكنولوجيا" },
  { id: "EDUCATION", label: "التعليم" },
  { id: "ENTERTAINMENT", label: "الترفيه" },
  { id: "FINANCE", label: "المالية" },
  { id: "HEALTH", label: "الصحة" },
];

function DatePicker({ value, onChange, isDark, t, locale, placeholder }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("day");
  const ref = useRef(null);

  const today = new Date();
  const selected = value ? new Date(value) : null;

  const [currentMonth, setCurrentMonth] = useState(
    selected?.getMonth() ?? today.getMonth(),
  );

  const [currentYear, setCurrentYear] = useState(
    selected?.getFullYear() ?? today.getFullYear(),
  );

  const months = Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(
      new Date(2026, month, 1),
    ),
  );

  const weekdays = Array.from({ length: 7 }, (_, day) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(2026, 7, 2 + day),
    ),
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectDay(day) {
    const date = new Date(currentYear, currentMonth, day);

    onChange(date.toISOString().split("T")[0]);
    setOpen(false);
  }

  const displayValue = selected
    ? `${selected.getDate()} ${months[selected.getMonth()]
    } ${selected.getFullYear()}`
    : placeholder;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full h-11 rounded-lg border px-4 text-right text-sm cursor-pointer flex items-center justify-between
          hover:border-[#94D3C1]
          ${t.inputBg} ${t.inputBorder} ${t.inputText}`}
      >
        <span className={selected ? t.inputText : "text-[#9A9A9A]"}>
          {displayValue}
        </span>

        <span className={t.subText}>▾</span>
      </button>

      {open && (
        <div
          className={`absolute top-12 right-0 z-50 w-full rounded-xl border shadow-2xl p-3
            ${isDark
              ? "bg-[#1a1a1a] border-[#2D2D2D]"
              : "bg-white border-[#E5E5E5]"
            }`}
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() =>
                setCurrentMonth((p) => {
                  if (p === 0) {
                    setCurrentYear((y) => y - 1);
                    return 11;
                  }

                  return p - 1;
                })
              }
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center bg-transparent border-none cursor-pointer text-[#9A9A9A]"
            >
              ‹
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setView((v) => (v === "month" ? "day" : "month"))
                }
                className={`text-sm font-bold px-2 py-1 rounded-lg bg-transparent border-none cursor-pointer ${t.inputText}`}
              >
                {months[currentMonth]}
              </button>

              <button
                type="button"
                onClick={() => setView((v) => (v === "year" ? "day" : "year"))}
                className={`text-sm font-bold px-2 py-1 rounded-lg bg-transparent border-none cursor-pointer ${t.inputText}`}
              >
                {currentYear}
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentMonth((p) => {
                  if (p === 11) {
                    setCurrentYear((y) => y + 1);
                    return 0;
                  }

                  return p + 1;
                })
              }
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center bg-transparent border-none cursor-pointer text-[#9A9A9A]"
            >
              ›
            </button>
          </div>

          {view === "month" && (
            <div className="grid grid-cols-3 gap-1">
              {months.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setCurrentMonth(i);
                    setView("day");
                  }}
                  className={`py-2 text-xs rounded-lg bg-transparent border-none cursor-pointer transition-all
                    ${currentMonth === i
                      ? "bg-[#94D3C1]/20 text-[#94D3C1]"
                      : `${t.subText} hover:bg-white/5`
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {view === "year" && (
            <div className="grid grid-cols-4 gap-1 max-h-[160px] overflow-y-auto">
              {Array.from(
                { length: 100 },
                (_, i) => today.getFullYear() - i,
              ).map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setCurrentYear(y);
                    setView("day");
                  }}
                  className={`py-2 text-xs rounded-lg bg-transparent border-none cursor-pointer transition-all
                    ${currentYear === y
                      ? "bg-[#94D3C1]/20 text-[#94D3C1]"
                      : `${t.subText} hover:bg-white/5`
                    }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {view === "day" && (
            <>
              <div className="grid grid-cols-7 mb-1">
                {weekdays.map((d) => (
                  <div
                    key={d}
                    className={`text-center text-[10px] py-1 ${t.subText}`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={i} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const isSelected =
                      selected?.getDate() === day &&
                      selected?.getMonth() === currentMonth &&
                      selected?.getFullYear() === currentYear;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => selectDay(day)}
                        className={`w-full aspect-square text-xs rounded-lg bg-transparent border-none cursor-pointer transition-all
                        ${isSelected
                            ? "bg-[#94D3C1] text-white"
                            : `${t.inputText} hover:bg-[#94D3C1]/20`
                          }`}
                      >
                        {day}
                      </button>
                    );
                  },
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Toggle({ value, onChange, isDark }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-10 h-6 rounded-full transition-all duration-200 border-none cursor-pointer
        ${value ? "bg-[#F97316]" : isDark ? "bg-[#333]" : "bg-[#DDD]"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200
          ${value ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}

function getUserFromResponse(result) {
  return result?.user || result?.data?.user || result?.data || result;
}

export default function EditProfileContent() {
  const { isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const copy = useTranslations("editProfile");
  const fieldTextAlign = locale === "en" ? "text-left" : "text-right";

  const [activeMenu, setActiveMenu] = useState("profile");

  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  // true = the user explicitly removed the current/original profile picture
  const [removeProfileImage, setRemoveProfileImage] = useState(false);

  const coverRef = useRef(null);
  const profileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [selectedInterests, setSelectedInterests] = useState([]);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    birthDate: "",
  });

  const [toggles, setToggles] = useState({
    earnings: true,
    location: true,
    openCommunities: false,
    joinedCommunities: false,
  });

  const t = {
    bg: isDark ? "bg-[#0D0D0D]" : "bg-[#F5F5F5]",
    sidebarBg: isDark ? "bg-[#111]" : "bg-white",
    sidebarBorder: isDark ? "border-[#2D2D2D]" : "border-[#E5E5E5]",
    contentBg: isDark ? "bg-[#0D0D0D]" : "bg-[#F5F5F5]",
    cardBg: isDark ? "bg-[#1A1A1A]" : "bg-white",
    cardBorder: isDark ? "border-[#2D2D2D]" : "border-[#E5E5E5]",
    text: isDark ? "text-white" : "text-black",
    subText: isDark ? "text-[#9A9A9A]" : "text-[#666]",
    inputBg: isDark ? "bg-[#111]" : "bg-[#F5F5F5]",
    inputBorder: isDark ? "border-[#2D2D2D]" : "border-[#E0E0E0]",
    inputText: isDark ? "text-white" : "text-black",
    activeMenu: isDark
      ? "bg-[#94D3C1]/10 text-[#94D3C1]"
      : "bg-[#94D3C1]/10 text-[#2a9d8f]",
    hoverMenu: isDark ? "hover:bg-white/5" : "hover:bg-[#F5F5F5]",
  };

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");

    try {
      const hasNewImage = profileImage instanceof File;

      if (Boolean(phone.trim()) !== Boolean(dialCode)) {
        setSaveMsg(locale === "ar" ? "يجب اختيار مقدمة الاتصال مع رقم الهاتف" : "Both country code and phone number must be provided");
        setSaving(false);
        return;
      }

      const payload = {
        fullName: form.name || undefined,
        username: form.username.trim(),
        bio: form.bio.trim(),
        dateOfBirth: form.birthDate || undefined,
        country: country || undefined,
        city: city || undefined,
        interests: selectedInterests,
      };

      if (phone.trim()) {
        payload.phoneNumber = phone.trim();
        payload.phoneCountryCode = dialCode || undefined;
      }

      if (removeProfileImage) {
        // المستخدم مسح الصورة الحالية ولم يرفع صورة بديلة
        // ⚠️ تأكد من الصيغة اللي يتوقعها الـ backend لحذف الصورة
        // (قد تكون "" أو null أو حقل منفصل مثل removeProfilePicture: true)
        payload.profilePicture = "";
      }

      const result = await api.updateProfile(payload);

      if (hasNewImage) {
        await api.updateProfile(api.createFormData({ profilePicture: profileImage }));
      }

      setSaveMsg(copy("saved") + " ✅");

      const updatedUser = getUserFromResponse(result);

      if (updatedUser && typeof updatedUser === "object") {
        const savedUser = api.getSavedUser() || {};
        api.saveAuthData(api.getToken(), {
          ...savedUser,
          ...updatedUser,
          fullName: form.name,
          username: form.username.trim(),
          bio: form.bio.trim(),
        });
      }

      setTimeout(() => {
        const savedUser = getSavedUser();
        if (pathname?.includes("/advertiser") || savedUser?.role === "BRAND") {
          router.push(`/${locale}/advertiser/dashboard`);
        } else {
          router.push(`/${locale}/creator/dashboard`);
        }
      }, 1000);
    } catch (error) {
      const responseErrors = error.response?.data?.errors;
      if (responseErrors && Array.isArray(responseErrors)) {
        const errorMsgs = responseErrors.map(err => `${err.field}: ${err.message}`).join(" | ");
        setSaveMsg(errorMsgs);
      } else if (error.response?.data?.message) {
        setSaveMsg(error.response.data.message);
      } else {
        setSaveMsg(`${copy("saveError")}: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await api.getProfile();
        const user = getUserFromResponse(result);

        setForm({
          name: user?.fullName || "",
          username: user?.username || "",
          email: user?.email || "",
          bio: user?.bio || "",
          birthDate: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        });

        if (user?.interests && user.interests.length > 0) {
          setSelectedInterests(user.interests);
        } else {
          const pending = sessionStorage.getItem("userInterests");
          if (pending) {
            try {
              const parsed = JSON.parse(pending);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setSelectedInterests(parsed);
                api.updateInterests(parsed).catch(() => {});
                sessionStorage.removeItem("userInterests");
              }
            } catch (e) {
              // ignore
            }
          }
        }

        setPhone(user?.phoneNumber || "");
        setDialCode(user?.phoneCountryCode || "");
        setCountry(user?.country || "");
        setCity(user?.city || "");

        if (
          user.profilePicture &&
          user.profilePicture !== "default-avatar.png"
        ) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://payperview-platform.onrender.com";
          const imageUrl = user.profilePicture.startsWith("http")
            ? user.profilePicture
            : `${baseUrl.replace(/\/$/, "")}/${user.profilePicture.replace(/^\//, "")}`;
          setProfileImagePreview(imageUrl);
        }
      } catch (error) {
        console.error("خطأ:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const countries = worldCountries
    .map((c) => ({
      name: c.translations.ara?.common || c.name.common,
      code: c.cca2,
      dial: c.idd.root + (c.idd.suffixes?.[0] || ""),
      flag: c.flag,
    }))
    .filter((c) => c.dial && c.dial !== "")
    .sort((a, b) => a.name.localeCompare(b.name, "ar"));

  const dialOptions = countries.map((c) => ({
    value: c.dial,
    label: `${c.flag} ${c.dial}`,
  }));

  const countryOptions = countries.map((c) => ({
    value: c.code,
    label: `${c.flag} ${c.name}`,
  }));

  if (loading) return <PageLoader />;

  return (
    <div
      className={`flex flex-col md:flex-row flex-1 w-full min-w-0 ${t.bg}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div
        className={`w-full md:w-[240px] flex-shrink-0 border-b md:border-b-0 md:border-l flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-start gap-4 py-3 md:py-4 px-4 sm:px-6 md:px-2 ${t.sidebarBg} ${t.sidebarBorder}`}
      >
        <p
          className={`text-[10px] sm:text-xs font-bold px-1 sm:px-3 mb-3 ${t.subText}
          ${isDark ? "text-white" : "text-black"}
          hidden md:block
        `}
        >
          {copy("accountSettings")}
        </p>

        <nav className="flex flex-row md:flex-col gap-1 flex-1 md:flex-initial overflow-x-auto md:overflow-x-visible lang-scroll">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveMenu(item.key)}
                className={`flex items-center gap-1 sm:gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm text-right bg-transparent border-none cursor-pointer transition-all whitespace-nowrap
                  ${isActive ? t.activeMenu : `${t.subText} ${t.hoverMenu}`}`}
              >
                <Icon size={18} color={isActive ? "#94D3C1" : "#9A9A9A"} />

                <span>{copy(item.key)}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`md:border-t md:pt-4 flex-shrink-0 ${t.sidebarBorder}`}>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/logout`)}
            className="w-full h-9 px-4 md:px-0 rounded-lg text-white text-xs sm:text-sm font-bold cursor-pointer border-none whitespace-nowrap"
            style={{
              background: "#DC2626",
            }}
          >
            {copy("signOut")}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className={`flex-1 min-w-0 flex flex-col overflow-y-auto ${t.contentBg}`}
      >
        <div className="w-full min-w-0 px-2 sm:px-4 lg:px-6 py-4 sm:py-6 flex flex-col gap-5 sm:gap-6">
          {/* Cover */}
          <div className="relative">
            <div
              className={`relative h-[100px] sm:h-[140px] md:h-[160px] lg:h-[190px] w-full rounded-xl overflow-hidden cursor-pointer ${isDark ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]"
                }`}
              onClick={() => coverRef.current?.click()}
            >
              {coverImage && (
                <img
                  src={coverImage}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];

                if (f) {
                  setCoverImage(URL.createObjectURL(f));
                }
              }}
            />

            {/* Profile */}
            <div
              className={`absolute -bottom-7 ${locale === "ar" ? "right-2 sm:right-4" : "left-2 sm:left-4"
                }`}
            >
              <div
                onClick={() => profileRef.current?.click()}
                className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center cursor-pointer
                  ${isDark
                    ? "bg-[#333] border-[#0D0D0D]"
                    : "bg-[#D0D0D0] border-white"
                  }`}
              >
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <RiUserLine size={22} color="#9A9A9A" />
                )}
              </div>

              {/* زر إلغاء/حذف صورة البروفايل - يظهر فقط عند وجود صورة */}
              {profileImagePreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileImage(null);
                    setProfileImagePreview(null);
                    setRemoveProfileImage(true);
                    if (profileRef.current) profileRef.current.value = "";
                  }}
                  aria-label="إزالة صورة البروفايل"
                  className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs flex items-center justify-center border-2 border-white shadow cursor-pointer transition-all"
                >
                  ✕
                </button>
              )}

              <input
                ref={profileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];

                  if (f) {
                    const allowedTypes = [
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/webp",
                    ];
                    if (!allowedTypes.includes(f.type) || f.size > 5 * 1024 * 1024) {
                      setSaveMsg("الصورة يجب أن تكون jpeg أو jpg أو png أو webp وبحجم أقصى 5MB");
                      e.target.value = "";
                      return;
                    }
                    setProfileImage(f);
                    setProfileImagePreview(URL.createObjectURL(f));
                    setRemoveProfileImage(false);
                  }
                }}
              />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1 mt-4">
            <label
              className={`text-xs sm:text-sm font-bold ${fieldTextAlign} ${t.text}`}
            >
              {copy("name")}
            </label>

            <input
              type="text"
              value={form.name}
              maxLength={30}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className={`w-full h-10 sm:h-11 rounded-lg border px-3 sm:px-4 ${fieldTextAlign} text-xs sm:text-sm outline-none transition-all
                focus:border-[#94D3C1]
                ${t.inputBg}
                ${t.inputBorder}
                ${t.inputText}
                placeholder-[#9A9A9A]`}
            />

            <div className="flex gap-2 justify-end">
              <span className={`text-[10px] sm:text-xs ${t.subText}`}>
                {form.name.length}/30
              </span>
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className={`text-xs sm:text-sm font-bold ${t.text}`}>
              {copy("username")}
            </label>

            <input
              type="text"
              value={form.username}
              maxLength={42}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
              className={`w-full h-10 sm:h-11 rounded-lg border px-3 sm:px-4 ${fieldTextAlign} text-xs sm:text-sm outline-none transition-all
                focus:border-[#94D3C1]
                ${t.inputBg}
                ${t.inputBorder}
                ${t.inputText}
                placeholder-[#9A9A9A]`}
            />

            <div className="flex gap-2 justify-end">
              <span className={`text-[10px] sm:text-xs ${t.subText}`}>
                {form.username.length}/42
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className={`text-xs sm:text-sm font-bold ${t.text}`}>
              {copy("email")}
            </label>

            <input
              type="email"
              value={form.email}
              maxLength={42}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className={`w-full h-10 sm:h-11 rounded-lg border px-3 sm:px-4 ${fieldTextAlign} text-xs sm:text-sm outline-none transition-all
                focus:border-[#94D3C1]
                ${t.inputBg}
                ${t.inputBorder}
                ${t.inputText}
                placeholder-[#9A9A9A]`}
            />

            <div className="flex gap-2 justify-end">
              <span className={`text-[10px] sm:text-xs ${t.subText}`}>
                {form.email.length}/42
              </span>
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className={`text-xs sm:text-sm font-bold ${t.text}`}>
              {copy("bio")}
            </label>

            <textarea
              value={form.bio}
              maxLength={100}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value,
                })
              }
              placeholder={copy("bioPlaceholder")}
              rows={3}
              className={`w-full rounded-lg border px-3 sm:px-4 py-3 text-xs sm:text-sm ${fieldTextAlign} outline-none resize-none transition-all
                focus:border-[#94D3C1]
                ${t.inputBg}
                ${t.inputBorder}
                ${t.inputText}
                placeholder-[#9A9A9A]`}
            />

            <div className="flex gap-2 justify-end">
              <span className={`text-[10px] sm:text-xs ${t.subText}`}>
                {form.bio.length}/100
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className={`text-xs sm:text-sm font-bold ${t.text}`}>
              رقم الهاتف
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Dial Code */}
              <div className="w-full sm:w-[30%]">
                <Select
                  instanceId="dial-code-select"
                  options={dialOptions}
                  onChange={(opt) => setDialCode(opt.value)}
                  isSearchable
                  placeholder="اختر"
                  value={
                    dialOptions.find((o) => o.value === dialCode) || undefined
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      height: "44px",
                      minHeight: "44px",
                      width: "100%",
                      background: isDark ? "#111" : "#F5F5F5",
                      borderColor: state.isFocused
                        ? "#94D3C1"
                        : isDark
                          ? "#2D2D2D"
                          : "#E0E0E0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      boxShadow: "none",
                    }),

                    menu: (base) => ({
                      ...base,
                      width: "200px",
                      maxWidth: "90vw",
                      zIndex: 9999,
                      background: isDark ? "#1a1a1a" : "white",
                      border: `1px solid ${isDark ? "#2D2D2D" : "#E5E5E5"}`,
                      borderRadius: "8px",
                    }),

                    option: (base, state) => ({
                      ...base,
                      fontSize: "13px",
                      background: state.isSelected
                        ? "#F97316"
                        : state.isFocused
                          ? isDark
                            ? "#2a2a2a"
                            : "#F5F5F5"
                          : "transparent",
                      color: isDark ? "white" : "black",
                      cursor: "pointer",
                    }),

                    singleValue: (base) => ({
                      ...base,
                      fontSize: "13px",
                      color: isDark ? "white" : "black",
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: "#9A9A9A",
                      fontSize: "13px",
                    }),

                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                  }}
                />
              </div>

              {/* Phone */}
              <div className="w-full sm:w-[70%]">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="أدخل رقم الهاتف"
                  className={`w-full h-11 rounded-lg border px-3 sm:px-4 ${fieldTextAlign} text-xs sm:text-sm outline-none transition-all
                    focus:border-[#94D3C1]
                    ${t.inputBg}
                    ${t.inputBorder}
                    ${t.inputText}
                    placeholder-[#9A9A9A]`}
                />
              </div>
            </div>
          </div>

          {/* Country + City */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Country */}
            <div className="flex flex-col gap-1 w-full sm:w-[30%]">
              <label className={`text-xs sm:text-sm font-bold ${t.text}`}>
                الدولة
              </label>

              <Select
                instanceId="country-select"
                options={countryOptions}
                onChange={(opt) => setCountry(opt.value)}
                isSearchable
                placeholder="اختر الدولة"
                value={
                  countryOptions.find((o) => o.value === country) || undefined
                }
                styles={{
                  control: (base, state) => ({
                    ...base,
                    height: "44px",
                    minHeight: "44px",
                    background: isDark ? "#111" : "#F5F5F5",
                    borderColor: state.isFocused
                      ? "#94D3C1"
                      : isDark
                        ? "#2D2D2D"
                        : "#E0E0E0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "none",
                  }),

                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                    maxWidth: "90vw",
                    background: isDark ? "#1a1a1a" : "white",
                    border: `1px solid ${isDark ? "#2D2D2D" : "#E5E5E5"}`,
                    borderRadius: "8px",
                  }),

                  option: (base, state) => ({
                    ...base,
                    fontSize: "13px",
                    background: state.isSelected
                      ? "#F97316"
                      : state.isFocused
                        ? isDark
                          ? "#2a2a2a"
                          : "#F5F5F5"
                        : "transparent",
                    color: isDark ? "white" : "black",
                    cursor: "pointer",
                  }),

                  singleValue: (base) => ({
                    ...base,
                    fontSize: "13px",
                    color: isDark ? "white" : "black",
                  }),

                  placeholder: (base) => ({
                    ...base,
                    color: "#9A9A9A",
                    fontSize: "13px",
                  }),

                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                }}
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-1 w-full sm:w-[70%]">
              <label className={`text-xs sm:text-sm font-bold ${t.text}`}>
                المدينة
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: دبي"
                className={`w-full h-11 rounded-lg border px-3 sm:px-4 ${fieldTextAlign} text-xs sm:text-sm outline-none transition-all
                  focus:border-[#94D3C1]
                  ${t.inputBg}
                  ${t.inputBorder}
                  ${t.inputText}
                  placeholder-[#9A9A9A]`}
              />
            </div>
          </div>

          {/* Interests */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs sm:text-sm font-bold ${t.text}`}>
              الاهتمامات
            </label>

            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((id) => {
                  const item = interests.find((i) => i.id === id);

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(90deg, #FFA600, #FF4B04)",
                      }}
                    >
                      <span>{item?.label}</span>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedInterests((prev) =>
                            prev.filter((i) => i !== id),
                          )
                        }
                        className="bg-transparent border-none cursor-pointer text-white flex items-center p-0 mr-1"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              className={`flex flex-wrap gap-2 p-2 sm:p-3 rounded-lg border ${t.inputBg} ${t.inputBorder}`}
            >
              {interests.map((item) => {
                const isSelected = selectedInterests.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedInterests((prev) =>
                        isSelected
                          ? prev.filter((i) => i !== item.id)
                          : [...prev, item.id],
                      );
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border-none cursor-pointer transition-all
                      ${isSelected
                        ? "text-white"
                        : `${t.subText} ${isDark ? "bg-white/5" : "bg-[#F0F0F0]"
                        }`
                      }`}
                    style={
                      isSelected
                        ? {
                          background:
                            "linear-gradient(90deg, #FFA600, #FF4B04)",
                        }
                        : {}
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Birth Date */}
          <div className="flex flex-col gap-1 w-full sm:max-w-[280px]">
            <label
              className={`text-xs sm:text-sm font-bold ${fieldTextAlign} ${t.text}`}
            >
              {copy("birthDate")}
            </label>

            <DatePicker
              value={form.birthDate}
              onChange={(val) =>
                setForm({
                  ...form,
                  birthDate: val,
                })
              }
              isDark={isDark}
              t={t}
              locale={locale}
              placeholder={copy("birthDate")}
            />
          </div>

          {/* Additional Settings */}
          <div className="flex flex-col gap-1">
            <label
              className={`text-xs sm:text-sm font-bold ${fieldTextAlign} ${t.text}`}
            >
              {copy("additionalSettings")}
            </label>

            <p className={`text-[10px] sm:text-xs ${fieldTextAlign} ${t.subText}`}>
              {copy("additionalDescription")}
            </p>

            <div
              className={`flex flex-col gap-0 rounded-xl border overflow-hidden mt-2 ${t.cardBg} ${t.cardBorder}`}
            >
              {[
                {
                  key: "earnings",
                  label: copy("earnings"),
                  icon: Wallet,
                },
                {
                  key: "location",
                  label: copy("location"),
                  icon: Location,
                },
                {
                  key: "openCommunities",
                  label: copy("openCommunities"),
                  icon: Category,
                },
                {
                  key: "joinedCommunities",
                  label: copy("joinedCommunities"),
                  icon: People,
                },
              ].map((item, i, arr) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between px-3 sm:px-4 py-3
                      ${i < arr.length - 1 ? `border-b ${t.cardBorder}` : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon set="light" size={18} primaryColor="#9CA3AF" />

                      <span
                        className={`text-[10px] sm:text-sm font-bold truncate ${t.text}`}
                      >
                        {item.label}
                      </span>
                    </div>

                    <Toggle
                      value={toggles[item.key]}
                      onChange={(val) =>
                        setToggles({
                          ...toggles,
                          [item.key]: val,
                        })
                      }
                      isDark={isDark}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Save */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-[250px] h-11 px-4 sm:px-8 rounded-lg text-white text-xs sm:text-sm font-bold cursor-pointer border-none disabled:opacity-70"
              style={{
                background: "linear-gradient(to right, #FFA600, #FF4B04)",
              }}
            >
              {saving ? copy("saving") : copy("save")}
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={() => {
                const savedUser = getSavedUser();
                if (pathname?.includes("/advertiser") || savedUser?.role === "BRAND") {
                  router.push(`/${locale}/advertiser/dashboard`);
                } else {
                  router.push(`/${locale}/creator/dashboard`);
                }
              }}
              className={`w-full sm:w-[130px] h-11 px-4 sm:px-8 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-all border
                hover:border-[#94D3C1]
                focus:border-[#94D3C1]
                focus:outline-none
                ${isDark
                  ? "bg-transparent border-[#A1A1AA] text-white"
                  : "bg-transparent border-[#A1A1AA] text-black"
                }`}
            >
              {copy("cancel")}
            </button>
          </div>

          {/* Save Message */}
          {saveMsg && (
            <p
              className={`text-xs sm:text-sm text-right ${saveMsg.includes("✅") ? "text-[#94D3C1]" : "text-red-400"
                }`}
            >
              {saveMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

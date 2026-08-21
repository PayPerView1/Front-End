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
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useLocale, useTranslations } from "next-intl";

const menuItems = [
  { key: "profile", icon: RiUserLine },
  { key: "payments", icon: Wallet },
  { key: "services", icon: Bag },
  { key: "security", icon: MdOutlineSecurity },
  { key: "subscriptions", icon: Document },
  { key: "disputes", icon: MdOutlineGavel },
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
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2026, month, 1)),
  );
  const weekdays = Array.from({ length: 7 }, (_, day) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2026, 7, 2 + day)),
  );
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
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
    ? `${selected.getDate()} ${months[selected.getMonth()]} ${selected.getFullYear()}`
    : placeholder;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full h-11 rounded-lg border px-4 text-right text-sm cursor-pointer flex items-center justify-between
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
            ${isDark ? "bg-[#1a1a1a] border-[#2D2D2D]" : "bg-white border-[#E5E5E5]"}`}
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          {/* Header */}
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

          {/* الأشهر */}
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
                    ${currentMonth === i ? "bg-[#94D3C1]/20 text-[#94D3C1]" : `${t.subText} hover:bg-white/5`}`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* السنوات */}
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
                    ${currentYear === y ? "bg-[#94D3C1]/20 text-[#94D3C1]" : `${t.subText} hover:bg-white/5`}`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* الأيام */}
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
                        ${isSelected ? "bg-[#94D3C1] text-white" : `${t.inputText} hover:bg-[#94D3C1]/20`}`}
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

export default function EditProfileContent() {
  const { isDark } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const copy = useTranslations("editProfile");
  const [activeMenu, setActiveMenu] = useState("profile");
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const coverRef = useRef(null);
  const profileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
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
      let data;
      if (hasNewImage) {
        data = api.createFormData({
          fullName: form.name,
          profilePicture: profileImage,
        });
      } else {
        data = { fullName: form.name };
      }
      const result = await api.updateProfile(data);
      setSaveMsg(copy("saved"));
      const updatedUser = result?.user || result?.data || result;
      if (updatedUser) api.saveAuthData(api.getToken(), updatedUser);
    } catch (error) {
      setSaveMsg(`${copy("saveError")}: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }
  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await api.getProfile();
        const user = result?.user || result?.data || result;
        setForm({
          name: user?.fullName || "",
          username: user?.username || "",
          bio: user?.bio || "",
          birthDate: user?.birthDate || "",
        });
        // إذا عنده صورة
        if (
          user.profilePicture &&
          user.profilePicture !== "default-avatar.png"
        ) {
          setProfileImage(
            `https://payperview-platform.onrender.com/${user.profilePicture}`,
          );
        }
      } catch (error) {
        console.error("خطأ:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);
  return (
    <div className={`flex flex-1 w-full ${t.bg}`} dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* ===== قائمة الإعدادات ===== */}
      <div
        className={`w-[240px] flex-shrink-0 border-l flex flex-col py-4 px-2 ${t.sidebarBg} ${t.sidebarBorder}`}
      >
        <p
          className={` text-xs font-bold px-3 mb-3 ${t.subText}
        ${isDark ? "text-white" : "text-black"}
        `}
        >
          {copy("accountSettings")}
        </p>
        <nav className="flex flex-col gap-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveMenu(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-right bg-transparent border-none cursor-pointer transition-all
                  ${isActive ? t.activeMenu : `${t.subText} ${t.hoverMenu}`}`}
              >
                <Icon size={18} color={isActive ? "#94D3C1" : "#9A9A9A"} />
                <span>{copy(item.key)}</span>
              </button>
            );
          })}
        </nav>

        {/* زر تسجيل الخروج */}
        <div className={`border-t pt-4 px-2 ${t.sidebarBorder}`}>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/logout`)}
            className="w-full h-10 rounded-lg text-white text-sm font-bold cursor-pointer border-none"
            style={{ background: "#DC2626" }}
          >
            {copy("signOut")}
          </button>
        </div>
      </div>

      {/* ===== المحتوى ===== */}
      <div className={`flex-1 flex flex-col overflow-y-auto ${t.contentBg}`}>
        <div className="w-full px-6 py-6 flex flex-col gap-6">
          {/* الغلاف */}
          <div className="relative">
            <div
              className={`relative h-[120px] sm:h-[160px] w-full rounded-xl overflow-hidden cursor-pointer ${isDark ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]"}`}
              onClick={() => coverRef.current?.click()}
            >
              {coverImage && (
                <img
                  src={coverImage}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center"></div>
            </div>
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setCoverImage(URL.createObjectURL(f));
              }}
            />

            {/* صورة البروفايل */}
            <div
              className="absolute -bottom-7 right-4 cursor-pointer"
              onClick={() => profileRef.current?.click()}
            >
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center
                ${isDark ? "bg-[#333] border-[#0D0D0D]" : "bg-[#D0D0D0] border-white"}`}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <RiUserLine size={22} color="#9A9A9A" />
                )}
              </div>
              <input
                ref={profileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setProfileImage(URL.createObjectURL(f));
                }}
              />
            </div>
          </div>

          {/* الاسم */}
          <div className="flex flex-col gap-1 mt-4">
            <label className={`text-sm font-bold text-right ${t.text}`}>
              {copy("name")}
            </label>

            <input
              type="text"
              value={form.name}
              maxLength={30}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full h-11 rounded-lg border px-4 text-right text-sm outline-none transition-all
                ${t.inputBg} ${t.inputBorder} ${t.inputText}`}
            />
            <div className="flex gap-2 justify-end">
              <span className={`text-xs ${t.subText}`}>
                {form.name.length}/30
              </span>
            </div>
          </div>

          {/* اسم المستخدم */}
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-bold ${t.text}`}>
              {copy("username")}
            </label>

            <input
              type="text"
              value={form.username}
              maxLength={42}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={`w-full h-11 rounded-lg border px-4 text-right text-sm outline-none transition-all
                ${t.inputBg} ${t.inputBorder} ${t.inputText}`}
            />
            <div className="flex gap-2 justify-end">
              <span className={`text-xs ${t.subText}`}>
                {form.username.length}/42
              </span>
            </div>
          </div>

          {/* نبذة شخصية */}
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-bold ${t.text}`}>{copy("bio")}</label>

            <textarea
              value={form.bio}
              maxLength={100}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder={copy("bioPlaceholder")}
              rows={3}
              className={`w-full rounded-lg border px-4 py-3 text-right text-sm outline-none resize-none transition-all
                ${t.inputBg} ${t.inputBorder} ${t.inputText} placeholder-[#9A9A9A]`}
            />
            <div className="flex gap-2 justify-end">
              <span className={`text-xs ${t.subText}`}>
                {form.bio.length}/100
              </span>
            </div>
          </div>

          {/* تاريخ الميلاد */}
          <div className="flex flex-col gap-1 w-full sm:max-w-[280px]">
            <label className={`text-sm font-bold text-right ${t.text}`}>
              {copy("birthDate")}
            </label>
            <DatePicker
              value={form.birthDate}
              onChange={(val) => setForm({ ...form, birthDate: val })}
              isDark={isDark}
              t={t}
              locale={locale}
              placeholder={copy("birthDate")}
            />
          </div>

          {/* تقاضين إضافية */}
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-bold text-right ${t.text}`}>
              {copy("additionalSettings")}
            </label>
            <p className={`text-xs text-right ${t.subText}`}>
              {copy("additionalDescription")}
            </p>
            <div
              className={`flex flex-col gap-0 rounded-xl border overflow-hidden mt-2 ${t.cardBg} ${t.cardBorder}`}
            >
              {[
                { key: "earnings", label: copy("earnings"), icon: Wallet },
                { key: "location", label: copy("location"), icon: Location },
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
                    className={`flex items-center justify-between px-4 py-3
        ${i < arr.length - 1 ? `border-b ${t.cardBorder}` : ""}`}
                  >
                    {/* الأيقونة والنص على اليمين */}
                    <div className="flex items-center gap-2">
                      <Icon set="light" size={18} primaryColor="#9CA3AF" />
                      <span className={`text-sm font-bold ${t.text}`}>
                        {item.label}
                      </span>
                    </div>
                    {/* الزر على اليسار */}
                    <Toggle
                      value={toggles[item.key]}
                      onChange={(val) =>
                        setToggles({ ...toggles, [item.key]: val })
                      }
                      isDark={isDark}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* زر الحفظ */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-[200px] sm:mr-auto h-11 rounded-lg text-white text-sm font-bold cursor-pointer border-none disabled:opacity-70"
            style={{
              background: "linear-gradient(to right, #FFA600, #FF4B04)",
            }}
          >
            {saving ? copy("saving") : copy("save")}
          </button>

          {saveMsg && (
            <p
              className={`text-sm text-right ${saveMsg.includes("✅") ? "text-[#94D3C1]" : "text-red-400"}`}
            >
              {saveMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

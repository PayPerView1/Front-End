"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import StepIndicator from "@/app/[locale]/(auth)/register/components/StepIndicator";
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineComputerDesktop,
} from "react-icons/hi2";
import { MdOutlineLocalMovies } from "react-icons/md";
import { PiGraduationCapLight } from "react-icons/pi";
import { TbShieldPlus } from "react-icons/tb";
import { BsWallet2 } from "react-icons/bs";
import api from "@/services";

const interests = [
  { id: "LIFESTYLE", label: "نمط الحياة", icon: HiOutlineDevicePhoneMobile },
  { id: "TECHNOLOGY", label: "التكنولوجيا", icon: HiOutlineComputerDesktop },
  { id: "EDUCATION", label: "التعليم", icon: PiGraduationCapLight },
  { id: "ENTERTAINMENT", label: "الترفيه", icon: MdOutlineLocalMovies },
  { id: "FINANCE", label: "المالية", icon: BsWallet2 },
  { id: "HEALTH", label: "الصحة", icon: TbShieldPlus },
];

export default function InterestsForm() {
  const router = useRouter();
  const locale = useLocale();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("userInterests");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSelected(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function toggleInterest(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      if (selected.length > 0) {
        sessionStorage.setItem("userInterests", JSON.stringify(selected));
        if (api.getToken()) {
          await api.updateInterests(selected);
        }
      }
      router.push(`/${locale}/register/verify`);
    } catch (err) {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="w-full max-w-[520px] flex flex-col gap-4 py-6 px-4 lg:px-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-lg mx-4 lg:mx-0"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-right text-[#E1E3E4]">
          اهتماماتك
        </h2>
        <p className="text-sm text-right text-[#BFC9C4]">
          اختر المجالات التي تهمك لتخصيص تجربتك
        </p>
      </div>

      <StepIndicator currentStep={4} />

      <div className="grid grid-cols-2 gap-3">
        {interests.map((item) => {
          const isSelected = selected.includes(item.id);
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => toggleInterest(item.id)}
              className={`h-[90px] rounded-xl border p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                ${isSelected ? "border-[#F97316] bg-white/5" : "border-[#FFEEE3]/40 bg-white/5"}`}
            >
              <IconComponent
                size={28}
                color={isSelected ? "#F97316" : "rgba(255,255,255,0.7)"}
              />
              <p className="text-sm font-light text-[#E1E3E4] m-0">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-400 text-right">{error}</p>}

      <div className="flex flex-row-reverse items-center justify-between mt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="h-12 px-6 rounded-lg text-white text-base leading-none font-bold cursor-pointer border-none opacity-100 disabled:opacity-70 flex items-center justify-center"
          style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
        >
          {loading ? "جاري الحفظ..." : "الانتقال للوحة التحكم"}
        </button>
        <button
          onClick={() => router.push(`/${locale}/register/verify`)}
          className="text-sm leading-none text-[#BFC9C4] bg-transparent border-none cursor-pointer flex items-center justify-center"
        >
          تخطى الآن
        </button>
      </div>
    </div>
  );
}

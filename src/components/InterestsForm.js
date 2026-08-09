"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { MdOutlineLocalMovies } from "react-icons/md";          
import { PiGraduationCapLight } from "react-icons/pi";          
import { TbShieldPlus } from "react-icons/tb";                    
import { BsWallet2 } from "react-icons/bs";                   

const interests = [
    { id: "lifestyle", label: "نمط الحياة", icon: HiOutlineDevicePhoneMobile },
    { id: "tech", label: "التكنولوجيا", icon: HiOutlineComputerDesktop },
    { id: "education", label: "التعليم", icon: PiGraduationCapLight},
    { id: "entertainment", label: "الترفيه", icon: MdOutlineLocalMovies},
    { id: "finance", label: "المالية", icon: BsWallet2},
    { id: "health", label: "الصحة", icon: TbShieldPlus},

];

export default function InterestsForm() {
    const router = useRouter();
    const [selected, setSelected] = useState([]);

function toggleInterest(id) {
    setSelected((prev) =>prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
}
function handleSubmit() {
    router.push("/register/verify")
    // router.push("/dashboard");
}

    return (
    <div
  dir="rtl"
  className="w-full max-w-[520px] flex flex-col gap-4 py-6 px-4 lg:px-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-lg mx-4 lg:mx-0"
>
        {/* العنوان */}
        <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-right text-[#E1E3E4]">
                    اهتماماتك
            </h2>
            <p className="text-sm text-right text-[#BFC9C4]">
                    اختر المجالات التي تهمك لتخصيص تجربتك
            </p>
        </div>
        
        {/* StepIndicator */}
        <StepIndicator currentStep={4} />
        
        {/* اختيار الاهتمامات*/}
        <div className="grid grid-cols-2 gap-3">
            {interests.map((item) => {
                const isSelected = selected.includes(item.id);
                const IconComponent = item.icon;
            return (
            <div
            key={item.id}
            onClick={() => toggleInterest(item.id)}
            className={`h-[90px] rounded-xl border p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
  ${isSelected
    ? "border-[#F97316] bg-white/5"
    : "border-[#FFEEE3]/40 bg-white/5"
  }`}
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

      {/* الأزرار */}
      <div className="flex flex-row-reverse items-center justify-between mt-2">
        {/* الانتقال للوحة التحكم يسار */}
        <button
          onClick={handleSubmit}
          className="h-12 px-6 rounded-lg text-white text-base font-bold cursor-pointer border-none"
          style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
        >
          الانتقال للوحة التحكم
        </button>
        {/* تخطى الآن يمين */}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-[#BFC9C4] bg-transparent border-none cursor-pointer"
        >
          تخطى الآن
        </button>

      </div>
    </div>
  );
}
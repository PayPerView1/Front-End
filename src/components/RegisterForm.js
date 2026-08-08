"use client";
import { useState } from "react";
import StepIndicator from "@/components/StepIndicator";
import { useRouter } from "next/navigation";
export default function RegisterForm() {
  const router = useRouter();
  const [userType, setUserType] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [emailError, setEmailError] = useState("");
  function getStrength(pass) {
    if (pass.length === 0) return 0;
  let score = 0;
  if (pass.length >= 10) score++;               
  if (/[A-Za-z]/.test(pass)) score++;           
  if (/[0-9]/.test(pass)) score++;              
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
}
function validate() {
    const newErrors = {};
    if (!userType) newErrors.userType = "اختر نوع الحساب";
    if (!name.trim()) newErrors.name = "أدخل الاسم الكامل";
    if (!email.trim()) newErrors.email = "أدخل البريد الإلكتروني";
    return newErrors;
  }
function checkEmail(value) {
  setEmail(value);
  if (value === "test@test.com") {
    setErrors(prev => ({ ...prev, email: "هذا البريد الإلكتروني مسجل مسبقاً." }));
  } else {
    setErrors(prev => ({ ...prev, email: "" }));
  }
}
function handleNext() {
    const newErrors = validate();
    if (errors.email) {
    return;
  }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    router.push("/register/password");
  }
  return (
    <div
    dir="rtl"
    className="w-full max-w-[520px] flex flex-col gap-4 py-8 px-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-lg"
>
      {/* إنشاء حساب جديد */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-right text-[#E1E3E4]">
          إنشاء حساب جديد
        </h2>
        <p className="text-sm text-right text-[#BFC9C4]">
          أدخل تفاصيلك للبدء
        </p>
      </div>

      {/* StepIndicator */}
      <StepIndicator currentStep={currentStep} />
      <div className="flex flex-row gap-4 w-full mt-2"></div>

      {/* اختيار نوع الحساب */}
      <div className="flex flex-row gap-4 w-full">
        {errors.userType && (
      <p className="text-xs text-red-400">{errors.userType}</p>
    )}

        {/* صانع محتوى */}
        <div
          onClick={() => setUserType("creator")}
          className={`flex-1 h-[90px] rounded-xl border p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all
            ${userType === "creator"
              ? "border-[#FE6B02] bg-gradient-to-b from-[#FE6B02] to-[#EA580C]"
              : "border-[#FFEEE3]/40 bg-transparent"
            }`}
        >
          <div className="relative">
            {/* أيقونة الشخص */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="7" r="4" />
              <path d="M12 13c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z" />
            </svg>
            {/* دايرة Play برتقالية */}
            <div className={`absolute -bottom-0 left-3 w-3 h-3 rounded-full flex items-center justify-center
              ${userType === "creator" ? "bg-[#94D3C1]" : "bg-[#FE6B02]"}`}>
                <svg width="7" height="7" viewBox="0 0 10 10" fill="white">
                  <polygon points="2,1 9,5 2,9" />
                  </svg>
                  </div>
          </div>
          <p className="text-sm font-bold text-[#E1E3E4] m-0">صانع محتوى</p>
          <p className="text-xs text-[#BFC9C4] m-0">أقدم خدمات</p>
        </div>

        {/* صاحب حملة */}
        <div
          onClick={() => setUserType("brand")}
          className={`flex-1 h-[90px] rounded-xl border p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all 
            ${userType === "brand"
              ? "border-[#FE6B02] bg-gradient-to-b from-[#FE6B02] to-[#EA580C]"
              : "border-[#FFEEE3]/40 bg-transparent"
            }`}
        >
          <div className="relative">
            {/* أيقونة الشخص */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="7" r="4" />
              <path d="M12 13c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z" />
            </svg>
            {/* ايقونة صاحب الحملة*/}
            <div className={`absolute -bottom-0 left-3 w-3 h-3 rounded-full flex items-center justify-center
              ${userType === "brand" ? "bg-[#94D3C1]" : "bg-[#F97316]"}`}>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="white">
                  <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
                  </svg>
            </div>
          </div>
          <p className="text-sm font-bold text-[#E1E3E4] m-0">صاحب حملة</p>
          <p className="text-xs text-[#BFC9C4] m-0">ابحث عن خدمات</p>
        </div>

      </div>

      {/* حقل الاسم */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#BFC9C4] text-right">الاسم الكامل</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="أدخل اسمك الكامل"
          className="w-full h-11 rounded-lg border border-[#FFEEE3]/40 bg-white px-4 text-sm text-right text-black placeholder-[#929292] outline-none"
        />
          {errors.name && (
      <p className="text-xs text-red-400">{errors.name}</p>
      )}
      </div>

      {/* حقل الإيميل */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#BFC9C4] text-right">البريد الإلكتروني</label>
        <input
          value={email}
          onChange={(e) => checkEmail(e.target.value)}
          type="email"
          placeholder="name@company.com"
          dir="ltr"
          className="w-full h-11 rounded-lg border border-[#FFEEE3]/40 bg-white px-4 text-sm text-right text-black placeholder-[#929292] outline-none"
        />
        {errors.email && (
          <p className="text-xs text-red-400 text-right">
            {errors.email}{" "}
            <a href="/login" className="text-[#94D3C1] underline">تسجيل الدخول</a>
            {" "}أو{" "}
            <a href="/forgot-password" className="text-[#94D3C1] underline">إعادة تعيين كلمة المرور</a>
          </p>
)}
      </div>
      {/* زر متابعة */}
      <button
          onClick={handleNext}
          className="w-full mt-2 h-12 rounded-lg text-white text-base font-bold cursor-pointer border-none"
          style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
      >
          متابعة
      </button>

      {/* أو */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-sm text-[#BFC9C4]">أو</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      {/* Apple & Google */}
      <div className="flex gap-4">
        {/* Google */}
        <button className="flex-1 h-10 rounded-lg border border-[#FFEEE3]/40 bg-transparent text-[#E1E3E4] text-sm cursor-pointer flex items-center justify-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Google
        </button>
        
        {/* Apple */}
        <button className="flex-1 h-10 rounded-lg border border-[#FFEEE3]/40 bg-transparent text-[#E1E3E4] text-sm cursor-pointer flex items-center justify-center gap-2">
        <svg width="18" height="18" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg" fill="white">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.4-150.3-107.9C27.5 714.3 0 603.7 0 500.9c0-219.1 141.9-335 281.8-335 75.8 0 138.9 50 185.7 50 44.6 0 115.2-52.8 199.2-52.8 31.9 0 108.8 2.6 168.1 81.2zm-208.8-103.7c31.2-37 52.8-88.2 52.8-139.4 0-7.1-.6-14.3-1.9-20.1-49.4 1.9-108.8 33.1-144.2 75.2-28.2 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 44.6 0 100.3-29.8 132.9-70.6z"/>
        </svg>
        Apple
        </button>
        </div>
      {/* تسجيل الدخول */}
      <p className="text-center text-sm text-[#BFC9C4] m-0">
        لديك حساب بالفعل؟{" "}
        <a href="/login" className="text-[#94D3C1] font-bold no-underline">
          تسجيل الدخول
        </a>
      </p>

    </div>
  );
}
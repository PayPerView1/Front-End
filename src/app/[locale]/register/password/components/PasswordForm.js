"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Hide, Show } from "react-iconly";
import StepIndicator from "@/app/[locale]/register/components/StepIndicator";

export default function PasswordForm() {
  const router = useRouter();
  const locale = useLocale();
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCommonPassword, setIsCommonPassword] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);

  function getStrength(pass) {
    if (pass.length === 0) return 0;
    let score = 0;
    if (pass.length >= 10) score++;
    if (/[A-Za-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  }
  function getStrengthColor(bar, pass) {
    const score = getStrength(pass);

    if (pass.length === 0) {
      return "rgba(255,255,255,0.15)";
    }

    const colors = {
      1: "#FF0000",
      2: "#FF6200",
      3: "#FFC14E",
      4: "#00B353",
    };

    if (bar <= score) {
      return colors[bar];
    }

    return "rgba(255,255,255,0.15)";
  }
  function getStrengthLabel(pass) {
    const score = getStrength(pass);
    if (pass.length === 0) return "قوة كلمة المرور";
    if (score === 1) return "ضعيفة جداً";
    if (score === 2) return "متوسطة";
    if (score === 3) return "جيدة";
    if (score === 4) return "قوية";
    return "قوة كلمة المرور";
  }

  function getStrengthTextColor(pass) {
    const score = getStrength(pass);
    if (pass.length === 0) return "#BFC9C4";
    if (score === 1) return "#FF0000";
    if (score === 2) return "#FF6200";
    if (score === 3) return "#FFC14E";
    if (score === 4) return "#00B353";
    return "#BFC9C4";
  }

  // رموز خاصة ASCII فقط (مطابق لمتطلبات الباك إند)
  const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

  function validate() {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "أدخل كلمة المرور";
    } else if (password.length < 8) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على حرف كبير (A-Z)";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على حرف صغير (a-z)";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على رقم";
    } else if (!SPECIAL_CHAR_REGEX.test(password)) {
      newErrors.password = "يجب أن تحتوي على رمز خاص مثل: ! @ # $ %";
    }

    if (!confirmPass.trim()) {
      newErrors.confirmPass = "أدخل تأكيد كلمة المرور";
    } else if (password !== confirmPass) {
      newErrors.confirmPass = "كلمة المرور غير متطابقة";
    }

    return newErrors;
  }

  function handleNext() {
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const oldData = sessionStorage.getItem("registerData");
  if (!oldData) {
    router.push(`/${locale}/register`);
    return;
  }

  const registerData = JSON.parse(oldData);
  sessionStorage.setItem("registerData", JSON.stringify({
    ...registerData,
    password: password,
  }));

  router.push(`/${locale}/register/details`);
}
  return (
    <div
      dir="rtl"
      className="w-full max-w-[520px] flex flex-col gap-4 py-6 px-4 lg:px-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-lg mx-4 lg:mx-0"
    >
      {/* العنوان */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-right text-[#E1E3E4]">
          إنشاء كلمة المرور
        </h2>
        <p className="text-sm text-right text-[#BFC9C4]">
          أنشئ كلمة مرور قوية لحسابك
        </p>
      </div>

      {/* StepIndicator */}
      <StepIndicator currentStep={2} />

      {/* كلمة المرور */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#BFC9C4] text-right">كلمة المرور</label>
        <div className="relative w-full">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPass ? "text" : "password"}
            placeholder="أنشئ كلمة مرور قوية"
            className="w-full h-10 rounded-lg border border-[#FFEEE3]/40 bg-white pr-4 pl-12 text-sm leading-[2.5rem] text-right text-black placeholder-[#929292] outline-none"
          />
          <button
            onClick={() => setShowPass(!showPass)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center bg-transparent border-none cursor-pointer p-0"
          >
            {showPass ? (
              <Show set="light" size={20} primaryColor="#BFC9C4" />
            ) : (
              <Hide set="light" size={20} primaryColor="#BFC9C4" />
            )}
          </button>
        </div>

        {/* شريط القوة */}
        <div className="flex flex-row gap-1 w-full">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ backgroundColor: getStrengthColor(bar, password) }}
            />
          ))}
        </div>
        {/* {password.length > 0 && (
          <p className="text-xs text-right m-0" style={{ color: "#FF6200" }}>
            كلمة المرور قوية ولكن مستخدمة مسبقاً
          </p>
        )} */}
        <div className="flex justify-between items-center">
          <div />
          <p
            className="text-xs m-0 transition-colors duration-300"
            style={{ color: getStrengthTextColor(password) }}
          >
            {getStrengthLabel(password)}
          </p>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password}</p>
        )}
      </div>

      {/* تأكيد كلمة المرور */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#BFC9C4] text-right">
          تأكيد كلمة المرور
        </label>
        <div className="relative w-full">
          <input
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            type={showConfirmPass ? "text" : "password"}
            placeholder="أعد إدخال كلمة المرور"
            className={`w-full h-10 rounded-lg border bg-white pr-4 pl-12 text-sm leading-[2.5rem] text-right text-black placeholder-[#929292] outline-none transition-all
                ${
                  confirmPass && password !== confirmPass
                    ? "border-red-400"
                    : confirmPass && password === confirmPass
                      ? "border-[#94D3C1]"
                      : "border-[#FFEEE3]/40"
                }`}
          />
          <button
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center bg-transparent border-none cursor-pointer p-0"
          >
            {showConfirmPass ? (
              <Show set="light" size={20} primaryColor="#BFC9C4" />
            ) : (
              <Hide set="light" size={20} primaryColor="#BFC9C4" />
            )}
          </button>
        </div>
        {confirmPass && password !== confirmPass && (
          <p className="text-xs text-red-400 text-right m-0">
            كلمة المرور غير متطابقة{" "}
          </p>
        )}
        {confirmPass && password === confirmPass && (
          <p className="text-xs text-[#94D3C1] text-right m-0">
            كلمة المرور متطابقة{" "}
          </p>
        )}
        {errors.confirmPass && (
          <p className="text-xs text-red-400">{errors.confirmPass}</p>
        )}
      </div>

      <button
        onClick={handleNext}
        className="w-full h-12 rounded-lg text-white text-base leading-none font-bold cursor-pointer border-none flex items-center justify-center"
        style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
      >
        متابعة
      </button>
    </div>
  );
}

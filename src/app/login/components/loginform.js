"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { login } from "@/services/authService";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { email: "", password: "", general: "" };

    if (!email.trim()) {
      newErrors.email = "هذا الحقل مطلوب";
    }

    if (!password.trim()) {
      newErrors.password = "هذا الحقل مطلوب";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    setIsLoading(true);

    try {
      const data = await login(email, password);

      if (data && data.success && data.data && data.data.token) {
        localStorage.setItem("token", data.data.token);
        router.push("/dashboard");
      } else {
        throw new Error("بنية استجابة الخادم غير صالحة");
      }
    } catch (err) {
      let errorMessage = "حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.";
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const status = err.response.status;
          const backendMessage = err.response.data?.message;
          if (status === 401) {
            errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
          } else if (status === 400) {
            errorMessage = "بيانات الدخول غير صالحة. يرجى التحقق من المدخلات.";
          } else if (backendMessage) {
            errorMessage = backendMessage;
          } else {
            errorMessage = `خطأ من الخادم (${status})`;
          }
        } else if (err.request) {
          errorMessage = "فشل الاتصال بالخادم. تحقق من اتصالك بالإنترنت.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setErrors({
        email: "",
        password: "",
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-[16px] bg-white/[0.02] border border-white/10 backdrop-blur-[4px] p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
      {/* اللوجو والعناوين */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={82}
            height={89}
            priority
            className="w-[81.75px] h-[88.59px] rounded-[104px] drop-shadow-[0_0_12px_rgba(249,115,22,0.8)] object-cover"
          />
        </div>
        <h1 className="text-center text-white text-2xl font-bold mb-1">
          تسجيل الدخول
        </h1>
        <p className="text-center text-gray-300 text-sm">
          مرحباً بك مجدداً في منصة Pay Per View
        </p>
      </div>

      {/* رسالة الخطأ العامة إن وجدت من السيرفر */}
      {errors.general && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-200 text-xs text-center">
          {errors.general}
        </div>
      )}

      {/* نموذج الإدخال (الفورم) */}
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-xs text-gray-200 mb-1.5">
            البريد الإلكتروني أو اسم المستخدم
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ادخل بريدك الإلكتروني"
            className={`w-full h-[35px] rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm px-4 outline-none focus:ring-2 text-right transition-all shadow-inner ${
              errors.email
                ? "border-2 border-red-500 focus:ring-red-500"
                : "focus:ring-orange-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 text-right">{errors.email}</p>
          )}
        </div>

        {/* Password Group */}
        <div className="mb-5">
          <label htmlFor="password" className="block text-xs text-gray-200 mb-1.5">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ادخل كلمة المرور"
              className={`w-full h-[35px] rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm px-4 pl-10 outline-none focus:ring-2 text-right transition-all shadow-inner ${
                errors.password
                  ? "border-2 border-red-500 focus:ring-red-500"
                  : "focus:ring-orange-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
            >
              {showPassword ? (
                <FiEye className="w-3.5 h-3.5" />
              ) : (
                <FiEyeOff className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            {errors.password ? (
              <p className="text-red-500 text-xs">{errors.password}</p>
            ) : (
              <span />
            )}

            <Link
              href="/forgot-password"
              className="text-xs text-orange-400 transition-colors drop-shadow-md"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[35px] rounded-lg bg-[linear-gradient(97.47deg,#FFA600_0%,#FF4B04_100%)] text-white font-semibold text-base shadow-[0_4px_20px_rgba(234,88,12,0.4)] transition-all disabled:opacity-50"
        >
          {isLoading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>
      </form>

      {/* الروابط البديلة وحساب جديد */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-[11px] text-gray-300 whitespace-nowrap">
            أو الدخول عبر
          </span>
          <div className="h-px flex-1 bg-white/20" />
        </div>
        <div className="flex justify-center gap-3.5 mb-6">
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-[160px] h-[40px] rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-[160px] h-[40px] rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium transition-colors"
          >
            <FaApple className="w-5 h-5 mb-0.5" />
            Apple
          </button>
        </div>

        <p className="text-center text-xs text-gray-300">
          ليس لديك حساب?{" "}
          <Link href="/register" className="text-[#94D3C1] font-medium transition-colors drop-shadow-md">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}

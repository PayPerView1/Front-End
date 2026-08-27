"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { login } from "@/services/authService";
import api from "@/services";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("auth");

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const token = searchParams.get("token");
      const userParam = searchParams.get("user");
      
      if (token) {
        setIsLoading(true);
        try {
          let userObj = {};
          if (userParam) {
            try {
              userObj = JSON.parse(decodeURIComponent(userParam));
            } catch (e) {
              console.error("Failed to parse user query parameter:", e);
            }
          }
          
          api.saveAuthData(token, userObj);
          
          if (!userObj || !userObj._id || !userObj.email) {
            try {
              const profileData = await api.getProfile();
              if (profileData && profileData.user) {
                userObj = profileData.user;
                api.saveAuthData(token, userObj);
              }
            } catch (err) {
              console.error("Failed to fetch profile during Google redirect:", err);
            }
          }
          
          router.push(`/${locale}/dashboard`);
        } catch (e) {
          console.error("Error during Google redirect:", e);
          setErrors(prev => ({
            ...prev,
            general: "فشل تسجيل الدخول باستخدام Google. يرجى المحاولة مرة أخرى."
          }));
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    handleGoogleRedirect();
  }, [searchParams, locale, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { email: "", password: "", general: "" };

    if (!email.trim()) {
      newErrors.email = t("required");
    }

    if (!password.trim()) {
      newErrors.password = t("required");
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    setIsLoading(true);
    try {
      const data = await login(email, password);

      const token = data?.token || data?.data?.token;

      if (token) {
        router.push(`/${locale}/dashboard`);
      } else {
        throw new Error(t("invalidServerResponse"));
      }
    } catch (err) {
      let errorMessage = t("genericLoginError");
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const status = err.response.status;
          const backendMessage = err.response.data?.message;
          if (status === 401) {
            errorMessage = t("invalidCredentials");
          } else if (status === 400) {
            errorMessage = t("invalidLoginData");
          } else if (backendMessage) {
            errorMessage = backendMessage;
          } else {
            errorMessage = `خطأ من الخادم (${status})`;
          }
        } else if (err.request) {
          errorMessage = t("connectionFailed");
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
    <div className="w-full max-w-[480px] rounded-[16px] bg-white/[0.02] border border-white/10 backdrop-blur-[4px] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
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
          {t("loginTitle")}
        </h1>
        <p className="text-center text-gray-300 text-sm">
          {t("loginWelcome")}
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
            {t("emailOrUsername")}
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
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
            {t("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className={`w-full h-[35px] rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm px-4 pl-10 outline-none focus:ring-2 text-right transition-all shadow-inner ${
                errors.password
                  ? "border-2 border-red-500 focus:ring-red-500"
                  : "focus:ring-orange-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
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
              {t("forgotPassword")}
            </Link>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[35px] rounded-lg bg-[linear-gradient(97.47deg,#FFA600_0%,#FF4B04_100%)] text-white font-semibold text-base shadow-[0_4px_20px_rgba(234,88,12,0.4)] transition-all disabled:opacity-50"
        >
          {isLoading ? t("signingIn") : t("signIn")}
        </button>
      </form>

      {/* الروابط البديلة وحساب جديد */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-[11px] text-gray-300 whitespace-nowrap">
            {t("orContinueWith")}
          </span>
          <div className="h-px flex-1 bg-white/20" />
        </div>
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => api.loginWithGoogle()}
            className="flex items-center justify-center gap-2 w-full h-[40px] rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </button>
        </div>

        <p className="text-center text-xs text-gray-300">
          {t("noAccount")} {" "}
          <Link href="/register" className="text-[#94D3C1] font-medium transition-colors drop-shadow-md">
            {t("createAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
}

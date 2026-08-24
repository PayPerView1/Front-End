"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("جاري تسجيل الدخول...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      // نحدد الـ locale من الـ localStorage أو نستخدم ar كافتراضي
      const locale =
        (typeof window !== "undefined" && localStorage.getItem("NEXT_LOCALE")) ||
        "ar";

      // الباك إند بيرجع token بأشكال مختلفة في الـ query params
      const token =
        searchParams.get("token") ||
        searchParams.get("access_token") ||
        searchParams.get("accessToken");

      const userParam =
        searchParams.get("user") ||
        searchParams.get("userInfo");

      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError("فشل تسجيل الدخول باستخدام Google: " + errorParam);
        setTimeout(() => router.push("/" + locale + "/login"), 3000);
        return;
      }

      if (!token) {
        setError("لم يتم استلام رمز المصادقة. يرجى المحاولة مرة أخرى.");
        setTimeout(() => router.push("/" + locale + "/login"), 3000);
        return;
      }

      try {
        setStatus("جاري حفظ بيانات الجلسة...");

        // استخدام api بشكل ديناميكي لتفادي مشاكل SSR
        const { default: api } = await import("@/services");

        let userObj = {};
        if (userParam) {
          try {
            userObj = JSON.parse(decodeURIComponent(userParam));
          } catch (e) {
            console.error("Failed to parse user param:", e);
          }
        }

        // احفظ التوكن أولاً
        api.saveAuthData(token, userObj);

        // إذا ما عندنا بيانات مستخدم كاملة، اجلبها من الـ API
        if (!userObj || !userObj.email) {
          setStatus("جاري تحميل بيانات حسابك...");
          try {
            const profileData = await api.getProfile();
            if (profileData && profileData.user) {
              userObj = profileData.user;
              api.saveAuthData(token, userObj);
            }
          } catch (err) {
            console.error("Failed to fetch profile:", err);
          }
        }

        setStatus("تم تسجيل الدخول بنجاح! جاري التحويل...");
        router.push("/" + locale + "/dashboard");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
        const locale =
          (typeof window !== "undefined" && localStorage.getItem("NEXT_LOCALE")) ||
          "ar";
        setTimeout(() => router.push("/" + locale + "/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6"
      style={{ fontFamily: "Tajawal, Arial, sans-serif" }}
    >
      {error ? (
        <>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.15)",
              border: "2px solid #ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#ef4444",
            }}
          >
            ✕
          </div>
          <p style={{ color: "#fca5a5", textAlign: "center", maxWidth: 320 }}>{error}</p>
          <p style={{ color: "#6b7280", fontSize: 14 }}>جاري تحويلك لصفحة تسجيل الدخول...</p>
        </>
      ) : (
        <>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "4px solid rgba(255,255,255,0.1)",
              borderTopColor: "#f97316",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#d1d5db", fontSize: 16 }}>{status}</p>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "4px solid rgba(255,255,255,0.1)",
              borderTopColor: "#f97316",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

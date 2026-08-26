import { IoChatbubblesOutline } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";

export default function EmptyState() {
  const { isDark } = useTheme();

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: isDark ? "rgba(12, 15, 16, 1)" : "#ffffff" }}
    >
      <div
        className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border max-w-[340px] w-full shadow-2xl ${isDark ? "border-white/10" : "border-gray-200"
          }`}
        style={{ backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)" }}
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDark ? "bg-white/[0.06]" : "bg-gray-100"
          }`}>
          <IoChatbubblesOutline size={36} className={isDark ? "text-gray-500" : "text-gray-400"} />
        </div>

        <div className="text-center">
          <h3 className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>حدد رسالة للبدء</h3>
          <p className={`text-xs leading-relaxed max-w-[220px] mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            اختر محادثة من القائمة الجانبية للتواصل مع المشتركين أو فريق الدعم
            الخاص بك
          </p>
        </div>

        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs cursor-pointer transition-colors ${isDark
            ? "bg-white/[0.06] border-white/10 text-gray-300 hover:bg-white/[0.1]"
            : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200/60"
            }`}
        >
          <MdLockOutline size={14} />
          الرسائل مشفرة ومؤمنة بالكامل
        </button>
      </div>
    </div>
  );
}
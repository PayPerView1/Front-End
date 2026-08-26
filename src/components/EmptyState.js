import { IoChatbubblesOutline } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";

export default function EmptyState() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "#0A0812" }}
    >
      <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center">
        <IoChatbubblesOutline size={36} className="text-gray-500" />
      </div>

      <div className="text-center">
        <h3 className="text-white text-sm font-bold mb-1">حدد رسالة للبدء</h3>
        <p className="text-gray-400 text-xs leading-relaxed max-w-[220px]">
          اختر محادثة من القائمة الجانبية للتواصل مع المشتركين أو فريق الدعم
          الخاص بك
        </p>
      </div>

      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-gray-300 text-xs cursor-pointer hover:bg-white/[0.1] transition-colors"
      >
        <MdLockOutline size={14} />
        الرسائل مشفرة ومؤمنة بالكامل
      </button>
    </div>
  );
}
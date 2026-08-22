"use client";

import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { FiUsers, FiMic, FiSend, FiPlus } from "react-icons/fi";
import { MdCampaign, MdLiveTv, MdReceiptLong } from "react-icons/md";

const actions = [
  {
    icon: FiUsers,
    title: "مراسلة أحدث الأعضاء",
    desc: "صياغة رسالة ترحيب للمشتركين الجدد",
  },
  {
    icon: MdCampaign,
    title: "إنشاء إعلان إبداعي",
    desc: "توليد نصوص إعلانية جذابة لحملتك القادمة",
  },
  {
    icon: MdLiveTv,
    title: "البدء ببث مباشر",
    desc: "إعداد جلسة بث مباشر للتواصل مع جمهورك",
  },
  {
    icon: MdReceiptLong,
    title: "إرسال فاتورة لعميل",
    desc: "إنشاء وإرسال فاتورة احترافية بسرعة",
  },
];

export default function AIAssistant() {
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // هون بتحطي منطق إرسال الرسالة الفعلي
    setMessage("");
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden px-4 py-8"
      style={{
        background:
          "radial-gradient(120% 80% at 50% -10%, #3B2A6B 0%, #1A1030 35%, #0A0812 70%, #050507 100%)",
      }}
    >
      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] mt-10">
        {/* أيقونة النجمة */}
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.35)]">
          <BsStars className="w-6 h-6 text-white" />
        </div>

        {/* العنوان */}
        <h1 className="text-white text-xl font-bold text-center mb-3">
          كيف يمكنني مساعدتك اليوم؟
        </h1>
        <p className="text-gray-400 text-sm text-center leading-relaxed mb-8 px-2">
          أنا المساعد الذكي الخاص بك، يمكنني مساعدتك في إنشاء المحتوى، إدارة
          حسابك، أو الإجابة على أي استفسارات.
        </p>

        {/* بطاقات الإجراءات السريعة */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {actions.map(({ icon: Icon, title, desc }) => (
            <button
              key={title}
              type="button"
              className="flex flex-col items-start text-right gap-2 rounded-2xl bg-white/[0.04] border border-white/10 p-4 hover:bg-white/[0.07] transition-colors"
            >
              <Icon className="w-5 h-5 text-orange-400" />
              <span className="text-white text-xs font-bold leading-snug">
                {title}
              </span>
              <span className="text-gray-400 text-[11px] leading-snug">
                {desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* شريط الإدخال السفلي */}
      <div className="relative z-10 w-full max-w-[420px]">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-3 py-2 backdrop-blur-sm"
        >
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FFA600] to-[#FF4B04] text-white shrink-0"
            onClick={handleSend}
          >
            <FiSend className="w-4 h-4 -rotate-45" />
          </button>

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-gray-300 shrink-0"
          >
            <FiMic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none text-right"
          />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-gray-300 shrink-0"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-500 mt-3">
          قد يرتكب المساعد بعض الأخطاء أحياناً، يرجى التحقق من المعلومات المهمة.
        </p>
      </div>
    </div>
  );
}
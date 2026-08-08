"use client";
import { TickSquare, ShieldDone } from "react-iconly";
export default function BrandingSide({
    subtitle = "ارتقِ بمسيرتك في عالم المحتوى الهادف",
    description = "منصة متطورة تجمع بين الجودة العالية والالتزام بالمعايير الأخلاقية",
    features,
}) {
     const defaultFeatures = [
    {
      title: "موثوقية تامة",
      desc: "جميع الحسابات تخضع لعملية تحقق صارمة",
      icon: <TickSquare set="bold" size={28} primaryColor="#9FE7DB" />,
    },
    {
      title: "أمان متقدم",
      desc: "حماية بياناتك بأحدث تقنيات التشفير",
      icon: <ShieldDone set="bold" size={28} primaryColor="#9FE7DB" />,
    },
  ];
  const displayFeatures = features ?? defaultFeatures;
    return (
    <div dir="rtl" className="max-w-xl text-right">

      <h1 className="text-4xl font-bold text-[#9FE7DB]">
        Pay Per View
      </h1>

      <h2 className="mt-8 text-2xl font-bold text-white leading-relaxed">
        {subtitle}
      </h2>

      <p className="mt-5 text-lg text-gray-300 leading-8">
        {description}
      </p>

      <div className="mt-12 space-y-4">

        {displayFeatures.map((item, index) => (
          <div
            key={index}
            className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md py-3 px-4 overflow-hidden"
          >
            {/* الخط العمودي */}
            <span className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#9FE7DB]" />
             {/* الأيقونة */}
            <div className="flex-shrink-0">
            {item.icon}
            </div>
            {/* النص */}
            <div className="text-right">
              <h3 className="font-bold text-white text-sm">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-gray-300">
                {item.desc}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
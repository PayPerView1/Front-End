const GRADIENT = "linear-gradient(117.47deg, #FA6404 15.02%, #FA8A03 58.55%)";

export default function PulseRings({
  color, // اختياري: لون صلب (مثلاً للـ error)، وإذا ما انعطى بنستخدم البرتقالي
  size = 144,
  dashColor = "rgba(255,255,255,0.85)",
  children,
}) {
  const ring = color ?? "#FA6404";
  const core = color ?? GRADIENT;
  const coreSize = Math.round(size * 0.34);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* الحلقة الخارجية الباهتة */}
      <span
        className="absolute inset-0 animate-ping rounded-full border opacity-30"
        style={{ borderColor: ring, animationDuration: "3s" }}
      />
      <span
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: ring, opacity: 0.35 }}
      />

      {/* الحلقة المنقطة البيضاء */}
      <span
        className="absolute rounded-full border border-dashed"
        style={{ inset: "9%", borderColor: dashColor }}
      />

      {/* الحلقة الداخلية البرتقالية الصلبة */}
      <span
        className="absolute rounded-full border"
        style={{ inset: "19%", borderColor: ring, opacity: 0.9 }}
      />

      {/* الدائرة المركزية */}
      <span
        className="relative flex items-center justify-center rounded-full text-white "
        style={{
          width: coreSize,
          height: coreSize,
          background: core,
          boxShadow: `0 0 28px ${ring}66`,
        }}
      >
        {children}
      </span>
    </div>
  );
}
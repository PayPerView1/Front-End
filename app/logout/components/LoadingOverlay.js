"use client";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-8 rounded-full bg-orange-500 animate-pulse [animation-delay:-0.3s]" />
        <span className="w-1.5 h-8 rounded-full bg-orange-500 animate-pulse [animation-delay:-0.15s]" />
        <span className="w-1.5 h-8 rounded-full bg-orange-500 animate-pulse" />
      </div>
    </div>
  );
}
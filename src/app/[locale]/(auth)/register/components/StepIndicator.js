export default function StepIndicator({ currentStep = 1 }) {
  const steps = [1, 2, 3, 4];

  return (
    <div dir="rtl" className="w-full flex flex-row items-center">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex flex-row items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
        >
          {/* الدائرة */}
          <div
            className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all
              ${step === currentStep
                ? "border-[#94D3C1] bg-[#94D3C1]"     
                : step < currentStep
                ? "border-white/30 bg-white/10"        
                : "border-white/30 bg-white/5"          
              }`}
          >
            <span
              className={`text-sm font-bold transition-all ${
                step === currentStep
                  ? "text-black"       
                  : step < currentStep
                  ? "text-white"        
                  : "text-white/60"     
              }`}
            >
              {step}
            </span>
          </div>

          {/* الخط */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-px mx-1 bg-white/20" />
          )}
        </div>
      ))}
    </div>
  );
}
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera } from "react-iconly";
import StepIndicator from "@/components/StepIndicator";

const countries = [
    { name: "الإمارات", code: "AE", dial: "+971" },
    { name: "السعودية", code: "SA", dial: "+966" },
    { name: "الأردن", code: "JO", dial: "+962" },
    { name: "فلسطين", code: "PS", dial: "+970" },
    { name: "مصر", code: "EG", dial: "+20" },
    { name: "الكويت", code: "KW", dial: "+965" },
];

export default function DetailsForm() {
    const router = useRouter();
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [phone, setPhone] = useState("");
    const [dialCode, setDialCode] = useState("+1");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [errors, setErrors] = useState({});


function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
}
function validatePhone(value) {
    if (!value.trim()) {
        setPhoneError("أدخل رقم الهاتف");
    } else if (!/^\d{7,15}$/.test(value)) {
    setPhoneError("رقم الهاتف غير صحيح");
} else {
    setPhoneError("");
}
}
function validate() {
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = "أدخل رقم الهاتف";
    else if (!/^\d{7,15}$/.test(phone)) newErrors.phone = "رقم الهاتف غير صحيح";
    if (!country) newErrors.country = "اختر الدولة";
    if (!city.trim()) newErrors.city = "أدخل المدينة";
    return newErrors;
}

async function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
}
router.push("/register/interests");
}
    return (
    <div
    dir="rtl"
    className="w-full max-w-[520px] flex flex-col gap-4 py-6 px-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-lg"
    >
        {/* العنوان */}
        <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-right text-[#E1E3E4]">
                التفاصيل الشخصية
            </h2>
            <p className="text-sm text-right text-[#BFC9C4]">
                أكمل بياناتك الشخصية
            </p>
        </div>
        
        {/* StepIndicator */}
        <StepIndicator currentStep={3} />
        
        {/* رفع الصورة */}
        <div className="flex flex-col items-center gap-2">
            <div
            onClick={() => fileRef.current.click()}
            className="relative w-20 h-20 rounded-full border-2 border-[#94D3C1] cursor-pointer overflow-visible bg-white/10 flex items-center justify-center"
            >
                
                {/* الأيقونة  */}
                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white/10">
                {preview ? (
                    <Image src={preview} alt="profile" fill className="object-cover" />
                ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="#94D3C1"/>
                </svg>
                )}
                </div>
                
                {/* أيقونة الكاميرا */}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#F97316] rounded-full flex items-center justify-center z-10">
                    <Camera set="bold" size={13} primaryColor="white" />
                    </div>
                    </div>
                    <p className="text-xs text-[#BFC9C4]">رفع صورة</p>
                    <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}/>
                </div>
                
                {/* رقم الهاتف */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-[#BFC9C4] text-right">رقم الهاتف</label>
                    <div className="flex flex-row gap-2">
                        <select
                        value={dialCode}
                        onChange={(e) => setDialCode(e.target.value)}
                        className={`h-10 rounded-lg border border-[#FFEEE3]/40 px-2 text-sm outline-none cursor-pointer transition-all
                            ${dialCode === "+1"
                                ? "bg-transparent text-[#BFC9C4]" : "bg-white text-black"}`}
                        >
                            <option value="+1">🇺🇸 +1</option>
                            {countries.map((c) => (
                                <option key={c.code} value={c.dial}>
                                    {c.name} {c.dial}
                                </option>
                            ))}
                        </select>

                        {/* حقل ادخال رقم الهاتف*/}
                        <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            validatePhone(e.target.value);
                        }}
                        placeholder="أدخل رقم الهاتف"
                        className="flex-1 h-10 rounded-lg border border-[#FFEEE3]/40 bg-white px-4 text-sm text-right text-black placeholder-[#929292] outline-none"
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-400 text-right m-0">{errors.phone}</p>
                            )}
                        {phoneError && (
                            <p className="text-xs text-red-400 text-right m-0">{phoneError}</p>
                            )}
                    </div>
                </div>

                {/* الدولة والمدينة */}
                <div className="flex flex-row gap-3">
                    {/* الدولة */}
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-[#BFC9C4] text-right">الدولة</label>
                        <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={`w-full h-10 rounded-lg border border-[#FFEEE3]/40 px-4 text-sm text-right outline-none cursor-pointer transition-all
                            ${country ? "bg-white text-black" : "bg-transparent text-[#BFC9C4]"}`}
                        >
                            <option value="">اختر الدولة</option>
                            {countries.map((c) => (
                                <option key={c.code} value={c.code} className="bg-white text-black">
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.country && (
                            <p className="text-xs text-red-400 text-right m-0">{errors.country}</p>
                            )}
                    </div>
                    
                    {/* حقل المدينة*/}
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-[#BFC9C4] text-right">المدينة</label>
                        <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="مثال: دبي"
                        className="w-full h-10 rounded-lg border border-[#FFEEE3]/40 bg-white px-4 text-sm text-right text-black placeholder-[#929292] outline-none"
                        />
                        {errors.city && (
                            <p className="text-xs text-red-400 text-right m-0">{errors.city}</p>
                            )}
                    </div>
                </div>
                
                {/* الأزرار */}
                <div className="flex flex-row-reverse items-center justify-between">
                    <button
                    onClick={handleSubmit}
                    className="h-12 px-8 rounded-lg text-white text-base font-bold cursor-pointer border-none"
                    style={{ background: "linear-gradient(90deg, #FFA600, #FF4B04)" }}
                    >
                        إتمام الإعداد
                    </button>
                    <button
                    onClick={() => router.push("/register/complete")}
                    className="text-sm text-[#BFC9C4] bg-transparent border-none cursor-pointer"
                    >
                        تخطى الآن
                    </button>


        </div>

    </div>
    );
}
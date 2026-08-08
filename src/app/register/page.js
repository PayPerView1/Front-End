"use client";

import Image from "next/image";
import BrandingSide from "@/components/BrandingSide";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    return (
    <main className="relative h-screen overflow-hidden">
        {/* Background */}
        <Image
        src="/images/img.png"
        alt="background"
        fill
        className="object-cover brightness-50"
        priority
        />
        <div className="absolute inset-0 bg-black/65" />
        {/* Content */}
        <div className="relative z-10 flex min-h-screen" dir="rtl">
            {/* Right */}
            <div className="w-1/2 flex justify-center items-center p-12">
            <BrandingSide />
            </div>
            {/* Left */}
            <div className="w-1/2 flex justify-center items-center p-12">
            <RegisterForm />
            </div>


        </div>

    </main>
    );
}
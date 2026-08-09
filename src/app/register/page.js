"use client";

import Image from "next/image";
import BrandingSide from "@/components/BrandingSide";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    return (
    <main className="relative min-h-screen">
        {/* Background */}
        <Image
        src="/images/img.png"
        alt="background"
        fill
        className="object-cover brightness-60"
        priority
        />
        <div className="absolute inset-0 bg-black/65" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
            
            {/* BrandingSide */}
            <div className="hidden lg:flex w-1/2 justify-center items-center p-12">
            <BrandingSide />
            </div>
            {/* الفورم */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-12 py-8">
            <RegisterForm />
        </div>

        </div>
    </main>
    );
}
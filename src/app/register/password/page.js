import Image from "next/image";
import BrandingSide from "@/components/BrandingSide";
import PasswordForm from "@/components/PasswordForm";

export const metadata = {
    title: "كلمة المرور | Pay Per View",
};

export default function PasswordPage() {
    return (
    <main className="relative h-screen overflow-hidden">
        <Image
        src="/images/img.png"
        alt="background"
        fill
        className="object-cover brightness-50"
        priority
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 flex min-h-screen">
        <div className="w-1/2 flex justify-center items-center p-12">
        <BrandingSide />
        </div>
        <div className="w-1/2 flex justify-center items-center p-12">
        <PasswordForm />
        </div>
        </div>
    </main>
    );
}
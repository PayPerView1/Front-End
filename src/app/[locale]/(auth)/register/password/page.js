import Image from "next/image";
import BrandingSide from "@/app/[locale]/(auth)/register/components/BrandingSide";
import PasswordForm from "@/app/[locale]/(auth)/register/password/components/PasswordForm";

export default function PasswordPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Image
        src="/images/img.png"
        alt="background"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* BrandingSide */}
        <div className="hidden lg:flex w-1/2 justify-center items-center p-12">
          <BrandingSide />
        </div>

        {/* الفورم */}
        <div className="w-full lg:w-1/2 flex flex-1 justify-center items-center p-4 lg:p-12 py-8">
          <PasswordForm />
        </div>
      </div>
    </main>
  );
}

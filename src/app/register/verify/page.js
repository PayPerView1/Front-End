import Image from "next/image";
import VerifyEmail from "@/components/VerifyEmail";

export const metadata = {
    title: "تحقق من بريدك | Pay Per View",
};

export default function VerifyPage() {
    return (
    <main className="relative h-screen overflow-hidden">
        <Image
        src="/images/img.png"
        alt="background"
        fill
        className="object-cover brightness-60"
        priority
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <VerifyEmail />
      </div>
    </main>
  );
}
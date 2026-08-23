import Image from "next/image";
import VerifyEmail from "../components/VerifyEmail";

export const metadata = {
  title: "تحقق من بريدك | Pay Per View",
};

export default async function VerifyTokenPage({ params }) {
  const { token } = await params;

  return (
    <main className="relative min-h-screen">
      <Image
        src="/images/img.png"
        alt="background"
        fill
        className="object-cover brightness-60"
        priority
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <VerifyEmail verificationToken={token} />
      </div>
    </main>
  );
}

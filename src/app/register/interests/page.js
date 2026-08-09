import Image from "next/image";
import BrandingSide from "@/components/BrandingSide";
import InterestsForm from "@/components/InterestsForm";

export const metadata = {
  title: "اهتماماتك | Pay Per View",
};

export default function InterestsPage() {
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
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* يمين - مخفي على الموبايل */}
        <div className="hidden lg:flex w-1/2 justify-center items-center p-12">
          <BrandingSide
            subtitle="دعنا نتعرف عليك"
            description="أكمل ملفك الشخصي لفتح ميزات مخصصة والتواصل بشكل أفضل داخل المنصة."
            features={[]}
          />
        </div>

        {/* يسار - الفورم */}
        <div className="w-full lg:w-1/2 flex justify-center items-center min-h-screen p-4 lg:p-12">
          <InterestsForm />
        </div>

      </div>
    </main>
  );
}
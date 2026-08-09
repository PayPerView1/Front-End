import Image from "next/image";
import BrandingSide from "@/components/BrandingSide";
import DetailsForm from "@/components/DetailsForm";

export default function DetailsPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Image
        src="/images/img.png"
        alt="background"
        fill
        className="object-cover brightness-60"
        priority
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex flex-col lg:flex-row flex-1 min-h-screen">

        {/* BrandingSide — تختفي على الموبايل */}
        <div className="hidden lg:flex w-1/2 justify-center items-center p-12">
          <BrandingSide
            subtitle="دعنا نتعرف عليك"
            description="أكمل ملفك الشخصي لفتح ميزات مخصصة والتواصل بشكل أفضل داخل المنصة"
            features={[]}
          />
        </div>

        {/* الفورم */}
        <div className="w-full lg:w-1/2 flex flex-1 justify-center items-center p-4 lg:p-12">
          <DetailsForm />
        </div>

      </div>
    </main>
  );
}
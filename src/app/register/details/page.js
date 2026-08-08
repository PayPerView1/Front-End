import Image from "next/image";
import BrandingSide from "@/components/BrandingSide";
import DetailsForm from "@/components/DetailsForm";

export const metadata = {
    title: "التفاصيل الشخصية | Pay Per View",
};

export default function DetailsPage() {
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
        <div className="relative z-10 flex min-h-screen">
        {/* يمين */}
        <div className="w-1/2 flex justify-center items-center p-12">
        <BrandingSide
        subtitle="دعنا نتعرف عليك"
        description="أكمل ملفك الشخصي لفتح ميزات مخصصة والتواصل بشكل أفضل داخل المنصة"
        features={[]}  
        />
        </div>
        {/* يسار */}
        <div className="w-1/2 flex justify-center items-center p-12">
            <DetailsForm />
        </div>
    </div>
    </main>
    );
}
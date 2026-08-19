import React from 'react';
import ResetPasswordCard from './ResetPasswordCard';
import Image from 'next/image';
import backgroundImage from './WhatsApp Image 2026-08-09 at 10.47.23 PM.jpeg';

export default function PageLayout() {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={backgroundImage} 
          alt="Background" 
          layout="fill" 
          objectFit="cover" 
          quality={100}
        />
        {/* Optional overlay for better contrast, adjust opacity as needed */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content (Card) */}
      <div className="relative z-10 p-4 w-full flex justify-center">
        <ResetPasswordCard />
      </div>
    </div>
  );
}

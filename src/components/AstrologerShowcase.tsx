"use client";

import React from "react";
import Image from "next/image";
export function AstrologerShowcase() {
  return (
    <div className="relative flex items-center justify-center w-full max-w-2xl py-6 select-none">
      {/* Subtle warm halo behind the center image */}
      <div className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Overlapping Astrologer Trio Container */}
      <div className="relative flex items-center justify-center">

        {/* Left Astrologer */}
        <div className="relative z-10 -mr-10 sm:-mr-16 w-36 sm:w-48 h-64 sm:h-84 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-30">
          <Image
            src="/images/astrologer-left.jpg"
            alt="Vedic Astrologer"
            fill
            sizes="(max-width: 768px) 144px, 192px"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* Center Astrologer */}
        <div className="relative z-20 w-40 sm:w-52 md:w-56 h-72 sm:h-92 md:h-96 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/astrologer-center.jpg"
            alt="Vedic Astrologer"
            fill
            sizes="(max-width: 768px) 160px, 224px"
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Astrologer */}
        <div className="relative z-10 -ml-10 sm:-ml-16 w-36 sm:w-48 h-64 sm:h-84 rounded-full overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:scale-105 hover:z-30">
          <Image
            src="/images/astrologer-right.jpg"
            alt="Vedic Astrologer"
            fill
            sizes="(max-width: 768px) 144px, 192px"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}

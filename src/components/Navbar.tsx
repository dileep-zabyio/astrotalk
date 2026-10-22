"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Menu as MenuIcon, X } from "lucide-react";
import Image from "next/image";

interface DropdownItem {
  title: string;
  desc?: string;
  href: string;
}

const navLinks: {
  name: string;
  href?: string;
  dropdown?: DropdownItem[];
}[] = [
  {
    name: "Consultations",
    dropdown: [
      { title: "Chat with Astrologer", desc: "Instant chat with verified Vedic experts", href: "/chat" },
      { title: "Call with Astrologer", desc: "Direct audio consultation", href: "/call" },
      { title: "Video Consultation", desc: "Face to face live reading", href: "/video" },
      { title: "Book a Pooja", desc: "Personalized temple ritual by priests", href: "/pooja" },
    ],
  },
  {
    name: "Horoscope",
    dropdown: [
      { title: "Today's Horoscope", desc: "Daily planetary guidance", href: "/horoscope/today" },
      { title: "Tomorrow's Horoscope", desc: "Prepare ahead for tomorrow", href: "/horoscope/tomorrow" },
      { title: "Weekly Horoscope", desc: "7-day planetary forecast", href: "/horoscope/weekly" },
      { title: "Monthly Horoscope", desc: "Monthly zodiac predictions", href: "/horoscope/monthly" },
      { title: "Yearly Horoscope 2026", desc: "Full year detailed life map", href: "/horoscope/yearly" },
    ],
  },
  {
    name: "Free Services",
    dropdown: [
      { title: "Free Kundli", desc: "Comprehensive Vedic birth chart", href: "/free-kundli" },
      { title: "Kundli Matching", desc: "Gun Milan for marriage compatibility", href: "/kundli-matching" },
      { title: "Daily Panchang", desc: "Tithi, Nakshatra & auspicious timings", href: "/panchang" },
      { title: "Tarot Reading", desc: "Instant 3-card clarity spread", href: "/tarot" },
    ],
  },
  {
    name: "Calculators",
    dropdown: [
      { title: "Love Calculator", desc: "Zodiac romantic compatibility check", href: "/calculators/love" },
      { title: "Moon Sign Calculator", desc: "Discover your true Rashi", href: "/calculators/moon-sign" },
      { title: "Ascendant (Lagna) Calculator", desc: "Find your rising astrological sign", href: "/calculators/ascendant" },
      { title: "Numerology Calculator", desc: "Life path and destiny numbers", href: "/calculators/numerology" },
    ],
  },
  {
    name: "Panchang",
    dropdown: [
      { title: "Today's Panchang", desc: "Real-time Hindu calendar & Rahu Kaal", href: "/panchang/today" },
      { title: "Shubh Muhurat", desc: "Best times for marriage, buying & events", href: "/panchang/muhurat" },
      { title: "Choghadiya", desc: "Day & night auspicious periods", href: "/panchang/choghadiya" },
      { title: "Festival Calendar 2026", desc: "Dates of Hindu fasts & celebrations", href: "/panchang/festivals" },
    ],
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Blog",
    href: "/counter",
  },
];

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 w-full bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <div className="relative flex items-center justify-center">
          <Image src="/astrotalk-icon.png" alt="Logo" width={40} height={40} />
          <h1 className="text-white text-xl font-bold pl-1">Astrotalk</h1>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {link.dropdown ? (
                <button
                  type="button"
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-lg ${
                    activeDropdown === link.name
                      ? "text-neutral-100 bg-white/[0.04]"
                      : "text-neutral-300 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                      activeDropdown === link.name ? "rotate-180 text-[#f4cb38]" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={link.href || "/"}
                  className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-colors duration-150"
                >
                  {link.name}
                </Link>
              )}

              {/* Dropdown Menu */}
              {link.dropdown && activeDropdown === link.name && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-[#121216]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="space-y-1">
                    {link.dropdown.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="block px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition group/sub"
                      >
                        <p className="text-sm font-semibold text-neutral-200 group-hover/sub:text-[#f4cb38] transition-colors">
                          {subItem.title}
                        </p>
                        {subItem.desc && (
                          <p className="text-xs text-neutral-400 mt-0.5 group-hover/sub:text-neutral-300">
                            {subItem.desc}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Actions & CTA */}
        <div className="hidden sm:flex items-center gap-3">


          {/* Talk Now CTA */}
          <Link
            href="/chat"
            className="flex items-center gap-2 pl-4 pr-3.5 py-2 bg-yellow-200 text-neutral-950 font-bold text-sm rounded-full shadow-[0_0_20px_rgba(244,203,56,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="font-extrabold tracking-tight">Talk now</span>
            <span className="text-neutral-950/40">|</span>
            <span className="font-medium text-xs">First Chat Free</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

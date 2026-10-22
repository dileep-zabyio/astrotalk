"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";


export function NavbarDemo() {
  return (
    <div className="relative flex min-h-169 w-full bg-gradient-to-r from-black to-yellow-600 translate-z-0 items-center justify-center">
      <Navbar className="top-2" />
      
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed inset-x-0 top-10 z-50 mx-auto max-w-2xl", className)}
    >
      <Menu setActive={setActive}>
        <Image src="/astrotalk-icon.png" alt="Astrotalk Image" width={30} height={30} />
        <h1 className="font-extrabold text-xl pr-4">Astrotalk</h1>
        <MenuItem setActive={setActive} active={active} item="Consultations">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/chat">Chat with Astrologer</HoveredLink>
            <HoveredLink href="/call">Call with Astrologer</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Horoscope">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/daily">Daily Horoscope</HoveredLink>
            <HoveredLink href="/tomorrow">Tomorrow's Horoscope</HoveredLink>
            <HoveredLink href="/yesterday">Yesterday's Horoscope</HoveredLink>
            <HoveredLink href="/weekly">Weekly Horoscope</HoveredLink>
            <HoveredLink href="/monthly">Monthly Horoscope</HoveredLink>
            <HoveredLink href="/yearly">Yearly Horoscope</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Free services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/kundli">Free Kundli</HoveredLink>
            <HoveredLink href="/kundli-matching">Kundli Matching</HoveredLink>
            <HoveredLink href="/compatibility">Compatibility</HoveredLink>
            <HoveredLink href="/tarot">Tarot</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

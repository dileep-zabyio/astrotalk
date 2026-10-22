"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/src/components/Navbar";
import { AstrologerShowcase } from "@/src/components/AstrologerShowcase";
import { StatsBar } from "@/components/StatsBar";
import { ActivityTicker } from "@/src/components/ActivityTicker";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-r from-black to-yellow-900 justify-between overflow-x-hidden text-white bg-[#070709]">
      <Navbar />
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 lg:pr-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-700/70 shadow-inner backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs sm:text-sm font-medium justify-center h-6 w-60 rounded-full text-neutral-200">
                1240 astrologers online now
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.01em] leading-[1.12]">
              India's most accurate{" "}
              <span className="mt-1 bg-gradient-to-r from-amber-200 to-amber-700 bg-clip-text text-transparent">
                astrology platform
              </span>
            </h1>
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-200 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(244,203,56,0.4)]">
                </div>
                <span className="text-sm sm:text-base text-neutral-400 font-light">
                  Get Free detailed kundli
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-200 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(244,203,56,0.4)]">
                </div>
                <span className="text-sm sm:text-base text-neutral-400 font-light">
                  Average reply under 12 seconds
                </span>
              </div>
            </div>


            <div className="pt-2">
              <Link
                href="/newchat"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-200 shadow-[0_0_45px_rgba(254,240,138,0.01)] shadow-yellow-200 text-neutral-950 font-medium text-base rounded-full transition-all hover:scale-105 active:scale-95 group"
              >
                <span>Start Free Chat</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="w-full pt-4">
              <StatsBar />
            </div>

          </div>


          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <AstrologerShowcase />
          </div>

        </div>
      </main>
      <ActivityTicker />
    </div>
  );
}

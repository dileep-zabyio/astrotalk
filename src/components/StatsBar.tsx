"use client";

import React from "react";

const stats = [
  { value: "5Cr+", label: "Users guided" },
  { value: "50,000+", label: "Verified astrologers" },
  { value: "13+", label: "Languages" },
  { value: "60+", label: "Countries" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 pt-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {stat.value}
          </span>
          <span className="text-xs sm:text-sm text-neutral-400 mt-1">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

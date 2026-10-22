"use client";

import React from "react";

const activities = [
  {
    user: "Rahul",
    city: "Mumbai",
    action: "booked Saturn puja with",
    target: "Pt. Ram Naresh",
    time: "Just now",
  },
  {
    user: "Neha",
    city: "Hyderabad",
    action: "got her Kundli read by",
    target: "Saanvi Sharma",
    time: "4 min ago",
  },
  {
    user: "Amit",
    city: "Delhi",
    action: "consulted about career with",
    target: "Acharya Dev",
    time: "2 min ago",
  },
  {
    user: "Priya",
    city: "Bengaluru",
    action: "checked Gun Milan with",
    target: "Pt. Aniruddh",
    time: "1 min ago",
  },
  {
    user: "Rohan",
    city: "Pune",
    action: "booked Maha Mrityunjaya Puja with",
    target: "Acharya Shastri",
    time: "5 min ago",
  },
  {
    user: "Ananya",
    city: "Jaipur",
    action: "consulted about marriage with",
    target: "Dr. Gayatri Devi",
    time: "Just now",
  },
];

export function ActivityTicker() {
  return (
    <aside aria-label="Recent Live Activity" className="w-full bg-[#08080c]/90 border-t border-white/[0.07] py-3 overflow-hidden backdrop-blur-md">
      <div className="relative flex items-center">
        <div className="flex shrink-0 items-center gap-8 whitespace-nowrap text-xs sm:text-sm text-neutral-300">
          {[...activities, ...activities].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-neutral-400 font-semibold">
                {item.user} <span className="text-neutral-400 font-semibold">from {item.city}</span>
              </span>
              <span className="text-neutral-400">{item.action}</span>
              <span className="text-neutral-400">{item.target}</span>
              <span className="text-neutral-400 text-xs ml-1">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

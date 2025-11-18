"use client";

import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  gradientFrom = "#B24592",
  gradientTo = "#F15F79",
}: StatCardProps) {
  return (
    <div
      className="flex items-center gap-5 px-6 py-5 rounded-xl shadow-lg text-white"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="text-white">{icon}</div>
      <div>
        <p className="text-3xl font-bold leading-tight">{value}</p>
        <p className="text-sm opacity-90 mt-1">{label}</p>
      </div>
    </div>
  );
}

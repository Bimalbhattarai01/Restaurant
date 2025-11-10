"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MenuHeader() {
  const router = useRouter();

  return (
    <header className="bg-gradient-to-r from-[#7B0F1C] via-[#B91C2C] to-[#BF1E2E] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide"
          >
            <span className="rounded-full bg-white/20 p-2">
              <ArrowLeft className="size-4" />
            </span>
            Back
          </button>
          <p className="text-sm tracking-[0.4em] uppercase opacity-80">
            Item Description
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-serif leading-tight">
            Item <span className="text-[#FFD6D9] italic">Description</span>
          </p>
        </div>
      </div>
    </header>
  );
}

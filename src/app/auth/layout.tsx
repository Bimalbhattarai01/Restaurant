import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F7F8FB] to-[#EEF2F7] grid lg:grid-cols-[420px_1fr]">
      <aside className="relative hidden lg:flex flex-col text-white overflow-hidden">
        <Image src="/Dinner.svg" alt="Restaurant ambience" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#131325]/80 via-[#131325]/70 to-[#131325]/85" />
        <div className="relative z-10 flex flex-col h-full p-10 gap-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Image src="/Logo.svg" alt="Alma do Fado" width={32} height={32} className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-200">Alma do Fado</p>
              <p className="text-lg font-semibold">Hospitality Suite</p>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <h2 className="text-3xl font-semibold leading-tight">Crafted hospitality, simplified.</h2>
            <p className="text-sm text-gray-200/90 leading-relaxed max-w-xs">
              Manage menus, stories, and reservations with a calm, focused workspace.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl lg:w-[42vw]">{children}</div>
      </main>
    </div>
  );
}

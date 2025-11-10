import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6FAFD] flex items-center justify-center p-6">
      {children}
    </div>
  );
}

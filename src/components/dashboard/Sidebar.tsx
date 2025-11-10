"use client";

import { LayoutDashboard, FileText, CalendarCheck, PlusSquare, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={22} strokeWidth={2.2} />,
    href: "/dashboard",
  },
  {
    name: "Add Menu",
    icon: <PlusSquare size={22} strokeWidth={2.2} />,
    href: "/dashboard/add-menu",
  },
  {
    name: "Blog",
    icon: <FileText size={22} strokeWidth={2.2} />,
    href: "/dashboard/blog",
  },
  {
    name: "Contact Us",
    icon: <CalendarCheck size={22} strokeWidth={2.2} />,
    href: "/dashboard/contact-us",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/auth");
      router.refresh();
      setLoggingOut(false);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#BF1E2E] flex-col justify-between text-white shadow-lg rounded-r-2xl z-50 hidden md:flex">
      <div>
        <div className="flex items-center justify-center py-8">
          <Image src="/logo.png" alt="Alma Do Fado" width={120} height={60} className="object-contain" />
        </div>

        <nav className="mt-4 flex flex-col gap-3 px-6">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-[16px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#BF1E2E] font-semibold shadow-md"
                    : "text-white/90 hover:bg-[#A71B28] hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-6 pb-5">
        <div className="border-t border-white/30 pt-4 text-center flex flex-col gap-3">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            <LogOut size={16} />
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
          <div>
            <p className="text-sm text-white/80">Version</p>
            <p className="text-[12px] tracking-widest text-white/60 mt-1">0.0.0.1</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

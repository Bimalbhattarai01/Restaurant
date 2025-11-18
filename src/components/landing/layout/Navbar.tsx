"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/10 backdrop-blur-md border border-white/40 ">
      <nav className="max-w-9xl mx-auto flex items-center justify-center py-5 px-10 relative">
        <ul className="hidden md:flex items-center justify-center text-white font-manrope text-[18px] font-semibold gap-40">
          {navLinks.slice(0, 2).map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="relative group hover:text-primary transition">
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          ))}

          <li className="mx-1">
            <Link href="/" className="flex flex-col items-center text-center">
              <Image src="/assets/branding/Logo.svg" alt="Alma do Fado" width={90} height={90} className="object-contain" />
            </Link>
          </li>

          {navLinks.slice(2).map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="relative group hover:text-primary transition">
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/menu"
              className="px-7 py-2.5 border border-white text-white rounded-full font-inter text-[16px] font-medium hover:bg-white hover:text-primary transition-all duration-300"
            >
              Menu
            </Link>
          </li>
        </ul>

        <button className="md:hidden absolute right-6 text-white text-3xl" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-black/90 text-white text-center py-4 space-y-4 font-manrope">
          {navLinks.map((link) => (
            <div key={link.name}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 hover:text-primary transition"
              >
                {link.name}
              </Link>
            </div>
          ))}
          <Link
            href="/reserve"
            onClick={() => setIsOpen(false)}
            className="inline-block mt-2 border border-white px-6 py-2 rounded-full hover:bg-white hover:text-primary transition-all"
          >
            Reserve
          </Link>
        </div>
      )}
    </header>
  );
}

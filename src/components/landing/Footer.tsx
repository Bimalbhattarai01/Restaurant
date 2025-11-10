import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#BF1E2E] text-white h-[500px] overflow-hidden">
      <div className="absolute -top-[1px] left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[180px]" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <path fill="#F6FAFD" fillOpacity="1" d="M0,320 C480,60 960,60 1440,320 L1440,0 L0,0 Z"></path>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-40 pb-10 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 h-full">
        <div className="flex flex-col justify-start md:justify-center md:items-start mt-6">
          <Image src="/Logo.svg" alt="Alma do Fado" width={115} height={115} className="object-contain mb-1" />
          <p className="font-playfair text-[15px] border-t border-white/70 pt-1 mt-0 tracking-wide">
            Brunch & Live Fado
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-[20px] font-playfair font-semibold mb-3">Restaurant</h3>
          <ul className="space-y-2 text-[15px] text-white/90 font-inter">
            <li>
              <Link href="/about" className="hover:underline">
                About us
              </Link>
            </li>
            <li>
              <Link href="/menu" className="hover:underline">
                Our Menu
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:underline">
                Book a Table
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:underline">
                Blog Post
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-[20px] font-playfair font-semibold mb-3">Information</h3>
          <ul className="space-y-2 text-[15px] text-white/90 font-inter">
            <li>
              <Link href="#" className="hover:underline">
                Terms & conditions
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                24/7 Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Style Guide
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Change logo
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-[20px] font-playfair font-semibold mb-3">Contact info</h3>
          <p className="text-[15px] text-white/90 font-inter leading-relaxed mb-5">
            Rua Das Portas De Santo Antão, 112–134, Lisbon 1150-268, Portugal.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-[#f8d7d7] transition">
              <Facebook size={18} />
            </Link>
            <Link href="#" className="hover:text-[#f8d7d7] transition">
              <Instagram size={18} />
            </Link>
            <Link href="#" className="hover:text-[#f8d7d7] transition">
              <Twitter size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

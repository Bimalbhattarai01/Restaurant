import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FadoSection() {
  return (
    <section className="w-full bg-[#F6FAFD] py-10 text-center px-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-[22px] font-playfair text-orange-700 font-semibold">Live Entertainment with</p>
        <p className="text-5xl md:text-6xl font-playfair font-bold text-orange-700 mt-1">Fado Music</p>

        <p className="mt-6 text-gray-600 leading-relaxed text-[15px] md:text-[16px] font-inter">
          Fado is a music genre which can be traced to the 1820s in Lisbon, Portugal, but probably has much earlier
          origins. Fado historian and scholar Rui Vieira Nery states that “the only reliable information on the history
          of fado was orally transmitted and goes back to the 1820s and 1830s at best. But even that information was
          frequently modified within the generational transmission process that made it reach us today.”
        </p>

        <div className="mt-8 flex justify-center">
           <Link
              href="/blog">
        <button className="flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-lg font-medium hover:bg-[#a81927] transition-all">
          <ArrowRight size={18} />
          View More
        </button>
        </Link>
        </div>

        <div className="mt-12 flex justify-center">
          <Image src="/musicial.svg" alt="Fado Band" width={500} height={400} className="object-contain" />
        </div>
      </div>
    </section>
  );
}

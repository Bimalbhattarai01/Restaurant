import Image from "next/image";

export default function CustomerReview() {
  return (
    <section className="relative w-full bg-[#F6FAFD] py-28 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-[12%] w-20 h-20 rounded-full overflow-hidden shadow-lg">
          <Image src="/pp1.svg" alt="Customer 1" fill className="object-cover" />
        </div>
        <div className="absolute top-[40%] left-[8%] w-20 h-20 rounded-full overflow-hidden shadow-lg">
          <Image src="/pp2.svg" alt="Customer 2" fill className="object-cover" />
        </div>
        <div className="absolute bottom-[10%] left-[18%] w-20 h-20 rounded-full overflow-hidden shadow-lg">
          <Image src="/pp3.svg" alt="Customer 3" fill className="object-cover" />
        </div>

        <div className="absolute top-12 right-[12%] w-20 h-20 rounded-full overflow-hidden shadow-lg">
          <Image src="/pp1.svg" alt="Customer 4" fill className="object-cover" />
        </div>
        <div className="absolute top-[40%] right-[8%] w-20 h-20 rounded-full overflow-hidden shadow-lg">
          <Image src="/pp2.svg" alt="Customer 5" fill className="object-cover" />
        </div>
        <div className="absolute bottom-[10%] right-[18%] w-20 h-20 rounded-full overflow-hidden shadow-lg">
          <Image src="/pp3.svg" alt="Customer 6" fill className="object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <p className="text-[39px] text-orange-700 font-playfair italic mb-2">Our</p>
        <p className="text-[40px] md:text-[52px] font-playfair font-bold text-orange-700 mb-6">Customer Review</p>

        <p className="text-gray-700 text-[16px] leading-relaxed mb-8 font-inter">
          At Almado Fado Al Fama, every dish is a note, and every evening tells a story. Inspired by the haunting beauty
          of Fado — Portugal’s traditional soul music we blend heartfelt live performances with the warmth of
          family-style Portuguese dining.
          <br />
          <br />
          Set in the heart of Alfama, Lisbon’s oldest district, our candlelit space invites you to savor the flavors of{" "}
          <em>bacalhau</em>, <em>pastéis de nata</em>, and fine wines while being serenaded by the voice of a{" "}
          <em>fadista</em> and the gentle strum of the
          <em> guitarra portuguesa</em>.
        </p>

        <div className="flex flex-col items-center mt-6">
          <div className="w-16 h-[2px] bg-orange-600 mb-2"></div>
          <p className="text-[17px] text-gray-800 font-semibold font-inter">Mr. Abc</p>
        </div>
      </div>
    </section>
  );
}

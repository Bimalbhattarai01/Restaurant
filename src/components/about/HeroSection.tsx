import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-[#BF1E2E] text-white min-h-[60vh] lg:min-h-[100vh] mb-10 lg:mb-70">
      {/* Hero Image positioned above the curve */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 
        -bottom-16 sm:-bottom-24 md:-bottom-48 lg:-bottom-64 
        w-[90%] max-w-[1400px] 
        h-[250px] sm:h-[400px] md:h-[600px] lg:h-[700px] 
        z-20 pt-5 sm:pt-10 lg:pt-40"
      >
        <Image
          src="/images/burger.png"
          alt="Delicious Food"
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Bottom SVG Curve */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <svg
          className="block w-full h-[320px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#F3F4F6"
            d="M0,160 Q720,250 1440,160 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center 
        pt-16 sm:pt-20 md:pt-52 lg:pt-70  md:pb-20 lg:pb-30"
      >
        <h3 className="font-inter text-base sm:text-lg md:text-xl lg:text-xl font-semibold pb-2 sm:pb-3 md:pb-4 lg:pb-5">
          About Us
        </h3>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-anton font-bold tracking-wide mb-2 sm:mb-3 md:mb-4 lg:mb-4 w-full max-w-[90%]">
          Alma Do
          <span className="block mt-1 sm:mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-greatvibes ml-auto -mr-4 sm:-mr-8 md:-mr-12 lg:-mr-20">
            Fado
          </span>
        </h2>
      </div>
    </section>
  );
}

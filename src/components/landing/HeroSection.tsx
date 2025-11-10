import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center w-full min-h-[125vh] overflow-hidden bg-white text-white">
      <div className="absolute inset-0">
        <Image src="/Hero.svg" alt="Hero Background" fill priority className="object-cover brightness-[0.85]" />
      </div>

      <div className="relative z-10 text-center mt-70 px-2">
        <p className="font-inter text-[20px] text-gray-200 tracking-wide mb-4">
          Experience soulful music & traditional Portuguese cuisine.
        </p>

        <h1 className="text-[56px] md:text-[82px] font-anton font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          Where Fado Meets <span className="text-primary font-greatvibes ">Flavor</span>
        </h1>
      </div>

      <div className="relative z-20 mt-[120px]">
        <Image
          src="/Dish.png"
          alt="Main Dish"
          width={920}
          height={820}
          className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
        />
      </div>

      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66 92.83C906.67 72 823.78 31 743.84 14.19 661.1-3.22 578.09 3.8 495.5 21.75c-78.92 17.28-157.31 43.86-236.23 49.88C164.1 76.55 82.05 59.89 0 43.23v77.77h1200V97.8c-69.55 12.28-139.1 24.56-214.34-4.97z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}

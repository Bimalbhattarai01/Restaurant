"use client";

import Image from "next/image";

export default function ExperienceSection() {
  const cards = [
    { title: "Family Table", icon: "/icons/kitchen.svg", angle: "-rotate-10",angleimg: "rotate-10", bg: "bg-[#F8F3EF]" },
    { title: "Wine Room", icon: "/icons/kitchen.svg", angle: "-rotate-5",angleimg: "rotate-8", bg: "bg-[#EFE8E2]" },
    { title: "Family Exclusive Tasting", icon: "/icons/kitchen.svg", angle: "rotate-5",angleimg: "rotate-9", bg: "bg-[#F8F3EF]" },
    { title: "Family Table", icon: "/icons/kitchen.svg", angle: "rotate-9",angleimg: "rotate-12", bg: "bg-[#EFE8E2]" },
  ];

  return (
    <section className="relative w-full bg-[#F4F9FF] pb-0 overflow-hidden">

      <Image src="/decor-leaf.png" alt="leaf" width={180} height={180}
        className="absolute -top-10 -left-6 z-[10] rotate-[-10deg]" />
      <Image src="/images/leaf.png" alt="leaf" width={180} height={180}
        className="absolute -top-10 right-6 z-[10] rotate-[6deg]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-[700px] ">

        <div className="relative bg-[#BF1E2E] text-white px-12 pt-1 pb-10 flex flex-col justify-center overflow-visible">

          {/* BG Icons */}
          <Image src="/icons/pizza.svg" width={110} height={110}
            alt="" className="absolute top-12 left-16 opacity-20" />
          <Image src="/icons/donut.svg" width={90} height={90}
            alt="" className="absolute top-36 right-20 opacity-20" />
          <Image src="/icons/fries.svg" width={90} height={90}
            alt="" className="absolute bottom-20 left-14 opacity-20" />

          <h1 className="text-5xl lg:text-[52px] font-extrabold leading-tight -translate-y-1">
            Experience the <br /> Soul of Alfama
          </h1>

          <p className="text-white/90 mt-2 max-w-xl leading-relaxed -translate-y-1">
            At Almado Fado Al Fama, every dish is a note, and every evening tells a story.
          </p>

          {/* ========= CARDS OVERLAPPING ONLY LEFT SIDE ========= */}
          <div className="absolute -bottom-28 left-6 flex gap-0 z-[50]">

            {cards.map((card, i) => (
              <div
                key={i}
                className={`group w-[250px] ${card.bg} p-6 rounded-xl ${i > 0 ? "-ml-8" : ""}
                            shadow-[0_22px_42px_rgba(0,0,0,0.18)] ${card.angle}
                            transition-all duration-500 ease-out hover:-translate-y-25 hover:shadow-[0_26px_52px_rgba(0,0,0,0.22)]`}
              >
                <h3 className="text-[25px] font-semibold text-[#9A4D2B] text-center">
                  {card.title}
                </h3>

                <Image src={card.icon} alt={card.title} width={70} height={70}
                  className={`mx-auto my-4 ${card.angleimg}`} />

                <p className="text-[12px] text-[#9A4D2B] text-center opacity-0 group-hover:opacity-100 transition-all duration-300 max-w-[190px] mx-auto">
                  At the heart of every evening is our devotion to music where haunting melodies and emotional lyrics bring Portugal&apos;s soul to life.
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* ========= RIGHT IMAGE PANEL ========= */}
        <div className="relative min-h-[520px] overflow-hidden">
          <Image
            src="/images/tomato.png"
            alt="food dish"
            fill
            className="object-cover object-center"
          />
        </div>

      </div>
    </section>
  );
}

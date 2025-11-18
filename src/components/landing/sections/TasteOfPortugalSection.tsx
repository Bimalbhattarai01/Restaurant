"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TasteOfPortugalSection() {
  const dishes = [
    { id: 1, image: "/images/soup.png" },
    { id: 2, image: "/images/salad.png" },
    { id: 3, image: "/images/korean_dish.png" },
    { id: 4, image: "/images/burger.png" },
  ];

  return (
    <section className="relative bg-[#F6FAFD] py-16 px-4">
      <div className="relative mx-auto max-w-6xl flex flex-col items-center text-center">
        {/* Decorative Leaf */}
        <Image
          src="/decor-leaf.png"
          alt=""
          width={160}
          height={160}
          priority
          className="absolute -left-6 top-10 hidden rotate-[-8deg] md:block"
          aria-hidden
        />

        {/* Heading */}
        <p className="font-playfair text-lg text-[#A73419]">
          The Taste of Portugal
        </p>
        <h2 className="mt-1 font-playfair text-4xl font-semibold text-[#A73419] md:text-5xl">
          Sung Through Fado
        </h2>

        {/* Image Grid */}
        <div className="mt-10 grid w-full gap-5 md:grid-cols-3">
          {/* Left large image */}
          <div className="relative rounded-2xl overflow-hidden shadow-md md:col-span-1 md:row-span-2 h-[420px] group">
            <Image
              src={dishes[0].image}
              alt="Main Dish"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay (no text) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Right side container */}
          <div className="flex flex-col gap-5 md:col-span-2">
            {/* Top two small images */}
            <div className="grid grid-cols-2 gap-5">
              {[dishes[1], dishes[2]].map((dish) => (
                <div
                  key={dish.id}
                  className="relative rounded-2xl overflow-hidden shadow-md h-[200px] group"
                >
                  <Image
                    src={dish.image}
                    alt="Dish"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>

            {/* Bottom wide image */}
            <div className="relative rounded-2xl overflow-hidden shadow-md h-[200px] group">
              <Image
                src={dishes[3].image}
                alt="Dish"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>

        {/* View More Button */}
        <div className="mt-10">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-md bg-[#BF1E2E] px-6 py-3 font-medium text-white transition-colors hover:bg-[#a81927]"
          >
            <ArrowRight size={18} />
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}

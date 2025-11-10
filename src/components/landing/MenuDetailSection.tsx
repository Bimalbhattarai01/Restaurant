"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight,ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";

interface MenuDetailSectionProps {
  name: string;
  category: string;
  description: string;
  price: string;
  images?: string[];
}

function resolveImageSource(image: string) {
  if (image.startsWith("http")) return { src: image, unoptimized: true };
  return { src: image, unoptimized: false };
}

export default function MenuDetailSection({
  name,
  category,
  description,
  price,
  images = ["/Dish.png"],
}: MenuDetailSectionProps) {
  const gallery = useMemo(() => (images.length > 0 ? images : ["/Dish.png"]), [images]);
  const galleryMeta = useMemo(
    () => gallery.map((image) => ({ image, ...resolveImageSource(image) })),
    [gallery]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const mainImageMeta = galleryMeta[currentIndex] ?? galleryMeta[0];

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

  return (
    <section className="flex flex-col gap-12">
            {/* BACK BUTTON */}
      <div className="flex items-center mb-4">
        <Link
          href="/menu"
          className="flex items-center gap-2 bg-[#BF1E2E] hover:bg-[#A61926] text-white font-inter px-4 py-1.5 rounded-md shadow transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
      {/* TOP SECTION */}
      <div className="grid lg:grid-cols-[1fr_1.1fr] items-center gap-12">
        {/* LEFT: Main Image with arrows */}
        <div className="relative flex justify-center">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-[-35px] top-1/2 -translate-y-1/2 bg-[#E8C6C6] text-[#BF1E2E] p-2 rounded-full hover:bg-[#BF1E2E] hover:text-white transition"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Main Image */}
          <div className="w-full max-w-[380px] h-[380px] rounded-xl overflow-hidden shadow-xl bg-white">
            <Image
              src={mainImageMeta.src}
              alt={name}
              width={700}
              height={700}
              className="w-full h-full object-cover"
              unoptimized={mainImageMeta.unoptimized}
              priority
            />
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-[-35px] top-1/2 -translate-y-1/2 bg-[#E8C6C6] text-[#BF1E2E] p-2 rounded-full hover:bg-[#BF1E2E] hover:text-white transition"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* RIGHT: Content */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-[48px] font-bold font-playfair text-[#BF1E2E] leading-tight">
                {name}
              </h1>
              <p className="text-gray-500 font-inter text-base">{category}</p>
            </div>

            {/* Price bubble */}
            <div className="relative">
              <div className="flex flex-col items-center justify-center rounded-full bg-[#BF1E2E] text-white h-[110px] w-[110px] shadow-lg">
                <span className="text-[38px] font-bold font-inter leading-none">{price}</span>
              </div>
          
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed text-[15px]">
            {description}
          </p>

          <ul className="space-y-1.5 text-gray-600 text-[14px]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#BF1E2E]" />
                eat live performances
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM THUMBNAILS */}
      <div className="flex gap-4 justify-left">
        {galleryMeta.map((thumbMeta, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={`${thumbMeta.image}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-[80px] w-[90px] rounded-md overflow-hidden border-2 ${
                isActive ? "border-[#BF1E2E]" : "border-transparent"
              } shadow hover:scale-[1.03] transition`}
            >
              <Image
                src={thumbMeta.src}
                alt={`${name} thumbnail ${index + 1}`}
                width={100}
                height={80}
                className="h-full w-full object-cover"
                unoptimized={thumbMeta.unoptimized}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

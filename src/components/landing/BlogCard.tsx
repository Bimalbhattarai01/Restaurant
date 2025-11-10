"use client";

import Image from "next/image";

interface BlogCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  reverse?: boolean;
}

export default function BlogCard({
  title,
  subtitle,
  description,
  image,
  reverse = false,
}: BlogCardProps) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* IMAGE */}
      <div className="md:w-1/2 flex justify-center">
        <div className="w-[380px] h-[260px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src={image || "/placeholder.jpg"}
            alt={title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* TEXT */}
      <div
        className={`md:w-1/2 ${
          reverse ? "text-right" : "text-left"
        } space-y-3`}
      >
        <p className="text-[#BF1E2E] font-playfair text-[18px] tracking-[0.1em] leading-relaxed">
          {subtitle}
        </p>
        <h2 className="text-[26px] md:text-[28px] font-playfair font-semibold text-[#BF1E2E] leading-snug">
          {title}
        </h2>
        <p className="text-[#444] text-[15px] leading-relaxed max-w-[600px] mx-auto md:mx-0">
          {description}
        </p>
      </div>
    </div>
  );
}

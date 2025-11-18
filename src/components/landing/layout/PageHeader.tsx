"use client";
import React, { useMemo } from "react";
import Image from "next/image";

interface PageHeaderProps {
  title?: string;
  titlePrimary?: string;
  titleSecondary?: string;
  height?: string;
  randomizeIcons?: boolean;
}

interface IconPosition {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

const baseIcons: IconPosition[] = [
  { src: "/icons/pizza.svg", className: "top-10 left-12 rotate-[-12deg]" },
  { src: "/icons/pizza.svg", className: "top-20 right-16 rotate-[18deg]" },
  { src: "/icons/donut.svg", className: "bottom-12 left-1/4 rotate-[12deg]" },
  { src: "/icons/fries.svg", className: "bottom-6 right-10 rotate-[-8deg]" },
  { src: "/icons/donut.svg", className: "top-1/2 left-6 rotate-[28deg]" },
  { src: "/icons/fries.svg", className: "top-6 right-1/3 rotate-[-20deg]" },
];

function generateRandomPositions(icons: IconPosition[]): IconPosition[] {
  return icons.map((icon) => {
    const topAnchor = Math.random() > 0.5;
    const vertical = topAnchor
      ? { top: `${Math.random() * 50 + 5}%` }
      : { bottom: `${Math.random() * 50 + 5}%` };
    const leftAnchor = Math.random() > 0.5;
    const horizontal = leftAnchor
      ? { left: `${Math.random() * 50 + 5}%` }
      : { right: `${Math.random() * 50 + 5}%` };
    const rotation = { transform: `rotate(${Math.floor(Math.random() * 60 - 30)}deg)` };
    return { ...icon, className: undefined, style: { ...vertical, ...horizontal, ...rotation } };
  });
}

export default function PageHeader({
  title,
  titlePrimary,
  titleSecondary,
  height = "py-40",
  randomizeIcons = false,
}: PageHeaderProps) {
  const iconPositions = useMemo(() => (randomizeIcons ? generateRandomPositions(baseIcons) : baseIcons), [randomizeIcons]);

  return (
    <div className="relative bg-[#BF1E2E] overflow-hidden">
      {/* Background floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        {iconPositions.map(({ className, style, src }, index) => (
          <Image
            key={index}
            src={src}
            alt=""
            width={72}
            height={72}
            aria-hidden
            className={`absolute opacity-70 drop-shadow-lg ${className ?? ""}`}
            style={style}
          />
        ))}
      </div>

      {/* Title */}
      <div
        className={`relative flex items-center justify-center ${height} text-center`}
      >
        {title ? (
          <h1 className="text-white text-5xl md:text-7xl font-playfair font-semibold drop-shadow-md">
            {title}
          </h1>
        ) : (
          <h1 className="text-white text-5xl md:text-7xl drop-shadow-md">
            <span className="font-extrabold font-inter">{titlePrimary} </span>
            <span className="italic font-playfair">{titleSecondary}</span>
          </h1>
        )}
      </div>

      {/* Curved Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[120px] md:h-[140px] drop-shadow-[0_6px_6px_rgba(0,0,0,0.25)]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#F6FAFD"
            d="M0,250 C480,330 960,330 1440,250 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

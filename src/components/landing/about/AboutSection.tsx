"use client";
import Image from "next/image";
import { aboutImages } from "../../../../lib/data";

export default function AboutSection() {
  return (
    <section className="bg-gray-100 py-16 px-6 md:px-20">
      <div className="text-center mb-8">
        <h3 className="text-[#A12900] text-xl md:text-3xl font-playfair font-semibold mb-3">About Us</h3>
        <h1 className="text-[#A12900] text-3xl md:text-5xl font-playfair font-medium leading-none">
          Where Music Meets the Meal <br /> & the Heart Finds a Home
        </h1>
      </div>

      <div className="max-w-4xl mx-auto text-center text-gray-700 mb-10">
        <p className="leading-relaxed">
          At Almado Fado Alfama, we’re more than a restaurant — we’re a living tribute to the soul of Portugal.
          Nestled in the cobbled alleys of Alfama, Lisbon’s oldest and most soulful neighborhood, our space celebrates
          Fado, Portugal’s traditional music of longing, love, and life. At Almado Fado Alfama, we’re more than a
          restaurant — we’re a living tribute to the soul of Portugal. Nestled in the cobbled alleys of Alfama,
          Lisbon’s oldest and most soulful neighborhood, our space celebrates Fado, Portugal’s traditional music of
          longing, love, and life.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-6 max-w-6xl mx-auto">
        {aboutImages.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg">
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={200}
              className="rounded-lg  w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

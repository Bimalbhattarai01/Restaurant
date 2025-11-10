import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function MenuSection() {
  const menuImages = [
    { src: "/food1.svg", alt: "Portuguese Desserts" },
    { src: "/food2.svg", alt: "Traditional Ingredients" },
    { src: "/food3.svg", alt: "Portuguese Dish" },
  ];

  return (
    <section className="w-full bg-[#F6FAFD] py-24 text-center">
      <div className="mb-12">
        <p className="text-[22px] font-semibold text-orange-800 font-playfair">Menu Of</p>
        <h2 className="text-[40px] md:text-[52px] font-playfair font-bold text-orange-800 leading-tight">
          Quality & Tradition
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
        {menuImages.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={400}
              height={400}
              className="w-full h-[350px] object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-lg font-medium hover:bg-[#a81927] transition-all">
          <ArrowRight size={18} />
          View More
        </button>
      </div>
    </section>
  );
}

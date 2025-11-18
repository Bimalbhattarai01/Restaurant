import Image from "next/image";

export default function FeatureSection() {
  const features = [
    {
      title: "Music",
      description:
        "At the heart of every evening is our devotion to music where haunting melodies and emotional lyrics bring Portugal's soul to life.",
      icon: "/assets/landing/illustrations/Music.svg",
    },
    {
      title: "Drinks",
      description:
        "Sourced locally, cooked with tradition from bacalhau to pastéis de nata, each dish is a memory served warm.",
      icon: "/assets/landing/menu/Drinks.svg",
    },
    {
      title: "Live Cook",
      description:
        "At the heart of every evening is our devotion to music where haunting melodies and emotional lyrics bring Portugal's soul to life.",
      icon: "/assets/landing/menu/Cook.svg",
    },
  ];

  return (
    <section className="w-full bg-[#F6FAFD] py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {features.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center text-center px-10 py-14">
            <Image src={item.icon} alt={item.title} width={90} height={90} className="object-contain" />
            <p className="mt-6 text-[22px] font-bold  text-[var(--orange)]">{item.title}</p>

            <p className="mt-4 text-gray-600 text-[15px] font-inter leading-relaxed max-w-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

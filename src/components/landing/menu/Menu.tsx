import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface MenuSectionProps {
  title: string;
  imageSrc: string;
  items: MenuItem[];
  reverse?: boolean;
}

export default function Menu({ title, imageSrc, items, reverse = false }: MenuSectionProps) {
  return (
    <div
      className={`grid md:grid-cols-2 gap-10 items-center ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className={`relative ${reverse ? "order-2" : "order-1"}`}>
        <Image
          src={imageSrc}
          alt={`${title} dish`}
          width={600}
          height={600}
          className="rounded-xl shadow-lg object-cover"
        />
      </div>

      {/* Text/Menu List */}
      <div className={`${reverse ? "order-1" : "order-2"}`}>
        <h2 className="text-3xl font-bold text-[#BF1E2E] mb-6 font-serif">
          {title}
        </h2>

        <ul className="space-y-5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between border-b border-gray-200 pb-3"
            >
              <div>
                <Link href={`/menu/${item.id}`} className="font-semibold hover:text-[#BF1E2E] transition-colors">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <span className="text-[#BF1E2E] font-semibold">{item.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

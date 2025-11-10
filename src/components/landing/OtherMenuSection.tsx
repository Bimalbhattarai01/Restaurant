import Image from "next/image";
import Link from "next/link";

interface OtherMenuItem {
  id: string;
  name: string;
  price: string;
  image?: string;
}

interface OtherMenuSectionProps {
  items: OtherMenuItem[];
}

function resolveImageSource(image?: string) {
  if (!image || image.trim().length === 0) return { src: "/Dish.png", unoptimized: false };
  if (image.startsWith("http")) return { src: image, unoptimized: true };
  return { src: image, unoptimized: false };
}

export default function OtherMenuSection({ items }: OtherMenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-[#BF1E2E]">Our</p>
        <h2 className="text-4xl font-serif text-[#BF1E2E]">Other Menu</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((menu) => (
          <Link
            href={`/menu/${menu.id}`}
            key={menu.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden hover:-translate-y-1 transition-transform"
          >
            <div className="h-40 w-full overflow-hidden">
              {(() => {
                const { src, unoptimized } = resolveImageSource(menu.image);
                return (
                  <Image
                    src={src}
                    alt={menu.name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                    unoptimized={unoptimized}
                  />
                );
              })()}
            </div>
            <div className="p-6 space-y-2">
              <p className="font-semibold text-[#BF1E2E]">{menu.name}</p>
              <p className="text-sm text-gray-500">{menu.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

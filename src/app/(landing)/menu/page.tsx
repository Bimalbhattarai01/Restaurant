
import Menu from "@/components/landing/Menu";
import { connectDB } from "@/lib/db";
import { Menu as MenuModel } from "@/models/Menu";
import Image from "next/image";
import { Types } from "mongoose";

type MenuCategory = "Brunch" | "Dinner";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface MenuRecord {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  price?: number;
  category: string;
}

async function getMenusByCategory(category: MenuCategory): Promise<MenuItem[]> {
  await connectDB();

  const menus = await MenuModel.find({ category }).sort({ createdAt: -1 }).lean<MenuRecord[]>();

  return menus.map((menu) => ({
    id: menu._id.toString(),
    name: menu.name,
    description: menu.description || "Description coming soon.",
    price: formatPrice(menu.price),
  }));
}

function formatPrice(price?: number) {
  if (typeof price !== "number") return "—";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function MenuPage() {
  const [brunchItems, dinnerItems] = await Promise.all([getMenusByCategory("Brunch"), getMenusByCategory("Dinner")]);

  return (
    <div className="bg-[#F6FAFD] min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative bg-[#BF1E2E] text-white text-center pb-24 pt-32">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-[110px]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#F6FAFD"
              fillOpacity="1"
              d="M0,224 C480,96 960,96 1440,224 L1440,0 L0,0 Z"
            ></path>
          </svg>
        </div>

        <h1 className="text-[46px] font-bold font-serif relative z-10">
          Quality & Tradition{" "}
          <span className="block font-greatvibes text-[50px] mt-2">Menu</span>
        </h1>

        <div className="absolute -bottom-[40px] left-1/2 transform -translate-x-1/2">
          <Image
            src="/decor-leaf.png"
            alt="Leaf Decoration"
            width={120}
            height={120}
            className="opacity-70 rotate-12"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 space-y-24">
        <Menu title="Brunch" imageSrc="/Brunch.svg" items={brunchItems} />
        <Menu
          title="Dinner"
          imageSrc="/Dinner.svg"
          items={dinnerItems}
          reverse
        />
      </section>
    </div>
  );
}

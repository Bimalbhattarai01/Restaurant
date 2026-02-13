
import Menu from "@/components/landing/menu/Menu";
import { connectDB } from "@/lib/db";
import ContactSection from "@/components/landing/sections/ContactSection";
import { Menu as MenuModel } from "@/models/Menu";
import PageHeader from "@/components/landing/layout/PageHeader";
import { Types } from "mongoose";

type MenuCategory = "Brunch" | "Dinner";

export const revalidate = 300;

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
        <PageHeader title="Menu" height="py-56" />

        

    

      <section className="max-w-6xl mx-auto px-6 py-24 space-y-24">
        <Menu title="Brunch" imageSrc="/Brunch.svg" items={brunchItems} />
        <Menu
          title="Dinner"
          imageSrc="/Dinner.svg"
          items={dinnerItems}
          reverse
        />
      </section>
      <ContactSection/>
    </div>
  );
}

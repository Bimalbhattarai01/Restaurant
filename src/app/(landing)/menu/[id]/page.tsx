export const dynamic = "force-dynamic";
export const revalidate = 0;

import MenuDetailSection from "@/components/landing/menu/MenuDetailSection";
import OtherMenuSection from "@/components/landing/sections/OtherMenuSection";
import PageHeader from "@/components/landing/layout/PageHeader";
import { connectDB } from "@/lib/db";
import { Menu } from "@/models/Menu";
import { Types, isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";

interface MenuRecord {
  _id: Types.ObjectId;
  name: string;
  category: string;
  description?: string;
  price?: number;
  image?: string;
  images?: string[];
}

interface MenuDetail {
  id: string;
  name: string;
  category: string;
  description: string;
  priceLabel: string;
  images: string[];
}

interface OtherMenuItem {
  id: string;
  name: string;
  priceLabel: string;
  image: string;
}

function formatPrice(price?: number) {
  if (typeof price !== "number") return "—";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function resolveImage(image?: string) {
  if (!image || image.trim().length === 0) return "/Dish.png";
  return image.startsWith("/") || image.startsWith("http") ? image : `/uploads/${image}`;
}

function normalizeImages(menu: MenuRecord) {
  const sources = Array.isArray(menu.images) && menu.images.length > 0 ? menu.images : menu.image ? [menu.image] : [];
  if (sources.length === 0) {
    return ["/Dish.png"];
  }
  return sources.map((item) => resolveImage(item));
}

async function getMenu(id: string): Promise<MenuDetail | null> {
  if (!isValidObjectId(id)) return null;

  await connectDB();
  const menu = await Menu.findById(id).lean<MenuRecord | null>();

  if (!menu) return null;

  const images = normalizeImages(menu);

  return {
    id: menu._id.toString(),
    name: menu.name,
    category: menu.category,
    description: menu.description || "Description coming soon.",
    priceLabel: formatPrice(menu.price),
    images,
  };
}

async function getOtherMenus(currentId: string): Promise<OtherMenuItem[]> {
  if (!isValidObjectId(currentId)) return [];

  await connectDB();
  const excludeId = new Types.ObjectId(currentId);

  const menus = await Menu.find({ _id: { $ne: excludeId } })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean<MenuRecord[]>();

  return menus.map((m) => ({
    id: m._id.toString(),
    name: m.name,
    priceLabel: formatPrice(m.price),
    image: normalizeImages(m)[0],
  }));
}

export default async function MenuDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const menu = await getMenu(id);

  if (!menu) notFound();

  const otherMenus = await getOtherMenus(menu.id);

  return (
    <div className="bg-[#F6FAFD] min-h-screen">
      {/* <MenuHeader /> */}<PageHeader title="Item" height="py-37" />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <MenuDetailSection
          name={menu.name}
          category={menu.category}
          description={menu.description}
          price={menu.priceLabel}
          images={menu.images}
        />

        <OtherMenuSection
          items={otherMenus.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.priceLabel,
            image: item.image,
          }))}
        />
      </main>
    </div>
  );
}

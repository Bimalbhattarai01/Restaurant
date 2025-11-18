import MenuDashboardContent from "@/components/dashboard/content/MenuDashboardContent";

type MenuPreview = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getMenuSnapshot(limit = 10): Promise<{ menus: MenuPreview[]; total: number }> {
  try {
    const res = await fetch(`${baseUrl}/api/menu?limit=${limit}&page=1`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const data = await res.json();

    return {
      menus: data.data ?? [],
      total: data.pagination?.total ?? data.data?.length ?? 0,
    };
  } catch (error) {
    console.error("Failed to load menu snapshot", error);
    return { menus: [], total: 0 };
  }
}

export default async function MenuPage() {
  const { menus, total } = await getMenuSnapshot();

  return <MenuDashboardContent initialMenus={menus} total={total} />;
}

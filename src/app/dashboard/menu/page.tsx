import MenuDashboardContent from "@/components/dashboard/content/MenuDashboardContent";
import { getMenuPage } from "@/lib/dashboard-data";

type MenuPreview = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
};

export default async function MenuPage() {
  const { data: menus, pagination } = await getMenuPage(1, 10);

  return <MenuDashboardContent initialMenus={menus as MenuPreview[]} total={pagination.total} />;
}

import SearchBar from "@/components/dashboard/layout/SearchBar";
import EditMenuForm from "@/components/dashboard/forms/EditMenuForm";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import { FileText } from "lucide-react";
import { getMenuById, getMenuCount } from "@/lib/dashboard-data";

type MenuFormData = {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  images?: string[];
};

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log("🆔 EditMenuPage ID:", id);

  const [menu, menuCount] = await Promise.all([getMenuById(id), getMenuCount()]);
  const menuData = menu as MenuFormData | null;
  

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6FAFD] p-6">
      <div className="flex items-center justify-between mb-6">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          {menuData ? (
            <EditMenuForm menu={menuData} />
          ) : (
            <div className="text-center text-red-600 mt-10">
              <p className="font-semibold text-lg">Menu not found or failed to load.</p>
              <p className="text-sm text-gray-500 mt-1">Check your ID and API connection.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Admin" message="Have a great day ahead.." height="h-[180px]" />
          <StatCard icon={<FileText />} value={menuCount} label="Items in Menu" />
        </div>
      </div>
    </div>
  );
}

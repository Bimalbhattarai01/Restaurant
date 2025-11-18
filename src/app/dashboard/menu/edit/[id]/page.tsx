import SearchBar from "@/components/dashboard/layout/SearchBar";
import EditMenuForm from "@/components/dashboard/forms/EditMenuForm";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import { FileText } from "lucide-react";

async function getMenu(id?: string) {
  if (!id || id === "undefined") return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/menu/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log("🆔 EditMenuPage ID:", id);

  const menu = await getMenu(id);
  

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6FAFD] p-6">
      <div className="flex items-center justify-between mb-6">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          {menu ? (
            <EditMenuForm menu={menu} />
          ) : (
            <div className="text-center text-red-600 mt-10">
              <p className="font-semibold text-lg">Menu not found or failed to load.</p>
              <p className="text-sm text-gray-500 mt-1">Check your ID and API connection.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Admin" message="Have a great day ahead.." height="h-[180px]" />
          <StatCard icon={<FileText />} value={30} label="Items in Menu" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import AdminCard from "@/components/dashboard/AdminCard";
import StatCard from "@/components/dashboard/StatCard";
import MenuTable from "@/components/dashboard/MenuTable";
import { FileText } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type MenuPreview = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
};

type MenuDashboardContentProps = {
  initialMenus: MenuPreview[];
  total: number;
};

export default function MenuDashboardContent({ initialMenus, total }: MenuDashboardContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm);
  const [menuCount, setMenuCount] = useState(total);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6FAFD] p-6">
      <div className="flex items-center justify-between mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search menu items..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <AdminCard name="Admin" message="Have a great day ahead.." height="h-[180px]" />
          <MenuTable
            initialMenus={initialMenus}
            searchTerm={debouncedSearch}
            onCountChange={setMenuCount}
            initialTotal={total}
          />
        </div>

        <div className="flex flex-col gap-4">
          <StatCard icon={<FileText />} value={menuCount} label="Items in Menu" />
        </div>
      </div>
    </div>
  );
}

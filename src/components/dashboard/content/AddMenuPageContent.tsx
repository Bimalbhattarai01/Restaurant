"use client";

import { useCallback, useState } from "react";
import AddMenuForm from "@/components/dashboard/forms/AddMenuForm";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import { FileText } from "lucide-react";

type AddMenuPageContentProps = {
  initialCount: number;
};

async function fetchMenuCount(): Promise<number> {
  try {
    const res = await fetch("/api/menu?limit=1", { cache: "no-store" });
    const data = await res.json();
    if (data.success) {
      return data.pagination?.total ?? data.data?.length ?? 0;
    }
    return 0;
  } catch (error) {
    console.error("Failed to fetch menu count", error);
    return 0;
  }
}

export default function AddMenuPageContent({ initialCount }: AddMenuPageContentProps) {
  const [menuCount, setMenuCount] = useState(initialCount);

  const handleMenuAdded = useCallback(async () => {
    const nextCount = await fetchMenuCount();
    setMenuCount(nextCount);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6FAFD] p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <AddMenuForm onMenuCreated={handleMenuAdded} />
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Admin" message="Have a great day ahead.." height="h-[180px]" />
          <StatCard icon={<FileText />} value={menuCount} label="Items in Menu" />
        </div>
      </div>
    </div>
  );
}

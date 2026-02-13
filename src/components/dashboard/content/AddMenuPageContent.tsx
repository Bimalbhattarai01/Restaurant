"use client";

import { useCallback, useState } from "react";
import AddMenuForm from "@/components/dashboard/forms/AddMenuForm";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import { FileText } from "lucide-react";

type AddMenuPageContentProps = {
  initialCount: number;
};

export default function AddMenuPageContent({ initialCount }: AddMenuPageContentProps) {
  const [menuCount, setMenuCount] = useState(initialCount);

  const handleMenuAdded = useCallback(() => {
    setMenuCount((prev) => prev + 1);
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

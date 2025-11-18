"use client";

import { useState } from "react";
import SearchBar from "@/components/dashboard/layout/SearchBar";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import BlogTable from "@/components/dashboard/tables/BlogTable";
import { FileText } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type BlogPreview = {
  _id?: string;
  subHeading: string;
  heading: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

type BlogDashboardContentProps = {
  initialBlogs: BlogPreview[];
  total: number;
};

export default function BlogDashboardContent({ initialBlogs, total }: BlogDashboardContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm);
  const [blogCount, setBlogCount] = useState(total);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6FAFD] p-6">
      <div className="flex items-center justify-between mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search blog posts..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <BlogTable
            initialBlogs={initialBlogs}
            searchTerm={debouncedSearch}
            onCountChange={setBlogCount}
            initialTotal={total}
          />
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Content Team" message="Share your latest stories." height="h-[180px]" />
          <StatCard icon={<FileText />} value={blogCount} label="Published Articles" />
        </div>
      </div>
    </div>
  );
}

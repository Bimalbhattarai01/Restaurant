import SearchBar from "@/components/dashboard/SearchBar";
import AdminCard from "@/components/dashboard/AdminCard";
import StatCard from "@/components/dashboard/StatCard";
import BlogFormScreen from "@/components/dashboard/BlogFormScreen";
import { FileText } from "lucide-react";
import Link from "next/link";

async function getBlogCount() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog?limit=1`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.pagination?.total || data.data?.length || 0;
  } catch (error) {
    console.error("Failed to load blog stats", error);
    return 0;
  }
}

export default async function AddBlogPage() {
  const totalBlogs = await getBlogCount();

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6FAFD] p-6">
      <div className="flex items-center justify-between mb-6">
        <SearchBar />
        <Link href="/dashboard/blog" className="text-sm font-semibold text-[#BF1E2E] hover:underline">
          Back to Vlogs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <BlogFormScreen mode="create" redirectOnSuccess={false} />
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Content Team" message="Share a new story." height="h-[180px]" />
          <StatCard icon={<FileText />} value={totalBlogs} label="Published Articles" />
        </div>
      </div>
    </div>
  );
}

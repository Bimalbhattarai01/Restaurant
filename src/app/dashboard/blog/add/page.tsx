import SearchBar from "@/components/dashboard/layout/SearchBar";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import BlogForm from "@/components/dashboard/forms/BlogForm";
import { FileText } from "lucide-react";
import Link from "next/link";
import { getBlogCount } from "@/lib/dashboard-data";

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
          <BlogForm mode="create" />
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Content Team" message="Share a new story." height="h-[180px]" />
          <StatCard icon={<FileText />} value={totalBlogs} label="Published Articles" />
        </div>
      </div>
    </div>
  );
}

import SearchBar from "@/components/dashboard/layout/SearchBar";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import BlogForm from "@/components/dashboard/forms/BlogForm";
import { FileText } from "lucide-react";
import Link from "next/link";

async function getBlog(id?: string) {
  if (!id || id === "undefined") return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to load blog", error);
    return null;
  }
}

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

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlog(id);
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
          {blog ? (
            <BlogForm blog={blog} mode="edit" />
          ) : (
            <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-600">
              <p className="text-lg font-semibold text-red-500">Vlog not found.</p>
              <p className="text-sm mt-2">Please check the link or return to the vlog list.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Content Team" message="Review and update stories." height="h-[180px]" />
          <StatCard icon={<FileText />} value={totalBlogs} label="Published Articles" />
        </div>
      </div>
    </div>
  );
}

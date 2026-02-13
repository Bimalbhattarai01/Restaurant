import SearchBar from "@/components/dashboard/layout/SearchBar";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import BlogForm from "@/components/dashboard/forms/BlogForm";
import { FileText } from "lucide-react";
import Link from "next/link";
import { getBlogById, getBlogCount } from "@/lib/dashboard-data";

type BlogFormData = {
  _id?: string;
  subHeading: string;
  heading: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [blog, totalBlogs] = await Promise.all([getBlogById(id), getBlogCount()]);
  const blogData = blog as BlogFormData | null;

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
          {blogData ? (
            <BlogForm blog={blogData} mode="edit" />
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

import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import BlogCard from "@/components/landing/blog/BlogCard";
import Image from "next/image";
import PageHeader from "@/components/landing/layout/PageHeader";

export const revalidate = 0; 
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  const normalizedBlogs = blogs.map((blog: any) => ({
    ...blog,
    title: blog.title ?? blog.heading ?? blog.name ?? "Sung Through Fado",
    subtitle: blog.subtitle ?? blog.subHeading ?? blog.subheading ?? "The Taste of Portugal",
    description:
      blog.description ??
      blog.content ??
      "At Almado Fado in Faro, every dish is a note, and every evening tells a story inspired by the haunting beauty of fado.",
    image: blog.image ?? blog.thumbnail ?? "",
  }));

  return (
    <div className="bg-[#F6FAFD] min-h-screen">
      <PageHeader title="Blog" />

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {normalizedBlogs.length > 0 ? (
          normalizedBlogs.map((blog: any, index: number) => (
            <BlogCard
              key={blog._id}
              title={blog.title}
              subtitle={blog.subtitle}
              description={blog.description}
              image={blog.image}
              reverse={index % 2 === 1}
            />
          ))
        ) : (
          <p className="text-center text-gray-600">No blogs available yet.</p>
        )}
      </main>
    </div>
  );
}

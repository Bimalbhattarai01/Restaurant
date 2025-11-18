import BlogDashboardContent from "@/components/dashboard/content/BlogDashboardContent";

type BlogPreview = {
  _id?: string;
  subHeading: string;
  heading: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getBlogSnapshot(limit = 10): Promise<{ blogs: BlogPreview[]; total: number }> {
  try {
    const res = await fetch(`${baseUrl}/api/blog?limit=${limit}&page=1`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const data = await res.json();

    return {
      blogs: data.data ?? [],
      total: data.pagination?.total ?? data.data?.length ?? 0,
    };
  } catch (error) {
    console.error("Failed to load blog snapshot", error);
    return { blogs: [], total: 0 };
  }
}

export default async function BlogDashboardPage() {
  const { blogs, total } = await getBlogSnapshot();

  return <BlogDashboardContent initialBlogs={blogs} total={total} />;
}

import BlogDashboardContent from "@/components/dashboard/content/BlogDashboardContent";
import { getBlogPage } from "@/lib/dashboard-data";

type BlogPreview = {
  _id?: string;
  subHeading: string;
  heading: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export default async function BlogDashboardPage() {
  const { data: blogs, pagination } = await getBlogPage(1, 10);

  return <BlogDashboardContent initialBlogs={blogs as BlogPreview[]} total={pagination.total} />;
}

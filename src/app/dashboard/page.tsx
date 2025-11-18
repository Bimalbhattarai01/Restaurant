
import DashboardAnalytics from "@/components/dashboard/analytics/DashboardAnalytics";

type MenuPreview = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
};

type BlogPreview = {
  _id: string;
  heading: string;
  subHeading: string;
  description: string;
  image: string;
  createdAt?: string;
};

type ContactPreview = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getMenuSnapshot(limit = 1): Promise<{ menus: MenuPreview[]; total: number }> {
  try {
    const res = await fetch(`${baseUrl}/api/menu?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const data = await res.json();

    return {
      menus: [],
      total: data.pagination?.total ?? data.data?.length ?? 0,
    };
  } catch (error) {
    console.error("Failed to load menu snapshot", error);
    return { menus: [], total: 0 };
  }
}

async function getBlogSnapshot(limit = 1): Promise<{ blogs: BlogPreview[]; total: number }> {
  try {
    const res = await fetch(`${baseUrl}/api/blog?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const data = await res.json();

    return {
      blogs: [],
      total: data.pagination?.total ?? data.data?.length ?? 0,
    };
  } catch (error) {
    console.error("Failed to load blog snapshot", error);
    return { blogs: [], total: 0 };
  }
}

async function getContactSnapshot(): Promise<{ contacts: ContactPreview[]; summary: { total: number; unread: number } }> {
  try {
    const res = await fetch(`${baseUrl}/api/contact?summary=true`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const data = await res.json();

    return {
      contacts: [],
      summary: {
        total: data.summary?.total ?? 0,
        unread: data.summary?.unreadCount ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to load contact snapshot", error);
    return { contacts: [], summary: { total: 0, unread: 0 } };
  }
}

export default async function DashboardPage() {
  const [{ menus, total: menuTotal }, { blogs, total: blogTotal }, { contacts, summary: contactSummary }] = await Promise.all([
    getMenuSnapshot(),
    getBlogSnapshot(),
    getContactSnapshot(),
  ]);

  return (
    <DashboardAnalytics
      menuStats={[]}
      blogStats={[]}
      totals={{ menus: menuTotal, blogs: blogTotal }}
      contactInsights={{ items: contacts, summary: contactSummary }}
    />
  );

}

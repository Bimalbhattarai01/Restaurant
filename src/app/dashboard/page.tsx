import DashboardAnalytics from "@/components/dashboard/analytics/DashboardAnalytics";
import { getBlogCount, getContactSummary, getMenuCount } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const [menuTotal, blogTotal, contactSummary] = await Promise.all([
    getMenuCount(),
    getBlogCount(),
    getContactSummary(),
  ]);

  return (
    <DashboardAnalytics
      menuStats={[]}
      blogStats={[]}
      totals={{ menus: menuTotal, blogs: blogTotal }}
      contactInsights={{ items: [], summary: contactSummary }}
    />
  );

}

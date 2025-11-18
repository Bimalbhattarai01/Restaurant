import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import NotificationCard from "@/components/dashboard/cards/NotificationCard";
import { BookOpen, Inbox, UtensilsCrossed } from "lucide-react";

type GraphDatum = {
  label: string;
  value: number;
};

type ContactInsight = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
};

type DashboardAnalyticsProps = {
  menuStats: GraphDatum[];
  blogStats: GraphDatum[];
  totals: {
    menus: number;
    blogs: number;
  };
  contactInsights: {
    items: ContactInsight[];
    summary: {
      total: number;
      unread: number;
    };
  };
};

export default function DashboardAnalytics({ menuStats, blogStats, totals, contactInsights }: DashboardAnalyticsProps) {
  return (
    <div className="min-h-screen bg-[#F6FAFD] p-6 space-y-6">
      <AdminCard height="h-[180px]" message="Snapshot of your restaurant presence." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Items in Menu"
          value={totals.menus}
          icon={<UtensilsCrossed size={32} />}
          gradientFrom="#BF1E2E"
          gradientTo="#F78361"
        />
        <StatCard
          label="Blog Stories"
          value={totals.blogs}
          icon={<BookOpen size={32} />}
          gradientFrom="#3023AE"
          gradientTo="#C86DD7"
        />
        <StatCard
          label="Contact Leads"
          value={contactInsights.summary.total}
          icon={<Inbox size={32} />}
          gradientFrom="#2F80ED"
          gradientTo="#56CCF2"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        <AnalyticsCard
          title="Menu Distribution"
          subtitle="Category wise dishes"
          data={menuStats}
          emptyState="No menu data to visualize."
          accentFrom="#BF1E2E"
          accentTo="#F7B42C"
        />
        <NotificationCard items={contactInsights.items.slice(0, 6)} summary={{ total: contactInsights.summary.total, unread: contactInsights.summary.unread }} />
      </div>

      <AnalyticsCard
        title="Blog Publishing"
        subtitle="Posts per month"
        data={blogStats}
        emptyState="No blog entries yet."
        accentFrom="#3023AE"
        accentTo="#53A0FD"
      />
    </div>
  );
}

type AnalyticsCardProps = {
  title: string;
  subtitle: string;
  data: GraphDatum[];
  emptyState: string;
  accentFrom: string;
  accentTo: string;
};

function AnalyticsCard({ title, subtitle, data, emptyState, accentFrom, accentTo }: AnalyticsCardProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">{subtitle}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">{title}</h3>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500">{emptyState}</p>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium text-gray-600">
                <span>{item.label}</span>
                <span className="text-gray-900 font-semibold">{item.value}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

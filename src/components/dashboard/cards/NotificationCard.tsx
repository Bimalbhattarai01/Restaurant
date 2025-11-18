import { Inbox, MessageCircle, Mail } from "lucide-react";
import type { ContactTableItem } from "@/components/dashboard/tables/ContactTable";

interface NotificationCardProps {
  items: ContactTableItem[];
  title?: string;
  summary?: {
    total: number;
    unread: number;
  };
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationCard({ items, title = "Recent Inquiries", summary }: NotificationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF2F3] flex items-center justify-center text-[#BF1E2E]">
            <Inbox size={22} />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#2E2E2E]">{title}</p>
            <p className="text-sm text-gray-500">{items.length > 0 ? "Stay on top of new leads" : "You're all caught up"}</p>
          </div>
        </div>
        {summary && (
          <div className="text-right">
            <p className="text-[22px] font-bold text-[#BF1E2E]">{summary.unread}</p>
            <p className="text-xs uppercase tracking-wide text-gray-400">Unread</p>
          </div>
        )}
      </div>

      {summary && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-100 p-3 flex items-center gap-3 bg-[#FFF8F8]">
            <MessageCircle className="text-[#BF1E2E]" size={18} />
            <div>
              <p className="text-sm font-semibold text-[#2E2E2E]">{summary.total}</p>
              <p className="text-xs text-gray-500">Total Messages</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-3 flex items-center gap-3">
            <Mail className="text-[#BF1E2E]" size={18} />
            <div>
              <p className="text-sm font-semibold text-[#2E2E2E]">{summary.unread}</p>
              <p className="text-xs text-gray-500">Awaiting Reply</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Latest</p>
      </div>

      <div className="mt-3 space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No contact messages yet.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="border border-gray-100 rounded-xl p-4 hover:border-[#F4C7CB] transition">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#BF1E2E]">{item.name}</span>
                <span className="text-gray-400">{formatDate(item.createdAt)}</span>
              </div>
              <p className="text-xs text-gray-500">{item.email}</p>
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

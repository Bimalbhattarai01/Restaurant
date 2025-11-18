"use client";
import { useEffect } from "react";

export interface ContactTableItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  reservationDate?: string;
  reservationTime?: string;
  createdAt?: string;
  isRead?: boolean;
}

interface ContactTableProps {
  data: ContactTableItem[];
  page?: number;
  pageSize?: number;
  pageCount?: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export default function ContactTable({
  data,
  page = 1,
  pageSize = 10,
  pageCount = 1,
  loading = false,
  onPageChange,
}: ContactTableProps) {
  useEffect(() => {
    const unreadIds = data.filter((item) => !item.isRead).map((item) => item._id);
    if (unreadIds.length === 0) return;

    const markAsRead = async () => {
      try {
        await fetch("/api/contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: unreadIds }),
        });
      } catch (error) {
        console.error("Failed to mark contacts as read:", error);
      }
    };

    markAsRead();
  }, [data]);

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <h2 className="text-[26px] font-semibold text-[#2E2E2E] mb-4">
        Contact <span className="text-[#BF1E2E] italic font-greatvibes">List</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 text-[#BF1E2E]">
              <th className="py-3 px-4 font-semibold">S.No</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Subject</th>
              <th className="py-3 px-4 font-semibold">Phone</th>
              <th className="py-3 px-4 font-semibold">Message</th>
              <th className="py-3 px-4 font-semibold">Preferred Date</th>
              <th className="py-3 px-4 font-semibold">Submitted</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  Loading contact messages...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500 italic text-[15px]">
                  No contact messages available
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item._id} className="hover:bg-[#FFF5F5] transition duration-200 border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">{(page - 1) * pageSize + index + 1}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.email}</td>
                  <td className="py-3 px-4 text-gray-600">{item.subject || "—"}</td>
                  <td className="py-3 px-4 text-gray-600">{item.phone || "—"}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-[250px] truncate">{item.message}</td>
                  <td className="py-3 px-4 text-gray-600">{item.reservationDate ? `${formatDate(item.reservationDate)} ${item.reservationTime || ""}` : "—"}</td>
                  <td className="py-3 px-4 text-gray-500 text-[14px]">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
        <p className="text-sm text-gray-500">
          Page {page} of {pageCount || 1}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            disabled={page <= 1 || loading}
            className="w-[80px] h-[34px] rounded-md border border-gray-300 flex items-center justify-center text-sm hover:bg-[#BF1E2E] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= pageCount || loading}
            className="w-[80px] h-[34px] rounded-md border border-gray-300 flex items-center justify-center text-sm hover:bg-[#BF1E2E] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

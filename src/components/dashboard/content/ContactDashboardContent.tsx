"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/dashboard/layout/SearchBar";
import AdminCard from "@/components/dashboard/cards/AdminCard";
import StatCard from "@/components/dashboard/cards/StatCard";
import NotificationCard from "@/components/dashboard/cards/NotificationCard";
import ContactTable, { ContactTableItem } from "@/components/dashboard/tables/ContactTable";
import { FileText, Inbox } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type ContactDashboardContentProps = {
  initialContacts: ContactTableItem[];
  initialTotal: number;
  initialUnread: number;
  initialPage?: number;
  initialPages?: number;
};

export default function ContactDashboardContent({
  initialContacts,
  initialTotal,
  initialUnread,
  initialPage = 1,
  initialPages,
}: ContactDashboardContentProps) {
  const pageSize = useMemo(() => 10, []);
  const [contacts, setContacts] = useState<ContactTableItem[]>(initialContacts);
  const [total, setTotal] = useState(initialTotal);
  const [unread, setUnread] = useState(initialUnread);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(initialPages ?? Math.max(1, Math.ceil(initialTotal / pageSize)));
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm);
  const [loading, setLoading] = useState(initialContacts.length === 0);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchContacts = useCallback(
    async (pageToFetch: number, signal?: AbortSignal, showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        const params = new URLSearchParams({
          limit: pageSize.toString(),
          page: pageToFetch.toString(),
        });
        if (debouncedSearch.trim()) {
          params.set("search", debouncedSearch.trim());
        }
        const res = await fetch(`/api/contact?${params.toString()}`, { cache: "no-store", signal });
        const data = await res.json();
        if (data.success) {
          setContacts(data.data ?? []);
          const nextTotal = data.pagination?.total ?? data.data?.length ?? 0;
          setTotal(nextTotal);
          setPageCount(data.pagination?.pages ?? Math.max(1, Math.ceil(nextTotal / pageSize)));
          setUnread(data.summary?.unreadCount ?? initialUnread);
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Contact fetch failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, pageSize, initialUnread]
  );

  useEffect(() => {
    const controller = new AbortController();
    const hasSearch = Boolean(debouncedSearch.trim());
    const shouldFetch = hasSearch || initialContacts.length === 0 || page !== initialPage;
    if (shouldFetch) {
      fetchContacts(page, controller.signal, true);
    } else {
      setContacts(initialContacts);
      setTotal(initialTotal);
      setUnread(initialUnread);
      setPageCount(initialPages ?? Math.max(1, Math.ceil(initialTotal / pageSize)));
      setLoading(false);
    }
    return () => controller.abort();
  }, [debouncedSearch, fetchContacts, initialContacts, initialPage, initialPages, initialTotal, initialUnread, page, pageSize]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6FAFD] p-6">
      <div className="flex items-center justify-between mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search contacts..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="p-0 lg:p-0">
          <ContactTable
            data={contacts}
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            loading={loading}
            onPageChange={setPage}
          />
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Admin" message="Have a great day ahead.." height="h-[160px]" />
          <StatCard icon={<FileText />} value={total} label="Contact Submissions" />
          <StatCard icon={<Inbox />} value={unread} label="New Messages" />
          <NotificationCard items={contacts.slice(0, 5)} summary={{ total, unread }} />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Bell, MessageSquareText, Loader2 } from "lucide-react";
import type { ContactTableItem } from "@/components/dashboard/tables/ContactTable";

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

let cachedUnreadContacts: number | null = null;
let cachedUnreadFetchedAt = 0;
let unreadFetchInFlight: Promise<number> | null = null;

async function fetchUnreadSummary() {
  const now = Date.now();
  if (cachedUnreadContacts !== null && now - cachedUnreadFetchedAt < 15_000) {
    return cachedUnreadContacts;
  }

  if (unreadFetchInFlight) {
    return unreadFetchInFlight;
  }

  unreadFetchInFlight = (async () => {
    const res = await fetch("/api/contact?summary=true", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch summary");
    const data = await res.json();
    const unread = data.summary?.unreadCount ?? 0;
    cachedUnreadContacts = unread;
    cachedUnreadFetchedAt = Date.now();
    return unread;
  })();

  try {
    return await unreadFetchInFlight;
  } finally {
    unreadFetchInFlight = null;
  }
}

export default function SearchBar({ value, placeholder = "Search...", onChange }: SearchBarProps) {
  const isControlled = useMemo(() => value !== undefined, [value]);
  const [internalValue, setInternalValue] = useState("");
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [notifications, setNotifications] = useState<ContactTableItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const displayValue = isControlled ? value! : internalValue;

  const handleChange = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  useEffect(() => {
    let ignore = false;

    const fetchSummary = async () => {
      try {
        const unread = await fetchUnreadSummary();
        if (!ignore) {
          setUnreadContacts(unread);
        }
      } catch (error) {
        console.error("Contact summary fetch failed:", error);
      }
    };

    fetchSummary();
    const timer = setInterval(fetchSummary, 60_000);

    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!isPopoverOpen) return;
    const handler = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isPopoverOpen]);

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    setNotificationError(null);
    try {
      const res = await fetch("/api/contact?limit=5", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load notifications");
      }
      const data = await res.json();
      setNotifications(data.data ?? []);
      setUnreadContacts(data.summary?.unreadCount ?? 0);
      cachedUnreadContacts = data.summary?.unreadCount ?? 0;
      cachedUnreadFetchedAt = Date.now();

      const unreadIds: string[] = (data.data ?? []).filter((item: ContactTableItem) => !item.isRead).map((item: ContactTableItem) => item._id);
      if (unreadIds.length > 0) {
        await fetch("/api/contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: unreadIds }),
        });
        setUnreadContacts((prev) => {
          const next = Math.max(0, prev - unreadIds.length);
          cachedUnreadContacts = next;
          cachedUnreadFetchedAt = Date.now();
          return next;
        });
      }
    } catch (error) {
      console.error(error);
      setNotificationError(error instanceof Error ? error.message : "Unable to fetch notifications");
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleNotificationToggle = () => {
    setIsPopoverOpen((prev) => {
      const next = !prev;
      if (next) {
        fetchNotifications();
      }
      return next;
    });
  };

  const formatTimestamp = (value?: string) => {
    if (!value) return "Just now";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Search Box */}
      <div className="flex items-center bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md">
        <div className="bg-[#BF1E2E] p-3 flex items-center justify-center rounded-l-xl">
          <Search className="text-white w-5 h-5" strokeWidth={2.5} />
        </div>

        <input
          type="text"
          value={displayValue}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 text-[#7C6F6F] placeholder-[#7C6F6F] text-[15px] outline-none bg-transparent"
        />
      </div>

      {/* Notification Buttons */}
      <div className="flex items-center gap-3 ml-4">
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={handleNotificationToggle}
            className="bg-[#BF1E2E] w-[45px] h-[45px] flex items-center justify-center rounded-[8px] shadow-md hover:scale-105 transition-all duration-200"
            aria-label="Open notifications"
          >
            <MessageSquareText size={22} className="text-white" strokeWidth={2.2} />
          </button>
          {unreadContacts > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-[#BF1E2E] text-[11px] font-semibold rounded-full min-w-[22px] px-1.5 py-0.5 flex items-center justify-center">
              {unreadContacts > 99 ? "99+" : unreadContacts}
            </span>
          )}
          {isPopoverOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-[#2E2E2E]">Recent Inquiries</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsPopoverOpen(false);
                  }}
                  className="text-xs text-[#BF1E2E] font-semibold hover:underline"
                >
                  Close
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {isLoadingNotifications ? (
                  <div className="flex items-center justify-center py-6 text-[#BF1E2E]/70 gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Loading...</span>
                  </div>
                ) : notificationError ? (
                  <div className="px-4 py-6 text-center text-sm text-red-500">{notificationError}</div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">No recent inquiries</div>
                ) : (
                  notifications.map((item) => (
                    <div key={item._id} className="px-4 py-3 border-b border-gray-50 last:border-b-0">
                      <p className="text-sm font-semibold text-[#2E2E2E]">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.email}</p>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.message}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">{formatTimestamp(item.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="bg-[#C64A53] w-[45px] h-[45px] flex items-center justify-center rounded-[8px] shadow-md hover:scale-105 transition-all duration-200">
          <Bell size={22} className="text-white" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

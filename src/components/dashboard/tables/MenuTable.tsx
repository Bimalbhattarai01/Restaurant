"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCcw, Plus } from "lucide-react";
import MenuRow from "./MenuRow";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
}

interface MenuTableProps {
  initialMenus?: MenuItem[];
  searchTerm?: string;
  onCountChange?: (count: number) => void;
  initialTotal?: number;
}

export default function MenuTable({ initialMenus = [], searchTerm = "", onCountChange, initialTotal }: MenuTableProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenus);
  const [loading, setLoading] = useState(initialMenus.length === 0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(() => {
    if (initialTotal !== undefined) return Math.max(1, Math.ceil(initialTotal / 10));
    return Math.max(1, Math.ceil(initialMenus.length / 10));
  });

  const limit = useMemo(() => 10, []);

  const buildEndpoint = useCallback(
    (search = "", pageParam = 1) => {
      const params = new URLSearchParams({ limit: limit.toString(), page: pageParam.toString() });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      return `/api/menu?${params.toString()}`;
    },
    [limit]
  );

  const fetchMenus = useCallback(
    async (showLoader = true, signal?: AbortSignal, search = "", pageParam = 1) => {
      try {
        if (showLoader) setLoading(true);
        const endpoint = buildEndpoint(search, pageParam);
        const res = await fetch(endpoint, { cache: "no-store", signal });
        const data = await res.json();
        if (data.success) {
          setMenuItems(data.data);
          setTotalPages(data.pagination?.pages ?? 1);
          if (onCountChange) {
            const total = data.pagination?.total ?? data.data?.length ?? 0;
            onCountChange(total);
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    },
    [buildEndpoint, onCountChange]
  );

  useEffect(() => {
    if (searchTerm.trim() === "") return;
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    const hasSearch = Boolean(searchTerm.trim());
    const shouldFetch = hasSearch || initialMenus.length === 0 || page !== 1;

    if (shouldFetch) {
      fetchMenus(true, controller.signal, searchTerm, page);
      return () => controller.abort();
    }

    setMenuItems(initialMenus);
    setLoading(false);
    setTotalPages(Math.max(1, Math.ceil((initialTotal ?? initialMenus.length) / limit)));
    if (onCountChange) {
      onCountChange(initialTotal ?? initialMenus.length);
    }

    return () => controller.abort();
  }, [fetchMenus, initialMenus, searchTerm, onCountChange, initialTotal, page, limit]);

  useEffect(() => {
    if (initialMenus.length) {
      setMenuItems(initialMenus);
      setLoading(false);
    }

    if (onCountChange) {
      if (initialTotal !== undefined) {
        onCountChange(initialTotal);
      } else {
        onCountChange(initialMenus.length);
      }
    }
    setTotalPages(Math.max(1, Math.ceil((initialTotal ?? initialMenus.length) / limit)));
  }, [initialMenus, onCountChange, initialTotal, limit]);

  const handleDataChange = () => {
    fetchMenus(false, undefined, searchTerm, page);
  };

  const handleRefresh = () => {
    fetchMenus(true, undefined, searchTerm, page);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages || 1));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-[0.3em]">Menu List</p>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Menu <span className="text-[#BF1E2E] font-greatvibes text-[34px]">List</span>
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
          <Link
            href="/dashboard/menu/add"
            className="inline-flex items-center gap-2 bg-[#BF1E2E] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#a81828]"
          >
            <Plus size={16} /> Add Menu
          </Link>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500 py-4">Loading menus...</p>}

      <div className="grid grid-cols-[40px_70px_1fr_100px_100px_150px] items-center gap-4 pb-3 border-b border-gray-300 text-sm font-semibold text-gray-700">
        <p>#</p>
        <p>Image</p>
        <p>Name / Description</p>
        <p>Price</p>
        <p>Category</p>
        <p>Actions</p>
      </div>

      {/* Rows */}
      <div>
        {menuItems.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No menus available.</p>
        ) : (
          menuItems.map((item, index) => (
            <MenuRow key={item._id} item={{ ...item, id: (page - 1) * limit + index + 1 }} onDelete={handleDataChange} />
          ))
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages || 1}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="px-3 py-2 rounded-md bg-[#BF1E2E] text-white text-sm font-semibold hover:bg-[#a81828] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

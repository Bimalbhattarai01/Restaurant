"use client";

import { useCallback, useEffect, useState } from "react";
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

  const buildEndpoint = useCallback(
    (search = "") => {
      const params = new URLSearchParams({ limit: "50" });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      return `/api/menu?${params.toString()}`;
    },
    []
  );

  const fetchMenus = useCallback(
    async (showLoader = true, signal?: AbortSignal, search = "") => {
      try {
        if (showLoader) setLoading(true);
        const endpoint = buildEndpoint(search);
        const res = await fetch(endpoint, { cache: "no-store", signal });
        const data = await res.json();
        if (data.success) {
          setMenuItems(data.data);
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
    const controller = new AbortController();
    const hasSearch = Boolean(searchTerm.trim());
    if (hasSearch || initialMenus.length === 0) {
      fetchMenus(true, controller.signal, searchTerm);
    } else {
      setMenuItems(initialMenus);
      setLoading(false);
      if (onCountChange) {
        onCountChange(initialTotal ?? initialMenus.length);
      }
    }
    return () => controller.abort();
  }, [fetchMenus, initialMenus, searchTerm, onCountChange, initialTotal]);

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
  }, [initialMenus, onCountChange, initialTotal]);

  const handleDataChange = () => {
    fetchMenus(false, undefined, searchTerm);
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading menus...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Menu <span className="text-[#BF1E2E] font-greatvibes text-[34px]">List</span>
      </h1>

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
          menuItems.map((item, index) => <MenuRow key={item._id} item={{ ...item, id: index + 1 }} onDelete={handleDataChange} />)
        )}
      </div>
    </div>
  );
}

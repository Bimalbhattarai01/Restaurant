"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, RefreshCcw, Plus } from "lucide-react";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast";
import ActionButton from "./ActionButton";
import ConfirmDialog from "./ConfirmDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BlogData } from "./BlogForm";

const BLOG_BASE_ENDPOINT = "/api/blog";

interface BlogTableProps {
  refreshKey?: number;
  initialBlogs?: BlogData[];
  searchTerm?: string;
  onCountChange?: (count: number) => void;
  initialTotal?: number;
}

export default function BlogTable({
  refreshKey = 0,
  initialBlogs = [],
  searchTerm = "",
  onCountChange,
  initialTotal,
}: BlogTableProps) {
  const [blogs, setBlogs] = useState<BlogData[]>(initialBlogs);
  const [loading, setLoading] = useState(initialBlogs.length === 0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();

  const formatDate = (value?: string) => {
    if (!value) return "Draft";
    return new Date(value).toLocaleDateString();
  };

  const buildEndpoint = useCallback((search = "") => {
    const params = new URLSearchParams({ limit: "50" });
    if (search.trim()) {
      params.set("search", search.trim());
    }
    return `${BLOG_BASE_ENDPOINT}?${params.toString()}`;
  }, []);

  const fetchBlogs = useCallback(
    async (showLoader = true, signal?: AbortSignal, search = "") => {
      try {
        if (showLoader) setLoading(true);
        const endpoint = buildEndpoint(search);
        const res = await fetch(endpoint, { cache: "no-store", signal });
        const data = await res.json();
        if (data.success) {
          setBlogs(data.data);
          if (onCountChange) {
            const total = data.pagination?.total ?? data.data?.length ?? 0;
            onCountChange(total);
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Error fetching blogs", error);
      } finally {
        setLoading(false);
      }
    },
    [buildEndpoint, onCountChange]
  );

  useEffect(() => {
    const controller = new AbortController();
    const hasSearch = Boolean(searchTerm.trim());
    const shouldShowLoader = initialBlogs.length === 0 || refreshKey !== 0 || hasSearch;
    if (hasSearch || initialBlogs.length === 0 || refreshKey !== 0) {
      fetchBlogs(shouldShowLoader, controller.signal, searchTerm);
    } else {
      setBlogs(initialBlogs);
      setLoading(false);
      if (onCountChange) {
        onCountChange(initialTotal ?? initialBlogs.length);
      }
    }
    return () => controller.abort();
  }, [fetchBlogs, refreshKey, initialBlogs, searchTerm, onCountChange, initialTotal]);

  useEffect(() => {
    if (initialBlogs.length) {
      setBlogs(initialBlogs);
      setLoading(false);
    }

    if (onCountChange) {
      if (initialTotal !== undefined) {
        onCountChange(initialTotal);
      } else {
        onCountChange(initialBlogs.length);
      }
    }
  }, [initialBlogs, onCountChange, initialTotal]);

  const handleDelete = async () => {
    if (!confirmId) return;
    const toastId = toast.loading("Deleting blog...");

    try {
      const res = await fetch(`/api/blog/${confirmId}`, { method: "DELETE" });
      const data = await res.json();
      toast.dismiss(toastId);

      if (data.success) {
        toast.custom((t) => <CustomToast id={t.id} message="Blog deleted" type="success" buttonLabel="OK" />);
        setConfirmId(null);
        fetchBlogs(true, undefined, searchTerm);
      } else {
        toast.custom((t) => (
          <CustomToast id={t.id} message={data.message || "Failed to delete blog"} type="error" buttonLabel="RETRY" />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.custom((t) => <CustomToast id={t.id} message="Something went wrong" type="error" />);
    }
  };

  const handleRefresh = () => {
    fetchBlogs(true, undefined, searchTerm);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <ConfirmDialog
        open={Boolean(confirmId)}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        title="Delete Blog?"
        message="This action cannot be undone."
      />

      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-[0.3em]">Blog List</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Recent Posts</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900" type="button">
              <RefreshCcw size={16} /> Refresh
            </button>
            <Link
              href="/dashboard/blog/add"
              className="inline-flex items-center gap-2 bg-[#BF1E2E] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#A81826]"
            >
              <Plus size={16} /> Add Vlog
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found. Create one to get started.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="w-full md:w-48 h-40 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={blog.image || "/placeholder.jpg"} alt={blog.heading} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#BF1E2E]">{blog.subHeading}</p>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-2">{blog.heading}</h3>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">{blog.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-auto">
                  <ActionButton
                    icon={Pencil}
                    label="Edit"
                    color="green"
                    onClick={() => router.push(`/dashboard/blog/edit/${blog._id}`)}
                  />
                  <ActionButton icon={Trash2} label="Delete" color="red" onClick={() => setConfirmId(blog._id!)} />
                  <span className="text-xs text-gray-400 mt-1 text-right">Updated {formatDate(blog.updatedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

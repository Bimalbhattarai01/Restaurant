"use client";

import { useRouter } from "next/navigation";
import BlogForm, { BlogData } from "./BlogForm";

interface BlogFormScreenProps {
  blog?: BlogData | null;
  mode?: "create" | "edit";
  redirectPath?: string;
  redirectOnSuccess?: boolean;
}

export default function BlogFormScreen({
  blog = null,
  mode = "create",
  redirectPath = "/dashboard/blog",
  redirectOnSuccess,
}: BlogFormScreenProps) {
  const router = useRouter();
  const shouldRedirect = redirectOnSuccess ?? mode === "edit";

  const handleSuccess = () => {
    if (shouldRedirect) {
      router.push(redirectPath);
    }
  };

  const handleCancel = () => {
    router.push(redirectPath);
  };

  return (
    <BlogForm
      blog={blog ?? undefined}
      mode={mode}
      onSuccess={handleSuccess}
      onCancel={mode === "edit" ? handleCancel : undefined}
    />
  );
}

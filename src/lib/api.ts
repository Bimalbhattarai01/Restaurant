export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function getMenus(page = 1, limit = 5) {
  const res = await fetch(`${BASE_URL}/api/menu?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });
  return res.json();
}

interface MenuPayload {
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

export async function createMenu(data: MenuPayload) {
  const res = await fetch(`${BASE_URL}/api/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function uploadMenuWithImage(formData: FormData) {
  const res = await fetch(`${BASE_URL}/api/menu/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function deleteMenu(id: string) {
  const res = await fetch(`${BASE_URL}/api/menu/${id}`, { method: "DELETE" });
  return res.json();
}

export async function getBlogs(params: { page?: number; limit?: number; search?: string } = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(`${BASE_URL}/api/blog${query ? `?${query}` : ""}`, { cache: "no-store" });
  return res.json();
}

export async function createBlog(formData: FormData) {
  const res = await fetch(`${BASE_URL}/api/blog`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function updateBlog(id: string, formData: FormData) {
  const res = await fetch(`${BASE_URL}/api/blog/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.json();
}

export async function deleteBlog(id: string) {
  const res = await fetch(`${BASE_URL}/api/blog/${id}`, { method: "DELETE" });
  return res.json();
}

export async function getBlogById(id: string) {
  const res = await fetch(`${BASE_URL}/api/blog/${id}`, { cache: "no-store" });
  return res.json();
}

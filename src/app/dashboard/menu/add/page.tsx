import AddMenuPageContent from "@/components/dashboard/content/AddMenuPageContent";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getMenuCount(): Promise<number> {
  try {
    const res = await fetch(`${baseUrl}/api/menu?limit=1`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load menu count (${res.status})`);
    const data = await res.json();
    return data.pagination?.total ?? data.data?.length ?? 0;
  } catch (error) {
    console.error("Failed to fetch menu count", error);
    return 0;
  }
}

export default async function AddMenuPage() {
  const initialCount = await getMenuCount();
  return <AddMenuPageContent initialCount={initialCount} />;
}

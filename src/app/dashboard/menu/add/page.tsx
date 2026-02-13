import AddMenuPageContent from "@/components/dashboard/content/AddMenuPageContent";
import { getMenuCount } from "@/lib/dashboard-data";

export default async function AddMenuPage() {
  const initialCount = await getMenuCount();
  return <AddMenuPageContent initialCount={initialCount} />;
}

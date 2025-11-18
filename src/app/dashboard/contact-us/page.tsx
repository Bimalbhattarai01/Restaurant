import ContactDashboardContent from "@/components/dashboard/content/ContactDashboardContent";
import { ContactTableItem } from "@/components/dashboard/tables/ContactTable";

interface ContactResponse {
  success: boolean;
  data: ContactTableItem[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  summary?: {
    total: number;
    unreadCount: number;
  };
}

async function getContacts(): Promise<ContactResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/contact?page=1&limit=10`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch contacts: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Contact fetch failed:", error);
    return null;
  }
}

export default async function ContactPage() {
  const response = await getContacts();
  const contacts = response?.data ?? [];
  const totalContacts = response?.summary?.total ?? contacts.length;
  const unreadContacts = response?.summary?.unreadCount ?? 0;
  const pageCount = response?.pagination?.pages ?? Math.max(1, Math.ceil(totalContacts / 10));
  const currentPage = response?.pagination?.page ?? 1;

  return (
    <ContactDashboardContent
      initialContacts={contacts}
      initialTotal={totalContacts}
      initialUnread={unreadContacts}
      initialPages={pageCount}
      initialPage={currentPage}
    />
  );
}

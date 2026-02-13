import ContactDashboardContent from "@/components/dashboard/content/ContactDashboardContent";
import { ContactTableItem } from "@/components/dashboard/tables/ContactTable";
import { getContactPage } from "@/lib/dashboard-data";

export default async function ContactPage() {
  const response = await getContactPage(1, 10);
  const contacts = response.data ?? [];
  const totalContacts = response.summary?.total ?? contacts.length;
  const unreadContacts = response.summary?.unreadCount ?? 0;
  const pageCount = response.pagination?.pages ?? Math.max(1, Math.ceil(totalContacts / 10));
  const currentPage = response.pagination?.page ?? 1;

  return (
    <ContactDashboardContent
      initialContacts={contacts as ContactTableItem[]}
      initialTotal={totalContacts}
      initialUnread={unreadContacts}
      initialPages={pageCount}
      initialPage={currentPage}
    />
  );
}

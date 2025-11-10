import SearchBar from "@/components/dashboard/SearchBar";
import AdminCard from "@/components/dashboard/AdminCard";
import StatCard from "@/components/dashboard/StatCard";
import ContactTable from "@/components/dashboard/ContactTable";
import { FileText } from "lucide-react";
const contactData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Inquiry about pricing",
    message: "Hello, I’d like to know more about your packages.",
    date: "2025-11-04",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@gmail.com",
    subject: "Partnership",
    message: "Interested in collaborating for an event.",
    date: "2025-11-03",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6FAFD] p-6">
      <div className="flex items-center justify-between mb-6">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="p-6 bg-[#F6FAFD] min-h-screen">
          <ContactTable data={contactData} />
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard name="Admin" message="Have a great day ahead.." height="h-[180px]" />
          <StatCard icon={<FileText />} value={30} label="Item in Menu" />
        </div>
      </div>
    </div>
  );
}

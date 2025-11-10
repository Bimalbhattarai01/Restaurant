"use client";

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

interface ContactTableProps {
  data: Contact[];
}

export default function ContactTable({ data }: ContactTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <h2 className="text-[26px] font-semibold text-[#2E2E2E] mb-4">
        Contact <span className="text-[#BF1E2E] italic font-greatvibes">List</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 text-[#BF1E2E]">
              <th className="py-3 px-4 font-semibold">S.No</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Subject</th>
              <th className="py-3 px-4 font-semibold">Message</th>
              <th className="py-3 px-4 font-semibold">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500 italic text-[15px]">
                  No contact messages available
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="hover:bg-[#FFF5F5] transition duration-200 border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.email}</td>
                  <td className="py-3 px-4 text-gray-600">{item.subject}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-[250px] truncate">{item.message}</td>
                  <td className="py-3 px-4 text-gray-500 text-[14px]">{item.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-6 gap-2">
        <button className="w-[30px] h-[30px] rounded-md border border-gray-300 flex items-center justify-center hover:bg-[#BF1E2E] hover:text-white transition">
          ‹
        </button>
        <button className="w-[30px] h-[30px] rounded-md border border-gray-300 flex items-center justify-center hover:bg-[#BF1E2E] hover:text-white transition">
          ›
        </button>
      </div>
    </div>
  );
}

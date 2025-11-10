import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background text-foreground min-h-screen">
      <Sidebar />

      <main className="flex-grow ml-64 p-6 overflow-x-hidden">{children}</main>
    </div>
  );
}

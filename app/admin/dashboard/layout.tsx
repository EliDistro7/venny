import Sidebar from "@/components/admin/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-mist min-h-screen">
      <Sidebar />
      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  );
}

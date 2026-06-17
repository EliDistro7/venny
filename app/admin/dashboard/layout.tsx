import Sidebar from "@/components/admin/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-mist min-h-screen">
      <Sidebar />
      {/*
        On mobile the sidebar becomes a fixed top bar (~53px tall).
        pt-[53px] offsets main content so it isn't hidden under that bar.
        On lg+ the sidebar is inline so no offset is needed.
      */}
      <main className="flex-1 px-4 py-6 pt-19.25 lg:pt-8 lg:px-10 lg:py-8">
        {children}
      </main>
    </div>
  );
}
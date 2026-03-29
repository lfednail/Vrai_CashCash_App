import TechnicianSidebar from "@/components/ui/technician-sidebar";
import TechnicianHeader from "@/components/ui/technician-header";

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top Header */}
      <TechnicianHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <TechnicianSidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

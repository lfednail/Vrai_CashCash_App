import GestionnaireSidebar from "@/components/ui/gestionnaire-sidebar";
import TechnicianHeader from "@/components/ui/technician-header";

export default function GestionnaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 selection:bg-blue-100">
      {/* Sidebar - Fixe à gauche */}
      <div className="hidden md:block">
        <GestionnaireSidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Fixe en haut */}
        <TechnicianHeader />

        {/* Zone de contenu scrollable */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

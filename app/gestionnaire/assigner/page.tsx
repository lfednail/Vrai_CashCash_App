    import { getClientsWithMaterials, getTechniciansByAgency } from "@/app/actions/gestionnaire.actions";
import AssignationForm from "@/app/gestionnaire/assigner/assignation-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AssignationPage() {
  const clients = await getClientsWithMaterials();
  const technicians = await getTechniciansByAgency();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
        <Link href="/gestionnaire" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-2 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nouvelle Intervention</h1>
          <p className="text-slate-500 mt-1">Assignez un technicien à une mission de maintenance</p>
        </header>

        <AssignationForm clients={clients} technicians={technicians} />
    </div>
  );
}

import { getTechnicianInterventions } from "@/app/actions/intervention.actions";
import TechnicianInterventionsList from "@/components/ui/technician-interventions-list";

export default async function InterventionsListPage() {
  const interventions = await getTechnicianInterventions();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Toutes mes interventions</h1>
          <p className="text-slate-500 mt-1">Historique complet et planning de vos missions de maintenance.</p>
        </div>
      </div>

      <TechnicianInterventionsList initialInterventions={interventions} />
    </div>
  );
}

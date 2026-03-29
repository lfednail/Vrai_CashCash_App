import { CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { getTechnicianInterventions } from "@/app/actions/intervention.actions";

export default async function ValiderInterventionPage() {
  const allInterventions = await getTechnicianInterventions();
  
  // Only keep pending ones
  const isPending = (i: any) => i.controles.length === 0 || i.controles.some((c: any) => c.tempsPasse === null);
  const interventions = allInterventions.filter(isPending);
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Valider une intervention</h1>
        <p className="text-slate-500 mt-1">Interventions en attente de clôture ou de rapport final.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {interventions.map((intervention) => (
          <div key={intervention.numeroIntervent} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center p-2 rounded-lg bg-orange-50 text-orange-600">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">#INT-{String(intervention.numeroIntervent).padStart(3, '0')}</h3>
                  <p className="text-xs text-slate-500">{intervention.client.raisonSociale}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">En attente</span>
            </div>
            
            <div className="space-y-3 mb-6 flex-1 text-sm text-slate-600 mt-2">
               <p><strong>Date: </strong>{new Date(intervention.dateVisite).toLocaleDateString("fr-FR")}</p>
               <p><strong>Matériels concernés: </strong>{intervention.controles.length}</p>
               <p><strong>Adresse: </strong>{intervention.client.adresse}</p>
            </div>
            
            <Link 
              href={`/technicien/interventions/${intervention.numeroIntervent}`}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              <CheckCircle className="h-4 w-4" /> Passer à la validation
            </Link>
          </div>
        ))}

        {interventions.length === 0 && (
          <div className="col-span-full border border-dashed border-slate-300 rounded-xl bg-white p-12 text-center">
            <div className="mx-auto h-16 w-16 mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Aucune intervention en attente</h3>
            <p className="mt-1 text-slate-500">Tout est à jour, bon travail !</p>
          </div>
        )}
      </div>
    </div>
  );
}

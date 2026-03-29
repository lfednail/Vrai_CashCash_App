import { FileText, CheckCircle2 } from "lucide-react";
import { getTechnicianInterventions } from "@/app/actions/intervention.actions";
import DownloadPDFButton from "@/components/ui/download-pdf-button";

export default async function ReportsPage() {
  const allInterventions = await getTechnicianInterventions();

  // PDF is only available for fully validated interventions
  const isValidated = (i: any) => i.controles.length > 0 && i.controles.every((c: any) => c.tempsPasse !== null);
  const interventions = allInterventions.filter(isValidated);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Générer les PDF d'intervention</h1>
        <p className="text-slate-500 mt-1">Générez et téléchargez les fiches d'intervention techniques validées et signées.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" /> Fiches techniques disponibles
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
            {interventions.length} document(s)
          </span>
        </div>
        
        <ul className="divide-y divide-slate-100">
          {interventions.map((intervention) => (
            <li key={intervention.numeroIntervent} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                 <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                   <CheckCircle2 className="h-5 w-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900">Fiche Technique - #INT-{String(intervention.numeroIntervent).padStart(3, '0')}</h3>
                   <p className="text-sm text-slate-500">{intervention.client.raisonSociale} • Réalisée le {new Date(intervention.dateVisite).toLocaleDateString("fr-FR")}</p>
                 </div>
              </div>
              
              <DownloadPDFButton intervention={intervention} />
            </li>
          ))}

          {interventions.length === 0 && (
             <li className="p-12 text-center">
                <div className="mx-auto h-12 w-12 text-slate-300 mb-4">
                  <FileText className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Aucun document disponible</h3>
                <p className="text-slate-500 mt-1">Vous n'avez pas encore validé d'interventions.</p>
             </li>
          )}
        </ul>
      </div>
    </div>
  );
}

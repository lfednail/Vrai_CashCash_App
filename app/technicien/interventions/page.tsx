import prisma from "@/lib/prisma";
import { getTechnicianInterventions } from "@/app/actions/intervention.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CalendarDays, MapPin, Clock, Search, Filter, Eye, Edit, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function InterventionsListPage() {
  const session = await getServerSession(authOptions);
  const interventions = await getTechnicianInterventions();

  const isPending = (i: any) => i.controles.length === 0 || i.controles.some((c: any) => c.tempsPasse === null);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Toutes mes interventions</h1>
          <p className="text-slate-500 mt-1">Historique complet et planning de vos missions de maintenance.</p>
        </div>
        <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="h-4 w-4" /> Filtrer
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-xs text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-5">Client & ID</th>
                <th className="px-6 py-5">Localisation</th>
                <th className="px-6 py-5">Date & Heure</th>
                <th className="px-6 py-5">Matériels</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interventions.map((intervention) => {
                const pending = isPending(intervention);
                const date = new Date(intervention.dateVisite);
                
                return (
                  <tr key={intervention.numeroIntervent} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="font-bold text-slate-900">{intervention.client.raisonSociale}</div>
                       <div className="text-[10px] font-mono text-slate-400 mt-0.5">INT-{String(intervention.numeroIntervent).padStart(5, '0')}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{intervention.client.adresse}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-slate-900 font-medium">{date.toLocaleDateString("fr-FR")}</div>
                       <div className="text-xs text-slate-500">{intervention.heureVisite.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                       <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {intervention.controles.length} ÉLÉMENTS
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       {pending ? (
                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-orange-700">
                            <Clock className="h-3 w-3" /> En attente
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> Validée
                         </span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link 
                         href={`/technicien/interventions/${intervention.numeroIntervent}`}
                         className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                       >
                         {pending ? <Edit className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                       </Link>
                    </td>
                  </tr>
                );
              })}

              {interventions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <CalendarDays className="h-12 w-12 text-slate-200" />
                       <p className="text-slate-500 font-medium">Aucune intervention dans votre historique.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { getClientInterventions } from "@/app/actions/gestionnaire.actions";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, CheckCircle2, Clock, MapPin, Building2 } from "lucide-react";
import Link from "next/link";

export default async function ClientHistoriquePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const clientId = parseInt(id);
  if (isNaN(clientId)) notFound();

  const client = await prisma.client.findUnique({ where: { numeroClient: clientId } });
  if (!client) notFound();

  const interventions = await getClientInterventions(clientId);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Link href="/gestionnaire/clients" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour au portefeuille
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Building2 className="h-6 w-6" />
             </div>
             <h1 className="text-3xl font-bold text-slate-900">{client.raisonSociale}</h1>
           </div>
           <p className="text-slate-500 flex items-center gap-2 px-1">
             <MapPin className="h-4 w-4" /> {client.adresse}
           </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Interventions</p>
           <p className="text-2xl font-black text-slate-900">{interventions.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-xs text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-5">ID & Date</th>
                <th className="px-6 py-5">Technicien</th>
                <th className="px-6 py-5">Matériels contrôlés</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interventions.map((int) => {
                const isPending = int.controles.length === 0 || int.controles.some((c: any) => c.tempsPasse === null);
                return (
                  <tr key={int.numeroIntervent} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="font-bold text-slate-900">INT-{String(int.numeroIntervent).padStart(5, '0')}</div>
                       <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(int.dateVisite).toLocaleDateString("fr-FR")}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-700">
                            {int.technicien?.employe.prenomEmploye} {int.technicien?.employe.nomEmploye}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          {int.controles.length} MATÉRIELS
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       {isPending ? (
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
                       <Link href="/gestionnaire/assigner" className="text-blue-600 hover:underline font-bold text-xs transition-all">
                          Modifier
                       </Link>
                    </td>
                  </tr>
                );
              })}

              {interventions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    <p>Aucune intervention enregistrée pour ce client.</p>
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

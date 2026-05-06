"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  CalendarIcon,
  Eye, 
  Edit,
  X
} from "lucide-react";
import Link from "next/link";

export default function DashboardInterventionsList({ initialInterventions }: { initialInterventions: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "VALIDATED">("ALL");

  const today = new Date().toDateString();
  const isPending = (i: any) => i.controles.length === 0 || i.controles.some((c: any) => c.tempsPasse === null);

  const filteredInterventions = useMemo(() => {
    let result = [...initialInterventions];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(i => 
        i.client.raisonSociale.toLowerCase().includes(s) || 
        String(i.client.numeroClient).includes(s)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(i => {
        const pending = isPending(i);
        return statusFilter === "PENDING" ? pending : !pending;
      });
    }

    return result.slice(0, 5); // Toujours limiter à 5 sur le dashboard
  }, [initialInterventions, search, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Mini Search & Filters */}
      <div className="px-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Filtrer client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={() => setStatusFilter(statusFilter === "PENDING" ? "ALL" : "PENDING")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${statusFilter === "PENDING" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
                <Clock className="h-3.5 w-3.5" />
                En attente
            </button>
            <button 
                onClick={() => setStatusFilter(statusFilter === "VALIDATED" ? "ALL" : "VALIDATED")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${statusFilter === "VALIDATED" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Validées
            </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto border-t border-slate-100 mt-2">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Adresse</th>
              <th className="px-6 py-4 font-semibold">Date & Heure</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInterventions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-slate-200" />
                    <p>Aucun résultat correspondant.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInterventions.map((intervention) => {
                const pending = isPending(intervention);
                const isToday = new Date(intervention.dateVisite).toDateString() === today;
                
                return (
                  <tr key={intervention.numeroIntervent} className="hover:bg-slate-50/50 transition-colors group">
                    <td className={`px-6 py-4 border-l-4 ${pending ? "border-l-yellow-400" : "border-l-emerald-500"}`}>
                      <div className="font-bold text-slate-900">{intervention.client.raisonSociale}</div>
                      <div className="text-slate-400 text-xs mt-0.5">#CLI-{String(intervention.client.numeroClient).padStart(5, '0')}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {intervention.client.adresse}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>
                        {isToday ? "Aujourd'hui" : new Date(intervention.dateVisite).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        {new Date(intervention.heureVisite).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {pending ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full text-yellow-700 bg-yellow-100">En attente</span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full text-emerald-700 bg-emerald-100">Validée</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link href={`/technicien/interventions/${intervention.numeroIntervent}`} className="text-secondary hover:text-secondary/80 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                          {pending ? <><Edit className="h-4 w-4" /> Compléter</> : <><Eye className="h-4 w-4" /> Voir</>}
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

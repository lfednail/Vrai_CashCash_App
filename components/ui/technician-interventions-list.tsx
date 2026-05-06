"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  CalendarDays, 
  Eye, 
  Edit,
  ChevronDown,
  X,
  ArrowUpDown
} from "lucide-react";
import Link from "next/link";

interface Intervention {
  numeroIntervent: number;
  dateVisite: string | Date;
  heureVisite: string | Date;
  client: {
    raisonSociale: string;
    adresse: string;
  };
  controles: {
    tempsPasse: number | null;
  }[];
}

export default function TechnicianInterventionsList({ initialInterventions }: { initialInterventions: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "VALIDATED">("ALL");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const isPending = (i: any) => i.controles.length === 0 || i.controles.some((c: any) => c.tempsPasse === null);

  const filteredInterventions = useMemo(() => {
    let result = [...initialInterventions];

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(i => 
        i.client.raisonSociale.toLowerCase().includes(s) || 
        String(i.numeroIntervent).includes(s)
      );
    }

    // Status
    if (statusFilter !== "ALL") {
      result = result.filter(i => {
        const pending = isPending(i);
        return statusFilter === "PENDING" ? pending : !pending;
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.dateVisite).getTime();
      const dateB = new Date(b.dateVisite).getTime();
      return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [initialInterventions, search, statusFilter, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Rechercher un client ou un numéro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === "ALL" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Tous
            </button>
            <button 
              onClick={() => setStatusFilter("PENDING")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === "PENDING" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              En attente
            </button>
            <button 
              onClick={() => setStatusFilter("VALIDATED")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === "VALIDATED" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Validées
            </button>
          </div>

          <button 
            onClick={() => setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">{sortOrder === "DESC" ? "Plus récent" : "Plus ancien"}</span>
          </button>
        </div>
      </div>

      {/* Table */}
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
              {filteredInterventions.map((intervention) => {
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
                       <div className="text-xs text-slate-500">{new Date(intervention.heureVisite).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</div>
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

              {filteredInterventions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <Search className="h-12 w-12 text-slate-200" />
                       <p className="text-slate-500 font-medium">Aucun résultat trouvé pour votre recherche.</p>
                       <button onClick={() => {setSearch(""); setStatusFilter("ALL");}} className="text-blue-600 text-sm font-bold hover:underline">Réinitialiser les filtres</button>
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

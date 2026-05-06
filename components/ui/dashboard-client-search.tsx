"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Building2, MapPin, X, User, Package, History, ExternalLink, Loader2 } from "lucide-react";
import { searchClients } from "@/app/actions/client.actions";
import Link from "next/link";

export default function DashboardClientSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        setIsOpen(true);
        try {
          const data = await searchClients(query);
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Nom de l'entreprise, numéro ou SIREN..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </div>
          )}
          {query && !loading && (
            <button 
              onClick={() => {setQuery(""); setResults([]); setIsOpen(false);}}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute z-[60] mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {results.map((client) => (
                <button
                  key={client.numeroClient}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{client.raisonSociale}</div>
                      <div className="text-[10px] text-slate-400 font-mono">#CLI-{String(client.numeroClient).padStart(5, '0')}</div>
                    </div>
                  </div>
                  <div className="text-slate-300 group-hover:text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : !loading && (
            <div className="p-8 text-center text-slate-500 text-sm italic">
              Aucun client trouvé pour "{query}"
            </div>
          )}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">{selectedClient.raisonSociale}</h2>
                    <p className="text-xs text-slate-400 font-mono">#CLI-{String(selectedClient.numeroClient).padStart(5, '0')}</p>
                  </div>
               </div>
               <button 
                onClick={() => setSelectedClient(null)}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
               >
                 <X className="h-5 w-5" />
               </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-3 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-slate-800 mb-1">Adresse de maintenance</div>
                  {selectedClient.adresse}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Package className="h-3.5 w-3.5" />
                      Matériels ({selectedClient.materiels.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                       {selectedClient.materiels.map((m: any) => (
                         <span key={m.numeroSerie} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                            {m.typeMateriel.libelleTypeMateriel}
                         </span>
                       ))}
                       {selectedClient.materiels.length === 0 && <span className="text-xs text-slate-400 italic">Aucun matériel répertorié</span>}
                    </div>
                 </div>

                 <div className="p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <History className="h-3.5 w-3.5" />
                      Interventions ({selectedClient.interventions.length})
                    </div>
                    {selectedClient.interventions.length > 0 ? (
                      <div className="text-xs text-slate-500">
                        Dernière le {new Date(selectedClient.interventions[0].dateVisite).toLocaleDateString("fr-FR")}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">Aucun historique</div>
                    )}
                 </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Link 
                  href={`/technicien/clients/${selectedClient.numeroClient}`}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-center transition-colors shadow-lg shadow-primary/20"
                >
                  Voir le profil complet
                </Link>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

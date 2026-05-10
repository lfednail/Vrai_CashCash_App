"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTechnicien } from "@/app/actions/gestionnaire.actions";

export default function DeleteTechButton({ matricule, nom }: { matricule: string, nom: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTechnicien(matricule);
      setShowConfirm(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression. Le technicien a peut-être des interventions associées.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
        title="Supprimer le technicien"
      >
        {loading ? (
          <div className="h-4 w-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Supprimer le technicien</h3>
                  </div>
                </div>
                <button 
                  onClick={() => !loading && setShowConfirm(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mb-6">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer définitivement le technicien <strong className="text-slate-800 font-bold">{nom}</strong> ?
                  <br /><br />
                  <span className="text-xs text-red-500 flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5" /> L'accès de cet employé sera révoqué.
                  </span>
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {loading ? "Suppression..." : "Confirmer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

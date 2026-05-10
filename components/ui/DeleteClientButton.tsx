"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteClient } from "@/app/actions/gestionnaire.actions";

export default function DeleteClientButton({ clientId, clientName }: { clientId: number, clientName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteClient(clientId);
      setShowConfirm(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
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
        title="Supprimer le client"
      >
        {loading ? (
          <div className="h-4 w-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <button 
                  onClick={() => !loading && setShowConfirm(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">Supprimer le client</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Êtes-vous sûr de vouloir supprimer définitivement le client <strong className="text-slate-800">{clientName}</strong> ? Toutes les données associées, y compris les contrats et les matériels, seront perdues. Cette action est irréversible.
              </p>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {loading ? "Suppression..." : "Oui, supprimer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

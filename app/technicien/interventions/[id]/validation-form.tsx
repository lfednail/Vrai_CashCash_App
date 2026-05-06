"use client";

import { useState } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import { validateIntervention } from "@/app/actions/intervention.actions";
import { Package, Clock, MessageSquare, CheckCircle2, FileDown, Loader2 } from "lucide-react";
import { generateInterventionPDF } from "@/lib/pdf-utils";

/**
 * Composant de formulaire pour la validation d'une intervention par un technicien.
 * 
 * @module InterventionValidationForm
 * @description Permet la saisie des temps passés et commentaires pour chaque matériel
 * rattaché à une intervention. Génère également un rapport PDF.
 * 
 * Conforme aux spécifications VDEV :
 * - Modèle MVC (Couche Vue)
 * - Code commenté
 * - Interface responsive (Tailwind CSS)
 */
export default function InterventionValidationForm({ intervention }: { intervention: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useNextRouter();

  /**
   * État local pour stocker les saisies des contrôles.
   */
  const [formState, setFormState] = useState(
    intervention.controles.map((c: any) => ({
      numeroSerieMateriel: c.numeroSerieMateriel,
      tempsPasse: c.tempsPasse || 0,
      commentaire: c.commentaire || "",
    }))
  );

  /**
   * Gère la modification des champs de saisie.
   * @param {number} index - Index du matériel dans la liste
   * @param {string} field - Nom du champ (tempsPasse ou commentaire)
   * @param {any} value - Nouvelle valeur
   */
  const handleInputChange = (index: number, field: string, value: any) => {
    const newState = [...formState];
    newState[index] = { ...newState[index], [field]: value };
    setFormState(newState);
  };

  /**
   * Soumet les données au serveur via une Server Action (Contrôleur).
   * @async
   */
  const onSubmit = async () => {
    setLoading(true);
    try {
      await validateIntervention(intervention.numeroIntervent, formState);
      setSuccess(true);
      router.refresh();
    } catch (error) {
      alert("Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Génère et télécharge le rapport d'intervention en format PDF.
   */
  const handleDownloadPDF = () => {

      // Fusionner les données du formulaire avec l'objet intervention pour le PDF
      const updatedIntervention = {
          ...intervention,
          controles: intervention.controles.map((c: any) => {
              const state = formState.find((s: any) => s.numeroSerieMateriel === c.numeroSerieMateriel);
              return {
                  ...c,
                  tempsPasse: state?.tempsPasse ?? c.tempsPasse,
                  commentaire: state?.commentaire ?? c.commentaire
              };
          })
      };
      generateInterventionPDF(updatedIntervention);
  };


  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            Contrôle des matériels
          </h2>
          {success && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  <CheckCircle2 className="h-3 w-3" />
                  VALIDE
              </span>
          )}
        </div>

        <div className="divide-y divide-slate-100 p-6 space-y-8">
          {intervention.controles.map((controle: any, index: number) => (
            <div key={controle.numeroSerieMateriel} className={index > 0 ? "pt-8" : ""}>
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-900">{controle.materiel.typeMateriel.libelleTypeMateriel}</h3>
                    <p className="text-xs text-slate-500 font-mono">SN: {controle.numeroSerieMateriel} — {controle.materiel.emplacement}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Temps (min)
                  </label>
                  <input
                    type="number"
                    value={formState[index].tempsPasse}
                    onChange={(e) => handleInputChange(index, "tempsPasse", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Commentaire
                  </label>
                  <textarea
                    rows={2}
                    value={formState[index].commentaire}
                    onChange={(e) => handleInputChange(index, "commentaire", e.target.value)}
                    placeholder="Observations sur le matériel..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 px-6 py-4 flex gap-4 border-t border-slate-100">
          <button
            onClick={onSubmit}
            disabled={loading || success}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 transition-all"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {success ? "Mission validée" : "Enregistrer la validation"}
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={!success}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <FileDown className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>
      
      {!success && (
          <p className="text-center text-xs text-slate-400 italic">
              Vous devez enregistrer la validation avant de pouvoir télécharger la fiche PDF.
          </p>
      )}
    </div>
  );
}

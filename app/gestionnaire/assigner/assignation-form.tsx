"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIntervention } from "@/app/actions/assignation.actions";
import { User, Building2, Calendar, Clock, Package, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function AssignationForm({ clients, technicians }: { clients: any[], technicians: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    matriculeTechnicien: "",
    dateVisite: "",
    heureVisite: "",
    materiels: [] as string[]
  });

  const handleClientChange = (clientId: number) => {
    const client = clients.find(c => c.numeroClient === clientId);
    setSelectedClient(client);
    setFormData({ ...formData, materiels: [] }); // Reset materiels when client changes
  };

  const handleMaterielToggle = (sn: string) => {
    const isSelected = formData.materiels.includes(sn);
    if (isSelected) {
      setFormData({ ...formData, materiels: formData.materiels.filter(item => item !== sn) });
    } else {
      setFormData({ ...formData, materiels: [...formData.materiels, sn] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || formData.materiels.length === 0 || !formData.matriculeTechnicien) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createIntervention({
        numeroClient: selectedClient.numeroClient,
        ...formData
      });
      router.push("/gestionnaire");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Sélection Client */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          Choisir le client
        </label>
        <select 
          onChange={(e) => handleClientChange(parseInt(e.target.value))}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">Sélectionnez un client...</option>
          {clients.map(c => (
            <option key={c.numeroClient} value={c.numeroClient}>{c.raisonSociale}</option>
          ))}
        </select>
        
        {selectedClient && (
          <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Matériels sous contrat ({selectedClient.materiels.length})</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedClient.materiels.map((m: any) => (
                <label key={m.numeroSerie} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.materiels.includes(m.numeroSerie) ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.materiels.includes(m.numeroSerie)}
                    onChange={() => handleMaterielToggle(m.numeroSerie)}
                  />
                  <Package className={`h-4 w-4 ${formData.materiels.includes(m.numeroSerie) ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{m.numeroSerie}</p>
                    <p className="text-slate-500 capitalize">{m.emplacement.toLowerCase()}</p>
                  </div>
                </label>
              ))}
            </div>
            {selectedClient.materiels.length === 0 && (
              <p className="text-xs text-red-500 italic">Ce client n'a aucun matériel sous contrat valide.</p>
            )}
          </div>
        )}
      </div>

      {/* Technicien & Planning */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            Technicien
          </label>
          <select 
            value={formData.matriculeTechnicien}
            onChange={(e) => setFormData({...formData, matriculeTechnicien: e.target.value})}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Affecter à...</option>
            {technicians.map(t => (
              <option key={t.matricule} value={t.matricule}>{t.employe.prenomEmploye} {t.employe.nomEmploye} ({t.qualification})</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            Date & Heure
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="date"
              value={formData.dateVisite}
              onChange={(e) => setFormData({...formData, dateVisite: e.target.value})}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input 
              type="time"
              value={formData.heureVisite}
              onChange={(e) => setFormData({...formData, heureVisite: e.target.value})}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-base font-bold text-white shadow-lg hover:bg-slate-800 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
        {loading ? "Création en cours..." : "Confirmer l'assignation"}
      </button>
    </form>
  );
}

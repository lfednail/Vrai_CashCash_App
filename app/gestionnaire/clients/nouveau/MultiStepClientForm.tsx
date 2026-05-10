"use client";

import { useState } from "react";
import { 
  Building2, MapPin, Phone, Mail, 
  ChevronRight, ChevronLeft, Plus, Trash2, 
  Package, FileText, Save, CheckCircle2,
  Calendar, Tag, DollarSign, FileCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createFullClient, updateClient } from "@/app/actions/gestionnaire.actions";

interface MultiStepClientFormProps {
  typeMateriels: any[];
  typeContrats: any[];
  initialData?: any;
}

export default function MultiStepClientForm({ typeMateriels, typeContrats, initialData }: MultiStepClientFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [clientData, setClientData] = useState({
    raisonSociale: initialData?.raisonSociale || "",
    siren: initialData?.siren || "",
    codeApe: initialData?.codeApe || "",
    adresse: initialData?.adresse || "",
    telephoneClient: initialData?.telephoneClient || "",
    email: initialData?.email || "",
    distanceKM: initialData?.distanceKM || 0,
    dureeDeplacement: initialData?.dureeDeplacement || 0,
  });

  const [materiels, setMateriels] = useState<any[]>(initialData?.materiels || []);
  const [contrats, setContrats] = useState<any[]>(initialData?.contrats || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<"MAT" | "CON" | null>(null);

  // Temporary state for adding a new material
  const [newMat, setNewMat] = useState({
    numeroSerie: "",
    dateVente: new Date().toISOString().split('T')[0],
    dateInstallation: new Date().toISOString().split('T')[0],
    prixVente: 0,
    emplacement: "",
    referenceInterneTypeMateriel: typeMateriels[0]?.referenceInterne || "",
  });

  // Temporary state for adding a new contract
  const [newContrat, setNewContrat] = useState({
    dateSignature: new Date().toISOString().split('T')[0],
    dateEcheance: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    refTypeContrat: typeContrats[0]?.refTypeContrat || "",
  });

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({ 
      ...prev, 
      [name]: name === "distanceKM" || name === "dureeDeplacement" ? Number(value) : value 
    }));
  };

  const addMateriel = () => {
    if (!newMat.numeroSerie) return;
    
    if (editingType === "MAT" && editingIndex !== null) {
      const updated = [...materiels];
      updated[editingIndex] = newMat;
      setMateriels(updated);
      setEditingIndex(null);
      setEditingType(null);
    } else {
      setMateriels(prev => [...prev, newMat]);
    }

    setNewMat({
      numeroSerie: "",
      dateVente: new Date().toISOString().split('T')[0],
      dateInstallation: new Date().toISOString().split('T')[0],
      prixVente: 0,
      emplacement: "",
      referenceInterneTypeMateriel: typeMateriels[0]?.referenceInterne || "",
    });
  };

  const editMateriel = (index: number) => {
    setNewMat(materiels[index]);
    setEditingIndex(index);
    setEditingType("MAT");
  };

  const removeMateriel = (index: number) => {
    setMateriels(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index && editingType === "MAT") {
      setEditingIndex(null);
      setEditingType(null);
      setNewMat({
        numeroSerie: "",
        dateVente: new Date().toISOString().split('T')[0],
        dateInstallation: new Date().toISOString().split('T')[0],
        prixVente: 0,
        emplacement: "",
        referenceInterneTypeMateriel: typeMateriels[0]?.referenceInterne || "",
      });
    }
  };

  const addContrat = () => {
    if (!newContrat.refTypeContrat) return;

    if (editingType === "CON" && editingIndex !== null) {
      const updated = [...contrats];
      updated[editingIndex] = newContrat;
      setContrats(updated);
      setEditingIndex(null);
      setEditingType(null);
    } else {
      setContrats(prev => [...prev, newContrat]);
    }

    setNewContrat({
      dateSignature: new Date().toISOString().split('T')[0],
      dateEcheance: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      refTypeContrat: typeContrats[0]?.refTypeContrat || "",
    });
  };

  const editContrat = (index: number) => {
    setNewContrat(contrats[index]);
    setEditingIndex(index);
    setEditingType("CON");
  };

  const removeContrat = (index: number) => {
    setContrats(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index && editingType === "CON") {
      setEditingIndex(null);
      setEditingType(null);
      setNewContrat({
        dateSignature: new Date().toISOString().split('T')[0],
        dateEcheance: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        refTypeContrat: typeContrats[0]?.refTypeContrat || "",
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!clientData.raisonSociale) newErrors.raisonSociale = "Requis";
    if (!clientData.siren) newErrors.siren = "Requis";
    if (!clientData.codeApe) newErrors.codeApe = "Requis";
    if (!clientData.adresse) newErrors.adresse = "Requis";
    if (!clientData.telephoneClient) newErrors.telephoneClient = "Requis";
    if (!clientData.email) newErrors.email = "Requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      if (initialData?.numeroClient) {
        await updateClient(initialData.numeroClient, clientData);
      } else {
        await createFullClient(clientData, materiels, contrats);
      }
      router.push("/gestionnaire/clients");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: "Informations Client", icon: Building2 },
    { id: 2, name: "Parc Matériel", icon: Package },
    { id: 3, name: "Contrats Actifs", icon: FileCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center shrink-0">
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all border ${
              step === s.id 
                ? "bg-white border-slate-200 shadow-sm text-slate-900" 
                : step > s.id 
                  ? "bg-slate-50 border-transparent text-slate-500" 
                  : "bg-transparent border-transparent text-slate-400"
            }`}>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                step === s.id ? 'bg-primary/10 text-primary' : step > s.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span className="text-sm font-bold whitespace-nowrap">{s.name}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-2 ${step > s.id ? "bg-emerald-200" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
        {/* Step 1: Client Info */}
        {step === 1 && (
          <div className="p-8 space-y-6 flex-1">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Building2 className="h-4 w-4 text-primary" /> Détails de l'entreprise
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Raison Sociale</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    name="raisonSociale" 
                    value={clientData.raisonSociale}
                    onChange={handleClientChange}
                    required 
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.raisonSociale ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                    placeholder="Ex: CashCash France" 
                  />
                  {errors.raisonSociale && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">Requis</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SIREN</label>
                <input 
                  name="siren" 
                  value={clientData.siren}
                  onChange={handleClientChange}
                  required 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm" 
                  placeholder="123 456 789" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Code APE</label>
                <input 
                  name="codeApe" 
                  value={clientData.codeApe}
                  onChange={handleClientChange}
                  required 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm" 
                  placeholder="6201Z" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    name="email" 
                    type="email" 
                    value={clientData.email}
                    onChange={handleClientChange}
                    required 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm" 
                    placeholder="contact@entreprise.com" 
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adresse</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    name="adresse" 
                    value={clientData.adresse}
                    onChange={handleClientChange}
                    required 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm" 
                    placeholder="123 Rue de la Paix, 75000 Paris" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    name="telephoneClient" 
                    value={clientData.telephoneClient}
                    onChange={handleClientChange}
                    required 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm" 
                    placeholder="01 23 45 67 89" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Distance (KM)</label>
                  <input 
                    name="distanceKM" 
                    type="number" 
                    value={clientData.distanceKM}
                    onChange={handleClientChange}
                    required 
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Durée (min)</label>
                  <input 
                    name="dureeDeplacement" 
                    type="number" 
                    value={clientData.dureeDeplacement}
                    onChange={handleClientChange}
                    required 
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Parc Matériel */}
        {step === 2 && (
          <div className="p-8 space-y-8 flex-1">
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {editingType === "MAT" ? <Save className="h-5 w-5 text-orange-500" /> : <Plus className="h-5 w-5 text-orange-500" />}
                {editingType === "MAT" ? "Modifier le matériel" : "Ajouter un matériel"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Numéro de Série</label>
                  <input 
                    value={newMat.numeroSerie}
                    onChange={(e) => setNewMat({...newMat, numeroSerie: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm" 
                    placeholder="SN-12345"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Type de matériel</label>
                  <select 
                    value={newMat.referenceInterneTypeMateriel}
                    onChange={(e) => setNewMat({...newMat, referenceInterneTypeMateriel: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm"
                  >
                    {typeMateriels.map(t => (
                      <option key={t.referenceInterne} value={t.referenceInterne}>{t.libelleTypeMateriel}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Prix de vente (€)</label>
                  <input 
                    type="number"
                    value={newMat.prixVente}
                    onChange={(e) => setNewMat({...newMat, prixVente: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Emplacement</label>
                  <input 
                    value={newMat.emplacement}
                    onChange={(e) => setNewMat({...newMat, emplacement: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm" 
                    placeholder="Ex: Rez-de-chaussée"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Date Vente</label>
                  <input 
                    type="date"
                    value={newMat.dateVente}
                    onChange={(e) => setNewMat({...newMat, dateVente: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Date Installation</label>
                  <input 
                    type="date"
                    value={newMat.dateInstallation}
                    onChange={(e) => setNewMat({...newMat, dateInstallation: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm" 
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={addMateriel}
                  disabled={!newMat.numeroSerie}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {editingType === "MAT" ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingType === "MAT" ? "Mettre à jour" : "Ajouter au parc"}
                </button>
                {editingType === "MAT" && (
                  <button 
                    onClick={() => {
                      setEditingIndex(null);
                      setEditingType(null);
                      setNewMat({
                        numeroSerie: "",
                        dateVente: new Date().toISOString().split('T')[0],
                        dateInstallation: new Date().toISOString().split('T')[0],
                        prixVente: 0,
                        emplacement: "",
                        referenceInterneTypeMateriel: typeMateriels[0]?.referenceInterne || "",
                      });
                    }}
                    className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-500" /> Matériels à ajouter ({materiels.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materiels.map((mat, i) => (
                  <div key={i} className={`flex items-center justify-between py-3 px-4 bg-white border rounded-xl shadow-sm transition-all ${editingIndex === i && editingType === "MAT" ? "border-orange-200 ring-2 ring-orange-50" : "border-slate-200"}`}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{typeMateriels.find(t => t.referenceInterne === mat.referenceInterneTypeMateriel)?.libelleTypeMateriel}</p>
                        <p className="text-xs text-slate-500 font-mono">SN: {mat.numeroSerie}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => editMateriel(i)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => removeMateriel(i)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {materiels.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Aucun matériel ajouté pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contrats */}
        {step === 3 && (
          <div className="p-8 space-y-8 flex-1">
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {editingType === "CON" ? <Save className="h-5 w-5 text-emerald-500" /> : <Plus className="h-5 w-5 text-emerald-500" />}
                {editingType === "CON" ? "Modifier le contrat" : "Ajouter un contrat"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Type de contrat</label>
                  <select 
                    value={newContrat.refTypeContrat}
                    onChange={(e) => setNewContrat({...newContrat, refTypeContrat: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm shadow-sm"
                  >
                    {typeContrats.map(t => (
                      <option key={t.refTypeContrat} value={t.refTypeContrat}>{t.refTypeContrat} ({t.tauxApplicable}%)</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Date Signature</label>
                  <input 
                    type="date"
                    value={newContrat.dateSignature}
                    onChange={(e) => setNewContrat({...newContrat, dateSignature: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm shadow-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Date Échéance</label>
                  <input 
                    type="date"
                    value={newContrat.dateEcheance}
                    onChange={(e) => setNewContrat({...newContrat, dateEcheance: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm shadow-sm" 
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={addContrat}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {editingType === "CON" ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingType === "CON" ? "Mettre à jour" : "Ajouter le contrat"}
                </button>
                {editingType === "CON" && (
                  <button 
                    onClick={() => {
                      setEditingIndex(null);
                      setEditingType(null);
                      setNewContrat({
                        dateSignature: new Date().toISOString().split('T')[0],
                        dateEcheance: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                        refTypeContrat: typeContrats[0]?.refTypeContrat || "",
                      });
                    }}
                    className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-500" /> Contrats à créer ({contrats.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contrats.map((c, i) => (
                  <div key={i} className={`flex items-center justify-between py-3 px-4 bg-emerald-50/50 border rounded-xl shadow-sm transition-all ${editingIndex === i && editingType === "CON" ? "border-emerald-300 ring-2 ring-emerald-100" : "border-emerald-100"}`}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900 text-sm">Contrat: {c.refTypeContrat}</p>
                        <p className="text-xs text-emerald-600">Expire le: {new Date(c.dateEcheance).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => editContrat(i)}
                        className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => removeContrat(i)}
                        className="p-2 text-emerald-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {contrats.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <FileCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Aucun contrat ajouté (optionnel)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1 || loading}
            className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              step === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100 bg-white border border-slate-200 shadow-sm"
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> Précédent
          </button>

          {step < 3 ? (
            <button 
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium shadow-sm hover:bg-primary-hover transition-colors flex items-center gap-2"
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading || !clientData.raisonSociale}
              className="px-8 py-2.5 rounded-xl bg-primary text-white font-medium shadow-sm hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="h-4 w-4" /> Finaliser la création</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

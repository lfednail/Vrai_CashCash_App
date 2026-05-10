"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTechnicien, updateTechnicien } from "@/app/actions/gestionnaire.actions";
import { Save, User, MapPin, Phone, Mail, Award, Calendar, Key, Hash, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface TechnicienFormProps {
  initialData?: any;
}

export default function TechnicienForm({ initialData }: TechnicienFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    matricule: initialData?.matricule || "",
    nomEmploye: initialData?.employe?.nomEmploye || "",
    prenomEmploye: initialData?.employe?.prenomEmploye || "",
    email: initialData?.employe?.email || "",
    mot_de_passe: "", // Seulement en création
    adresseEmploye: initialData?.employe?.adresseEmploye || "",
    dateEmbauche: initialData?.employe?.dateEmbauche ? new Date(initialData.employe.dateEmbauche).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    telephoneMobile: initialData?.telephoneMobile || "",
    qualification: initialData?.qualification || "",
    dateObtention: initialData?.dateObtention ? new Date(initialData.dateObtention).toISOString().split('T')[0] : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.matricule) newErrors.matricule = "Requis";
    else if (!/^[A-Z0-9_-]{3,20}$/i.test(formData.matricule)) newErrors.matricule = "Format invalide";

    if (!formData.nomEmploye) newErrors.nomEmploye = "Requis";
    if (!formData.prenomEmploye) newErrors.prenomEmploye = "Requis";
    
    if (!formData.email) newErrors.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";

    if (!isEditing && !formData.mot_de_passe) newErrors.mot_de_passe = "Requis pour la création";
    else if (!isEditing && formData.mot_de_passe.length < 6) newErrors.mot_de_passe = "Min 6 caractères";

    if (!formData.adresseEmploye) newErrors.adresseEmploye = "Requis";
    if (!formData.dateEmbauche) newErrors.dateEmbauche = "Requis";

    if (!formData.telephoneMobile) newErrors.telephoneMobile = "Requis";
    else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.telephoneMobile)) newErrors.telephoneMobile = "Format français attendu";

    if (!formData.qualification) newErrors.qualification = "Requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await updateTechnicien(initialData.matricule, formData);
      } else {
        await createTechnicien(formData);
      }
      router.push("/gestionnaire/techniciens");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("Unique constraint failed")) {
         setErrors({ matricule: "Ce matricule ou email existe déjà" });
      } else {
         alert("Une erreur est survenue lors de l'enregistrement.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 space-y-8">
        
        {/* Section 1: Informations de compte */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Informations de compte
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Matricule</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  name="matricule" 
                  value={formData.matricule}
                  onChange={handleChange}
                  disabled={isEditing}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.matricule ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-500`}
                  placeholder="Ex: TECH001" 
                />
                {errors.matricule && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.matricule}</p>}
              </div>
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mot de passe provisoire</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    name="mot_de_passe" 
                    type="password"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.mot_de_passe ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                    placeholder="••••••••" 
                  />
                  {errors.mot_de_passe && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.mot_de_passe}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Section 2: Identité & Contact */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Identité & Contact
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prénom</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  name="prenomEmploye" 
                  value={formData.prenomEmploye}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.prenomEmploye ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                  placeholder="Jean" 
                />
                {errors.prenomEmploye && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.prenomEmploye}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  name="nomEmploye" 
                  value={formData.nomEmploye}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.nomEmploye ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                  placeholder="Dupont" 
                />
                {errors.nomEmploye && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.nomEmploye}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email professionnel</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  name="email" 
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                  placeholder="jean.dupont@cashcash.fr" 
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Téléphone mobile</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  name="telephoneMobile" 
                  value={formData.telephoneMobile}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.telephoneMobile ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                  placeholder="06 12 34 56 78" 
                />
                {errors.telephoneMobile && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.telephoneMobile}</p>}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  name="adresseEmploye" 
                  value={formData.adresseEmploye}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.adresseEmploye ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                  placeholder="123 Rue de la Paix, 75000 Paris" 
                />
                {errors.adresseEmploye && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.adresseEmploye}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Section 3: Profil Technique */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" /> Profil Technique
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualification</label>
              <div className="relative">
                <Award className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  name="qualification" 
                  value={formData.qualification}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.qualification ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                  placeholder="Ex: Réseaux & Télécoms" 
                />
                {errors.qualification && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.qualification}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date d'obtention (Diplôme)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="date"
                  name="dateObtention" 
                  value={formData.dateObtention}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date d'embauche</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="date"
                  name="dateEmbauche" 
                  value={formData.dateEmbauche}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.dateEmbauche ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm`}
                />
                {errors.dateEmbauche && <p className="text-[10px] text-red-500 font-bold absolute right-3 top-3.5">{errors.dateEmbauche}</p>}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
        <Link 
          href="/gestionnaire/techniciens"
          className="px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 text-slate-600 hover:bg-slate-100 bg-white border border-slate-200 shadow-sm transition-all"
        >
          <ChevronLeft className="h-4 w-4" /> Annuler
        </Link>

        <button 
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 rounded-xl bg-primary text-white font-medium shadow-sm hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Save className="h-4 w-4" /> {isEditing ? "Enregistrer les modifications" : "Créer le technicien"}</>
          )}
        </button>
      </div>
    </form>
  );
}

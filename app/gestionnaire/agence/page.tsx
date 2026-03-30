import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar, 
  User2,
  Map as MapIcon,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Info,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default async function AgencePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    return <div>Non autorisé</div>;
  }

  const employe = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
    include: {
      agence: {
        include: {
          clients: {
            include: {
              materiels: true,
              contrats: true,
            }
          },
          employes: {
            include: {
              technicien: true
            }
          }
        }
      }
    }
  });

  if (!employe || !employe.agence) return <div className="p-8 text-center text-slate-500">Agence non trouvée</div>;
  const agence = employe.agence;

  // Calculs statistiques
  const totalClients = agence.clients.length;
  const totalTechs = agence.employes.filter(e => e.technicien).length;
  const totalMateriels = agence.clients.reduce((acc, c) => acc + c.materiels.length, 0);
  const totalContrats = agence.clients.reduce((acc, c) => acc + c.contrats.length, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 font-sans antialiased text-slate-600">
      
      {/* Header Institutionnel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
          <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-secondary uppercase tracking-[0.2em] mb-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-secondary" /> Profil Agence Officiel
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                  {agence.nomAgence}
              </h1>
             
          </div>
          <div className="flex gap-4">
              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
                 <ExternalLink className="h-4 w-4" /> Rapport d'Activité
              </button>
          </div>
      </div>

      {/* Overview Cards Style Dashbaord Corporate */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Clients Portefeuille", value: totalClients, icon: Users, color: "text-secondary", border: "border-secondary/20" },
            { label: "Effectif Technicien", value: totalTechs, icon: User2, color: "text-emerald-600", border: "border-emerald-100" },
            { label: "Unités de Parc", value: totalMateriels, icon: Zap, color: "text-orange-600", border: "border-orange-100" },
            { label: "Contrats Actifs", value: totalContrats, icon: TrendingUp, color: "text-purple-600", border: "border-purple-100" },
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col justify-between h-40`}>
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    <stat.icon className={`h-5 w-5 ${stat.color} opacity-40`} />
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-slate-900 leading-none">{stat.value}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded font-bold">Standard OK</span>
                    </div>
                </div>
            </div>
          ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
          {/* Identité Corporate - Colonne Gauche */}
          <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3 text-left">
                          <Building2 className="h-5 w-5 text-secondary" />
                          Configuration Structurelle
                      </h2>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                          Source : RH Central
                      </span>
                  </div>
                  
                  <div className="p-8 grid md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                          <div className="flex gap-4">
                              <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                  <MapPin className="h-5 w-5" />
                              </div>
                              <div className="text-left">
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Adresse de l'Etablissement</label>
                                  <p className="text-sm font-bold text-slate-800 leading-relaxed">{agence.adresseAgence}</p>
                              </div>
                          </div>

                          <div className="flex gap-4">
                              <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                  <Phone className="h-5 w-5" />
                              </div>
                              <div className="text-left">
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contact Standard</label>
                                  <p className="text-sm font-bold text-slate-800 leading-relaxed">{agence.telephoneAgence}</p>
                              </div>
                          </div>

                          <div className="flex gap-4">
                              <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                  <ShieldCheck className="h-5 w-5" />
                              </div>
                              <div className="text-left">
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Identifiant Structurel</label>
                                  <p className="text-sm font-bold text-slate-800 leading-relaxed">Agence ID #{agence.numeroAgence} – Region Nord-Ouest</p>
                              </div>
                          </div>
                      </div>

                      <div className="relative rounded-2xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-center gap-6 overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                             <MapIcon className="h-32 w-32" />
                          </div>
                          
                          <div className="relative z-10 flex items-center gap-4">
                             <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                                <MapIcon className="h-6 w-6 text-white" />
                             </div>
                             <div>
                                <h3 className="text-sm font-bold text-slate-900">Emplacement Stratégique</h3>
                                <p className="text-xs text-slate-500">Activé pour le routage GPS</p>
                             </div>
                          </div>

                          <div className="relative z-10 space-y-3">
                             <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <span className="text-xs font-medium">Couverture Géographique</span>
                                <span className="text-xs font-bold text-slate-900">35 km de rayon</span>
                             </div>
                             <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <span className="text-xs font-medium">Technicien le plus proche</span>
                                <span className="text-xs font-bold text-emerald-600">Disponibilité : OK</span>
                             </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Equipe Overview */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900 text-left">Effectifs de l'Agence</h2>
                      <Link href="/gestionnaire/techniciens" className="text-xs font-extrabold text-secondary hover:text-primary transition-all flex items-center gap-1">
                          LISTE COMPLÈTE <ChevronRight className="h-3 w-3" />
                      </Link>
                  </div>
                  <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-left">
                          <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Techniciens</p>
                          <p className="text-2xl font-bold text-slate-800">{totalTechs}</p>
                      </div>
                      <div className="text-left">
                          <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Gestionnaires</p>
                          <p className="text-2xl font-bold text-slate-800">1</p>
                      </div>
                      <div className="text-left">
                          <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Total Employés</p>
                          <p className="text-2xl font-bold text-slate-800">{agence.employes.length}</p>
                      </div>
                      <div className="text-left">
                          <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Status Bureau</p>
                          <p className="text-sm font-bold text-emerald-600 uppercase">Ouvert</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Quick Actions & Side Stats - Colonne Droite */}
          <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between min-h-[400px]">
                  <div>
                      <h2 className="text-xl font-bold mb-2 text-left">Services Agence</h2>
                      <p className="text-slate-400 font-medium leading-relaxed mb-10 text-left">Outils de pilotage opérationnel.</p>
                      
                      <div className="space-y-4">
                          <Link href="/gestionnaire/assigner" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                                   <Calendar className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold">Planification Missions</span>
                             </div>
                             <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-all" />
                          </Link>

                          <Link href="/gestionnaire/clients" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                                   <Users className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold">CRM & Portefeuille</span>
                             </div>
                             <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-all" />
                          </Link>
                      </div>
                  </div>

                  <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                         </div>
                         <div className="text-left">
                            <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Conformité</p>
                            <p className="text-xs font-bold text-slate-200 italic leading-none">Standard Grade A+</p>
                         </div>
                      </div>
                  </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 text-left">Informations Système</h3>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                         <span className="text-slate-400 font-bold uppercase tracking-widest">Version API</span>
                         <span className="font-bold text-slate-700">v16.2.1-stable</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <span className="text-slate-400 font-bold uppercase tracking-widest">DB Schema</span>
                         <span className="font-bold text-slate-700">Production v4</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2">
                         <span className="text-slate-400 font-bold uppercase tracking-widest">Connexion Siège</span>
                         <span className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="font-bold text-emerald-600">ACTIF</span>
                         </span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          <p>© 2026 CASHCASH AGENTIAL INFRASTRUCTURE</p>
          <div className="flex gap-10">
              <span className="cursor-default hover:text-slate-500 transition-colors">SECURITY AUDITED</span>
              <span className="cursor-default hover:text-slate-500 transition-colors">ISO 9001 COMPLIANT</span>
          </div>
      </div>
    </div>
  );
}

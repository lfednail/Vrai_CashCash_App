import { getClientDetails } from "@/app/actions/client.actions";
import { notFound } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Package, 
  History, 
  ArrowLeft, 
  Clock, 
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Fingerprint
} from "lucide-react";
import Link from "next/link";
import { serializePrisma } from "@/lib/serialization";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const numId = parseInt(id);

  if (isNaN(numId)) notFound();

  const client = await getClientDetails(numId);
  if (!client) notFound();

  const serializedClient = serializePrisma(client);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Link href="/technicien" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{serializedClient.raisonSociale}</h1>
                <div className="flex items-center gap-4 mt-2">
                   <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono font-bold uppercase tracking-wider">
                     ID: #CLI-{String(serializedClient.numeroClient).padStart(5, '0')}
                   </span>
                   <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-mono font-bold uppercase tracking-wider">
                     SIREN: {serializedClient.siren}
                   </span>
                </div>
              </div>
           </div>
           
           <div className="flex flex-col gap-2 text-sm text-slate-500 border-l border-slate-100 pl-6 hidden md:block">
              <div className="flex items-center gap-2">
                 <MapPin className="h-4 w-4" />
                 {serializedClient.adresse}
              </div>
              <div className="flex items-center gap-2">
                 <Fingerprint className="h-4 w-4" />
                 Code APE: {serializedClient.codeApe}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Materials & Info */}
        <div className="lg:col-span-1 space-y-8">
           {/* Contact Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Coordonnées
              </h2>
              <div className="space-y-3">
                 <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                    <span className="text-sm text-slate-600 leading-relaxed">{serializedClient.adresse}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{serializedClient.telephoneClient || "Non renseigné"}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600 font-medium text-primary hover:underline cursor-pointer">{serializedClient.email || "contact@client.fr"}</span>
                 </div>
              </div>
           </div>

           {/* Materials Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Matériels
                </h2>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                  {serializedClient.materiels.length}
                </span>
              </div>
              <div className="space-y-3">
                 {serializedClient.materiels.map((mat: any) => (
                    <div key={mat.numeroSerie} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors">
                       <div className="text-sm font-bold text-slate-800">{mat.typeMateriel.libelleTypeMateriel}</div>
                       <div className="text-[10px] text-slate-400 font-mono mt-0.5">SN: {mat.numeroSerie}</div>
                    </div>
                 ))}
                 {serializedClient.materiels.length === 0 && (
                   <p className="text-xs text-slate-400 italic text-center py-4">Aucun matériel enregistré.</p>
                 )}
              </div>
           </div>
        </div>

        {/* Right Column: Intervention History */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <History className="h-5 w-5 text-slate-400" />
                  Historique des interventions
                </h2>
              </div>
              
              <div className="divide-y divide-slate-100">
                 {serializedClient.interventions.map((int: any) => {
                    const isPending = int.controles.length === 0 || int.controles.some((c: any) => c.tempsPasse === null);
                    const date = new Date(int.dateVisite);
                    
                    return (
                      <div key={int.numeroIntervent} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPending ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"}`}>
                               <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                               <div className="text-sm font-bold text-slate-800">
                                  Intervention du {date.toLocaleDateString("fr-FR")}
                               </div>
                               <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(int.heureVisite).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {isPending ? (
                                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">En attente</span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Validée</span>
                                  )}
                               </div>
                            </div>
                         </div>
                         <Link 
                           href={`/technicien/interventions/${int.numeroIntervent}`}
                           className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all"
                         >
                           {isPending ? "Compléter" : "Voir détails"}
                         </Link>
                      </div>
                    );
                 })}
                 
                 {serializedClient.interventions.length === 0 && (
                   <div className="p-20 text-center space-y-4">
                      <div className="mx-auto h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                        <History className="h-8 w-8" />
                      </div>
                      <p className="text-slate-500 font-medium">Aucune intervention enregistrée pour ce client.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

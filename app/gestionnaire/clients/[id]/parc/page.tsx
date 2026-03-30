import { getClientMaterials } from "@/app/actions/gestionnaire.actions";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, Calendar, FileCheck, Building2, MapPin, Tag } from "lucide-react";
import Link from "next/link";

export default async function ClientParcPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const clientId = parseInt(id);
  if (isNaN(clientId)) notFound();

  const client = await prisma.client.findUnique({ where: { numeroClient: clientId } });
  if (!client) notFound();

  const materials = await getClientMaterials(clientId);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Link href="/gestionnaire/clients" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour au portefeuille
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                <Package className="h-6 w-6" />
             </div>
             <h1 className="text-3xl font-bold text-slate-900">{client.raisonSociale}</h1>
           </div>
           <p className="text-slate-500 flex items-center gap-2 px-1">
             <MapPin className="h-4 w-4" /> {client.adresse}
           </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matériels Installés</p>
           <p className="text-2xl font-black text-slate-900">{materials.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((mat) => (
          <div key={mat.numeroSerie} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Package className="h-12 w-12" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
               <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                  <Tag className="h-5 w-5" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{mat.typeMateriel.libelleTypeMateriel}</h3>
                  <p className="text-xs font-mono text-slate-400">SN: {mat.numeroSerie}</p>
               </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                     <Calendar className="h-3.5 w-3.5" /> Date Installation
                  </span>
                  <span className="font-bold text-slate-700">{new Date(mat.dateInstallation).toLocaleDateString("fr-FR")}</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                     <MapPin className="h-3.5 w-3.5" /> Emplacement
                  </span>
                  <span className="font-bold text-slate-700">{mat.emplacement || "N/A"}</span>
               </div>
               
               <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <FileCheck className="h-4 w-4 text-emerald-500" />
                     <span className="text-xs font-bold text-emerald-700">Contrat {(mat as any).refTypeContrat || "S/A"}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mat.numeroContrat || "SANS CONTRAT"}</span>
               </div>
            </div>
          </div>
        ))}

        {materials.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500 font-medium">Aucun matériel enregistré pour ce client.</p>
          </div>
        )}
      </div>
    </div>
  );
}

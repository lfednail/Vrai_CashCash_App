import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Building2, MapPin, Package, FileCheck, Phone, Mail, Search } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    return <div>Non autorisé</div>;
  }

  // Récupérer l'agence du gestionnaire
  const user = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
    select: { numeroAgence: true },
  });

  if (!user) return <div>Utilisateur non trouvé</div>;

  // Récupérer tous les clients de l'agence avec leurs contrats et matériels
  const clients = await prisma.client.findMany({
    where: { numeroAgence: user.numeroAgence },
    include: {
      contrats: true,
      materiels: {
        include: {
          typeMateriel: true,
        },
      },
    },
    orderBy: { raisonSociale: "asc" },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Portefeuille Clients</h1>
          <p className="text-slate-500 mt-1">Gérez la base clients de votre agence, leurs contrats et parcs matériels.</p>
        </div>
        <Link href="/gestionnaire/clients/nouveau" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-sm hover:bg-primary-hover transition-colors cursor-pointer text-sm">
           <Building2 className="h-4 w-4" /> Ajouter un client
        </Link>
      </div>

      <div className="grid gap-6">
        {clients.map((client) => (
          <div key={client.numeroClient} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 hover:shadow-md transition-shadow">
            {/* Infographie Client */}
            <div className="p-6 md:w-1/3 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                  {client.raisonSociale.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 leading-tight">{client.raisonSociale}</h2>
                  <p className="text-xs text-slate-400 font-mono">SIREN {client.siren}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
                  <span>{client.adresse}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{client.telephoneClient}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{client.email}</span>
                </div>
              </div>
            </div>

            {/* Parc Matériel & Contrats */}
            <div className="p-6 md:w-2/3 flex flex-col justify-between bg-slate-50/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-left">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                     <Package className="h-3.5 w-3.5 text-orange-500" /> Parc Matériel
                   </h3>
                   <div className="space-y-2 text-left">
                     {client.materiels.slice(0, 3).map(mat => (
                       <div key={mat.numeroSerie} className="text-xs flex justify-between items-center py-1.5 px-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                         <span className="font-medium text-slate-700">{mat.typeMateriel.libelleTypeMateriel}</span>
                         <span className="text-slate-400 font-mono">{mat.numeroSerie.slice(-4)}</span>
                       </div>
                     ))}
                     {client.materiels.length > 3 && (
                       <p className="text-[10px] text-slate-400 pl-1">+ {client.materiels.length - 3} autres matériels</p>
                     )}
                     {client.materiels.length === 0 && (
                       <p className="text-xs text-slate-400 italic">Aucun matériel enregistré</p>
                     )}
                   </div>
                </div>

                <div className="text-left">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                     <FileCheck className="h-3.5 w-3.5 text-emerald-500" /> Contrats Actifs
                   </h3>
                   <div className="space-y-2">
                     {client.contrats.map(contrat => (
                       <div key={contrat.numeroContrat} className="text-xs flex justify-between items-center py-1.5 px-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-emerald-800">
                         <span className="font-bold">{contrat.refTypeContrat}</span>
                         <span>Exp. {new Date(contrat.dateEcheance).toLocaleDateString("fr-FR")}</span>
                       </div>
                     ))}
                     {client.contrats.length === 0 && (
                       <p className="text-xs text-slate-400 italic">Aucun contrat actif</p>
                     )}
                   </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3 font-sans">
                 <Link href={`/gestionnaire/clients/${client.numeroClient}/historique`} className="text-xs font-bold text-primary hover:underline flex items-center">
                   Voir l'historique complet
                 </Link>
                 <Link href={`/gestionnaire/clients/${client.numeroClient}/parc`} className="text-xs font-bold text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                   Détails du parc
                 </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

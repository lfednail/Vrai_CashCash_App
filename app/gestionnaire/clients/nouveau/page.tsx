import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTypeMateriels, getTypeContrats } from "@/app/actions/gestionnaire.actions";
import MultiStepClientForm from "./MultiStepClientForm";

export default async function NouveauClientPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    redirect("/login");
  }

  // Récupérer les données nécessaires pour le formulaire
  const [typeMateriels, typeContrats] = await Promise.all([
    getTypeMateriels(),
    getTypeContrats(),
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Nouveau Client</h1>
          <p className="text-slate-500 mt-1">Enregistrez une nouvelle entreprise, ses équipements et ses contrats.</p>
        </div>
        <Link href="/gestionnaire/clients" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors cursor-pointer text-sm">
           <ArrowLeft className="h-4 w-4" /> Retour au portefeuille
        </Link>
      </div>

      <MultiStepClientForm 
        typeMateriels={typeMateriels} 
        typeContrats={typeContrats} 
      />
    </div>
  );
}

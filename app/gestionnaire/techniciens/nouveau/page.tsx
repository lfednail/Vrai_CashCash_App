import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TechnicienForm from "../TechnicienForm";

export default async function NouveauTechnicienPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    redirect("/login");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Nouveau Technicien</h1>
            <p className="text-slate-500 mt-1">Ajoutez un nouvel expert technique à votre agence.</p>
          </div>
        </div>
        <Link href="/gestionnaire/techniciens" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors cursor-pointer text-sm">
           <ArrowLeft className="h-4 w-4" /> Retour à l'équipe
        </Link>
      </div>

      <TechnicienForm />
    </div>
  );
}

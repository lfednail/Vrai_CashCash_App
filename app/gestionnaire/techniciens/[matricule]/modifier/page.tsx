import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TechnicienForm from "../../TechnicienForm";

export default async function ModifierTechnicienPage({ params }: { params: Promise<{ matricule: string }> }) {
  const { matricule } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    redirect("/login");
  }

  // Vérification de sécurité supplémentaire : s'assurer que le technicien appartient bien à l'agence du gestionnaire
  const user = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
  });

  if (!user) return <div>Non autorisé</div>;

  const technicien = await prisma.technicien.findUnique({
    where: { matricule: matricule },
    include: {
      employe: true,
    },
  });

  if (!technicien || technicien.employe.numeroAgence !== user.numeroAgence) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Technicien introuvable</h1>
        <p className="text-slate-500 mb-8">Ce technicien n'existe pas ou n'appartient pas à votre agence.</p>
        <Link href="/gestionnaire/techniciens" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium shadow-sm hover:bg-primary-hover transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Modifier un Technicien</h1>
            <p className="text-slate-500 mt-1">Mise à jour des informations de {technicien.employe.prenomEmploye} {technicien.employe.nomEmploye}.</p>
          </div>
        </div>
        <Link href="/gestionnaire/techniciens" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors cursor-pointer text-sm">
           <ArrowLeft className="h-4 w-4" /> Retour à l'équipe
        </Link>
      </div>

      <TechnicienForm initialData={technicien} />
    </div>
  );
}

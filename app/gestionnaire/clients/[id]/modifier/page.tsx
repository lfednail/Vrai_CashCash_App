import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getTypeMateriels, getTypeContrats } from "@/app/actions/gestionnaire.actions";
import MultiStepClientForm from "../../nouveau/MultiStepClientForm";

export default async function ModifierClientPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    redirect("/login");
  }

  const { id } = await params;
  const clientId = parseInt(id);
  if (isNaN(clientId)) notFound();

  // Récupérer le client avec ses données
  const client = await prisma.client.findUnique({
    where: { numeroClient: clientId },
    include: {
      materiels: true,
      contrats: true,
    },
  });

  if (!client) notFound();

  const [typeMateriels, typeContrats] = await Promise.all([
    getTypeMateriels(),
    getTypeContrats(),
  ]);

  const serializedClient = {
    ...client,
    materiels: client.materiels.map(m => ({
      ...m,
      prixVente: m.prixVente.toNumber()
    }))
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <Link href="/gestionnaire/clients" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Modifier Client</h1>
          <p className="text-slate-400 text-sm">Mise à jour des informations de {client.raisonSociale}.</p>
        </div>
      </div>

      <MultiStepClientForm 
        typeMateriels={typeMateriels} 
        typeContrats={typeContrats} 
        initialData={serializedClient}
      />
    </div>
  );
}

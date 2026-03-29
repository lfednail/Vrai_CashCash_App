import prisma from "@/lib/prisma";
import { getTechnicianInterventions } from "@/app/actions/intervention.actions";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/navbar";
import { ArrowLeft, MapPin, Building2, Package, History } from "lucide-react";
import Link from "next/link";
import InterventionValidationForm from "@/app/technicien/interventions/[id]/validation-form";

export default async function InterventionDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const numId = parseInt(id);

  if (isNaN(numId)) notFound();

  const intervention = await prisma.intervention.findUnique({
    where: { numeroIntervent: numId },
    include: {
      client: true,
      controles: {
        include: {
          materiel: {
            include: {
                typeMateriel: true
            }
          },
        },
      },
      technicien: {
          include: {
              employe: true
          }
      }
    },
  });

  if (!intervention) notFound();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/technicien" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour aux interventions
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Client & Intervention Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Informations Client</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    {intervention.client.raisonSociale}
                  </div>
                  <p className="mt-2 text-sm text-slate-500 flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    {intervention.client.adresse}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                    <span>SIREN: {intervention.client.siren}</span>
                    <span>APE: {intervention.client.codeApe}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Détails Mission</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Date prévue</span>
                        <span className="font-medium text-slate-900">{new Date(intervention.dateVisite).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Heure de visite</span>
                        <span className="font-medium text-slate-900">{intervention.heureVisite.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Validation Form & Materials */}
          <div className="lg:col-span-2">
            <InterventionValidationForm intervention={intervention} />
          </div>
        </div>
      </main>
    </div>
  );
}

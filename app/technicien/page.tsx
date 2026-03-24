import { getTechnicianInterventions } from "@/app/actions/intervention.actions";
import { ClipboardList, Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";

export default async function TechnicienDashboard() {
  const interventions = await getTechnicianInterventions();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Mes Interventions</h1>
          <p className="text-slate-500">Consultez et validez vos missions du jour</p>
        </header>

        <div className="space-y-4">
          {interventions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">Aucune intervention</h3>
              <p className="mt-1 text-slate-500">Vous n'avez pas d'interventions assignées actuellement.</p>
            </div>
          ) : (
            interventions.map((intervention) => (
              <div
                key={intervention.numeroIntervent}
                className="group relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Intervention #{intervention.numeroIntervent}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {intervention.client.raisonSociale}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(intervention.dateVisite).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {intervention.heureVisite.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {intervention.client.adresse}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/technicien/intervention/${intervention.numeroIntervent}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                    >
                      Détails
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Matériels à contrôler ({intervention.controles.length})
                  </div>
                  <ul className="mt-2 divide-y divide-slate-50">
                    {intervention.controles.map((c) => (
                      <li key={c.numeroSerieMateriel} className="py-2 text-sm text-slate-600">
                        {c.materiel.numeroSerie} — {c.materiel.emplacement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

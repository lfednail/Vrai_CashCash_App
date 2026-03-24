import { authOptions } from "@/lib/auth";
import { getGestionnaireStats } from "@/app/actions/gestionnaire.actions";
import { getTechniciansByAgency } from "@/app/actions/gestionnaire.actions";
import Navbar from "@/components/ui/navbar";
import { 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  MapPin, 
  Clock, 
  CalendarDays,
  Activity
} from "lucide-react";

export default async function GestionnaireDashboard() {
  const stats = await getGestionnaireStats();
  const technicians = await getTechniciansByAgency();

  const cards = [
    {
      title: "Interventions ce mois",
      value: stats.total_interventions,
      icon: ClipboardCheck,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Distance totale parcourue",
      value: `${stats.distance_parcourue_km} km`,
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Temps total d'intervention",
      value: `${Math.floor(stats.temps_total_minutes / 60)}h ${stats.temps_total_minutes % 60}m`,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      title: "Techniciens actifs",
      value: technicians.length,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tableau de bord Gestionnaire</h1>
            <p className="text-slate-500">Aperçu de l'activité de votre agence pour le mois en cours</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date())}
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg ${card.bg} p-2`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Active Technicians List */}
          <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <Users className="h-4 w-4" />
                    Techniciens de l'agence
                </div>
            </div>
            <div className="divide-y divide-slate-100">
              {technicians.length === 0 ? (
                <p className="p-6 text-sm text-center text-slate-500">Aucun technicien enregistré</p>
              ) : (
                technicians.map((tech: any) => (
                  <div key={tech.matricule} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                            {tech.employe.prenomEmploye[0]}{tech.employe.nomEmploye[0]}
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-slate-900">{tech.employe.prenomEmploye} {tech.employe.nomEmploye}</p>
                            <p className="text-xs text-slate-500">{tech.qualification}</p>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                        {tech.matricule}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Placeholder / Charts */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Evolution des interventions
                </h3>
                <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">Derniers 7 jours</span>
            </div>
            
            <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-slate-100 bg-slate-50/30">
              <div className="text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-slate-200" />
                <p className="mt-2 text-sm text-slate-400 italic">Graphiques bientôt disponibles (Chart.js)</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
